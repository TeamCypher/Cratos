import os
import json
import urllib.request
import urllib.parse
from dotenv import load_dotenv

load_dotenv()

class TwitchTrendProvider:
    def __init__(self):
        self.client_id = os.getenv("TWITCH_CLIENT_ID")
        self.client_secret = os.getenv("TWITCH_CLIENT_SECRET")
        self.access_token = None
        
        # Load local fallback data
        self.fallback_path = os.path.join(os.path.dirname(__file__), '../../../sample_data/fallback_twitch.json')
        try:
            with open(self.fallback_path, 'r') as f:
                self.fallback_data = json.load(f)
        except FileNotFoundError:
            self.fallback_data = {}

    def _get_access_token(self) -> str:
        """Fetches an OAuth App Access Token via Client Credentials flow."""
        if not self.client_id or not self.client_secret or self.client_id == 'your_twitch_client_id_here':
            return None
            
        url = 'https://id.twitch.tv/oauth2/token'
        data = urllib.parse.urlencode({
            'client_id': self.client_id,
            'client_secret': self.client_secret,
            'grant_type': 'client_credentials'
        }).encode('utf-8')
        
        try:
            req = urllib.request.Request(url, data=data, method='POST')
            with urllib.request.urlopen(req) as response:
                result = json.loads(response.read().decode())
                return result.get('access_token')
        except Exception as e:
            print(f"Twitch OAuth Error: {e}")
            return None

    async def get_trend_signals_async(self, topic: str) -> dict:
        import asyncio
        return await asyncio.to_thread(self.get_trend_signals, topic)

    def get_trend_signals(self, topic: str) -> dict:
        """
        Attempts to fetch real trend data for a topic using Twitch API.
        Falls back to local mock data if the API key is missing or the API fails.
        """
        # Ensure we have an access token
        if not self.access_token:
            self.access_token = self._get_access_token()
            
        if not self.access_token:
            print(f"Warning: Twitch credentials not valid. Using local fallback for topic '{topic}'.")
            return self._get_fallback_data(topic)

        # Query Twitch Search Categories API
        query = urllib.parse.quote(topic)
        url = f"https://api.twitch.tv/helix/search/categories?query={query}"
        
        headers = {
            'Client-ID': self.client_id,
            'Authorization': f'Bearer {self.access_token}'
        }
        
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req) as response:
                result = json.loads(response.read().decode())
                
                items = result.get('data', [])
                if not items:
                    return self._get_fallback_data(topic)
                    
                # In a real app we'd fetch active viewer counts via streams endpoint,
                # but for this MVP, if the category exists and is relevant, we'll assign a heuristic score.
                # A better approach for the future would be:
                # 1. search/categories to get category ID
                # 2. streams?game_id={ID} to sum viewer counts
                # Here we mock the score based on successful category lookup as a baseline.
                
                # Mock calculated score based on finding a match
                score = 75
                momentum = "medium"
                direction = "rising"
                
                
                # Check exact match and get category ID
                category_id = items[0]['id']
                for item in items:
                    if item.get('name', '').lower() == topic.lower():
                        score = 95
                        momentum = "high"
                        category_id = item['id']
                        break
                
                # Fetch live streams for this category to get titles (trending descriptions)
                trending_descriptions = []
                publish_hours = []
                try:
                    streams_url = f"https://api.twitch.tv/helix/streams?game_id={category_id}&first=5"
                    streams_req = urllib.request.Request(streams_url, headers=headers)
                    with urllib.request.urlopen(streams_req) as streams_response:
                        streams_result = json.loads(streams_response.read().decode())
                        for stream in streams_result.get('data', []):
                            title = stream.get('title', '').strip()
                            if title:
                                trending_descriptions.append(title[:500])
                                
                            started_at_str = stream.get('started_at')
                            if started_at_str:
                                from datetime import datetime
                                started_at = datetime.fromisoformat(started_at_str.replace('Z', '+00:00'))
                                publish_hours.append(started_at.hour)
                except Exception as e:
                    print(f"Twitch Streams API Error: {e}")
                    
                if publish_hours:
                    from collections import Counter
                    most_common_hour = Counter(publish_hours).most_common(1)[0][0]
                    best_time = f"{most_common_hour:02d}:00 - {(most_common_hour+1)%24:02d}:00"
                else:
                    best_time = None
                
                api_result = {
                    "score": score,
                    "momentum": momentum,
                    "direction": direction,
                    "trending_descriptions": trending_descriptions,
                    "source": "twitch_api"
                }
                if best_time:
                    api_result["best_time"] = best_time
                
                self._update_fallback_data(topic, api_result)
                return api_result
                
        except Exception as e:
            print(f"Twitch API Error: {e}. Falling back to local data.")
            return self._get_fallback_data(topic)

    def _get_fallback_data(self, topic: str) -> dict:
        try:
            from backend.core.embeddings import semantic_matcher
            best_match = None
            best_score = 0.0
            
            for key in self.fallback_data.keys():
                score = semantic_matcher.compute_similarity_text(topic, key)
                if score > best_score:
                    best_score = score
                    best_match = key
                    
            if best_match and best_score > 0.6:
                data = self.fallback_data[best_match].copy()
                data["source"] = "local_fallback"
                return data
        except ImportError:
            pass

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
        save_data = data.copy()
        if "source" in save_data:
            del save_data["source"]
            
        self.fallback_data[topic] = save_data
        
        os.makedirs(os.path.dirname(self.fallback_path), exist_ok=True)
        with open(self.fallback_path, 'w') as f:
            json.dump(self.fallback_data, f, indent=4)

    def get_global_trends(self) -> list:
        """Fetches current global trending streams using the Twitch API."""
        if not self.access_token:
            self.access_token = self._get_access_token()
            
        if not self.access_token:
            return []
            
        url = "https://api.twitch.tv/helix/streams?first=10"
        headers = {
            'Client-ID': self.client_id,
            'Authorization': f'Bearer {self.access_token}'
        }
        
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req) as response:
                result = json.loads(response.read().decode())
                
                trends = []
                import uuid
                for stream in result.get('data', []):
                    viewers = int(stream.get('viewer_count', 0))
                    score = min(int((viewers / 50000) * 100), 100)
                    score = max(score, 50)
                    
                    trends.append({
                        "id": str(uuid.uuid4()),
                        "topic": stream.get('game_name', stream.get('user_name', 'Stream')),
                        "source": "twitch_api",
                        "platform": "Twitch",
                        "trend_score": score,
                        "momentum": "high" if score > 80 else "medium",
                        "direction": "rising" if score > 80 else "stable",
                    })
                return trends
        except Exception as e:
            print(f"Twitch API Error fetching global trends: {e}")
            return []
