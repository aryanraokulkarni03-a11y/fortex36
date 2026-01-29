from typing import List, Optional
from ..models import Event
from ..core.database import db
import logging

logger = logging.getLogger(__name__)

class EventService:
    def __init__(self):
        # Fallback in-memory storage
        self.events: List[Event] = []

    @property
    def collection(self):
        if db.db is not None:
            return db.db["events"]
        return None

    async def get_all(self) -> List[Event]:
        """Get all events"""
        if self.collection:
            cursor = self.collection.find({})
            docs = await cursor.to_list(length=1000)
            # Remove _id and convert to Event
            return [Event(**{k: v for k, v in d.items() if k != "_id"}) for d in docs]
        return self.events

    async def get_by_id(self, event_id: str) -> Optional[Event]:
        """Get single event by ID"""
        if self.collection:
            doc = await self.collection.find_one({"id": event_id})
            if doc:
                doc.pop("_id", None)
                return Event(**doc)
            return None
            
        for event in self.events:
            if event.id == event_id:
                return event
        return None

    async def create(self, event: Event) -> Event:
        """Create a new event"""
        if self.collection:
            existing = await self.collection.find_one({"id": event.id})
            if existing:
                raise ValueError("Event ID already exists")
            
            await self.collection.insert_one(event.model_dump())
            return event

        # Failover logic
        for existing in self.events:
            if existing.id == event.id:
                raise ValueError("Event ID already exists")
        self.events.append(event)
        return event

    async def register_user(self, event_id: str, user_id: str) -> bool:
        """Register a user for an event"""
        if self.collection:
            event_doc = await self.collection.find_one({"id": event_id})
            if not event_doc:
                raise ValueError("Event not found")
            
            current_participants = event_doc.get("participants", 0)
            max_participants = event_doc.get("max_participants", 0)
            
            if current_participants >= max_participants:
                raise ValueError("Event is full")
            
            # Atomic update
            result = await self.collection.update_one(
                {"id": event_id, "participants": {"$lt": max_participants}},
                {"$inc": {"participants": 1}}
            )
            
            if result.modified_count == 0:
                # Race condition or full
                raise ValueError("Event is full or update failed")
            return True

        # Failover
        event = await self.get_by_id(event_id)
        if not event:
            raise ValueError("Event not found")
        if event.participants >= event.max_participants:
            raise ValueError("Event is full")
        event.participants += 1
        return True
