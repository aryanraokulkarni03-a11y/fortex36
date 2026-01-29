import requests
import sys

BASE_URL = "http://localhost:8000"

def run_check():
    print(f"Checking {BASE_URL}...")
    
    # 1. Health Check
    try:
        resp = requests.get(f"{BASE_URL}/health")
        print(f"Health: {resp.status_code} - {resp.json()}")
    except Exception as e:
        print(f"Health Check Failed: {e}")
        sys.exit(1)

    # 2. Seed Data
    print("\nSeeding Data...")
    try:
        resp = requests.post(f"{BASE_URL}/demo/seed")
        print(f"Seed: {resp.status_code} - {resp.json()}")
    except Exception as e:
        print(f"Seeding Failed: {e}")
        sys.exit(1)

    # 3. Check /events
    print("\nChecking /events...")
    resp = requests.get(f"{BASE_URL}/events")
    if resp.status_code == 200:
        events = resp.json()
        print(f"SUCCESS: Found {len(events)} events")
        for e in events:
            print(f" - {e['title']} ({e['date'] if 'date' in e else e.get('time')})")
    else:
        print(f"FAILED: /events returned {resp.status_code}")
        print(resp.text)

    # 4. Check /sessions
    print("\nChecking /sessions...")
    resp = requests.get(f"{BASE_URL}/sessions")
    if resp.status_code == 200:
        sessions = resp.json()
        print(f"SUCCESS: Found {len(sessions)} sessions")
    else:
        print(f"FAILED: /sessions returned {resp.status_code}")

if __name__ == "__main__":
    run_check()
