import sqlite3

conn = sqlite3.connect('jamb_questions.db')
cursor = conn.cursor()
cursor.execute('PRAGMA table_info(user_profiles)')
print('\nUpdated user_profiles schema:')
for row in cursor.fetchall():
    print(f'  {row[1]} ({row[2]})')
conn.close()
