import { useState } from 'react';
import { Check, Loader2, Plus, Wand2, X } from 'lucide-react';
import type { ConfidenceLevel, NutrientInfo, VegetableItem } from '../types/meal';

interface AddVegetableFormProps {
  onAdd: (item: VegetableItem) => void;
}

export function AddVegetableForm({ onAdd }: AddVegetableFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [confidence, setConfidence] = useState<ConfidenceLevel>('confirmed');
  const [nutrients, setNutrients] = useState<NutrientInfo[]>([
    { id: 'add-nut-1', name: '', benefit: '' },
  ]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setName('');
    setConfidence('confirmed');
    setNutrients([{ id: `add-nut-${Date.now()}`, name: '', benefit: '' }]);
    setError(null);
    setIsOpen(false);
  };

  const handleSuggest = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('先に野菜の名前を入力してください。');
      return;
    }

    setIsSuggesting(true);
    setError(null);
    try {
      const res = await fetch('/api/vegetable-nutrients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vegetableName: trimmed }),
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
        setNutrients(data.nutrients);
      } else {
        setError('栄養素の候補が見つかりませんでした。手動で入力してください。');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '通信エラーにより栄養素の取得に失敗しました。');
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('野菜の名前を入力してください。');
      return;
    }

    const validNutrients = nutrients
      .filter((n) => n.name.trim().length > 0)
      .map((n) => ({
        ...n,
        name: n.name.trim(),
        benefit: n.benefit.trim() || '毎日の食生活で健康を支える栄養素のひとつです。',
      }));

    onAdd({
      id: `veg-user-${Date.now()}`,
      name: trimmedName,
      confidence,
      nutrients: validNutrients,
      isUserAdded: true,
    });
    reset();
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full min-h-[48px] px-5 py-3 rounded-2xl border border-dashed border-[#9DB89A] bg-[#F5F9F3] hover:bg-[#EAF3E7] text-[#2D6A4F] text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>写真に写っている野菜を手動で追加する</span>
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-[#2D6A4F]/40 p-5 space-y-4"
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-bold text-[#1F2D24]">野菜を追加する</h3>
        <button
          type="button"
          onClick={reset}
          className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl text-[#516457] hover:bg-[#EEF5EC] transition-colors"
          aria-label="追加フォームを閉じる"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#516457] mb-1.5">
          野菜の名前（日本語）
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例：ピーマン、アボカド、きのこ"
            className="flex-1 min-h-[44px] px-3.5 py-2 rounded-xl border border-[#DCE6DA] bg-[#FBF8F1] text-sm text-[#1F2D24] focus:outline-none focus:border-[#2D6A4F]"
          />
          <button
            type="button"
            onClick={handleSuggest}
            disabled={isSuggesting}
            className="min-h-[44px] px-4 py-2 rounded-xl border border-[#DCE6DA] bg-[#EEF5EC] hover:bg-[#E1EFE0] text-[#2D6A4F] text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shrink-0 disabled:opacity-60"
          >
            {isSuggesting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Wand2 className="w-3.5 h-3.5" />
            )}
            <span>栄養素を自動入力</span>
          </button>
        </div>
        {error && <p className="mt-1.5 text-xs text-[#9A3412]">{error}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[#516457]">主な栄養素と働き</span>
          <button
            type="button"
            onClick={() =>
              setNutrients((prev) => [
                ...prev,
                { id: `add-nut-${Date.now()}-${prev.length}`, name: '', benefit: '' },
              ])
            }
            className="min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-medium text-[#2D6A4F] hover:bg-[#EEF5EC] inline-flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>行を追加</span>
          </button>
        </div>

        {nutrients.map((nut) => (
          <div
            key={nut.id}
            className="p-3 rounded-xl bg-[#FBF8F1] border border-[#DCE6DA] space-y-2"
          >
            <input
              type="text"
              value={nut.name}
              onChange={(e) =>
                setNutrients((prev) =>
                  prev.map((item) =>
                    item.id === nut.id ? { ...item, name: e.target.value } : item,
                  ),
                )
              }
              placeholder="栄養素名（例：カリウム）"
              className="w-full min-h-[40px] px-3 py-1.5 rounded-lg border border-[#DCE6DA] bg-white text-sm text-[#1F2D24] focus:outline-none focus:border-[#2D6A4F]"
            />
            <input
              type="text"
              value={nut.benefit}
              onChange={(e) =>
                setNutrients((prev) =>
                  prev.map((item) =>
                    item.id === nut.id ? { ...item, benefit: e.target.value } : item,
                  ),
                )
              }
              placeholder="働き（例：体の水分バランスを整えるのをサポートします）"
              className="w-full min-h-[40px] px-3 py-1.5 rounded-lg border border-[#DCE6DA] bg-white text-sm text-[#1F2D24] focus:outline-none focus:border-[#2D6A4F]"
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#DCE6DA]">
        <button
          type="button"
          onClick={reset}
          className="min-h-[44px] px-4 py-2 rounded-xl border border-[#DCE6DA] bg-white hover:bg-[#FBF8F1] text-sm font-medium text-[#516457] transition-colors"
        >
          キャンセル
        </button>
        <button
          type="submit"
          className="min-h-[44px] px-5 py-2 rounded-xl bg-[#2D6A4F] hover:bg-[#24563F] text-white text-sm font-medium inline-flex items-center gap-1.5 transition-colors"
        >
          <Check className="w-4 h-4" />
          <span>リストに追加</span>
        </button>
      </div>
    </form>
  );
}
