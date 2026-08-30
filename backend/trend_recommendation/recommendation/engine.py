import os
import json
from typing import Dict, Any
from dotenv import load_dotenv
from google import genai
from google.genai import types

from .prompts import RECOMMENDATION_SYSTEM_PROMPT

load_dotenv()

class RecommendationEngine:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if self.api_key and self.api_key != "your_gemini_key_here":
            self.client = genai.Client(api_key=self.api_key)
        else:
            self.client = None

    def generate_recommendations(self, content_profile: Dict[str, Any], trend_signal: Dict[str, Any], prediction: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calls the Gemini API to generate tailored recommendations.
        Falls back to a static heuristic generation if API fails or key is missing.
        """
        if not self.client:
            print("Warning: Missing Gemini API Key. Using local heuristic recommendations.")
            return self._generate_heuristic_fallback(content_profile, prediction)
        
        # Construct the user prompt with the JSON payload context
        input_data = {
            "content_profile": content_profile,
            "trend_signal": trend_signal,
            "prediction": prediction
        }
        
        user_prompt = f"Here is the data for the video:\n{json.dumps(input_data, indent=2)}\n\nPlease generate the JSON recommendations as instructed."
        
        try:
            response = self.client.models.generate_content(
                model='gemini-1.5-flash',
                contents=user_prompt,
                config=types.GenerateContentConfig(
                    system_instruction=RECOMMENDATION_SYSTEM_PROMPT,
                    response_mime_type="application/json",
                ),
            )
            recommendations = json.loads(response.text)
            return recommendations
                
        except Exception as e:
            print(f"Gemini API Error: {e}. Falling back to heuristics.")
            return self._generate_heuristic_fallback(content_profile, prediction)

    def _generate_heuristic_fallback(self, content_profile: Dict[str, Any], prediction: Dict[str, Any]) -> Dict[str, Any]:
        """A safe fallback in case the AI API is unavailable."""
        topic = content_profile.get("topic")
        if not topic or topic.lower() == "unknown":
            topic = "General Content"
            
        platform = prediction.get("platform", "this platform").replace("_", " ").title()
        
        return {
            "video_description": f"Check out this amazing video about {topic}! Perfect for {platform}. Don't forget to like and subscribe for more content.",
            "captions": [
                f"Did you know this about {topic}? 👇",
                f"The ultimate {topic} hack! 🤯",
                f"Wait for the end... #{topic.replace(' ', '')}"
            ],
            "hashtags": [
                f"#{topic.replace(' ', '')}",
                "#viral",
                "#trending",
                f"#{content_profile.get('category', 'fyp').lower()}"
            ],
            "title_variations": [
                f"The Truth About {topic}",
                f"I tried the {topic} trend",
                f"Best {topic} strategy in 2024"
            ],
            "optimization_tips": [
                f"Your hook score is {content_profile.get('hook_score', 50)}/100. Try to introduce the main conflict within the first 3 seconds.",
                f"Since pacing is {content_profile.get('pacing', 'average')}, consider adding jump cuts to maintain retention on {platform}."
            ]
        }
