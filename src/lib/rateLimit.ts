import { NextRequest } from "next/server";

/**
 * 공개 API 라우트용 레이트 리밋.
 *
 * UPSTASH_REDIS_REST_URL/TOKEN이 설정된 운영 환경에서는 Redis를 사용해
 * 서버리스 인스턴스 전체에 공유되는 제한을 적용한다. 개발 환경이나 아직
 * Redis를 연결하지 않은 환경에서는 안전한 기능 저하를 위해 메모리 제한을 쓴다.
 * Redis를 설정한 뒤 연결에 실패하면 요청을 막아(OpenAI 비용보다 가용성을 우선)
 * 장애가 비용 폭증으로 이어지지 않게 한다.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();
const redisUrl = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, "");
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const hasRedisRateLimit = Boolean(redisUrl && redisToken);

// 메모리 누수 방지: 항목이 일정 수를 넘으면 만료된 것부터 정리
const MAX_BUCKETS = 5000;

function sweep(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
  // 그래도 넘치면 가장 오래된 것부터 버린다
  if (buckets.size > MAX_BUCKETS) {
    const excess = buckets.size - MAX_BUCKETS;
    let i = 0;
    for (const key of buckets.keys()) {
      if (i++ >= excess) break;
      buckets.delete(key);
    }
  }
}

export function getClientId(req: NextRequest): string {
  // Vercel은 x-forwarded-for에 실제 클라이언트 IP를 넣어준다
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSec: number;
}

function checkLocalRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  if (buckets.size > MAX_BUCKETS) sweep(now);

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSec: 0 };
  }

  if (bucket.count >= limit) {
    return {
      allowed: false,
      retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterSec: 0 };
}

interface RedisPipelineItem {
  result?: unknown;
}

async function checkRedisRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const ttlSec = Math.max(1, Math.ceil(windowMs / 1000));
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2_000);

  try {
    // INCR + EXPIRE를 한 pipeline으로 보내 같은 키의 TTL을 항상 갱신한다.
    // 제한을 초과한 요청도 카운트해서, 연타자가 윈도우를 우회하지 못하게 한다.
    const response = await fetch(`${redisUrl}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${redisToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", `wongok:rate-limit:${key}`],
        ["EXPIRE", `wongok:rate-limit:${key}`, String(ttlSec)],
        ["TTL", `wongok:rate-limit:${key}`],
      ]),
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) throw new Error(`Rate limit store error: ${response.status}`);

    const pipeline = (await response.json()) as RedisPipelineItem[];
    const count = Number(pipeline[0]?.result);
    const ttl = Number(pipeline[2]?.result);

    if (!Number.isFinite(count)) throw new Error("Invalid rate limit store response");

    return {
      allowed: count <= limit,
      retryAfterSec:
        count <= limit ? 0 : Math.max(1, Number.isFinite(ttl) ? ttl : ttlSec),
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  if (!hasRedisRateLimit) return checkLocalRateLimit(key, limit, windowMs);

  try {
    return await checkRedisRateLimit(key, limit, windowMs);
  } catch {
    // Redis 환경변수를 넣은 운영 환경에서는 저장소 장애 때 비용 발생 API를 열지 않는다.
    return { allowed: false, retryAfterSec: 60 };
  }
}
