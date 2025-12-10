#!/usr/bin/env python
"""Direct test without HTTP - test the endpoint function directly"""
import traceback
from unittest.mock import MagicMock
from fastapi import Request
from app.core.security import create_access_token
from app.db.database import get_connection
import sys
sys.path.insert(0, '/c/Users/DELL/Desktop/examgenius')


try:
    # Get a verified user
    db = get_connection()
    cursor = db.cursor()

    cursor.execute("SELECT id FROM users WHERE is_verified = 1 LIMIT 1")
    user = cursor.fetchone()

    if user:
        user_id = user["id"]
        print(f"✅ Testing with user ID: {user_id}")

        # Create a token
        token = create_access_token({"sub": user_id})

        # Create a mock request with the token
        mock_request = MagicMock(spec=Request)
        mock_request.headers = {"authorization": f"Bearer {token}"}

        # Call the endpoint function directly
        from app.api.v1.endpoints.user import get_profile
        import asyncio

        result = asyncio.run(get_profile(mock_request))
        print("\n✅ SUCCESS! Profile endpoint works!")
        print(result)

except Exception as e:
    print(f"❌ Error: {e}")
    traceback.print_exc()
