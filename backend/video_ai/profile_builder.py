from typing import Dict, Any
import os
import json
import logging
from dotenv import load_dotenv
import google.generativeai as genai

logger = logging.getLogger(__name__)

# Configure Gemini
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

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

def generate_metadata_with_gemini(transcript: str, ocr_text: list, keywords: list) -> Dict[str, Any]:
    """Uses Gemini API to infer high-level metadata if available."""
    default_topic = keywords[0].capitalize() if keywords else "General Content"
    default_subtopic = keywords[1].capitalize() if len(keywords) > 1 else "Video"
    
    default_meta = {
        "topic": default_topic,
        "subtopic": default_subtopic,
        "category": "General",
        "emotion": "neutral",
        "audience": "general audience",
        "keywords": keywords[:5] if keywords else ["video", "content"]
    }
    
    if not os.getenv("GEMINI_API_KEY"):
        logger.warning("No GEMINI_API_KEY found, using default metadata extraction.")
        return default_meta
        
    try:
        model = genai.GenerativeModel('gemini-3.5-flash')
        prompt = f"""
        Analyze this video content based on its transcript and text overlays (OCR).
        Transcript: "{transcript[:2000]}"
        Keywords: {keywords}
        OCR Text: {ocr_text}
        
        Extract the following and return ONLY a valid JSON object matching this schema:
        {{
            "topic": "Main topic of the video (1-3 words) - Be precise and descriptive, DO NOT use 'Unknown'",
            "subtopic": "Specific subtopic (1-3 words)",
            "category": "Must be exactly one of: Film & Animation, Autos & Vehicles, Music, Pets & Animals, Sports, Travel & Events, Gaming, People & Blogs, Comedy, Entertainment, News & Politics, Howto & Style, Education, Science & Technology, Nonprofits & Activism",
            "emotion": "Must be exactly one of: Surprise, Excitement, Humor, Anger, Awe, Neutral, Calm, Sadness",
            "audience": "Target audience description (e.g. tech enthusiasts, young gamers)"
        }}
        """
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                response_mime_type="application/json",
            )
        )
        # Parse the JSON string
        result_text = response.text.strip()
            
        result = json.loads(result_text)
        
        # Merge with keywords
        result["keywords"] = keywords[:5] if keywords else []
        
        # Ensure 'topic' is never 'Unknown'
        if result.get("topic", "Unknown").lower() == "unknown":
            result["topic"] = default_topic
            
        return result
        
    except Exception as e:
        logger.error(f"Gemini metadata extraction failed: {e}")
        return default_meta
