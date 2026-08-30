import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

load_dotenv()

SCHEMA_PATH = os.path.join(os.path.dirname(__file__), 'schema.sql')
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://cratos_user:cratos_password@localhost:5432/cratos_db")

def get_db_connection():
    """
    Establish a connection to the PostgreSQL database.
    Sets cursor_factory to RealDictCursor for dictionary-like access to rows.
    """
    conn = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
    return conn

def init_db():
    """
    Initialize the database using the schema.sql file.
    """
    if not os.path.exists(SCHEMA_PATH):
        raise FileNotFoundError(f"Schema file not found at {SCHEMA_PATH}")
        
    with open(SCHEMA_PATH, 'r') as f:
        schema_script = f.read()
        
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(schema_script)
        conn.commit()
    finally:
        conn.close()

if __name__ == "__main__":
    init_db()
    print(f"Database initialized successfully at {DATABASE_URL}")
