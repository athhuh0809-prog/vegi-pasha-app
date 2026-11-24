import { useEffect, useState } from 'react';
import { Check, Edit3, Info, Loader2, Trash2, X } from 'lucide-react';
import type { MealRecord, MealType, VegetableItem } from '../types/meal';
import {
  deriveMetadataForRecord,
  formatJapaneseDateHeading,
  MEAL_TYPE_LABELS,
} from '../utils/mealDb';
import { AddVegetableForm } from './AddVegetableForm';
import { VegetableCard } from './VegetableCard';

interface MealRecordDetailModalProps {
  record: MealRecord | null;
  onClose: () => void;
  onUpdateRecord: (updated: MealRecord) => Promise<void>;
  onDeleteRecord: (id: string) => Promise<void>;
}

const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

export function MealRecordDetailModal({
  record,
  onClose,
  onUpdateRecord,
  onDeleteRecord,
}: MealRecordDetailModalProps) {
  const [isEditingMeta, setIsEditingMeta] = useState(false);
  const [draftDishName, setDraftDishName] = useState('');
  const [draftMealType, setDraftMealType] = useState<MealType>('lunch');
  const [draftEatenAt, setDraftEatenAt] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (!record) return;
    setDraftDishName(record.dishName);
    setDraftMealType(record.mealType);
    setDraftEatenAt(record.eatenAt);
    setIsEditingMeta(false);
    setConfirmingDelete(false);
    setActionError(null);
  }, [record?.id]);

  if (!record) {
    return null;
  }

  const { label: dateLabel } = formatJapaneseDateHeading(record.eatenDate);
  const timeLabel = record.eatenAt.slice(11, 16);

  const persistVegetables = async (nextVegetables: VegetableItem[]) => {
    setIsBusy(true);
    setActionError(null);
    try {
      const { savedVegetables, uniqueVegetableNames, nutrientNames } =
        deriveMetadataForRecord(nextVegetables);

      await onUpdateRecord({
        ...record,
        vegetables: savedVegetables,
        uniqueVegetableNames,
        nutrientNames,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : '記録の更新に失敗しました。',
      );
    } finally {
      setIsBusy(false);
    }
  };

  const handleSaveMeta = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBusy(true);
    setActionError(null);
    try {
      const cleanName = draftDishName.trim() || record.dishName;
      const cleanEatenAt = draftEatenAt || record.eatenAt;
      await onUpdateRecord({
        ...record,
        dishName: cleanName,
        mealType: draftMealType,
        eatenAt: cleanEatenAt,
        eatenDate: cleanEatenAt.slice(0, 10),
        updatedAt: new Date().toISOString(),
      });
      setIsEditingMeta(false);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : '基本情報の更新に失敗しました。',
      );
    } finally {
      setIsBusy(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsBusy(true);
    setActionError(null);
    try {
      await onDeleteRecord(record.id);
      onClose();
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : '記録の削除に失敗しました。',
      );
      setIsBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#1F2D24]/60 backdrop-blur-sm p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${record.dishName}の記録詳細`}
    >
      <div className="w-full sm:max-w-3xl bg-[#FBF8F1] rounded-t-3xl sm:rounded-3xl border border-[#DCE6DA] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between gap-4 px-5 py-4 bg-white border-b border-[#DCE6DA]">
          <div className="min-w-0">
            <p className="text-xs text-[#516457] tabular-nums">
              {dateLabel} {timeLabel} · {MEAL_TYPE_LABELS[record.mealType]}
            </p>
            <h2 className="font-display text-lg font-bold text-[#1F2D24] truncate">
              {record.dishName}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl text-[#516457] hover:bg-[#EEF5EC] transition-colors shrink-0"
            aria-label="閉じる"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {actionError && (
            <div
              role="alert"
              className="rounded-2xl border border-[#E5B8A8] bg-[#FDF3EF] p-4 text-xs sm:text-sm text-[#7C2D12]"
            >
              {actionError}
            </div>
          )}

          {/* Photo + Meta Section */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start bg-white rounded-2xl border border-[#DCE6DA] p-4">
            <div className="sm:col-span-5 rounded-xl overflow-hidden bg-[#F3EFE4] aspect-[4/3]">
              <img
                src={record.imageDataUrl}
                alt={record.dishName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="sm:col-span-7 space-y-3">
              {isEditingMeta ? (
                <form onSubmit={handleSaveMeta} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-[#516457] mb-1">
                      料理名
                    </label>
                    <input
                      type="text"
                      value={draftDishName}
                      onChange={(e) => setDraftDishName(e.target.value)}
                      className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-[#DCE6DA] bg-[#FBF8F1] text-sm text-[#1F2D24] focus:outline-none focus:border-[#2D6A4F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#516457] mb-1">
                      食べた日時
                    </label>
                    <input
                      type="datetime-local"
                      value={draftEatenAt}
                      onChange={(e) => setDraftEatenAt(e.target.value)}
                      className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-[#DCE6DA] bg-[#FBF8F1] text-sm text-[#1F2D24] tabular-nums focus:outline-none focus:border-[#2D6A4F]"
                    />
                  </div>

                  <div>
                    <span className="block text-xs font-medium text-[#516457] mb-1">
                      食事区分
                    </span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {MEAL_TYPES.map((type) => {
                        const active = draftMealType === type;
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setDraftMealType(type)}
                            className={`min-h-[40px] px-2 py-1.5 rounded-xl border text-xs font-medium transition-colors whitespace-nowrap ${
                              active
                                ? 'bg-[#2D6A4F] border-[#2D6A4F] text-white'
                                : 'bg-[#FBF8F1] border-[#DCE6DA] text-[#516457]'
                            }`}
                          >
                            {MEAL_TYPE_LABELS[type]}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsEditingMeta(false)}
                      className="min-h-[40px] px-3.5 py-1.5 rounded-xl border border-[#DCE6DA] text-xs font-medium text-[#516457]"
                    >
                      キャンセル
                    </button>
                    <button
                      type="submit"
                      disabled={isBusy}
                      className="min-h-[40px] px-4 py-1.5 rounded-xl bg-[#2D6A4F] text-white text-xs font-medium inline-flex items-center gap-1.5"
                    >
                      {isBusy ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                      <span>保存</span>
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-[#2D6A4F] tabular-nums">
                        {MEAL_TYPE_LABELS[record.mealType]} · {dateLabel} {timeLabel}
                      </p>
                      <h3 className="text-lg font-bold text-[#1F2D24]">
                        {record.dishName}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEditingMeta(true)}
                      className="min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-medium text-[#2D6A4F] hover:bg-[#EEF5EC] inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>日時・料理名を編集</span>
                    </button>
                  </div>

                  <p className="text-sm text-[#516457] leading-relaxed">
                    {record.dishSummary}
                  </p>

                  <p className="text-xs text-[#516457] tabular-nums">
                    野菜 {record.uniqueVegetableNames.length}種類 · 栄養素 {record.nutrientNames.length}項目
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Non-definitive Notice */}
          <div className="rounded-2xl border border-[#DCE6DA] bg-[#F2F6EE] p-3.5 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#2D6A4F] shrink-0 mt-0.5" />
            <p className="text-xs text-[#384B3E] leading-relaxed">
              {record.cautionNote}
            </p>
          </div>

          {/* Editable Vegetables List */}
          <div className="space-y-3">
            <h3 className="font-display text-base font-bold text-[#1F2D24]">
              記録された野菜と栄養素（編集・追加ができます）
            </h3>

            {record.vegetables.length > 0 ? (
              <div className="space-y-3">
                {record.vegetables.map((veg) => (
                  <VegetableCard
                    key={veg.id}
                    vegetable={veg}
                    onUpdate={(updatedVeg) =>
                      persistVegetables(
                        record.vegetables.map((v) =>
                          v.id === updatedVeg.id ? updatedVeg : v,
                        ),
                      )
                    }
                    onDelete={(vegId) =>
                      persistVegetables(record.vegetables.filter((v) => v.id !== vegId))
                    }
                  />
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#516457] bg-white rounded-2xl border border-[#DCE6DA] p-4">
                この記録には野菜が登録されていません。下のボタンから追加できます。
              </p>
            )}

            <AddVegetableForm
              onAdd={(newVeg) => persistVegetables([...record.vegetables, newVeg])}
            />
          </div>

          {/* Delete Record Section */}
          <div className="pt-2 border-t border-[#DCE6DA] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {confirmingDelete ? (
              <div className="w-full rounded-2xl bg-[#FDF3EF] border border-[#E5B8A8] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-xs sm:text-sm font-medium text-[#7C2D12]">
                  この食事記録を削除しますか？元に戻せません。
                </p>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setConfirmingDelete(false)}
                    disabled={isBusy}
                    className="min-h-[40px] px-3.5 py-1.5 rounded-xl border border-[#DCE6DA] bg-white text-xs font-medium text-[#516457]"
                  >
                    キャンセル
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteConfirm}
                    disabled={isBusy}
                    className="min-h-[40px] px-4 py-1.5 rounded-xl bg-[#9A3412] hover:bg-[#7C2D12] text-white text-xs font-medium inline-flex items-center gap-1.5"
                  >
                    {isBusy ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                    <span>削除を確定</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(true)}
                  className="min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-[#7C4A3A] hover:bg-[#FDECE8] inline-flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>この食事記録を削除</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="min-h-[44px] px-5 py-2 rounded-xl bg-[#2D6A4F] hover:bg-[#24563F] text-white text-sm font-medium transition-colors"
                >
                  閉じる
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
