import sqlite3

conn = sqlite3.connect('jamb_questions.db')
cursor = conn.cursor()

# Get user 3 stats
cursor.execute('SELECT subject, topic, accuracy FROM user_stats WHERE user_id = 3 ORDER BY accuracy ASC LIMIT 3')
print('=== WEAKEST TOPICS FOR USER 3 ===')
weak = cursor.fetchall()
for row in weak:
    print(f'{row[0]} - {row[1]}: {row[2]}%')

# Get user 3 registered subjects
cursor.execute('SELECT subject FROM user_subjects WHERE user_id = 3')
subjects = [r[0] for r in cursor.fetchall()]
print(f'\nRegistered subjects: {subjects if subjects else "NONE"}')

# Check Accounting topics
cursor.execute("SELECT DISTINCT topic FROM questions WHERE subject = 'Accounting' LIMIT 3")
acc_topics = [r[0] for r in cursor.fetchall()]
print(f'Accounting topics available: {acc_topics}')

# Check what the recommendation logic will do
print('\n=== RECOMMENDATION LOGIC ===')
if weak:
    print('✓ Will recommend weakest topics')
    for row in weak:
        print(f'  - {row[0]}: {row[1]}')
else:
    print('✗ No weak topics to recommend')

conn.close()
