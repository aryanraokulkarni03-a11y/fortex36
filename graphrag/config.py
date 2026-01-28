import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    MONGODB_URI: str = os.getenv("MONGODB_URI", "")
    API_TITLE: str = "SkillSync GraphRAG"
    API_VERSION: str = "1.0.0"
    CORS_ORIGINS: list = ["http://localhost:3000", "https://*.vercel.app"]

settings = Settings()
