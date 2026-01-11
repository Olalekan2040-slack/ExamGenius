"""
Add gamification points to user profiles
This migration adds points tracking for learning progress
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.database import get_connection


def run_migration():
    """Add gamification points columns to profiles and learning_progress tables"""
    
    conn = get_connection()
    cursor = conn.cursor()
    
    print("Adding gamification points columns...")
    
    # Check if points column exists in profiles
    cursor.execute("""
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'learning_points'
    """)
    
    if not cursor.fetchone():
        # Add learning_points column to user_profiles table
        cursor.execute("""
            ALTER TABLE user_profiles
            ADD COLUMN learning_points INTEGER DEFAULT 0
        """)
        print("✅ Added learning_points column to profiles")
    else:
        print("ℹ️ learning_points column already exists in profiles")
    
    # Check if points_earned column exists in learning_progress
    cursor.execute("""
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'learning_progress' AND column_name = 'points_earned'
    """)
    
    if not cursor.fetchone():
        # Add points_earned column to learning_progress
        cursor.execute("""
            ALTER TABLE learning_progress 
            ADD COLUMN points_earned INTEGER DEFAULT 0
        """)
        print("✅ Added points_earned column to learning_progress")
    else:
        print("ℹ️ points_earned column already exists in learning_progress")
    
    # Create gamification_events table for tracking point awards
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS gamification_events (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            event_type VARCHAR(50) NOT NULL,
            points INTEGER NOT NULL,
            subject VARCHAR(100),
            topic VARCHAR(255),
            subtopic VARCHAR(255),
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    print("✅ Created gamification_events table")
    
    # Create index for faster queries
    cursor.execute("""
        CREATE INDEX IF NOT EXISTS idx_gamification_user 
        ON gamification_events(user_id, created_at DESC)
    """)
    
    conn.commit()
    print("\n✅ Gamification points migration completed successfully!")
    
    return True


if __name__ == '__main__':
    run_migration()
