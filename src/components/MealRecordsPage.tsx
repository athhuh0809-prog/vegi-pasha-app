import { useMemo, useState } from 'react';
import { Calendar, Camera, ChevronRight, Leaf, Sprout } from 'lucide-react';
import type { MealRecord, MealType } from '../types/meal';
import {
  formatJapaneseDateHeading,
  getVegetableEncyclopediaSummary,
  groupRecordsByDate,
  MEAL_TYPE_LABELS,
} from '../utils/mealDb';

interface MealRecordsPageProps {
  records: MealRecord[];
  isLoading: boolean;
  loadError: string | null;
  onSelectRecord: (record: MealRecord) => void;
  onGoToAnalyzer: () => void;
}

const FILTER_OPTIONS: Array<{ value: 'all' | MealType; label: string }> = [
  { value: 'all', label: 'すべて' },
  { value: 'breakfast', label: '朝食' },
  { value: 'lunch', label: '昼食' },
  { value: 'dinner', label: '夕食' },
  { value: 'snack', label: '間食' },
];

export function MealRecordsPage({
  records,
  isLoading,
  loadError,
  onSelectRecord,
  onGoToAnalyzer,
}: MealRecordsPageProps) {
  const [mealFilter, setMealFilter] = useState<'all' | MealType>('all');

  const filteredRecords = useMemo(() => {
    if (mealFilter === 'all') return records;
    return records.filter((rec) => rec.mealType === mealFilter);
  }, [records, mealFilter]);

  const dailyGroups = useMemo(
    () => groupRecordsByDate(filteredRecords),
    [filteredRecords],
  );

  const totalUniqueVegetables = useMemo(
    () => getVegetableEncyclopediaSummary(records).length,
    [records],
  );

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-16 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <p className="text-xs sm:text-sm font-medium text-[#2D6A4F]">
            ブラウザ内に自動保存 · 食事の記録
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1F2D24]">
            これまでの食事記録
          </h1>
          <p className="text-xs sm:text-sm text-[#516457] tabular-nums">
            記録した食事 {records.length}件 · 出会った野菜 {totalUniqueVegetables}種類
          </p>
        </div>

        <button
          type="button"
          onClick={onGoToAnalyzer}
          className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#2D6A4F] hover:bg-[#24563F] text-white text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0"
        >
          <Camera className="w-4 h-4" />
          <span>新しい食事を解析する</span>
        </button>
      </div>

      {/* Filter Segmented Bar */}
      {records.length > 0 && (
        <div className="flex items-center gap-1.5 p-1 bg-[#EEF5EC] border border-[#DCE6DA] rounded-2xl w-full sm:w-fit overflow-x-auto">
          {FILTER_OPTIONS.map((opt) => {
            const active = mealFilter === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setMealFilter(opt.value)}
                className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-white text-[#1F2D24] shadow-sm'
                    : 'text-[#516457] hover:text-[#1F2D24]'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Loading / Error / Empty / Daily Groups */}
      {isLoading ? (
        <div className="bg-white rounded-3xl border border-[#DCE6DA] p-8 text-center text-sm text-[#516457]">
          食事記録を読み込んでいます…
        </div>
      ) : loadError ? (
        <div
          role="alert"
          className="bg-[#FDF3EF] rounded-3xl border border-[#E5B8A8] p-6 text-sm text-[#7C2D12]"
        >
          {loadError}
        </div>
      ) : records.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#DCE6DA] p-8 sm:p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#EEF5EC] text-[#2D6A4F] mx-auto flex items-center justify-center">
            <Calendar className="w-7 h-7" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h2 className="font-display text-lg font-bold text-[#1F2D24]">
              まだ食事記録がありません
            </h2>
            <p className="text-sm text-[#516457] leading-relaxed">
              食事の写真を解析したあと、結果の下にある「食事を記録する」ボタンを押すと、ここに日付ごとの記録が保存されます。
            </p>
          </div>
          <button
            type="button"
            onClick={onGoToAnalyzer}
            className="min-h-[48px] px-6 py-3 rounded-2xl bg-[#2D6A4F] hover:bg-[#24563F] text-white text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
          >
            <Camera className="w-4 h-4" />
            <span>写真を解析して記録をはじめる</span>
          </button>
        </div>
      ) : dailyGroups.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#DCE6DA] p-8 text-center space-y-3">
          <p className="text-sm text-[#516457]">
            「{FILTER_OPTIONS.find((o) => o.value === mealFilter)?.label}」の記録はまだありません。
          </p>
          <button
            type="button"
            onClick={() => setMealFilter('all')}
            className="min-h-[44px] px-4 py-2 rounded-xl border border-[#DCE6DA] bg-[#FBF8F1] hover:bg-[#EEF5EC] text-xs font-medium text-[#2D6A4F] transition-colors"
          >
            すべての記録を表示
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {dailyGroups.map((group) => {
            const { label, relativeTag } = formatJapaneseDateHeading(group.date);
            return (
              <section
                key={group.date}
                className="bg-white rounded-3xl border border-[#DCE6DA] overflow-hidden"
              >
                {/* Day Header & Daily Vegetable Summary */}
                <div className="px-5 py-4 sm:px-6 bg-[#F4F8F2] border-b border-[#DCE6DA] space-y-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div className="flex items-baseline gap-2.5">
                      <h2 className="font-display text-lg font-bold text-[#1F2D24] tabular-nums">
                        {label}
                      </h2>
                      {relativeTag && (
                        <span className="text-xs font-semibold text-[#2D6A4F]">
                          {relativeTag}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold text-[#2D6A4F] tabular-nums">
                      <Sprout className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>この日に食べた野菜: {group.vegetableCount}種類</span>
                      <span className="text-[#516457] font-normal" aria-hidden="true">
                        ·
                      </span>
                      <span className="text-[#516457] font-normal">
                        食事 {group.records.length}回
                      </span>
                    </div>
                  </div>

                  {group.uniqueVegetables.length > 0 ? (
                    <p className="text-xs sm:text-sm text-[#3F5145] leading-relaxed">
                      {group.uniqueVegetables.join(' · ')}
                    </p>
                  ) : (
                    <p className="text-xs text-[#516457]">
                      この日は野菜の登録がありません
                    </p>
                  )}
                </div>

                {/* Meals on this date */}
                <div className="divide-y divide-[#E8EFE6]">
                  {group.records.map((rec) => {
                    const timeStr = rec.eatenAt.slice(11, 16) || '';
                    const vegPreview = rec.uniqueVegetableNames.slice(0, 4).join(' · ');
                    const remainingCount = Math.max(0, rec.uniqueVegetableNames.length - 4);

                    return (
                      <button
                        key={rec.id}
                        type="button"
                        onClick={() => onSelectRecord(rec)}
                        className="w-full text-left px-5 py-4 sm:px-6 hover:bg-[#FAFBF8] active:bg-[#F2F6EE] transition-colors flex items-center gap-4 min-h-[72px]"
                      >
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-[#F3EFE4] border border-[#DCE6DA] shrink-0 flex items-center justify-center">
                          {rec.imageDataUrl ? (
                            <img
                              src={rec.imageDataUrl}
                              alt={rec.dishName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Leaf className="w-6 h-6 text-[#2D6A4F]" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#516457] tabular-nums">
                            <span className="font-semibold text-[#2D6A4F]">
                              {MEAL_TYPE_LABELS[rec.mealType]}
                            </span>
                            {timeStr && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span>{timeStr}</span>
                              </>
                            )}
                            <span aria-hidden="true">·</span>
                            <span>野菜 {rec.uniqueVegetableNames.length}種類</span>
                          </div>

                          <h3 className="text-base font-bold text-[#1F2D24] truncate">
                            {rec.dishName}
                          </h3>

                          <p className="text-xs text-[#516457] truncate">
                            {vegPreview || '登録された野菜はありません'}
                            {remainingCount > 0 ? ` ほか${remainingCount}種` : ''}
                          </p>
                        </div>

                        <ChevronRight className="w-5 h-5 text-[#7A8C80] shrink-0" />
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </section>
  );
}
