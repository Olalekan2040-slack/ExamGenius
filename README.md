<div align="center">

# 🎓 EduLab ExamPrep

### **AI-Powered JAMB Exam Mastery Platform**
*Interactive learning, real-time AI tutoring, and comprehensive practice for Nigerian students.*

[![Python 3.8+](https://img.shields.io/badge/python-3.8%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/fastapi-0.95%2B-green.svg)](https://fastapi.tiangolo.com/)
[![License: Proprietary](https://img.shields.io/badge/license-proprietary-red.svg)](#license)
[![GitHub Stars](https://img.shields.io/github/stars/Olalekan2040-slack/ExamGenius?style=social)](https://github.com/Olalekan2040-slack/ExamGenius)

[Quick Start](#-quick-start) • [Features](#-features) • [API Docs](#-api-documentation) • [Contributing](#-contributing) • [Support](#-support)

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🧠 **Interactive Learning**
- AI-powered lesson generation (English & Pidgin)
- Real-time AI tutor with conversation history
- Context-aware explanations
- Mobile-responsive design

</td>
<td width="50%">

### 📊 **Comprehensive Practice**
- Topic-based targeted practice
- Year-wise past papers (2010-2024)
- Full CBT simulation
- Instant feedback & explanations

</td>
</tr>
<tr>
<td width="50%">

### 📈 **Progress Tracking**
- Real-time performance analytics
- Accuracy metrics per topic
- Learning streaks & achievements
- Detailed practice history

</td>
<td width="50%">

### 🔐 **Secure & Scalable**
- JWT-based authentication
- PostgreSQL database with optimized queries
- OpenRouter AI integration (DeepSeek V3.2)
- Production-ready architecture

</td>
</tr>
</table>

### 📚 **Complete Question Bank**
- **15 Years** of JAMB past questions (2010-2024)
- **10 Subjects** covered:
  - Biology | Chemistry | Physics | Mathematics
  - English Language | Commerce | Economics
  - Government | CRK | Literature

---

## 🚀 Quick Start

### Prerequisites
```
✓ Python 3.8+
✓ pip (package manager)
✓ PostgreSQL 13+
✓ Git
✓ OpenRouter API Key (for AI features)
```

### 1️⃣ Clone & Setup
```bash
# Clone repository
git clone https://github.com/Olalekan2040-slack/ExamGenius.git
cd EduLab ExamPrep

# Create virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1  # Windows PowerShell
# or
source venv/bin/activate    # Linux/Mac

# Install dependencies
pip install -r requirements.txt
```

### 2️⃣ Configure Environment
Create `.env` in the project root:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/ExamgeniusDB
OPENROUTER_API_KEY=sk-your-key-here
SECRET_KEY=your-secret-key-here
DEBUG=False
```

### 3️⃣ Database Setup (Automatic!)
```bash
# Database tables are created automatically on first server start!
# No manual database setup required ✨

# Optional: Run manual database setup if preferred
python setup_database.py
```

### 4️⃣ Run Application
```bash
# Start Backend (Port 8000) - Database tables auto-created on startup!
uvicorn main:app --host 0.0.0.0 --port 8000

# Access your application:
# Frontend: http://localhost:8000 (served by FastAPI)
# API Docs: http://localhost:8000/docs
python -m http.server 8080
```

### 5️⃣ Access Application
```
Frontend:  http://localhost:8080
Backend:   http://localhost:8000
API Docs:  http://localhost:8000/docs
```

---

## 📁 Project Architecture

```
examgenius/
├── 📂 app/
│   ├── api/v1/endpoints/
│   │   ├── auth.py              # User authentication (JWT)
│   │   ├── learn.py             # Topics, lessons, AI tutor
│   │   ├── cbt.py               # CBT exam sessions
│   │   ├── year_practice.py      # Year-wise practice
│   │   ├── dashboard.py          # User analytics
│   │   └── jamb.py              # Public question retrieval
│   ├── services/ai/
│   │   └── gemini_service.py     # DeepSeek via OpenRouter
│   ├── db/database.py            # PostgreSQL connection
│   └── core/security.py          # JWT & auth logic
├── 📂 frontend/
│   ├── js/
│   │   ├── api.js               # API client with error handling
│   │   └── screens/learn.js      # Interactive learn UI
│   ├── styles/
│   │   └── main.css              # Responsive design
│   └── index.html                # Entry point
├── 📂 past_questions/            # JAMB JSON data
├── main.py                       # FastAPI entry point
├── requirements.txt              # Python dependencies
├── .env                          # Environment config
├── .gitignore                    # Git rules
└── README.md                     # This file
```

---

## 🔌 API Documentation

### **Base URL**
```
http://localhost:8000/api/v1
```

### **Authentication**
All protected endpoints require a Bearer token:
```http
Authorization: Bearer your_jwt_access_token
```

### **Core Endpoints**

<details>
<summary><b>🔐 Authentication</b></summary>

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/register` | POST | Create new user account |
| `/auth/login` | POST | Login & get JWT tokens |
| `/auth/refresh` | POST | Refresh access token |
| `/auth/logout` | POST | Logout & invalidate token |
| `/auth/request-reset` | POST | Request password reset |
| `/auth/reset-password` | POST | Reset password with token |

</details>

<details>
<summary><b>📖 Learning Endpoints</b></summary>

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/learn/topics/{subject}` | GET | Get topics with stats |
| `/learn/lesson/{subject}/{topic}` | GET | Get cached/AI lesson |
| `/learn/questions/{subject}/{topic}` | GET | Get practice questions |
| `/learn/practice/topic/submit` | POST | Submit answers & grade |
| `/learn/ask-tutor` | POST | AI tutor chat |

</details>

<details>
<summary><b>📚 Practice Endpoints</b></summary>

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/year-practice/info` | GET | Available years & subjects |
| `/year-practice/questions` | GET | Year-specific questions |
| `/year-practice/submit` | POST | Submit year practice |
| `/cbt/create` | POST | Start CBT session |
| `/cbt/{session_id}/questions` | GET | Get CBT questions |
| `/cbt/{session_id}/submit` | POST | Submit CBT exam |

</details>

<details>
<summary><b>👤 User Endpoints</b></summary>

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/users/me` | GET | Get current user |
| `/users/me` | PUT | Update profile |
| `/users/avatar` | POST | Upload profile picture |
| `/dashboard/stats` | GET | User performance metrics |

</details>

### **Example Request**
```bash
curl -X GET "http://localhost:8000/api/v1/learn/topics/Biology" \
  -H "Authorization: Bearer your_token" \
  -H "Content-Type: application/json"
```

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Backend** | FastAPI, Pydantic | Modern async REST API |
| **Database** | PostgreSQL | Reliable, production-grade DB |
| **AI** | OpenRouter (DeepSeek V3.2) | LLM for lessons & tutoring |
| **Frontend** | Vanilla JS, HTML5, CSS3 | Lightweight, responsive UI |
| **Auth** | JWT (PyJWT) | Secure token-based auth |

---

## 🎯 Key Workflows

### **Interactive Learning Flow**
```
1. User selects Subject → 
2. Selects Topic → 
3. Views AI-generated Lesson (cached) → 
4. Chats with AI Tutor (context-aware) → 
5. Takes Practice Quiz → 
6. Gets instant grading + explanations
```

### **CBT Exam Flow**
```
1. Create session (select subjects) →
2. Answer questions (timed/untimed) →
3. Submit exam →
4. View detailed results & analytics
```

---

## ⚙️ Configuration

### **Environment Variables**
```env
# AI & API
OPENROUTER_API_KEY=sk-...
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

# Security
SECRET_KEY=your-256-bit-secret-key
DEBUG=False

# Database (PostgreSQL)
DATABASE_URL=postgresql://user:password@localhost:5432/ExamgeniusDB

# Optional: Email
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

---

## 📊 Database Schema

**Key Tables:**
- `users` — User accounts & auth
- `questions` — JAMB question bank (15 years)
- `options` — Multiple choice options
- `topic_lessons` — Cached AI lessons
- `practice_attempts` — User answer history
- `user_stats` — Performance metrics per topic
- `user_streaks` — Daily learning streaks
- `cbt_sessions` — CBT exam sessions

---

## 🧪 Development

### **Code Style**
```
✓ PEP 8 compliant
✓ Type hints required
✓ Docstrings for all functions
✓ Async/await for I/O operations
```

### **Running Tests** (when added)
```bash
pytest tests/ -v --cov
```

### **Debugging**
```bash
# Enable debug logging
DEBUG=True uvicorn main:app --reload --log-level debug
```

---

## 🚨 Troubleshooting

| Issue | Solution |
|-------|----------|
| `[object Object]` errors | Check `frontend/js/api.js` error handler; verify API response |
| 422 Validation Error | Ensure `question_id` is sent in practice submission |
| AI tutor fails | Verify `OPENROUTER_API_KEY` is set & accessible |
| Database connection failed | Check PostgreSQL is running and DATABASE_URL in .env is correct |
| CORS errors | Adjust CORS settings in `main.py` if needed |

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request to `master`

### **Guidelines**
- Keep PRs focused & scoped
- Include tests for new features
- Update documentation
- Follow code style guidelines

---

## 📄 License

This project is **proprietary software**. All rights reserved.

For licensing inquiries, contact the development team.

---

## 🆘 Support & Community

| Channel | Link |
|---------|------|
| **Issues** | [GitHub Issues](https://github.com/Olalekan2040-slack/ExamGenius/issues) |
| **Discussions** | [GitHub Discussions](https://github.com/Olalekan2040-slack/ExamGenius/discussions) |
| **Email** | support@examgenius.com |

---

## 📈 Roadmap

- [ ] Mobile app (React Native)
- [ ] Voice-based tutoring
- [ ] Spaced repetition algorithm
- [ ] Social study groups
- [ ] Offline mode
- [ ] Advanced analytics dashboard

---

## 👨‍💻 Team

**EduLab ExamPrep Development Team**
- Lead Developer: [@Olalekan2040-slack](https://github.com/Olalekan2040-slack)

---

<div align="center">

### ⭐ If this project helped you, please give it a star!

[Report Issue](https://github.com/Olalekan2040-slack/ExamGenius/issues) • [Request Feature](https://github.com/Olalekan2040-slack/ExamGenius/issues/new) • [Email Support](mailto:support@examgenius.com)

**Made with ❤️ for Nigerian Students**

</div>
