import os
import cv2
import subprocess
from typing import Dict, Any


def process_video(
    video_path: str, output_dir: str, num_frames: int = 5
) -> Dict[str, Any]:
    """
    Extracts metadata, audio, and representative frames from a video.

    Args:
        video_path: Path to the local video file.
        output_dir: Directory to save extracted audio and frames.
        num_frames: Number of representative frames to extract.

    Returns:
        A dictionary containing:
        - metadata: dict with duration, fps, width, height.
        - audio_path: str, path to the extracted wav file (or None if failed).
        - frame_paths: list of str, paths to the extracted frame images.
    """
    if not os.path.exists(video_path):
        raise FileNotFoundError(f"Video file not found: {video_path}")

    os.makedirs(output_dir, exist_ok=True)
    base_name = os.path.splitext(os.path.basename(video_path))[0]

    # 1. Metadata and Frame Extraction via OpenCV
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise ValueError(f"Could not open video: {video_path}")

    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    duration = 0
    if fps > 0:
        duration = frame_count / fps

    metadata = {
        "duration": duration,
        "fps": fps,
        "width": width,
        "height": height,
        "frame_count": frame_count
    }

    # Extract representative frames
    frame_paths = []
    if frame_count > 0 and num_frames > 0:
        # Calculate intervals to evenly space out the frames
        # E.g. for 5 frames, we might take at 0%, 25%, 50%, 75%, 99%
        intervals = [
            int(i * (frame_count - 1) / max(1, num_frames - 1))
            for i in range(num_frames)
        ]
        for idx, frame_idx in enumerate(intervals):
            cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
            ret, frame = cap.read()
            if ret:
                fname = f"{base_name}_frame_{idx}.jpg"
                f_path = os.path.join(output_dir, fname)
                cv2.imwrite(f_path, frame)
                frame_paths.append(f_path)

    cap.release()

    # 2. Audio Extraction via FFmpeg
    audio_path = os.path.join(output_dir, f"{base_name}_audio.wav")
    try:
        # Extract audio: mono, 16kHz, 16-bit PCM (good default for Whisper)
        cmd = [
            "ffmpeg", "-i", video_path,
            "-vn", "-acodec", "pcm_s16le", "-ar", "16000", "-ac", "1",
            "-y", audio_path
        ]
        subprocess.run(
            cmd,
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )

        # Verify if the file was actually created and is not empty
        if not os.path.exists(audio_path) or os.path.getsize(audio_path) == 0:
            audio_path = None
    except subprocess.CalledProcessError:
        audio_path = None

    return {
        "metadata": metadata,
        "audio_path": audio_path,
        "frame_paths": frame_paths
    }
