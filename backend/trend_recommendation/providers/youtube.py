import os
import json
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from dotenv import load_dotenv

load_dotenv()

class YouTubeTrendProvider:
    def __init__(self):
        self.api_key = os.getenv("YOUTUBE_API_KEY")
        
        # Load local fallback data
        fallback_path = os.path.join(os.path.dirname(__file__), '../../../sample_data/fallback_trends.json')
        try:
            with open(fallback_path, 'r') as f:
                self.fallback_data = json.load(f)
        except FileNotFoundError:
            self.fallback_data = {}
            
    def get_trend_signals(self, topic: str) -> dict:
        """
        Attempts to fetch real trend data for a topic using YouTube Data API.
        Falls back to local mock data if the API key is missing or the API fails.
        """
        if not self.api_key or self.api_key == 'your_api_key_here':
            print(f"Warning: YOUTUBE_API_KEY not set. Using local fallback for topic '{topic}'.")
            return self._get_fallback_data(topic)
            
        try:
            youtube = build('youtube', 'v3', developerKey=self.api_key)
            
            # Request recent videos related to the topic
            request = youtube.search().list(
                part="snippet",
                q=topic,
                type="video",
                order="viewCount",
                maxResults=5
            )
            response = request.execute()
            
            # Very basic raw momentum metric based on finding high-view videos
            items = response.get('items', [])
            score = 50 + (len(items) * 10)  # simple naive calculation
            momentum = "high" if len(items) > 3 else "stable"
            
            return {
                "score": min(score, 100),
                "momentum": momentum,
                "direction": "rising" if momentum == "high" else "stable",
                "source": "youtube_api"
            }
            
        except HttpError as e:
            print(f"YouTube API Error: {e}. Falling back to local data.")
            return self._get_fallback_data(topic)

    def _get_fallback_data(self, topic: str) -> dict:
        topic_lower = topic.lower()
        for key in self.fallback_data.keys():
            if key.lower() in topic_lower or topic_lower in key.lower():
                data = self.fallback_data[key].copy()
                data["source"] = "local_fallback"
                return data
                
        # Default fallback if topic isn't in JSON
        return {
            "score": 50,
            "momentum": "stable",
            "direction": "stable",
            "source": "local_fallback"
        }
