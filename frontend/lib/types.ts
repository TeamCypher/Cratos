export interface AnalysisResult {
  overallScore: number;
  overallInsight: string;
  trendMatch: number;
  hookStrength: number;
  audienceFit: number;
  contentQuality: number;
  bestPlatform: { name: string; score: number; fit: string; };
  otherPlatforms: { name: string; score: number; fit: string; }[];
  trendStatus: "rising" | "stable" | "falling";
  trendInsight: string;
  hookStatus: "success" | "warning" | "error" | "neutral";
  hookLabel: string;
  hookInsight: string;
  bestMove: { insight: string; platform: string; time: string; trend: "rising" | "stable" | "falling"; };
  recommendations: { id: number; title: string; explanation: string; priority?: boolean }[];
  contentSummary: { topic: string; tone: string; format: string; audience: string; };
  videoDescription?: string;
  hashtags?: string[];
  captions?: string[];
  titleVariations?: string[];
}

export interface TrendOpportunity {
  id: string;
  title: string;
  explanation: string;
  relevance: number;
}

export interface Trend {
  id: string;
  name: string;
  score: number;
  momentum: "High" | "Medium" | "Low";
  direction: "rising" | "stable" | "falling";
  category: "Technology" | "Entertainment" | "Education" | "Lifestyle" | "Business";
  description: string;
  whyItMatters: string;
  relevanceMatch: number;
  opportunityScore: "HIGH" | "MEDIUM" | "LOW";
  platformRelevance: {
    youtubeShorts: number;
    instagramReels: number;
    tiktok: number;
  };
  opportunities: TrendOpportunity[];
  nextMove: {
    insight: string;
    platform: string;
  };
  relatedTrendIds: string[];
  platform?: string;
}

export interface VibeCheckSummary {
  risingTrends: number;
  highMomentum: number;
  contentOpportunities: number;
  fastGrowing: number;
}

export interface AnalysisHistoryItem {
  id: string;
  title: string;
  thumbnail: string;
  date: string;
  duration: string;
  score: number;
  bestPlatform: string;
  trendStatus: "rising" | "stable" | "falling";
  category: "Technology" | "Entertainment" | "Education" | "Lifestyle" | "Business";
}

export interface HistorySummary {
  totalAnalyses: number;
  averageScore: number;
  risingOpportunities: number;
  topPlatform: string;
}