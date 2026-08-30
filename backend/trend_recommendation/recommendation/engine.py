import os
import json
import requests
from typing import Dict, Any
from dotenv import load_dotenv

from .prompts import RECOMMENDATION_SYSTEM_PROMPT

load_dotenv()

class RecommendationEngine:
    def __init__(self):
        self.api_key = os.getenv("REKA_API_KEY")

    def generate_recommendations(self, content_profile: Dict[str, Any], trend_signal: Dict[str, Any], prediction: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calls the Reka API to generate tailored recommendations.
        Falls back to a static heuristic generation if API fails or key is missing.
        """
        if not self.api_key or self.api_key == "your_reka_api_key_here":
            print("Warning: Missing Reka API Key. Using local heuristic recommendations.")
            return self._generate_heuristic_fallback(content_profile, prediction)
        
        # Construct the user prompt with the JSON payload context
        input_data = {
            "content_profile": content_profile,
            "trend_signal": trend_signal,
            "prediction": prediction
        }
        
        user_prompt = f"Here is the data for the video:\n{json.dumps(input_data, indent=2)}\n\nPlease generate the JSON recommendations as instructed."
        
        import time
        max_retries = 5
        delay = 2
        
        url = "https://api.reka.ai/v1/chat"
        headers = {
            "Content-Type": "application/json",
            "X-Api-Key": self.api_key
        }
        payload = {
            "messages": [
                {
                    "role": "user",
                    "content": f"{RECOMMENDATION_SYSTEM_PROMPT}\n\n{user_prompt}"
                }
            ],
            "model": "reka-flash"
        }
        
        for attempt in range(max_retries):
            try:
                response = requests.post(url, headers=headers, json=payload, timeout=30)
                response.raise_for_status()
                
                data = response.json()
                result_text = data.get("responses", [{}])[0].get("message", {}).get("content", "").strip()
                
                # Parse the JSON string
                if result_text.startswith("```json"):
                    result_text = result_text.split("```json")[1].split("```")[0].strip()
                elif result_text.startswith("```"):
                    result_text = result_text.split("```")[1].strip()
                    
                recommendations = json.loads(result_text)
                return recommendations
                    
            except Exception as e:
                print(f"Reka API Error on attempt {attempt + 1}: {e}")
                if attempt < max_retries - 1:
                    time.sleep(delay)
                    delay *= 2
                else:
                    print("All retries failed. Falling back to heuristics.")
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
