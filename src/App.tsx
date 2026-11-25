import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  Calendar,
  Camera,
  Image as ImageIcon,
  Info,
  Leaf,
  Loader2,
  RefreshCw,
  RotateCcw,
  Sprout,
  Upload,
} from 'lucide-react';
import { AddVegetableForm } from './components/AddVegetableForm';
import { CameraModal } from './components/CameraModal';
import { CharacterRaisingPage } from './components/CharacterRaisingPage';
import { LevelUpModal } from './components/LevelUpModal';
import { MealRecordDetailModal } from './components/MealRecordDetailModal';
import { MealRecordsPage } from './components/MealRecordsPage';
import { SaveMealSection, type SaveMealOutcome } from './components/SaveMealSection';
import { VegetableCard } from './components/VegetableCard';
import { VegetableDetailView } from './components/VegetableDetailView';
import { VegetableEncyclopediaPage } from './components/VegetableEncyclopediaPage';
import type { CharacterProfile } from './types/character';
import type {
  AnalysisErrorInfo,
  EncyclopediaVegetableStatus,
  MealAnalysisResult,
  MealRecord,
  MealType,
  SessionAnalysisEntry,
  VegetableItem,
} from './types/meal';
import { buildCharacterProgress, createDefaultCharacterProfile } from './utils/characterEngine';
import { processImageFile, type CompressedImage } from './utils/image';
import {
  buildEncyclopediaData,
  deleteMealRecordById,
  deriveMetadataForRecord,
  getAllMealRecords,
  getCharacterProfile,
  getNewlyUnlockableVegetableNames,
  getViewedEncyclopediaIds,
  markVegetableViewed,
  pruneViewedEncyclopediaIds,
  saveNewMealRecord,
  updateCharacterCelebratedLevel,
  updateCharacterName,
  updateExistingMealRecord,
} from './utils/mealDb';

const HERO_IMAGE_PATH = '/src/assets/images/veggie_hero_plate_1795502319352.jpg';
const GUIDE_IMAGE_PATH = '/src/assets/images/veggie_camera_guide_1795502319691.jpg';

export default function App() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement | null>(null);

  const [currentPage, setCurrentPage] = useState<
    'analyzer' | 'records' | 'encyclopedia' | 'character'
  >('analyzer');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<AnalysisErrorInfo | null>(null);

  const [pendingImage, setPendingImage] = useState<CompressedImage | null>(null);
  const [history, setHistory] = useState<SessionAnalysisEntry[]>([]);
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);

  const [savedRecords, setSavedRecords] = useState<MealRecord[]>([]);
  const [viewedVegetableIds, setViewedVegetableIds] = useState<string[]>([]);
  const [characterProfile, setCharacterProfile] = useState<CharacterProfile>(
    createDefaultCharacterProfile,
  );
  const [levelUpModalState, setLevelUpModalState] = useState<{ fromLevel: number } | null>(null);

  const [recordsLoading, setRecordsLoading] = useState(true);
  const [recordsLoadError, setRecordsLoadError] = useState<string | null>(null);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [selectedVegetableId, setSelectedVegetableId] = useState<string | null>(null);

  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const [guideImgFailed, setGuideImgFailed] = useState(false);

  const activeEntry = history.find((item) => item.id === activeEntryId) ?? null;
  const selectedRecord = savedRecords.find((r) => r.id === selectedRecordId) ?? null;
  const encyclopediaData = useMemo(
    () => buildEncyclopediaData(savedRecords, viewedVegetableIds),
    [savedRecords, viewedVegetableIds],
  );
  const selectedEncyclopediaEntry =
    encyclopediaData.entries.find(
      (entry) => entry.catalog.id === selectedVegetableId && entry.isUnlocked,
    ) ?? null;
  const characterProgress = useMemo(
    () => buildCharacterProgress(savedRecords, characterProfile),
    [savedRecords, characterProfile],
  );

  useEffect(() => {
    let cancelled = false;
    async function loadSavedData() {
      setRecordsLoading(true);
      setRecordsLoadError(null);
      try {
        const [loaded, viewedIds, profile] = await Promise.all([
          getAllMealRecords(),
          getViewedEncyclopediaIds(),
          getCharacterProfile(),
        ]);
        if (!cancelled) {
          setSavedRecords(loaded);
          setViewedVegetableIds(viewedIds);
          setCharacterProfile(profile);
        }
      } catch (err) {
        if (!cancelled) {
          setRecordsLoadError(
            err instanceof Error
              ? err.message
              : '保存された食事記録の読み込みに失敗しました。',
          );
        }
      } finally {
        if (!cancelled) {
          setRecordsLoading(false);
        }
      }
    }
    loadSavedData();
    return () => {
      cancelled = true;
    };
  }, []);

  const formatTimestamp = () =>
    new Date().toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

  const analyzeImage = async (image: CompressedImage) => {
    setPendingImage(image);
    setActiveEntryId(null);
    setAnalysisError(null);
    setIsAnalyzing(true);

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 45000);

    try {
      const response = await fetch('/api/analyze-meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: image.base64,
          mimeType: image.mimeType,
        }),
        signal: controller.signal,
      });

      const rawText = await response.text();
      let parsedBody: (MealAnalysisResult & {
        error?: string;
        errorCode?: string;
        rawDetail?: string;
        hint?: string;
        attemptedModels?: string[];
      }) | null = null;

      try {
        parsedBody = JSON.parse(rawText);
      } catch {
        parsedBody = null;
      }

      if (!response.ok) {
        setAnalysisError({
          title: '解析を完了できませんでした',
          message:
            parsedBody?.error ||
            `サーバーからエラー応答が返されました（HTTP ${response.status}）。`,
          httpStatus: response.status,
          errorCode: parsedBody?.errorCode || `HTTP_${response.status}`,
          rawDetail: parsedBody?.rawDetail || rawText.slice(0, 300) || undefined,
          hint:
            parsedBody?.hint ||
            '通信状態や画像サイズをご確認のうえ、少し待ってから「もう一度解析する」をお試しください。',
          attemptedModels: parsedBody?.attemptedModels,
          occurredAt: formatTimestamp(),
        });
        return;
      }

      if (!parsedBody || !Array.isArray(parsedBody.vegetables)) {
        setAnalysisError({
          title: '解析結果の形式を読み取れませんでした',
          message: 'サーバーからの応答データが正しいJSON形式ではありませんでした。',
          httpStatus: response.status,
          errorCode: 'INVALID_RESPONSE_PAYLOAD',
          rawDetail: rawText.slice(0, 300) || undefined,
          hint: 'もう一度解析を実行するか、別の写真でお試しください。',
          occurredAt: formatTimestamp(),
        });
        return;
      }

      const newEntry: SessionAnalysisEntry = {
        id: `meal-${Date.now()}`,
        imagePreviewUrl: image.previewUrl,
        mimeType: image.mimeType,
        imageBase64: image.base64,
        analyzedAt: new Date().toLocaleTimeString('ja-JP', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        originalResult: parsedBody,
        editedResult: {
          ...parsedBody,
          vegetables: parsedBody.vegetables.map((v) => ({
            ...v,
            nutrients: v.nutrients.map((n) => ({ ...n })),
          })),
        },
      };

      setHistory((prev) => [newEntry, ...prev]);
      setActiveEntryId(newEntry.id);
      setPendingImage(null);
    } catch (err) {
      const isAbort = err instanceof DOMException && err.name === 'AbortError';
      setAnalysisError({
        title: isAbort ? '通信がタイムアウトしました' : '通信エラーが発生しました',
        message: isAbort
          ? 'サーバーからの応答に時間がかかりすぎたため中断しました（45秒タイムアウト）。'
          : 'サーバーに接続できないか、通信が途中で切断されました。',
        errorCode: isAbort ? 'REQUEST_TIMEOUT' : 'NETWORK_ERROR',
        rawDetail: err instanceof Error ? err.message : String(err),
        hint: 'インターネット接続をご確認のうえ、少し待ってから「もう一度解析する」をお試しください。',
        occurredAt: formatTimestamp(),
      });
    } finally {
      window.clearTimeout(timeoutId);
      setIsAnalyzing(false);
    }
  };

  const handleFilesSelected = async (files: FileList | null) => {
    if (isAnalyzing || !files || files.length === 0) return;
    const file = files[0];
    setAnalysisError(null);

    try {
      const compressed = await processImageFile(file);
      await analyzeImage(compressed);
    } catch (err) {
      setAnalysisError({
        title: '画像を読み込めませんでした',
        message: err instanceof Error ? err.message : '画像の読み込み処理に失敗しました。',
        errorCode: 'IMAGE_LOAD_ERROR',
        rawDetail: err instanceof Error ? err.message : String(err),
        hint: 'JPEG・PNG・WebP形式の食事写真をお選びください。',
        occurredAt: formatTimestamp(),
      });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (nativeCameraInputRef.current) nativeCameraInputRef.current.value = '';
    }
  };

  const handleOpenUpload = () => {
    fileInputRef.current?.click();
  };

  const handleOpenCamera = () => {
    if (navigator.mediaDevices) {
      setIsCameraOpen(true);
    } else {
      nativeCameraInputRef.current?.click();
    }
  };

  const handleUpdateVegetable = (updated: VegetableItem) => {
    if (!activeEntry) return;
    setHistory((prev) =>
      prev.map((entry) =>
        entry.id === activeEntry.id
          ? {
              ...entry,
              hasUnsavedEditsAfterSave: Boolean(entry.savedRecordId),
              editedResult: {
                ...entry.editedResult,
                vegetables: entry.editedResult.vegetables.map((veg) =>
                  veg.id === updated.id ? updated : veg,
                ),
              },
            }
          : entry,
      ),
    );
  };

  const handleDeleteVegetable = (vegId: string) => {
    if (!activeEntry) return;
    setHistory((prev) =>
      prev.map((entry) =>
        entry.id === activeEntry.id
          ? {
              ...entry,
              hasUnsavedEditsAfterSave: Boolean(entry.savedRecordId),
              editedResult: {
                ...entry.editedResult,
                vegetables: entry.editedResult.vegetables.filter((veg) => veg.id !== vegId),
              },
            }
          : entry,
      ),
    );
  };

  const handleAddVegetable = (newVeg: VegetableItem) => {
    if (!activeEntry) return;
    setHistory((prev) =>
      prev.map((entry) =>
        entry.id === activeEntry.id
          ? {
              ...entry,
              hasUnsavedEditsAfterSave: Boolean(entry.savedRecordId),
              editedResult: {
                ...entry.editedResult,
                vegetables: [...entry.editedResult.vegetables, newVeg],
              },
            }
          : entry,
      ),
    );
  };

  const handleResetEdits = () => {
    if (!activeEntry) return;
    setHistory((prev) =>
      prev.map((entry) =>
        entry.id === activeEntry.id
          ? {
              ...entry,
              hasUnsavedEditsAfterSave: Boolean(entry.savedRecordId),
              editedResult: {
                ...entry.originalResult,
                vegetables: entry.originalResult.vegetables.map((v) => ({
                  ...v,
                  nutrients: v.nutrients.map((n) => ({ ...n })),
                })),
              },
            }
          : entry,
      ),
    );
  };

  const syncDerivedStateAfterRecordChange = async (nextRecords: MealRecord[]) => {
    const nextEncyclopedia = buildEncyclopediaData(nextRecords, viewedVegetableIds);
    const unlockedIds = nextEncyclopedia.entries
      .filter((entry) => entry.isUnlocked)
      .map((entry) => entry.catalog.id);
    const pruned = await pruneViewedEncyclopediaIds(unlockedIds);
    setViewedVegetableIds(pruned);

    const nextProgress = buildCharacterProgress(nextRecords, characterProfile);
    if (nextProgress.level < characterProfile.lastCelebratedLevel) {
      const syncedProfile = await updateCharacterCelebratedLevel(nextProgress.level);
      setCharacterProfile(syncedProfile);
    } else if (nextProgress.level > characterProfile.lastCelebratedLevel) {
      setLevelUpModalState({ fromLevel: characterProfile.lastCelebratedLevel });
    }
  };

  const handleSaveMealRecord = async (payload: {
    dishName: string;
    mealType: MealType;
    eatenAt: string;
  }): Promise<SaveMealOutcome> => {
    if (!activeEntry) {
      return {
        newlyUnlockedNames: [],
        expGained: 0,
        cappedByDailyLimit: false,
        leveledUpTo: null,
        characterName: characterProfile.name,
      };
    }

    const newlyUnlockedNames = getNewlyUnlockableVegetableNames(
      activeEntry.editedResult.vegetables,
      encyclopediaData,
    );

    const { savedVegetables, uniqueVegetableNames, nutrientNames } =
      deriveMetadataForRecord(activeEntry.editedResult.vegetables);
    const nowIso = new Date().toISOString();

    const record: MealRecord = {
      id: `record-${Date.now()}`,
      schemaVersion: 1,
      sourceAnalysisId: activeEntry.id,
      dishName: payload.dishName,
      dishSummary: activeEntry.editedResult.dishSummary,
      mealType: payload.mealType,
      eatenAt: payload.eatenAt,
      eatenDate: payload.eatenAt.slice(0, 10),
      imageDataUrl: activeEntry.imagePreviewUrl,
      vegetables: savedVegetables,
      uniqueVegetableNames,
      nutrientNames,
      adviceNote: activeEntry.editedResult.adviceNote,
      cautionNote: activeEntry.editedResult.cautionNote,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    try {
      const saved = await saveNewMealRecord(record);
      const nextRecords = [saved, ...savedRecords].sort((a, b) =>
        b.eatenAt.localeCompare(a.eatenAt),
      );
      setSavedRecords(nextRecords);
      setHistory((prev) =>
        prev.map((entry) =>
          entry.id === activeEntry.id
            ? { ...entry, savedRecordId: saved.id, hasUnsavedEditsAfterSave: false }
            : entry,
        ),
      );

      const nextProgress = buildCharacterProgress(nextRecords, characterProfile);
      const savedEvent = nextProgress.recentGrowthEvents.find((e) => e.recordId === saved.id);
      const expGained = savedEvent
        ? savedEvent.actualExp
        : Math.max(0, nextProgress.totalExp - characterProgress.totalExp);
      const leveledUpTo =
        nextProgress.level > characterProgress.level ? nextProgress.level : null;

      if (nextProgress.level > characterProfile.lastCelebratedLevel) {
        setLevelUpModalState({ fromLevel: characterProfile.lastCelebratedLevel });
      }

      return {
        newlyUnlockedNames,
        expGained,
        cappedByDailyLimit: Boolean(savedEvent?.cappedByDailyLimit),
        leveledUpTo,
        characterName: characterProfile.name,
      };
    } catch (err) {
      if (err instanceof Error && err.message === 'DUPLICATE_ANALYSIS_RECORD') {
        throw new Error('この解析結果はすでに記録されています（重複保存は防止されました）。');
      }
      throw err;
    }
  };

  const handleUpdateSavedFromAnalyzer = async (payload: {
    recordId: string;
    dishName: string;
    mealType: MealType;
    eatenAt: string;
  }) => {
    if (!activeEntry) return;
    const existing = savedRecords.find((r) => r.id === payload.recordId);
    if (!existing) {
      await handleSaveMealRecord(payload);
      return;
    }

    const { savedVegetables, uniqueVegetableNames, nutrientNames } =
      deriveMetadataForRecord(activeEntry.editedResult.vegetables);

    const updated = await updateExistingMealRecord({
      ...existing,
      dishName: payload.dishName,
      mealType: payload.mealType,
      eatenAt: payload.eatenAt,
      eatenDate: payload.eatenAt.slice(0, 10),
      vegetables: savedVegetables,
      uniqueVegetableNames,
      nutrientNames,
    });

    const nextRecords = savedRecords
      .map((r) => (r.id === updated.id ? updated : r))
      .sort((a, b) => b.eatenAt.localeCompare(a.eatenAt));
    setSavedRecords(nextRecords);
    await syncDerivedStateAfterRecordChange(nextRecords);

    setHistory((prev) =>
      prev.map((entry) =>
        entry.id === activeEntry.id
          ? { ...entry, hasUnsavedEditsAfterSave: false }
          : entry,
      ),
    );
  };

  const handleUpdateRecordFromModal = async (updatedRecord: MealRecord) => {
    const saved = await updateExistingMealRecord(updatedRecord);
    const nextRecords = savedRecords
      .map((r) => (r.id === saved.id ? saved : r))
      .sort((a, b) => b.eatenAt.localeCompare(a.eatenAt));
    setSavedRecords(nextRecords);
    await syncDerivedStateAfterRecordChange(nextRecords);
  };

  const handleDeleteRecordFromModal = async (recordId: string) => {
    await deleteMealRecordById(recordId);
    const nextRecords = savedRecords.filter((r) => r.id !== recordId);
    setSavedRecords(nextRecords);
    await syncDerivedStateAfterRecordChange(nextRecords);
    setHistory((prev) =>
      prev.map((entry) =>
        entry.savedRecordId === recordId
          ? { ...entry, savedRecordId: undefined, hasUnsavedEditsAfterSave: false }
          : entry,
      ),
    );
  };

  const handleSelectEncyclopediaVegetable = async (entry: EncyclopediaVegetableStatus) => {
    setSelectedVegetableId(entry.catalog.id);
    if (entry.isNew) {
      const updatedViewed = await markVegetableViewed(entry.catalog.id);
      setViewedVegetableIds(updatedViewed);
    }
  };

  const handleRenameCharacter = async (newName: string) => {
    const updatedProfile = await updateCharacterName(newName);
    setCharacterProfile(updatedProfile);
  };

  const handleOpenCharacterPage = () => {
    setCurrentPage('character');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (characterProgress.level > characterProfile.lastCelebratedLevel) {
      setLevelUpModalState({ fromLevel: characterProfile.lastCelebratedLevel });
    }
  };

  const handleCloseLevelUpModal = async () => {
    setLevelUpModalState(null);
    const updatedProfile = await updateCharacterCelebratedLevel(characterProgress.level);
    setCharacterProfile(updatedProfile);
  };

  const handleRetryCurrent = () => {
    if (pendingImage) {
      analyzeImage(pendingImage);
    } else if (activeEntry) {
      analyzeImage({
        base64: activeEntry.imageBase64,
        mimeType: activeEntry.mimeType,
        previewUrl: activeEntry.imagePreviewUrl,
      });
    }
  };

  const handleStartFresh = () => {
    setCurrentPage('analyzer');
    setPendingImage(null);
    setActiveEntryId(null);
    setAnalysisError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateSection = (sectionId: string) => {
    setCurrentPage('analyzer');
    window.setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const currentPreviewUrl = pendingImage?.previewUrl ?? activeEntry?.imagePreviewUrl ?? null;
  const hasModifiedEdits = activeEntry
    ? activeEntry.editedResult.vegetables.some((v) => v.isUserEdited || v.isUserAdded) ||
      activeEntry.editedResult.vegetables.length !== activeEntry.originalResult.vegetables.length
    : false;

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF8F1] text-[#1F2D24] pb-20 md:pb-0">
      {/* Hidden file inputs for photo upload & native mobile camera */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFilesSelected(e.target.files)}
      />
      <input
        ref={nativeCameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFilesSelected(e.target.files)}
      />

      {/* Top Bar: Strict 3-zone contract */}
      <header className="sticky top-0 z-30 bg-[#FBF8F1]/90 backdrop-blur-md border-b border-[#DCE6DA]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-8">
          <a
            href="#analyzer"
            onClick={(e) => {
              e.preventDefault();
              handleStartFresh();
            }}
            className="font-display text-lg font-bold tracking-tight text-[#2D6A4F] whitespace-nowrap shrink-0"
          >
            ベジぱしゃ
          </a>

          <nav className="hidden md:flex items-center gap-5 lg:gap-6 text-sm font-medium text-[#516457]">
            <button
              type="button"
              onClick={() => {
                setCurrentPage('analyzer');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`hover:text-[#1F2D24] underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
                currentPage === 'analyzer'
                  ? 'text-[#1F2D24] font-semibold underline'
                  : 'hover:underline'
              }`}
            >
              写真を解析
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentPage('records');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`hover:text-[#1F2D24] underline-offset-4 transition-colors whitespace-nowrap shrink-0 tabular-nums ${
                currentPage === 'records'
                  ? 'text-[#1F2D24] font-semibold underline'
                  : 'hover:underline'
              }`}
            >
              {savedRecords.length > 0 ? `食事記録 (${savedRecords.length})` : '食事記録'}
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentPage('encyclopedia');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`hover:text-[#1F2D24] underline-offset-4 transition-colors whitespace-nowrap shrink-0 tabular-nums inline-flex items-center gap-1.5 ${
                currentPage === 'encyclopedia'
                  ? 'text-[#1F2D24] font-semibold underline'
                  : 'hover:underline'
              }`}
            >
              <span>
                野菜図鑑 ({encyclopediaData.unlockedCount}/{encyclopediaData.totalCount})
              </span>
              {encyclopediaData.newCount > 0 && (
                <span className="px-1.5 py-0.5 rounded bg-[#D97706] text-white text-[10px] font-bold leading-none no-underline">
                  NEW
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={handleOpenCharacterPage}
              className={`hover:text-[#1F2D24] underline-offset-4 transition-colors whitespace-nowrap shrink-0 tabular-nums inline-flex items-center gap-1.5 ${
                currentPage === 'character'
                  ? 'text-[#1F2D24] font-semibold underline'
                  : 'hover:underline'
              }`}
            >
              <span>育成 Lv.{characterProgress.level}</span>
              {characterProgress.level > characterProfile.lastCelebratedLevel && (
                <span className="px-1.5 py-0.5 rounded bg-[#D97706] text-white text-[10px] font-bold leading-none no-underline">
                  UP
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => handleNavigateSection('how-to-read')}
              className="hover:text-[#1F2D24] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              見方の目安
            </button>
          </nav>

          <div className="shrink-0">
            <button
              type="button"
              onClick={
                currentPage !== 'analyzer' || currentPreviewUrl
                  ? handleStartFresh
                  : handleOpenUpload
              }
              className="min-h-[40px] px-4 py-2 rounded-xl bg-[#2D6A4F] hover:bg-[#24563F] text-white text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0"
            >
              {currentPage !== 'analyzer' || currentPreviewUrl
                ? '別の写真を解析'
                : '写真を選ぶ'}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {currentPage === 'records' ? (
          <MealRecordsPage
            records={savedRecords}
            isLoading={recordsLoading}
            loadError={recordsLoadError}
            onSelectRecord={(rec) => setSelectedRecordId(rec.id)}
            onGoToAnalyzer={() => {
              setCurrentPage('analyzer');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : currentPage === 'encyclopedia' ? (
          <VegetableEncyclopediaPage
            data={encyclopediaData}
            isLoading={recordsLoading}
            onSelectVegetable={handleSelectEncyclopediaVegetable}
            onGoToAnalyzer={() => {
              setCurrentPage('analyzer');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : currentPage === 'character' ? (
          <CharacterRaisingPage
            progress={characterProgress}
            isLoading={recordsLoading}
            onRenameCharacter={handleRenameCharacter}
            onSelectMealRecord={(recordId) => setSelectedRecordId(recordId)}
            onGoToAnalyzer={() => {
              setCurrentPage('analyzer');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : (
          <>
        {/* Main Analyzer Workspace */}
        <section id="analyzer" className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-12 sm:py-12">
          {!currentPreviewUrl ? (
            /* Initial Upload / Capture Hero */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
              <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
                <div className="space-y-3">
                  <p className="text-xs sm:text-sm font-medium text-[#2D6A4F]">
                    写真でチェック · 野菜と栄養のガイド
                  </p>
                  <h1 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#1F2D24] leading-[1.25] text-balance">
                    ごはんの写真から、野菜と栄養をパッと発見。
                  </h1>
                  <p className="text-sm sm:text-base text-[#516457] leading-relaxed max-w-xl">
                    いつもの食事を撮影したり写真を選ぶだけで、AIが写っている野菜を日本語で見つけて、主な栄養素とその働きをわかりやすくお知らせします。結果が違うときは自分で編集もできます。
                  </p>
                </div>

                {/* Dropzone + Primary Touch Actions */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    handleFilesSelected(e.dataTransfer.files);
                  }}
                  className={`rounded-3xl border-2 border-dashed p-5 sm:p-6 transition-colors ${
                    isDragging
                      ? 'border-[#2D6A4F] bg-[#E8F3EA]'
                      : 'border-[#B9CEB5] bg-white'
                  }`}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={handleOpenCamera}
                      className="min-h-[52px] px-5 py-3 rounded-2xl bg-[#2D6A4F] hover:bg-[#24563F] active:scale-[0.99] text-white text-sm font-medium inline-flex items-center justify-center gap-2.5 transition-all whitespace-nowrap"
                    >
                      <Camera className="w-5 h-5 shrink-0" />
                      <span>カメラで撮影する</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleOpenUpload}
                      className="min-h-[52px] px-5 py-3 rounded-2xl border border-[#DCE6DA] bg-[#EEF5EC] hover:bg-[#E1EFE0] active:scale-[0.99] text-[#2D6A4F] text-sm font-medium inline-flex items-center justify-center gap-2.5 transition-all whitespace-nowrap"
                    >
                      <Upload className="w-5 h-5 shrink-0" />
                      <span>写真をアップロード</span>
                    </button>
                  </div>

                  <p className="mt-3 text-center text-xs text-[#516457]">
                    パソコンからは写真のドラッグ＆ドロップにも対応しています（JPEG / PNG / WebP）
                  </p>
                </div>

                {analysisError && (
                  <div
                    role="alert"
                    className="rounded-2xl border border-[#E5B8A8] bg-[#FDF3EF] p-4 space-y-2.5 text-sm text-[#7C2D12]"
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-bold">{analysisError.title}</p>
                        <p className="leading-relaxed">{analysisError.message}</p>
                      </div>
                    </div>
                    <div className="rounded-xl bg-white/80 border border-[#E5B8A8]/70 p-3 text-xs text-[#51362B] space-y-1">
                      <p className="font-medium tabular-nums">
                        {[
                          analysisError.httpStatus ? `HTTP ${analysisError.httpStatus}` : null,
                          analysisError.errorCode ?? null,
                          `発生時刻: ${analysisError.occurredAt}`,
                        ]
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                      {analysisError.rawDetail && (
                        <p className="break-words text-[#6B4A3C]">
                          詳細: {analysisError.rawDetail}
                        </p>
                      )}
                      {analysisError.hint && (
                        <p className="text-[#51362B]">対処: {analysisError.hint}</p>
                      )}
                    </div>
                  </div>
                )}

                {history.length > 0 && (
                  <div className="pt-2 space-y-2.5">
                    <p className="text-xs font-medium text-[#516457]">
                      さきほど解析した写真に戻る
                    </p>
                    <div className="flex items-center gap-3 overflow-x-auto pb-1">
                      {history.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setActiveEntryId(item.id);
                            setPendingImage(null);
                            setAnalysisError(null);
                          }}
                          className="shrink-0 flex items-center gap-2.5 p-2 pr-3.5 rounded-2xl border border-[#DCE6DA] bg-white hover:bg-[#EEF5EC] transition-colors text-left"
                        >
                          <img
                            src={item.imagePreviewUrl}
                            alt="解析済みの食事写真"
                            className="w-11 h-11 rounded-xl object-cover"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-[#1F2D24] truncate max-w-[140px]">
                              {item.editedResult.vegetables.length > 0
                                ? `野菜 ${item.editedResult.vegetables.length}種類`
                                : '野菜なし'}
                            </p>
                            <p className="text-[11px] text-[#516457] tabular-nums">
                              {item.analyzedAt}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Editorial Botanical Illustration */}
              <div className="lg:col-span-5 flex">
                <div className="w-full rounded-3xl border border-[#DCE6DA] bg-[#EEF5EC] overflow-hidden flex items-center justify-center min-h-[260px]">
                  {!heroImgFailed ? (
                    <img
                      src={HERO_IMAGE_PATH}
                      alt="彩り豊かな野菜が盛られたお皿のイラスト"
                      referrerPolicy="no-referrer"
                      onError={() => setHeroImgFailed(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="p-8 text-center space-y-3">
                      <div className="w-16 h-16 rounded-2xl bg-white text-[#2D6A4F] mx-auto flex items-center justify-center border border-[#DCE6DA]">
                        <Leaf className="w-8 h-8" />
                      </div>
                      <p className="text-sm font-medium text-[#2D6A4F]">
                        今日の食事の野菜をチェックしよう
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Active Photo Analysis Results Workspace */
            <div className="space-y-6">
              {/* Session History Strip when multiple analyses exist */}
              {history.length > 1 && (
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                  <span className="text-xs font-medium text-[#516457] whitespace-nowrap shrink-0">
                    履歴:
                  </span>
                  {history.map((item) => {
                    const isSelected = item.id === activeEntryId && !pendingImage;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setActiveEntryId(item.id);
                          setPendingImage(null);
                          setAnalysisError(null);
                        }}
                        className={`shrink-0 min-h-[44px] px-3 py-1.5 rounded-xl border inline-flex items-center gap-2 text-xs font-medium transition-colors whitespace-nowrap ${
                          isSelected
                            ? 'bg-[#2D6A4F] border-[#2D6A4F] text-white'
                            : 'bg-white border-[#DCE6DA] text-[#1F2D24] hover:bg-[#EEF5EC]'
                        }`}
                      >
                        <img
                          src={item.imagePreviewUrl}
                          alt="解析履歴サムネイル"
                          className="w-6 h-6 rounded-md object-cover"
                        />
                        <span className="tabular-nums">{item.analyzedAt}</span>
                        <span>
                          · {item.editedResult.vegetables.length}種
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                {/* Left Column: Photo Preview & Repeat Analysis Actions */}
                <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20">
                  <div className="bg-white rounded-3xl border border-[#DCE6DA] p-4 space-y-4">
                    <div className="relative rounded-2xl overflow-hidden bg-[#F3EFE4] aspect-[4/3]">
                      <img
                        src={currentPreviewUrl}
                        alt="選択された食事の写真"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {activeEntry && !isAnalyzing && (
                      <div className="space-y-1.5 px-1">
                        <p className="text-xs font-medium text-[#516457]">
                          料理のまとめ
                        </p>
                        <p className="text-sm text-[#1F2D24] leading-relaxed">
                          {activeEntry.editedResult.dishSummary}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2.5 pt-1">
                      <button
                        type="button"
                        onClick={handleOpenCamera}
                        disabled={isAnalyzing}
                        className="min-h-[44px] px-3 py-2.5 rounded-xl bg-[#2D6A4F] hover:bg-[#24563F] disabled:opacity-50 text-white text-xs sm:text-sm font-medium inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                      >
                        <Camera className="w-4 h-4 shrink-0" />
                        <span>別の写真を撮る</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleOpenUpload}
                        disabled={isAnalyzing}
                        className="min-h-[44px] px-3 py-2.5 rounded-xl border border-[#DCE6DA] bg-[#EEF5EC] hover:bg-[#E1EFE0] disabled:opacity-50 text-[#2D6A4F] text-xs sm:text-sm font-medium inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                      >
                        <ImageIcon className="w-4 h-4 shrink-0" />
                        <span>別の写真を選ぶ</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column: Analysis Output / Loading / Error */}
                <div className="lg:col-span-7 space-y-4">
                  {isAnalyzing ? (
                    <div className="bg-white rounded-3xl border border-[#DCE6DA] p-8 sm:p-10 text-center space-y-4">
                      <div className="w-14 h-14 rounded-2xl bg-[#EEF5EC] text-[#2D6A4F] mx-auto flex items-center justify-center">
                        <Loader2 className="w-7 h-7 animate-spin" />
                      </div>
                      <div className="space-y-1.5">
                        <h2 className="font-display text-lg font-bold text-[#1F2D24]">
                          写真の中の野菜を探しています…
                        </h2>
                        <p className="text-sm text-[#516457]">
                          写っている野菜の種類と主な栄養素を確認しています。数秒ほどお待ちください。
                        </p>
                      </div>
                    </div>
                  ) : analysisError ? (
                    <div
                      role="alert"
                      className="bg-white rounded-3xl border border-[#E5B8A8] p-6 space-y-4"
                    >
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 text-[#9A3412] shrink-0 mt-0.5" />
                        <div className="space-y-1 min-w-0">
                          <h2 className="text-base font-bold text-[#1F2D24]">
                            {analysisError.title}
                          </h2>
                          <p className="text-sm text-[#516457] leading-relaxed">
                            {analysisError.message}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-2xl bg-[#FBF8F1] border border-[#E5B8A8]/70 p-4 space-y-2 text-xs text-[#51362B]">
                        <p className="font-semibold text-[#7C2D12]">具体的なエラー内容</p>
                        <dl className="space-y-1.5">
                          <div className="flex flex-wrap gap-x-2 gap-y-0.5 tabular-nums">
                            <dt className="font-medium text-[#6B4A3C]">ステータス / コード:</dt>
                            <dd>
                              {[
                                analysisError.httpStatus ? `HTTP ${analysisError.httpStatus}` : null,
                                analysisError.errorCode ?? '不明',
                                `(${analysisError.occurredAt})`,
                              ]
                                .filter(Boolean)
                                .join(' · ')}
                            </dd>
                          </div>
                          {analysisError.attemptedModels && analysisError.attemptedModels.length > 0 && (
                            <div className="flex flex-wrap gap-x-2 gap-y-0.5">
                              <dt className="font-medium text-[#6B4A3C]">試行したモデル:</dt>
                              <dd>{analysisError.attemptedModels.join(' → ')}</dd>
                            </div>
                          )}
                          {analysisError.rawDetail && (
                            <div className="space-y-0.5">
                              <dt className="font-medium text-[#6B4A3C]">API・システムからの詳細:</dt>
                              <dd className="break-words text-[#3F2A22] leading-relaxed">
                                {analysisError.rawDetail}
                              </dd>
                            </div>
                          )}
                          {analysisError.hint && (
                            <div className="space-y-0.5 pt-1 border-t border-[#E5B8A8]/50">
                              <dt className="font-medium text-[#2D6A4F]">対処の目安:</dt>
                              <dd className="text-[#3F5145] leading-relaxed">
                                {analysisError.hint}
                              </dd>
                            </div>
                          )}
                        </dl>
                      </div>

                      <div className="flex flex-wrap gap-2.5">
                        <button
                          type="button"
                          onClick={handleRetryCurrent}
                          className="min-h-[44px] px-4 py-2 rounded-xl bg-[#2D6A4F] hover:bg-[#24563F] text-white text-sm font-medium inline-flex items-center gap-2 transition-colors whitespace-nowrap"
                        >
                          <RefreshCw className="w-4 h-4" />
                          <span>もう一度解析する</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleOpenUpload}
                          className="min-h-[44px] px-4 py-2 rounded-xl border border-[#DCE6DA] bg-white hover:bg-[#EEF5EC] text-[#1F2D24] text-sm font-medium transition-colors whitespace-nowrap"
                        >
                          別の写真を選ぶ
                        </button>
                      </div>
                    </div>
                  ) : activeEntry ? (
                    <>
                      {/* Caution Notice (Non-definitive intake statement) */}
                      <div className="rounded-2xl border border-[#DCE6DA] bg-[#F2F6EE] p-4 flex items-start gap-3">
                        <Info className="w-5 h-5 text-[#2D6A4F] shrink-0 mt-0.5" />
                        <p className="text-xs sm:text-sm text-[#384B3E] leading-relaxed">
                          {activeEntry.editedResult.cautionNote}
                        </p>
                      </div>

                      {/* Results Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                        <div>
                          <h2 className="font-display text-xl font-bold text-[#1F2D24]">
                            見つかった野菜と栄養素
                          </h2>
                          <p className="text-xs text-[#516457] mt-0.5 tabular-nums">
                            {activeEntry.editedResult.vegetables.length}種類の野菜を表示中
                            {hasModifiedEdits ? ' · 編集が反映されています' : ''}
                          </p>
                        </div>

                        {hasModifiedEdits && (
                          <button
                            type="button"
                            onClick={handleResetEdits}
                            className="min-h-[40px] px-3 py-1.5 rounded-xl border border-[#DCE6DA] bg-white hover:bg-[#EEF5EC] text-xs font-medium text-[#516457] inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>AIの元の結果に戻す</span>
                          </button>
                        )}
                      </div>

                      {/* Detected Vegetables List */}
                      {activeEntry.editedResult.vegetables.length > 0 ? (
                        <div className="space-y-3.5">
                          {activeEntry.editedResult.vegetables.map((veg) => (
                            <VegetableCard
                              key={veg.id}
                              vegetable={veg}
                              onUpdate={handleUpdateVegetable}
                              onDelete={handleDeleteVegetable}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="bg-white rounded-2xl border border-[#DCE6DA] p-6 text-center space-y-2">
                          <p className="text-sm font-semibold text-[#1F2D24]">
                            写真から野菜をはっきりと見つけられませんでした
                          </p>
                          <p className="text-xs sm:text-sm text-[#516457] leading-relaxed">
                            {activeEntry.editedResult.isFoodPhoto
                              ? 'ソースや具材の下に野菜が隠れている場合は、下のボタンから手動で野菜を追加できます。'
                              : 'お食事以外の写真として判定された可能性があります。別の食事写真でお試しください。'}
                          </p>
                        </div>
                      )}

                      {/* Manual Add Form */}
                      <AddVegetableForm onAdd={handleAddVegetable} />

                      {/* Friendly Meal Advice */}
                      <div className="bg-white rounded-2xl border border-[#DCE6DA] p-5 space-y-1.5">
                        <p className="text-xs font-semibold text-[#2D6A4F]">
                          この食事へのひとことメモ
                        </p>
                        <p className="text-sm text-[#3F5145] leading-relaxed">
                          {activeEntry.editedResult.adviceNote}
                        </p>
                      </div>

                      {/* Save Meal Record Section */}
                      <SaveMealSection
                        entry={activeEntry}
                        existingRecord={
                          activeEntry.savedRecordId
                            ? savedRecords.find((r) => r.id === activeEntry.savedRecordId) ?? null
                            : null
                        }
                        onSave={handleSaveMealRecord}
                        onUpdateExisting={handleUpdateSavedFromAnalyzer}
                        onGoToRecords={() => {
                          setCurrentPage('records');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        onGoToEncyclopedia={() => {
                          setCurrentPage('encyclopedia');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        onGoToCharacter={handleOpenCharacterPage}
                      />
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* How to Read & Estimation Guide Section */}
        <section
          id="how-to-read"
          className="border-t border-[#DCE6DA] bg-white/70 py-12 sm:py-16"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4">
              <div className="rounded-3xl border border-[#DCE6DA] bg-[#FBF8F1] overflow-hidden aspect-square max-w-[320px] mx-auto flex items-center justify-center">
                {!guideImgFailed ? (
                  <img
                    src={GUIDE_IMAGE_PATH}
                    alt="カメラ枠の中に並んだ野菜のやさしいイラスト"
                    referrerPolicy="no-referrer"
                    onError={() => setGuideImgFailed(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="p-6 text-center text-[#2D6A4F]">
                    <Camera className="w-10 h-10 mx-auto mb-2" />
                    <span className="text-sm font-medium">野菜チェックの目安</span>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-8 space-y-6">
              <div className="space-y-2">
                <h2 className="font-display text-2xl font-bold text-[#1F2D24]">
                  結果の見方と、写真解析の大切なポイント
                </h2>
                <p className="text-sm text-[#516457] leading-relaxed">
                  料理の色や見た目からAIが野菜を判別していますが、写真だけでは見えない部分もあります。以下の目安を参考にしながら、必要に応じて結果を直してご活用ください。
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#FBF8F1] rounded-2xl border border-[#DCE6DA] p-4 space-y-1.5">
                  <h3 className="text-sm font-bold text-[#2D6A4F]">01. 「推定・不明」について</h3>
                  <p className="text-xs text-[#516457] leading-relaxed">
                    細かく刻まれた野菜や、ソース・汁物に沈んだ野菜は無理に断定せず「推定」または「不明」として表示します。
                  </p>
                </div>

                <div className="bg-[#FBF8F1] rounded-2xl border border-[#DCE6DA] p-4 space-y-1.5">
                  <h3 className="text-sm font-bold text-[#2D6A4F]">02. 結果の修正と追加</h3>
                  <p className="text-xs text-[#516457] leading-relaxed">
                    「実は小松菜だった」「中に玉ねぎも入っている」というときは、各カードの「編集」や「手動で追加」から直せます。
                  </p>
                </div>

                <div className="bg-[#FBF8F1] rounded-2xl border border-[#DCE6DA] p-4 space-y-1.5">
                  <h3 className="text-sm font-bold text-[#2D6A4F]">03. 摂取量の断定なし</h3>
                  <p className="text-xs text-[#516457] leading-relaxed">
                    写真だけでは正確な重さや栄養素の量（mgやg）は測れないため、「どんな栄養が含まれやすいか」の目安をお伝えします。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Friendly Young-Adult Nutrition Tips */}
        <section id="nutrition-tips" className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="space-y-6">
            <div className="space-y-1.5">
              <h2 className="font-display text-2xl font-bold text-[#1F2D24]">
                忙しい毎日でも続けやすい野菜のヒント
              </h2>
              <p className="text-sm text-[#516457]">
                「完璧な栄養バランス」を目指さなくても、食事に色を1つ足すだけでぐっと豊かになります。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-[#DCE6DA] p-5 space-y-2">
                <h3 className="text-base font-bold text-[#1F2D24]">緑の濃い野菜をプラス</h3>
                <p className="text-sm text-[#516457] leading-relaxed">
                  ブロッコリー、ほうれん草、小松菜などの緑黄色野菜には、β-カロテンやビタミンC、葉酸などが多く含まれやすいのが特徴です。
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-[#DCE6DA] p-5 space-y-2">
                <h3 className="text-base font-bold text-[#1F2D24]">赤・オレンジで彩りUP</h3>
                <p className="text-sm text-[#516457] leading-relaxed">
                  ミニトマトやにんじん、パプリカなどは洗ったり切るだけで添えやすく、リコピンやβ-カロテンを手軽に補うきっかけになります。
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-[#DCE6DA] p-5 space-y-2">
                <h3 className="text-base font-bold text-[#1F2D24]">汁物や冷凍野菜も味方に</h3>
                <p className="text-sm text-[#516457] leading-relaxed">
                  お味噌汁の具材やコンビニのカットサラダ、冷凍のブロッコリー・枝豆も立派な野菜。無理なく続けられる形を大事にしましょう。
                </p>
              </div>
            </div>
          </div>
        </section>
          </>
        )}
      </main>

      <footer className="border-t border-[#DCE6DA] bg-[#F6F2E7] py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#516457]">
          <p className="font-medium text-[#2D6A4F]">ベジぱしゃ</p>
          <p>
            本アプリの解析結果は食生活の参考情報であり、医療・栄養診断や正確な摂取量を保証するものではありません。
          </p>
        </div>
      </footer>

      {/* Mobile Sticky Bottom Thumb-Zone Action Bar (<= 64px height, < 15% mobile viewport) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#FBF8F1]/95 backdrop-blur-md border-t border-[#DCE6DA] px-2 py-1.5">
        <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => {
              setCurrentPage('analyzer');
              handleOpenCamera();
            }}
            disabled={isAnalyzing}
            className="min-h-[46px] px-1 py-1 rounded-xl bg-[#2D6A4F] active:scale-[0.98] disabled:opacity-50 text-white text-[10px] font-medium flex flex-col items-center justify-center gap-0.5 transition-transform whitespace-nowrap"
          >
            <Camera className="w-4 h-4 shrink-0" />
            <span>撮影</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setCurrentPage('analyzer');
              handleOpenUpload();
            }}
            disabled={isAnalyzing}
            className="min-h-[46px] px-1 py-1 rounded-xl border border-[#DCE6DA] bg-white active:scale-[0.98] disabled:opacity-50 text-[#2D6A4F] text-[10px] font-medium flex flex-col items-center justify-center gap-0.5 transition-transform whitespace-nowrap"
          >
            <Upload className="w-4 h-4 shrink-0" />
            <span>写真</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setCurrentPage((prev) => (prev === 'records' ? 'analyzer' : 'records'));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`min-h-[46px] px-1 py-1 rounded-xl border text-[10px] font-medium flex flex-col items-center justify-center gap-0.5 transition-colors whitespace-nowrap tabular-nums ${
              currentPage === 'records'
                ? 'bg-[#EEF5EC] border-[#2D6A4F] text-[#2D6A4F]'
                : 'bg-white border-[#DCE6DA] text-[#1F2D24]'
            }`}
          >
            <Calendar className="w-4 h-4 shrink-0" />
            <span>
              {currentPage === 'records'
                ? '解析'
                : savedRecords.length > 0
                  ? `記録(${savedRecords.length})`
                  : '記録'}
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              setCurrentPage((prev) => (prev === 'encyclopedia' ? 'analyzer' : 'encyclopedia'));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`relative min-h-[46px] px-1 py-1 rounded-xl border text-[10px] font-medium flex flex-col items-center justify-center gap-0.5 transition-colors whitespace-nowrap tabular-nums ${
              currentPage === 'encyclopedia'
                ? 'bg-[#EEF5EC] border-[#2D6A4F] text-[#2D6A4F]'
                : 'bg-white border-[#DCE6DA] text-[#1F2D24]'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>
              {currentPage === 'encyclopedia'
                ? '解析'
                : `図鑑(${encyclopediaData.unlockedCount})`}
            </span>
            {encyclopediaData.newCount > 0 && currentPage !== 'encyclopedia' && (
              <span className="absolute -top-1 right-0.5 px-1 py-0.5 rounded bg-[#D97706] text-white text-[8px] font-bold leading-none">
                NEW
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              if (currentPage === 'character') {
                setCurrentPage('analyzer');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                handleOpenCharacterPage();
              }
            }}
            className={`relative min-h-[46px] px-1 py-1 rounded-xl border text-[10px] font-medium flex flex-col items-center justify-center gap-0.5 transition-colors whitespace-nowrap tabular-nums ${
              currentPage === 'character'
                ? 'bg-[#EEF5EC] border-[#2D6A4F] text-[#2D6A4F]'
                : 'bg-white border-[#DCE6DA] text-[#1F2D24]'
            }`}
          >
            <Sprout className="w-4 h-4 shrink-0" />
            <span>
              {currentPage === 'character'
                ? '解析'
                : `育成Lv${characterProgress.level}`}
            </span>
            {characterProgress.level > characterProfile.lastCelebratedLevel &&
              currentPage !== 'character' && (
                <span className="absolute -top-1 right-0.5 px-1 py-0.5 rounded bg-[#D97706] text-white text-[8px] font-bold leading-none">
                  UP
                </span>
              )}
          </button>
        </div>
      </div>

      {/* In-App Camera Capture Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(image) => {
          setCurrentPage('analyzer');
          analyzeImage(image);
        }}
        onFallbackFilePick={() => nativeCameraInputRef.current?.click()}
      />

      {/* Saved Meal Record Detail & Edit Modal */}
      <MealRecordDetailModal
        record={selectedRecord}
        onClose={() => setSelectedRecordId(null)}
        onUpdateRecord={handleUpdateRecordFromModal}
        onDeleteRecord={handleDeleteRecordFromModal}
      />

      {/* Vegetable Encyclopedia Detail Modal / Sub-View */}
      <VegetableDetailView
        entry={selectedEncyclopediaEntry}
        onClose={() => setSelectedVegetableId(null)}
        onSelectMealRecord={(recordId) => setSelectedRecordId(recordId)}
      />

      {/* Character Level-Up Celebration Modal */}
      <LevelUpModal
        isOpen={Boolean(levelUpModalState)}
        fromLevel={levelUpModalState?.fromLevel ?? 1}
        progress={characterProgress}
        showGoToCharacterButton={currentPage !== 'character'}
        onGoToCharacter={async () => {
          await handleCloseLevelUpModal();
          setCurrentPage('character');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onClose={handleCloseLevelUpModal}
      />
    </div>
  );
}
