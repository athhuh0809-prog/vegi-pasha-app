import { ArrowRight, Sparkles, X } from 'lucide-react';
import type { CharacterProgressSnapshot } from '../types/character';
import { CharacterIllustration } from './CharacterIllustration';

interface LevelUpModalProps {
  isOpen: boolean;
  fromLevel: number;
  progress: CharacterProgressSnapshot;
  showGoToCharacterButton: boolean;
  onGoToCharacter: () => void;
  onClose: () => void;
}

export function LevelUpModal({
  isOpen,
  fromLevel,
  progress,
  showGoToCharacterButton,
  onGoToCharacter,
  onClose,
}: LevelUpModalProps) {
  if (!isOpen) return null;

  const { profile, level, stats } = progress;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="levelup-modal-title"
      className="fixed inset-0 z-50 bg-[#1F2D24]/55 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md bg-[#FBF8F1] rounded-3xl border-2 border-[#2D6A4F] shadow-2xl overflow-hidden">
        <div className="bg-[#2D6A4F] text-white px-5 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FCE068]" />
            <h2 id="levelup-modal-title" className="font-display text-lg font-bold">
              レベルアップ！
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="閉じる"
            className="w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 text-center space-y-5">
          <div className="w-44 h-44 mx-auto rounded-3xl bg-[#EEF5EC] border border-[#DCE6DA] flex items-center justify-center p-3 motion-safe:animate-bounce-gentle">
            <CharacterIllustration
              level={level}
              evolutionStage={profile.evolutionStage}
              mood="levelup"
              className="w-full h-full"
            />
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-[#2D6A4F]">
              おめでとうございます！
            </p>
            <p className="font-display text-2xl font-bold text-[#1F2D24]">
              {profile.name}が成長しました
            </p>
            <div className="inline-flex items-center justify-center gap-2 pt-1 font-display text-xl font-bold tabular-nums">
              <span className="text-[#516457]">Lv.{fromLevel}</span>
              <ArrowRight className="w-5 h-5 text-[#2D6A4F]" />
              <span className="text-[#2D6A4F] text-2xl">Lv.{level}</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 bg-white rounded-2xl border border-[#DCE6DA] p-3 text-center">
            <div>
              <p className="text-[11px] font-medium text-[#516457]">HP</p>
              <p className="font-display text-base font-bold text-[#1F2D24] tabular-nums">
                {stats.hp}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-[#516457]">攻撃力</p>
              <p className="font-display text-base font-bold text-[#1F2D24] tabular-nums">
                {stats.attack}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-[#516457]">防御力</p>
              <p className="font-display text-base font-bold text-[#1F2D24] tabular-nums">
                {stats.defense}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-[#516457]">素早さ</p>
              <p className="font-display text-base font-bold text-[#1F2D24] tabular-nums">
                {stats.speed}
              </p>
            </div>
          </div>

          <p className="text-xs text-[#516457] leading-relaxed">
            レベルアップボーナス（HP+3・攻撃/防御/素早さ+1）が加算されました。次のレベルまであと{' '}
            <span className="font-semibold text-[#1F2D24] tabular-nums">
              {progress.expForNextLevel - progress.expInCurrentLevel} EXP
            </span>
            です！
          </p>

          <div className="flex flex-col sm:flex-row gap-2.5">
            {showGoToCharacterButton && (
              <button
                type="button"
                onClick={onGoToCharacter}
                className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl border border-[#DCE6DA] bg-white hover:bg-[#EEF5EC] text-[#2D6A4F] text-sm font-medium transition-colors whitespace-nowrap"
              >
                育成画面を見る
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-[#2D6A4F] hover:bg-[#24563F] text-white text-sm font-medium transition-colors whitespace-nowrap"
            >
              OK・つづける
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
