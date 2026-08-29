import os
import logging
from typing import Dict, Any, List

try:
    import cv2
    import pytesseract
except ImportError:
    cv2 = None
    pytesseract = None

logger = logging.getLogger(__name__)

def analyze_visuals(frame_paths: List[str]) -> Dict[str, Any]:
    """
    Extracts visible text (OCR) and minimal visual signals from representative frames.
    
    Args:
        frame_paths: List of local paths to frame images.
        
    Returns:
        dict: A dictionary containing 'ocr_text' (list of strings) and 'visual_signals' (dict).
    """
    result = {
        "ocr_text": [],
        "visual_signals": {
            "processed_frames": 0
        }
    }
    
    if not frame_paths:
        return result
        
    if cv2 is None or pytesseract is None:
        logger.error("Missing dependencies for visual analysis (cv2 or pytesseract).")
        return result
        
    unique_texts = set()
    processed_count = 0
    
    for frame_path in frame_paths:
        if not os.path.exists(frame_path):
            logger.warning(f"Frame not found: {frame_path}")
            continue
            
        try:
            # Read image using OpenCV
            image = cv2.imread(frame_path)
            if image is None:
                continue
                
            # Convert to RGB (pytesseract expects RGB)
            rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            
            # Run OCR
            text = pytesseract.image_to_string(rgb_image).strip()
            if text:
                unique_texts.add(text)
                
            processed_count += 1
            
        except Exception as e:
            logger.warning(f"Failed to process frame {frame_path}: {e}")
            continue
            
    result["ocr_text"] = list(unique_texts)
    result["visual_signals"]["processed_frames"] = processed_count
    
    return result
