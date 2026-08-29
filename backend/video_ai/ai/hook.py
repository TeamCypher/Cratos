import os
import wave
import logging
from typing import Dict, Any

try:
    import cv2
    import numpy as np
except ImportError:
    cv2 = None
    np = None

logger = logging.getLogger(__name__)

def calculate_audio_energy(audio_path: str, duration_sec: float = 3.0) -> float:
    """Calculates normalized RMS energy of the first few seconds of audio."""
    if not audio_path or not os.path.exists(audio_path) or np is None:
        return 0.0
        
    try:
        with wave.open(audio_path, 'rb') as wf:
            framerate = wf.getframerate()
            n_frames_to_read = int(framerate * duration_sec)
            
            raw_data = wf.readframes(n_frames_to_read)
            if not raw_data:
                return 0.0
                
            audio_array = np.frombuffer(raw_data, dtype=np.int16)
            
            if len(audio_array) == 0:
                return 0.0
                
            rms = np.sqrt(np.mean(np.square(audio_array.astype(np.float32))))
            
            # Normalize (10000 is a heuristic for max expected RMS in typical speech audio)
            normalized_energy = min(100.0, (rms / 10000.0) * 100.0)
            return normalized_energy
    except Exception as e:
        logger.warning(f"Error calculating audio energy: {e}")
        return 0.0

def calculate_visual_pacing(video_path: str, duration_sec: float = 3.0) -> float:
    """Calculates normalized frame difference over the first few seconds."""
    if not video_path or not os.path.exists(video_path) or cv2 is None or np is None:
        return 0.0
        
    try:
        cap = cv2.VideoCapture(video_path)
        fps = cap.get(cv2.CAP_PROP_FPS)
        if fps <= 0:
            fps = 30.0
            
        max_frames = int(fps * duration_sec)
        
        prev_frame = None
        total_diff = 0.0
        frame_count = 0
        
        while frame_count < max_frames:
            ret, frame = cap.read()
            if not ret:
                break
                
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            gray = cv2.resize(gray, (64, 64)) # Resize for speed and noise reduction
            
            if prev_frame is not None:
                diff = cv2.absdiff(gray, prev_frame)
                total_diff += np.mean(diff)
                
            prev_frame = gray
            frame_count += 1
            
        cap.release()
        
        if frame_count <= 1:
            return 0.0
            
        avg_diff = total_diff / (frame_count - 1)
        
        # Normalize (30.0 is a heuristic for highly dynamic scene avg difference)
        normalized_pacing = min(100.0, (avg_diff / 30.0) * 100.0)
        return normalized_pacing
    except Exception as e:
        logger.warning(f"Error calculating visual pacing: {e}")
        return 0.0

def analyze_hook(
    video_path: str,
    audio_path: str,
    speech_data: Dict[str, Any],
    visual_data: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Evaluates the video's opening hook across Audio, Visual, and Text dimensions.
    Returns a normalized Hook Strength Score (0-100).
    """
    
    # 1. Audio Hook
    first_speech = speech_data.get("first_speech_start")
    speech_timing_score = 0.0
    
    if first_speech is not None:
        if first_speech < 1.0:
            speech_timing_score = 100.0
        elif first_speech <= 3.0:
            speech_timing_score = 50.0
        else:
            speech_timing_score = 10.0
            
    audio_energy_score = calculate_audio_energy(audio_path)
    audio_hook_score = (speech_timing_score * 0.7) + (audio_energy_score * 0.3)
    
    # 2. Visual / Action Hook
    visual_pacing_score = calculate_visual_pacing(video_path)
    visual_hook_score = visual_pacing_score
    
    # 3. Text Hook
    has_early_text = visual_data.get("visual_signals", {}).get("has_early_text", False)
    text_hook_score = 100.0 if has_early_text else 0.0
    
    # Final Score (40% Visual, 40% Audio, 20% Text)
    final_score = (visual_hook_score * 0.40) + (audio_hook_score * 0.40) + (text_hook_score * 0.20)
    
    return {
        "hook_strength_score": round(final_score),
        "audio_hook": {
            "speech_timing_score": round(speech_timing_score),
            "energy_score": round(audio_energy_score),
            "combined_score": round(audio_hook_score)
        },
        "visual_hook": {
            "pacing_score": round(visual_pacing_score),
            "combined_score": round(visual_hook_score)
        },
        "text_hook": {
            "early_text_score": round(text_hook_score),
            "combined_score": round(text_hook_score)
        }
    }
