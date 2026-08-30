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
                try:
                    streams_url = f"https://api.twitch.tv/helix/streams?game_id={category_id}&first=5"
                    streams_req = urllib.request.Request(streams_url, headers=headers)
                    with urllib.request.urlopen(streams_req) as streams_response:
                        streams_result = json.loads(streams_response.read().decode())
                        for stream in streams_result.get('data', []):
                            title = stream.get('title', '').strip()
                            if title:
                                trending_descriptions.append(title[:500])
                except Exception as e:
                    print(f"Twitch Streams API Error: {e}")
                
                api_result = {
                    "score": score,
                    "momentum": momentum,
                    "direction": direction,
                    "trending_descriptions": trending_descriptions,
                    "source": "twitch_api"
                }
                
                self._update_fallback_data(topic, api_result)
                return api_result
                
        except Exception as e:
            print(f"Twitch API Error: {e}. Falling back to local data.")
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
        save_data = data.copy()
        if "source" in save_data:
            del save_data["source"]
            
        self.fallback_data[topic] = save_data
        
        os.makedirs(os.path.dirname(self.fallback_path), exist_ok=True)
        with open(self.fallback_path, 'w') as f:
            json.dump(self.fallback_data, f, indent=4)
