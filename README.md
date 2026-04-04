# 🚀 Developer Productivity Tracker

A full-stack developer productivity tracking application that automatically analyzes coding patterns and provides AI-powered insights.

![CI/CD](https://github.com/ThirumuruganR02/dev-productivity-tracker/actions/workflows/ci.yml/badge.svg)

## 🔥 Features
- 📊 Track coding sessions by language and duration
- 🧠 AI-powered productivity suggestions
- 🐙 GitHub commits and stats integration
- 📈 Real-time dashboard with charts
- 🐳 Fully containerized with Docker

## 🛠️ Tech Stack
- **Frontend**: React.js, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js, REST APIs
- **Database**: MongoDB Atlas
- **AI Analysis**: Python
- **DevOps**: Docker, GitHub Actions CI/CD
- **Version Control**: Git

## 🚀 Quick Start

### Prerequisites
- Node.js v20+
- Python 3.10+
- Docker Desktop
- MongoDB Atlas account

### Run with Docker
```bash
docker-compose up --build
```

### Run manually
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm start

# AI Analysis
cd ai
python analyzer.py
```

## 📊 API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/sessions | Log a coding session |
| GET | /api/sessions | Get all sessions |
| GET | /api/sessions/stats | Get productivity stats |
| GET | /api/github/stats | Get GitHub stats |
| GET | /api/github/commits | Get recent commits |

## 🧠 AI Features
- Detects your most productive coding hours
- Identifies your top programming language
- Scores your consistency (0-100)
- Gives personalized improvement suggestions

## 👨‍💻 Author
**Thirumurugan R** — [@ThirumuruganR02](https://github.com/ThirumuruganR02)
