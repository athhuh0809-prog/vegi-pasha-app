import type { MealType } from './meal';

export type GameStatKey = 'hp' | 'attack' | 'defense' | 'speed' | 'expBonus';

export interface CharacterStats {
  hp: number;
  attack: number;
  defense: number;
  speed: number;
}

export interface CharacterProfile {
  key: 'mainCharacter';
  name: string;
  speciesId: 'vegeppi';
  evolutionStage: 1 | 2 | 3;
  lastCelebratedLevel: number;
  createdAt: string;
  updatedAt: string;
}

export interface MealStatDelta {
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  exp: number;
  folateBonusExp: number;
}

export interface MealGrowthEvent {
  recordId: string;
  dishName: string;
  mealType: MealType;
  eatenAt: string;
  eatenDate: string;
  vegetableNames: string[];
  matchedNutrients: Array<{
    nutrientLabel: string;
    statKey: GameStatKey;
  }>;
  rawExp: number;
  actualExp: number;
  cappedByDailyLimit: boolean;
  statsGained: CharacterStats;
}

export interface DailyGrowthSummary {
  date: string;
  expEarned: number;
  dailyExpCap: number;
  remainingExp: number;
  isCapReached: boolean;
  statsGained: CharacterStats;
  events: MealGrowthEvent[];
}

export interface EvolutionStageBlueprint {
  stage: 1 | 2 | 3;
  stageLabel: string;
  speciesTitle: string;
  minLevel: number;
  description: string;
}

/**
 * 将来の進化機能・バトル機能でそのまま利用できるキャラクター状態スナップショット
 */
export interface CharacterProgressSnapshot {
  profile: CharacterProfile;
  level: number;
  totalExp: number;
  expInCurrentLevel: number;
  expForNextLevel: number;
  levelProgressPercent: number;
  stats: CharacterStats;
  baseStats: CharacterStats;
  nutrientBonusStats: CharacterStats;
  levelBonusStats: CharacterStats;
  todayGrowth: DailyGrowthSummary;
  recentGrowthEvents: MealGrowthEvent[];
  totalMealsCounted: number;
  evolutionBlueprint: EvolutionStageBlueprint;
  battleSeed: {
    affinity: 'leaf';
    primaryRole: string;
    readyForBattleModule: boolean;
  };
}
