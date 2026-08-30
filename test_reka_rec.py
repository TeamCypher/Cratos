import os
import sys
from dotenv import load_dotenv

sys.path.append(os.path.dirname(__file__))
load_dotenv()

from backend.trend_recommendation.recommendation.engine import RecommendationEngine

def test_recommendation():
    print("Testing RecommendationEngine with Reka...")
    engine = RecommendationEngine()
    
    content_profile = {
        "topic": "Cooking",
        "category": "Howto & Style",
        "hook_score": 85,
        "pacing": "fast"
    }
    trend_signal = {
        "score": 90,
        "momentum": "high",
        "trending_descriptions": [
            "Best pasta recipe ever! Try this tonight.",
            "Quick and easy pasta in 10 minutes."
        ]
    }
    prediction = {
        "platform": "youtube_shorts"
    }
    
    result = engine.generate_recommendations(content_profile, trend_signal, prediction)
    print("Recommendation Result:")
    import pprint
    pprint.pprint(result)

if __name__ == "__main__":
    test_recommendation()
