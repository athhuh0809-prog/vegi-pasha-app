import { useState } from 'react';
import {
  Check,
  Edit3,
  HelpCircle,
  Loader2,
  Plus,
  Search,
  Sprout,
  Trash2,
  Wand2,
  X,
} from 'lucide-react';
import type { ConfidenceLevel, NutrientInfo, VegetableItem } from '../types/meal';

interface VegetableCardProps {
  vegetable: VegetableItem;
  onUpdate: (updated: VegetableItem) => void;
  onDelete: (id: string) => void;
}

const CONFIDENCE_OPTIONS: Array<{
  value: ConfidenceLevel;
  label: string;
  helper: string;
}> = [
  { value: 'confirmed', label: '確認済み', helper: '見た目からはっきり分かる野菜' },
  { value: 'estimated', label: '推定', helper: '形や色から推測した野菜' },
  { value: 'unknown', label: '不明', helper: '特定がむずかしい野菜' },
];

export function VegetableCard({ vegetable, onUpdate, onDelete }: VegetableCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(vegetable.name);
  const [draftConfidence, setDraftConfidence] = useState<ConfidenceLevel>(vegetable.confidence);
  const [draftReason, setDraftReason] = useState(vegetable.uncertaintyReason ?? '');
  const [draftNutrients, setDraftNutrients] = useState<NutrientInfo[]>(vegetable.nutrients);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestError, setSuggestError] = useState<string | null>(null);

  const openEditor = () => {
    setDraftName(vegetable.name);
    setDraftConfidence(vegetable.confidence);
    setDraftReason(vegetable.uncertaintyReason ?? '');
    setDraftNutrients(
      vegetable.nutrients.length > 0
        ? vegetable.nutrients.map((n) => ({ ...n }))
        : [{ id: `nut-new-${Date.now()}`, name: '', benefit: '' }],
    );
    setSuggestError(null);
    setIsEditing(true);
  };

  const handleSave = () => {
    const trimmedName = draftName.trim() || '不明な野菜';
    const cleanedNutrients = draftNutrients
      .filter((n) => n.name.trim().length > 0)
      .map((n) => ({
        ...n,
        name: n.name.trim(),
        benefit: n.benefit.trim() || '日々の体調を整えるサポートに役立つとされています。',
      }));

    onUpdate({
      ...vegetable,
      name: trimmedName,
      confidence: draftConfidence,
      uncertaintyReason: draftConfidence === 'confirmed' ? undefined : draftReason.trim() || undefined,
      nutrients: cleanedNutrients,
      isUserEdited: true,
    });
    setIsEditing(false);
  };

  const handleSuggestNutrients = async () => {
    const targetName = draftName.trim();
    if (!targetName) {
      setSuggestError('先に野菜の名前を入力してください。');
      return;
    }

    setIsSuggesting(true);
    setSuggestError(null);
    try {
      const res = await fetch('/api/vegetable-nutrients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vegetableName: targetName }),
      });
      const rawText = await res.text();
      let data: {
        nutrients?: NutrientInfo[];
        error?: string;
        errorCode?: string;
        rawDetail?: string;
      } = {};
      try {
        data = JSON.parse(rawText);
      } catch {
        data = { error: `サーバーから予期しない応答が返りました（HTTP ${res.status}）。` };
      }
      if (!res.ok) {
        const detailParts = [
          data.error || `栄養素の取得に失敗しました（HTTP ${res.status}）`,
          data.errorCode ? `[${data.errorCode}]` : '',
          data.rawDetail ? `詳細: ${data.rawDetail}` : '',
        ].filter(Boolean);
        throw new Error(detailParts.join(' '));
      }
      if (data.nutrients && data.nutrients.length > 0) {
        setDraftNutrients(data.nutrients);
      } else {
        setSuggestError('栄養素の候補が見つかりませんでした。手動で入力できます。');
      }
    } catch (err) {
      setSuggestError(
        err instanceof Error ? err.message : '通信エラーにより栄養素の提案を取得できませんでした。',
      );
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleAddNutrientRow = () => {
    setDraftNutrients((prev) => [
      ...prev,
      { id: `nut-edit-${Date.now()}-${prev.length}`, name: '', benefit: '' },
    ]);
  };

  const handleRemoveNutrientRow = (id: string) => {
    setDraftNutrients((prev) => prev.filter((item) => item.id !== id));
  };

  const handleNutrientChange = (id: string, field: 'name' | 'benefit', value: string) => {
    setDraftNutrients((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const renderConfidenceMeta = (confidence: ConfidenceLevel) => {
    if (confidence === 'confirmed') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2D6A4F]">
          <Sprout className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>確認済み</span>
        </span>
      );
    }
    if (confidence === 'estimated') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#9A5B13]">
          <HelpCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>推定</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#7C4A3A]">
        <Search className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span>不明</span>
      </span>
    );
  };

  if (isEditing) {
    return (
      <article className="bg-white rounded-2xl border border-[#2D6A4F]/40 p-5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-bold text-[#1F2D24]">解析結果を修正する</h3>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl text-[#516457] hover:bg-[#EEF5EC] transition-colors"
            aria-label="編集を閉じる"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-[#516457] mb-1.5">
              野菜の名前（日本語）
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                placeholder="例：ブロッコリー、小松菜"
                className="flex-1 min-h-[44px] px-3.5 py-2 rounded-xl border border-[#DCE6DA] bg-[#FBF8F1] text-sm text-[#1F2D24] focus:outline-none focus:border-[#2D6A4F]"
              />
              <button
                type="button"
                onClick={handleSuggestNutrients}
                disabled={isSuggesting}
                className="min-h-[44px] px-4 py-2 rounded-xl border border-[#DCE6DA] bg-[#EEF5EC] hover:bg-[#E1EFE0] text-[#2D6A4F] text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shrink-0 disabled:opacity-60"
              >
                {isSuggesting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Wand2 className="w-3.5 h-3.5" />
                )}
                <span>この野菜の栄養素を自動入力</span>
              </button>
            </div>
            {suggestError && (
              <p className="mt-1.5 text-xs text-[#9A3412]">{suggestError}</p>
            )}
          </div>

          <div>
            <span className="block text-xs font-medium text-[#516457] mb-1.5">
              判定の確かさ
            </span>
            <div className="grid grid-cols-3 gap-2">
              {CONFIDENCE_OPTIONS.map((opt) => {
                const active = draftConfidence === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setDraftConfidence(opt.value)}
                    className={`min-h-[44px] px-3 py-2 rounded-xl border text-xs font-medium transition-colors whitespace-nowrap ${
                      active
                        ? 'bg-[#2D6A4F] border-[#2D6A4F] text-white'
                        : 'bg-[#FBF8F1] border-[#DCE6DA] text-[#516457] hover:bg-[#EEF5EC]'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {draftConfidence !== 'confirmed' && (
            <div>
              <label className="block text-xs font-medium text-[#516457] mb-1.5">
                メモ・理由（任意）
              </label>
              <input
                type="text"
                value={draftReason}
                onChange={(e) => setDraftReason(e.target.value)}
                placeholder="例：細かく刻まれていて見分けにくいため"
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#DCE6DA] bg-[#FBF8F1] text-sm text-[#1F2D24] focus:outline-none focus:border-[#2D6A4F]"
              />
            </div>
          )}

          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#516457]">
                主な栄養素とその働き
              </span>
              <button
                type="button"
                onClick={handleAddNutrientRow}
                className="min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-medium text-[#2D6A4F] hover:bg-[#EEF5EC] inline-flex items-center gap-1 transition-colors whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>栄養素を追加</span>
              </button>
            </div>

            {draftNutrients.map((nut) => (
              <div
                key={nut.id}
                className="p-3 rounded-xl bg-[#FBF8F1] border border-[#DCE6DA] space-y-2"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nut.name}
                    onChange={(e) => handleNutrientChange(nut.id, 'name', e.target.value)}
                    placeholder="栄養素名（例：ビタミンC）"
                    className="flex-1 min-h-[40px] px-3 py-1.5 rounded-lg border border-[#DCE6DA] bg-white text-sm text-[#1F2D24] focus:outline-none focus:border-[#2D6A4F]"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveNutrientRow(nut.id)}
                    className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center rounded-lg text-[#7C4A3A] hover:bg-[#FDECE8] transition-colors"
                    aria-label="この栄養素を削除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <input
                  type="text"
                  value={nut.benefit}
                  onChange={(e) => handleNutrientChange(nut.id, 'benefit', e.target.value)}
                  placeholder="働き（例：肌の調子を整えたり、元気を保つサポートに）"
                  className="w-full min-h-[40px] px-3 py-1.5 rounded-lg border border-[#DCE6DA] bg-white text-sm text-[#1F2D24] focus:outline-none focus:border-[#2D6A4F]"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#DCE6DA]">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="min-h-[44px] px-4 py-2 rounded-xl border border-[#DCE6DA] bg-white hover:bg-[#FBF8F1] text-sm font-medium text-[#516457] transition-colors whitespace-nowrap"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="min-h-[44px] px-5 py-2 rounded-xl bg-[#2D6A4F] hover:bg-[#24563F] text-white text-sm font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <Check className="w-4 h-4" />
            <span>変更を保存</span>
          </button>
        </div>
      </article>
    );
  }

  return (
    <article className="bg-white rounded-2xl border border-[#DCE6DA] p-5 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#516457]">
            {renderConfidenceMeta(vegetable.confidence)}
            {(vegetable.isUserEdited || vegetable.isUserAdded) && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[#2D6A4F] font-medium">
                  {vegetable.isUserAdded ? '手動追加' : '修正済み'}
                </span>
              </>
            )}
          </div>
          <h3 className="text-lg font-bold text-[#1F2D24] leading-snug">
            {vegetable.name}
          </h3>
          {vegetable.uncertaintyReason && (
            <p className="text-xs text-[#6B5B45] leading-relaxed">
              {vegetable.uncertaintyReason}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={openEditor}
            className="min-h-[44px] px-3 py-2 rounded-xl text-xs font-medium text-[#2D6A4F] hover:bg-[#EEF5EC] inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>編集</span>
          </button>
          <button
            type="button"
            onClick={() => onDelete(vegetable.id)}
            className="min-h-[44px] min-w-[44px] rounded-xl text-[#7C4A3A] hover:bg-[#FDECE8] inline-flex items-center justify-center transition-colors"
            aria-label={`${vegetable.name}を削除`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {vegetable.nutrients.length > 0 ? (
        <dl className="mt-4 pt-3 border-t border-[#E8EFE6] space-y-3">
          {vegetable.nutrients.map((nut) => (
            <div
              key={nut.id}
              className="grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4 items-baseline"
            >
              <dt className="sm:col-span-4 text-sm font-semibold text-[#2D6A4F]">
                {nut.name}
              </dt>
              <dd className="sm:col-span-8 text-sm text-[#3F5145] leading-relaxed">
                {nut.benefit}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <div className="mt-4 pt-3 border-t border-[#E8EFE6] flex items-center justify-between gap-3">
          <p className="text-xs text-[#516457]">
            {vegetable.confidence === 'unknown'
              ? '野菜の種類が特定できないため、栄養素は未入力です。「編集」から名前を入力すると栄養素を調べられます。'
              : '栄養素の情報が未登録です。「編集」から追加できます。'}
          </p>
        </div>
      )}
    </article>
  );
}
