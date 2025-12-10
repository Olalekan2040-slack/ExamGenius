# ExamGenius API

Professional JAMB Exam Preparation Platform with AI-powered learning assistance.

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- pip (Python package manager)
- Virtual environment (recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd examgenius
   ```

2. **Create and activate virtual environment**
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate

   # Linux/Mac
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Initialize database**
   ```bash
   python scripts/init_db.py
   ```

6. **Run the application**
   ```bash
   # Development mode with auto-reload
   uvicorn main:app --reload

   # Production mode
   python main.py
   ```

7. **Access the API**
   - API Documentation: http://localhost:8000/docs
   - Alternative Docs: http://localhost:8000/redoc
   - API Base URL: http://localhost:8000/api/v1

## 📁 Project Structure

```
examgenius/
├── app/                          # Main application package
│   ├── api/                      # API layer
│   │   └── v1/                   # API version 1
│   │       ├── endpoints/        # API endpoint modules
│   │       │   ├── auth.py      # Authentication endpoints
│   │       │   ├── user.py      # User management
│   │       │   ├── profile.py   # User profile
│   │       │   ├── learn.py     # Learning modules
│   │       │   ├── year_practice.py  # Year practice
│   │       │   ├── cbt.py       # CBT exams
│   │       │   ├── dashboard.py # Analytics
│   │       │   └── jamb.py      # JAMB questions
│   │       └── api.py           # API router aggregator
│   ├── core/                     # Core functionality
│   │   ├── config.py            # Configuration settings
│   │   ├── security.py          # Authentication & security
│   │   └── dependencies.py      # Dependency injection
│   ├── db/                       # Database layer
│   │   └── database.py          # Database connections
│   ├── models/                   # Database models
│   ├── schemas/                  # Pydantic schemas
│   └── services/                 # Business logic
│       └── ai/                   # AI services
│           ├── gemini_service.py
│           └── email_service.py
├── docs/                         # Documentation
├── scripts/                      # Utility scripts
│   └── init_db.py               # Database initialization
├── tests/                        # Test suite
├── JAMB/                         # Study materials
├── main.py                       # Application entry point
├── requirements.txt              # Python dependencies
├── .env                          # Environment variables
├── .gitignore                    # Git ignore rules
└── README.md                     # This file
```

## 🔑 Key Features

- **Authentication & Authorization**: JWT-based secure authentication
- **User Management**: Complete user profile and settings management
- **AI-Powered Learning**: Google Gemini integration for personalized study
- **Practice Modes**: 
  - Topic-based learning
  - Year-wise practice
  - Full CBT simulation
- **Analytics Dashboard**: Track progress and performance
- **JAMB Question Bank**: 15 years of past questions (2010-2024)
- **10 Subjects**: Biology, Chemistry, Physics, Mathematics, English, Commerce, Economics, Government, CRK, Literature

## 📚 API Documentation

### Base URL
```
http://localhost:8000/api/v1
```

### Authentication
All protected endpoints require Bearer token:
```
Authorization: Bearer <your-jwt-token>
```

### Main Endpoints

#### Authentication (`/auth`)
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout user

#### Users (`/users`)
- `GET /users/me` - Get current user
- `PUT /users/me` - Update current user
- `DELETE /users/me` - Delete account

#### Profile (`/profile`)
- `POST /profile/setup` - Setup user profile
- `GET /profile` - Get profile
- `PUT /profile` - Update profile

#### Learn (`/learn`)
- `GET /learn/topics` - Get available topics
- `POST /learn/start` - Start learning session
- `POST /learn/submit` - Submit answers

#### Practice (`/year-practice`)
- `GET /year-practice/years` - Available years
- `POST /year-practice/start` - Start practice
- `POST /year-practice/submit` - Submit answers

#### CBT (`/cbt`)
- `POST /cbt/start` - Start CBT exam
- `POST /cbt/submit` - Submit exam
- `GET /cbt/results` - Get results

#### Dashboard (`/dashboard`)
- `GET /dashboard/stats` - User statistics
- `GET /dashboard/performance` - Performance metrics
- `GET /dashboard/history` - Practice history

## 🛠️ Development

### Code Style
- Follow PEP 8 guidelines
- Use type hints
- Document functions with docstrings

### Running Tests
```bash
pytest tests/
```

### Database Migrations
```bash
python scripts/init_db.py
```

## 🌍 Environment Variables

Required environment variables (`.env` file):

```env
# App Configuration
SECRET_KEY=your-secret-key-here
DEBUG=False

# Database
DATABASE_URL=sqlite:///./jamb_questions.db

# AI Service
GEMINI_API_KEY=your-gemini-api-key

# Email (Optional)
MAIL_USERNAME=your-email@example.com
MAIL_PASSWORD=your-email-password
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
```

## 📄 License

This project is proprietary software. All rights reserved.

## 👥 Contributors

ExamGenius Development Team

## 📞 Support

For support, email support@examgenius.com or open an issue in the repository.
