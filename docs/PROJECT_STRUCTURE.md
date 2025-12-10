# ExamGenius Project Structure

## 📁 Complete Directory Tree

```
examgenius/
│
├── 📂 app/                          # Main application package
│   ├── __init__.py                 # Package initialization
│   │
│   ├── 📂 api/                     # API layer - all HTTP endpoints
│   │   ├── __init__.py
│   │   └── 📂 v1/                  # API version 1
│   │       ├── __init__.py
│   │       ├── api.py              # Router aggregator (combines all endpoints)
│   │       └── 📂 endpoints/       # Individual endpoint modules
│   │           ├── __init__.py
│   │           ├── auth.py         # Authentication endpoints (12 endpoints)
│   │           ├── user.py         # User management (8 endpoints)
│   │           ├── profile.py      # User profile setup (5 endpoints)
│   │           ├── learn.py        # Learning mode (5 endpoints)
│   │           ├── year_practice.py # Year-wise practice (3 endpoints)
│   │           ├── cbt.py          # CBT simulation (4 endpoints)
│   │           ├── dashboard.py    # Analytics dashboard (5 endpoints)
│   │           └── jamb.py         # JAMB questions (5 endpoints)
│   │
│   ├── 📂 core/                    # Core application functionality
│   │   ├── __init__.py
│   │   ├── config.py               # Configuration settings (environment variables)
│   │   ├── security.py             # Authentication & JWT handling
│   │   └── dependencies.py         # Dependency injection (DB, auth)
│   │
│   ├── 📂 db/                      # Database layer
│   │   ├── __init__.py
│   │   └── database.py             # Database connections & utilities
│   │
│   ├── 📂 models/                  # Database models (SQLAlchemy - future)
│   │   └── __init__.py
│   │
│   ├── 📂 schemas/                 # Pydantic validation schemas (future)
│   │   └── __init__.py
│   │
│   └── 📂 services/                # Business logic layer
│       ├── __init__.py
│       └── 📂 ai/                  # AI service integrations
│           ├── __init__.py
│           ├── gemini_service.py   # Google Gemini AI integration
│           └── email_service.py    # Email notification service
│
├── 📂 docs/                        # Documentation
│   ├── legacy/                     # Old documentation (archived)
│   └── (new documentation files will go here)
│
├── 📂 scripts/                     # Utility scripts
│   ├── __init__.py
│   └── init_db.py                  # Database initialization script
│
├── 📂 tests/                       # Test suite
│   ├── __init__.py
│   └── test_main.py                # Main application tests
│
├── 📂 JAMB/                        # Study materials (10 subjects)
│   ├── Biology/
│   ├── Chemistry/
│   ├── Physics/
│   ├── Mathematics/
│   ├── English/
│   ├── Commerce/
│   ├── Economics/
│   ├── Government/
│   ├── CRK/
│   └── Literature/
│
├── 📂 venv/                        # Virtual environment (not in git)
│
├── 📄 main.py                      # Application entry point
├── 📄 requirements.txt             # Python dependencies
├── 📄 setup.py                     # Package setup configuration
├── 📄 pyproject.toml               # Modern Python project config
├── 📄 Makefile                     # Common development tasks
├── 📄 Dockerfile                   # Docker container definition
├── 📄 docker-compose.yml           # Docker Compose configuration
├── 📄 .env                         # Environment variables (not in git)
├── 📄 .env.example                 # Environment template
├── 📄 .gitignore                   # Git ignore rules
├── 📄 LICENSE                      # MIT License
├── 📄 README.md                    # Project overview
├── 📄 CONTRIBUTING.md              # Contribution guidelines
└── 📄 jamb_questions.db            # SQLite database (not in git)
```

## 🎯 Layer Responsibilities

### 1️⃣ **API Layer** (`app/api/v1/`)
- **Purpose**: Handle HTTP requests and responses
- **Responsibilities**:
  - Request validation
  - Response formatting
  - Route definitions
  - OpenAPI documentation
- **Files**: 8 endpoint modules + 1 aggregator

### 2️⃣ **Core Layer** (`app/core/`)
- **Purpose**: Application-wide utilities
- **Responsibilities**:
  - Configuration management
  - Security & authentication
  - Dependency injection
  - Common utilities
- **Files**: 3 core modules

### 3️⃣ **Database Layer** (`app/db/`)
- **Purpose**: Data persistence
- **Responsibilities**:
  - Database connections
  - Query execution
  - Transaction management
- **Files**: 1 database module

### 4️⃣ **Services Layer** (`app/services/`)
- **Purpose**: Business logic
- **Responsibilities**:
  - AI integration
  - Email services
  - External API calls
  - Complex business rules
- **Files**: 2 service modules

### 5️⃣ **Models Layer** (`app/models/`)
- **Purpose**: Data structures (future expansion)
- **Responsibilities**:
  - ORM models
  - Data validation
  - Database schema
- **Status**: Prepared for future use

### 6️⃣ **Schemas Layer** (`app/schemas/`)
- **Purpose**: API contracts (future expansion)
- **Responsibilities**:
  - Request/response models
  - Data validation
  - Serialization
- **Status**: Prepared for future use

## 🔄 Request Flow

```
1. Client Request
   ↓
2. main.py (FastAPI app)
   ↓
3. app/api/v1/api.py (Router aggregator)
   ↓
4. app/api/v1/endpoints/{module}.py (Endpoint handler)
   ↓
5. app/core/dependencies.py (Authentication, DB)
   ↓
6. app/services/ (Business logic)
   ↓
7. app/db/database.py (Data access)
   ↓
8. Response
```

## 📊 File Statistics

| Category | Count | Purpose |
|----------|-------|---------|
| API Endpoints | 8 files | HTTP routes |
| Core Modules | 3 files | Application core |
| Services | 2 files | Business logic |
| Scripts | 1 file | Utilities |
| Tests | 1 file | Testing |
| Config Files | 8 files | Setup & deployment |
| Documentation | 4+ files | Guides & references |

## 🌟 Professional Standards Followed

### ✅ **Package Structure**
- Clear separation of concerns
- Logical grouping of related modules
- Standard Python package layout
- `__init__.py` in all packages

### ✅ **Configuration Management**
- Environment-based configuration
- `.env` file for secrets
- Type-safe settings with Pydantic
- Example configuration provided

### ✅ **Documentation**
- Comprehensive README
- Architecture documentation
- API documentation (auto-generated)
- Contributing guidelines

### ✅ **Development Tools**
- Makefile for common tasks
- Docker support
- Testing framework
- Code quality tools (black, mypy, flake8)

### ✅ **Version Control**
- Proper `.gitignore`
- Sensitive files excluded
- Clean repository structure

### ✅ **Deployment Ready**
- Docker containerization
- Docker Compose for orchestration
- Health check endpoints
- Production configuration

## 🚀 Getting Started

1. **Install dependencies**: `make install` or `pip install -r requirements.txt`
2. **Setup environment**: Copy `.env.example` to `.env`
3. **Initialize database**: `make init-db` or `python scripts/init_db.py`
4. **Run server**: `make run` or `uvicorn main:app --reload`
5. **Access docs**: http://localhost:8000/docs

## 📈 Future Structure Additions

As the project grows, you might add:

```
app/
├── middleware/          # Custom middleware
├── utils/              # Helper functions
├── exceptions/         # Custom exceptions
├── constants/          # Application constants
└── validators/         # Custom validators

tests/
├── unit/              # Unit tests
├── integration/       # Integration tests
└── e2e/              # End-to-end tests
```

## 🎓 Learning Resources

This structure follows patterns from:
- **FastAPI**: Modern Python web framework
- **Django**: Mature Python web framework
- **Flask**: Lightweight Python framework
- **Clean Architecture**: Robert C. Martin
- **Domain-Driven Design**: Eric Evans

## 📝 Notes

- All `__init__.py` files mark directories as Python packages
- Version 1 API is in `v1/` to allow future versioning
- Services are separated from API logic for testability
- Configuration is centralized for easy management
- Professional naming conventions throughout
