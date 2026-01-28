# SkillSync Setup Guide

## Prerequisites

- **Node.js** (v18+)
- **Python** (v3.11+)
- **Git**
- **MongoDB** (Optional, defaults to In-Memory Demo Mode)

## Quick Start (Windows)

We have provided a unified startup script for Windows users.

1. **Open PowerShell** in the project root.
2. **Run the script:**
   ```powershell
   .\scripts\start-dev.ps1
   ```
   This will:
   - Start the Python GraphRAG backend (Port 8000)
   - Start the Next.js Frontend (Port 3000)
   - Wait for health check
   - Automatically seed demo data

## Manual Setup

### 1. Backend (GraphRAG)

```bash
cd graphrag
# Create virtual environment
python -m venv venv
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run server
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### 2. Frontend (Next.js)

```bash
cd frontend
# Install dependencies
npm install

# Run dev server
npm run dev
```

### 3. Seed Data (Important!)

Since we use in-memory graphs for the demo, you must seed data every time you restart the backend.

```bash
curl -X POST http://localhost:8000/demo/seed
```

## Environment Variables

### Frontend (`frontend/.env`)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

### Backend (`graphrag/.env`)
Optional. Only needed if connecting to real MongoDB.
```
MONGODB_URI=mongodb://localhost:27017/skillsync
```
