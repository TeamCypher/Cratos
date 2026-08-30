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

export const mockAnalysisResult: AnalysisResult = {
  overallScore: 91,
  overallInsight: "Strong potential with room to improve discoverability.",
  trendMatch: 92,
  hookStrength: 87,
  audienceFit: 89,
  contentQuality: 94,
  bestPlatform: {
    name: "YouTube Shorts",
    score: 94,
    fit: "Best fit"
  },
  otherPlatforms: [
    { name: "Instagram Reels", score: 89, fit: "Strong fit" },
    { name: "TikTok", score: 84, fit: "Good fit" }
  ],
  trendStatus: "rising",
  trendInsight: "Your content aligns strongly with rising trends in your niche.",
  hookStatus: "success",
  hookLabel: "Strong",
  hookInsight: "Your opening creates curiosity quickly, but the payoff could arrive earlier.",
  bestMove: {
    insight: "Lead with the strongest visual in the first 2 seconds and publish while this topic is gaining momentum.",
    platform: "YouTube Shorts",
    time: "7:00 PM",
    trend: "rising"
  },
  recommendations: [
    { id: 1, title: "Strengthen the opening hook", explanation: "Add a text overlay in the first 3 seconds to clearly establish the value proposition.", priority: true },
    { id: 2, title: "Move the payoff earlier", explanation: "Your audience retention might drop. Reveal the main takeaway around the 15-second mark." },
    { id: 3, title: "Capitalize on trend momentum", explanation: "Use trending audio related to your topic to boost algorithmic distribution.", priority: true },
    { id: 4, title: "Use a clearer visual transition", explanation: "The cut between scenes 2 and 3 is slightly jarring. Smooth it out for better pacing." }
  ],
  contentSummary: {
    topic: "Technology",
    tone: "Educational",
    format: "Explainer",
    audience: "18–24"
  }
};

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

export const mockVibeCheckSummary: VibeCheckSummary = {
  risingTrends: 24,
  highMomentum: 12,
  contentOpportunities: 8,
  fastGrowing: 5,
}

export const mockTrends: Trend[] = [
  {
    id: "t1",
    name: "AI Tools",
    score: 94,
    momentum: "High",
    direction: "rising",
    category: "Technology",
    description: "Rapidly increasing interest around practical AI tools.",
    whyItMatters: "This topic is showing strong momentum and may offer an opportunity for creators producing technology-focused content.",
    relevanceMatch: 92,
    opportunityScore: "HIGH",
    platformRelevance: {
      youtubeShorts: 91,
      instagramReels: 87,
      tiktok: 76
    },
    opportunities: [
      { id: "o1", title: "AI Tools Comparison", explanation: "Create a short-form comparison of emerging AI tools.", relevance: 95 },
      { id: "o2", title: "AI Productivity Hack", explanation: "Show one practical AI workflow in under 30 seconds.", relevance: 88 },
      { id: "o3", title: "AI Tool Tutorial", explanation: "Create a quick tutorial demonstrating a useful AI feature.", relevance: 85 }
    ],
    nextMove: {
      insight: "Create a short comparison around AI tools while the topic is gaining momentum.",
      platform: "YouTube Shorts"
    },
    relatedTrendIds: ["t4"]
  },
  {
    id: "t2",
    name: "Creator Economy",
    score: 89,
    momentum: "High",
    direction: "rising",
    category: "Business",
    description: "Strong recent momentum across creator-focused content.",
    whyItMatters: "Audience engagement is shifting towards the business of creation.",
    relevanceMatch: 85,
    opportunityScore: "HIGH",
    platformRelevance: {
      youtubeShorts: 82,
      instagramReels: 89,
      tiktok: 80
    },
    opportunities: [
      { id: "o4", title: "Monetization Tips", explanation: "Share 3 ways small creators are making money.", relevance: 90 },
      { id: "o5", title: "Creator Burnout", explanation: "Discuss mental health in the creator space.", relevance: 78 }
    ],
    nextMove: {
      insight: "Focus on monetization strategies for emerging creators.",
      platform: "Instagram Reels"
    },
    relatedTrendIds: []
  },
  {
    id: "t3",
    name: "Tech Education",
    score: 86,
    momentum: "Medium",
    direction: "stable",
    category: "Education",
    description: "Consistent audience interest with steady momentum.",
    whyItMatters: "A reliable niche with long-term evergreen potential.",
    relevanceMatch: 75,
    opportunityScore: "MEDIUM",
    platformRelevance: {
      youtubeShorts: 88,
      instagramReels: 70,
      tiktok: 82
    },
    opportunities: [
      { id: "o6", title: "Coding Basics", explanation: "Explain a fundamental programming concept.", relevance: 80 }
    ],
    nextMove: {
      insight: "Build a multi-part series on a foundational tech concept.",
      platform: "YouTube Shorts"
    },
    relatedTrendIds: ["t1", "t4"]
  },
  {
    id: "t4",
    name: "AI Productivity",
    score: 91,
    momentum: "High",
    direction: "rising",
    category: "Technology",
    description: "Growing interest in AI-assisted workflows.",
    whyItMatters: "People are actively searching for ways to save time using AI.",
    relevanceMatch: 88,
    opportunityScore: "HIGH",
    platformRelevance: {
      youtubeShorts: 85,
      instagramReels: 92,
      tiktok: 88
    },
    opportunities: [
      { id: "o7", title: "Workflow Automation", explanation: "Show how to automate daily tasks.", relevance: 91 }
    ],
    nextMove: {
      insight: "Demonstrate a specific AI workflow that saves 1+ hours a day.",
      platform: "Instagram Reels"
    },
    relatedTrendIds: ["t1"]
  }
];

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

export const mockHistorySummary: HistorySummary = {
  totalAnalyses: 12,
  averageScore: 87,
  risingOpportunities: 5,
  topPlatform: "YouTube Shorts",
}

export const mockHistoryItems: AnalysisHistoryItem[] = [
  {
    id: "analysis-001",
    title: "AI Tools Explained",
    thumbnail: "bg-blue-900/50",
    date: "Aug 29, 2026",
    duration: "00:28",
    score: 91,
    bestPlatform: "YouTube Shorts",
    trendStatus: "rising",
    category: "Technology"
  },
  {
    id: "analysis-002",
    title: "Coding With AI",
    thumbnail: "bg-purple-900/50",
    date: "Aug 27, 2026",
    duration: "00:34",
    score: 87,
    bestPlatform: "Instagram Reels",
    trendStatus: "stable",
    category: "Education"
  },
  {
    id: "analysis-003",
    title: "Monetization Tips 2026",
    thumbnail: "bg-emerald-900/50",
    date: "Aug 24, 2026",
    duration: "00:59",
    score: 94,
    bestPlatform: "YouTube Shorts",
    trendStatus: "rising",
    category: "Business"
  },
  {
    id: "analysis-004",
    title: "Why I Quit My Job",
    thumbnail: "bg-amber-900/50",
    date: "Aug 20, 2026",
    duration: "02:15",
    score: 72,
    bestPlatform: "TikTok",
    trendStatus: "falling",
    category: "Lifestyle"
  },
  {
    id: "analysis-005",
    title: "The Best New Movies",
    thumbnail: "bg-rose-900/50",
    date: "Aug 15, 2026",
    duration: "01:10",
    score: 84,
    bestPlatform: "TikTok",
    trendStatus: "stable",
    category: "Entertainment"
  },
  {
    id: "analysis-006",
    title: "How To Edit Faster",
    thumbnail: "bg-indigo-900/50",
    date: "Aug 10, 2026",
    duration: "00:45",
    score: 89,
    bestPlatform: "Instagram Reels",
    trendStatus: "rising",
    category: "Education"
  }
];
