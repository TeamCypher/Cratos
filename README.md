# Cratos

Welcome to the Cratos repository. 

## Current Status
**Stage: Backend APIs, AI Pipeline, and Prediction Engine Complete**

The project has advanced significantly in the backend development:
- **Frontend (Teammate 1):** Initialized the Next.js/React framework with Tailwind CSS and established basic UI components.
- **Backend A (Teammate 2):** Initialized FastAPI, built the `POST /api/v1/videos` upload flow, and implemented the local video/AI pipeline (FFmpeg extraction, OpenCV, Whisper/OCR stubs).
- **Backend B (Teammate 3):** Completed the SQLite database setup, API contracts (`contracts/openapi.yaml`), **YouTube and Twitch API Trend Providers**, Trend Matching engine, and the **Prediction Engine** (platform scoring and feature normalization).

## Next Steps
- **Backend B (Teammate 3):** Implement the Recommendation Engine (generate hashtags, captions, and optimization tips) to complete the backend data flow.
- **Frontend (Teammate 1):** Build out the remaining dashboard views to consume the recommendation and prediction APIs.
- **Backend A & B:** E2E Integration Testing of the complete upload -> analysis -> trend -> recommendation pipeline.