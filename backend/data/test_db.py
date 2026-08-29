import sys
import os

# Add the root project directory to the sys.path so we can import from backend.data
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from backend.data.database import init_db
from backend.data.repositories import UserRepository, VideoRepository, AnalysisJobRepository
import uuid

def run_tests():
    print("Initializing Database...")
    init_db()
    print("DB Init Successful.")
    
    user_repo = UserRepository()
    video_repo = VideoRepository()
    job_repo = AnalysisJobRepository()
    
    user_id = str(uuid.uuid4())
    video_id = str(uuid.uuid4())
    job_id = str(uuid.uuid4())
    
    print("Testing UserRepository...")
    user_repo.create_user(user_id, "Test User", "test@example.com")
    user = user_repo.get_user(user_id)
    assert user is not None and user['name'] == "Test User"
    
    print("Testing VideoRepository...")
    video_repo.create_video(video_id, user_id, "test_video.mp4")
    video = video_repo.get_video(video_id)
    assert video is not None and video['status'] == "QUEUED"
    video_repo.update_video_status(video_id, "PROCESSING")
    
    print("Testing AnalysisJobRepository...")
    job_repo.create_job(job_id, video_id)
    job = job_repo.get_job(job_id)
    assert job is not None and job['status'] == "QUEUED"
    
    job_repo.update_job_progress(job_id, "PROCESSING_MEDIA", 10)
    job = job_repo.get_job(job_id)
    assert job['progress'] == 10
    assert job['completed_at'] is None
    
    job_repo.update_job_progress(job_id, "COMPLETED", 100)
    job = job_repo.get_job(job_id)
    assert job['completed_at'] is not None
    
    print("All tests passed successfully!")

if __name__ == "__main__":
    run_tests()
