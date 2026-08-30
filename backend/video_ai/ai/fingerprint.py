import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

class ContentFingerprinter:
    @staticmethod
    def fingerprint(hook_data: Dict[str, Any], speech_data: Dict[str, Any], visual_data: Dict[str, Any], duration: float) -> str:
        """
        Classifies the video into an archetype (tutorial, vlog, fast_cut_meme, gaming, review, general)
        based on structural signals.
        """
        
        audio_hook = hook_data.get("audio_hook", {})
        visual_hook = hook_data.get("visual_hook", {})
        text_hook = hook_data.get("text_hook", {})
        
        pacing = visual_hook.get("pacing_score", 0)
        early_text = text_hook.get("early_text_score", 0) > 50
        first_speech = audio_hook.get("speech_timing_score", 0)
        
        segments = speech_data.get("segments", [])
        total_words = sum(len(seg.get("text", "").split()) for seg in segments)
        
        speech_density = total_words / duration if duration > 0 else 0
        
        # Heuristics for Archetypes
        if pacing > 70 and duration < 60:
            return "fast_cut_meme"
            
        if speech_density > 2.5 and early_text:
            return "tutorial"
            
        if pacing < 40 and speech_density > 2.0:
            return "review"
            
        if first_speech < 50 and pacing > 50:
            return "vlog"
            
        return "general"
