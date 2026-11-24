import type {
  DailyMealGroup,
  MealRecord,
  MealType,
  SavedVegetableEntry,
  VegetableItem,
} from '../types/meal';

const DB_NAME = 'vegepasha_db';
const DB_VERSION = 1;
const STORE_MEAL_RECORDS = 'mealRecords';

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
  return name
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[（(].*?[)）]/g, '')
    .trim();
}

export function deriveMetadataForRecord(vegetables: VegetableItem[]): {
  savedVegetables: SavedVegetableEntry[];
  uniqueVegetableNames: string[];
  nutrientNames: string[];
} {
  const savedVegetables: SavedVegetableEntry[] = vegetables.map((veg) => {
    const cleanName = veg.name.trim() || '不明な野菜';
    const normalized = normalizeVegetableName(cleanName) || cleanName;
    return {
      ...veg,
      name: cleanName,
      normalizedName: normalized,
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
        const label = veg.normalizedName || normalizeVegetableName(veg.name) || veg.name.trim();
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
    for (const veg of rec.vegetables) {
      const key = veg.normalizedName || normalizeVegetableName(veg.name) || veg.name.trim();
      if (!key) continue;
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
