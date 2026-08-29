import pytest
from backend.video_ai.profile_builder import build_content_profile

def test_build_content_profile_full():
    extractor_data = {
        "metadata": {
            "duration": 10.5,
            "fps": 30.0,
            "width": 1920,
            "height": 1080
        }
    }
    
    speech_data = {
        "transcript": "Hello world",
        "keywords": ["hello", "world"],
        "topics": ["hello"]
    }
    
    visual_data = {
        "ocr_text": ["TEXT ON SCREEN"],
        "visual_signals": {
            "processed_frames": 5
        }
    }
    
    profile = build_content_profile("vid_123", extractor_data, speech_data, visual_data)
    
    assert profile["video_id"] == "vid_123"
    assert profile["content_semantics"]["keywords"] == ["hello", "world"]
    assert profile["visual"]["ocr_text"] == ["TEXT ON SCREEN"]
    assert profile["structure"]["duration"] == 10.5
    assert profile["trend"] == {}
    assert profile["platform"] == {}
    assert profile["audience"] == {}
    assert profile["hook"] == {}

def test_build_content_profile_missing_data():
    profile = build_content_profile("vid_456", {}, {}, {})
    
    assert profile["video_id"] == "vid_456"
    assert profile["content_semantics"]["keywords"] == []
    assert profile["visual"]["ocr_text"] == []
    assert profile["audio"]["transcript"] == ""
    assert profile["structure"]["duration"] == 0.0
    assert profile["trend"] == {}
