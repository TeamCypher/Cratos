import os
import json
import requests
from tenacity import retry, stop_after_attempt, wait_exponential
from openai import OpenAI
from typing import Dict, Any
from dotenv import load_dotenv

from .prompts import RECOMMENDATION_SYSTEM_PROMPT

load_dotenv()

class RecommendationEngine:
    def __init__(self):
        self.api_key = os.getenv("OPENROUTER_API_KEY")

    def generate_recommendations(self, content_profile: Dict[str, Any], trend_signal: Dict[str, Any], prediction: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calls the OpenRouter API to generate tailored recommendations.
        """
        if not self.api_key or self.api_key == "your_openrouter_api_key":
            raise ValueError("Missing OPENROUTER_API_KEY. System requires API to be connected; false data is not tolerated.")
        
        # Construct the user prompt with the JSON payload context
        input_data = {
            "content_profile": content_profile,
            "trend_signal": trend_signal,
            "prediction": prediction
        }
        
        user_prompt = f"Here is the data for the video:\n{json.dumps(input_data, indent=2)}\n\nPlease generate the JSON recommendations as instructed."
        
        @retry(stop=stop_after_attempt(5), wait=wait_exponential(multiplier=2, min=2, max=32), reraise=True)
        def _do_call():
            client = OpenAI(base_url="https://openrouter.ai/api/v1", api_key=self.api_key)
            response = client.chat.completions.create(
                messages=[{"role": "user", "content": f"{RECOMMENDATION_SYSTEM_PROMPT}\n\n{user_prompt}"}],
                model="nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free"
            )
            return response.choices[0].message.content.strip()
        
        try:
            result_text = _do_call()
            
            # Parse the JSON string
            if result_text.startswith("```json"):
                result_text = result_text.split("```json")[1].split("```")[0].strip()
            elif result_text.startswith("```"):
                result_text = result_text.split("```")[1].strip()
                
            recommendations = json.loads(result_text)
            return recommendations
                
        except Exception as e:
            raise ValueError(f"AI Recommendation Generation Failed. False data is not tolerated. Error: {e}")
