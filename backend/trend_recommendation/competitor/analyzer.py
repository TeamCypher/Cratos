import logging
import json
from typing import Dict, Any, List
from backend.data.repositories import CompetitorRepository
from backend.core.embeddings import semantic_matcher
import uuid

logger = logging.getLogger(__name__)

class CompetitorAnalyzer:
    def __init__(self):
        self.repo = CompetitorRepository()

    def analyze_gaps(self, video_id: str, topic: str, content_profile: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyzes the topic against known competitor data (mocked) to find overlap and content gaps.
        """
        # Mocking competitor data for the topic
        competitors = [
            {"channel_id": "comp_1", "topics": ["setup", "gear", "lighting", topic], "best_times": ["18:00 - 20:00"]},
            {"channel_id": "comp_2", "topics": ["review", "unboxing", "budget"], "best_times": ["12:00 - 14:00"]}
        ]
        
        # Calculate overlap using semantic matcher
        total_overlap = 0
        all_comp_topics = []
        for comp in competitors:
            all_comp_topics.extend(comp["topics"])
            
        max_similarity = 0
        for comp_topic in all_comp_topics:
            score = semantic_matcher.compute_similarity_text(topic, comp_topic)
            if score > max_similarity:
                max_similarity = score
                
        overlap_score = int(max_similarity * 100)
        
        # Find gaps (topics not covered by competitors but related to user's category)
        category = content_profile.get("category", "").lower()
        gap_topics = []
        if "gaming" in category:
            gap_topics = ["advanced strats", "indie games", "speedrunning"]
        elif "tech" in category or "review" in category:
            gap_topics = ["long term review", "repair guide", "software tricks"]
        else:
            gap_topics = ["behind the scenes", "q&a", "deep dive"]
            
        # Timing gaps
        timing_gaps = ["06:00 - 08:00", "22:00 - 24:00"]
        
        # Save to DB
        analysis_id = str(uuid.uuid4())
        self.repo.create_analysis(
            analysis_id=analysis_id,
            video_id=video_id,
            channel_id="competitor_aggregate",
            overlap_score=overlap_score,
            gap_topics=json.dumps(gap_topics),
            timing_gaps=json.dumps(timing_gaps)
        )
        
        return {
            "overlap_score": overlap_score,
            "gap_topics": gap_topics,
            "timing_gaps": timing_gaps
        }
