"""
Frontend-Backend Integration Test Script
Tests E2E communication between Next.js frontend and GraphRAG backend
"""

import requests
import json
import time
import sys

# Configuration
GRAPHRAG_URL = "http://localhost:8000"
FRONTEND_URL = "http://localhost:3000"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'
    BOLD = '\033[1m'


def print_test(message):
    print(f"{Colors.BLUE}[TEST]{Colors.END} {message}")

def print_pass(message):
    print(f"{Colors.GREEN}✅ PASS:{Colors.END} {message}")

def print_fail(message):
    print(f"{Colors.RED}❌ FAIL:{Colors.END} {message}")

def print_section(message):
    print(f"\n{Colors.BOLD}{Colors.YELLOW}{'='*60}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.YELLOW}{message}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.YELLOW}{'='*60}{Colors.END}\n")


class IntegrationTester:
    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.graphrag_running = False
    
    def check_graphrag_health(self):
        """Check if GraphRAG service is running"""
        print_test("Checking GraphRAG service health...")
        try:
            response = requests.get(f"{GRAPHRAG_URL}/health", timeout=5)
            if response.status_code == 200:
                data = response.json()
                print_pass(f"GraphRAG running - {data['graph_nodes']} nodes in graph")
                self.graphrag_running = True
                self.passed += 1
                return True
            else:
                print_fail(f"GraphRAG returned status {response.status_code}")
                self.failed += 1
                return False
        except requests.exceptions.ConnectionError:
            print_fail("GraphRAG service not running")
            print(f"      → Start with: cd graphrag && uvicorn main:app --reload")
            self.failed += 1
            return False
        except Exception as e:
            print_fail(f"Error: {e}")
            self.failed += 1
            return False
    
    def seed_demo_data(self):
        """Seed demo data in GraphRAG"""
        print_test("Seeding demo data...")
        try:
            response = requests.post(f"{GRAPHRAG_URL}/demo/seed", timeout=10)
            if response.status_code == 200:
                data = response.json()
                print_pass(f"Demo data seeded: {data['users']} users, {data['skills']} skills")
                self.passed += 1
                return True
            else:
                print_fail(f"Seed failed with status {response.status_code}")
                self.failed += 1
                return False
        except Exception as e:
            print_fail(f"Error seeding: {e}")
            self.failed += 1
            return False
    
    def test_graph_stats(self):
        """Test graph statistics endpoint"""
        print_test("Testing graph statistics...")
        try:
            response = requests.get(f"{GRAPHRAG_URL}/stats", timeout=5)
            if response.status_code == 200:
                data = response.json()
                print_pass(f"Stats: {data['total_users']} users, {data['total_skills']} skills, {data['total_edges']} edges")
                self.passed += 1
                return True
            else:
                print_fail(f"Stats endpoint returned {response.status_code}")
                self.failed += 1
                return False
        except Exception as e:
            print_fail(f"Error: {e}")
            self.failed += 1
            return False
    
    def test_match_finding(self):
        """Test match finding algorithm"""
        print_test("Testing match finding (Machine Learning)...")
        try:
            payload = {
                "user_id": "u2",  # Priya wants to learn ML
                "skill_name": "Machine Learning",
                "limit": 5
            }
            response = requests.post(f"{GRAPHRAG_URL}/match/find", json=payload, timeout=10)
            
            if response.status_code == 200:
                matches = response.json()
                if len(matches) > 0:
                    print_pass(f"Found {len(matches)} matches")
                    # Print top match
                    top = matches[0]
                    print(f"      → Top match: {top['name']} ({top['email']}) - Score: {top.get('score', 'N/A')}")
                    self.passed += 1
                    return True
                else:
                    print_fail("No matches found (expected at least 1)")
                    self.failed += 1
                    return False
            else:
                print_fail(f"Match endpoint returned {response.status_code}")
                print(f"      → {response.text}")
                self.failed += 1
                return False
        except Exception as e:
            print_fail(f"Error: {e}")
            self.failed += 1
            return False
    
    def test_user_connections(self):
        """Test user connection retrieval"""
        print_test("Testing user connections (u1)...")
        try:
            response = requests.get(f"{GRAPHRAG_URL}/user/u1/connections", timeout=5)
            
            if response.status_code == 200:
                data = response.json()
                teaching = data.get('teaching', [])
                learning = data.get('learning', [])
                print_pass(f"User u1: Teaching {len(teaching)} skills, Learning {len(learning)} skills")
                self.passed += 1
                return True
            else:
                print_fail(f"Connections endpoint returned {response.status_code}")
                self.failed += 1
                return False
        except Exception as e:
            print_fail(f"Error: {e}")
            self.failed += 1
            return False
    
    def test_nonexistent_user(self):
        """Test 404 handling"""
        print_test("Testing error handling (nonexistent user)...")
        try:
            response = requests.get(f"{GRAPHRAG_URL}/user/nonexistent999/connections", timeout=5)
            
            if response.status_code == 404:
                print_pass("Correctly returns 404 for nonexistent user")
                self.passed += 1
                return True
            else:
                print_fail(f"Expected 404, got {response.status_code}")
                self.failed += 1
                return False
        except Exception as e:
            print_fail(f"Error: {e}")
            self.failed += 1
            return False
    
    def test_match_no_results(self):
        """Test matching with no results"""
        print_test("Testing empty match results...")
        try:
            payload = {
                "user_id": "u1",
                "skill_name": "NonExistentSkill123",
                "limit": 5
            }
            response = requests.post(f"{GRAPHRAG_URL}/match/find", json=payload, timeout=5)
            
            if response.status_code == 200:
                matches = response.json()
                if len(matches) == 0:
                    print_pass("Correctly returns empty array for unmatched skill")
                    self.passed += 1
                    return True
                else:
                    print_fail(f"Expected 0 matches, got {len(matches)}")
                    self.failed += 1
                    return False
            else:
                print_fail(f"Expected 200, got {response.status_code}")
                self.failed += 1
                return False
        except Exception as e:
            print_fail(f"Error: {e}")
            self.failed += 1
            return False
    
    def run_all_tests(self):
        """Run all integration tests"""
        print_section("SkillSync Integration Tests")
        
        # Phase 1: Service Health
        print_section("Phase 1: Service Health Check")
        if not self.check_graphrag_health():
            print(f"\n{Colors.RED}GraphRAG service is not running. Aborting tests.{Colors.END}")
            print(f"Start it with: {Colors.YELLOW}cd graphrag && uvicorn main:app --reload{Colors.END}\n")
            return
        
        # Phase 2: Data Setup
        print_section("Phase 2: Data Setup")
        self.seed_demo_data()
        time.sleep(0.5)  # Let graph rebuild
        self.test_graph_stats()
        
        # Phase 3: Core Functionality
        print_section("Phase 3: Core Matching Algorithm")
        self.test_match_finding()
        self.test_user_connections()
        
        # Phase 4: Edge Cases
        print_section("Phase 4: Edge Cases & Error Handling")
        self.test_nonexistent_user()
        self.test_match_no_results()
        
        # Summary
        self.print_summary()
    
    def print_summary(self):
        """Print test summary"""
        total = self.passed + self.failed
        pass_rate = (self.passed / total * 100) if total > 0 else 0
        
        print_section("Test Summary")
        print(f"Total Tests: {total}")
        print(f"{Colors.GREEN}Passed: {self.passed}{Colors.END}")
        print(f"{Colors.RED}Failed: {self.failed}{Colors.END}")
        print(f"Pass Rate: {pass_rate:.1f}%\n")
        
        if self.failed == 0:
            print(f"{Colors.BOLD}{Colors.GREEN}✅ ALL TESTS PASSED!{Colors.END}\n")
            sys.exit(0)
        else:
            print(f"{Colors.BOLD}{Colors.RED}❌ SOME TESTS FAILED{Colors.END}\n")
            sys.exit(1)


if __name__ == "__main__":
    tester = IntegrationTester()
    tester.run_all_tests()
