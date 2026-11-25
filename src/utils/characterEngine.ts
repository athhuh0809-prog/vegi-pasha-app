import { getCanonicalVegetableName, resolveCatalogVegetable } from '../data/vegetableCatalog';
import type {
  CharacterProfile,
  CharacterProgressSnapshot,
  CharacterStats,
  DailyGrowthSummary,
  EvolutionStageBlueprint,
  GameStatKey,
  MealGrowthEvent,
} from '../types/character';
import type { MealRecord } from '../types/meal';

export const DEFAULT_CHARACTER_NAME = 'ベジっぴ';
export const DAILY_EXP_CAP = 120;
export const MAX_MEAL_EXP = 60;

export const BASE_CHARACTER_STATS: CharacterStats = {
  hp: 30,
  attack: 10,
  defense: 10,
  speed: 10,
};

export const NUTRIENT_GAME_MAPPING: Array<{
  statKey: GameStatKey;
  nutrientLabel: string;
  targetLabel: string;
  unitGain: number;
  description: string;
}> = [
  {
    statKey: 'hp',
    nutrientLabel: '食物繊維',
    targetLabel: 'HP',
    unitGain: 4,
    description: 'タフさの源！食べるほどHPがぐんとアップします。',
  },
  {
    statKey: 'attack',
    nutrientLabel: 'β-カロテン',
    targetLabel: '攻撃力',
    unitGain: 2,
    description: '元気パワー！攻撃力が伸びやすくなります。',
  },
  {
    statKey: 'defense',
    nutrientLabel: 'ビタミンC',
    targetLabel: '防御力',
    unitGain: 2,
    description: 'まもりの力！防御力がしっかりアップします。',
  },
  {
    statKey: 'speed',
    nutrientLabel: 'カリウム',
    targetLabel: '素早さ',
    unitGain: 2,
    description: 'かるやかステップ！素早さがぐっと上がります。',
  },
  {
    statKey: 'expBonus',
    nutrientLabel: '葉酸',
    targetLabel: '経験値',
    unitGain: 8,
    description: '成長ブースト！追加で経験値がもらえます。',
  },
];

export const EVOLUTION_BLUEPRINTS: EvolutionStageBlueprint[] = [
  {
    stage: 1,
    stageLabel: '第1段階・ふたば期',
    speciesTitle: 'もりもりベジ精霊',
    minLevel: 1,
    description: '頭のふたばがトレードマーク。いろいろな野菜を食べて元気に育ちます。',
  },
  {
    stage: 2,
    stageLabel: '第2段階・わかば期（今後のアップデート予定）',
    speciesTitle: 'すくすくリーフ精霊',
    minLevel: 5,
    description: '今後の進化機能で、レベルと食べた野菜のバランスに応じた姿へ進化予定です。',
  },
  {
    stage: 3,
    stageLabel: '第3段階・みのり期（今後のアップデート予定）',
    speciesTitle: 'ベジフルマスター',
    minLevel: 10,
    description: '今後の進化・バトル機能で活躍する頼もしい姿です。',
  },
];

export function createDefaultCharacterProfile(): CharacterProfile {
  const now = new Date().toISOString();
  return {
    key: 'mainCharacter',
    name: DEFAULT_CHARACTER_NAME,
    speciesId: 'vegeppi',
    evolutionStage: 1,
    lastCelebratedLevel: 1,
    createdAt: now,
    updatedAt: now,
  };
}

export function getExpRequiredForNextLevel(level: number): number {
  return 40 + (Math.max(1, level) - 1) * 20;
}

export function calculateLevelFromTotalExp(totalExp: number): {
  level: number;
  expInCurrentLevel: number;
  expForNextLevel: number;
  levelProgressPercent: number;
} {
  let level = 1;
  let remaining = Math.max(0, Math.floor(totalExp));

  while (remaining >= getExpRequiredForNextLevel(level)) {
    remaining -= getExpRequiredForNextLevel(level);
    level += 1;
  }

  const expForNextLevel = getExpRequiredForNextLevel(level);
  const levelProgressPercent =
    expForNextLevel > 0 ? Math.min(100, Math.round((remaining / expForNextLevel) * 100)) : 0;

  return {
    level,
    expInCurrentLevel: remaining,
    expForNextLevel,
    levelProgressPercent,
  };
}

function classifyNutrientName(rawName: string): GameStatKey | null {
  const normalized = rawName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[ｃ]/g, 'c')
    .replace(/[－ー−]/g, '-');

  if (!normalized) return null;

  if (
    normalized.includes('β-カロテン') ||
    normalized.includes('βカロテン') ||
    normalized.includes('ベータカロテン') ||
    normalized.includes('カロテン')
  ) {
    return 'attack';
  }
  if (normalized.includes('ビタミンc')) {
    return 'defense';
  }
  if (
    normalized.includes('食物繊維') ||
    normalized.includes('ペクチン') ||
    normalized.includes('イヌリン') ||
    normalized.includes('セルロース')
  ) {
    return 'hp';
  }
  if (normalized.includes('カリウム')) {
    return 'speed';
  }
  if (normalized.includes('葉酸')) {
    return 'expBonus';
  }
  return null;
}

function formatLocalTodayDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function buildCharacterProgress(
  records: MealRecord[],
  profile: CharacterProfile,
  todayDate = formatLocalTodayDate(),
): CharacterProgressSnapshot {
  // Sort oldest -> newest so daily cap applies deterministically in chronological order
  const chronological = [...records].sort((a, b) => {
    const timeCmp = a.eatenAt.localeCompare(b.eatenAt);
    if (timeCmp !== 0) return timeCmp;
    const createdCmp = a.createdAt.localeCompare(b.createdAt);
    if (createdCmp !== 0) return createdCmp;
    return a.id.localeCompare(b.id);
  });

  const seenRecordIds = new Set<string>();
  const seenSourceAnalysisIds = new Set<string>();
  const dailyExpUsed = new Map<string, number>();

  let totalExp = 0;
  const nutrientBonusStats: CharacterStats = {
    hp: 0,
    attack: 0,
    defense: 0,
    speed: 0,
  };

  const allEvents: MealGrowthEvent[] = [];

  for (const record of chronological) {
    // Prevent duplicate EXP from the exact same record or analysis ID
    if (seenRecordIds.has(record.id)) continue;
    if (record.sourceAnalysisId && seenSourceAnalysisIds.has(record.sourceAnalysisId)) continue;
    seenRecordIds.add(record.id);
    if (record.sourceAnalysisId) {
      seenSourceAnalysisIds.add(record.sourceAnalysisId);
    }

    const dateKey = record.eatenDate || record.eatenAt.slice(0, 10);

    // Deduplicate identified vegetables within a single meal
    const uniqueVeggiesInMeal = new Map<
      string,
      { displayName: string; nutrientNames: string[] }
    >();

    for (const veg of record.vegetables) {
      const isIdentified = veg.confidence !== 'unknown' || veg.isUserEdited || veg.isUserAdded;
      if (!isIdentified) continue;

      const canonicalName = getCanonicalVegetableName(veg.name || veg.normalizedName);
      if (!canonicalName) continue;

      const explicitNutrients = veg.nutrients.map((n) => n.name.trim()).filter(Boolean);
      const catalogMatch = resolveCatalogVegetable(canonicalName);
      const nutrientNames =
        explicitNutrients.length > 0
          ? explicitNutrients
          : catalogMatch
            ? catalogMatch.nutrients.map((n) => n.name)
            : [];

      if (!uniqueVeggiesInMeal.has(canonicalName)) {
        uniqueVeggiesInMeal.set(canonicalName, {
          displayName: canonicalName,
          nutrientNames,
        });
      }
    }

    if (uniqueVeggiesInMeal.size === 0) {
      continue;
    }

    let rawHp = 0;
    let rawAttack = 0;
    let rawDefense = 0;
    let rawSpeed = 0;
    let folateBonusExp = 0;
    const matchedNutrients: Array<{ nutrientLabel: string; statKey: GameStatKey }> = [];
    const matchedTagSet = new Set<string>();

    for (const vegEntry of uniqueVeggiesInMeal.values()) {
      const statAppliedForVeg = new Set<GameStatKey>();
      for (const nName of vegEntry.nutrientNames) {
        const statKey = classifyNutrientName(nName);
        if (!statKey || statAppliedForVeg.has(statKey)) continue;
        statAppliedForVeg.add(statKey);

        if (statKey === 'hp') rawHp += 4;
        else if (statKey === 'attack') rawAttack += 2;
        else if (statKey === 'defense') rawDefense += 2;
        else if (statKey === 'speed') rawSpeed += 2;
        else if (statKey === 'expBonus') folateBonusExp += 8;

        const label =
          NUTRIENT_GAME_MAPPING.find((m) => m.statKey === statKey)?.nutrientLabel ?? nName;
        if (!matchedTagSet.has(statKey)) {
          matchedTagSet.add(statKey);
          matchedNutrients.push({ nutrientLabel: label, statKey });
        }
      }
    }

    // Per-meal EXP formula: 4 base + 12 per distinct vegetable + folate bonus, capped at MAX_MEAL_EXP
    const uncappedMealExp = 4 + uniqueVeggiesInMeal.size * 12 + folateBonusExp;
    const rawExp = Math.min(MAX_MEAL_EXP, uncappedMealExp);

    const usedToday = dailyExpUsed.get(dateKey) ?? 0;
    const remainingDaily = Math.max(0, DAILY_EXP_CAP - usedToday);
    const actualExp = Math.min(rawExp, remainingDaily);
    dailyExpUsed.set(dateKey, usedToday + actualExp);

    const cappedByDailyLimit = actualExp < rawExp;
    const scale = rawExp > 0 ? actualExp / rawExp : 0;

    // Cap per-meal raw stat gains reasonably as well and scale if daily EXP cap is hit
    const statsGained: CharacterStats = {
      hp: Math.round(Math.min(16, rawHp) * scale),
      attack: Math.round(Math.min(8, rawAttack) * scale),
      defense: Math.round(Math.min(8, rawDefense) * scale),
      speed: Math.round(Math.min(8, rawSpeed) * scale),
    };

    totalExp += actualExp;
    nutrientBonusStats.hp += statsGained.hp;
    nutrientBonusStats.attack += statsGained.attack;
    nutrientBonusStats.defense += statsGained.defense;
    nutrientBonusStats.speed += statsGained.speed;

    allEvents.push({
      recordId: record.id,
      dishName: record.dishName,
      mealType: record.mealType,
      eatenAt: record.eatenAt,
      eatenDate: dateKey,
      vegetableNames: Array.from(uniqueVeggiesInMeal.values()).map((v) => v.displayName),
      matchedNutrients,
      rawExp,
      actualExp,
      cappedByDailyLimit,
      statsGained,
    });
  }

  const levelInfo = calculateLevelFromTotalExp(totalExp);

  // Small balanced RPG bonus per level above Lv.1
  const levelsGained = Math.max(0, levelInfo.level - 1);
  const levelBonusStats: CharacterStats = {
    hp: levelsGained * 3,
    attack: levelsGained * 1,
    defense: levelsGained * 1,
    speed: levelsGained * 1,
  };

  const stats: CharacterStats = {
    hp: BASE_CHARACTER_STATS.hp + nutrientBonusStats.hp + levelBonusStats.hp,
    attack: BASE_CHARACTER_STATS.attack + nutrientBonusStats.attack + levelBonusStats.attack,
    defense: BASE_CHARACTER_STATS.defense + nutrientBonusStats.defense + levelBonusStats.defense,
    speed: BASE_CHARACTER_STATS.speed + nutrientBonusStats.speed + levelBonusStats.speed,
  };

  const todayEvents = allEvents
    .filter((ev) => ev.eatenDate === todayDate)
    .sort((a, b) => b.eatenAt.localeCompare(a.eatenAt));

  const todayExpEarned = todayEvents.reduce((sum, ev) => sum + ev.actualExp, 0);
  const todayStatsGained: CharacterStats = todayEvents.reduce(
    (acc, ev) => ({
      hp: acc.hp + ev.statsGained.hp,
      attack: acc.attack + ev.statsGained.attack,
      defense: acc.defense + ev.statsGained.defense,
      speed: acc.speed + ev.statsGained.speed,
    }),
    { hp: 0, attack: 0, defense: 0, speed: 0 },
  );

  const todayGrowth: DailyGrowthSummary = {
    date: todayDate,
    expEarned: todayExpEarned,
    dailyExpCap: DAILY_EXP_CAP,
    remainingExp: Math.max(0, DAILY_EXP_CAP - todayExpEarned),
    isCapReached: todayExpEarned >= DAILY_EXP_CAP,
    statsGained: todayStatsGained,
    events: todayEvents,
  };

  const recentGrowthEvents = [...allEvents]
    .sort((a, b) => b.eatenAt.localeCompare(a.eatenAt))
    .slice(0, 8);

  const evolutionBlueprint =
    EVOLUTION_BLUEPRINTS.find((b) => b.stage === profile.evolutionStage) ??
    EVOLUTION_BLUEPRINTS[0];

  // Determine primary role seed for future battle module
  let primaryRole = 'バランス型';
  if (stats.attack >= stats.defense + 4 && stats.attack >= stats.speed + 4) {
    primaryRole = 'パワーアタッカー型';
  } else if (stats.defense >= stats.attack + 4) {
    primaryRole = 'まもりガード型';
  } else if (stats.speed >= stats.attack + 4) {
    primaryRole = 'スピードスター型';
  } else if (nutrientBonusStats.hp >= 16) {
    primaryRole = 'タフネスサポート型';
  }

  return {
    profile,
    level: levelInfo.level,
    totalExp,
    expInCurrentLevel: levelInfo.expInCurrentLevel,
    expForNextLevel: levelInfo.expForNextLevel,
    levelProgressPercent: levelInfo.levelProgressPercent,
    stats,
    baseStats: BASE_CHARACTER_STATS,
    nutrientBonusStats,
    levelBonusStats,
    todayGrowth,
    recentGrowthEvents,
    totalMealsCounted: allEvents.length,
    evolutionBlueprint,
    battleSeed: {
      affinity: 'leaf',
      primaryRole,
      readyForBattleModule: true,
    },
  };
}
