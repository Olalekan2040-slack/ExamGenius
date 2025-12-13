"""
User Database Model
"""

class User:
    """User model representing a database row"""
    def __init__(self, id: int, email: str, hashed_password: str, is_verified: bool = False, 
                 role: str = 'student', created_at: str = None):
        self.id = id
        self.email = email
        self.hashed_password = hashed_password
        self.is_verified = is_verified
        self.role = role  # 'student', 'admin', 'moderator'
        self.created_at = created_at
