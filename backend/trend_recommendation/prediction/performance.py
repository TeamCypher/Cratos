import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

class PerformancePredictor:
    """Predicts performance metrics based on trend velocity and video hook strength."""
    
    @staticmethod
    def predict_performance(velocity_data: Dict[str, Any], hook_data: Dict[str, Any], trend_score: int) -> Dict[str, Any]:
        hook_strength = hook_data.get("hook_strength_score", 50)
        velocity = velocity_data.get("velocity_score", 0.0)
        
        # Base multiplier based on overall trend score
        base_multiplier = max(0.5, trend_score / 50.0)
        
        # Hook multiplier (strong hooks double performance, weak hooks halve it)
        hook_multiplier = max(0.2, hook_strength / 50.0)
        
        # Velocity multiplier (growing trends boost performance, dying trends kill it)
        velocity_multiplier = max(0.1, 1.0 + (velocity / 50.0))
        
        composite_multiplier = base_multiplier * hook_multiplier * velocity_multiplier
        
        # Arbitrary base views for a "standard" video in a "standard" trend
        base_views = 1000
        predicted_views = int(base_views * composite_multiplier)
        
        # Engagement rate estimation (heavily dependent on hook)
        base_engagement_rate = 0.05
        predicted_engagement_rate = min(0.25, base_engagement_rate * hook_multiplier)
        
        return {
            "predicted_views": predicted_views,
            "predicted_engagement_rate": round(predicted_engagement_rate, 3),
            "performance_score": round(min(100.0, composite_multiplier * 25.0))
        }
