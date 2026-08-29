import os
import sys
import json
from fastapi.testclient import TestClient

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')))

from backend.api.routes import router
from fastapi import FastAPI
from unittest.mock import patch

app = FastAPI()
app.include_router(router)
client = TestClient(app)

@patch('backend.api.routes.recommendation_engine.generate_recommendations')
def test_get_video_report_includes_video_description(mock_generate_recommendations):
    """
    Test that the GET /api/v1/videos/{video_id}/report endpoint successfully
    extracts the video_description from the recommendation engine, saves it 
    to the DB, and parses it back in the final API response.
    """
    # Mock the Reka engine response
    mock_generate_recommendations.return_value = {
        "video_description": "A very unique SEO description.",
        "hashtags": ["#test1", "#test2"],
        "captions": ["Caption 1"],
        "title_variations": ["Title 1"],
        "optimization_tips": ["Tip 1"]
    }
    
    # Send a request to the report endpoint for a new video
    response = client.get("/api/v1/videos/test_vid_api_1/report")
    
    assert response.status_code == 200
    json_data = response.json()
    
    # Assert the response has the recommendation block
    assert "recommendation" in json_data
    
    # Assert that video_description made it through the DB and out to the frontend
    assert "video_description" in json_data["recommendation"]
    assert json_data["recommendation"]["video_description"] == "A very unique SEO description."
    
    # Assert other items are also there
    assert "#test1" in json_data["recommendation"]["hashtags"]
    assert "Tip 1" in json_data["recommendation"]["optimization"]
