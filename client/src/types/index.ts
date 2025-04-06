// src/types/index.ts

// User-related types
export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  language: string;
  notificationsEnabled: boolean;
  defaultAnalysisOptions?: AnalysisOptions;
}

export interface UserStats {
  totalDocuments: number;
  totalAnalyses: number;
  lastActive: string;
  favoriteAnalysisTypes: string[];
}

// Auth-related types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Text document types
export interface TextDocument {
  id: string;
  title: string;
  content: string;
  language: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  isAnalyzed: boolean;
  metadata?: Record<string, any>;
  tags?: string[];
}

// Analysis types
export interface AnalysisOptions {
  sentiment?: boolean;
  keywords?: boolean;
  entities?: boolean;
  summary?: boolean;
  readability?: boolean;
  language?: string;
  modelId?: string;
}

export interface AnalysisResult {
  id: string;
  textId: string;
  createdAt: string;
  sentiment?: SentimentAnalysis;
  keywords?: KeywordAnalysis;
  entities?: EntityAnalysis;
  summary?: TextSummary;
  readability?: ReadabilityAnalysis;
  language: string;
  modelId: string;
}

export interface SentimentAnalysis {
  score: number; // -1 to 1 where -1 is very negative, 1 is very positive
  magnitude: number; // Strength of sentiment
  label: "positive" | "negative" | "neutral" | "mixed";
}

export interface KeywordAnalysis {
  keywords: Array<{
    text: string;
    score: number;
    count: number;
  }>;
}

export interface EntityAnalysis {
  entities: Array<{
    text: string;
    type: string; // PERSON, LOCATION, ORGANIZATION, etc.
    salience: number;
    mentions: number;
  }>;
}

export interface TextSummary {
  summary: string;
  extractiveSentences?: string[];
}

export interface ReadabilityAnalysis {
  score: number;
  grade: string;
  metrics: {
    sentenceCount: number;
    wordCount: number;
    averageSentenceLength: number;
    syllableCount?: number;
    complexWordCount?: number;
  };
}

// Model types
export interface Model {
  id: string;
  name: string;
  description: string;
  type:
    | "sentiment"
    | "keyword"
    | "entity"
    | "summary"
    | "readability"
    | "combined";
  language: string;
  isActive: boolean;
  performance: ModelPerformance;
  createdAt: string;
  updatedAt: string;
}

export interface ModelPerformance {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  sampleSize: number;
  lastEvaluated: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  count: number;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  };
  data: T[];
}

// Error types
export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}
