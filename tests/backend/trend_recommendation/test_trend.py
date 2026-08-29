import os
import sys
import uuid

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')))

from backend.trend_recommendation.trends.engine import TrendEngine

def test_trend_engine_aggregation():
    engine = TrendEngine()
    
    # We use a highly unique topic to ensure we bypass the cache for the first call
    topic = f"Test Topic Unique Aggregation {uuid.uuid4()}"
    
    result = engine.get_trends_for_topic(topic)
    
    assert "score" in result
    assert "momentum" in result
    assert "direction" in result
    assert result["platform"] == "youtube_twitch_google"
    # Depending on mock data or live, source should be aggregated_api
    assert result["source"] == "aggregated_api"

def test_trend_engine_caching():
    engine = TrendEngine()
    
    # Use a specific deterministic topic for the caching test
    topic = f"Test Caching Topic {uuid.uuid4()}"
    
    # First call caches it
    engine.get_trends_for_topic(topic)
    
    # Second call retrieves from cache
    result = engine.get_trends_for_topic(topic)
    
    # This time it should be served from the database cache
    assert result["platform"] == "youtube_twitch_google"
    assert result["source"] == "database_cache"
