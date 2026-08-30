import logging
from typing import Dict, Any, List
from datetime import datetime, timezone
from backend.data.repositories import TrendSignalRepository

logger = logging.getLogger(__name__)

class TrendVelocityEngine:
    def __init__(self):
        self.repo = TrendSignalRepository()
        
    def calculate_velocity(self, topic: str) -> Dict[str, Any]:
        """
        Calculates the velocity (acceleration/deceleration) of a trend by analyzing
        historical data points.
        """
        history = self.repo.get_historical_signals_by_topic(topic, limit=10)
        
        if not history or len(history) < 2:
            return {
                "velocity_score": 0.0,
                "trend_status": "insufficient_data",
                "recommendation": "Hold"
            }
            
        # Sort by oldest to newest
        try:
            sorted_history = sorted(history, key=lambda x: datetime.strptime(x['captured_at'], '%Y-%m-%d %H:%M:%S').replace(tzinfo=timezone.utc))
        except Exception:
            sorted_history = history[::-1]
            
        oldest_score = sorted_history[0]['trend_score']
        newest_score = sorted_history[-1]['trend_score']
        
        # simple difference for MVP
        delta = newest_score - oldest_score
        
        if delta > 15:
            status = "accelerating"
            rec = "Jump on this immediately"
        elif delta > 5:
            status = "growing"
            rec = "Good potential"
        elif delta > -5:
            status = "stable"
            rec = "Monitor closely"
        elif delta > -15:
            status = "cooling"
            rec = "Saturating"
        else:
            status = "dying"
            rec = "Avoid"
            
        return {
            "velocity_score": delta,
            "trend_status": status,
            "recommendation": rec
        }
