import os
import uuid
import json
import asyncio
from fastapi import APIRouter, UploadFile, File, HTTPException, status, BackgroundTasks

from backend.data.repositories import (
    UserRepository, 
    VideoRepository, 
    AnalysisJobRepository, 
    VideoAnalysisRepository, 
    PlatformPredictionRepository, 
    RecommendationRepository
)
from backend.trend_recommendation.prediction.engine import PredictionEngine
from backend.trend_recommendation.prediction.normalizer import FeatureNormalizer
from backend.trend_recommendation.trends.engine import TrendEngine
from backend.trend_recommendation.recommendation.engine import RecommendationEngine

user_repo = UserRepository()
video_repo = VideoRepository()
job_repo = AnalysisJobRepository()
analysis_repo = VideoAnalysisRepository()
prediction_repo = PlatformPredictionRepository()
recommendation_repo = RecommendationRepository()

trend_engine = TrendEngine()
recommendation_engine = RecommendationEngine()

from backend.video_ai.video_processing.extractor import process_video
from backend.video_ai.ai.speech import analyze_speech
from backend.video_ai.ai.visual import analyze_visuals
from backend.video_ai.ai.hook import analyze_hook
from backend.video_ai.profile_builder import generate_metadata_with_reka
import traceback
import tempfile


router = APIRouter()

ALLOWED_EXTENSIONS = {".mp4", ".mov", ".webm"}
MAX_FILE_SIZE = 100 * 1024 * 1024  # 100 MB
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

async def process_video_task(job_id: str):
    try:
        job = job_repo.get_job(job_id)
        if not job:
            return
            
        video_id = job["video_id"]
        video = video_repo.get_video(video_id)
        if not video:
            return
            
        video_path = os.path.join(UPLOAD_DIR, video["filename"])
        
        job_repo.update_job_progress(job_id, "VALIDATING", 15)
        if not os.path.exists(video_path):
            raise FileNotFoundError("Video file missing.")
            
        job_repo.update_job_progress(job_id, "PROCESSING_MEDIA", 30)
        # 1. Extraction
        with tempfile.TemporaryDirectory() as temp_dir:
            extraction = process_video(video_path, temp_dir, num_frames=5)
            audio_path = extraction.get("audio_path")
            frame_paths = extraction.get("frame_paths", [])
            
            job_repo.update_job_progress(job_id, "AI_ANALYSIS", 50)
            # 2. Speech Analysis
            speech_data = analyze_speech(audio_path)
            
            # 3. Visual Analysis
            visual_data = analyze_visuals(frame_paths)
            
            # 4. Hook Scoring
            hook_data = analyze_hook(video_path, audio_path, speech_data, visual_data)
            hook_score = hook_data.get("hook_strength_score", 50)
            pacing_score = hook_data.get("visual_hook", {}).get("pacing_score", 50)
            quality_score = int((hook_score + pacing_score) / 2) # Arbitrary heuristic for quality

            job_repo.update_job_progress(job_id, "TREND_ANALYSIS", 70)
            # 5. Profile Generation via Reka
            transcript = speech_data.get("transcript", "")
            ocr_text = visual_data.get("ocr_text", [])
            keywords = speech_data.get("keywords", [])
            
            def progress_callback(status_str: str, pct: int):
                job_repo.update_job_progress(job_id, status_str, pct)
                
            meta = generate_metadata_with_reka(transcript, ocr_text, keywords, progress_callback)
            
            job_repo.update_job_progress(job_id, "SCORING", 85)
            # 6. Save real analysis
            analysis_repo.create_analysis(
                video_id=video_id,
                topic=meta.get("topic", "Unknown"),
                subtopic=meta.get("subtopic", "Unknown"),
                category=meta.get("category", "General"),
                emotion=meta.get("emotion", "neutral"),
                audience=meta.get("audience", "general audience"),
                keywords=json.dumps(meta.get("keywords", [])),
                hook_score=hook_score,
                pacing_score=pacing_score,
                quality_score=quality_score
            )
            
        job_repo.update_job_progress(job_id, "COMPLETED", 100)
    except Exception as e:
        traceback.print_exc()
        job_repo.update_job_progress(job_id, "FAILED", 0)
        # Need to implement error storage or just leave as is for MVP


@router.post("/api/v1/videos", status_code=status.HTTP_202_ACCEPTED)
async def upload_video(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
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
        
        # 5. Kick off background processing task
        background_tasks.add_task(process_video_task, job_id)
    except Exception as e:
        # If DB fails, clean up the file
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(
            status_code=500, detail=f"Database error: {str(e)}"
        )

    return {"job_id": job_id, "video_id": video_id, "status": "accepted"}


@router.get("/api/v1/analysis/{job_id}")
def get_analysis_status(job_id: str):
    job = job_repo.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    return {
        "job_id": job["id"],
        "video_id": job["video_id"],
        "status": job["status"],
        "progress": job["progress"],
        "error": job["error"]
    }


@router.get("/api/v1/videos/{video_id}/report")
def get_video_report(video_id: str):
    """
    Returns the complete intelligence report for a video.
    Executes the trend, prediction, and recommendation engines Just-In-Time if not already cached.
    """
    # 1. Fetch Content Profile
    analysis = analysis_repo.get_analysis(video_id)
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found or still processing.")

    content_profile = dict(analysis)
    content_profile["keywords"] = json.loads(content_profile.get("keywords", "[]"))
    content_profile["pacing"] = "fast" if content_profile.get("pacing_score", 50) > 70 else "average"

    # 2. Run Trend Engine
    trend_signal = trend_engine.get_trends_for_topic(content_profile.get("topic", "Content"))

    # 3. Run Prediction Engine
    # Check if we already have predictions
    predictions = prediction_repo.get_predictions_for_video(video_id)
    best_time_cache = {}
    if not predictions:
        pred_results = PredictionEngine.score_platforms(video_id, content_profile, trend_signal)
        for p in pred_results:
            best_time_cache[p["platform"]] = p.get("best_time", "Anytime")
            prediction_repo.create_prediction(
                prediction_id=f"pred_{uuid.uuid4().hex[:12]}",
                video_id=video_id,
                platform=p["platform"],
                score=p["score"],
                confidence=p["confidence"],
                reasons=json.dumps(p["reasons"])
            )
        predictions = prediction_repo.get_predictions_for_video(video_id)

    parsed_predictions = []
    for p in predictions:
        pd = dict(p)
        pd["reasons"] = json.loads(pd.get("reasons", "[]"))
        # Restore best_time from cache if just generated, else recalculate
        if pd["platform"] in best_time_cache:
            pd["best_time"] = best_time_cache[pd["platform"]]
        else:
            _, bt, _ = FeatureNormalizer.calculate_timing_score(content_profile, trend_signal, pd["platform"])
            pd["best_time"] = bt
        parsed_predictions.append(pd)

    # Sort to find top prediction
    parsed_predictions.sort(key=lambda x: x["score"], reverse=True)
    top_prediction = parsed_predictions[0] if parsed_predictions else {}

    # 4. Run Recommendation Engine
    recommendation = recommendation_repo.get_recommendation(video_id, top_prediction.get("platform", "youtube_shorts"))
    if not recommendation:
        rec_data = recommendation_engine.generate_recommendations(content_profile, trend_signal, top_prediction)
        
        recommendation_repo.create_recommendation(
            recommendation_id=f"rec_{uuid.uuid4().hex[:12]}",
            video_id=video_id,
            platform=top_prediction.get("platform", "youtube_shorts"),
            best_time=top_prediction.get("best_time", "Anytime"),
            video_description=rec_data.get("video_description", ""),
            hashtags=json.dumps(rec_data.get("hashtags", [])),
            caption=json.dumps(rec_data.get("captions", [])),
            title=json.dumps(rec_data.get("title_variations", [])),
            keywords=json.dumps(content_profile.get("keywords", [])),
            optimization=json.dumps(rec_data.get("optimization_tips", []))
        )
        recommendation = recommendation_repo.get_recommendation(video_id, top_prediction.get("platform", "youtube_shorts"))

    parsed_recommendation = dict(recommendation)
    parsed_recommendation["hashtags"] = json.loads(parsed_recommendation.get("hashtags", "[]"))
    parsed_recommendation["caption"] = json.loads(parsed_recommendation.get("caption", "[]"))
    parsed_recommendation["title"] = json.loads(parsed_recommendation.get("title", "[]"))
    parsed_recommendation["keywords"] = json.loads(parsed_recommendation.get("keywords", "[]"))
    parsed_recommendation["optimization"] = json.loads(parsed_recommendation.get("optimization", "[]"))

    return {
        "video_id": video_id,
        "content_profile": content_profile,
        "trend_signal": trend_signal,
        "predictions": parsed_predictions,
        "recommendation": parsed_recommendation
    }
