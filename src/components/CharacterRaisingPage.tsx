import { useEffect, useState } from 'react';
import {
  Camera,
  Check,
  Edit3,
  Heart,
  Info,
  Shield,
  Sparkles,
  Swords,
  Wind,
  X,
} from 'lucide-react';
import type { CharacterProgressSnapshot } from '../types/character';
import { MEAL_TYPE_LABELS } from '../utils/mealDb';
import {
  DAILY_EXP_CAP,
  EVOLUTION_BLUEPRINTS,
  MAX_MEAL_EXP,
  NUTRIENT_GAME_MAPPING,
} from '../utils/characterEngine';
import { CharacterIllustration } from './CharacterIllustration';

interface CharacterRaisingPageProps {
  progress: CharacterProgressSnapshot;
  isLoading: boolean;
  onRenameCharacter: (newName: string) => Promise<void>;
  onSelectMealRecord: (recordId: string) => void;
  onGoToAnalyzer: () => void;
}

export function CharacterRaisingPage({
  progress,
  isLoading,
  onRenameCharacter,
  onSelectMealRecord,
  onGoToAnalyzer,
}: CharacterRaisingPageProps) {
  const {
    profile,
    level,
    totalExp,
    expInCurrentLevel,
    expForNextLevel,
    levelProgressPercent,
    stats,
    baseStats,
    nutrientBonusStats,
    levelBonusStats,
    todayGrowth,
    recentGrowthEvents,
    evolutionBlueprint,
    battleSeed,
  } = progress;

  const [isEditingName, setIsEditingName] = useState(false);
  const [draftName, setDraftName] = useState(profile.name);
  const [isSavingName, setIsSavingName] = useState(false);

  useEffect(() => {
    setDraftName(profile.name);
  }, [profile.name]);

  const handleSubmitName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSavingName) return;
    setIsSavingName(true);
    try {
      await onRenameCharacter(draftName);
      setIsEditingName(false);
    } finally {
      setIsSavingName(false);
    }
  };

  const todayCapPercent = Math.min(
    100,
    Math.round((todayGrowth.expEarned / todayGrowth.dailyExpCap) * 100),
  );

  const statRows = [
    {
      key: 'hp' as const,
      label: 'HP',
      nutrient: '食物繊維でUP',
      value: stats.hp,
      base: baseStats.hp,
      bonus: nutrientBonusStats.hp,
      levelBonus: levelBonusStats.hp,
      barMax: Math.max(80, stats.hp + 15),
      barColor: 'bg-[#2D6A4F]',
      Icon: Heart,
    },
    {
      key: 'attack' as const,
      label: '攻撃力',
      nutrient: 'β-カロテンでUP',
      value: stats.attack,
      base: baseStats.attack,
      bonus: nutrientBonusStats.attack,
      levelBonus: levelBonusStats.attack,
      barMax: Math.max(40, stats.attack + 10),
      barColor: 'bg-[#D97706]',
      Icon: Swords,
    },
    {
      key: 'defense' as const,
      label: '防御力',
      nutrient: 'ビタミンCでUP',
      value: stats.defense,
      base: baseStats.defense,
      bonus: nutrientBonusStats.defense,
      levelBonus: levelBonusStats.defense,
      barMax: Math.max(40, stats.defense + 10),
      barColor: 'bg-[#3B8152]',
      Icon: Shield,
    },
    {
      key: 'speed' as const,
      label: '素早さ',
      nutrient: 'カリウムでUP',
      value: stats.speed,
      base: baseStats.speed,
      bonus: nutrientBonusStats.speed,
      levelBonus: levelBonusStats.speed,
      barMax: Math.max(40, stats.speed + 10),
      barColor: 'bg-[#0F766E]',
      Icon: Wind,
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-16 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <p className="text-xs sm:text-sm font-medium text-[#2D6A4F]">
            食事記録と連動 · パートナー育成
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1F2D24]">
            キャラクター育成ルーム
          </h1>
          <p className="text-xs sm:text-sm text-[#516457]">
            記録した食事の野菜と栄養素に応じて、パートナーがレベルアップして育ちます。
          </p>
        </div>

        <button
          type="button"
          onClick={onGoToAnalyzer}
          className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#2D6A4F] hover:bg-[#24563F] text-white text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0"
        >
          <Camera className="w-4 h-4" />
          <span>食事を記録して育てる</span>
        </button>
      </div>

      {/* Game-Specific Rules & Non-Medical Notice */}
      <div className="rounded-2xl border border-[#DCE6DA] bg-[#F2F6EE] p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-[#2D6A4F] shrink-0 mt-0.5" />
        <p className="text-xs sm:text-sm text-[#384B3E] leading-relaxed">
          この画面のHP・攻撃力・防御力・素早さ・経験値は「ベジぱしゃ」のゲーム独自の設定であり、実際の健康効果や写真からの正確な栄養摂取量を示すものではありません。また、無理な食事を防ぐため1日あたりの獲得経験値には上限（{DAILY_EXP_CAP} EXP）があります。
        </p>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-3xl border border-[#DCE6DA] p-12 text-center text-sm text-[#516457]">
          育成データを読み込んでいます…
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Character Stage, Name Editor, Level & EXP Gauge */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white rounded-3xl border border-[#DCE6DA] p-5 sm:p-6 space-y-5">
              {/* Stage Header */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-[#516457]">
                  {evolutionBlueprint.stageLabel} · {battleSeed.primaryRole}
                </span>
                <span className="font-display text-lg font-bold text-[#2D6A4F] tabular-nums">
                  Lv.{level}
                </span>
              </div>

              {/* Character Illustration Canvas */}
              <div className="rounded-3xl bg-[#EEF5EC] border border-[#DCE6DA] py-6 px-4 flex flex-col items-center justify-center gap-3">
                <CharacterIllustration
                  level={level}
                  evolutionStage={profile.evolutionStage}
                  mood={todayGrowth.expEarned > 0 ? 'happy' : 'idle'}
                  className="w-44 h-44 sm:w-48 sm:h-48"
                />
                <p className="text-xs text-[#2D6A4F] font-medium text-center">
                  {todayGrowth.expEarned > 0
                    ? `${profile.name}は今日の野菜パワーでニコニコしています！`
                    : `${profile.name}は今日の野菜ごはんを楽しみに待っています。`}
                </p>
              </div>

              {/* Character Name Display & Inline Rename */}
              <div className="space-y-2">
                {isEditingName ? (
                  <form onSubmit={handleSubmitName} className="space-y-2">
                    <label
                      htmlFor="character-name-input"
                      className="block text-xs font-medium text-[#516457]"
                    >
                      キャラクターの名前（16文字まで）
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        id="character-name-input"
                        type="text"
                        maxLength={16}
                        value={draftName}
                        onChange={(e) => setDraftName(e.target.value)}
                        placeholder="例：ベジっぴ"
                        className="flex-1 min-w-0 min-h-[44px] px-3.5 py-2 rounded-xl border border-[#DCE6DA] bg-[#FBF8F1] text-sm font-medium text-[#1F2D24] focus:outline-none focus:border-[#2D6A4F]"
                      />
                      <button
                        type="submit"
                        disabled={isSavingName}
                        aria-label="名前を保存"
                        className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[#2D6A4F] hover:bg-[#24563F] text-white text-xs font-medium inline-flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
                      >
                        <Check className="w-4 h-4" />
                        <span>保存</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDraftName(profile.name);
                          setIsEditingName(false);
                        }}
                        aria-label="キャンセル"
                        className="min-h-[44px] w-11 rounded-xl border border-[#DCE6DA] bg-white hover:bg-[#EEF5EC] text-[#516457] inline-flex items-center justify-center transition-colors shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs text-[#516457]">パートナーの名前</p>
                      <h2 className="font-display text-2xl font-bold text-[#1F2D24] truncate">
                        {profile.name}
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEditingName(true)}
                      className="min-h-[40px] px-3 py-1.5 rounded-xl border border-[#DCE6DA] bg-[#FBF8F1] hover:bg-[#EEF5EC] text-xs font-medium text-[#2D6A4F] inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>名前を変える</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Experience Gauge */}
              <div className="rounded-2xl bg-[#FBF8F1] border border-[#DCE6DA] p-4 space-y-2.5">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-xs font-semibold text-[#1F2D24]">
                    経験値ゲージ
                  </span>
                  <span className="text-xs font-semibold text-[#2D6A4F] tabular-nums">
                    {expInCurrentLevel} / {expForNextLevel} EXP ({levelProgressPercent}%)
                  </span>
                </div>

                <div
                  role="progressbar"
                  aria-valuenow={levelProgressPercent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="キャラクターの経験値ゲージ"
                  className="w-full h-3.5 rounded-xl bg-white border border-[#DCE6DA] overflow-hidden p-0.5"
                >
                  <div
                    className="h-full rounded-lg bg-[#2D6A4F] transition-all duration-500"
                    style={{
                      width: `${Math.max(expInCurrentLevel > 0 ? 4 : 0, levelProgressPercent)}%`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-[#516457] tabular-nums">
                  <span>次のレベルまであと {expForNextLevel - expInCurrentLevel} EXP</span>
                  <span>累計 {totalExp} EXP</span>
                </div>
              </div>
            </div>

            {/* Future Evolution Preview Card (Extensible Hook) */}
            <div className="bg-white rounded-3xl border border-[#DCE6DA] p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-base font-bold text-[#1F2D24]">
                  成長のステップ
                </h3>
                <span className="text-xs text-[#516457]">進化・バトル準備中</span>
              </div>
              <div className="space-y-2">
                {EVOLUTION_BLUEPRINTS.map((bp) => {
                  const isCurrent = bp.stage === profile.evolutionStage;
                  return (
                    <div
                      key={bp.stage}
                      className={`rounded-2xl border p-3 text-xs space-y-0.5 ${
                        isCurrent
                          ? 'bg-[#EEF5EC] border-[#2D6A4F]/40 text-[#1F2D24]'
                          : 'bg-[#FBF8F1] border-[#DCE6DA] text-[#516457]'
                      }`}
                    >
                      <p className="font-semibold tabular-nums">
                        {bp.stageLabel}（Lv.{bp.minLevel}〜）
                      </p>
                      <p className="leading-relaxed">{bp.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Stats, Nutrient Rules, Today's Growth Log */}
          <div className="lg:col-span-7 space-y-5">
            {/* Character Status Card */}
            <div className="bg-white rounded-3xl border border-[#DCE6DA] p-5 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <h2 className="font-display text-lg font-bold text-[#1F2D24]">
                    現在のステータス
                  </h2>
                  <p className="text-xs text-[#516457]">
                    食べた野菜に含まれる主な栄養素の種類に応じて伸び方が変わります
                  </p>
                </div>
                <span className="text-xs font-medium text-[#2D6A4F] tabular-nums">
                  記録した食事 {progress.totalMealsCounted}食分を反映
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {statRows.map((row) => {
                  const StatIcon = row.Icon;
                  const fillPercent = Math.min(100, Math.round((row.value / row.barMax) * 100));
                  return (
                    <div
                      key={row.key}
                      className="rounded-2xl bg-[#FBF8F1] border border-[#DCE6DA] p-4 space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-white border border-[#DCE6DA] text-[#2D6A4F] flex items-center justify-center shrink-0">
                            <StatIcon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-[#1F2D24]">{row.label}</p>
                            <p className="text-[11px] text-[#516457]">{row.nutrient}</p>
                          </div>
                        </div>
                        <p className="font-display text-2xl font-bold text-[#1F2D24] tabular-nums">
                          {row.value}
                        </p>
                      </div>

                      <div className="w-full h-2.5 rounded-lg bg-white border border-[#DCE6DA] overflow-hidden">
                        <div
                          className={`h-full rounded-md ${row.barColor} transition-all duration-500`}
                          style={{ width: `${fillPercent}%` }}
                        />
                      </div>

                      <p className="text-[11px] text-[#516457] tabular-nums">
                        基本 {row.base} · 野菜 +{row.bonus} · Lv +{row.levelBonus}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Nutrient -> Stat Mapping Reference */}
              <div className="pt-2 border-t border-[#DCE6DA] space-y-2.5">
                <p className="text-xs font-semibold text-[#2D6A4F]">
                  ゲーム内の栄養素とステータスのルール（ゲーム独自設定）
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                  {NUTRIENT_GAME_MAPPING.map((rule) => (
                    <div
                      key={rule.statKey}
                      className="rounded-xl bg-[#EEF5EC]/70 border border-[#DCE6DA] px-3 py-2 space-y-0.5"
                    >
                      <p className="text-[11px] font-medium text-[#516457]">
                        {rule.nutrientLabel}
                      </p>
                      <p className="text-xs font-bold text-[#1F2D24] tabular-nums">
                        {rule.targetLabel} +{rule.unitGain}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Today's Growth Log */}
            <div className="bg-white rounded-3xl border border-[#DCE6DA] p-5 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <h2 className="font-display text-lg font-bold text-[#1F2D24]">
                    今日の成長記録
                  </h2>
                  <p className="text-xs text-[#516457] tabular-nums">
                    {todayGrowth.date} · 1日の経験値上限 {todayGrowth.dailyExpCap} EXP（1食最大 {MAX_MEAL_EXP} EXP）
                  </p>
                </div>
                <span className="text-sm font-bold text-[#2D6A4F] tabular-nums">
                  +{todayGrowth.expEarned} / {todayGrowth.dailyExpCap} EXP
                </span>
              </div>

              {/* Today's EXP Cap Bar */}
              <div className="rounded-2xl bg-[#FBF8F1] border border-[#DCE6DA] p-4 space-y-2">
                <div className="w-full h-3 rounded-xl bg-white border border-[#DCE6DA] overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-lg transition-all duration-500 ${
                      todayGrowth.isCapReached ? 'bg-[#D97706]' : 'bg-[#2D6A4F]'
                    }`}
                    style={{
                      width: `${Math.max(todayGrowth.expEarned > 0 ? 4 : 0, todayCapPercent)}%`,
                    }}
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#516457] tabular-nums">
                  <span>
                    {todayGrowth.isCapReached
                      ? '本日の経験値上限に達しました（明日また記録して育てよう！）'
                      : `今日はあと ${todayGrowth.remainingExp} EXP 獲得できます`}
                  </span>
                  <span>
                    今日の成長: HP+{todayGrowth.statsGained.hp} / 攻撃+{todayGrowth.statsGained.attack} / 防御+{todayGrowth.statsGained.defense} / 素早さ+{todayGrowth.statsGained.speed}
                  </span>
                </div>
              </div>

              {/* Today's Meal Events List */}
              {todayGrowth.events.length > 0 ? (
                <div className="space-y-2.5">
                  {todayGrowth.events.map((ev) => (
                    <button
                      key={ev.recordId}
                      type="button"
                      onClick={() => onSelectMealRecord(ev.recordId)}
                      className="w-full text-left rounded-2xl border border-[#DCE6DA] bg-[#FBF8F1] hover:bg-[#EEF5EC] p-4 transition-colors space-y-1.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-bold text-[#1F2D24]">
                          {ev.dishName}
                          <span className="ml-2 text-xs font-medium text-[#516457] tabular-nums">
                            {MEAL_TYPE_LABELS[ev.mealType]} · {ev.eatenAt.slice(11, 16)}
                          </span>
                        </p>
                        <span
                          className={`text-xs font-bold tabular-nums ${
                            ev.actualExp > 0 ? 'text-[#2D6A4F]' : 'text-[#9A3412]'
                          }`}
                        >
                          {ev.actualExp > 0
                            ? `+${ev.actualExp} EXP`
                            : '1日の上限到達（+0 EXP）'}
                        </span>
                      </div>
                      <p className="text-xs text-[#516457]">
                        野菜: {ev.vegetableNames.join('・')}
                      </p>
                      <p className="text-xs text-[#2D6A4F] tabular-nums">
                        {ev.actualExp > 0
                          ? [
                              ev.statsGained.hp > 0 ? `HP +${ev.statsGained.hp}` : null,
                              ev.statsGained.attack > 0 ? `攻撃力 +${ev.statsGained.attack}` : null,
                              ev.statsGained.defense > 0 ? `防御力 +${ev.statsGained.defense}` : null,
                              ev.statsGained.speed > 0 ? `素早さ +${ev.statsGained.speed}` : null,
                              ev.matchedNutrients.some((m) => m.statKey === 'expBonus')
                                ? '葉酸ボーナス反映'
                                : null,
                              ev.cappedByDailyLimit ? '（一部1日上限により調整）' : null,
                            ]
                              .filter(Boolean)
                              .join(' · ') || '基本経験値を獲得'
                          : 'この日の経験値上限に達していたため加算されませんでした'}
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[#B9CEB5] bg-[#FBF8F1] p-6 text-center space-y-2">
                  <Sparkles className="w-6 h-6 text-[#2D6A4F] mx-auto" />
                  <p className="text-sm font-semibold text-[#1F2D24]">
                    今日はまだ成長記録がありません
                  </p>
                  <p className="text-xs text-[#516457] leading-relaxed">
                    食事の写真を解析して「食事を記録する」を押すと、{profile.name}の経験値とステータスが上がります。
                  </p>
                </div>
              )}

              {/* Past Growth Log if user has prior days */}
              {recentGrowthEvents.some((ev) => ev.eatenDate !== todayGrowth.date) && (
                <div className="pt-2 border-t border-[#DCE6DA] space-y-2">
                  <p className="text-xs font-semibold text-[#516457]">
                    これまでの成長履歴（直近の記録）
                  </p>
                  <div className="space-y-1.5">
                    {recentGrowthEvents
                      .filter((ev) => ev.eatenDate !== todayGrowth.date)
                      .slice(0, 4)
                      .map((ev) => (
                        <button
                          key={ev.recordId}
                          type="button"
                          onClick={() => onSelectMealRecord(ev.recordId)}
                          className="w-full text-left rounded-xl border border-[#DCE6DA] bg-white hover:bg-[#EEF5EC] px-3.5 py-2.5 flex items-center justify-between gap-3 transition-colors"
                        >
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-[#1F2D24] truncate">
                              {ev.dishName}
                            </p>
                            <p className="text-[11px] text-[#516457] tabular-nums truncate">
                              {ev.eatenDate} · {ev.vegetableNames.join('・')}
                            </p>
                          </div>
                          <span className="text-xs font-bold text-[#2D6A4F] tabular-nums whitespace-nowrap shrink-0">
                            +{ev.actualExp} EXP
                          </span>
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
