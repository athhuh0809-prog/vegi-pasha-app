import { ArrowLeft, Calendar, ChefHat, Clock, Sparkles, Utensils, X } from 'lucide-react';
import type { EncyclopediaVegetableStatus } from '../types/meal';
import { MEAL_TYPE_LABELS } from '../utils/mealDb';
import { VegetableIllustration } from './VegetableIllustration';

interface VegetableDetailViewProps {
  entry: EncyclopediaVegetableStatus | null;
  onClose: () => void;
  onSelectMealRecord?: (recordId: string) => void;
}

function formatJapaneseDateTime(dateTimeStr: string | null): string {
  if (!dateTimeStr) return 'まだ記録されていません';
  const [datePart, timePart] = dateTimeStr.split('T');
  const [y, m, d] = datePart.split('-').map(Number);
  if (!y || !m || !d) return dateTimeStr;
  if (timePart) {
    return `${y}年${m}月${d}日 ${timePart.slice(0, 5)}`;
  }
  return `${y}年${m}月${d}日`;
}

export function VegetableDetailView({
  entry,
  onClose,
  onSelectMealRecord,
}: VegetableDetailViewProps) {
  if (!entry) return null;

  const { catalog, eatCount, firstEatenAt, recentMeals } = entry;
  const paddedNo = String(catalog.number).padStart(2, '0');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="veg-detail-title"
      className="fixed inset-0 z-50 bg-[#1F2D24]/45 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full sm:max-w-2xl max-h-[92vh] bg-[#FBF8F1] rounded-t-3xl sm:rounded-3xl border border-[#DCE6DA] shadow-2xl flex flex-col overflow-hidden">
        {/* Top Field-Guide Header */}
        <div className="bg-white border-b border-[#DCE6DA] px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[40px] px-3 py-1.5 rounded-xl border border-[#DCE6DA] bg-[#FBF8F1] hover:bg-[#EEF5EC] text-[#2D6A4F] text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>図鑑にもどる</span>
          </button>

          <p className="text-xs font-semibold text-[#516457] tabular-nums">
            No.{paddedNo} · {catalog.category}
          </p>

          <button
            type="button"
            onClick={onClose}
            aria-label="閉じる"
            className="w-10 h-10 rounded-xl border border-[#DCE6DA] bg-white hover:bg-[#EEF5EC] text-[#516457] flex items-center justify-center transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Hero Card: Illustration + Name + Stats */}
          <div className="bg-white rounded-3xl border border-[#DCE6DA] p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-5">
            <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-3xl bg-[#EEF5EC] border border-[#DCE6DA] flex items-center justify-center shrink-0 p-4">
              <VegetableIllustration
                vegetableId={catalog.id}
                className="w-full h-full"
              />
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2.5 min-w-0">
              <div className="space-y-1">
                <p className="text-xs font-medium text-[#2D6A4F] tabular-nums">
                  やさい図鑑 No.{paddedNo} · {catalog.category}
                </p>
                <h2
                  id="veg-detail-title"
                  className="font-display text-2xl sm:text-3xl font-bold text-[#1F2D24]"
                >
                  {catalog.name}
                </h2>
              </div>

              <p className="text-sm text-[#516457] leading-relaxed">
                {catalog.shortNote}
              </p>
            </div>
          </div>

          {/* 3-Column Fact Strip: 旬の時期 / 初めて食べた日 / 食べた回数 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl border border-[#DCE6DA] p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2D6A4F]">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>旬の時期</span>
              </div>
              <p className="text-sm font-medium text-[#1F2D24] leading-snug">
                {catalog.season}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#DCE6DA] p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2D6A4F]">
                <Calendar className="w-4 h-4 shrink-0" />
                <span>初めて食べた日</span>
              </div>
              <p className="text-sm font-medium text-[#1F2D24] tabular-nums leading-snug">
                {formatJapaneseDateTime(firstEatenAt)}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#DCE6DA] p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2D6A4F]">
                <Clock className="w-4 h-4 shrink-0" />
                <span>食べた回数</span>
              </div>
              <p className="text-xl font-bold text-[#1F2D24] tabular-nums leading-snug">
                {eatCount}
                <span className="text-sm font-medium text-[#516457] ml-1">回</span>
              </p>
            </div>
          </div>

          {/* Main Nutrients & Functions */}
          <section className="bg-white rounded-3xl border border-[#DCE6DA] p-5 space-y-3">
            <h3 className="font-display text-base font-bold text-[#1F2D24]">
              主な栄養素とその働き
            </h3>
            <div className="space-y-2.5">
              {catalog.nutrients.map((nut) => (
                <div
                  key={nut.name}
                  className="rounded-2xl bg-[#FBF8F1] border border-[#DCE6DA] p-3.5 space-y-1"
                >
                  <p className="text-sm font-bold text-[#2D6A4F]">{nut.name}</p>
                  <p className="text-xs sm:text-sm text-[#3F5145] leading-relaxed">
                    {nut.benefit}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Recommended Dishes */}
          <section className="bg-white rounded-3xl border border-[#DCE6DA] p-5 space-y-3">
            <div className="flex items-center gap-2">
              <ChefHat className="w-4 h-4 text-[#2D6A4F] shrink-0" />
              <h3 className="font-display text-base font-bold text-[#1F2D24]">
                {catalog.name}を使ったおすすめ料理
              </h3>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {catalog.recommendedDishes.map((dish, idx) => (
                <li
                  key={dish}
                  className="rounded-2xl bg-[#EEF5EC] border border-[#DCE6DA] p-3.5 text-xs sm:text-sm font-medium text-[#1F2D24] leading-snug flex flex-col gap-1"
                >
                  <span className="text-[11px] font-semibold text-[#2D6A4F] tabular-nums">
                    おすすめ {idx + 1}
                  </span>
                  <span>{dish}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Meals Where This Vegetable Was Recorded */}
          {recentMeals.length > 0 && (
            <section className="bg-white rounded-3xl border border-[#DCE6DA] p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-[#2D6A4F] shrink-0" />
                  <h3 className="font-display text-base font-bold text-[#1F2D24]">
                    この野菜を食べた食事記録
                  </h3>
                </div>
                <span className="text-xs text-[#516457] tabular-nums">
                  {recentMeals.length}件
                </span>
              </div>

              <div className="space-y-2">
                {recentMeals.slice(0, 6).map((meal) => (
                  <button
                    key={meal.recordId}
                    type="button"
                    onClick={() => {
                      if (onSelectMealRecord) {
                        onClose();
                        onSelectMealRecord(meal.recordId);
                      }
                    }}
                    className="w-full text-left rounded-2xl border border-[#DCE6DA] bg-[#FBF8F1] hover:bg-[#EEF5EC] px-4 py-3 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#1F2D24] truncate">
                        {meal.dishName}
                      </p>
                      <p className="text-xs text-[#516457] tabular-nums">
                        {formatJapaneseDateTime(meal.eatenAt)} · {MEAL_TYPE_LABELS[meal.mealType]}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-[#2D6A4F] whitespace-nowrap shrink-0">
                      記録を見る
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
