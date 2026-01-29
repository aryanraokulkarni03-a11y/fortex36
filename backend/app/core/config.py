import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import logging
import json
import sys

load_dotenv()

class JSONFormatter(logging.Formatter):
    def format(self, record):
        log_obj = {
            "timestamp": self.formatTime(record, self.datefmt),
            "level": record.levelname,
            "message": record.getMessage(),
            "logger": record.name,
            "path": getattr(record, "path", "unknown"),
        }
        if hasattr(record, "request_id"):
            log_obj["request_id"] = record.request_id
        if hasattr(record, "duration"):
            log_obj["duration"] = record.duration
            
        return json.dumps(log_obj)

class Settings(BaseSettings):
    MONGODB_URI: str = os.getenv("MONGODB_URI")
    API_TITLE: str = "SkillSync GraphRAG API"
    API_VERSION: str = "1.0.0"
    CORS_ORIGINS: list = os.getenv("CORS_ORIGINS", "*").split(",")
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

def setup_logging():
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(JSONFormatter())
    
    root_logger = logging.getLogger()
    root_logger.handlers = [handler]
    root_logger.setLevel(settings.LOG_LEVEL)
    
    # Quiet down some noisy libraries
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
