import os

# Base directory for uploads
base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
UPLOAD_DIR = os.path.join(base_dir, "sample_data", "uploads")
ALLOWED_EXTENSIONS = {".mp4", ".mov", ".webm"}
MAX_FILE_SIZE = 100 * 1024 * 1024  # 100 MB limit for MVP

# Ensure the upload directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)
