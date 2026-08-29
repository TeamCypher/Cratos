import os
import pytest
from unittest.mock import patch, MagicMock
from backend.video_ai.ai.speech import analyze_speech, extract_keywords

def test_extract_keywords():
    text = "Hello there! This is a test. We are doing a test of the keyword system because keyword system is good."
    keywords = extract_keywords(text, top_n=3)
    assert "keyword" in keywords
    assert "system" in keywords
    assert "test" in keywords

@patch("backend.video_ai.ai.speech.get_whisper_model")
def test_analyze_speech_valid(mock_get_model, tmp_path):
    # Setup mock
    mock_model = MagicMock()
    mock_segment = MagicMock()
    mock_segment.text = " This is a mock transcript testing the system."
    mock_model.transcribe.return_value = ([mock_segment], None)
    mock_get_model.return_value = mock_model
    
    # Create fake audio file
    fake_audio = tmp_path / "fake.wav"
    fake_audio.write_text("fake audio content")
    
    result = analyze_speech(str(fake_audio))
    
    assert result["transcript"] == "This is a mock transcript testing the system."
    assert "mock" in result["keywords"]
    assert "transcript" in result["keywords"]
    assert "testing" in result["keywords"]
    assert "system" in result["keywords"]

@patch("backend.video_ai.ai.speech.get_whisper_model")
def test_analyze_speech_missing_file(mock_get_model):
    # Model should not even be loaded if file is missing
    result = analyze_speech("nonexistent_path.wav")
    assert result["transcript"] == ""
    assert result["keywords"] == []
    assert result["topics"] == []
    mock_get_model.assert_not_called()

@patch("backend.video_ai.ai.speech.get_whisper_model")
def test_analyze_speech_error_handling(mock_get_model, tmp_path):
    mock_get_model.side_effect = Exception("Model failed to load or run")
    
    fake_audio = tmp_path / "fake2.wav"
    fake_audio.write_text("fake audio content")
    
    result = analyze_speech(str(fake_audio))
    
    assert result["transcript"] == ""
    assert result["keywords"] == []
    assert result["topics"] == []
