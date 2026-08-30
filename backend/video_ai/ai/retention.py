import logging
from typing import Dict, Any, List
from .hook import calculate_audio_energy, calculate_visual_pacing

logger = logging.getLogger(__name__)

def calculate_retention_curve(video_path: str, audio_path: str, speech_data: Dict[str, Any], duration: float) -> List[Dict[str, float]]:
    """
    Calculates a second-by-second retention curve for the entire video.
    """
    retention_curve = []
    
    max_seconds = int(duration)
    if max_seconds <= 0:
        return []
        
    for sec in range(max_seconds):
        audio_energy = calculate_audio_energy(audio_path, start_sec=sec, duration_sec=1.0)
        visual_pacing = calculate_visual_pacing(video_path, start_sec=sec, duration_sec=1.0)
        
        # Calculate speech density for this second
        words_in_sec = 0
        segments = speech_data.get("segments", [])
        for segment in segments:
            start = segment.get("start", 0)
            end = segment.get("end", 0)
            # Check if this segment overlaps with the current second (sec to sec+1)
            if start < sec + 1 and end > sec:
                text = segment.get("text", "")
                words = len(text.split())
                # Apportion words proportionally to the overlap
                overlap = min(end, sec + 1) - max(start, sec)
                segment_duration = max(end - start, 0.1)
                words_in_sec += words * (overlap / segment_duration)
                
        # Normalize speech density (assume 3 words per second is very high density)
        speech_density_score = min(100.0, (words_in_sec / 3.0) * 100.0)
        
        # Combine scores (40% audio, 40% visual, 20% speech)
        composite_score = (audio_energy * 0.4) + (visual_pacing * 0.4) + (speech_density_score * 0.2)
        
        retention_curve.append({
            "timestamp_sec": sec,
            "retention_score": round(composite_score, 2)
        })
        
    return retention_curve
