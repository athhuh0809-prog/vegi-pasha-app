export type ConfidenceLevel = 'confirmed' | 'estimated' | 'unknown';

export interface NutrientInfo {
  id: string;
  name: string;
  benefit: string;
}

export interface VegetableItem {
  id: string;
  name: string;
  confidence: ConfidenceLevel;
  uncertaintyReason?: string;
  nutrients: NutrientInfo[];
  isUserEdited?: boolean;
  isUserAdded?: boolean;
}

export interface MealAnalysisResult {
  isFoodPhoto: boolean;
  dishSummary: string;
  vegetables: VegetableItem[];
  adviceNote: string;
  cautionNote: string;
}

export interface SessionAnalysisEntry {
  id: string;
  imagePreviewUrl: string;
  mimeType: string;
  imageBase64: string;
  analyzedAt: string;
  originalResult: MealAnalysisResult;
  editedResult: MealAnalysisResult;
}

export interface AnalysisErrorInfo {
  title: string;
  message: string;
  httpStatus?: number;
  errorCode?: string;
  rawDetail?: string;
  hint?: string;
  attemptedModels?: string[];
  occurredAt: string;
}
