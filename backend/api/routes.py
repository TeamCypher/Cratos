import os
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from backend.core.config import (
    UPLOAD_DIR,
    ALLOWED_EXTENSIONS,
    MAX_FILE_SIZE
)
from backend.data.repositories import (
    VideoRepository,
    AnalysisJobRepository,
    UserRepository
)

router = APIRouter()

video_repo = VideoRepository()
job_repo = AnalysisJobRepository()
user_repo = UserRepository()


@router.get("/api/v1/health")
def health_check():
    return {"status": "ok"}


@router.post("/api/v1/videos", status_code=status.HTTP_202_ACCEPTED)
async def upload_video(file: UploadFile = File(...)):
    # 1. Validate Extension
    filename_str = file.filename if file.filename else "unknown"
    ext = os.path.splitext(filename_str)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported: {ext}. Allowed: {ALLOWED_EXTENSIONS}"
        )

    # 2. Setup IDs and Paths
    video_id = f"vid_{uuid.uuid4().hex[:12]}"
    job_id = f"job_{uuid.uuid4().hex[:12]}"
    filename = f"{video_id}{ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    # 3. Save file and validate size
    try:
        size = 0
        with open(file_path, "wb") as buffer:
            while True:
                chunk = await file.read(1024 * 1024)  # 1MB chunks
                if not chunk:
                    break
                size += len(chunk)
                if size > MAX_FILE_SIZE:
                    os.remove(file_path)
                    raise HTTPException(
                        status_code=400, detail="File too large"
                    )
                buffer.write(chunk)
    except HTTPException:
        raise
    except Exception:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail="Could not save file")

    # 4. Save to Database (Mocking user for MVP)
    user_id = "creator_01"

    try:
        # Create user if it doesn't exist (mocking login for hackathon)
        if not user_repo.get_user(user_id):
            user_repo.create_user(
                user_id=user_id,
                name="Test Creator",
                email="creator@example.com"
            )

        video_repo.create_video(
            video_id=video_id,
            user_id=user_id,
            filename=filename,
            status="QUEUED"
        )
        job_repo.create_job(job_id=job_id, video_id=video_id, status="QUEUED")
    except Exception as e:
        # If DB fails, clean up the file
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(
            status_code=500, detail=f"Database error: {str(e)}"
        )

    return {"job_id": job_id, "video_id": video_id, "status": "accepted"}
