# Cratos 🚀
**Cross-Platform Content Intelligence for Creators**

Cratos is an advanced, AI-powered backend system designed to analyze raw video content and provide data-driven publishing strategies. By aggregating real-time momentum from major platforms and leveraging generative AI, Cratos determines the optimal platform for your video and automatically generates viral metadata to maximize your reach.

---

## ✨ Key Features
- **Intelligent Video Analysis:** Processes raw video uploads to extract topics, pacing, and emotional resonance using a localized AI pipeline (FFmpeg, OpenCV, Whisper).
- **Multi-Platform Trend Aggregation:** Simultaneously queries the **YouTube API**, **Twitch API**, and **Google Trends** to build a comprehensive view of current market momentum.
- **Predictive Platform Scoring:** A custom prediction engine evaluates your video's structural DNA against the aggregated market trends to determine whether it will perform better on **YouTube (VOD)** or **Twitch (Livestream)**.
- **AI Recommendation Engine:** Generates highly optimized titles, captions, hashtags, and strategic posting times utilizing **Reka AI** (with a built-in heuristic safety fallback for rate-limit protection).
- **Zero-Setup Database:** Utilizes a serverless SQLite data layer to ensure instant onboarding and zero Docker overhead during development.

---

## 🏗 System Architecture

The Cratos backend is built with **FastAPI** and is divided into three core intelligence engines:
1. **Trend Engine:** Normalizes and aggregates multi-source search momentum.
2. **Prediction Engine:** Calculates normalized confidence scores for cross-platform suitability.
3. **Recommendation Engine:** Synthesizes the analysis and prediction data into a highly structured JSON strategy payload via Generative AI.

---

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- FFmpeg (Must be installed on your system path)
- YouTube API Key
- Twitch API Credentials
- Reka AI API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/cratos.git
   cd cratos
   ```

2. **Set up your environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Initialize the Database:**
   ```bash
   python -c "from backend.data.database import init_db; init_db()"
   ```

5. **Run the server:**
   ```bash
   uvicorn backend.main:app --reload
   ```

---

## 📖 API Documentation

Once the server is running, you can view the complete Swagger UI documentation for our endpoints at:
- **`http://localhost:8000/docs`**

You can also view our strict Open API contracts at `contracts/openapi.yaml`.

---

## 🛠 Current Development Status

- ✅ **Backend Intelligence Pipeline:** Fully completed and integrated.
- ✅ **Trend & Prediction Engines:** Live.
- 🚧 **Frontend Dashboard:** Currently under active development (Next.js / Tailwind).
- 🚧 **E2E Testing:** Pending final dashboard integration.