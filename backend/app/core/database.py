from motor.motor_asyncio import AsyncIOMotorClient
from .config import settings
from ..models import User, Skill, UserSkill
from typing import List, Tuple
import logging

logger = logging.getLogger(__name__)

class Database:
    client: AsyncIOMotorClient = None
    db = None

    @classmethod
    async def connect(cls):
        uri = settings.MONGODB_URI
        if uri:
            try:
                masked_uri = uri[:15] + "..."
                logger.info(f"Attempting connection to: {masked_uri}")
                cls.client = AsyncIOMotorClient(uri)
                cls.db = cls.client.get_database("skillsync")
                # Force a check
                await cls.db.command('ping')
                logger.info("Connected to MongoDB Successfully!")
            except Exception as e:
                logger.error(f"Failed to connect to MongoDB: {e}")
                cls.db = None # Ensure it is None if failed
        else:
            logger.warning("MONGODB_URI not found in settings. Running in demo mode.")

    @classmethod
    async def close(cls):
        if cls.client:
            cls.client.close()

db = Database()

async def fetch_graph_data() -> Tuple[List[User], List[Skill]]:
    """Fetch all necessary data from MongoDB to build the graph"""
    if not db.db:
        # Return empty lists or handle demo mode gracefully elsewhere
        # Ideally we might raise an error if strict, but let's return empty for now or check in caller
        return [], []
    
    logger.info("Fetching data from MongoDB...")
    users_cursor = db.db.users.find({})
    skills_cursor = db.db.skills.find({})
    user_skills_cursor = db.db.userskills.find({})
    
    # Fetch Data
    users_data = await users_cursor.to_list(length=None)
    skills_data = await skills_cursor.to_list(length=None)
    user_skills_data = await user_skills_cursor.to_list(length=None)
    
    logger.info(f"Fetched {len(users_data)} users, {len(skills_data)} skills, {len(user_skills_data)} user_skills")

    # Process Skills
    skills_list = []
    skill_map = {} # ID -> Name
    for s in skills_data:
        skill = Skill(
            id=str(s["_id"]),
            name=s["name"],
            category=s.get("category", "General")
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
