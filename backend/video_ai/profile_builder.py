import os
import json
import logging
from typing import Dict, Any
from dotenv import load_dotenv

logger = logging.getLogger(__name__)

load_dotenv()

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

import requests
from tenacity import retry, stop_after_attempt, wait_exponential
from openai import OpenAI

def generate_metadata_with_reka(transcript: str, ocr_text: list, keywords: list, frame_paths: list = None, progress_callback=None) -> Dict[str, Any]:
    """Uses OpenRouter API to infer high-level metadata if available. Includes exponential backoff retry and vision capabilities."""
    import time
    
    default_topic = keywords[0].capitalize() if keywords else "General Content"
    default_subtopic = keywords[1].capitalize() if len(keywords) > 1 else "Video"
    
    openrouter_api_key = os.getenv("OPENROUTER_API_KEY")
    if not openrouter_api_key or openrouter_api_key == "your_openrouter_api_key":
        logger.error("No valid OPENROUTER_API_KEY found.")
        raise ValueError("Missing OPENROUTER_API_KEY. System requires API to be connected; false data is not tolerated.")
        
    prompt = f"""
    Analyze this video content based on its transcript, text overlays (OCR), and the provided frames.
    Transcript: "{transcript[:2000]}"
    Keywords: {keywords}
    OCR Text: {ocr_text}
    
    Extract the following and return ONLY a valid JSON object matching this schema:
    {{
        "topic": "Main topic of the video (1-3 words) - Be precise and descriptive, DO NOT use 'Unknown'. If it's a game, name the game.",
        "subtopic": "Specific subtopic (1-3 words)",
        "category": "Must be exactly one of: Film & Animation, Autos & Vehicles, Music, Pets & Animals, Sports, Travel & Events, Gaming, People & Blogs, Comedy, Entertainment, News & Politics, Howto & Style, Education, Science & Technology, Nonprofits & Activism",
        "emotion": "Must be exactly one of: Surprise, Excitement, Humor, Anger, Awe, Neutral, Calm, Sadness",
        "audience": "Target audience description (e.g. tech enthusiasts, young gamers)"
    }}
    """
    
    content = [{"type": "text", "text": prompt}]
    
    # Only upload frames if transcript and OCR text are empty or meaningless (very short)
    combined_text_len = len(transcript.strip()) + sum(len(text.strip()) for text in ocr_text)
    
    if frame_paths and combined_text_len < 20:
        for path in frame_paths[:3]:  # Limit to 3 frames to avoid huge payloads
            if os.path.exists(path):
                try:
                    with open(path, "rb") as image_file:
                        encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
                        content.append({
                            "type": "image_url",
                            "image_url": {"url": f"data:image/jpeg;base64,{encoded_string}"}
                        })
                except Exception as e:
                    logger.warning(f"Failed to encode image {path} for OpenRouter: {e}")

    @retry(stop=stop_after_attempt(5), wait=wait_exponential(multiplier=2, min=2, max=32), reraise=True)
    def _do_call():
        if progress_callback:
            progress_callback("CONNECTING_TO_AI", 50)
        client = OpenAI(base_url="https://openrouter.ai/api/v1", api_key=openrouter_api_key)
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": content}],
            model="nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free"
        )
        return response.choices[0].message.content.strip()

    try:
        result_text = _do_call()
        
        # Parse the JSON string
        if result_text.startswith("```json"):
            result_text = result_text.split("```json")[1].split("```")[0].strip()
        elif result_text.startswith("```"):
            result_text = result_text.split("```")[1].strip()
            
        result = json.loads(result_text)
        
        # Merge with keywords
        result["keywords"] = keywords[:5] if keywords else []
        
        # Ensure 'topic' is never 'Unknown'
        if result.get("topic", "Unknown").lower() == "unknown":
            result["topic"] = default_topic
            
        return result
        
    except Exception as e:
        logger.error(f"OpenRouter metadata extraction failed after retries: {e}")
        raise ValueError(f"AI Extraction Failed. False data is not tolerated. Error: {e}")
