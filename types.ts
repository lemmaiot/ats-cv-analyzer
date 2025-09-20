export interface ScoreBreakdown {
  area: string;
  score: number;
  feedback: string;
}

export interface AnalysisResult {
  overallScore: number;
  scoreBreakdown: ScoreBreakdown[];
  summary: string;
  keyImprovement: string;
  trends: string[];
}

export interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  };
}