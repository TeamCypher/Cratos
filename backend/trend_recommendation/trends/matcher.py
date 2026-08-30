from typing import Dict, Any, List

class TrendMatcher:
    @staticmethod
    def calculate_match_score(content_profile: Dict[str, Any], trend_topic: str) -> float:
        """
        Calculates a semantic match score (0.0 to 1.0) between the video's content profile
        and a specific trending topic.
        
        For the hackathon MVP, we use basic string/keyword matching instead of heavy NLP.
        """
        score = 0.0
        trend_lower = trend_topic.lower()
        
        # Check topic
        video_topic = content_profile.get("topic", "").lower()
        if video_topic and (video_topic in trend_lower or trend_lower in video_topic):
            score += 0.5
            
        # Check subtopic
        video_subtopic = content_profile.get("subtopic", "").lower()
        if video_subtopic and (video_subtopic in trend_lower or trend_lower in video_subtopic):
            score += 0.2
            
        # Check keywords
        keywords = content_profile.get("keywords", [])
        if isinstance(keywords, list):
            match_count = sum(1 for kw in keywords if kw.lower() in trend_lower or trend_lower in kw.lower())
            if match_count > 0:
                score += min(0.3, match_count * 0.1) # Max 0.3 from keywords
                
        # Ensure score is within 0.0 and 1.0
        return min(1.0, score)

    @staticmethod
    def match_content_to_trends(content_profile: Dict[str, Any], active_trends: List[str]) -> List[Dict[str, Any]]:
        """
        Takes a content profile and a list of active trend topics, returning them
        ranked by relevance/match score.
        """
        results = []
        for trend in active_trends:
            match_score = TrendMatcher.calculate_match_score(content_profile, trend)
            results.append({
                "trend_topic": trend,
                "relevance_score": match_score
            })
            
        # Sort by relevance descending
        results.sort(key=lambda x: x["relevance_score"], reverse=True)
        return results
