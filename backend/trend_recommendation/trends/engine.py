import uuid
from datetime import datetime, timezone, timedelta
from typing import Dict, Any

from backend.data.repositories import TrendSignalRepository
from backend.trend_recommendation.providers.youtube import YouTubeTrendProvider

class TrendEngine:
    def __init__(self):
        self.repo = TrendSignalRepository()
        self.youtube_provider = YouTubeTrendProvider()

    def get_trends_for_topic(self, topic: str) -> Dict[str, Any]:
        """
        Retrieves trend data for a topic. 
        Checks local database cache first. If stale or missing, fetches from provider.
        """
        stale_threshold = datetime.now(timezone.utc) - timedelta(hours=24)
        
        # Check cache
        cached_signal = self.repo.get_latest_signal_by_topic(topic)
        if cached_signal:
            captured_at_str = cached_signal['captured_at']
            # sqlite stores datetime like '2023-10-27 10:00:00'
            try:
                captured_at = datetime.strptime(captured_at_str, '%Y-%m-%d %H:%M:%S').replace(tzinfo=timezone.utc)
                if captured_at > stale_threshold:
                    return {
                        "score": cached_signal["trend_score"],
                        "momentum": cached_signal["momentum"],
                        "direction": cached_signal["direction"],
                        "source": "database_cache",
                        "platform": cached_signal["platform"]
                    }
            except ValueError:
                pass # Fallback to fetching new data if parsing fails
        
        # Fetching new data from provider
        result = self.youtube_provider.get_trend_signals(topic)
        
        # Save to database
        signal_id = str(uuid.uuid4())
        self.repo.create_signal(
            signal_id=signal_id,
            topic=topic,
            source=result.get("source", "youtube_api"),
            platform="youtube",
            trend_score=result.get("score", 50),
            momentum=result.get("momentum", "stable"),
            direction=result.get("direction", "stable")
        )
        
        return result
