# SkillSync

<div align="center">
  <h3>AI-Powered Peer Learning Network</h3>
  <p>Connect with the right mentor, master any skill. Powered by GraphRAG.</p>
  
  [![Frontend](https://img.shields.io/badge/Frontend-Next.js_14-black?style=flat-square&logo=next.js)](https://nextjs.org)
  [![Backend](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
  [![AI](https://img.shields.io/badge/AI-GraphRAG-blueviolet?style=flat-square)](https://github.com/microsoft/graphrag)
  [![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)
</div>

---


---
# SkillSync

> AI-Powered Peer Learning Network for SRM AP. Built this to solve the problem of finding study partners who actually know what they're doing.

## What this does: 
> SkillSync uses GraphRAG (graph-based retrieval augmented generation) to match students based on their actual skills, not just what courses they're taking. You tell it what you know and what you want to learn, and it connects you with people who can help or collaborate.
Main features:

- Smart matching using knowledge graphs and LLM reasoning
- Skill-based peer discovery (not just "who's in my class")
- Event coordination for study sessions and hackathons
- Peer rating system to keep quality high


## Project Structure 

```
skillsync/
├── directives/          # Implementation specs
│   ├── skillsync.md     # Master overview
│   ├── auth.md          # Authentication flow
│   ├── matching.md      # GraphRAG matching logic
│   ├── events.md        # Event system
│   └── ratings.md       # Rating mechanism
│
├── execution/           # Backend microservices
│   ├── auth/            # Auth service
│   ├── graphrag/        # AI matching engine
│   ├── events/          # Event management
│   └── ratings/         # Rating system
│
├── frontend/            # Next.js application
├── graphrag/            # Python GraphRAG service
├── .tmp/                # Temporary files
├── docs/                # Additional documentation
└── .env.example         # Environment variables template             
```

## Tech Stack - MERN & other requisites

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, TypeScript, Tailwind, shadcn/ui |
| Backend | Node.js, Express.js, MongoDB |
| AI | Groq (Llama 3.3), NetworkX, LangChain.js |
| Auth | NextAuth.js, JWT |
| Deploy | Vercel, MongoDB Atlas, Railway |


## Environment Variables

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

You'll need:
> MongoDB Atlas account (free tier works)
> , Groq API key (free, sign up at console.groq.com)
> , SMTP server for sending verification emails

## Current Status
This  is a working prototype built for SRM AP. The matching algorithm is solid, but there's room for optimization. Event coordination works, ratings system is functional.
Known issues:

> GraphRAG responses can be slow with large user bases (working on caching)
> , Need better error handling on the frontend
> , Mobile experience could use polish


Made by On-Sight for FORTEX36
|
