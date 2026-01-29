import networkx as nx
from typing import List, Tuple, Optional, Set
from ..models import MatchResult, User, Skill, UserSkill
from ..core.constants import RelationType, NodeType
import logging

logger = logging.getLogger(__name__)

class GraphService:
    def __init__(self):
        self.G = nx.DiGraph()
        self.users: List[User] = []
        # Events and Sessions moved to dedicated services

    def build_graph(self, users: List[User], skills: List[Skill]):
        """Build the knowledge graph from user and skill data"""
        self.G.clear()
        self.users = users
        
        # Add skill nodes
        for skill in skills:
            self.G.add_node(
                f"skill:{skill.id}",
                type=NodeType.SKILL,
                name=skill.name,
                category=skill.category
            )
        
        # Add user nodes and edges
        for user in users:
            self.G.add_node(
                f"user:{user.id}",
                type=NodeType.USER,
                name=user.name,
                year=user.year,
                branch=user.branch
            )
            
            for user_skill in user.skills:
                skill_node = f"skill:{user_skill.skill_id}"
                user_node = f"user:{user.id}"
                
                if user_skill.is_teaching:
                    self.G.add_edge(
                        user_node, skill_node,
                        relation=RelationType.CAN_TEACH,
                        proficiency=user_skill.proficiency
                    )
                
                if user_skill.is_learning:
                    self.G.add_edge(
                        user_node, skill_node,
                        relation=RelationType.WANTS_TO_LEARN
                    )
        
        logger.info(f"Graph built: {self.G.number_of_nodes()} nodes, {self.G.number_of_edges()} edges")

    def calculate_match_score(self, seeker_id: str, mentor_id: str, skill_node: str) -> float:
        """Calculate match score between seeker and potential mentor"""
        score = 0.0
        
        seeker_node = f"user:{seeker_id}"
        mentor_node = f"user:{mentor_id}"
        
        # Factor 1: Mentor's proficiency (0-25 points)
        edge_data = self.G.edges.get((mentor_node, skill_node), {})
        proficiency = edge_data.get("proficiency", 1)
        score += proficiency * 5
        
        # Factor 2: Year difference bonus (seniors teaching = good)
        seeker_year = self.G.nodes[seeker_node].get("year", 1)
        mentor_year = self.G.nodes[mentor_node].get("year", 1)
        if mentor_year > seeker_year:
            score += (mentor_year - seeker_year) * 10
        
        # Factor 3: Same branch bonus
        if self.G.nodes[seeker_node].get("branch") == self.G.nodes[mentor_node].get("branch"):
            score += 15
        
        # Factor 4: Mutual exchange opportunity
        mutual = self._find_mutual_skills(seeker_node, mentor_node)
        if mutual:
            score += 25  # Big bonus!
        
        return min(score, 100.0)

    def _find_mutual_skills(self, seeker_node: str, mentor_node: str) -> Set[str]:
        seeker_teaches = set()
        for neighbor in self.G.neighbors(seeker_node):
            edge = self.G.edges.get((seeker_node, neighbor), {})
            if edge.get("relation") == RelationType.CAN_TEACH:
                seeker_teaches.add(neighbor)
        
        mentor_learns = set()
        for neighbor in self.G.neighbors(mentor_node):
            edge = self.G.edges.get((mentor_node, neighbor), {})
            if edge.get("relation") == RelationType.WANTS_TO_LEARN:
                mentor_learns.add(neighbor)
        
        return seeker_teaches & mentor_learns

    def find_mutual_exchange(self, seeker_id: str, mentor_id: str) -> Optional[str]:
        """Find if seeker can teach something the mentor wants to learn"""
        seeker_node = f"user:{seeker_id}"
        mentor_node = f"user:{mentor_id}"
        
        if seeker_node not in self.G or mentor_node not in self.G:
            return None

        mutual = self._find_mutual_skills(seeker_node, mentor_node)
        if mutual:
            skill_node = list(mutual)[0]
            return self.G.nodes[skill_node].get("name", "Unknown")
        
        return None

    def get_connection_degree(self, user1_id: str, user2_id: str) -> Tuple[int, List[str]]:
        """Get the connection degree between two users"""
        node1 = f"user:{user1_id}"
        node2 = f"user:{user2_id}"
        
        if node1 not in self.G or node2 not in self.G:
            return (0, [])
        
        # Revert to original logic for consistency
        neighbors1 = set(self.G.neighbors(node1)) if node1 in self.G else set()
        neighbors2 = set(self.G.neighbors(node2)) if node2 in self.G else set()
        
        common_skills = neighbors1 & neighbors2
        
        if common_skills:
            skill_name = self.G.nodes[list(common_skills)[0]].get("name", "Unknown")
            return (2, [skill_name])
        
        return (3, [])

    def get_user_connections(self, user_id: str):
        """Get all connections for a user"""
        user_node = f"user:{user_id}"
        
        if user_node not in self.G.nodes():
            return None
        
        teaching = []
        learning = []
        
        for neighbor in self.G.neighbors(user_node):
            edge = self.G.edges.get((user_node, neighbor), {})
            if neighbor.startswith("skill:"):
                skill_name = self.G.nodes[neighbor].get("name", "Unknown")
                if edge.get("relation") == RelationType.CAN_TEACH:
                    teaching.append({
                        "skill": skill_name,
                        "proficiency": edge.get("proficiency", 1)
                    })
                elif edge.get("relation") == RelationType.WANTS_TO_LEARN:
                    learning.append({"skill": skill_name})
        
        return {"teaching": teaching, "learning": learning}

    def find_matches(self, seeker_id: str, skill_name: str, limit: int = 5) -> List[MatchResult]:
        """Find mentors for a skill using efficient graph traversal"""
        target_skill = skill_name.lower()
        if not target_skill:
             return []

        # 1. Resolve Skill Node (O(N) -> can be O(1) with name map)
        skill_node = None
        for node in self.G.nodes():
            if str(node).startswith("skill:") and self.G.nodes[node].get("name", "").lower() == target_skill:
                skill_node = node
                break
        
        if not skill_node:
            # Return empty or raise error? Service should probably return empty
            return []

        seeker_node = f"user:{seeker_id}"
        matches = []
        
        # 2. Optimization: Use graph predecessors to find potential mentors
        # Users who "CAN_TEACH" are predecessors of the skill node
        try:
            potential_mentors = list(self.G.predecessors(skill_node))
        except nx.NetworkXError:
             return []
        
        for node in potential_mentors:
            if str(node).startswith("user:") and node != seeker_node:
                # Verifying edge relation explicitly for safety
                edge = self.G.edges.get((node, skill_node))
                if edge and edge.get("relation") == RelationType.CAN_TEACH:
                    
                    user_id = str(node).split(":")[1]
                    user_data = self.G.nodes[node]
                    
                    # metrics
                    score = self.calculate_match_score(seeker_id, user_id, skill_node)
                    degree, path = self.get_connection_degree(seeker_id, user_id)
                    mutual = self.find_mutual_exchange(seeker_id, user_id)
                    
                    matches.append(MatchResult(
                        user_id=user_id,
                        name=user_data.get("name", "Unknown"),
                        year=user_data.get("year", 0),
                        branch=user_data.get("branch", "Unknown"),
                        proficiency=edge.get("proficiency", 1),
                        match_score=score,
                        connection_degree=degree,
                        connection_path=path,
                        mutual_exchange=mutual
                    ))
        
        matches.sort(key=lambda x: x.match_score, reverse=True)
        return matches[:limit]

graph_service = GraphService()
