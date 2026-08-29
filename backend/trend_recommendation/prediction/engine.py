import json
from typing import Dict, Any, List

from .normalizer import FeatureNormalizer

class PredictionEngine:
    # 14.3 Platform Suitability Formula Weights
    WEIGHTS = {
        "trend_momentum": 0.25,
        "audience_match": 0.20,
        "content_platform_fit": 0.20,
        "hook_strength": 0.15,
        "engagement_potential": 0.10,
        "timing": 0.10
    }

    @staticmethod
    def _calculate_platform_score(content_profile: Dict[str, Any], trend_signal: Dict[str, Any], platform: str) -> Dict[str, Any]:
        """
        Calculates the score and reasons for a single platform.
        """
        reasons = []
        
        # 1. Trend Momentum (25%)
        trend_score = trend_signal.get("score", 50)
        momentum = trend_signal.get("momentum", "stable")
        normalized_trend = FeatureNormalizer.normalize_trend_momentum(momentum, trend_score)
        reasons.append(f"Trend Momentum ({momentum}): {normalized_trend}/100")
        
        # 2. Audience Match (20%)
        audience_match = FeatureNormalizer.calculate_audience_match(content_profile, platform)
        reasons.append(f"Audience Match: {audience_match}/100")
        
        # 3. Content / Platform Fit (20%)
        platform_fit = FeatureNormalizer.calculate_platform_fit(content_profile, platform)
        reasons.append(f"Content Fit: {platform_fit}/100")
        
        # 4. Hook Strength (15%)
        hook_strength = content_profile.get("hook_score", 50)
        reasons.append(f"Hook Strength: {hook_strength}/100")
        
        # 5. Engagement Potential (10%)
        engagement_potential = FeatureNormalizer.calculate_engagement_potential(content_profile, platform)
        reasons.append(f"Engagement Potential: {engagement_potential}/100")
        
        # 6. Timing (10%)
        timing_score, best_time, timing_reason = FeatureNormalizer.calculate_timing_score(content_profile, platform)
        reasons.append(f"Timing ({best_time}): {timing_score}/100. {timing_reason}")
        
        # Calculate final weighted score
        final_score = (
            (normalized_trend * PredictionEngine.WEIGHTS["trend_momentum"]) +
            (audience_match * PredictionEngine.WEIGHTS["audience_match"]) +
            (platform_fit * PredictionEngine.WEIGHTS["content_platform_fit"]) +
            (hook_strength * PredictionEngine.WEIGHTS["hook_strength"]) +
            (engagement_potential * PredictionEngine.WEIGHTS["engagement_potential"]) +
            (timing_score * PredictionEngine.WEIGHTS["timing"])
        )
        
        # Calculate a basic confidence metric (heuristic based on having good data)
        confidence = 0.8 # Base confidence
        if trend_signal.get("source") != "youtube_api":
            confidence -= 0.1 # Lower confidence if using fallback/cache
        if not content_profile.get("audience"):
            confidence -= 0.1 # Missing some content signals
            
        return {
            "platform": platform,
            "score": int(final_score),
            "confidence": round(confidence, 2),
            "reasons": reasons, # Store as list, stringified in DB
            "best_time": best_time
        }

    @staticmethod
    def score_platforms(video_id: str, content_profile: Dict[str, Any], trend_signal: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Scores both Instagram Reels and YouTube Shorts.
        Returns a list of dictionaries suitable for saving to DB and the API response.
        """
        platforms = ["youtube_shorts", "instagram_reels"]
        results = []
        
        for platform in platforms:
            result = PredictionEngine._calculate_platform_score(content_profile, trend_signal, platform)
            result["video_id"] = video_id
            results.append(result)
            
        return results
