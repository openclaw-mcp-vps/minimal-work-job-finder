export type SourceType = "greenhouse" | "lever" | "curated";

export interface WorkLifeScore {
  score: number;
  classification: "low-pressure" | "balanced" | "mixed" | "high-pressure";
  positiveSignals: string[];
  riskSignals: string[];
  shouldExclude: boolean;
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  remote: boolean;
  url: string;
  postedAt: string;
  descriptionSnippet: string;
  source: SourceType;
  workLife: WorkLifeScore;
}

export interface SavedSearch {
  id: string;
  email: string;
  name: string;
  query: string;
  remoteOnly: boolean;
  minScore: number;
  role: string;
  createdAt: string;
}

export interface PurchaseRecord {
  id: string;
  email: string;
  provider: "stripe";
  eventId: string;
  createdAt: string;
}
