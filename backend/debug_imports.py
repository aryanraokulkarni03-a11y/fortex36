try:
    from models import UserRegisterRequest
    print("Models imported successfully")
    from main import app
    print("Main app imported successfully")
except Exception as e:
    print(f"Import Error: {e}")
