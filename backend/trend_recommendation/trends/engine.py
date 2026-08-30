import uuid
from datetime import datetime, timezone, timedelta
from typing import Dict, Any

from backend.data.repositories import TrendSignalRepository
from backend.trend_recommendation.providers.youtube import YouTubeTrendProvider
from backend.trend_recommendation.providers.twitch import TwitchTrendProvider
from backend.trend_recommendation.providers.google_trends import GoogleTrendProvider

class TrendEngine:
    def __init__(self):
        self.repo = TrendSignalRepository()
        self.youtube_provider = YouTubeTrendProvider()
        self.twitch_provider = TwitchTrendProvider()
        self.google_provider = GoogleTrendProvider()

    async def get_trends_for_topic(self, topic: str) -> Dict[str, Any]:
        """
        Retrieves trend data for a topic. 
        Uses stale-while-revalidate logic and parallel async fetching.
        """
        import asyncio
        from backend.core.embeddings import semantic_matcher
        
        now = datetime.now(timezone.utc)
        fresh_threshold = now - timedelta(hours=1)
        warm_threshold = now - timedelta(hours=6)
        
        # Check cache
        cached_signal = self.repo.get_latest_signal_by_topic(topic)
        if cached_signal:
            captured_at_val = cached_signal['captured_at']
            try:
                if isinstance(captured_at_val, str):
                    captured_at = datetime.strptime(captured_at_val, '%Y-%m-%d %H:%M:%S').replace(tzinfo=timezone.utc)
                else:
                    captured_at = captured_at_val.replace(tzinfo=timezone.utc)
                
                # If fresh (< 1 hour), return cache
                if captured_at > fresh_threshold:
                    return dict(cached_signal)
                    
                # If warm (1-6 hours), return cache but trigger background refresh
                if captured_at > warm_threshold:
                    # Trigger background fetch (asyncio.create_task or via BackgroundTasks in router)
                    # For MVP, we will just return cache here, assuming the router handles background trigger, 
                    # but let's actually just do it here if possible or return a flag.
                    # We'll just fetch asynchronously in the background.
                    asyncio.create_task(self._fetch_and_aggregate_async(topic))
                    return dict(cached_signal)
                    
            except ValueError:
                pass # Fallback to fetching new data if parsing fails
        
        # If stale or missing, fetch synchronously
        return await self._fetch_and_aggregate_async(topic)

    async def _fetch_and_aggregate_async(self, topic: str) -> Dict[str, Any]:
        import asyncio
        from backend.core.embeddings import semantic_matcher
        
        # Fetching new data from providers concurrently
        yt_task = self.youtube_provider.get_trend_signals_async(topic)
        tw_task = self.twitch_provider.get_trend_signals_async(topic)
        go_task = self.google_provider.get_trend_signals_async(topic)
        
        yt_result, tw_result, go_result = await asyncio.gather(yt_task, tw_task, go_task)
        
        # Aggregate logic
        avg_score = int((yt_result.get("score", 50) + tw_result.get("score", 50) + go_result.get("score", 50)) / 3)
        
        # Aggregate momentum: take highest
        momentums = [yt_result.get("momentum", "stable"), tw_result.get("momentum", "stable"), go_result.get("momentum", "stable")]
        if "high" in momentums:
            agg_momentum = "high"
        elif "medium" in momentums:
            agg_momentum = "medium"
        else:
            agg_momentum = "stable"
            
        # Aggregate direction
        directions = [yt_result.get("direction", "stable"), tw_result.get("direction", "stable"), go_result.get("direction", "stable")]
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
            "trending_descriptions": yt_result.get("trending_descriptions", []) + tw_result.get("trending_descriptions", []),
            "source": "aggregated_api",
            "platform": "youtube_twitch_google"
        }
        
        # Generate embedding for the topic
        try:
            embedding_vector = semantic_matcher.embed_text(topic)
            embedding_str = semantic_matcher.serialize_embedding(embedding_vector)
        except Exception:
            embedding_str = None
        
        # Save to database
        signal_id = str(uuid.uuid4())
        self.repo.create_signal(
            signal_id=signal_id,
            topic=topic,
            source=agg_result["source"],
            platform=agg_result["platform"],
            trend_score=agg_result["score"],
            momentum=agg_result["momentum"],
            direction=agg_result["direction"],
            embedding=embedding_str
        )
        
        return agg_result
