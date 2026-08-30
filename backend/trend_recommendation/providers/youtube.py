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
        self.fallback_path = os.path.join(os.path.dirname(__file__), '../../../sample_data/fallback_youtube.json')
        try:
            with open(self.fallback_path, 'r') as f:
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
            
            # 1. Search for top recent videos related to the topic
            request = youtube.search().list(
                part="id",
                q=topic,
                type="video",
                order="relevance",
                maxResults=10
            )
            response = request.execute()
            
            video_ids = [item['id']['videoId'] for item in response.get('items', []) if 'videoId' in item['id']]
            
            if not video_ids:
                return self._get_fallback_data(topic)
                
            # 2. Fetch actual view counts and publish dates for these videos
            stats_request = youtube.videos().list(
                part="statistics,snippet",
                id=",".join(video_ids)
            )
            stats_response = stats_request.execute()
            
            from datetime import datetime, timezone
            now = datetime.now(timezone.utc)
            total_views_per_day = 0
            valid_videos = 0
            trending_descriptions = []
            
            for item in stats_response.get('items', []):
                views = int(item['statistics'].get('viewCount', 0))
                published_at_str = item['snippet']['publishedAt']
                description = item['snippet'].get('description', '').strip()
                if description and len(description) > 20:
                    # Keep it reasonably short for the prompt, max 500 chars
                    trending_descriptions.append(description[:500])
                    
                # parse ISO format, handle Z for UTC
                published_at = datetime.fromisoformat(published_at_str.replace('Z', '+00:00'))
                
                days_old = max((now - published_at).days, 1)
                total_views_per_day += (views / days_old)
                valid_videos += 1
                
            if valid_videos == 0:
                return self._get_fallback_data(topic)
                
            avg_views_per_day = total_views_per_day / valid_videos
            
            # 3. Calculate an accurate 0-100 score based on avg views per day
            # Assuming 100,000 avg views/day is a viral/perfect score
            score = min(int((avg_views_per_day / 100000) * 100), 100)
            score = max(score, 5) # Minimum baseline score
            
            if avg_views_per_day > 50000:
                momentum = "high"
                direction = "rising"
            elif avg_views_per_day > 10000:
                momentum = "medium"
                direction = "rising"
            else:
                momentum = "stable"
                direction = "stable"
            
            result = {
                "score": score,
                "momentum": momentum,
                "direction": direction,
                "trending_descriptions": trending_descriptions[:5], # Keep top 5
                "source": "youtube_api"
            }
            
            # Update local fallback to become more reliable over time
            self._update_fallback_data(topic, result)
            
            return result
            
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

    def _update_fallback_data(self, topic: str, data: dict):
        """Saves a successful API result to the local fallback JSON file."""
        # Create a copy so we don't save the 'source' key to the fallback
        save_data = data.copy()
        if "source" in save_data:
            del save_data["source"]
            
        self.fallback_data[topic] = save_data
        
        # Ensure the directory exists
        os.makedirs(os.path.dirname(self.fallback_path), exist_ok=True)
        
        with open(self.fallback_path, 'w') as f:
            json.dump(self.fallback_data, f, indent=4)
