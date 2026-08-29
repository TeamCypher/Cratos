import uuid
from datetime import datetime, timezone, timedelta
from typing import Dict, Any

from backend.data.repositories import TrendSignalRepository
from backend.trend_recommendation.providers.youtube import YouTubeTrendProvider
from backend.trend_recommendation.providers.twitch import TwitchTrendProvider

class TrendEngine:
    def __init__(self):
        self.repo = TrendSignalRepository()
        self.youtube_provider = YouTubeTrendProvider()
        self.twitch_provider = TwitchTrendProvider()

    def get_trends_for_topic(self, topic: str) -> Dict[str, Any]:
        """
        Retrieves trend data for a topic. 
        Checks local database cache first. If stale or missing, fetches from providers
        and aggregates the results.
        """
        stale_threshold = datetime.now(timezone.utc) - timedelta(hours=24)
        
        # Check cache
        cached_signal = self.repo.get_latest_signal_by_topic(topic)
        if cached_signal:
            captured_at_str = cached_signal['captured_at']
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
        
        # Fetching new data from providers concurrently (serial for MVP simplicity)
        yt_result = self.youtube_provider.get_trend_signals(topic)
        tw_result = self.twitch_provider.get_trend_signals(topic)
        
        # Aggregate logic
        avg_score = int((yt_result.get("score", 50) + tw_result.get("score", 50)) / 2)
        
        # Aggregate momentum: take highest
        momentums = [yt_result.get("momentum", "stable"), tw_result.get("momentum", "stable")]
        if "high" in momentums:
            agg_momentum = "high"
        elif "medium" in momentums:
            agg_momentum = "medium"
        else:
            agg_momentum = "stable"
            
        # Aggregate direction
        directions = [yt_result.get("direction", "stable"), tw_result.get("direction", "stable")]
        if "rising" in directions:
            agg_direction = "rising"
        elif "falling" in directions and "rising" not in directions:
            agg_direction = "falling"
        else:
            agg_direction = "stable"
            
        agg_result = {
            "score": avg_score,
            "momentum": agg_momentum,
            "direction": agg_direction,
            "source": "aggregated_api",
            "platform": "youtube_twitch"
        }
        
        # Save to database
        signal_id = str(uuid.uuid4())
        self.repo.create_signal(
            signal_id=signal_id,
            topic=topic,
            source=agg_result["source"],
            platform=agg_result["platform"],
            trend_score=agg_result["score"],
            momentum=agg_result["momentum"],
            direction=agg_result["direction"]
        )
        
        return agg_result
