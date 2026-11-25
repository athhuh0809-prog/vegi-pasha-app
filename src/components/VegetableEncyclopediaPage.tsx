import { useMemo, useState } from 'react';
import { BookOpen, Camera, Lock, Sparkles } from 'lucide-react';
import type { VegetableCatalogEntry } from '../data/vegetableCatalog';
import type { EncyclopediaData, EncyclopediaVegetableStatus } from '../types/meal';
import { VegetableIllustration } from './VegetableIllustration';

interface VegetableEncyclopediaPageProps {
  data: EncyclopediaData;
  isLoading: boolean;
  onSelectVegetable: (entry: EncyclopediaVegetableStatus) => void;
  onGoToAnalyzer: () => void;
}

type UnlockFilter = 'all' | 'unlocked' | 'locked';
type CategoryFilter = 'all' | VegetableCatalogEntry['category'];

const UNLOCK_FILTERS: Array<{ value: UnlockFilter; label: string }> = [
  { value: 'all', label: 'すべて' },
  { value: 'unlocked', label: '見つけた' },
  { value: 'locked', label: 'まだ' },
];

const CATEGORY_FILTERS: Array<{ value: CategoryFilter; label: string }> = [
  { value: 'all', label: '全タイプ' },
  { value: '葉物・茎', label: '葉物・茎' },
  { value: '実もの', label: '実もの' },
  { value: '根菜', label: '根菜' },
  { value: '豆・その他', label: '豆・その他' },
];

export function VegetableEncyclopediaPage({
  data,
  isLoading,
  onSelectVegetable,
  onGoToAnalyzer,
}: VegetableEncyclopediaPageProps) {
  const [unlockFilter, setUnlockFilter] = useState<UnlockFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [lockedHintNo, setLockedHintNo] = useState<number | null>(null);

  const filteredEntries = useMemo(() => {
    return data.entries.filter((entry) => {
      if (unlockFilter === 'unlocked' && !entry.isUnlocked) return false;
      if (unlockFilter === 'locked' && entry.isUnlocked) return false;
      if (categoryFilter !== 'all' && entry.catalog.category !== categoryFilter) return false;
      return true;
    });
  }, [data.entries, unlockFilter, categoryFilter]);

  const totalMealsCounted = useMemo(
    () => data.entries.reduce((sum, entry) => sum + entry.eatCount, 0),
    [data.entries],
  );

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-16 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <p className="text-xs sm:text-sm font-medium text-[#2D6A4F]">
            食事記録と連動 · コレクション
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1F2D24]">
            ベジぱしゃ野菜図鑑
          </h1>
          <p className="text-xs sm:text-sm text-[#516457]">
            解析した食事を「記録」に保存すると、食べた野菜が図鑑に仲間入りします。
          </p>
        </div>

        <button
          type="button"
          onClick={onGoToAnalyzer}
          className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#2D6A4F] hover:bg-[#24563F] text-white text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0"
        >
          <Camera className="w-4 h-4" />
          <span>食事を記録して集める</span>
        </button>
      </div>

      {/* Encyclopedia Achievement Summary Card */}
      <div className="bg-white rounded-3xl border border-[#DCE6DA] p-5 sm:p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          <div className="md:col-span-7 space-y-2.5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#EEF5EC] border border-[#DCE6DA] text-[#2D6A4F] flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-[#516457]">図鑑の達成状況</p>
                  <p className="font-display text-lg sm:text-xl font-bold text-[#1F2D24] tabular-nums">
                    獲得した野菜 {data.unlockedCount} / {data.totalCount}種類
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs font-medium text-[#516457]">達成率</p>
                <p className="font-display text-2xl sm:text-3xl font-bold text-[#2D6A4F] tabular-nums">
                  {data.completionRate}%
                </p>
              </div>
            </div>

            {/* Smooth Game Progress Bar */}
            <div
              role="progressbar"
              aria-valuenow={data.completionRate}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="野菜図鑑の達成率"
              className="w-full h-3.5 rounded-xl bg-[#EEF5EC] border border-[#DCE6DA] overflow-hidden p-0.5"
            >
              <div
                className="h-full rounded-lg bg-[#2D6A4F] transition-all duration-500"
                style={{ width: `${Math.max(data.unlockedCount > 0 ? 3 : 0, data.completionRate)}%` }}
              />
            </div>

            <p className="text-xs text-[#516457] tabular-nums">
              {data.unlockedCount === 0
                ? 'まだ図鑑に登録された野菜がありません。食事を解析して「食事を記録する」を押すと登録されます。'
                : data.unlockedCount === data.totalCount
                  ? '全32種類の野菜をコンプリートしました！素晴らしい食生活です。'
                  : `コンプリートまであと ${data.totalCount - data.unlockedCount}種類 · のべ記録回数 ${totalMealsCounted}回`}
            </p>
          </div>

          <div className="md:col-span-5 grid grid-cols-3 gap-2.5">
            <div className="rounded-2xl bg-[#FBF8F1] border border-[#DCE6DA] p-3 text-center space-y-0.5">
              <p className="text-[11px] font-medium text-[#516457]">見つけた</p>
              <p className="font-display text-xl font-bold text-[#2D6A4F] tabular-nums">
                {data.unlockedCount}
              </p>
            </div>
            <div className="rounded-2xl bg-[#FBF8F1] border border-[#DCE6DA] p-3 text-center space-y-0.5">
              <p className="text-[11px] font-medium text-[#516457]">未発見</p>
              <p className="font-display text-xl font-bold text-[#516457] tabular-nums">
                {data.totalCount - data.unlockedCount}
              </p>
            </div>
            <div className="rounded-2xl bg-[#FBF8F1] border border-[#DCE6DA] p-3 text-center space-y-0.5">
              <p className="text-[11px] font-medium text-[#516457]">NEW！</p>
              <p
                className={`font-display text-xl font-bold tabular-nums ${
                  data.newCount > 0 ? 'text-[#D97706]' : 'text-[#516457]'
                }`}
              >
                {data.newCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-[#EEF5EC] border border-[#DCE6DA] rounded-2xl w-full sm:w-fit overflow-x-auto">
          {UNLOCK_FILTERS.map((opt) => {
            const active = unlockFilter === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setUnlockFilter(opt.value)}
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

        <div className="flex items-center gap-1.5 p-1 bg-white border border-[#DCE6DA] rounded-2xl w-full sm:w-fit overflow-x-auto">
          {CATEGORY_FILTERS.map((opt) => {
            const active = categoryFilter === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setCategoryFilter(opt.value)}
                className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-[#2D6A4F] text-white'
                    : 'text-[#516457] hover:bg-[#EEF5EC]'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Gentle Locked Hint Banner when user taps a ??? card */}
      {lockedHintNo !== null && (
        <div
          role="status"
          className="rounded-2xl bg-[#EEF5EC] border border-[#DCE6DA] px-4 py-3 flex items-center justify-between gap-3 text-xs sm:text-sm text-[#1F2D24]"
        >
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#2D6A4F] shrink-0" />
            <span>
              No.{String(lockedHintNo).padStart(2, '0')} はまだ食べていない野菜です。この野菜が入った食事を記録すると図鑑が開きます！
            </span>
          </div>
          <button
            type="button"
            onClick={() => setLockedHintNo(null)}
            className="text-xs font-medium text-[#2D6A4F] hover:underline whitespace-nowrap shrink-0"
          >
            閉じる
          </button>
        </div>
      )}

      {/* Vegetable Grid */}
      {isLoading ? (
        <div className="bg-white rounded-3xl border border-[#DCE6DA] p-12 text-center text-sm text-[#516457]">
          野菜図鑑を読み込んでいます…
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#DCE6DA] p-10 text-center space-y-3">
          <p className="text-sm font-semibold text-[#1F2D24]">
            条件に合う野菜が見つかりませんでした
          </p>
          <p className="text-xs sm:text-sm text-[#516457]">
            フィルターを「すべて」に戻すか、新しい食事を記録して野菜を集めましょう。
          </p>
          <button
            type="button"
            onClick={() => {
              setUnlockFilter('all');
              setCategoryFilter('all');
            }}
            className="min-h-[40px] px-4 py-2 rounded-xl border border-[#DCE6DA] bg-[#FBF8F1] hover:bg-[#EEF5EC] text-xs font-medium text-[#2D6A4F]"
          >
            すべて表示する
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {filteredEntries.map((entry) => {
            const { catalog, isUnlocked, isNew, eatCount } = entry;
            const paddedNo = String(catalog.number).padStart(2, '0');

            if (!isUnlocked) {
              return (
                <button
                  key={catalog.id}
                  type="button"
                  onClick={() => setLockedHintNo(catalog.number)}
                  className="group text-left rounded-3xl border border-[#DCE6DA] bg-[#F3EFE4]/80 hover:bg-[#EFECE1] p-3.5 sm:p-4 flex flex-col justify-between gap-3 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-[#6E7E72] tabular-nums">
                      No.{paddedNo}
                    </span>
                    <Lock className="w-3.5 h-3.5 text-[#8A9A8D]" />
                  </div>

                  <div className="aspect-square w-full rounded-2xl bg-[#E6EBE2] border border-[#DCE6DA]/80 flex items-center justify-center p-4">
                    <VegetableIllustration
                      vegetableId={catalog.id}
                      silhouette
                      className="w-full h-full opacity-85"
                    />
                  </div>

                  <div className="space-y-0.5">
                    <p className="font-display text-base font-bold text-[#6E7E72] tracking-wider">
                      ？？？
                    </p>
                    <p className="text-[11px] text-[#7D8C80]">まだ食べていません</p>
                  </div>
                </button>
              );
            }

            return (
              <button
                key={catalog.id}
                type="button"
                onClick={() => {
                  setLockedHintNo(null);
                  onSelectVegetable(entry);
                }}
                className="group text-left rounded-3xl border border-[#DCE6DA] bg-white hover:border-[#2D6A4F] hover:shadow-md p-3.5 sm:p-4 flex flex-col justify-between gap-3 transition-all relative"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-[#516457] tabular-nums">
                    No.{paddedNo}
                  </span>

                  {isNew ? (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-[#D97706] text-white text-[10px] font-bold tracking-wide leading-none">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>NEW！</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-[#516457]">
                      {catalog.category}
                    </span>
                  )}
                </div>

                <div className="aspect-square w-full rounded-2xl bg-[#EEF5EC] group-hover:bg-[#E4F0E2] border border-[#DCE6DA] flex items-center justify-center p-3.5 transition-colors">
                  <VegetableIllustration
                    vegetableId={catalog.id}
                    className="w-full h-full group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="space-y-0.5">
                  <p className="font-display text-base font-bold text-[#1F2D24] truncate">
                    {catalog.name}
                  </p>
                  <p className="text-xs text-[#2D6A4F] font-medium tabular-nums">
                    食べた回数: {eatCount}回
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
