# SkillSync - Quick Start Guide

> Get SkillSync running locally or deploy to production in minutes

---

## 🚀 Local Development

### Prerequisites
- Node.js 20+ and npm
- Python 3.11+
- Git

### Quick Start (2 commands)

```bash
# Terminal 1: Start Backend
cd graphrag
python -m uvicorn main:app --reload

# Terminal 2: Start Frontend (in new terminal)
cd frontend
npm run dev
```

**URLs:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

### First Time Setup

```bash
# Clone repository
git clone https://github.com/your-username/skillsync.git
cd skillsync

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../graphrag
pip install -r requirements.txt

# Seed demo data (optional)
# Start backend first, then:
curl -X POST http://localhost:8000/demo/seed
```

---

## ☁️ Deploy to Production

### Option 1: Automated Script (Easiest)

```powershell
# Run deployment wizard
.\deploy.ps1
```

Select option:
1. Deploy Backend only
2. Deploy Frontend only  
3. Deploy Full Stack

### Option 2: Manual Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for detailed step-by-step instructions.

**Quick Links:**
- [Deploy to Vercel](https://vercel.com/new) (Frontend)
- [Deploy to Railway](https://railway.app/new) (Backend)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) (Database)

---

## 📁 Project Structure

```
skillsync/
├── frontend/          # Next.js app
│   ├── src/app/       # Pages & API routes
│   ├── src/components/# React components
│   └── package.json
│
├── graphrag/          # FastAPI backend
│   ├── main.py        # API server
│   ├── services/      # Business logic
│   └── requirements.txt
│
├── DEPLOYMENT.md      # Detailed deploy guide
├── PROJECT_REPORT.md  # Comprehensive docs
└── deploy.ps1         # Automated deploy
```

---

## 🎯 Key Features

- **AI-Powered Matching**: GraphRAG + Llama 3.3 for peer discovery
- **Social Network Analysis**: 1st/2nd/3rd degree connections
- **SRM Email Only**: Campus-verified students
- **Real-time Updates**: Live skill graph
- **Trust System**: Peer ratings & reviews

---

## 🧪 Testing

```bash
# Backend tests
cd graphrag
python -m pytest tests/ -v

# Integration tests (requires running servers)
python tests/test_e2e_integration.py
```

**Test Coverage:** 85% (15 tests passing)

---

## 🔧 Environment Variables

### Frontend (.env.local)

```env
NEXT_PUBLIC_GRAPHRAG_URL=http://localhost:8000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
MONGODB_URI=mongodb+srv://...
```

### Backend (graphrag/.env)

```env
MONGODB_URI=mongodb+srv://...
CORS_ORIGINS=http://localhost:3000
GROQ_API_KEY=gsk_...
```

---

## 📚 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deploy to production
- **[PROJECT_REPORT.md](./PROJECT_REPORT.md)** - Full project details
- **[README.md](./README.md)** - This file

---

## 🆘 Common Issues

### Port Already in Use
```bash
# Kill process on port 3000/8000
npx kill-port 3000
npx kill-port 8000
```

### Frontend Won't Start
```bash
cd frontend
rm -rf .next node_modules
npm install
npm run dev
```

### Backend 500 Errors
```bash
# Check MongoDB connection
# Verify MONGODB_URI in .env
# Use demo mode: Don't set MONGODB_URI
```

---

## 🎓 Built For

**SRM AP Students** - 10,000+ potential users

**Use Cases:**
- Find peer mentors for any skill
- Form hackathon teams
- Discover campus events
- Build study groups
- Share knowledge

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/XYZ`
3. Commit changes: `git commit -m 'Add XYZ'`
4. Push branch: `git push origin feature/XYZ`
5. Submit Pull Request

---

## 📄 License

MIT License - See LICENSE file

---

## 👥 Team

Built with 💙 for SRM AP Hackathon 2026

**Contact:** [Your Email]

---

## 🔗 Links

- **Live Demo:** https://skillsync.vercel.app (after deployment)
- **API Docs:** https://skillsync-api.railway.app/docs
- **GitHub:** https://github.com/your-username/skillsync

---

**⭐ Star this repo if you found it helpful!**
