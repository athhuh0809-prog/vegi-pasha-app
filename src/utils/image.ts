export interface CompressedImage {
  base64: string;
  mimeType: string;
  previewUrl: string;
}

const MAX_DIMENSION = 1024;
const JPEG_QUALITY = 0.82;

export async function processImageFile(file: File): Promise<CompressedImage> {
  if (file.type && !file.type.startsWith('image/')) {
    throw new Error(`対応していないファイル形式です（${file.type}）。JPEG / PNG / WebP の画像を選択してください。`);
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await loadImage(objectUrl);
    const { width, height } = fitDimensions(img.naturalWidth, img.naturalHeight, MAX_DIMENSION);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('画像の読み込み処理に失敗しました。');
    }

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
    const base64 = dataUrl.split(',')[1] ?? '';
    return {
      base64,
      mimeType: 'image/jpeg',
      previewUrl: dataUrl,
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export function captureVideoFrame(video: HTMLVideoElement): CompressedImage {
  const srcWidth = video.videoWidth || 1280;
  const srcHeight = video.videoHeight || 720;
  const { width, height } = fitDimensions(srcWidth, srcHeight, MAX_DIMENSION);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('カメラ画像のキャプチャに失敗しました。');
  }

  ctx.drawImage(video, 0, 0, width, height);
  const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
  const base64 = dataUrl.split(',')[1] ?? '';

  return {
    base64,
    mimeType: 'image/jpeg',
    previewUrl: dataUrl,
  };
}

function fitDimensions(
  srcWidth: number,
  srcHeight: number,
  maxSide: number,
): { width: number; height: number } {
  if (srcWidth <= maxSide && srcHeight <= maxSide) {
    return { width: srcWidth, height: srcHeight };
  }
  if (srcWidth >= srcHeight) {
    return {
      width: maxSide,
      height: Math.round((srcHeight * maxSide) / srcWidth),
    };
  }
  return {
    width: Math.round((srcWidth * maxSide) / srcHeight),
    height: maxSide,
  };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(
        new Error(
          'この画像ファイルはブラウザで開けませんでした（HEIC形式などはJPEG/PNGに変換してお試しください）。',
        ),
      );
    img.src = src;
  });
}
