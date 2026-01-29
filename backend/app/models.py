from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional

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

class Event(BaseModel):
    id: str
    title: str
    description: str
    time: str
    location: str
    type: str # 'Workshop', 'Hackathon', etc.
    participants: int
    max_participants: int
    host: str
    tags: List[str]

class Session(BaseModel):
    id: str
    mentor_name: str
    topic: str
    date: str
    time: str
    status: str # 'Scheduled', 'Completed', 'Cancelled'
    duration: str


# Request Models for New Endpoints
class UserRegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    email: EmailStr
    year: int = Field(..., ge=1, le=5)
    branch: str = Field(..., min_length=2, max_length=10)

class UserUpdateRequest(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    year: Optional[int] = None
    branch: Optional[str] = None

class SkillUpdateRequest(BaseModel):
    skill_id: str
    skill_name: str
    proficiency: int = Field(..., ge=1, le=5)
    is_teaching: bool = False
    is_learning: bool = False

class SessionBookRequest(BaseModel):
    mentor_id: str
    topic: str
    date: str
    time: str
    duration: str = "1 hr"

class ConnectionRequest(BaseModel):
    from_user_id: str
    to_user_id: str
    skill_name: str
    message: Optional[str] = None

class ConnectionRequestStatus(BaseModel):
    id: str
    from_user_id: str
    from_user_name: str
    to_user_id: str
    skill_name: str
    message: Optional[str] = None
    status: str  # 'pending', 'accepted', 'rejected'
    created_at: str

class LoginRequest(BaseModel):
    username: str
    password: str
