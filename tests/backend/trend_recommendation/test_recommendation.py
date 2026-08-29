import json
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')))

from backend.trend_recommendation.recommendation.engine import RecommendationEngine

def test_recommendation():
    mock_content_profile = {
        "topic": "Minecraft",
        "subtopic": "Rare Glitch",
        "category": "Gaming",
        "keywords": ["Minecraft", "glitch", "speedrun"],
        "emotion": "excitement",
        "audience": "gaming enthusiasts",
        "hook_score": 85,
        "pacing": "fast"
    }

    mock_trend_signal = {
        "score": 90,
        "momentum": "high",
        "direction": "rising",
        "source": "youtube_api"
    }
    
    mock_prediction = {
        "platform": "youtube_shorts",
        "score": 75,
        "confidence": 0.8,
        "reasons": [
            "Trend Momentum (high): 84/100",
            "Content Fit: 85/100",
        ],
        "best_time": "18:00 - 21:00",
    }

    engine = RecommendationEngine()
    
    print("--- Running Recommendation Engine ---")
    recommendations = engine.generate_recommendations(mock_content_profile, mock_trend_signal, mock_prediction)
    
    print(json.dumps(recommendations, indent=2))

if __name__ == "__main__":
    test_recommendation()
