import os
import sys
from dotenv import load_dotenv

sys.path.append(os.path.dirname(__file__))
load_dotenv()

from backend.video_ai.profile_builder import generate_metadata_with_gemini
from backend.trend_recommendation.recommendation.engine import RecommendationEngine

def test():
    print("Testing Gemini integration...")
    if not os.getenv("GEMINI_API_KEY") or os.getenv("GEMINI_API_KEY") == "your_gemini_key_here":
        print("No valid GEMINI_API_KEY found, skipping API call test.")
        return

    print("Testing generate_metadata_with_gemini...")
    meta = generate_metadata_with_gemini(
        transcript="This video is about cooking a delicious pasta.",
        ocr_text=["PASTA", "RECIPE"],
        keywords=["cooking", "pasta", "recipe", "food"]
    )
    print("Metadata Result:", meta)

    print("\nTesting RecommendationEngine with Gemini...")
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
    test()
