"""
SkillSync GraphRAG Microservice
AI-powered peer matching using knowledge graphs
"""

from fastapi import FastAPI, HTTPException, Response, status, Depends
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from contextlib import asynccontextmanager
import logging

# Local modules
from .core.config import settings, setup_logging
from .middleware.request_id import RequestIDMiddleware
from .core.database import db, fetch_graph_data
from .services.graph_service import graph_service
from .services.event_service import EventService
from .services.session_service import SessionService
from .services.connection_service import ConnectionService
from .core.auth import create_access_token, decode_access_token
from .models import User, Skill, UserSkill, MatchRequest, MatchResult, GraphStats, Event, Session, UserRegisterRequest, UserUpdateRequest, SkillUpdateRequest, SessionBookRequest, ConnectionRequest, ConnectionRequestStatus, LoginRequest

# Initialize Services
event_service = EventService()
session_service = SessionService()
connection_service = ConnectionService()
from .models import (
    User, Skill, UserSkill, MatchRequest, MatchResult, GraphStats, Event, Session,
    UserRegisterRequest, UserUpdateRequest, SkillUpdateRequest, SessionBookRequest,
    ConnectionRequest, ConnectionRequestStatus
)

# Configure Logging
setup_logging()
logger = logging.getLogger(__name__)

# Lifespan context for DB connection
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting up GraphRAG Service...")
    await db.connect()
    yield
    # Shutdown
    logger.info("Shutting down GraphRAG Service...")
    await db.close()

app = FastAPI(
    title=settings.API_TITLE,
    description="Knowledge graph-based peer matching service (Refactored)",
    version=settings.API_VERSION,
    lifespan=lifespan
)

# Middleware
app.add_middleware(RequestIDMiddleware)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login", auto_error=False) # auto_error=False allows optional auth for some endpoints if needed

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============== API ENDPOINTS ==============

@app.get("/")
async def root():
    return {
        "message": "SkillSync GraphRAG API",
        "status": "running",
        "db_connected": db.db is not None
    }

@app.get("/health")
async def health(response: Response):
    """Deep health check for orchestration"""
    status = "healthy"
    db_status = "disconnected"
    
    if db.db is not None:
        try:
            await db.db.command("ping")
            db_status = "connected"
        except Exception:
            status = "degraded"
            db_status = "error"
            response.status_code = 503
    
    return {
        "status": status,
        "database": db_status,
        "graph_nodes": graph_service.G.number_of_nodes(),
        "memory_usage": "optimal"  # Placeholder for psutil check if needed
    }

@app.get("/stats", response_model=GraphStats)
async def get_stats():
    """Get graph statistics"""
    users = sum(1 for n in graph_service.G.nodes() if str(n).startswith("user:"))
    skills = sum(1 for n in graph_service.G.nodes() if str(n).startswith("skill:"))
    return GraphStats(
        total_users=users,
        total_skills=skills,
        total_edges=graph_service.G.number_of_edges()
    )

@app.post("/graph/sync")
async def sync_graph():
    """Sync graph with MongoDB data"""
    try:
        if not db.db:
            return {"status": "demo_mode", "message": "No DB connection, utilizing in-memory/demo data only"}
            
        users, skills = await fetch_graph_data()
        graph_service.build_graph(users, skills)
        
        return {
            "status": "synced",
            "users": len(users),
            "skills": len(skills),
            "nodes": graph_service.G.number_of_nodes(),
            "edges": graph_service.G.number_of_edges()
        }
    except Exception as e:
        logger.error(f"Sync error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/graph/build")
async def build_graph_endpoint(users: list[User], skills: list[Skill]):
    """Build/rebuild the knowledge graph from data provided in body"""
    graph_service.build_graph(users, skills)
    return {
        "message": "Graph built from payload",
        "nodes": graph_service.G.number_of_nodes(),
        "edges": graph_service.G.number_of_edges()
    }

@app.post("/match/find", response_model=list[MatchResult])
async def find_matches(request: MatchRequest):
    """Find mentors for a skill the user wants to learn"""
    matches = graph_service.find_matches(
        seeker_id=request.user_id,
        skill_name=request.skill_name,
        limit=request.limit
    )
    return matches


@app.get("/events", response_model=list[Event])
async def get_events():
    """Get all upcoming campus events"""
    return await event_service.get_all()

@app.get("/sessions", response_model=list[Session])
async def get_sessions():
    """Get user's scheduled mentoring sessions"""
    return await session_service.get_all()


@app.get("/user/{user_id}/connections")
async def get_user_connections(user_id: str):
    """Get all connections for a user"""
    connections = graph_service.get_user_connections(user_id)
    if not connections:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"user_id": user_id, **connections}


# ============== USER MANAGEMENT ==============

# ============== USER MANAGEMENT ==============

@app.post("/auth/login", response_model=dict)
async def login_for_access_token(form_data: LoginRequest):
    """Login and get JWT token"""
    
    # Check if user exists (by email) in graph service
    user_found = None
    
    for user in graph_service.users:
        if user.email == form_data.username:
            user_found = user
            break
            
    if user_found:
        user_id = user_found.id
        username = user_found.name
    elif form_data.username.endswith("@srmap.edu.in"):
        import uuid
        user_id = f"u{uuid.uuid4().hex[:8]}"
        username = form_data.username.split("@")[0].title()
    else:
         raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. Use an @srmap.edu.in email.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(
        data={"sub": form_data.username, "id": user_id, "name": username}
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "name": username,
            "email": form_data.username,
            "avatar": f"https://api.dicebear.com/7.x/initials/svg?seed={username}"
        }
    }

@app.get("/me")
async def get_current_user(token: str = Depends(oauth2_scheme)):
    """Get current user (Authenticated)"""
    if not token:
         raise HTTPException(status_code=401, detail="Not authenticated")
    
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = payload.get("id")
    email = payload.get("sub")
    
    user_node = f"user:{user_id}"
    if user_node in graph_service.G.nodes():
        node_data = graph_service.G.nodes[user_node]
        return {
            "user_id": user_id,
            "name": node_data.get("name"),
            "email": email,
            "year": node_data.get("year", 1),
            "branch": node_data.get("branch", "Unknown"),
            "authenticated": True
        }
    
    return {
        "user_id": user_id,
        "name": payload.get("name", "Guest"),
        "email": email,
        "year": 1,
        "branch": "General",
        "authenticated": True,
        "message": "User not in graph yet"
    }

@app.post("/user/register")
async def register_user(request: UserRegisterRequest):
    """Register a new user"""
    import uuid
    user_id = f"u{uuid.uuid4().hex[:8]}"
    
    new_user = User(
        id=user_id,
        name=request.name,
        email=request.email,
        year=request.year,
        branch=request.branch,
        skills=[]
    )
    
    # Add to graph (in-memory for MVP)
    graph_service.G.add_node(
        f"user:{user_id}",
        type="user",
        name=new_user.name,
        year=new_user.year,
        branch=new_user.branch
    )
    
    # Store in users list for graph rebuilding
    graph_service.users = getattr(graph_service, 'users', [])
    graph_service.users.append(new_user)
    
    return {
        "message": "User registered successfully",
        "user_id": user_id,
        "user": new_user
    }

@app.get("/user/{user_id}")
async def get_user_profile(user_id: str):
    """Get user profile by ID"""
    user_node = f"user:{user_id}"
    
    if user_node not in graph_service.G.nodes():
        raise HTTPException(status_code=404, detail="User not found")
    
    node_data = graph_service.G.nodes[user_node]
    connections = graph_service.get_user_connections(user_id)
    
    return {
        "user_id": user_id,
        "name": node_data.get("name", "Unknown"),
        "year": node_data.get("year", 1),
        "branch": node_data.get("branch", "Unknown"),
        **connections
    }

@app.put("/user/{user_id}")
async def update_user_profile(user_id: str, updates: UserUpdateRequest):
    """Update user profile"""
    user_node = f"user:{user_id}"
    
    if user_node not in graph_service.G.nodes():
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update graph node attributes
    if updates.name:
        graph_service.G.nodes[user_node]["name"] = updates.name
    if updates.year:
        graph_service.G.nodes[user_node]["year"] = updates.year
    if updates.branch:
        graph_service.G.nodes[user_node]["branch"] = updates.branch
    
    return {"message": "Profile updated", "user_id": user_id}

@app.post("/user/{user_id}/skills")
async def update_user_skills(user_id: str, skill: SkillUpdateRequest):
    """Add or update a user's skill"""
    from .core.constants import RelationType
    
    user_node = f"user:{user_id}"
    skill_node = f"skill:{skill.skill_id}"
    
    if user_node not in graph_service.G.nodes():
        raise HTTPException(status_code=404, detail="User not found")
    
    # Add skill node if doesn't exist
    if skill_node not in graph_service.G.nodes():
        graph_service.G.add_node(skill_node, type="skill", name=skill.skill_name, category="Custom")
    
    # Add edges based on teaching/learning
    if skill.is_teaching:
        graph_service.G.add_edge(user_node, skill_node, relation=RelationType.CAN_TEACH, proficiency=skill.proficiency)
    if skill.is_learning:
        graph_service.G.add_edge(user_node, skill_node, relation=RelationType.WANTS_TO_LEARN)
    
    return {"message": "Skill updated", "user_id": user_id, "skill": skill.skill_name}


# ============== EVENT MANAGEMENT ==============

@app.get("/events/{event_id}")
async def get_event(event_id: str):
    """Get single event details"""
    event = await event_service.get_by_id(event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@app.post("/events")
async def create_event(event: Event):
    """Create a new event"""
    try:
        await event_service.create(event)
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))
    return {"message": "Event created", "event_id": event.id}

@app.post("/events/{event_id}/register")
async def register_for_event(event_id: str, user_id: str):
    """Register a user for an event"""
    try:
        success = await event_service.register_user(event_id, user_id)
        if success:
            return {"message": "Registered successfully", "event_id": event_id, "user_id": user_id}
    except ValueError as e:
        if "not found" in str(e):
             raise HTTPException(status_code=404, detail=str(e))
        raise HTTPException(status_code=400, detail=str(e))
    raise HTTPException(status_code=400, detail="Registration failed")


# ============== SESSION MANAGEMENT ==============

@app.post("/sessions/book")
async def book_session(request: SessionBookRequest):
    """Book a mentoring session"""
    import uuid
    session_id = f"s{uuid.uuid4().hex[:8]}"
    
    # Get mentor name from graph
    mentor_node = f"user:{request.mentor_id}"
    if mentor_node not in graph_service.G.nodes():
        raise HTTPException(status_code=404, detail="Mentor not found")
    
    mentor_name = graph_service.G.nodes[mentor_node].get("name", "Unknown Mentor")
    
    new_session = Session(
        id=session_id,
        mentor_name=mentor_name,
        topic=request.topic,
        date=request.date,
        time=request.time,
        status="Scheduled",
        duration=request.duration
    )
    
    await session_service.create(new_session)
    return {"message": "Session booked", "session_id": session_id, "session": new_session}

@app.put("/sessions/{session_id}")
async def update_session(session_id: str, status: str):
    """Update session status"""
    updated = await session_service.update_status(session_id, status)
    if not updated:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"message": "Session updated", "session_id": session_id, "new_status": status}

@app.delete("/sessions/{session_id}")
async def cancel_session(session_id: str):
    """Cancel/delete a session"""
    success = await session_service.delete(session_id)
    if not success:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"message": "Session cancelled", "session_id": session_id}


# ============== CONNECTION REQUESTS ==============

# ============== CONNECTION REQUESTS ==============

@app.post("/match/connect")
async def send_connection_request(request: ConnectionRequest):
    """Send a connection/mentorship request"""
    import uuid
    from datetime import datetime
    
    # Validate users exist (Graph check is fine for existence)
    from_node = f"user:{request.from_user_id}"
    to_node = f"user:{request.to_user_id}"
    
    if from_node not in graph_service.G.nodes():
        raise HTTPException(status_code=404, detail="Sender user not found")
    if to_node not in graph_service.G.nodes():
        raise HTTPException(status_code=404, detail="Recipient user not found")
    
    from_name = graph_service.G.nodes[from_node].get("name", "Unknown")
    
    new_request = ConnectionRequestStatus(
        id=f"cr{uuid.uuid4().hex[:8]}",
        from_user_id=request.from_user_id,
        from_user_name=from_name,
        to_user_id=request.to_user_id,
        skill_name=request.skill_name,
        message=request.message,
        status="pending",
        created_at=datetime.now().isoformat()
    )
    
    await connection_service.create(new_request)
    return {"message": "Connection request sent", "request_id": new_request.id}

@app.get("/match/requests/{user_id}")
async def get_connection_requests(user_id: str):
    """Get pending connection requests for a user"""
    requests = await connection_service.get_by_user(user_id)
    return {
        "user_id": user_id,
        **requests
    }


# ============== UTILITY / ANALYTICS ==============

@app.get("/skills/trending")
async def get_trending_skills():
    """Get trending skills (most learners)"""
    skill_demand = {}
    
    for node in graph_service.G.nodes():
        if str(node).startswith("skill:"):
            skill_name = graph_service.G.nodes[node].get("name", "Unknown")
            # Count incoming WANTS_TO_LEARN edges
            learners = sum(1 for pred in graph_service.G.predecessors(node)
                          if graph_service.G.edges.get((pred, node), {}).get("relation") == "WANTS_TO_LEARN")
            skill_demand[skill_name] = learners
    
    # Sort by demand
    trending = sorted(skill_demand.items(), key=lambda x: x[1], reverse=True)[:10]
    
    return {
        "trending_skills": [{"skill": name, "learners": count} for name, count in trending]
    }

@app.get("/skills/categories")
async def get_skill_categories():
    """Get all skill categories"""
    categories = {}
    
    for node in graph_service.G.nodes():
        if str(node).startswith("skill:"):
            category = graph_service.G.nodes[node].get("category", "General")
            skill_name = graph_service.G.nodes[node].get("name", "Unknown")
            
            if category not in categories:
                categories[category] = []
            categories[category].append(skill_name)
    
    return {"categories": categories}

@app.get("/leaderboard")
async def get_leaderboard():
    """Get top mentors by teaching proficiency"""
    mentor_scores = {}
    
    for node in graph_service.G.nodes():
        if str(node).startswith("user:"):
            user_id = str(node).split(":")[1]
            user_name = graph_service.G.nodes[node].get("name", "Unknown")
            
            # Sum proficiency of all skills they teach
            total_proficiency = 0
            skills_teaching = 0
            
            for neighbor in graph_service.G.neighbors(node):
                edge = graph_service.G.edges.get((node, neighbor), {})
                if edge.get("relation") == "CAN_TEACH":
                    total_proficiency += edge.get("proficiency", 0)
                    skills_teaching += 1
            
            if skills_teaching > 0:
                mentor_scores[user_id] = {
                    "name": user_name,
                    "total_proficiency": total_proficiency,
                    "skills_teaching": skills_teaching,
                    "score": total_proficiency * skills_teaching
                }
    
    # Sort by score
    sorted_mentors = sorted(mentor_scores.items(), key=lambda x: x[1]["score"], reverse=True)[:10]
    
    return {
        "leaderboard": [
            {"rank": i+1, "user_id": uid, **data}
            for i, (uid, data) in enumerate(sorted_mentors)
        ]
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
        User(
            id="u6", name="Kushaan Parekh", email="kushaan_parekh@srmap.edu.in", year=3, branch="CSE",
            skills=[
                UserSkill(user_id="u6", skill_id="1", skill_name="Python", proficiency=4, is_teaching=True),
                UserSkill(user_id="u6", skill_id="3", skill_name="React", proficiency=4, is_teaching=True),
                UserSkill(user_id="u6", skill_id="4", skill_name="Machine Learning", proficiency=3, is_learning=True),
                UserSkill(user_id="u6", skill_id="9", skill_name="Docker", proficiency=2, is_learning=True),
            ]
        ),
    ]
    
    # Seed Events (SRM AP Context)
    events = [
        Event(
            id="e1", title="SRM Hackathon 2025", description="24-hour coding challenge for sustainable tech.",
            time="Feb 15, 09:00 AM", location="Admin Block, 4th Floor", type="Hackathon",
            participants=120, max_participants=200, host="Next Tech Lab", tags=["Coding", "Innovation"]
        ),
        Event(
            id="e2", title="React.js Workshop", description="Zero to Hero in React hooks and patterns.",
            time="Feb 10, 02:00 PM", location="AL C-201", type="Workshop",
            participants=45, max_participants=60, host="Priya Singh", tags=["Web Dev", "Frontend"]
        ),
        Event(
            id="e3", title="AI/ML Study Group", description="Discussing Transformer models and BERT.",
            time="Every Sat, 06:00 PM", location="Online (Discord)", type="Study Group",
            participants=15, max_participants=50, host="Rahul Kumar", tags=["AI", "Research"]
        )
    ]
    
    # Persist Events
    for event in events:
        try:
             await event_service.create(event)
        except ValueError:
             pass # Already exists

    # Seed Sessions
    sessions = [
        Session(
            id="s1", mentor_name="Rahul Kumar", topic="Intro to Machine Learning",
            date="Today", time="04:00 PM", status="Scheduled", duration="1 hr"
        ),
        Session(
            id="s2", mentor_name="Priya Singh", topic="React State Management",
            date="Tomorrow", time="10:00 AM", status="Scheduled", duration="45 min"
        ),
        Session(
            id="s3", mentor_name="Vikram Reddy", topic="DSA Graph Algorithms",
            date="Feb 12", time="06:00 PM", status="Pending", duration="1.5 hr"
        )
    ]
    
    # Persist Sessions
    for session in sessions:
        try:
            await session_service.create(session)
        except ValueError:
            pass # Already exists

    graph_service.build_graph(demo_users, demo_skills)
    
    return {
        "message": "Demo data seeded",
        "users": len(demo_users),
        "skills": len(demo_skills),
        "graph_nodes": graph_service.G.number_of_nodes(),
        "graph_edges": graph_service.G.number_of_edges()
    }


if __name__ == "__main__":
    import uvicorn
    # Hot reload disabled by default in production, but enabled here for dev
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
