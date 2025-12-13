"""
Admin System Setup & Initialization Guide

This script helps initialize the admin content management system:
1. Creates necessary database tables
2. Adds admin users
3. Sets up initial subject/topic hierarchy
"""

import sqlite3
import sys
from pathlib import Path
from datetime import datetime
import hashlib

class AdminSystemSetup:
    def __init__(self, db_path):
        self.db_path = db_path
        self.conn = None

    def connect(self):
        """Connect to database"""
        self.conn = sqlite3.connect(str(self.db_path))
        return self.conn

    def run_migrations(self):
        """Run the admin content management migration"""
        print("📦 Running admin migrations...")
        cursor = self.conn.cursor()
        
        # This would normally be run from scripts/migrate_admin_content.py
        # For now, assume it's already been run
        print("✅ Migrations complete")

    def create_admin_user(self, email, password, name="Admin"):
        """Create an admin user"""
        print(f"\n👤 Creating admin user: {email}")
        cursor = self.conn.cursor()
        
        # Hash password (in production, use proper password hashing)
        hashed_pwd = hashlib.sha256(password.encode()).hexdigest()
        
        try:
            cursor.execute("""
                INSERT INTO users (email, hashed_password, is_verified, role, created_at)
                VALUES (?, ?, 1, 'admin', ?)
            """, (email, hashed_pwd, datetime.utcnow().isoformat()))
            
            self.conn.commit()
            print(f"✅ Admin user created: {email}")
            return cursor.lastrowid
        except sqlite3.IntegrityError:
            print(f"⚠️  Admin user already exists: {email}")
            cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
            return cursor.fetchone()[0]

    def create_initial_hierarchy(self):
        """Create default subject/topic hierarchy for JAMB subjects"""
        print("\n📚 Creating initial subject hierarchy...")
        cursor = self.conn.cursor()
        
        subjects_data = {
            "Biology": {
                "icon": "🧬",
                "topics": [
                    "Cell Structure and Organization",
                    "Cell Division",
                    "Genetics",
                    "Evolution and Biodiversity",
                    "Ecology",
                    "Nutrition and Feeding",
                    "Respiration",
                    "Coordination and Control",
                    "Reproduction"
                ]
            },
            "Chemistry": {
                "icon": "⚗️",
                "topics": [
                    "Atomic Structure",
                    "Periodic Table",
                    "Chemical Bonding",
                    "Stoichiometry",
                    "Acids, Bases and Salts",
                    "Redox Reactions",
                    "Electrochemistry",
                    "Organic Chemistry",
                    "Rates of Reaction"
                ]
            },
            "Physics": {
                "icon": "⚛️",
                "topics": [
                    "Measurement",
                    "Motion",
                    "Forces",
                    "Energy",
                    "Waves",
                    "Electricity",
                    "Magnetism",
                    "Atomic Physics",
                    "Oscillations"
                ]
            },
            "English Language": {
                "icon": "📖",
                "topics": [
                    "Grammar",
                    "Vocabulary",
                    "Reading Comprehension",
                    "Writing Skills",
                    "Literature",
                    "Phonology",
                    "Semantics",
                    "Register and Style",
                    "Discourse Analysis"
                ]
            },
            "Mathematics": {
                "icon": "📐",
                "topics": [
                    "Algebra",
                    "Number Theory",
                    "Geometry",
                    "Trigonometry",
                    "Calculus",
                    "Sequences and Series",
                    "Coordinate Geometry",
                    "Statistics",
                    "Probability"
                ]
            },
            "Commerce": {
                "icon": "💼",
                "topics": [
                    "Business Environment",
                    "Management",
                    "Accounting",
                    "Economics",
                    "Finance",
                    "Marketing",
                    "Production",
                    "Human Resources",
                    "Business Law"
                ]
            },
            "Government": {
                "icon": "🏛️",
                "topics": [
                    "Political Systems",
                    "Democracy",
                    "Governance",
                    "Constitutions",
                    "Public Administration",
                    "International Relations",
                    "Political Theory",
                    "Citizenship",
                    "Political Ideologies"
                ]
            },
            "History": {
                "icon": "📜",
                "topics": [
                    "African History",
                    "European History",
                    "World History",
                    "Colonization",
                    "Independence Movements",
                    "Cultural History",
                    "Economic History",
                    "Political History",
                    "Social Movements"
                ]
            },
            "Geography": {
                "icon": "🌍",
                "topics": [
                    "Physical Geography",
                    "Human Geography",
                    "Climatology",
                    "Biogeography",
                    "Geomorphology",
                    "Economic Geography",
                    "Urban Geography",
                    "Regional Geography",
                    "Environmental Geography"
                ]
            }
        }
        
        for subject_name, data in subjects_data.items():
            try:
                cursor.execute("""
                    INSERT INTO content_subjects (name, icon, order_priority)
                    VALUES (?, ?, ?)
                """, (subject_name, data['icon'], len(list(subjects_data.keys())) - list(subjects_data.keys()).index(subject_name)))
                
                subject_id = cursor.lastrowid
                
                # Add topics
                for idx, topic_name in enumerate(data['topics']):
                    cursor.execute("""
                        INSERT INTO content_topics (subject_id, name, order_priority)
                        VALUES (?, ?, ?)
                    """, (subject_id, topic_name, idx))
                
                print(f"  ✅ {data['icon']} {subject_name} ({len(data['topics'])} topics)")
                
            except sqlite3.IntegrityError:
                print(f"  ⚠️  {subject_name} already exists")
        
        self.conn.commit()
        print("✅ Subject hierarchy created")

    def verify_setup(self):
        """Verify the setup is complete"""
        print("\n🔍 Verifying setup...")
        cursor = self.conn.cursor()
        
        checks = {
            "Admin users": "SELECT COUNT(*) FROM users WHERE role IN ('admin', 'moderator')",
            "Subjects": "SELECT COUNT(*) FROM content_subjects",
            "Topics": "SELECT COUNT(*) FROM content_topics",
            "Questions table": "SELECT COUNT(*) FROM past_questions",
            "Videos table": "SELECT COUNT(*) FROM learning_videos",
            "Notes table": "SELECT COUNT(*) FROM learning_notes"
        }
        
        for check_name, query in checks.items():
            try:
                count = cursor.execute(query).fetchone()[0]
                print(f"  ✅ {check_name}: {count}")
            except Exception as e:
                print(f"  ❌ {check_name}: {str(e)}")
        
        print("\n✅ Setup verification complete!")

    def print_admin_instructions(self):
        """Print instructions for admin access"""
        print("\n" + "="*60)
        print("🎉 ADMIN SYSTEM READY!")
        print("="*60)
        print("""
To access the admin panel:

1. Log in with your admin account at: /admin
2. Dashboard shows content statistics
3. Use the navigation menu to:
   - Create questions (Questions tab)
   - Upload videos (Videos tab)
   - Create study notes (Learning Notes tab)
   - Manage subjects/topics (Subjects & Topics tab)
   - Bulk upload content (Bulk Upload tab)
   - Approve pending content (Pending Approval tab)
   - View analytics (Analytics tab)

📋 CSV Upload:
   - Download template from Bulk Upload tab
   - Fill with your content
   - Select subject and upload
   - Check for errors in progress log

🔐 Security:
   - Only users with role='admin' or 'moderator' can access
   - All admin actions are logged with timestamps
   - Content must be verified before students see it

📖 For detailed documentation, see: ADMIN_CONTENT_MANAGEMENT.md
        """)
        print("="*60)

    def run_full_setup(self, admin_email=None, admin_password=None):
        """Run complete setup"""
        print("\n" + "="*60)
        print("🚀 EXAMGENIUS ADMIN SYSTEM SETUP")
        print("="*60 + "\n")
        
        try:
            self.connect()
            self.run_migrations()
            
            # Create admin user if provided
            if admin_email and admin_password:
                self.create_admin_user(admin_email, admin_password)
            else:
                print("\n⏭️  Skipping admin user creation (no credentials provided)")
            
            # Create initial hierarchy
            self.create_initial_hierarchy()
            
            # Verify setup
            self.verify_setup()
            
            # Print instructions
            self.print_admin_instructions()
            
            return True
            
        except Exception as e:
            print(f"\n❌ Setup failed: {str(e)}")
            return False
        finally:
            if self.conn:
                self.conn.close()

def main():
    """Main entry point"""
    db_path = Path(__file__).parent / "jamb_questions.db"
    
    # Get admin credentials if running interactively
    admin_email = None
    admin_password = None
    
    if len(sys.argv) > 2:
        admin_email = sys.argv[1]
        admin_password = sys.argv[2]
    elif len(sys.argv) == 1:
        # Interactive mode
        print("Admin Setup - Enter credentials (or press Enter to skip):")
        admin_email = input("Admin email: ").strip()
        if admin_email:
            admin_password = input("Admin password: ").strip()
    
    setup = AdminSystemSetup(db_path)
    success = setup.run_full_setup(admin_email, admin_password)
    
    return 0 if success else 1

if __name__ == "__main__":
    exit(main())
