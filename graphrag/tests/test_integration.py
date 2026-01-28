"""
SkillSync GraphRAG Integration Tests
Tests all API endpoints with real HTTP requests
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from fastapi.testclient import TestClient
from main import app
from models import User, Skill, UserSkill

client = TestClient(app)


class TestHealthEndpoints:
    """Test health and status endpoints"""
    
    def test_root_endpoint(self):
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "running"
        assert "db_connected" in data
    
    def test_health_endpoint(self):
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "graph_nodes" in data
    
    def test_stats_endpoint(self):
        response = client.get("/stats")
        assert response.status_code == 200
        data = response.json()
        assert "total_users" in data
        assert "total_skills" in data
        assert "total_edges" in data


class TestDemoData:
    """Test demo data seeding"""
    
    def test_seed_demo_data(self):
        response = client.post("/demo/seed")
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Demo data seeded"
        assert data["users"] == 5
        assert data["skills"] == 10
        assert data["graph_nodes"] > 0
        assert data["graph_edges"] > 0
    
    def test_stats_after_seed(self):
        # Seed first
        client.post("/demo/seed")
        
        # Check stats
        response = client.get("/stats")
        data = response.json()
        assert data["total_users"] == 5
        assert data["total_skills"] == 10


class TestMatching:
    """Test match finding algorithm"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Seed demo data before each test"""
        client.post("/demo/seed")
    
    def test_find_matches_machine_learning(self):
        """Test finding mentors for Machine Learning"""
        response = client.post("/match/find", json={
            "user_id": "u2",  # Priya wants to learn ML
            "skill_name": "Machine Learning",
            "limit": 5
        })
        
        assert response.status_code == 200
        matches = response.json()
        assert len(matches) > 0
        
        # Rahul (u1) should be a match (teaches ML, proficiency 5)
        match_ids = [m["user_id"] for m in matches]
        assert "u1" in match_ids
    
    def test_find_matches_react(self):
        """Test finding mentors for React"""
        response = client.post("/match/find", json={
            "user_id": "u1",  # Rahul wants to learn React
            "skill_name": "React",
            "limit": 5
        })
        
        assert response.status_code == 200
        matches = response.json()
        assert len(matches) > 0
        
        # Priya (u2) should be top match (teaches React, proficiency 4)
        assert matches[0]["user_id"] == "u2"
    
    def test_find_matches_no_results(self):
        """Test skill with no mentors"""
        response = client.post("/match/find", json={
            "user_id": "u1",
            "skill_name": "NonExistentSkill123",
            "limit": 5
        })
        
        assert response.status_code == 200
        matches = response.json()
        assert len(matches) == 0
    
    def test_find_matches_with_limit(self):
        """Test limit parameter"""
        response = client.post("/match/find", json={
            "user_id": "u1",
            "skill_name": "React",
            "limit": 1
        })
        
        assert response.status_code == 200
        matches = response.json()
        assert len(matches) <= 1


class TestUserConnections:
    """Test user connection retrieval"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        client.post("/demo/seed")
    
    def test_get_user_connections(self):
        """Test getting connections for existing user"""
        response = client.get("/user/u1/connections")
        
        assert response.status_code == 200
        data = response.json()
        assert data["user_id"] == "u1"
        assert "teaching" in data
        assert "learning" in data
    
    def test_get_nonexistent_user(self):
        """Test 404 for non-existent user"""
        response = client.get("/user/nonexistent/connections")
        assert response.status_code == 404


class TestGraphBuilding:
    """Test graph construction"""
    
    def test_build_graph_from_payload(self):
        """Test manual graph building"""
        skills = [
            {"id": "s1", "name": "Python", "category": "Code"},
            {"id": "s2", "name": "React", "category": "Code"}
        ]
        
        users = [
            {
                "id": "u1",
                "name": "Teacher",
                "email": "t@srmap.edu.in",
                "year": 4,
                "branch": "CSE",
                "skills": [
                    {
                        "user_id": "u1",
                        "skill_id": "s1",
                        "skill_name": "Python",
                        "proficiency": 5,
                        "is_teaching": True,
                        "is_learning": False
                    }
                ]
            }
        ]
        
        response = client.post("/graph/build", json={
            "users": users,
            "skills": skills
        })
        
        assert response.status_code == 200
        data = response.json()
        assert "nodes" in data
        assert "edges" in data
        assert data["message"] == "Graph built from payload"


class TestEdgeCases:
    """Test error handling and edge cases"""
    
    def test_match_missing_skill_name(self):
        """Test error when skill_name is missing"""
        response = client.post("/match/find", json={
            "user_id": "u1",
            "limit": 5
        })
        
        # Should fail validation (Pydantic will catch missing field)
        assert response.status_code == 422
    
    def test_match_missing_user_id(self):
        """Test error when user_id is missing"""
        response = client.post("/match/find", json={
            "skill_name": "Python",
            "limit": 5
        })
        
        assert response.status_code == 422


# Performance test (optional)
class TestPerformance:
    """Basic performance checks"""
    
    def test_health_response_time(self):
        """Ensure health check is fast"""
        import time
        
        start = time.time()
        response = client.get("/health")
        duration = time.time() - start
        
        assert response.status_code == 200
        assert duration < 0.5  # Should respond in < 500ms


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
