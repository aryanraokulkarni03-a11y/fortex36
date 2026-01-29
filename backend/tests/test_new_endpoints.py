from app.main import app, event_service, session_service, connection_service
from app.services.graph_service import graph_service
import pytest

client = TestClient(app)

class TestNewEndpoints:
    
    def setup_method(self):
        # Reset data before each test
        graph_service.G.clear()
        event_service.events = []
        session_service.sessions = []
        connection_service.requests = []
        # Re-seed for consistency
        client.post("/demo/seed")

    def test_user_registration_flow(self):
        # 1. Register User
        payload = {
            "name": "Integration Test User",
            "email": "test@srmap.edu.in",
            "year": 1,
            "branch": "CSE"
        }
        response = client.post("/user/register", json=payload)
        assert response.status_code == 200
        user_id = response.json()["user_id"]
        
        # 2. Get Profile
        profile = client.get(f"/user/{user_id}")
        assert profile.status_code == 200
        assert profile.json()["name"] == "Integration Test User"
        
        # 3. Add Skill
        skill_payload = {
            "skill_id": "1", # Python
            "skill_name": "Python",
            "proficiency": 5,
            "is_teaching": True
        }
        res = client.post(f"/user/{user_id}/skills", json=skill_payload)
        assert res.status_code == 200

    def test_event_flow(self):
        # 1. Create Event
        event_payload = {
            "id": "evt_test",
            "title": "Test Event",
            "description": "Integration Test",
            "time": "Tomorrow",
            "location": "Lab",
            "type": "Hackathon",
            "participants": 0,
            "max_participants": 10,
            "host": "Tester",
            "tags": ["Test"]
        }
        res = client.post("/events", json=event_payload)
        assert res.status_code == 200
        
        # 2. Register for Event
        res = client.post(f"/events/evt_test/register", params={"user_id": "u1"})
        assert res.status_code == 200
        
        # 3. Verify Participant Count
        evt = client.get("/events/evt_test")
        assert evt.json()["participants"] == 1

    def test_session_flow(self):
        # 1. Book Session with 'u1' (Rahul from demo)
        payload = {
            "mentor_id": "u1",
            "topic": "Python Help",
            "date": "Tomorrow",
            "time": "10:00 AM",
            "duration": "1 hr"
        }
        res = client.post("/sessions/book", json=payload)
        assert res.status_code == 200
        session_id = res.json()["session_id"]
        
        # 2. Update Status
        res = client.put(f"/sessions/{session_id}", params={"status": "Completed"})
        assert res.status_code == 200
        assert res.json()["new_status"] == "Completed"

    def test_connection_flow(self):
        # 1. Send Request (u2 -> u1)
        payload = {
            "from_user_id": "u2",
            "to_user_id": "u1",
            "skill_name": "Python"
        }
        res = client.post("/match/connect", json=payload)
        assert res.status_code == 200
        
        # 2. Check Requests for u1 (Incoming)
        res = client.get("/match/requests/u1")
        assert res.status_code == 200
        data = res.json()
        assert len(data["incoming"]) > 0
        assert data["incoming"][0]["from_user_id"] == "u2"

    def test_analytics_endpoints(self):
        res = client.get("/skills/trending")
        assert res.status_code == 200
        assert "trending_skills" in res.json()
        
        res = client.get("/leaderboard")
        assert res.status_code == 200
        assert "leaderboard" in res.json()
