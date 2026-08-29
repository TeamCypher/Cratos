import os
import pytest
from unittest.mock import patch, MagicMock
from backend.video_ai.ai.visual import analyze_visuals

@patch("backend.video_ai.ai.visual.cv2")
@patch("backend.video_ai.ai.visual.pytesseract")
@patch("backend.video_ai.ai.visual.os.path.exists")
def test_analyze_visuals_success(mock_exists, mock_tesseract, mock_cv2):
    mock_exists.return_value = True
    
    # Mock OpenCV image read
    mock_image = MagicMock()
    mock_cv2.imread.return_value = mock_image
    mock_cv2.cvtColor.return_value = mock_image
    
    # Mock Tesseract outputs for two frames
    mock_tesseract.image_to_string.side_effect = [
        "Welcome to my channel!",
        "Subscribe for more"
    ]
    
    frame_paths = ["frame1.jpg", "frame2.jpg"]
    result = analyze_visuals(frame_paths)
    
    assert "ocr_text" in result
    assert "visual_signals" in result
    assert len(result["ocr_text"]) == 2
    assert "Welcome to my channel!" in result["ocr_text"]
    assert result["visual_signals"]["processed_frames"] == 2

@patch("backend.video_ai.ai.visual.os.path.exists")
def test_analyze_visuals_missing_file(mock_exists):
    mock_exists.return_value = False
    
    result = analyze_visuals(["missing.jpg"])
    
    assert result["ocr_text"] == []
    assert result["visual_signals"]["processed_frames"] == 0

@patch("backend.video_ai.ai.visual.cv2")
@patch("backend.video_ai.ai.visual.pytesseract")
@patch("backend.video_ai.ai.visual.os.path.exists")
def test_analyze_visuals_ocr_error(mock_exists, mock_tesseract, mock_cv2):
    mock_exists.return_value = True
    mock_cv2.imread.return_value = MagicMock()
    mock_cv2.cvtColor.return_value = MagicMock()
    
    # Simulate tesseract failing
    mock_tesseract.image_to_string.side_effect = Exception("Tesseract not found")
    
    result = analyze_visuals(["frame1.jpg"])
    
    assert result["ocr_text"] == []
    assert result["visual_signals"]["processed_frames"] == 0
