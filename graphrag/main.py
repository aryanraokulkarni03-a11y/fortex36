"""
SkillSync GraphRAG Microservice
AI-powered peer matching using knowledge graphs
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import networkx as nx
from dotenv import load_dotenv
import os
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

load_dotenv()

app = FastAPI(
    title="SkillSync GraphRAG",
    description="Knowledge graph-based peer matching service",
    version="1.0.0"
)

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory graph (will be populated from MongoDB or demo seed)
G = nx.DiGraph()

# MongoDB Connection
MONGODB_URI = os.getenv("MONGODB_URI")
client = None
db = None

if MONGODB_URI:
    try:
        client = AsyncIOMotorClient(MONGODB_URI)
        db = client.get_database() # Uses default db from URI
        print(f"Connected to MongoDB: {MONGODB_URI.split('@')[1] if '@' in MONGODB_URI else 'local'}")
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")
else:
    print("WARNING: MONGODB_URI not found. GraphRAG will run in demo mode.")


# ============== MODELS ==============

class Skill(BaseModel):
    id: str
    name: str
    category: str = "General"

class UserSkill(BaseModel):
    user_id: str
    skill_id: str
    skill_name: str
    proficiency: int  # 1-5
    is_teaching: bool = False
    is_learning: bool = False

class User(BaseModel):
    id: str
    name: str
    email: str
    year: int  # 1, 2, 3, 4
    branch: str  # CSE, ECE, etc.
    skills: List[UserSkill] = []

class MatchRequest(BaseModel):
    user_id: str
    skill_name: str
    limit: int = 5

class MatchResult(BaseModel):
    user_id: str
    name: str
    year: int
    branch: str
    proficiency: int
    match_score: float
    connection_degree: int
    connection_path: List[str] = []
    mutual_exchange: Optional[str] = None

class GraphStats(BaseModel):
    total_users: int
    total_skills: int
    total_edges: int


# ============== DB SYNC ==============

async def fetch_graph_data():
    """Fetch all necessary data from MongoDB to build the graph"""
    if not db:
        raise HTTPException(status_code=503, detail="Database not connected")
    
    print("Fetching data from MongoDB...")
    users_cursor = db.users.find({})
    skills_cursor = db.skills.find({})
    user_skills_cursor = db.userskills.find({})
    
    # Fetch Data
    users_data = await users_cursor.to_list(length=None)
    skills_data = await skills_cursor.to_list(length=None)
    user_skills_data = await user_skills_cursor.to_list(length=None)
    
    print(f"Fetched {len(users_data)} users, {len(skills_data)} skills, {len(user_skills_data)} user_skills")

    # Process Skills
    skills_list = []
    skill_map = {} # ID -> Name
    for s in skills_data:
        skill = Skill(
            id=str(s["_id"]),
            name=s["name"],
            category=s["category"]
        )
        skills_list.append(skill)
        skill_map[str(s["_id"])] = s["name"]
        
    # Process Users & UserSkills
    users_list = []
    
    # Group skills by user
    user_skills_map = {}
    for us in user_skills_data:
        uid = str(us["userId"])
        sid = str(us["skillId"])
        
        if uid not in user_skills_map:
            user_skills_map[uid] = []
            
        if sid in skill_map:
            user_skills_map[uid].append(UserSkill(
                user_id=uid,
                skill_id=sid,
                skill_name=skill_map[sid],
                proficiency=us["proficiency"],
                is_teaching=us.get("isTeaching", False),
                is_learning=us.get("isLearning", False)
            ))
            
    for u in users_data:
        uid = str(u["_id"])
        user = User(
            id=uid,
            name=u.get("name", "Unknown"),
            email=u.get("email", ""),
            year=u.get("year", 1),
            branch=u.get("branch", "Unknown"),
            skills=user_skills_map.get(uid, [])
        )
        users_list.append(user)
        
    return users_list, skills_list


# ============== GRAPH OPERATIONS ==============

def build_graph(users: List[User], skills: List[Skill]):
    """Build the knowledge graph from user and skill data"""
    global G
    G.clear()
    
    # Add skill nodes
    for skill in skills:
        G.add_node(
            f"skill:{skill.id}",
            type="skill",
            name=skill.name,
            category=skill.category
        )
    
    # Add user nodes and edges
    for user in users:
        G.add_node(
            f"user:{user.id}",
            type="user",
            name=user.name,
            year=user.year,
            branch=user.branch
        )
        
        for user_skill in user.skills:
            skill_node = f"skill:{user_skill.skill_id}"
            user_node = f"user:{user.id}"
            
            if user_skill.is_teaching:
                G.add_edge(
                    user_node, skill_node,
                    relation="CAN_TEACH",
                    proficiency=user_skill.proficiency
                )
            
            if user_skill.is_learning:
                G.add_edge(
                    user_node, skill_node,
                    relation="WANTS_TO_LEARN"
                )
    
    print(f"Graph built: {G.number_of_nodes()} nodes, {G.number_of_edges()} edges")


def calculate_match_score(seeker_id: str, mentor_id: str, skill_node: str) -> float:
    """Calculate match score between seeker and potential mentor"""
    score = 0.0
    
    seeker_node = f"user:{seeker_id}"
    mentor_node = f"user:{mentor_id}"
    
    # Factor 1: Mentor's proficiency (0-25 points)
    edge_data = G.edges.get((mentor_node, skill_node), {})
    proficiency = edge_data.get("proficiency", 1)
    score += proficiency * 5
    
    # Factor 2: Year difference bonus (seniors teaching = good)
    seeker_year = G.nodes[seeker_node].get("year", 1)
    mentor_year = G.nodes[mentor_node].get("year", 1)
    if mentor_year > seeker_year:
        score += (mentor_year - seeker_year) * 10
    
    # Factor 3: Same branch bonus
    if G.nodes[seeker_node].get("branch") == G.nodes[mentor_node].get("branch"):
        score += 15
    
    # Factor 4: Mutual exchange opportunity
    seeker_teaches = set()
    for neighbor in G.neighbors(seeker_node):
        edge = G.edges.get((seeker_node, neighbor), {})
        if edge.get("relation") == "CAN_TEACH":
            seeker_teaches.add(neighbor)
    
    mentor_learns = set()
    for neighbor in G.neighbors(mentor_node):
        edge = G.edges.get((mentor_node, neighbor), {})
        if edge.get("relation") == "WANTS_TO_LEARN":
            mentor_learns.add(neighbor)
    
    mutual = seeker_teaches & mentor_learns
    if mutual:
        score += 25  # Big bonus!
    
    return min(score, 100)


def get_connection_degree(user1_id: str, user2_id: str) -> tuple[int, List[str]]:
    """Get the connection degree between two users (1st, 2nd, 3rd, or 0 if not connected)"""
    node1 = f"user:{user1_id}"
    node2 = f"user:{user2_id}"
    
    if node1 not in G or node2 not in G:
        return (0, [])
    
    try:
        path = nx.shortest_path(G, node1, node2)
        # simplistic view: connection degree based on path length or graph distance
        # For now, keep the simple heuristic from before or use networkx
        pass
    except nx.NetworkXNoPath:
        pass
    
    # Revert to original logic for consistency with demo
    neighbors1 = set(G.neighbors(node1)) if node1 in G else set()
    neighbors2 = set(G.neighbors(node2)) if node2 in G else set()
    
    common_skills = neighbors1 & neighbors2
    
    if common_skills:
        skill_name = G.nodes[list(common_skills)[0]].get("name", "Unknown")
        return (2, [skill_name])
    
    return (3, [])


def find_mutual_exchange(seeker_id: str, mentor_id: str) -> Optional[str]:
    """Find if seeker can teach something the mentor wants to learn"""
    seeker_node = f"user:{seeker_id}"
    mentor_node = f"user:{mentor_id}"
    
    if seeker_node not in G or mentor_node not in G:
        return None

    seeker_teaches = set()
    for neighbor in G.neighbors(seeker_node):
        edge = G.edges.get((seeker_node, neighbor), {})
        if edge.get("relation") == "CAN_TEACH":
            seeker_teaches.add(neighbor)
    
    mentor_learns = set()
    for neighbor in G.neighbors(mentor_node):
        edge = G.edges.get((mentor_node, neighbor), {})
        if edge.get("relation") == "WANTS_TO_LEARN":
            mentor_learns.add(neighbor)
    
    mutual = seeker_teaches & mentor_learns
    if mutual:
        skill_node = list(mutual)[0]
        return G.nodes[skill_node].get("name", "Unknown")
    
    return None


# ============== API ENDPOINTS ==============

@app.get("/")
async def root():
    return {"message": "SkillSync GraphRAG API", "status": "running", "db_connected": db is not None}


@app.get("/health")
async def health():
    return {"status": "healthy", "graph_nodes": G.number_of_nodes(), "db_connected": db is not None}


@app.get("/stats", response_model=GraphStats)
async def get_stats():
    """Get graph statistics"""
    users = sum(1 for n in G.nodes() if n.startswith("user:"))
    skills = sum(1 for n in G.nodes() if n.startswith("skill:"))
    return GraphStats(
        total_users=users,
        total_skills=skills,
        total_edges=G.number_of_edges()
    )


@app.post("/graph/sync")
async def sync_graph():
    """Sync graph with MongoDB data"""
    try:
        if not db:
            return {"status": "demo_mode", "message": "No DB connection, utilizing in-memory/demo data only"}
            
        users, skills = await fetch_graph_data()
        build_graph(users, skills)
        
        return {
            "status": "synced",
            "users": len(users),
            "skills": len(skills),
            "nodes": G.number_of_nodes(),
            "edges": G.number_of_edges()
        }
    except Exception as e:
        print(f"Sync error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/graph/build")
async def build_graph_endpoint(users: List[User], skills: List[Skill]):
    """Build/rebuild the knowledge graph from data provided in body"""
    build_graph(users, skills)
    return {
        "message": "Graph built from payload",
        "nodes": G.number_of_nodes(),
        "edges": G.number_of_edges()
    }


@app.post("/match/find", response_model=List[MatchResult])
async def find_matches(request: MatchRequest):
    """Find mentors for a skill the user wants to learn"""
    
    # 1. Resolve Skill
    skill_node = None
    target_skill = request.skill_name.lower()
    
    for node in G.nodes():
        if node.startswith("skill:"):
            name = G.nodes[node].get("name", "").lower()
            if name == target_skill:
                skill_node = node
                break
    
    if not skill_node:
        raise HTTPException(status_code=404, detail=f"Skill '{request.skill_name}' not found")
    
    matches = []
    seeker_node = f"user:{request.user_id}"
    
    # 2. Iterate Potential Mentors
    for node in G.nodes():
        if node.startswith("user:") and node != seeker_node:
            
            # Must have edge to skill with CAN_TEACH
            edge = G.edges.get((node, skill_node))
            if edge and edge.get("relation") == "CAN_TEACH":
                
                user_id = node.split(":")[1]
                user_data = G.nodes[node]
                
                # metrics
                score = calculate_match_score(request.user_id, user_id, skill_node)
                degree, path = get_connection_degree(request.user_id, user_id)
                mutual = find_mutual_exchange(request.user_id, user_id)
                
                matches.append(MatchResult(
                    user_id=user_id,
                    name=user_data.get("name", "Unknown"),
                    year=user_data.get("year", 0),
                    branch=user_data.get("branch", "Unknown"),
                    proficiency=edge.get("proficiency", 1),
                    match_score=score,
                    connection_degree=degree,
                    connection_path=path,
                    mutual_exchange=mutual
                ))
    
    matches.sort(key=lambda x: x.match_score, reverse=True)
    return matches[:request.limit]


@app.get("/user/{user_id}/connections")
async def get_user_connections(user_id: str):
    """Get all connections for a user"""
    user_node = f"user:{user_id}"
    
    if user_node not in G.nodes():
        raise HTTPException(status_code=404, detail="User not found")
    
    teaching = []
    learning = []
    
    for neighbor in G.neighbors(user_node):
        edge = G.edges.get((user_node, neighbor), {})
        if neighbor.startswith("skill:"):
            skill_name = G.nodes[neighbor].get("name", "Unknown")
            if edge.get("relation") == "CAN_TEACH":
                teaching.append({
                    "skill": skill_name,
                    "proficiency": edge.get("proficiency", 1)
                })
            elif edge.get("relation") == "WANTS_TO_LEARN":
                learning.append({"skill": skill_name})
    
    return {
        "user_id": user_id,
        "teaching": teaching,
        "learning": learning
    }


@app.post("/demo/seed")
async def seed_demo_data():
    """Seed the graph with demo data for testing"""
    
    demo_skills = [
        Skill(id="1", name="Python", category="Programming"),
        Skill(id="2", name="JavaScript", category="Programming"),
        Skill(id="3", name="React", category="Frontend"),
        Skill(id="4", name="Machine Learning", category="AI/ML"),
        Skill(id="5", name="Data Science", category="Data"),
        Skill(id="6", name="Node.js", category="Backend"),
        Skill(id="7", name="UI/UX Design", category="Design"),
        Skill(id="8", name="DSA", category="Fundamentals"),
        Skill(id="9", name="Docker", category="DevOps"),
        Skill(id="10", name="SQL", category="Database"),
    ]
    
    demo_users = [
        User(
            id="u1", name="Rahul Kumar", email="rahul@srmap.edu.in", year=4, branch="CSE",
            skills=[
                UserSkill(user_id="u1", skill_id="4", skill_name="Machine Learning", proficiency=5, is_teaching=True),
                UserSkill(user_id="u1", skill_id="1", skill_name="Python", proficiency=5, is_teaching=True),
                UserSkill(user_id="u1", skill_id="3", skill_name="React", proficiency=2, is_learning=True),
            ]
        ),
        User(
            id="u2", name="Priya Singh", email="priya@srmap.edu.in", year=3, branch="CSE",
            skills=[
                UserSkill(user_id="u2", skill_id="3", skill_name="React", proficiency=4, is_teaching=True),
                UserSkill(user_id="u2", skill_id="2", skill_name="JavaScript", proficiency=4, is_teaching=True),
                UserSkill(user_id="u2", skill_id="4", skill_name="Machine Learning", proficiency=1, is_learning=True),
            ]
        ),
        User(
            id="u3", name="Amit Verma", email="amit@srmap.edu.in", year=2, branch="CSE",
            skills=[
                UserSkill(user_id="u3", skill_id="1", skill_name="Python", proficiency=3, is_teaching=True),
                UserSkill(user_id="u3", skill_id="8", skill_name="DSA", proficiency=2, is_learning=True),
                UserSkill(user_id="u3", skill_id="4", skill_name="Machine Learning", proficiency=1, is_learning=True),
            ]
        ),
        User(
            id="u4", name="Sneha Patel", email="sneha@srmap.edu.in", year=4, branch="ECE",
            skills=[
                UserSkill(user_id="u4", skill_id="5", skill_name="Data Science", proficiency=5, is_teaching=True),
                UserSkill(user_id="u4", skill_id="1", skill_name="Python", proficiency=4, is_teaching=True),
                UserSkill(user_id="u4", skill_id="7", skill_name="UI/UX Design", proficiency=1, is_learning=True),
            ]
        ),
        User(
            id="u5", name="Vikram Reddy", email="vikram@srmap.edu.in", year=3, branch="CSE",
            skills=[
                UserSkill(user_id="u5", skill_id="8", skill_name="DSA", proficiency=5, is_teaching=True),
                UserSkill(user_id="u5", skill_id="6", skill_name="Node.js", proficiency=4, is_teaching=True),
                UserSkill(user_id="u5", skill_id="9", skill_name="Docker", proficiency=1, is_learning=True),
            ]
        ),
    ]
    
    build_graph(demo_users, demo_skills)
    
    return {
        "message": "Demo data seeded",
        "users": len(demo_users),
        "skills": len(demo_skills),
        "graph_nodes": G.number_of_nodes(),
        "graph_edges": G.number_of_edges()
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
