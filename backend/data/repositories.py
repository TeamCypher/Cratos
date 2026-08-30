import psycopg2
from typing import Optional, Dict, Any
from .database import get_db_connection

class UserRepository:
    def create_user(self, user_id: str, name: str, email: str) -> None:
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO users (id, name, email) VALUES (%s, %s, %s)",
                    (user_id, name, email)
                )
            conn.commit()
        finally:
            conn.close()

    def get_user(self, user_id: str) -> Optional[Dict[str, Any]]:
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute("SELECT * FROM users WHERE id = %s", (user_id,))
                return cur.fetchone()
        finally:
            conn.close()

class VideoRepository:
    def create_video(self, video_id: str, user_id: str, filename: str, status: str = 'QUEUED') -> None:
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO videos (id, user_id, filename, status) VALUES (%s, %s, %s, %s)",
                    (video_id, user_id, filename, status)
                )
            conn.commit()
        finally:
            conn.close()

    def get_video(self, video_id: str) -> Optional[Dict[str, Any]]:
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute("SELECT * FROM videos WHERE id = %s", (video_id,))
                return cur.fetchone()
        finally:
            conn.close()

    def get_videos_for_user(self, user_id: str) -> list[Dict[str, Any]]:
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                # Join with analysis_jobs, video_analysis, and platform_predictions to get full history metrics
                query = """
                    SELECT 
                        v.id as video_id, 
                        v.filename, 
                        v.created_at, 
                        j.status, 
                        j.id as job_id,
                        va.category,
                        pp.platform as best_platform,
                        pp.score as best_score
                    FROM videos v
                    LEFT JOIN analysis_jobs j ON v.id = j.video_id
                    LEFT JOIN video_analysis va ON v.id = va.video_id
                    LEFT JOIN (
                        SELECT video_id, platform, score
                        FROM (
                            SELECT video_id, platform, score, 
                                   ROW_NUMBER() OVER(PARTITION BY video_id ORDER BY score DESC) as rn
                            FROM platform_predictions
                        ) t WHERE t.rn = 1
                    ) pp ON v.id = pp.video_id
                    WHERE v.user_id = %s
                    ORDER BY v.created_at DESC
                """
                cur.execute(query, (user_id,))
                return cur.fetchall()
        finally:
            conn.close()
            
    def update_video_status(self, video_id: str, status: str) -> None:
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute("UPDATE videos SET status = %s WHERE id = %s", (status, video_id))
            conn.commit()
        finally:
            conn.close()

class AnalysisJobRepository:
    def create_job(self, job_id: str, video_id: str, status: str = 'QUEUED') -> None:
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO analysis_jobs (id, video_id, status) VALUES (%s, %s, %s)",
                    (job_id, video_id, status)
                )
            conn.commit()
        finally:
            conn.close()

    def get_job(self, job_id: str) -> Optional[Dict[str, Any]]:
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute("SELECT * FROM analysis_jobs WHERE id = %s", (job_id,))
                return cur.fetchone()
        finally:
            conn.close()

    def update_job_progress(self, job_id: str, status: str, progress: int, error: Optional[str] = None) -> None:
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                if status in ('COMPLETED', 'FAILED'):
                    query = "UPDATE analysis_jobs SET status = %s, progress = %s, error = %s, completed_at = CURRENT_TIMESTAMP WHERE id = %s"
                else:
                    query = "UPDATE analysis_jobs SET status = %s, progress = %s, error = %s WHERE id = %s"
                cur.execute(query, (status, progress, error, job_id))
            conn.commit()
        finally:
            conn.close()

class VideoAnalysisRepository:
    def create_analysis(self, video_id: str, topic: str, subtopic: str, category: str, emotion: str, audience: str, keywords: str, hook_score: int, pacing_score: int, quality_score: int) -> None:
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO video_analysis (video_id, topic, subtopic, category, emotion, audience, keywords, hook_score, pacing_score, quality_score) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                    (video_id, topic, subtopic, category, emotion, audience, keywords, hook_score, pacing_score, quality_score)
                )
            conn.commit()
        finally:
            conn.close()

    def get_analysis(self, video_id: str) -> Optional[Dict[str, Any]]:
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute("SELECT * FROM video_analysis WHERE video_id = %s", (video_id,))
                return cur.fetchone()
        finally:
            conn.close()

class TrendSignalRepository:
    def create_signal(self, signal_id: str, topic: str, source: str, platform: str, trend_score: int, momentum: str, direction: str, embedding: Optional[str] = None) -> None:
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO trend_signals (id, topic, source, platform, trend_score, momentum, direction, embedding) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
                    (signal_id, topic, source, platform, trend_score, momentum, direction, embedding)
                )
            conn.commit()
        finally:
            conn.close()

    def get_signal(self, signal_id: str) -> Optional[Dict[str, Any]]:
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute("SELECT * FROM trend_signals WHERE id = %s", (signal_id,))
                return cur.fetchone()
        finally:
            conn.close()

    def get_latest_signal_by_topic(self, topic: str) -> Optional[Dict[str, Any]]:
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute("SELECT * FROM trend_signals WHERE topic = %s ORDER BY captured_at DESC LIMIT 1", (topic,))
                return cur.fetchone()
        finally:
            conn.close()

    def get_historical_signals_by_topic(self, topic: str, limit: int = 10) -> list:
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute("SELECT * FROM trend_signals WHERE topic = %s ORDER BY captured_at DESC LIMIT %s", (topic, limit))
                return cur.fetchall()
        finally:
            conn.close()

class PlatformPredictionRepository:
    def create_prediction(self, prediction_id: str, video_id: str, platform: str, score: int, confidence: float, reasons: str) -> None:
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO platform_predictions (id, video_id, platform, score, confidence, reasons) VALUES (%s, %s, %s, %s, %s, %s)",
                    (prediction_id, video_id, platform, score, confidence, reasons)
                )
            conn.commit()
        finally:
            conn.close()

    def get_predictions_for_video(self, video_id: str) -> list:
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute("SELECT * FROM platform_predictions WHERE video_id = %s", (video_id,))
                return cur.fetchall()
        finally:
            conn.close()

class RecommendationRepository:
    def create_recommendation(self, recommendation_id: str, video_id: str, platform: str, best_time: str, video_description: str, hashtags: str, caption: str, title: str, keywords: str, optimization: str) -> None:
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO recommendations (id, video_id, platform, best_time, video_description, hashtags, caption, title, keywords, optimization) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                    (recommendation_id, video_id, platform, best_time, video_description, hashtags, caption, title, keywords, optimization)
                )
            conn.commit()
        finally:
            conn.close()

    def get_recommendation(self, video_id: str, platform: str) -> Optional[Dict[str, Any]]:
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute("SELECT * FROM recommendations WHERE video_id = %s AND platform = %s", (video_id, platform))
                return cur.fetchone()
        finally:
            conn.close()

class RetentionRepository:
    def create_curve_point(self, curve_id: str, video_id: str, timestamp_sec: int, retention_score: float) -> None:
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO retention_curves (id, video_id, timestamp_sec, retention_score) VALUES (%s, %s, %s, %s)",
                    (curve_id, video_id, timestamp_sec, retention_score)
                )
            conn.commit()
        finally:
            conn.close()

    def get_curve_for_video(self, video_id: str) -> list:
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute("SELECT * FROM retention_curves WHERE video_id = %s ORDER BY timestamp_sec ASC", (video_id,))
                return cur.fetchall()
        finally:
            conn.close()

class CompetitorRepository:
    def create_analysis(self, analysis_id: str, video_id: str, channel_id: str, overlap_score: int, gap_topics: str, timing_gaps: str) -> None:
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO competitor_analysis (id, video_id, channel_id, overlap_score, gap_topics, timing_gaps) VALUES (%s, %s, %s, %s, %s, %s)",
                    (analysis_id, video_id, channel_id, overlap_score, gap_topics, timing_gaps)
                )
            conn.commit()
        finally:
            conn.close()

    def get_analysis_for_video(self, video_id: str) -> Optional[Dict[str, Any]]:
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute("SELECT * FROM competitor_analysis WHERE video_id = %s ORDER BY analyzed_at DESC LIMIT 1", (video_id,))
                return cur.fetchone()
        finally:
            conn.close()

