import json
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from backend.trend_recommendation.prediction.engine import PredictionEngine

def test_prediction():
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

    print("--- Content Profile ---")
    print(json.dumps(mock_content_profile, indent=2))
    print("\n--- Trend Signal ---")
    print(json.dumps(mock_trend_signal, indent=2))

    print("\n--- Running Prediction Engine ---")
    results = PredictionEngine.score_platforms(
        video_id="test_vid_123",
        content_profile=mock_content_profile,
        trend_signal=mock_trend_signal
    )
    
    print(json.dumps(results, indent=2))

if __name__ == "__main__":
    test_prediction()
