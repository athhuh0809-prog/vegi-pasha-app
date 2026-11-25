import type { VegetableCatalogEntry } from '../data/vegetableCatalog';

export type ConfidenceLevel = 'confirmed' | 'estimated' | 'unknown';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

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
  dishName?: string;
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
  savedRecordId?: string;
  hasUnsavedEditsAfterSave?: boolean;
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

/**
 * IndexedDBに永続化する食事記録データ構造。
 * 将来の「野菜図鑑」や「キャラクター育成」機能で集計・参照しやすいように
 * normalizedName や uniqueVegetableNames、nutrientNames を保持します。
 */
export interface SavedVegetableEntry extends VegetableItem {
  normalizedName: string;
}

export interface MealRecord {
  id: string;
  schemaVersion: 1;
  sourceAnalysisId: string;
  dishName: string;
  dishSummary: string;
  mealType: MealType;
  eatenAt: string; // Local datetime string: YYYY-MM-DDTHH:mm
  eatenDate: string; // Local date string: YYYY-MM-DD (for daily grouping & indexing)
  imageDataUrl: string;
  vegetables: SavedVegetableEntry[];
  uniqueVegetableNames: string[];
  nutrientNames: string[];
  adviceNote: string;
  cautionNote: string;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export interface DailyMealGroup {
  date: string; // YYYY-MM-DD
  records: MealRecord[];
  uniqueVegetables: string[];
  vegetableCount: number;
}

export interface EncyclopediaRecentMeal {
  recordId: string;
  dishName: string;
  eatenAt: string;
  mealType: MealType;
}

export interface EncyclopediaVegetableStatus {
  catalog: VegetableCatalogEntry;
  isUnlocked: boolean;
  isNew: boolean;
  eatCount: number;
  firstEatenAt: string | null;
  lastEatenAt: string | null;
  recentMeals: EncyclopediaRecentMeal[];
}

export interface EncyclopediaData {
  entries: EncyclopediaVegetableStatus[];
  totalCount: number;
  unlockedCount: number;
  newCount: number;
  completionRate: number;
}
