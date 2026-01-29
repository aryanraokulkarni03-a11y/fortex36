from typing import List, Optional
from ..models import Session
from ..core.database import db
import logging

class SessionService:
    def __init__(self):
        # Fallback in-memory storage
        self.sessions: List[Session] = []

    @property
    def collection(self):
        if db.db is not None:
            return db.db["sessions"]
        return None

    async def get_all(self) -> List[Session]:
        """Get all sessions"""
        if self.collection:
            cursor = self.collection.find({})
            docs = await cursor.to_list(length=1000)
            return [Session(**{k: v for k, v in d.items() if k != "_id"}) for d in docs]
        return self.sessions

    async def get_by_id(self, session_id: str) -> Optional[Session]:
        """Get session by ID"""
        if self.collection:
            doc = await self.collection.find_one({"id": session_id})
            if doc:
                doc.pop("_id", None)
                return Session(**doc)
            return None
            
        for session in self.sessions:
            if session.id == session_id:
                return session
        return None

    async def create(self, session: Session) -> Session:
        """Create a session"""
        if self.collection:
            # Upsert not typical for create, ensuring unique id in app logic if needed
            await self.collection.insert_one(session.model_dump())
            return session

        self.sessions.append(session)
        return session

    async def update_status(self, session_id: str, status: str) -> bool:
        """Update session status. Returns True if updated."""
        if self.collection:
            result = await self.collection.update_one(
                {"id": session_id},
                {"$set": {"status": status}}
            )
            return result.modified_count > 0

        session = await self.get_by_id(session_id)
        if session:
            session.status = status
            return True
        return False

    async def delete(self, session_id: str) -> bool:
        """Delete a session"""
        if self.collection:
            result = await self.collection.delete_one({"id": session_id})
            return result.deleted_count > 0

        for i, session in enumerate(self.sessions):
            if session.id == session_id:
                self.sessions.pop(i)
                return True
        return False
