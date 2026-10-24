# EduLab ExamPrep - Quick Reference Guide

## 🎯 Project at a Glance

**EduLab ExamPrep** is a world-class JAMB exam preparation platform following enterprise-grade Python project standards.

## 📊 Project Statistics

- **Total Endpoints**: 47 unique API endpoints
- **API Version**: v1 (with versioning support)
- **Subjects**: 10 (Biology, Chemistry, Physics, Math, English, Commerce, Economics, Government, CRK, Literature)
- **Question Bank**: 15 years (2010-2024)
- **Architecture**: Layered architecture with clean separation

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                        │
│            (Web, Mobile, Third-party Apps)              │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                  API LAYER (v1)                         │
│     /api/v1/{auth, users, profile, learn, etc.}        │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│               BUSINESS LOGIC LAYER                      │
│              (Services: AI, Email)                      │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                  DATA LAYER                             │
│            (SQLite → PostgreSQL ready)                  │
└─────────────────────────────────────────────────────────┘
```

## 📁 Directory Structure (Simplified)

```
examgenius/
├── app/                    # Application code
│   ├── api/v1/            # Versioned API endpoints
│   ├── core/              # Core utilities & config
│   ├── db/                # Database layer
│   ├── models/            # Data models (future)
│   ├── schemas/           # Pydantic schemas (future)
│   └── services/          # Business logic
├── docs/                  # Documentation
├── scripts/               # Utility scripts
├── tests/                 # Test suite
├── main.py               # Entry point
└── requirements.txt      # Dependencies
```

## 🚀 Quick Start Commands

### Installation
```bash
# Clone and setup
git clone <repo>
cd examgenius
python -m venv venv
source venv/bin/activate  # Windows: .\venv\Scripts\activate
pip install -r requirements.txt

# Configure
cp .env.example .env
# Edit .env with your settings

# Initialize
python scripts/init_db.py
```

### Development
```bash
# Run server
uvicorn main:app --reload

# Run tests
pytest tests/ -v

# Format code
black app/ tests/

# Check types
mypy app/
```

### Docker
```bash
# Build and run
docker-compose up --build

# Run in background
docker-compose up -d

# Stop
docker-compose down
```

## 🔑 Environment Variables

Create `.env` file with:

```env
SECRET_KEY=your-secret-key
GEMINI_API_KEY=your-gemini-key
DATABASE_URL=sqlite:///./jamb_questions.db
DEBUG=False
```

## 📡 API Endpoints Summary

### Authentication (`/api/v1/auth`)
- Register, Login, Refresh Token, Logout
- Password Reset, Email Verification

### Users (`/api/v1/users`)
- Get/Update/Delete User
- User Statistics

### Profile (`/api/v1/profile`)
- Setup, Update Profile
- Subject Selection

### Learning (`/api/v1/learn`)
- Topic-based Learning
- AI-powered Hints

### Practice (`/api/v1/year-practice`)
- Year-wise Practice
- Performance Tracking

### CBT (`/api/v1/cbt`)
- Full Exam Simulation
- Timed Tests

### Dashboard (`/api/v1/dashboard`)
- Analytics & Stats
- Progress Tracking

### JAMB (`/api/v1/jamb`)
- Question Bank Access
- Filters & Search

## 🎨 Design Patterns Used

| Pattern | Location | Purpose |
|---------|----------|---------|
| **Factory** | `main.py` | App creation |
| **Dependency Injection** | `app/core/dependencies.py` | Loose coupling |
| **Repository** | `app/db/` | Data access |
| **Service Layer** | `app/services/` | Business logic |
| **Layered Architecture** | Overall | Separation of concerns |

## 🔐 Security Features

- ✅ JWT Authentication (access + refresh tokens)
- ✅ Argon2 Password Hashing
- ✅ CORS Configuration
- ✅ Rate Limiting
- ✅ Input Validation (Pydantic)
- ✅ SQL Injection Prevention
- ✅ Environment-based Secrets

## 📊 Database Schema

```
users
├── id (PRIMARY KEY)
├── email (UNIQUE)
├── password_hash
├── created_at
└── is_active

profiles
├── user_id (FOREIGN KEY)
├── target_score
├── exam_date
└── selected_subjects (JSON)

progress
├── user_id (FOREIGN KEY)
├── subject
├── topic
├── score
└── timestamp

cbt_sessions
├── id (PRIMARY KEY)
├── user_id (FOREIGN KEY)
├── start_time
├── end_time
├── score
└── answers (JSON)
```

## 🧪 Testing

```bash
# Run all tests
pytest tests/

# With coverage
pytest tests/ --cov=app --cov-report=html

# Specific test
pytest tests/test_main.py::test_root_endpoint
```

## 📦 Deployment Options

### Option 1: Traditional Server
```bash
# Install dependencies
pip install -r requirements.txt

# Run with gunicorn (production)
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Option 2: Docker
```bash
docker build -t examgenius .
docker run -p 8000:8000 examgenius
```

### Option 3: Cloud Platforms
- **AWS**: Elastic Beanstalk, ECS, Lambda
- **Google Cloud**: Cloud Run, App Engine
- **Azure**: App Service, Container Instances
- **Heroku**: Simple git push deployment

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `.env` | Environment variables (secrets) |
| `requirements.txt` | Python dependencies |
| `pyproject.toml` | Modern Python config |
| `setup.py` | Package installation |
| `Dockerfile` | Container definition |
| `docker-compose.yml` | Multi-container setup |
| `Makefile` | Common tasks |

## 📈 Performance Targets

- API Response: < 200ms (p95)
- Database Query: < 50ms
- AI Response: < 2s
- Uptime: 99.9%

## 🛠️ Development Tools

### Code Quality
- **Black**: Code formatting
- **Flake8**: Linting
- **MyPy**: Type checking
- **Pytest**: Testing
- **Pre-commit**: Git hooks

### Monitoring (Future)
- **Sentry**: Error tracking
- **Prometheus**: Metrics
- **Grafana**: Dashboards
- **ELK Stack**: Logging

## 📚 Documentation URLs

- **API Docs**: http://localhost:8000/docs (Swagger UI)
- **Alternative Docs**: http://localhost:8000/redoc (ReDoc)
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/name`
3. Commit changes: `git commit -m "Add feature"`
4. Push to branch: `git push origin feature/name`
5. Create Pull Request

See [CONTRIBUTING.md](../CONTRIBUTING.md) for details.

## 📞 Support & Resources

- **Documentation**: `docs/` folder
- **Issues**: GitHub Issues
- **Email**: support@examgenius.com

## 🎯 Roadmap

### v1.1 (Next)
- [ ] PostgreSQL support
- [ ] Redis caching
- [ ] WebSocket real-time updates

### v2.0 (Future)
- [ ] Microservices architecture
- [ ] Advanced analytics
- [ ] Mobile app integration

### v3.0 (Vision)
- [ ] Multi-region deployment
- [ ] Advanced ML models
- [ ] Gamification features

## 📝 License

This project is licensed under the MIT License - see [LICENSE](../LICENSE) file.

---

**Built with ❤️ following world-class Python standards**

*EduLab ExamPrep Team © 2025*
