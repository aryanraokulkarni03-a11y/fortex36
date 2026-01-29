
import asyncio
import sys
import os

# Add parent dir to path to allow imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.graph_service import graph_service
from models import User, Skill, UserSkill

def test_graph_logic():
    print("Testing Graph Logic...")
    
    # Mock Data
    skills = [
        Skill(id="s1", name="Python", category="Code"),
        Skill(id="s2", name="React", category="Code")
    ]
    
    users = [
        # User 1 teaches Python
        User(id="u1", name="Teacher", email="t@s.edu", year=4, branch="CSE", skills=[
            UserSkill(user_id="u1", skill_id="s1", skill_name="Python", proficiency=5, is_teaching=True)
        ]),
        # User 2 wants to learn Python
        User(id="u2", name="Student", email="s@s.edu", year=2, branch="CSE", skills=[
            UserSkill(user_id="u2", skill_id="s1", skill_name="Python", proficiency=1, is_learning=True)
        ])
    ]
    
    # 1. Build Graph
    print("1. Building Graph...")
    graph_service.build_graph(users, skills)
    node_count = graph_service.G.number_of_nodes()
    print(f"   Nodes: {node_count}")
    assert node_count == 4 # 2 users + 2 skills
    
    # 2. Find Matches
    print("2. Finding Matches...")
    # Student (u2) looking for Python (s1)
    matches = graph_service.find_matches(seeker_id="u2", skill_name="Python")
    
    print(f"   Found {len(matches)} matches")
    assert len(matches) == 1
    assert matches[0].user_id == "u1"
    assert matches[0].name == "Teacher"
    print("   ✅ Match found correctly")

    # 3. Test No Match
    print("3. Testing No Match...")
    matches_empty = graph_service.find_matches(seeker_id="u2", skill_name="React")
    assert len(matches_empty) == 0
    print("   ✅ No match handled correctly")
    
    print("ALL TESTS PASSED")

if __name__ == "__main__":
    test_graph_logic()
