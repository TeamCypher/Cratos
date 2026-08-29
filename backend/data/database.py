import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'hackathon.db')
SCHEMA_PATH = os.path.join(os.path.dirname(__file__), 'schema.sql')

def get_db_connection() -> sqlite3.Connection:
    """
    Establish a connection to the SQLite database.
    Sets row_factory to sqlite3.Row for dictionary-like access to rows.
    """
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
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
        conn.executescript(schema_script)
        conn.commit()
    finally:
        conn.close()

if __name__ == "__main__":
    init_db()
    print(f"Database initialized successfully at {DB_PATH}")
