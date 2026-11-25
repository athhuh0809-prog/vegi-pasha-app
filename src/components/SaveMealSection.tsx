import { useEffect, useState } from 'react';
import { BookOpen, BookmarkCheck, Calendar, Check, Loader2, NotebookPen, Sparkles, Sprout } from 'lucide-react';
import type { MealType, SessionAnalysisEntry } from '../types/meal';
import {
  getDefaultMealTypeByHour,
  MEAL_TYPE_LABELS,
  toLocalDateTimeInputValue,
} from '../utils/mealDb';

export interface SaveMealOutcome {
  newlyUnlockedNames: string[];
  expGained: number;
  cappedByDailyLimit: boolean;
  leveledUpTo: number | null;
  characterName: string;
}

interface SaveMealSectionProps {
  entry: SessionAnalysisEntry;
  onSave: (payload: {
    dishName: string;
    mealType: MealType;
    eatenAt: string;
  }) => Promise<SaveMealOutcome>;
  onUpdateExisting: (payload: {
    recordId: string;
    dishName: string;
    mealType: MealType;
    eatenAt: string;
  }) => Promise<void>;
  onGoToRecords: () => void;
  onGoToEncyclopedia: () => void;
  onGoToCharacter: () => void;
  existingRecord?: {
    id: string;
    dishName: string;
    mealType: MealType;
    eatenAt: string;
  } | null;
}

const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

export function SaveMealSection({
  entry,
  onSave,
  onUpdateExisting,
  onGoToRecords,
  onGoToEncyclopedia,
  onGoToCharacter,
  existingRecord,
}: SaveMealSectionProps) {
  const defaultDishName =
    entry.editedResult.dishName?.trim() ||
    entry.editedResult.dishSummary.slice(0, 20) ||
    '今日の食事';

  const [dishName, setDishName] = useState(existingRecord?.dishName ?? defaultDishName);
  const [mealType, setMealType] = useState<MealType>(
    existingRecord?.mealType ?? getDefaultMealTypeByHour(),
  );
  const [eatenAt, setEatenAt] = useState<string>(
    existingRecord?.eatenAt ?? toLocalDateTimeInputValue(),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [justUpdated, setJustUpdated] = useState(false);
  const [saveOutcome, setSaveOutcome] = useState<SaveMealOutcome | null>(null);

  useEffect(() => {
    setDishName(existingRecord?.dishName ?? defaultDishName);
    setMealType(existingRecord?.mealType ?? getDefaultMealTypeByHour());
    setEatenAt(existingRecord?.eatenAt ?? toLocalDateTimeInputValue());
    setSaveError(null);
    setJustUpdated(false);
    setSaveOutcome(null);
  }, [entry.id, existingRecord?.id]);

  const totalNutrients = entry.editedResult.vegetables.reduce(
    (sum, veg) => sum + veg.nutrients.length,
    0,
  );

  const isSaved = Boolean(entry.savedRecordId || existingRecord?.id);
  const recordId = entry.savedRecordId ?? existingRecord?.id ?? null;
  const hasMetadataChanged = Boolean(
    existingRecord &&
      (dishName.trim() !== existingRecord.dishName ||
        mealType !== existingRecord.mealType ||
        eatenAt !== existingRecord.eatenAt),
  );
  const needsUpdate = Boolean(
    isSaved && (entry.hasUnsavedEditsAfterSave || hasMetadataChanged),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    const cleanDishName = dishName.trim() || defaultDishName;
    const cleanEatenAt = eatenAt || toLocalDateTimeInputValue();

    setIsSaving(true);
    setSaveError(null);
    setJustUpdated(false);

    try {
      if (isSaved && recordId) {
        if (!needsUpdate) return;
        await onUpdateExisting({
          recordId,
          dishName: cleanDishName,
          mealType,
          eatenAt: cleanEatenAt,
        });
        setJustUpdated(true);
      } else {
        const outcome = await onSave({
          dishName: cleanDishName,
          mealType,
          eatenAt: cleanEatenAt,
        });
        setSaveOutcome(outcome);
      }
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : '食事記録の保存中にエラーが発生しました。',
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section
      aria-label="食事を記録する"
      className="bg-white rounded-3xl border border-[#DCE6DA] p-5 sm:p-6 space-y-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="space-y-0.5">
          <h3 className="font-display text-lg font-bold text-[#1F2D24]">
            この食事を記録に残す
          </h3>
          <p className="text-xs text-[#516457] tabular-nums">
            内容を確認・修正したあと保存できます · 野菜 {entry.editedResult.vegetables.length}種類 · 栄養素 {totalNutrients}項目
          </p>
        </div>

        {isSaved && !needsUpdate && (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2D6A4F]">
            <BookmarkCheck className="w-4 h-4" />
            <span>記録済み</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label
              htmlFor={`dish-name-${entry.id}`}
              className="block text-xs font-medium text-[#516457] mb-1.5"
            >
              料理名
            </label>
            <input
              id={`dish-name-${entry.id}`}
              type="text"
              value={dishName}
              onChange={(e) => {
                setDishName(e.target.value);
                setJustUpdated(false);
              }}
              placeholder="例：彩り野菜ボウル"
              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#DCE6DA] bg-[#FBF8F1] text-sm text-[#1F2D24] focus:outline-none focus:border-[#2D6A4F]"
            />
          </div>

          <div>
            <label
              htmlFor={`eaten-at-${entry.id}`}
              className="block text-xs font-medium text-[#516457] mb-1.5"
            >
              食べた日時
            </label>
            <div className="relative">
              <input
                id={`eaten-at-${entry.id}`}
                type="datetime-local"
                value={eatenAt}
                onChange={(e) => {
                  setEatenAt(e.target.value);
                  setJustUpdated(false);
                }}
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#DCE6DA] bg-[#FBF8F1] text-sm text-[#1F2D24] tabular-nums focus:outline-none focus:border-[#2D6A4F]"
              />
            </div>
          </div>
        </div>

        <div>
          <span className="block text-xs font-medium text-[#516457] mb-1.5">
            食事の区分
          </span>
          <div className="grid grid-cols-4 gap-2">
            {MEAL_TYPES.map((type) => {
              const active = mealType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setMealType(type);
                    setJustUpdated(false);
                  }}
                  className={`min-h-[44px] px-2 py-2 rounded-xl border text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-[#2D6A4F] border-[#2D6A4F] text-white'
                      : 'bg-[#FBF8F1] border-[#DCE6DA] text-[#516457] hover:bg-[#EEF5EC]'
                  }`}
                >
                  {MEAL_TYPE_LABELS[type]}
                </button>
              );
            })}
          </div>
        </div>

        {saveError && (
          <p role="alert" className="text-xs text-[#9A3412] bg-[#FDF3EF] border border-[#E5B8A8] rounded-xl px-3.5 py-2.5">
            {saveError}
          </p>
        )}

        {isSaved && !needsUpdate ? (
          <div className="rounded-2xl bg-[#EEF5EC] border border-[#DCE6DA] p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-[#1F2D24]">
                <Check className="w-4 h-4 text-[#2D6A4F] shrink-0 mt-0.5" />
                <span>
                  {justUpdated
                    ? '修正内容で食事記録を更新し、図鑑・キャラクター育成にも反映しました。'
                    : 'この解析結果はブラウザ内に保存済みです（重複保存はされません）。'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={onGoToCharacter}
                  className="min-h-[44px] px-3.5 py-2 rounded-xl border border-[#DCE6DA] bg-white hover:bg-[#FBF8F1] text-[#2D6A4F] text-xs sm:text-sm font-medium inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                >
                  <Sprout className="w-4 h-4" />
                  <span>育成を見る</span>
                </button>
                <button
                  type="button"
                  onClick={onGoToEncyclopedia}
                  className="min-h-[44px] px-3.5 py-2 rounded-xl border border-[#DCE6DA] bg-white hover:bg-[#FBF8F1] text-[#2D6A4F] text-xs sm:text-sm font-medium inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>野菜図鑑</span>
                </button>
                <button
                  type="button"
                  onClick={onGoToRecords}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-[#2D6A4F] hover:bg-[#24563F] text-white text-xs sm:text-sm font-medium inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                >
                  <Calendar className="w-4 h-4" />
                  <span>食事記録を見る</span>
                </button>
              </div>
            </div>

            {saveOutcome && (saveOutcome.expGained > 0 || saveOutcome.cappedByDailyLimit) && (
              <div className="rounded-xl bg-white border border-[#DCE6DA] px-3.5 py-2.5 flex items-center gap-2 text-xs sm:text-sm text-[#1F2D24]">
                <Sprout className="w-4 h-4 text-[#2D6A4F] shrink-0" />
                <span className="tabular-nums">
                  {saveOutcome.expGained > 0 ? (
                    <>
                      {saveOutcome.characterName}が{' '}
                      <strong className="font-bold text-[#2D6A4F]">
                        +{saveOutcome.expGained} EXP
                      </strong>{' '}
                      獲得しました！
                      {saveOutcome.leveledUpTo ? `（Lv.${saveOutcome.leveledUpTo} にレベルアップ！）` : ''}
                      {saveOutcome.cappedByDailyLimit ? ' ※1日の上限に到達' : ''}
                    </>
                  ) : (
                    `${saveOutcome.characterName}は本日分の経験値上限に達しています（食事記録・図鑑には反映されました）。`
                  )}
                </span>
              </div>
            )}

            {saveOutcome && saveOutcome.newlyUnlockedNames.length > 0 && (
              <div className="rounded-xl bg-white border border-[#DCE6DA] px-3.5 py-2.5 flex items-center gap-2 text-xs sm:text-sm text-[#1F2D24]">
                <Sparkles className="w-4 h-4 text-[#D97706] shrink-0" />
                <span>
                  野菜図鑑に新しく登録されました：
                  <strong className="font-bold text-[#2D6A4F] ml-1">
                    {saveOutcome.newlyUnlockedNames.join('・')}
                  </strong>
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 min-h-[48px] px-5 py-3 rounded-2xl bg-[#2D6A4F] hover:bg-[#24563F] disabled:opacity-60 text-white text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <NotebookPen className="w-4 h-4" />
              )}
              <span>
                {isSaved ? '修正内容でこの記録を更新する' : '食事を記録する'}
              </span>
            </button>

            {isSaved && (
              <button
                type="button"
                onClick={onGoToRecords}
                className="min-h-[48px] px-4 py-3 rounded-2xl border border-[#DCE6DA] bg-white hover:bg-[#EEF5EC] text-[#2D6A4F] text-sm font-medium inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <Calendar className="w-4 h-4" />
                <span>記録ページへ</span>
              </button>
            )}
          </div>
        )}
      </form>
    </section>
  );
}
