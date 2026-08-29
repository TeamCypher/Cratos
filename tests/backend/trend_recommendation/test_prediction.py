import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')))

from backend.trend_recommendation.prediction.engine import PredictionEngine

def test_prediction_twitch_preference():
    """Test that a gaming/live/fast-paced profile scores higher for Twitch."""
    mock_content_profile = {
        "topic": "Minecraft",
        "category": "Gaming",
        "audience": "gamer enthusiasts",
        "hook_score": 85,
        "pacing": "fast"
    }

    mock_trend_signal = {
        "score": 90,
        "momentum": "high",
        "direction": "rising",
        "source": "youtube_api"
    }

    results = PredictionEngine.score_platforms(
        video_id="test_vid_123",
        content_profile=mock_content_profile,
        trend_signal=mock_trend_signal
    )
    
    twitch_score = next(r["score"] for r in results if r["platform"] == "twitch")
    youtube_score = next(r["score"] for r in results if r["platform"] == "youtube")
    
    assert twitch_score > youtube_score

def test_prediction_youtube_preference():
    """Test that an educational/tech/slow-paced profile scores higher for YouTube."""
    mock_content_profile = {
        "topic": "Generative AI",
        "category": "Education",
        "audience": "general tech enthusiasts",
        "hook_score": 60,
        "pacing": "slow"
    }

    mock_trend_signal = {
        "score": 75,
        "momentum": "medium",
        "direction": "stable",
        "source": "youtube_api"
    }

    results = PredictionEngine.score_platforms(
        video_id="test_vid_456",
        content_profile=mock_content_profile,
        trend_signal=mock_trend_signal
    )
    
    twitch_score = next(r["score"] for r in results if r["platform"] == "twitch")
    youtube_score = next(r["score"] for r in results if r["platform"] == "youtube")
    
    assert youtube_score > twitch_score

def test_prediction_aggregated_confidence():
    """Test that confidence score remains high when passed 'aggregated_api' source."""
    mock_content_profile = {
        "topic": "SpaceX",
        "category": "Tech",
        "audience": "tech",
        "hook_score": 50,
        "pacing": "medium"
    }

    mock_trend_signal = {
        "score": 50,
        "momentum": "medium",
        "direction": "stable",
        "source": "aggregated_api"
    }

    results = PredictionEngine.score_platforms(
        video_id="test_vid_789",
        content_profile=mock_content_profile,
        trend_signal=mock_trend_signal
    )
    
    for r in results:
        # 0.8 is the base confidence, shouldn't drop to 0.7 due to source check
        assert r["confidence"] >= 0.8

def test_prediction_missing_fields():
    """Test that missing fields lower the confidence score but don't crash the engine."""
    mock_content_profile = {} # Empty profile
    mock_trend_signal = {
        "score": 50,
        "momentum": "medium",
        "direction": "stable",
        "source": "youtube_api"
    }

    results = PredictionEngine.score_platforms(
        video_id="test_vid_empty",
        content_profile=mock_content_profile,
        trend_signal=mock_trend_signal
    )
    
    for r in results:
        # Should drop confidence due to missing audience
        assert r["confidence"] < 0.8
        assert r["score"] > 0 # Should have baseline score

def test_prediction_fallback_source():
    """Test that confidence drops when trend source is fallback_cache."""
    mock_content_profile = {
        "audience": "general"
    }
    mock_trend_signal = {
        "score": 50,
        "source": "database_cache"
    }

    results = PredictionEngine.score_platforms(
        video_id="test_vid_cache",
        content_profile=mock_content_profile,
        trend_signal=mock_trend_signal
    )
    
    for r in results:
        # Should drop confidence due to source not being in allowed list
        assert r["confidence"] < 0.8

def test_prediction_extreme_values():
    """Test that extreme or out-of-bounds inputs don't crash the engine and are capped properly."""
    mock_content_profile = {
        "topic": "Glitch",
        "category": "Gaming",
        "hook_score": 9999, # Extreme score
        "pacing": "super_fast_beyond_recognition" 
    }

    mock_trend_signal = {
        "score": -50, # Invalid negative trend
        "source": "youtube_api"
    }

    results = PredictionEngine.score_platforms(
        video_id="test_vid_extreme",
        content_profile=mock_content_profile,
        trend_signal=mock_trend_signal
    )
    
    # Engine should still output normalized scores between 0 and 100
    for r in results:
        assert 0 <= r["score"] <= 100
