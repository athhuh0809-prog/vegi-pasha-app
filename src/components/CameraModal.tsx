import { useEffect, useRef, useState } from 'react';
import { Camera, RefreshCw, Upload, X, Check } from 'lucide-react';
import { captureVideoFrame, type CompressedImage } from '../utils/image';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (image: CompressedImage) => void;
  onFallbackFilePick: () => void;
}

export function CameraModal({
  isOpen,
  onClose,
  onCapture,
  onFallbackFilePick,
}: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [capturedPreview, setCapturedPreview] = useState<CompressedImage | null>(null);

  const stopStream = () => {
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }
      streamRef.current = null;
    }
  };

  useEffect(() => {
    if (!isOpen) {
      stopStream();
      setCapturedPreview(null);
      setCameraError(null);
      return;
    }

    let cancelled = false;

    async function startCamera() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError('お使いのブラウザではアプリ内カメラを利用できません。端末のカメラや写真選択をご利用ください。');
        return;
      }

      setIsStarting(true);
      setCameraError(null);
      stopStream();

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: facingMode } },
          audio: false,
        });

        if (cancelled) {
          for (const track of stream.getTracks()) {
            track.stop();
          }
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch {
        if (!cancelled) {
          setCameraError(
            'カメラへのアクセスが許可されていないか、カメラが見つかりませんでした。下のボタンから端末のカメラ・写真アルバムを選べます。',
          );
        }
      } finally {
        if (!cancelled) {
          setIsStarting(false);
        }
      }
    }

    if (!capturedPreview) {
      startCamera();
    }

    return () => {
      cancelled = true;
      stopStream();
    };
  }, [isOpen, facingMode, capturedPreview]);

  if (!isOpen) {
    return null;
  }

  const handleTakePhoto = () => {
    if (!videoRef.current) return;
    try {
      const captured = captureVideoFrame(videoRef.current);
      stopStream();
      setCapturedPreview(captured);
    } catch (err) {
      setCameraError(err instanceof Error ? err.message : '撮影に失敗しました。');
    }
  };

  const handleConfirm = () => {
    if (!capturedPreview) return;
    onCapture(capturedPreview);
    setCapturedPreview(null);
    onClose();
  };

  const handleRetake = () => {
    setCapturedPreview(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#1F2D24]/60 backdrop-blur-sm p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="食事の写真を撮影"
    >
      <div className="w-full sm:max-w-lg bg-[#FBF8F1] rounded-t-3xl sm:rounded-3xl border border-[#DCE6DA] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#DCE6DA] bg-white">
          <h2 className="text-base font-bold text-[#1F2D24]">食事をカメラで撮影</h2>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#516457] hover:bg-[#EEF5EC] hover:text-[#1F2D24] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2D6A4F]"
            aria-label="閉じる"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-5 flex-1 overflow-y-auto">
          {cameraError ? (
            <div className="bg-white rounded-2xl border border-[#DCE6DA] p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EEF5EC] text-[#2D6A4F] mx-auto flex items-center justify-center">
                <Camera className="w-6 h-6" />
              </div>
              <p className="text-sm text-[#1F2D24] leading-relaxed">{cameraError}</p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onFallbackFilePick();
                }}
                className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-[#2D6A4F] hover:bg-[#24563F] text-white text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
              >
                <Upload className="w-4 h-4" />
                <span>写真を選ぶ / 端末カメラを使う</span>
              </button>
            </div>
          ) : capturedPreview ? (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-[#1F2D24] aspect-[4/3]">
                <img
                  src={capturedPreview.previewUrl}
                  alt="撮影した食事の写真"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleRetake}
                  className="min-h-[48px] px-4 py-3 rounded-xl border border-[#DCE6DA] bg-white hover:bg-[#EEF5EC] text-[#1F2D24] text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>撮り直す</span>
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="min-h-[48px] px-4 py-3 rounded-xl bg-[#2D6A4F] hover:bg-[#24563F] text-white text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                >
                  <Check className="w-4 h-4" />
                  <span>この写真で解析する</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-[#1F2D24] aspect-[4/3] flex items-center justify-center">
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {isStarting && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#1F2D24]/70 text-white text-sm">
                    カメラを準備しています…
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))
                  }
                  className="min-h-[48px] px-4 py-2.5 rounded-xl border border-[#DCE6DA] bg-white hover:bg-[#EEF5EC] text-[#1F2D24] text-sm font-medium inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>カメラ切替</span>
                </button>

                <button
                  type="button"
                  onClick={handleTakePhoto}
                  disabled={isStarting}
                  className="flex-1 min-h-[48px] px-5 py-3 rounded-xl bg-[#2D6A4F] hover:bg-[#24563F] disabled:opacity-50 text-white text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                >
                  <Camera className="w-5 h-5" />
                  <span>シャッターを押す</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
