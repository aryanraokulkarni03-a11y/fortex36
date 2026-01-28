from pydantic import BaseModel
from typing import List, Optional
from constants import RelationType, NodeType

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
