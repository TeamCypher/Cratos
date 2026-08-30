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
            
            if category in ["education", "gaming", "lifestyle", "tech"]: score += 20
            
        elif platform == "twitch":
            if pacing == "fast": score += 15
            elif pacing == "slow": score -= 10
            
            if category in ["gaming", "live", "just chatting", "esports"]: score += 25
            
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
    def calculate_timing_score(content_profile: Dict[str, Any], platform: str) -> Tuple[int, str, str]:
        """
        Returns a timing score, best time string, and an explanation. Adds a small random variance
        to simulate dynamic 'best time to post' predictions for the hackathon demo.
        """
        # Base logic:
        # Gaming -> Late afternoon / evening
        # Lifestyle -> Morning / lunch
        category = content_profile.get("category", "").lower()
        
        score = 70 + random.randint(-10, 20) # Dynamic variance for demo impression
        
        if category == "gaming":
            best_time = "18:00 - 21:00"
            reason = "Late evening aligns perfectly with gaming audience active hours."
        elif category in ["lifestyle", "fitness"]:
            best_time = "08:00 - 10:00"
            reason = "Morning hours show highest engagement for lifestyle content."
        else:
            best_time = "15:00 - 17:00"
            reason = "Standard afternoon peak engagement window."
            
        return min(100, score), best_time, reason
