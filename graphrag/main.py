"""
SkillSync GraphRAG Microservice
AI-powered peer matching using knowledge graphs
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

# Local modules
from config import settings
from database import db, fetch_graph_data
from services.graph_service import graph_service
from models import (
    User, Skill, UserSkill, MatchRequest, MatchResult, GraphStats
)

# Configure Logging
logging.basicConfig(level=logging.INFO)
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
async def health():
    return {
        "status": "healthy",
        "graph_nodes": graph_service.G.number_of_nodes(),
        "db_connected": db.db is not None
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
    
    # If no matches found because skill doesn't exist, the service returns empty list.
    # If we want 404 behavior, we can check here.
    # But technically empty matches is valid.
    
    return matches


@app.get("/user/{user_id}/connections")
async def get_user_connections(user_id: str):
    """Get all connections for a user"""
    connections = graph_service.get_user_connections(user_id)
    if not connections:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"user_id": user_id, **connections}


@app.post("/demo/seed")
async def seed_demo_data():
    """Seed the graph with demo data for testing"""
    
    # Demo data definition moved inside to keep main clean, or we could move to a separate seed file
    # For now, inline is fine or copy from old main.py
    # Re-using the same data structure as before
    
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
