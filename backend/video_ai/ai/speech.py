import os
import re
from typing import Dict, Any, List
from collections import Counter
import logging

try:
    from faster_whisper import WhisperModel
except ImportError:
    WhisperModel = None

logger = logging.getLogger(__name__)

# Global singleton to hold the loaded model
_whisper_model = None

# A basic set of english stopwords for our MVP keyword extractor
STOPWORDS = {
    "i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", 
    "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers", 
    "herself", "it", "its", "itself", "they", "them", "their", "theirs", "themselves", 
    "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are", 
    "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", 
    "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", 
    "while", "of", "at", "by", "for", "with", "about", "against", "between", "into", 
    "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", 
    "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", 
    "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", 
    "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", 
    "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now",
    "yeah", "like", "so", "just", "well", "know", "right"
}

def get_whisper_model():
    """Lazy loads the Whisper model to avoid downloading/loading on import."""
    global _whisper_model
    if _whisper_model is None:
        if WhisperModel is None:
            raise ImportError("faster-whisper is not installed.")
        # Use tiny.en for fast local hackathon MVP execution
        logger.info("Loading Whisper model (tiny.en)...")
        _whisper_model = WhisperModel("tiny.en", device="cpu", compute_type="int8")
    return _whisper_model

def extract_keywords(text: str, top_n: int = 5) -> List[str]:
    """Basic frequency-based keyword extraction ignoring common stopwords."""
    if not text:
        return []
    
    # Tokenize words, convert to lowercase
    words = re.findall(r'\b[a-z]{3,}\b', text.lower())
    # Filter stopwords
    filtered_words = [w for w in words if w not in STOPWORDS]
    
    if not filtered_words:
        return []
        
    # Get most common
    counter = Counter(filtered_words)
    return [word for word, count in counter.most_common(top_n)]

def analyze_speech(audio_path: str) -> Dict[str, Any]:
    """
    Analyzes an audio file using faster-whisper.
    
    Args:
        audio_path: The local path to the WAV file.
        
    Returns:
        dict: A dictionary containing 'transcript', 'keywords', and 'topics'.
    """
    result = {
        "transcript": "",
        "keywords": [],
        "topics": []
    }
    
    if not audio_path or not os.path.exists(audio_path):
        logger.warning(f"Audio file not found or invalid path: {audio_path}")
        return result
        
    try:
        model = get_whisper_model()
        segments, info = model.transcribe(audio_path, beam_size=1)
        
        transcript_parts = []
        for segment in segments:
            transcript_parts.append(segment.text.strip())
            
        full_transcript = " ".join(transcript_parts)
        result["transcript"] = full_transcript
        
        # We simulate "topics" being the top 2 keywords, and "keywords" being the top 5
        keywords = extract_keywords(full_transcript, top_n=5)
        topics = keywords[:2] if len(keywords) > 0 else []
        
        result["keywords"] = keywords
        result["topics"] = topics
        
    except Exception as e:
        logger.error(f"Error during speech transcription: {e}")
        # Return empty structure gracefully so the app doesn't crash
        pass
        
    return result
