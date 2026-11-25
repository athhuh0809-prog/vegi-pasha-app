import {
  getCanonicalVegetableName,
  resolveCatalogVegetable,
  VEGETABLE_CATALOG,
} from '../data/vegetableCatalog';
import type { CharacterProfile } from '../types/character';
import type {
  DailyMealGroup,
  EncyclopediaData,
  EncyclopediaRecentMeal,
  EncyclopediaVegetableStatus,
  MealRecord,
  MealType,
  SavedVegetableEntry,
  VegetableItem,
} from '../types/meal';
import { createDefaultCharacterProfile, DEFAULT_CHARACTER_NAME } from './characterEngine';

const DB_NAME = 'vegepasha_db';
const DB_VERSION = 3;
const STORE_MEAL_RECORDS = 'mealRecords';
const STORE_ENCYCLOPEDIA_META = 'encyclopediaMeta';
const STORE_CHARACTER_PROFILE = 'characterProfile';
const VIEWED_IDS_KEY = 'viewedVegetableIds';
const CHARACTER_PROFILE_KEY = 'mainCharacter';

export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  breakfast: '朝食',
  lunch: '昼食',
  dinner: '夕食',
  snack: '間食',
};

export const MEAL_TYPE_ORDER: Record<MealType, number> = {
  breakfast: 0,
  lunch: 1,
  snack: 2,
  dinner: 3,
};

export function normalizeVegetableName(name: string): string {
  return getCanonicalVegetableName(name);
}

export function deriveMetadataForRecord(vegetables: VegetableItem[]): {
  savedVegetables: SavedVegetableEntry[];
  uniqueVegetableNames: string[];
  nutrientNames: string[];
} {
  const savedVegetables: SavedVegetableEntry[] = vegetables.map((veg) => {
    const cleanName = veg.name.trim() || '不明な野菜';
    const isIdentified = veg.confidence !== 'unknown' || veg.isUserEdited || veg.isUserAdded;
    const normalized = isIdentified ? getCanonicalVegetableName(cleanName) : cleanName;
    return {
      ...veg,
      name: cleanName,
      normalizedName: normalized || cleanName,
    };
  });

  const vegSet = new Set<string>();
  const nutSet = new Set<string>();

  for (const veg of savedVegetables) {
    if (veg.confidence !== 'unknown' || veg.isUserEdited || veg.isUserAdded) {
      vegSet.add(veg.normalizedName);
    } else {
      vegSet.add(veg.name);
    }
    for (const nut of veg.nutrients) {
      const cleanNut = nut.name.trim();
      if (cleanNut) {
        nutSet.add(cleanNut);
      }
    }
  }

  return {
    savedVegetables,
    uniqueVegetableNames: Array.from(vegSet),
    nutrientNames: Array.from(nutSet),
  };
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      reject(new Error('お使いのブラウザはIndexedDBに対応していません。'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_MEAL_RECORDS)) {
        const store = db.createObjectStore(STORE_MEAL_RECORDS, { keyPath: 'id' });
        store.createIndex('eatenDate', 'eatenDate', { unique: false });
        store.createIndex('eatenAt', 'eatenAt', { unique: false });
        store.createIndex('sourceAnalysisId', 'sourceAnalysisId', { unique: true });
        store.createIndex('mealType', 'mealType', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORE_ENCYCLOPEDIA_META)) {
        db.createObjectStore(STORE_ENCYCLOPEDIA_META, { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains(STORE_CHARACTER_PROFILE)) {
        db.createObjectStore(STORE_CHARACTER_PROFILE, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error('食事記録データベースを開けませんでした。'));
  });
}

export async function getAllMealRecords(): Promise<MealRecord[]> {
  const db = await openDatabase();
  try {
    return await new Promise<MealRecord[]>((resolve, reject) => {
      const tx = db.transaction(STORE_MEAL_RECORDS, 'readonly');
      const store = tx.objectStore(STORE_MEAL_RECORDS);
      const req = store.getAll();
      req.onsuccess = () => {
        const records = (req.result as MealRecord[] | undefined) ?? [];
        records.sort((a, b) => b.eatenAt.localeCompare(a.eatenAt));
        resolve(records);
      };
      req.onerror = () =>
        reject(req.error ?? new Error('食事記録の読み込みに失敗しました。'));
    });
  } finally {
    db.close();
  }
}

export async function findMealRecordByAnalysisId(
  sourceAnalysisId: string,
): Promise<MealRecord | null> {
  const db = await openDatabase();
  try {
    return await new Promise<MealRecord | null>((resolve, reject) => {
      const tx = db.transaction(STORE_MEAL_RECORDS, 'readonly');
      const store = tx.objectStore(STORE_MEAL_RECORDS);
      const index = store.index('sourceAnalysisId');
      const req = index.get(sourceAnalysisId);
      req.onsuccess = () => resolve((req.result as MealRecord | undefined) ?? null);
      req.onerror = () => reject(req.error ?? new Error('記録の確認に失敗しました。'));
    });
  } finally {
    db.close();
  }
}

export async function saveNewMealRecord(record: MealRecord): Promise<MealRecord> {
  const existing = await findMealRecordByAnalysisId(record.sourceAnalysisId);
  if (existing) {
    throw new Error('DUPLICATE_ANALYSIS_RECORD');
  }

  const db = await openDatabase();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_MEAL_RECORDS, 'readwrite');
      const store = tx.objectStore(STORE_MEAL_RECORDS);
      const req = store.add(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error ?? new Error('食事記録の保存に失敗しました。'));
    });
    return record;
  } finally {
    db.close();
  }
}

export async function updateExistingMealRecord(record: MealRecord): Promise<MealRecord> {
  const db = await openDatabase();
  try {
    const updated: MealRecord = {
      ...record,
      eatenDate: record.eatenAt.slice(0, 10),
      updatedAt: new Date().toISOString(),
    };
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_MEAL_RECORDS, 'readwrite');
      const store = tx.objectStore(STORE_MEAL_RECORDS);
      const req = store.put(updated);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error ?? new Error('食事記録の更新に失敗しました。'));
    });
    return updated;
  } finally {
    db.close();
  }
}

export async function deleteMealRecordById(id: string): Promise<void> {
  const db = await openDatabase();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_MEAL_RECORDS, 'readwrite');
      const store = tx.objectStore(STORE_MEAL_RECORDS);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error ?? new Error('食事記録の削除に失敗しました。'));
    });
  } finally {
    db.close();
  }
}

export function groupRecordsByDate(records: MealRecord[]): DailyMealGroup[] {
  const map = new Map<string, MealRecord[]>();

  for (const record of records) {
    const dateKey = record.eatenDate || record.eatenAt.slice(0, 10);
    const list = map.get(dateKey) ?? [];
    list.push(record);
    map.set(dateKey, list);
  }

  const groups: DailyMealGroup[] = [];
  for (const [date, dayRecords] of map.entries()) {
    dayRecords.sort((a, b) => {
      const timeCmp = b.eatenAt.localeCompare(a.eatenAt);
      if (timeCmp !== 0) return timeCmp;
      return MEAL_TYPE_ORDER[a.mealType] - MEAL_TYPE_ORDER[b.mealType];
    });

    const vegSet = new Set<string>();
    for (const rec of dayRecords) {
      for (const veg of rec.vegetables) {
        const isIdentified = veg.confidence !== 'unknown' || veg.isUserEdited || veg.isUserAdded;
        const rawLabel = veg.normalizedName || veg.name.trim();
        const label = isIdentified ? getCanonicalVegetableName(rawLabel) : rawLabel;
        if (label) vegSet.add(label);
      }
    }

    const uniqueVegetables = Array.from(vegSet);
    groups.push({
      date,
      records: dayRecords,
      uniqueVegetables,
      vegetableCount: uniqueVegetables.length,
    });
  }

  groups.sort((a, b) => b.date.localeCompare(a.date));
  return groups;
}

/**
 * 将来の「野菜図鑑」「キャラクター育成」機能向けの集計ユーティリティ。
 */
export function getVegetableEncyclopediaSummary(records: MealRecord[]): Array<{
  name: string;
  count: number;
  nutrients: string[];
  lastEatenAt: string;
}> {
  const summaryMap = new Map<
    string,
    { count: number; nutrients: Set<string>; lastEatenAt: string }
  >();

  for (const rec of records) {
    const seenInMeal = new Set<string>();
    for (const veg of rec.vegetables) {
      const isIdentified = veg.confidence !== 'unknown' || veg.isUserEdited || veg.isUserAdded;
      const raw = veg.normalizedName || veg.name.trim();
      const key = isIdentified ? getCanonicalVegetableName(raw) : raw;
      if (!key || seenInMeal.has(key)) continue;
      seenInMeal.add(key);

      const existing = summaryMap.get(key) ?? {
        count: 0,
        nutrients: new Set<string>(),
        lastEatenAt: rec.eatenAt,
      };
      existing.count += 1;
      if (rec.eatenAt > existing.lastEatenAt) {
        existing.lastEatenAt = rec.eatenAt;
      }
      for (const n of veg.nutrients) {
        if (n.name.trim()) existing.nutrients.add(n.name.trim());
      }
      summaryMap.set(key, existing);
    }
  }

  return Array.from(summaryMap.entries())
    .map(([name, info]) => ({
      name,
      count: info.count,
      nutrients: Array.from(info.nutrients),
      lastEatenAt: info.lastEatenAt,
    }))
    .sort((a, b) => b.count - a.count);
}

interface EncyclopediaMetaRow {
  key: string;
  ids: string[];
}

export async function getViewedEncyclopediaIds(): Promise<string[]> {
  const db = await openDatabase();
  try {
    return await new Promise<string[]>((resolve, reject) => {
      const tx = db.transaction(STORE_ENCYCLOPEDIA_META, 'readonly');
      const store = tx.objectStore(STORE_ENCYCLOPEDIA_META);
      const req = store.get(VIEWED_IDS_KEY);
      req.onsuccess = () => {
        const row = req.result as EncyclopediaMetaRow | undefined;
        resolve(Array.isArray(row?.ids) ? row.ids : []);
      };
      req.onerror = () =>
        reject(req.error ?? new Error('野菜図鑑の既読情報の読み込みに失敗しました。'));
    });
  } finally {
    db.close();
  }
}

async function saveViewedEncyclopediaIds(ids: string[]): Promise<string[]> {
  const uniqueIds = Array.from(new Set(ids));
  const db = await openDatabase();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_ENCYCLOPEDIA_META, 'readwrite');
      const store = tx.objectStore(STORE_ENCYCLOPEDIA_META);
      const req = store.put({ key: VIEWED_IDS_KEY, ids: uniqueIds } satisfies EncyclopediaMetaRow);
      req.onsuccess = () => resolve();
      req.onerror = () =>
        reject(req.error ?? new Error('野菜図鑑の既読情報の保存に失敗しました。'));
    });
    return uniqueIds;
  } finally {
    db.close();
  }
}

export async function markVegetableViewed(vegetableId: string): Promise<string[]> {
  const current = await getViewedEncyclopediaIds();
  if (current.includes(vegetableId)) return current;
  return saveViewedEncyclopediaIds([...current, vegetableId]);
}

export async function pruneViewedEncyclopediaIds(
  unlockedIds: string[],
): Promise<string[]> {
  const current = await getViewedEncyclopediaIds();
  const unlockedSet = new Set(unlockedIds);
  const pruned = current.filter((id) => unlockedSet.has(id));
  if (pruned.length === current.length) return current;
  return saveViewedEncyclopediaIds(pruned);
}

export function buildEncyclopediaData(
  records: MealRecord[],
  viewedIds: string[],
): EncyclopediaData {
  const statsById = new Map<
    string,
    {
      eatCount: number;
      firstEatenAt: string | null;
      lastEatenAt: string | null;
      recentMeals: EncyclopediaRecentMeal[];
    }
  >();

  for (const rec of records) {
    const matchedIdsInMeal = new Set<string>();
    for (const veg of rec.vegetables) {
      const isIdentified = veg.confidence !== 'unknown' || veg.isUserEdited || veg.isUserAdded;
      if (!isIdentified) continue;
      const matched =
        resolveCatalogVegetable(veg.name) ?? resolveCatalogVegetable(veg.normalizedName);
      if (matched) {
        matchedIdsInMeal.add(matched.id);
      }
    }

    for (const catId of matchedIdsInMeal) {
      const current = statsById.get(catId) ?? {
        eatCount: 0,
        firstEatenAt: null,
        lastEatenAt: null,
        recentMeals: [],
      };
      current.eatCount += 1;
      if (!current.firstEatenAt || rec.eatenAt < current.firstEatenAt) {
        current.firstEatenAt = rec.eatenAt;
      }
      if (!current.lastEatenAt || rec.eatenAt > current.lastEatenAt) {
        current.lastEatenAt = rec.eatenAt;
      }
      current.recentMeals.push({
        recordId: rec.id,
        dishName: rec.dishName,
        eatenAt: rec.eatenAt,
        mealType: rec.mealType,
      });
      statsById.set(catId, current);
    }
  }

  const viewedSet = new Set(viewedIds);
  const entries: EncyclopediaVegetableStatus[] = VEGETABLE_CATALOG.map((catalog) => {
    const stat = statsById.get(catalog.id);
    const eatCount = stat?.eatCount ?? 0;
    const isUnlocked = eatCount > 0;
    const isNew = isUnlocked && !viewedSet.has(catalog.id);
    const recentMeals = stat
      ? [...stat.recentMeals].sort((a, b) => b.eatenAt.localeCompare(a.eatenAt))
      : [];

    return {
      catalog,
      isUnlocked,
      isNew,
      eatCount,
      firstEatenAt: stat?.firstEatenAt ?? null,
      lastEatenAt: stat?.lastEatenAt ?? null,
      recentMeals,
    };
  });

  const totalCount = VEGETABLE_CATALOG.length;
  const unlockedCount = entries.filter((e) => e.isUnlocked).length;
  const newCount = entries.filter((e) => e.isNew).length;
  const completionRate = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  return {
    entries,
    totalCount,
    unlockedCount,
    newCount,
    completionRate,
  };
}

export function getNewlyUnlockableVegetableNames(
  vegetables: VegetableItem[],
  currentEncyclopedia: EncyclopediaData,
): string[] {
  const unlockedSet = new Set(
    currentEncyclopedia.entries.filter((e) => e.isUnlocked).map((e) => e.catalog.id),
  );
  const newNames: string[] = [];
  const seen = new Set<string>();

  for (const veg of vegetables) {
    const isIdentified = veg.confidence !== 'unknown' || veg.isUserEdited || veg.isUserAdded;
    if (!isIdentified) continue;
    const matched = resolveCatalogVegetable(veg.name);
    if (matched && !unlockedSet.has(matched.id) && !seen.has(matched.id)) {
      seen.add(matched.id);
      newNames.push(matched.name);
    }
  }
  return newNames;
}

export async function getCharacterProfile(): Promise<CharacterProfile> {
  const db = await openDatabase();
  try {
    const existing = await new Promise<CharacterProfile | undefined>((resolve, reject) => {
      const tx = db.transaction(STORE_CHARACTER_PROFILE, 'readonly');
      const store = tx.objectStore(STORE_CHARACTER_PROFILE);
      const req = store.get(CHARACTER_PROFILE_KEY);
      req.onsuccess = () => resolve(req.result as CharacterProfile | undefined);
      req.onerror = () =>
        reject(req.error ?? new Error('キャラクター情報の読み込みに失敗しました。'));
    });

    if (existing) {
      return existing;
    }

    const initial = createDefaultCharacterProfile();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_CHARACTER_PROFILE, 'readwrite');
      const store = tx.objectStore(STORE_CHARACTER_PROFILE);
      const req = store.put(initial);
      req.onsuccess = () => resolve();
      req.onerror = () =>
        reject(req.error ?? new Error('キャラクター情報の初期化に失敗しました。'));
    });
    return initial;
  } finally {
    db.close();
  }
}

export async function saveCharacterProfile(profile: CharacterProfile): Promise<CharacterProfile> {
  const updated: CharacterProfile = {
    ...profile,
    key: CHARACTER_PROFILE_KEY,
    updatedAt: new Date().toISOString(),
  };
  const db = await openDatabase();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_CHARACTER_PROFILE, 'readwrite');
      const store = tx.objectStore(STORE_CHARACTER_PROFILE);
      const req = store.put(updated);
      req.onsuccess = () => resolve();
      req.onerror = () =>
        reject(req.error ?? new Error('キャラクター情報の保存に失敗しました。'));
    });
    return updated;
  } finally {
    db.close();
  }
}

export async function updateCharacterName(rawName: string): Promise<CharacterProfile> {
  const current = await getCharacterProfile();
  const cleanName = rawName.trim().slice(0, 16) || DEFAULT_CHARACTER_NAME;
  return saveCharacterProfile({
    ...current,
    name: cleanName,
  });
}

export async function updateCharacterCelebratedLevel(level: number): Promise<CharacterProfile> {
  const current = await getCharacterProfile();
  if (current.lastCelebratedLevel === level) return current;
  return saveCharacterProfile({
    ...current,
    lastCelebratedLevel: Math.max(1, level),
  });
}

export function getDefaultMealTypeByHour(date = new Date()): MealType {
  const hour = date.getHours();
  if (hour >= 5 && hour < 10) return 'breakfast';
  if (hour >= 10 && hour < 15) return 'lunch';
  if (hour >= 15 && hour < 17) return 'snack';
  return 'dinner';
}

export function toLocalDateTimeInputValue(date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  return `${y}-${m}-${d}T${hh}:${mm}`;
}

export function formatJapaneseDateHeading(dateStr: string): {
  label: string;
  relativeTag: string | null;
} {
  const [y, m, d] = dateStr.split('-').map(Number);
  if (!y || !m || !d) {
    return { label: dateStr, relativeTag: null };
  }
  const target = new Date(y, m - 1, d);
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  const wd = weekdays[target.getDay()] ?? '';
  const label = `${y}年${m}月${d}日（${wd}）`;

  const now = new Date();
  const todayStr = toLocalDateTimeInputValue(now).slice(0, 10);
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const yesterdayStr = toLocalDateTimeInputValue(yesterday).slice(0, 10);

  let relativeTag: string | null = null;
  if (dateStr === todayStr) relativeTag = '今日';
  else if (dateStr === yesterdayStr) relativeTag = '昨日';

  return { label, relativeTag };
}
