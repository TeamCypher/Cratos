-- c:\Ashwin\Cratos\backend\data\schema.sql

-- Represents creators using the system
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Stores metadata about the uploaded video files
CREATE TABLE IF NOT EXISTS videos (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    filename TEXT NOT NULL,
    duration INTEGER,
    resolution TEXT,
    language TEXT,
    status TEXT NOT NULL, -- QUEUED, VALIDATING, PROCESSING, FAILED, COMPLETED
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Tracks the long-running analysis pipeline
CREATE TABLE IF NOT EXISTS analysis_jobs (
    id TEXT PRIMARY KEY,
    video_id TEXT NOT NULL,
    status TEXT NOT NULL, -- QUEUED, PROCESSING_MEDIA, AI_ANALYSIS, TREND_ANALYSIS, SCORING, RECOMMENDING, COMPLETED, FAILED
    progress INTEGER DEFAULT 0,
    error TEXT,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    FOREIGN KEY(video_id) REFERENCES videos(id)
);

-- Stores the resulting ContentProfile from the AI/Video pipeline
CREATE TABLE IF NOT EXISTS video_analysis (
    video_id TEXT PRIMARY KEY,
    topic TEXT,
    subtopic TEXT,
    category TEXT,
    emotion TEXT,
    audience TEXT,
    keywords TEXT, -- Store as JSON array string
    hook_score INTEGER,
    pacing_score INTEGER,
    quality_score INTEGER,
    FOREIGN KEY(video_id) REFERENCES videos(id)
);

-- Stores the actionable publication strategy generated for each platform
CREATE TABLE IF NOT EXISTS recommendations (
    id TEXT PRIMARY KEY,
    video_id TEXT NOT NULL,
    platform TEXT NOT NULL, -- e.g., 'youtube_shorts', 'instagram_reels'
    best_time TEXT,
    video_description TEXT,
    hashtags TEXT, -- Store as JSON array string
    caption TEXT,
    title TEXT,
    keywords TEXT, -- Store as JSON array string
    optimization TEXT, -- Store as JSON array string of suggestions
    FOREIGN KEY(video_id) REFERENCES videos(id)
);

-- Stores trend observations/cache
CREATE TABLE IF NOT EXISTS trend_signals (
    id TEXT PRIMARY KEY,
    topic TEXT NOT NULL,
    source TEXT NOT NULL,
    platform TEXT,
    trend_score INTEGER,
    momentum TEXT,
    direction TEXT,
    embedding TEXT, -- JSON array of floats for semantic similarity
    captured_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Stores per-platform suitability predictions
CREATE TABLE IF NOT EXISTS platform_predictions (
    id TEXT PRIMARY KEY,
    video_id TEXT NOT NULL,
    platform TEXT NOT NULL,
    score INTEGER,
    confidence REAL,
    reasons TEXT, -- Store as JSON array string
    FOREIGN KEY(video_id) REFERENCES videos(id)
);

-- Stores predicted retention scores across time windows
CREATE TABLE IF NOT EXISTS retention_curves (
    id TEXT PRIMARY KEY,
    video_id TEXT NOT NULL,
    timestamp_sec INTEGER NOT NULL,
    retention_score REAL NOT NULL,
    FOREIGN KEY(video_id) REFERENCES videos(id)
);

-- Stores competitor gap analysis
CREATE TABLE IF NOT EXISTS competitor_analysis (
    id TEXT PRIMARY KEY,
    video_id TEXT NOT NULL,
    channel_id TEXT NOT NULL,
    overlap_score INTEGER,
    gap_topics TEXT, -- Store as JSON array string
    timing_gaps TEXT, -- Store as JSON array string
    analyzed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(video_id) REFERENCES videos(id)
);
