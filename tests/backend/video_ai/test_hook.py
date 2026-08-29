import pytest
from unittest.mock import patch, MagicMock
from backend.video_ai.ai.hook import analyze_hook

@patch('backend.video_ai.ai.hook.calculate_audio_energy')
@patch('backend.video_ai.ai.hook.calculate_visual_pacing')
def test_analyze_hook_strong(mock_pacing, mock_energy):
    # Setup mocks for a strong hook
    mock_energy.return_value = 80.0
    mock_pacing.return_value = 90.0
    
    speech_data = {"first_speech_start": 0.5} # Immediate speech -> 100
    visual_data = {"visual_signals": {"has_early_text": True}} # Text -> 100
    
    result = analyze_hook("dummy.mp4", "dummy.wav", speech_data, visual_data)
    
    # Audio hook: 100 * 0.7 + 80 * 0.3 = 70 + 24 = 94
    # Visual hook: 90
    # Text hook: 100
    # Final: (90 * 0.4) + (94 * 0.4) + (100 * 0.2) = 36 + 37.6 + 20 = 93.6 -> 94
    
    assert result["audio_hook"]["speech_timing_score"] == 100
    assert result["audio_hook"]["energy_score"] == 80
    assert result["audio_hook"]["combined_score"] == 94
    assert result["visual_hook"]["combined_score"] == 90
    assert result["text_hook"]["combined_score"] == 100
    assert result["hook_strength_score"] == 94

@patch('backend.video_ai.ai.hook.calculate_audio_energy')
@patch('backend.video_ai.ai.hook.calculate_visual_pacing')
def test_analyze_hook_weak(mock_pacing, mock_energy):
    mock_energy.return_value = 10.0
    mock_pacing.return_value = 10.0
    
    speech_data = {"first_speech_start": 5.0} # Late speech -> 10
    visual_data = {"visual_signals": {"has_early_text": False}} # No text -> 0
    
    result = analyze_hook("dummy.mp4", "dummy.wav", speech_data, visual_data)
    
    # Audio hook: 10 * 0.7 + 10 * 0.3 = 10
    # Visual hook: 10
    # Text hook: 0
    # Final: (10 * 0.4) + (10 * 0.4) + (0 * 0.2) = 4 + 4 + 0 = 8
    
    assert result["hook_strength_score"] == 8

@patch('backend.video_ai.ai.hook.calculate_audio_energy')
@patch('backend.video_ai.ai.hook.calculate_visual_pacing')
def test_analyze_hook_missing_data(mock_pacing, mock_energy):
    # Test safe handling when data is completely missing
    mock_energy.return_value = 0.0
    mock_pacing.return_value = 0.0
    
    result = analyze_hook("", "", {}, {})
    
    assert result["hook_strength_score"] == 0
    assert result["audio_hook"]["speech_timing_score"] == 0
    assert result["audio_hook"]["energy_score"] == 0
    assert result["visual_hook"]["pacing_score"] == 0
    assert result["text_hook"]["early_text_score"] == 0
