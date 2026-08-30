import {
  AnalysisReport,
  AnalysisStatusResponse,
  CreateAnalysisJobResponse,
  TrendItem
} from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

class ApiClientError extends Error {
  public status?: number;
  
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
  }
}

async function fetchWrapper<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      throw new ApiClientError(`API Error: ${response.status} - ${errorText}`, response.status);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new ApiClientError(`Network Error: ${(error as Error).message}`);
  }
}

export const api = {
  // Health
  checkHealth: () => fetchWrapper<{ status: string }>("/api/v1/health"),

  // Video Upload
  uploadVideo: (file: File): Promise<CreateAnalysisJobResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    return fetchWrapper<CreateAnalysisJobResponse>("/api/v1/videos", {
      method: "POST",
      body: formData,
    });
  },

  // Analysis
  getAnalysisStatus: (jobId: string): Promise<AnalysisStatusResponse> => {
    return fetchWrapper<AnalysisStatusResponse>(`/api/v1/analysis/${jobId}`);
  },

  retryAnalysis: (jobId: string): Promise<{ status: string }> => {
    return fetchWrapper<{ status: string }>(`/api/v1/analysis/${jobId}/retry`, {
      method: "POST",
    });
  },

  // Reports
  getVideoReport: (videoId: string): Promise<AnalysisReport> => {
    return fetchWrapper<AnalysisReport>(`/api/v1/videos/${videoId}/report`);
  },

  // Trends
  getTrends: (): Promise<TrendItem[]> => {
    return fetchWrapper<TrendItem[]>("/api/v1/trends");
  },

  getTrendsMatch: (videoId: string): Promise<TrendItem[]> => {
    return fetchWrapper<TrendItem[]>(`/api/v1/trends/match?video_id=${videoId}`);
  },
};
