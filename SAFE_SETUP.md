# Safe Setup Guide for SkillSync

This project has been archived and sanitized. Follow these steps to restore the environment and run the application.

## 1. Prerequisites
- **Node.js** (v18+)
- **Python** (v3.9+)
- **MongoDB Atlas Account**

## 2. Restore Environment Variables
The original `.env` files have been sanitized. You must create new ones with valid credentials.

### Backend (`backend/.env`)
Create a file named `.env` in the `backend/` directory:

```properties
HOST=0.0.0.0
PORT=8000
RELOAD=True

# Database (Get this from MongoDB Atlas)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/?appName=Cluster0

# AI Keys (Optional)
GROQ_API_KEY=your_key_here
```

### Frontend / Root (`.env`)
Create a `.env` file in the root `skillsync/` directory for Next.js:

```properties
MONGODB_URI=same_as_above
NEXTAUTH_SECRET=run_openssl_rand_base64_32
NEXTAUTH_URL=http://localhost:3000
```

## 3. Install Dependencies & Run

### Backend
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd skillsync
npm install
npm run dev
```

## Security Note
**NEVER** commit `.env` files to version control. The `.gitignore` is configured to prevent this, but always double-check.
