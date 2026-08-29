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

class VideoAnalysisRepository:
    def create_analysis(self, video_id: str, topic: str, subtopic: str, category: str, emotion: str, audience: str, keywords: str, hook_score: int, pacing_score: int, quality_score: int) -> None:
        conn = get_db_connection()
        try:
            conn.execute(
                "INSERT INTO video_analysis (video_id, topic, subtopic, category, emotion, audience, keywords, hook_score, pacing_score, quality_score) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                (video_id, topic, subtopic, category, emotion, audience, keywords, hook_score, pacing_score, quality_score)
            )
            conn.commit()
        finally:
            conn.close()

    def get_analysis(self, video_id: str) -> Optional[sqlite3.Row]:
        conn = get_db_connection()
        try:
            cur = conn.execute("SELECT * FROM video_analysis WHERE video_id = ?", (video_id,))
            return cur.fetchone()
        finally:
            conn.close()

class TrendSignalRepository:
    def create_signal(self, signal_id: str, topic: str, source: str, platform: str, trend_score: int, momentum: str, direction: str) -> None:
        conn = get_db_connection()
        try:
            conn.execute(
                "INSERT INTO trend_signals (id, topic, source, platform, trend_score, momentum, direction) VALUES (?, ?, ?, ?, ?, ?, ?)",
                (signal_id, topic, source, platform, trend_score, momentum, direction)
            )
            conn.commit()
        finally:
            conn.close()

    def get_signal(self, signal_id: str) -> Optional[sqlite3.Row]:
        conn = get_db_connection()
        try:
            cur = conn.execute("SELECT * FROM trend_signals WHERE id = ?", (signal_id,))
            return cur.fetchone()
        finally:
            conn.close()

class PlatformPredictionRepository:
    def create_prediction(self, prediction_id: str, video_id: str, platform: str, score: int, confidence: float, reasons: str) -> None:
        conn = get_db_connection()
        try:
            conn.execute(
                "INSERT INTO platform_predictions (id, video_id, platform, score, confidence, reasons) VALUES (?, ?, ?, ?, ?, ?)",
                (prediction_id, video_id, platform, score, confidence, reasons)
            )
            conn.commit()
        finally:
            conn.close()

    def get_predictions_for_video(self, video_id: str) -> list[sqlite3.Row]:
        conn = get_db_connection()
        try:
            cur = conn.execute("SELECT * FROM platform_predictions WHERE video_id = ?", (video_id,))
            return cur.fetchall()
        finally:
            conn.close()

class RecommendationRepository:
    def create_recommendation(self, recommendation_id: str, video_id: str, platform: str, best_time: str, hashtags: str, caption: str, title: str, keywords: str, optimization: str) -> None:
        conn = get_db_connection()
        try:
            conn.execute(
                "INSERT INTO recommendations (id, video_id, platform, best_time, hashtags, caption, title, keywords, optimization) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                (recommendation_id, video_id, platform, best_time, hashtags, caption, title, keywords, optimization)
            )
            conn.commit()
        finally:
            conn.close()

    def get_recommendation(self, video_id: str, platform: str) -> Optional[sqlite3.Row]:
        conn = get_db_connection()
        try:
            cur = conn.execute("SELECT * FROM recommendations WHERE video_id = ? AND platform = ?", (video_id, platform))
            return cur.fetchone()
        finally:
            conn.close()
