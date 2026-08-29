from typing import Dict, Any

def build_content_profile(
    video_id: str,
    extractor_data: Dict[str, Any],
    speech_data: Dict[str, Any],
    visual_data: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Normalizes AI outputs into a stable ContentProfile schema.
    This acts as the bridge between Backend A (Video AI) and Backend B (Trend/Recs).
    
    Args:
        video_id: The ID of the video being processed.
        extractor_data: Result from extractor.py
        speech_data: Result from speech.py
        visual_data: Result from visual.py
        
    Returns:
        A JSON-serializable dictionary representing the stable ContentProfile.
    """
    
    # Safe extraction of metadata
    metadata = extractor_data.get("metadata", {})
    
    # Constructing the stable schema
    content_profile = {
        "video_id": video_id,
        "content_semantics": {
            "topics": speech_data.get("topics", []),
            "keywords": speech_data.get("keywords", []),
            "language": "en" # Hardcoded for MVP based on faster-whisper tiny.en
        },
        "visual": {
            "ocr_text": visual_data.get("ocr_text", []),
            "processed_frames": visual_data.get("visual_signals", {}).get("processed_frames", 0)
        },
        "audio": {
            "transcript": speech_data.get("transcript", "")
        },
        "structure": {
            "duration": metadata.get("duration", 0.0),
            "fps": metadata.get("fps", 0.0),
            "width": metadata.get("width", 0),
            "height": metadata.get("height", 0)
        },
        # Placeholders for Backend B to consume/populate
        "hook": {},
        "audience": {},
        "trend": {},
        "platform": {}
    }
    
    return content_profile
