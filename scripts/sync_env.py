import os

def sync_envs():
    frontend_path = "frontend/.env.local"
    backend_path = "graphrag/.env"
    
    print(f"Reading {frontend_path}...")
    try:
        with open(frontend_path, "r") as f:
            frontend_lines = f.readlines()
    except FileNotFoundError:
        print(f"ERROR: {frontend_path} not found")
        return

    mongo_uri = ""
    for line in frontend_lines:
        if line.strip().startswith("MONGODB_URI="):
            parts = line.split("=", 1)
            if len(parts) > 1:
                mongo_uri = parts[1].strip()
            break
            
    if not mongo_uri:
        print("ERROR: MONGODB_URI is empty or missing in frontend/.env.local")
        print("Please ensure you have pasted the connection string and SAVED the file.")
        return

    print("Found MONGODB_URI (masked): " + mongo_uri[:10] + "...")

    print(f"Updating {backend_path}...")
    try:
        with open(backend_path, "r") as f:
            backend_lines = f.readlines()
    except FileNotFoundError:
        print(f"Creating {backend_path}...")
        backend_lines = []

    new_lines = []
    uri_updated = False
    
    for line in backend_lines:
        if line.strip().startswith("MONGODB_URI="):
            new_lines.append(f"MONGODB_URI={mongo_uri}\n")
            uri_updated = True
        else:
            new_lines.append(line)
            
    if not uri_updated:
        new_lines.append(f"\nMONGODB_URI={mongo_uri}\n")

    with open(backend_path, "w") as f:
        f.writelines(new_lines)
        
    print("SUCCESS: Synced MONGODB_URI to backend config.")

if __name__ == "__main__":
    sync_envs()
