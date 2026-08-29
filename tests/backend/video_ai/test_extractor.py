import os
import tempfile
import subprocess
import pytest
from backend.video_ai.video_processing.extractor import process_video

@pytest.fixture
def sample_video(tmp_path):
    """Generates a small test video using ffmpeg."""
    video_path = tmp_path / "test_video.mp4"
    # Create a 1-second video with a test pattern and sine wave audio
    cmd = [
        "ffmpeg", "-y", "-f", "lavfi", "-i", "testsrc=duration=1:size=640x360:rate=30",
        "-f", "lavfi", "-i", "sine=frequency=1000:duration=1",
        "-c:v", "libx264", "-c:a", "aac", "-b:a", "128k",
        str(video_path)
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    return str(video_path)

def test_process_video(sample_video, tmp_path):
    output_dir = str(tmp_path / "outputs")
    
    result = process_video(sample_video, output_dir, num_frames=3)
    
    # 1. Check Metadata
    metadata = result.get("metadata")
    assert metadata is not None
    assert metadata["width"] == 640
    assert metadata["height"] == 360
    assert metadata["fps"] == 30
    assert metadata["frame_count"] == 30
    assert metadata["duration"] == 1.0
    
    # 2. Check Audio
    audio_path = result.get("audio_path")
    assert audio_path is not None
    assert os.path.exists(audio_path)
    assert audio_path.endswith(".wav")
    
    # 3. Check Frames
    frame_paths = result.get("frame_paths")
    assert frame_paths is not None
    assert len(frame_paths) == 3
    for path in frame_paths:
        assert os.path.exists(path)
        assert path.endswith(".jpg")
