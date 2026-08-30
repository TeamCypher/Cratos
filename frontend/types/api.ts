export interface ContentProfile {
  topic: string;
  subtopic?: string;
  category: string;
  keywords: string[];
  emotion?: string;
  audience?: string;
  hook_score: number;
  pacing: string;
  language?: string;
  quality_score?: number;
}

export interface TrendSignal {
  score: number;
  momentum: string;
  direction: string;
  source: string;
  platform: string;
}

export interface Prediction {
  platform: string;
  score: number;
  confidence: number;
  reasons: string[];
}

export interface Recommendation {
  platform: string;
  best_time: string;
  video_description: string;
  hashtags: string[];
  caption: string[];
  title: string[];
  keywords: string[];
  optimization: string[];
}

export interface AnalysisReport {
  video_id: string;
  content_profile: ContentProfile;
  trend_signal: TrendSignal;
  predictions: Prediction[];
  recommendation: Recommendation;
}

export interface TrendItem {
  id: string;
  topic: string;
  source: string;
  platform: string;
  trend_score: number;
  momentum: string;
  direction: string;
}

// Additional inferred types for the endpoints
export interface CreateAnalysisJobResponse {
  job_id: string;
  video_id: string;
  status: string;
}

export type AnalysisStatusString = 
  | "QUEUED" 
  | "VALIDATING" 
  | "PROCESSING_MEDIA" 
  | "AI_ANALYSIS" 
  | "TREND_ANALYSIS" 
  | "SCORING" 
  | "RECOMMENDING" 
  | "COMPLETED" 
  | "FAILED" 
  | "RETRY_REQUESTED";

export interface AnalysisStatusResponse {
  job_id: string;
  status: AnalysisStatusString;
  progress?: number;
  video_id?: string;
}
