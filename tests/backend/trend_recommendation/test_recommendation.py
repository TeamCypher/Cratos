import os
import sys
import json
from unittest.mock import patch, MagicMock

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')))

from backend.trend_recommendation.recommendation.engine import RecommendationEngine

def test_recommendation_fallback():
    """Test that the fallback logic correctly maps the predicted platform to cohesive outputs."""
    mock_content_profile = {
        "topic": "Minecraft",
        "category": "Gaming"
    }

    mock_prediction = {
        "platform": "youtube",
        "score": 75,
        "confidence": 0.8,
        "reasons": [],
        "best_time": "18:00 - 21:00",
    }

    # Temporarily remove API key to force fallback
    original_key = os.environ.get("REKA_API_KEY")
    os.environ["REKA_API_KEY"] = ""

    try:
        engine = RecommendationEngine()
        recommendations = engine.generate_recommendations(mock_content_profile, {}, mock_prediction)
        
        # Verify the structure matches our OpenAPI schema expectations
        assert "video_description" in recommendations
        assert "captions" in recommendations
        assert "hashtags" in recommendations
        assert "title_variations" in recommendations
        assert "optimization_tips" in recommendations
        
        # Verify the fallback specifically included the topic and platform
        desc = recommendations["video_description"].lower()
        assert "minecraft" in desc
        assert "youtube" in desc
        
        assert any("gaming" in tag.lower() for tag in recommendations["hashtags"])
        
    finally:
        # Restore API key
        if original_key is not None:
            os.environ["REKA_API_KEY"] = original_key
        else:
            del os.environ["REKA_API_KEY"]

@patch('urllib.request.urlopen')
def test_recommendation_api_success(mock_urlopen):
    """Test that valid JSON from the Reka API is correctly parsed and returned."""
    mock_content_profile = {"topic": "AI Agents"}
    mock_prediction = {"platform": "youtube"}
    
    # Create a fake Reka API response
    fake_reka_response = {
        "choices": [{
            "message": {
                "content": json.dumps({
                    "video_description": "API description",
                    "captions": ["API caption"],
                    "hashtags": ["#api"],
                    "title_variations": ["API title"],
                    "optimization_tips": ["API tip"]
                })
            }
        }]
    }
    
    mock_response = MagicMock()
    mock_response.read.return_value = json.dumps(fake_reka_response).encode('utf-8')
    # Required for context manager (with urllib.request.urlopen...)
    mock_response.__enter__.return_value = mock_response
    mock_urlopen.return_value = mock_response

    original_key = os.environ.get("REKA_API_KEY")
    os.environ["REKA_API_KEY"] = "fake_test_key"
    
    try:
        engine = RecommendationEngine()
        recommendations = engine.generate_recommendations(mock_content_profile, {}, mock_prediction)
        
        assert recommendations["video_description"] == "API description"
        assert recommendations["hashtags"] == ["#api"]
        assert mock_urlopen.called
    finally:
        if original_key is not None:
            os.environ["REKA_API_KEY"] = original_key
        else:
            del os.environ["REKA_API_KEY"]

@patch('urllib.request.urlopen')
def test_recommendation_api_error_fallback(mock_urlopen):
    """Test that the engine falls back to heuristic generation if the API throws an exception."""
    mock_content_profile = {"topic": "AI Agents"}
    mock_prediction = {"platform": "youtube"}
    
    # Force an exception when opening URL
    mock_urlopen.side_effect = Exception("API rate limit exceeded")

    original_key = os.environ.get("REKA_API_KEY")
    os.environ["REKA_API_KEY"] = "fake_test_key"
    
    try:
        engine = RecommendationEngine()
        recommendations = engine.generate_recommendations(mock_content_profile, {}, mock_prediction)
        
        # It should have fallen back successfully
        assert "video_description" in recommendations
        assert "ai agents" in recommendations["video_description"].lower()
    finally:
        if original_key is not None:
            os.environ["REKA_API_KEY"] = original_key
        else:
            del os.environ["REKA_API_KEY"]
