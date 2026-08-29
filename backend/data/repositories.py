import sqlite3
from typing import Optional
from .database import get_db_connection

class UserRepository:
    def create_user(self, user_id: str, name: str, email: str) -> None:
        conn = get_db_connection()
        try:
            conn.execute(
                "INSERT INTO users (id, name, email) VALUES (?, ?, ?)",
                (user_id, name, email)
            )
            conn.commit()
        finally:
            conn.close()

    def get_user(self, user_id: str) -> Optional[sqlite3.Row]:
        conn = get_db_connection()
        try:
            cur = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,))
            return cur.fetchone()
        finally:
            conn.close()

class VideoRepository:
    def create_video(self, video_id: str, user_id: str, filename: str, status: str = 'QUEUED') -> None:
        conn = get_db_connection()
        try:
            conn.execute(
                "INSERT INTO videos (id, user_id, filename, status) VALUES (?, ?, ?, ?)",
                (video_id, user_id, filename, status)
            )
            conn.commit()
        finally:
            conn.close()

    def get_video(self, video_id: str) -> Optional[sqlite3.Row]:
        conn = get_db_connection()
        try:
            cur = conn.execute("SELECT * FROM videos WHERE id = ?", (video_id,))
            return cur.fetchone()
        finally:
            conn.close()
            
    def update_video_status(self, video_id: str, status: str) -> None:
        conn = get_db_connection()
        try:
            conn.execute("UPDATE videos SET status = ? WHERE id = ?", (status, video_id))
            conn.commit()
        finally:
            conn.close()

class AnalysisJobRepository:
    def create_job(self, job_id: str, video_id: str, status: str = 'QUEUED') -> None:
        conn = get_db_connection()
        try:
            conn.execute(
                "INSERT INTO analysis_jobs (id, video_id, status) VALUES (?, ?, ?)",
                (job_id, video_id, status)
            )
            conn.commit()
        finally:
            conn.close()

    def get_job(self, job_id: str) -> Optional[sqlite3.Row]:
        conn = get_db_connection()
        try:
            cur = conn.execute("SELECT * FROM analysis_jobs WHERE id = ?", (job_id,))
            return cur.fetchone()
        finally:
            conn.close()

    def update_job_progress(self, job_id: str, status: str, progress: int, error: Optional[str] = None) -> None:
        conn = get_db_connection()
        try:
            if status in ('COMPLETED', 'FAILED'):
                query = "UPDATE analysis_jobs SET status = ?, progress = ?, error = ?, completed_at = CURRENT_TIMESTAMP WHERE id = ?"
            else:
                query = "UPDATE analysis_jobs SET status = ?, progress = ?, error = ? WHERE id = ?"
            conn.execute(query, (status, progress, error, job_id))
            conn.commit()
        finally:
            conn.close()
