import os
import uuid
import json
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from backend.core.config import (
    UPLOAD_DIR,
    ALLOWED_EXTENSIONS,
    MAX_FILE_SIZE
)
from backend.data.repositories import (
    VideoRepository,
    AnalysisJobRepository,
    UserRepository,
    VideoAnalysisRepository,
    PlatformPredictionRepository,
    RecommendationRepository
)
from backend.trend_recommendation.trends.engine import TrendEngine
from backend.trend_recommendation.prediction.engine import PredictionEngine
from backend.trend_recommendation.recommendation.engine import RecommendationEngine

router = APIRouter()

video_repo = VideoRepository()
job_repo = AnalysisJobRepository()
user_repo = UserRepository()
analysis_repo = VideoAnalysisRepository()
prediction_repo = PlatformPredictionRepository()
recommendation_repo = RecommendationRepository()

trend_engine = TrendEngine()
recommendation_engine = RecommendationEngine()

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
        # For Hackathon MVP: If video hasn't been processed by the background AI yet, mock a profile.
        # This allows the frontend to demonstrate the pipeline immediately.
        mock_profile = {
            "topic": "Minecraft",
            "subtopic": "Rare Glitch",
            "category": "Gaming",
            "keywords": '["Minecraft", "glitch", "speedrun"]',
            "emotion": "excitement",
            "audience": "gaming enthusiasts",
            "hook_score": 85,
            "pacing_score": 90,
            "quality_score": 88
        }
        try:
            analysis_repo.create_analysis(
                video_id=video_id,
                topic=mock_profile["topic"],
                subtopic=mock_profile["subtopic"],
                category=mock_profile["category"],
                emotion=mock_profile["emotion"],
                audience=mock_profile["audience"],
                keywords=mock_profile["keywords"],
                hook_score=mock_profile["hook_score"],
                pacing_score=mock_profile["pacing_score"],
                quality_score=mock_profile["quality_score"]
            )
            analysis = analysis_repo.get_analysis(video_id)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to create mock analysis: {str(e)}")

    content_profile = dict(analysis)
    content_profile["keywords"] = json.loads(content_profile.get("keywords", "[]"))
    content_profile["pacing"] = "fast" if content_profile.get("pacing_score", 50) > 70 else "average"

    # 2. Run Trend Engine
    trend_signal = trend_engine.get_trends_for_topic(content_profile.get("topic", "Content"))

    # 3. Run Prediction Engine
    # Check if we already have predictions
    predictions = prediction_repo.get_predictions_for_video(video_id)
    if not predictions:
        pred_results = PredictionEngine.score_platforms(video_id, content_profile, trend_signal)
        for p in pred_results:
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
    
    # We add video_description that Reka returned if we just generated it, otherwise we might not have it in the db schema.
    # Hackathon workaround: add it to optimization or return directly from live generation if it's new.
    # To keep it simple, we'll return the parsed fields.

    return {
        "video_id": video_id,
        "content_profile": content_profile,
        "trend_signal": trend_signal,
        "predictions": parsed_predictions,
        "recommendation": parsed_recommendation
    }
