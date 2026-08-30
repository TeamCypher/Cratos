import random
from typing import Dict, Any, Tuple

class FeatureNormalizer:
    @staticmethod
    def normalize_trend_momentum(momentum: str, score: int) -> int:
        """
        Normalizes trend momentum and score into a 0-100 feature score.
        """
        momentum = momentum.lower()
        if momentum == "high":
            base = 80
        elif momentum == "medium":
            base = 60
        else:
            base = 40
            
        # Blend base momentum with the actual trend score
        return min(100, int((base * 0.6) + (score * 0.4)))

    @staticmethod
    def calculate_platform_fit(content_profile: Dict[str, Any], platform: str) -> int:
        """
        Calculates a 0-100 score for how well the content structurally fits the platform.
        """
        score = 50 # Baseline
        pacing = content_profile.get("pacing", "").lower()
        category = content_profile.get("category", "").lower()
        
        if platform == "youtube":
            if pacing == "medium" or pacing == "slow": score += 15
            elif pacing == "fast": score += 5
            
            if category in ["education", "gaming", "howto & style", "science & technology", "entertainment"]: score += 20
            
        elif platform == "twitch":
            if pacing == "fast": score += 15
            elif pacing == "slow": score -= 10
            
            if category in ["gaming", "people & blogs", "entertainment", "music"]: score += 25
            
        return max(0, min(100, score))

    @staticmethod
    def calculate_audience_match(content_profile: Dict[str, Any], platform: str) -> int:
        """
        Calculates a 0-100 score for audience demographic match.
        """
        score = 50
        audience = content_profile.get("audience", "").lower()
        
        if platform == "youtube":
            if "general" in audience or "tech" in audience or "educational" in audience:
                score += 25
        elif platform == "twitch":
            if "gamer" in audience or "young" in audience or "live" in audience:
                score += 25
                
        return max(0, min(100, score))
        
    @staticmethod
    def calculate_engagement_potential(content_profile: Dict[str, Any], platform: str) -> int:
        """
        Estimates engagement potential based on emotion and category.
        """
        score = 50
        emotion = content_profile.get("emotion", "").lower()
        
        high_engagement_emotions = ["surprise", "excitement", "humor", "anger", "awe"]
        if emotion in high_engagement_emotions:
            score += 30
            
        return max(0, min(100, score))

    @staticmethod
    def calculate_timing_score(content_profile: Dict[str, Any], trend_signal: Dict[str, Any], platform: str) -> Tuple[int, str, str]:
        """
        Returns a timing score, best time string, and an explanation.
        """
        if "best_time" in trend_signal:
            return 95, trend_signal["best_time"], "Calculated based on live peak upload times from top trending videos in this topic."
            
        category = content_profile.get("category", "").lower()
        
        score = 70
        
        if category == "gaming":
            best_time = "18:00 - 21:00"
            reason = "Late evening aligns perfectly with gaming audience active hours."
            score = 90
        elif category in ["howto & style", "people & blogs", "travel & events"]:
            best_time = "08:00 - 10:00"
            reason = "Morning hours show highest engagement for lifestyle and vlogging content."
            score = 85
        elif category in ["education", "science & technology"]:
            best_time = "12:00 - 14:00"
            reason = "Mid-day posts work well for educational content."
            score = 80
        elif category in ["music", "entertainment", "comedy"]:
            best_time = "20:00 - 22:00"
            reason = "Evening hours peak for entertainment consumption."
            score = 85
        else:
            best_time = "15:00 - 17:00"
            reason = "Standard afternoon peak engagement window."
            
        return min(100, score), best_time, reason
