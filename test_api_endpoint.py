"""
Test the actual API endpoint
"""
from fastapi.testclient import TestClient
from app.main import app
from app.core.security import create_access_token
import json

client = TestClient(app)

# Create a token for user 3
token = create_access_token(data={'sub': '3'})

# Call the dashboard stats endpoint
print("Testing /dashboard/stats endpoint...")
response = client.get(
    '/dashboard/stats',
    headers={'Authorization': f'Bearer {token}'}
)

print(f'Status Code: {response.status_code}')

if response.status_code == 200:
    data = response.json()
    print(f'\nAvailable keys: {list(data.keys())}')
    
    if 'recommended_topics' in data:
        topics = data['recommended_topics']
        print(f'\n✓ recommended_topics found: {len(topics)} topics')
        for i, t in enumerate(topics, 1):
            acc = t.get('accuracy')
            acc_str = f"{acc}%" if acc is not None else "N/A"
            print(f'  {i}. {t["subject"]}: {t["topic"]} ({acc_str})')
    else:
        print('\n✗ recommended_topics NOT in response!')
    
    if 'profile' in data:
        print(f'\nProfile:')
        print(f'  Department: {data["profile"].get("department")}')
        print(f'  Registered Subjects: {data["profile"].get("registered_subjects")}')
else:
    print(f'Error: {response.text}')
