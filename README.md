# SkillSync

> AI-Powered Peer Learning Network for SRM AP

## 🚀 Quick Start

```bash
# Frontend
cd frontend
npm install
npm run dev

# GraphRAG Microservice
cd graphrag
pip install -r requirements.txt
uvicorn main:app --reload
```

## 📁 Project Structure (3-Layer Architecture)

```
skillsync/
├── directives/          # Layer 1: What to do (SOPs)
│   ├── skillsync.md     # Master directive
│   ├── auth.md          # Authentication flow
│   ├── matching.md      # Peer matching logic
│   ├── events.md        # Event discovery
│   └── ratings.md       # Rating system
│
├── execution/           # Layer 3: Doing the work (Scripts)
│   ├── auth/            # Auth scripts
│   ├── graphrag/        # Graph matching scripts
│   ├── events/          # Event scripts
│   └── ratings/         # Rating scripts
│
├── frontend/            # Next.js app
├── graphrag/            # Python microservice
├── .tmp/                # Intermediate files (gitignored)
├── docs/                # Documentation
└── .env                 # Environment variables
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, TypeScript, Tailwind, shadcn/ui |
| Backend | Node.js, Express.js, MongoDB |
| AI | Groq (Llama 3.3), NetworkX, LangChain.js |
| Auth | NextAuth.js, JWT |
| Deploy | Vercel, MongoDB Atlas, Railway |

## 📋 Team Plan

See [SKILLSYNC_TEAM_PLAN.md](../SKILLSYNC_TEAM_PLAN.md) for:
- Team roles & responsibilities
- 36-hour sprint timeline
- Feature checklist
- Demo script

## 🔑 Environment Variables

Create `.env` file:

```env
# MongoDB
MONGODB_URI=mongodb+srv://...

# NextAuth
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000

# Groq
GROQ_API_KEY=gsk_...

# Email (for OTP)
EMAIL_SERVER=smtp://...
EMAIL_FROM=noreply@skillsync.app
```

## 📚 Directives

Read the directives before implementing:

1. `directives/skillsync.md` - Master overview
2. `directives/auth.md` - Authentication system
3. `directives/matching.md` - GraphRAG matching

## 🎯 The Pitch

> "At SRM AP, 10,000 students have skills to share but no way to find each other. srmapi.in shows YOUR data - SkillSync shows WHO can help you."

---

Made with 💙 for SRM AP Hackathon 2026
