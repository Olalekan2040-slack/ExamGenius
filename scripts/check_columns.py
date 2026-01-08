import psycopg2

conn = psycopg2.connect(
    host='localhost',
    port=5432,
    database='ExamgeniusDB',
    user='postgres',
    password='Policewomen@007'
)

cur = conn.cursor()
cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name='questions' ORDER BY ordinal_position")
cols = [row[0] for row in cur.fetchall()]
print('Question table columns:')
for col in cols:
    print(f'  - {col}')
conn.close()
