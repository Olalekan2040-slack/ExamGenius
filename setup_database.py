#!/usr/bin/env python3
"""
Quick Database Setup Script
Creates database tables automatically if they don't exist
Can be run manually or will run automatically on server startup
"""

import sys
import os
from pathlib import Path

# Add app to Python path
sys.path.insert(0, str(Path(__file__).parent))

def main():
    """Main function to initialize database"""
    print("🚀 ExamGenius Database Setup")
    print("=" * 50)
    
    try:
        from app.services.database_init import DatabaseInitService
        
        print("Checking database connection and schema...")
        result = DatabaseInitService.initialize_database()
        
        if result['status'] == 'success':
            print("\n✅ SUCCESS: Database schema created!")
            print(f"  - {result['tables_created']} tables ready")
            print("\n🔥 Ready to start server: uvicorn main:app --host 0.0.0.0 --port 8000")
            
        elif result['status'] == 'ready':
            print("\n✅ SUCCESS: Database already ready!")
            print("  - All tables exist and configured")
            print("\n🔥 Ready to start server: uvicorn main:app --host 0.0.0.0 --port 8000")
            
        else:
            print(f"\n❌ FAILED: {result['message']}")
            print("\n🔧 Check your DATABASE_URL in .env file")
            return False
        
        print("\n" + "=" * 50)
        return True
        
    except ImportError as e:
        print(f"❌ Import Error: {e}")
        print("Make sure you're in the project directory and dependencies are installed")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)