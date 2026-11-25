import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const MAX_BASE64_LENGTH = 10 * 1024 * 1024; // ~7.5MB decoded image limit

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY_MISSING');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function stripDataUrlPrefix(base64Input: string): string {
  const commaIdx = base64Input.indexOf(',');
  if (base64Input.startsWith('data:') && commaIdx !== -1) {
    return base64Input.slice(commaIdx + 1);
  }
  return base64Input;
}

function normalizeConfidence(value: unknown): 'confirmed' | 'estimated' | 'unknown' {
  if (value === 'confirmed' || value === 'estimated' || value === 'unknown') {
    return value;
  }
  return 'estimated';
}

const EXCLUDED_TUBER_OR_FRUIT_PATTERNS = [
  'じゃがいも',
  'じゃが芋',
  '新じゃが',
  '馬鈴薯',
  'ばれいしょ',
  'めーくいん',
  '男爵いも',
  'きたあかり',
  'いんかのめざめ',
  'さつまいも',
  'さつま芋',
  '薩摩芋',
  'やきいも',
  '焼き芋',
  'べにはるか',
  'なるときんとき',
  'あんのういも',
  'しるくすいーと',
  'すいーとぽてと',
  'さといも',
  '里芋',
  '里いも',
  'ながいも',
  '長芋',
  '長いも',
  'やまいも',
  '山芋',
  'やまのいも',
  '大和芋',
  'あぼかど',
  'あぼがど',
  'avocado',
  'potato',
  'sweetpotato',
];

const EXCLUDED_EXACT_ONLY = new Set(['ぽてと', '男爵', 'とろろ', 'ぽてとさらだ']);

function toHiragana(text: string): string {
  return text.replace(/[\u30a1-\u30f6]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60),
  );
}

function isExcludedTuberOrFruit(rawName: string): boolean {
  const cleaned = rawName
    .trim()
    .replace(/[（(].*?[)）]/g, '')
    .replace(/[・／/\s]+/g, '')
    .toLowerCase();
  if (!cleaned) return false;
  const hira = toHiragana(cleaned);

  if (EXCLUDED_EXACT_ONLY.has(hira)) {
    return true;
  }

  return EXCLUDED_TUBER_OR_FRUIT_PATTERNS.some((pattern) => {
    const pHira = toHiragana(pattern.toLowerCase());
    return hira.includes(pHira);
  });
}

function stripMarkdownJsonFences(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith('```')) {
    return trimmed
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/, '')
      .trim();
  }
  return trimmed;
}

interface FormattedGeminiError {
  status: number;
  message: string;
  errorCode: string;
  rawDetail: string;
  hint: string;
  attemptedModels: string[];
}

function sanitizeUpstreamText(text: string): string {
  return text.replace(/AIza[0-9A-Za-z_-]{20,}/g, '[REDACTED_KEY]').trim();
}

function extractUpstreamDetails(error: unknown): {
  httpStatus?: number;
  apiStatus?: string;
  apiMessage?: string;
} {
  const errObj = error as { status?: number; message?: string } | null;
  const httpStatus = typeof errObj?.status === 'number' ? errObj.status : undefined;
  const rawMessage = error instanceof Error ? error.message : String(error);

  try {
    const parsed = JSON.parse(rawMessage) as {
      error?: { code?: number; message?: string; status?: string };
    };
    if (parsed?.error) {
      return {
        httpStatus: typeof parsed.error.code === 'number' ? parsed.error.code : httpStatus,
        apiStatus: typeof parsed.error.status === 'string' ? parsed.error.status : undefined,
        apiMessage:
          typeof parsed.error.message === 'string'
            ? sanitizeUpstreamText(parsed.error.message)
            : sanitizeUpstreamText(rawMessage),
      };
    }
  } catch {
    // rawMessage is plain text, not JSON
  }

  return {
    httpStatus,
    apiMessage: sanitizeUpstreamText(rawMessage),
  };
}

function formatGeminiError(
  error: unknown,
  attemptedModels: string[] = [],
): FormattedGeminiError {
  const { httpStatus, apiStatus, apiMessage } = extractUpstreamDetails(error);
  const raw = apiMessage || (error instanceof Error ? error.message : String(error));

  if (raw === 'GEMINI_API_KEY_MISSING') {
    return {
      status: 500,
      message: 'サーバー側のGemini APIキーが設定されていません。',
      errorCode: 'GEMINI_API_KEY_MISSING',
      rawDetail: '環境変数 GEMINI_API_KEY が未設定です。',
      hint: '設定画面（Settings > Secrets）で GEMINI_API_KEY を設定してください。',
      attemptedModels,
    };
  }
  if (
    httpStatus === 403 ||
    httpStatus === 401 ||
    apiStatus === 'PERMISSION_DENIED' ||
    raw.includes('PERMISSION_DENIED') ||
    raw.includes('API_KEY_INVALID')
  ) {
    return {
      status: 502,
      message: 'AI解析サービスへの認証に失敗しました。',
      errorCode: apiStatus ? `${apiStatus} (${httpStatus ?? 403})` : `AUTH_ERROR (${httpStatus ?? 403})`,
      rawDetail: raw.slice(0, 300),
      hint: 'Settings > Secrets に設定されている GEMINI_API_KEY が有効かご確認ください。',
      attemptedModels,
    };
  }
  if (httpStatus === 404 || apiStatus === 'NOT_FOUND' || raw.includes('NOT_FOUND')) {
    return {
      status: 502,
      message: '利用しているAIモデルが見つかりませんでした。',
      errorCode: `NOT_FOUND (${httpStatus ?? 404})`,
      rawDetail: raw.slice(0, 300),
      hint: '一時的な設定不整合の可能性があります。時間をおいて再度お試しください。',
      attemptedModels,
    };
  }
  if (httpStatus === 429 || apiStatus === 'RESOURCE_EXHAUSTED' || raw.includes('RESOURCE_EXHAUSTED')) {
    return {
      status: 429,
      message: 'Gemini APIの利用回数・レート制限（クォータ上限）に達したため、解析を実行できませんでした。',
      errorCode: `RESOURCE_EXHAUSTED (${httpStatus ?? 429})`,
      rawDetail: raw.slice(0, 300),
      hint: '短時間に連続して解析したか、無料枠の上限（1分間または1日あたりのリクエスト上限）に達している可能性があります。1分ほど待ってから再試行するか、Settings > Secrets で課金が有効なAPIキーをご確認ください。',
      attemptedModels,
    };
  }
  if (httpStatus === 503 || apiStatus === 'UNAVAILABLE' || raw.includes('UNAVAILABLE')) {
    return {
      status: 503,
      message: 'Gemini APIサーバーがただいま非常に混雑しています。',
      errorCode: `UNAVAILABLE (${httpStatus ?? 503})`,
      rawDetail: raw.slice(0, 300),
      hint: '一時的なアクセス集中です。数秒〜1分ほど待ってから「もう一度解析する」を押してください。',
      attemptedModels,
    };
  }
  if (httpStatus === 400 || apiStatus === 'INVALID_ARGUMENT') {
    return {
      status: 400,
      message: '送信された画像データまたはリクエスト内容をAIが処理できませんでした。',
      errorCode: `INVALID_ARGUMENT (${httpStatus ?? 400})`,
      rawDetail: raw.slice(0, 300),
      hint: '別のJPEG/PNG画像でお試しください。',
      attemptedModels,
    };
  }
  if (error instanceof SyntaxError) {
    return {
      status: 502,
      message: 'AIからの解析結果データ（JSON）の読み取りに失敗しました。',
      errorCode: 'INVALID_AI_JSON',
      rawDetail: raw.slice(0, 300),
      hint: '写真を変えたり、少し時間を置いてから「もう一度解析する」をお試しください。',
      attemptedModels,
    };
  }
  return {
    status: httpStatus && httpStatus >= 400 && httpStatus < 600 ? httpStatus : 500,
    message: '写真の解析中に予期しないエラーが発生しました。',
    errorCode: apiStatus
      ? `${apiStatus} (${httpStatus ?? 500})`
      : `ERROR (${httpStatus ?? 500})`,
    rawDetail: raw.slice(0, 300),
    hint: '通信状態や別の写真をご確認のうえ、しばらく待ってから再度お試しください。',
    attemptedModels,
  };
}

async function generateWithRetryAndFallback(
  ai: GoogleGenAI,
  buildParams: (model: string) => Parameters<GoogleGenAI['models']['generateContent']>[0],
): Promise<{
  response: Awaited<ReturnType<GoogleGenAI['models']['generateContent']>>;
  modelUsed: string;
  attemptedModels: string[];
}> {
  const models = ['gemini-4-hydrogen', 'gemini-3.1-flash-lite'];
  const attemptedModels: string[] = [];
  let lastError: unknown;

  for (const model of models) {
    attemptedModels.push(model);
    for (let attempt = 0; attempt <= 1; attempt++) {
      try {
        const response = await ai.models.generateContent(buildParams(model));
        return { response, modelUsed: model, attemptedModels };
      } catch (error) {
        lastError = error;
        const { httpStatus, apiStatus, apiMessage } = extractUpstreamDetails(error);
        const raw = apiMessage ?? '';

        const isRateLimit =
          httpStatus === 429 ||
          apiStatus === 'RESOURCE_EXHAUSTED' ||
          raw.includes('RESOURCE_EXHAUSTED');

        const isServerTransient =
          httpStatus === 503 ||
          httpStatus === 500 ||
          apiStatus === 'UNAVAILABLE' ||
          raw.includes('UNAVAILABLE');

        // On 429 rate limit, immediately try the fallback model rather than hammering the same bucket
        if (isRateLimit) {
          break;
        }
        if (!isServerTransient) {
          throw Object.assign(error instanceof Error ? error : new Error(raw), {
            attemptedModels,
            status: httpStatus,
          });
        }
        if (attempt === 0) {
          await new Promise((resolve) => setTimeout(resolve, 800));
        }
      }
    }
  }

  if (lastError && typeof lastError === 'object') {
    (lastError as { attemptedModels?: string[] }).attemptedModels = attemptedModels;
  }
  throw lastError;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '12mb' }));
  app.use(
    (
      err: unknown,
      _req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const errObj = err as { type?: string; status?: number; message?: string } | null;
      if (errObj?.type === 'entity.too.large' || errObj?.status === 413) {
        res.status(413).json({
          error: '送信された画像データのサイズが大きすぎます。',
          errorCode: 'PAYLOAD_TOO_LARGE (413)',
          rawDetail: errObj.message ?? 'リクエストサイズが上限（12MB）を超えました。',
          hint: 'より小さいサイズの写真をお試しください。',
        });
        return;
      }
      if (err instanceof SyntaxError && errObj?.status === 400) {
        res.status(400).json({
          error: 'リクエストデータの形式が正しくありません。',
          errorCode: 'MALFORMED_REQUEST_JSON (400)',
          rawDetail: err.message,
          hint: 'ページを再読み込みしてからもう一度お試しください。',
        });
        return;
      }
      next(err);
    },
  );

  app.post('/api/analyze-meal', async (req, res) => {
    try {
      const body = req.body as { imageBase64?: unknown; mimeType?: unknown };
      if (typeof body?.imageBase64 !== 'string' || typeof body?.mimeType !== 'string') {
        res.status(400).json({
          error: '画像データと形式を正しく送信してください。',
          errorCode: 'INVALID_REQUEST_PARAMS (400)',
          rawDetail: 'imageBase64 または mimeType が指定されていません。',
          hint: 'もう一度写真を選び直してお試しください。',
        });
        return;
      }

      const mimeType = body.mimeType.trim().toLowerCase();
      if (!ALLOWED_MIME_TYPES.has(mimeType)) {
        res.status(400).json({
          error: '対応していない画像形式です（JPEG / PNG / WebP に対応しています）。',
          errorCode: 'UNSUPPORTED_MIME_TYPE (400)',
          rawDetail: `受信した形式: ${mimeType}`,
          hint: 'JPEG、PNG、またはWebP形式の画像を選択してください。',
        });
        return;
      }

      const cleanBase64 = stripDataUrlPrefix(body.imageBase64.trim());
      if (!cleanBase64 || cleanBase64.length > MAX_BASE64_LENGTH) {
        res.status(400).json({
          error: '画像サイズが大きすぎるか、空のデータです。別の画像をお試しください。',
          errorCode: 'IMAGE_SIZE_INVALID (400)',
          rawDetail: `Base64データ長: ${cleanBase64.length} 文字`,
          hint: '10MB以下の写真を選択してください。',
        });
        return;
      }

      const ai = getGeminiClient();

      const prompt = `あなたは日本の若者向けに、食事の写真から野菜を見つけて栄養素をわかりやすく教えてあげる親しみやすい食生活アドバイザーです。
添付された画像をじっくり観察し、実際に写っている料理と野菜のみを分析してください。

【重要なルール】
1. 固定のテンプレートではなく、必ず「この写真に実際に写っているもの」だけに基づいて回答してください。
2. 食事・料理ではない写真の場合、または野菜がまったく見当たらない料理（例：素うどん、白ご飯のみ等）の場合は、無理に野菜を創作せず、vegetablesを空配列 [] にして、dishSummary と adviceNote で正直かつやさしく説明してください。
3. 野菜の名前は必ず日本語で表記してください（例：ブロッコリー、トマト、ミニトマト、にんじん、キャベツ、ほうれん草、チンゲン菜、春菊、サニーレタス、カリフラワー、セロリ、ゴーヤ、たけのこ、そら豆、さやいんげん、絹さや、グリーンピース、大葉、にんにく、しょうが、みょうが、三つ葉、パセリ、菜の花 など）。薬味・香味野菜（大葉、みょうが、三つ葉、パセリ、しょうが、にんにく）や豆・山菜系野菜（そら豆、さやいんげん、絹さや、グリーンピース、たけのこ）が写っている場合も丁寧に見つけてください。
4. 【重要・対象外】このアプリは野菜不足の解消を目的としているため、いも類（じゃがいも、さつまいも、里芋、長芋・山芋など）および果実類（アボカドや果物全般）は野菜としてカウントせず、vegetables 配列には絶対に含めないでください（料理全体として触れる場合は dishSummary や adviceNote に書くだけにしてください）。
5. 見た目が曖昧・細かく刻まれている・ソースやスープで隠れている・ピントが甘いなど、確実な判別が難しい野菜は、決して断定せず confidence を "estimated"（推定）または "unknown"（不明）にし、uncertaintyReason に「刻まれているため推定です」「ドレッシングに隠れて判別が難しいです」などの理由を短く書いてください。確実に分かる野菜は confidence を "confirmed" にしてください。
6. 不明な場合は野菜名を「不明な緑の葉物野菜」「不明な根菜」のように表現してください。
7. 各野菜につき、代表的な栄養素を2〜4個挙げ、それぞれ「name（栄養素名）」と「benefit（体へのやさしい働き・役割）」を親しみやすい日本語で書いてください。
8. 【厳守】写真だけでは正確なグラム数、摂取量、栄養素の含有量（mg、kcalなど）や「1日分の〇%」といった数値は判断できないため、絶対に断定しないでください。「〜が含まれていると考えられます」「〜をサポートするとされています」のような表現を使ってください。
9. cautionNote には「写真からの見た目による推定であり、調理法や量によって栄養価は異なること」「違う場合は編集できること」を短くまとめてください。`;

      const { response, attemptedModels } = await generateWithRetryAndFallback(ai, (model) => ({
        model,
        contents: {
          parts: [
            {
              inlineData: {
                mimeType,
                data: cleanBase64,
              },
            },
            { text: prompt },
          ],
        },
        config: {
          systemInstruction:
            'You are a careful, accurate Japanese culinary & nutrition vision assistant. Never fabricate ingredients that are not visually supported in the image, and never state exact gram weights or definitive nutrient quantities.',
          thinkingConfig: {
            thinkingLevel:
              model === 'gemini-3.1-flash-lite'
                ? ThinkingLevel.MINIMAL
                : ThinkingLevel.LOW,
          },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isFoodPhoto: {
                type: Type.BOOLEAN,
                description: '写真が食事や飲み物・食材に関するものかどうか。',
              },
              dishName: {
                type: Type.STRING,
                description: '料理の簡潔な日本語名（例：彩り野菜ボウル、豚汁定食、シーザーサラダ）。15文字以内程度。',
              },
              dishSummary: {
                type: Type.STRING,
                description: '写真に写っている料理全体のやさしい日本語の要約（1〜2文）。',
              },
              vegetables: {
                type: Type.ARRAY,
                description: '写真から見つけた野菜のリスト。見当たらない場合は空配列。',
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: {
                      type: Type.STRING,
                      description: '野菜の日本語名（不明な場合は「不明な〇〇野菜」など）。',
                    },
                    confidence: {
                      type: Type.STRING,
                      description: 'confirmed（明確に判別可能）、estimated（形状や色からの推定）、unknown（判別困難・不明）のいずれか。',
                    },
                    uncertaintyReason: {
                      type: Type.STRING,
                      description: 'estimatedまたはunknownの場合の理由。confirmedの場合は空文字。',
                    },
                    nutrients: {
                      type: Type.ARRAY,
                      description: 'その野菜に含まれる主な栄養素（2〜4個）。',
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          name: {
                            type: Type.STRING,
                            description: '栄養素の日本語名（例：ビタミンC、食物繊維、β-カロテン）。',
                          },
                          benefit: {
                            type: Type.STRING,
                            description: 'その栄養素の主な働き。断定や正確な摂取量の表現は避け、親しみやすく簡潔に。',
                          },
                        },
                        required: ['name', 'benefit'],
                      },
                    },
                  },
                  required: ['name', 'confidence', 'nutrients'],
                },
              },
              adviceNote: {
                type: Type.STRING,
                description: 'この食事の写真に対する前向きで押し付けがましくないひとことアドバイス（1〜2文）。',
              },
              cautionNote: {
                type: Type.STRING,
                description: '写真からは正確な摂取量や栄養量を断定できない旨のやさしい注意書き。',
              },
            },
            required: ['isFoodPhoto', 'dishSummary', 'vegetables', 'adviceNote', 'cautionNote'],
          },
        },
      }));

      const rawText = stripMarkdownJsonFences(response.text ?? '');
      if (!rawText) {
        res.status(502).json({
          error: 'AIからの解析結果が空でした。',
          errorCode: 'EMPTY_AI_RESPONSE',
          rawDetail: 'Gemini API が空のレスポンスを返しました。',
          hint: '別の写真をお試しいただくか、もう一度解析を実行してください。',
          attemptedModels,
        });
        return;
      }

      const parsed = JSON.parse(rawText) as {
        isFoodPhoto?: boolean;
        dishName?: string;
        dishSummary?: string;
        vegetables?: Array<{
          name?: string;
          confidence?: string;
          uncertaintyReason?: string;
          nutrients?: Array<{ name?: string; benefit?: string }>;
        }>;
        adviceNote?: string;
        cautionNote?: string;
      };

      const dishSummary =
        typeof parsed.dishSummary === 'string' && parsed.dishSummary.trim()
          ? parsed.dishSummary.trim()
          : 'お食事の写真をチェックしました。';

      const dishName =
        typeof parsed.dishName === 'string' && parsed.dishName.trim()
          ? parsed.dishName.trim()
          : dishSummary.slice(0, 20);

      const normalized = {
        isFoodPhoto: Boolean(parsed.isFoodPhoto ?? true),
        dishName,
        dishSummary,
        vegetables: Array.isArray(parsed.vegetables)
          ? parsed.vegetables
              .filter(
                (veg) =>
                  typeof veg?.name !== 'string' || !isExcludedTuberOrFruit(veg.name),
              )
              .map((veg, vIdx) => ({
                id: `veg-${Date.now()}-${vIdx}`,
                name: typeof veg.name === 'string' && veg.name.trim() ? veg.name.trim() : '不明な野菜',
                confidence: normalizeConfidence(veg.confidence),
                uncertaintyReason:
                  typeof veg.uncertaintyReason === 'string' && veg.uncertaintyReason.trim()
                    ? veg.uncertaintyReason.trim()
                    : undefined,
                nutrients: Array.isArray(veg.nutrients)
                  ? veg.nutrients
                      .filter((n) => typeof n?.name === 'string' && n.name.trim().length > 0)
                      .map((n, nIdx) => ({
                        id: `nut-${Date.now()}-${vIdx}-${nIdx}`,
                        name: String(n.name).trim(),
                        benefit:
                          typeof n.benefit === 'string' && n.benefit.trim()
                            ? n.benefit.trim()
                            : '日々の健やかな体調づくりに役立つとされています。',
                      }))
                  : [],
              }))
          : [],
        adviceNote:
          typeof parsed.adviceNote === 'string' && parsed.adviceNote.trim()
            ? parsed.adviceNote.trim()
            : 'いつもの食事に少しずつカラフルな野菜を取り入れてみましょう。',
        cautionNote:
          typeof parsed.cautionNote === 'string' && parsed.cautionNote.trim()
            ? parsed.cautionNote.trim()
            : '※ 写真の見た目をもとにした推定のため、正確な摂取量や栄養素の量を断定するものではありません。見た目と違う場合は下の編集ボタンから修正できます。',
      };

      res.json(normalized);
    } catch (error) {
      console.error('Error in /api/analyze-meal:', error);
      const attempted = (error as { attemptedModels?: string[] } | null)?.attemptedModels ?? [];
      const formatted = formatGeminiError(error, attempted);
      res.status(formatted.status).json({
        error: formatted.message,
        errorCode: formatted.errorCode,
        rawDetail: formatted.rawDetail,
        hint: formatted.hint,
        attemptedModels: formatted.attemptedModels,
      });
    }
  });

  app.post('/api/vegetable-nutrients', async (req, res) => {
    try {
      const body = req.body as { vegetableName?: unknown };
      if (typeof body?.vegetableName !== 'string') {
        res.status(400).json({ error: '野菜の名前を入力してください。' });
        return;
      }

      const vegetableName = body.vegetableName.trim();
      if (!vegetableName || vegetableName.length > 50) {
        res.status(400).json({ error: '野菜の名前は1〜50文字で入力してください。' });
        return;
      }

      const ai = getGeminiClient();
      const { response } = await generateWithRetryAndFallback(ai, (model) => ({
        model,
        contents: `日本語の野菜名「${vegetableName}」に一般的に含まれる主な栄養素を2〜4個と、それぞれの体への働きを若者向けにわかりやすく教えてください。摂取量やグラム数などの断定表現は避けてください。`,
        config: {
          thinkingConfig: {
            thinkingLevel:
              model === 'gemini-3.1-flash-lite'
                ? ThinkingLevel.MINIMAL
                : ThinkingLevel.LOW,
          },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              nutrients: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    benefit: { type: Type.STRING },
                  },
                  required: ['name', 'benefit'],
                },
              },
            },
            required: ['nutrients'],
          },
        },
      }));

      const rawText = stripMarkdownJsonFences(response.text ?? '');
      const parsed = JSON.parse(rawText) as {
        nutrients?: Array<{ name?: string; benefit?: string }>;
      };

      const nutrients = Array.isArray(parsed.nutrients)
        ? parsed.nutrients
            .filter((n) => typeof n?.name === 'string' && n.name.trim().length > 0)
            .slice(0, 4)
            .map((n, idx) => ({
              id: `nut-suggest-${Date.now()}-${idx}`,
              name: String(n.name).trim(),
              benefit:
                typeof n.benefit === 'string' && n.benefit.trim()
                  ? n.benefit.trim()
                  : '日々のコンディションを整えるのに役立つとされています。',
            }))
        : [];

      res.json({ nutrients });
    } catch (error) {
      console.error('Error in /api/vegetable-nutrients:', error);
      const attempted = (error as { attemptedModels?: string[] } | null)?.attemptedModels ?? [];
      const formatted = formatGeminiError(error, attempted);
      res.status(formatted.status).json({
        error: formatted.message,
        errorCode: formatted.errorCode,
        rawDetail: formatted.rawDetail,
        hint: formatted.hint,
        attemptedModels: formatted.attemptedModels,
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distDir)) {
      app.use(express.static(distDir));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distDir, 'index.html'));
      });
    }
  }

  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
