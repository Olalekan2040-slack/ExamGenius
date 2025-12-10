#!/usr/bin/env python
"""Test the profile endpoint"""
import requests
import json
import sqlite3
from app.db.database import get_connection

# Test 1: Get an existing verified user
db = get_connection()
cursor = db.cursor()

# Get a verified user
cursor.execute("SELECT id FROM users WHERE is_verified = 1 LIMIT 1")
user = cursor.fetchone()

if user:
    user_id = user["id"]
    print(f"✅ Found verified user with ID: {user_id}")

    # Get their credentials to login
    cursor.execute("SELECT email FROM users WHERE id = ?", (user_id,))
    user_email = cursor.fetchone()["email"]
    print(f"📧 User email: {user_email}")

    # For testing, we'll use a simple JWT token directly
    # Create a token using the auth functions
    from app.core.security import create_access_token

    token = create_access_token({"sub": user_id})
    print(f"🔑 Generated token: {token[:50]}...")

    # Test the profile endpoint
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(
        "http://localhost:8000/api/v1/users/me", headers=headers)

    print(f"\n📊 Profile endpoint response (Status {response.status_code}):")
    if response.status_code == 200:
        data = response.json()
        print(json.dumps(data, indent=2))
        print("\n✅ Get profile endpoint works!")
    else:
        print(f"❌ Error: {response.text}")
else:
    print("❌ No verified users found in database")
    print("Creating test user...")

    # Register a new user
    register_data = {
        "name": "Test User",
        "email": "testprofile@example.com",
        "password": "Test123!"
    }
    r = requests.post(
        "http://localhost:8000/api/v1/auth/register", json=register_data)
    print(f"Register status: {r.status_code}")

    if r.status_code == 201:
        result = r.json()
        new_user_id = result["user_id"]
        print(f"Created user ID: {new_user_id}")

        # Mark as verified in DB
        db2 = get_connection()
        cursor2 = db2.cursor()
        cursor2.execute(
            "UPDATE users SET is_verified = 1 WHERE id = ?", (new_user_id,))
        db2.commit()
        print("Marked user as verified")

        # Now test profile endpoint
        from app.core.security import create_access_token
        token = create_access_token({"sub": new_user_id})

        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(
            "http://localhost:8000/api/v1/users/me", headers=headers)

        print(
            f"\n📊 Profile endpoint response (Status {response.status_code}):")
        if response.status_code == 200:
            data = response.json()
            print(json.dumps(data, indent=2))
            print("\n✅ Get profile endpoint works!")
        else:
            print(f"❌ Error: {response.text}")
