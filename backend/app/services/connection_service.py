from typing import List, Optional
from ..models import ConnectionRequestStatus
from ..core.database import db
import logging

class ConnectionService:
    def __init__(self):
        # Fallback in-memory storage
        self.requests: List[ConnectionRequestStatus] = []

    @property
    def collection(self):
        if db.db is not None:
            return db.db["connection_requests"]
        return None

    async def create(self, request: ConnectionRequestStatus) -> ConnectionRequestStatus:
        """Create a connection request"""
        if self.collection:
            await self.collection.insert_one(request.model_dump())
            return request

        self.requests.append(request)
        return request

    async def get_by_user(self, user_id: str) -> dict:
        """Get incoming and outgoing requests for a user"""
        if self.collection:
            # Query incoming and outgoing separately or together
            incoming_cursor = self.collection.find({"to_user_id": user_id})
            outgoing_cursor = self.collection.find({"from_user_id": user_id})
            
            incoming_docs = await incoming_cursor.to_list(length=1000)
            outgoing_docs = await outgoing_cursor.to_list(length=1000)
            
            incoming = [ConnectionRequestStatus(**{k: v for k, v in d.items() if k != "_id"}) for d in incoming_docs]
            outgoing = [ConnectionRequestStatus(**{k: v for k, v in d.items() if k != "_id"}) for d in outgoing_docs]
            
            return {"incoming": incoming, "outgoing": outgoing}

        # Fallback
        incoming = [r for r in self.requests if r.to_user_id == user_id]
        outgoing = [r for r in self.requests if r.from_user_id == user_id]
        return {"incoming": incoming, "outgoing": outgoing}

    async def update_status(self, request_id: str, status: str) -> bool:
        """Update request status (accepted/rejected)"""
        if self.collection:
            result = await self.collection.update_one(
                {"id": request_id},
                {"$set": {"status": status}}
            )
            return result.modified_count > 0
            
        for req in self.requests:
            if req.id == request_id:
                req.status = status
                return True
        return False
