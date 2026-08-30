import os
import json
from datetime import datetime, timezone
from pytrends.request import TrendReq

class GoogleTrendProvider:
    def __init__(self):
        # We don't need an API key for pytrends!
        # Initialize pytrends with typical request parameters
        self.pytrends = TrendReq(hl='en-US', tz=360)
        
        # Load local fallback data
        self.fallback_path = os.path.join(os.path.dirname(__file__), '../../../sample_data/fallback_google.json')
        try:
            with open(self.fallback_path, 'r') as f:
                self.fallback_data = json.load(f)
        except FileNotFoundError:
            self.fallback_data = {}
            
    async def get_trend_signals_async(self, topic: str) -> dict:
        import asyncio
        return await asyncio.to_thread(self.get_trend_signals, topic)

    def get_trend_signals(self, topic: str) -> dict:
        """
        Attempts to fetch real trend data for a topic using Google Trends (pytrends).
        Falls back to local mock data if rate limited or if the topic yields no data.
        """
        try:
            # Build the payload for the last 30 days
            self.pytrends.build_payload([topic], cat=0, timeframe='today 1-m', geo='', gprop='')
            
            # Fetch interest over time
            df = self.pytrends.interest_over_time()
            
            if df.empty or topic not in df.columns:
                return self._get_fallback_data(topic)
                
            # Process the dataframe
            # The 'topic' column contains the relative search interest from 0 to 100
            recent_data = df[topic].values
            
            if len(recent_data) < 2:
                return self._get_fallback_data(topic)
                
            # Average score over the past week (last 7 days)
            recent_week = recent_data[-7:]
            avg_score = int(sum(recent_week) / len(recent_week))
            
            # Calculate momentum and direction based on slope (difference between last week and previous week)
            if len(recent_data) >= 14:
                previous_week = recent_data[-14:-7]
                avg_previous = sum(previous_week) / len(previous_week)
                difference = avg_score - avg_previous
            else:
                difference = recent_data[-1] - recent_data[0]
                
            if difference > 10:
                momentum = "high"
                direction = "rising"
            elif difference > 0:
                momentum = "medium"
                direction = "rising"
            elif difference < -10:
                momentum = "high"
                direction = "falling"
            elif difference < 0:
                momentum = "medium"
                direction = "falling"
            else:
                momentum = "stable"
                direction = "stable"
                
            result = {
                "score": max(5, avg_score),  # ensure a minimum score of 5
                "momentum": momentum,
                "direction": direction,
                "source": "google_trends"
            }
            
            # Update fallback data
            self._update_fallback_data(topic, result)
            
            return result
            
        except Exception as e:
            # Catch 429 Too Many Requests or other connection issues
            print(f"Google Trends Error: {e}. Falling back to local data.")
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
                
        # Default fallback
        return {
            "score": 50,
            "momentum": "stable",
            "direction": "stable",
            "source": "local_fallback"
        }

    def _update_fallback_data(self, topic: str, data: dict):
        save_data = data.copy()
        if "source" in save_data:
            del save_data["source"]
            
        self.fallback_data[topic] = save_data
        
        os.makedirs(os.path.dirname(self.fallback_path), exist_ok=True)
        
        with open(self.fallback_path, 'w') as f:
            json.dump(self.fallback_data, f, indent=4)
