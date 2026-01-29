import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv("graphrag/.env")

async def test_connect():
    uri = os.getenv("MONGODB_URI")
    print(f"Testing URI: {uri[:20]}...") 
    
    if not uri:
        print("ERROR: No MONGODB_URI found")
        return

    try:
        client = AsyncIOMotorClient(uri, serverSelectionTimeoutMS=5000)
        print("Attempting to connect...")
        await client.admin.command('ping')
        print("SUCCESS! Connected to MongoDB.")
    except Exception as e:
        print(f"CONNECTION FAILED: {e}")

if __name__ == "__main__":
    asyncio.run(test_connect())
