import { NextRequest, NextResponse } from "next/server";
import {
  fetchAnsanFestivals,
  fetchAnsanSpots,
  fetchCuratedSpots,
  fetchKeywordSearch,
  fetchNearbySpots,
  fetchStreetIntro,
  fetchStreetPhotos,
  fetchTourDetail,
  hasTourApiKey,
} from "@/lib/tourApi";
import { checkRateLimit, getClientId } from "@/lib/rateLimit";

// 개발계정은 일일 1,000건 한도라, 한 명이 스크립트로 돌리면 심사 기간에
// 할당량이 소진돼 서비스가 죽는다. 캐시가 있어 실제 외부 호출은 더 적다.
const TOUR_LIMIT = 30;
const TOUR_WINDOW_MS = 60_000;

const MAX_KEYWORD_LENGTH = 40;
// 관광타입 코드 화이트리스트 (12 관광지, 14 문화시설, 15 행사, 28 레포츠,
// 32 숙박, 38 쇼핑, 39 음식점)
const ALLOWED_CONTENT_TYPES = new Set([
  "12",
  "14",
  "15",
  "25",
  "28",
  "32",
  "38",
  "39",
]);

// 서비스 키를 서버에만 두고 클라이언트에는 정제된 결과만 내려주는 프록시.
// GET /api/tour?op=area|nearby|keyword|festival|detail
export async function GET(req: NextRequest) {
  if (!hasTourApiKey()) {
    return NextResponse.json({ error: "TOUR_API_KEY_MISSING" }, { status: 503 });
  }

  const limit = await checkRateLimit(
    `tour:${getClientId(req)}`,
    TOUR_LIMIT,
    TOUR_WINDOW_MS
  );
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "요청이 너무 많아요. 잠시 후 다시 시도해주세요." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } }
    );
  }

  const sp = req.nextUrl.searchParams;
  const op = sp.get("op") ?? "area";

  try {
    if (op === "keyword") {
      const keyword = sp.get("keyword")?.trim();
      if (!keyword) {
        return NextResponse.json({ error: "keyword 필요" }, { status: 400 });
      }
      if (keyword.length > MAX_KEYWORD_LENGTH) {
        return NextResponse.json(
          { error: `검색어는 ${MAX_KEYWORD_LENGTH}자 이내여야 합니다` },
          { status: 400 }
        );
      }
      return NextResponse.json({ items: await fetchKeywordSearch(keyword) });
    }

    if (op === "photos") {
      return NextResponse.json(
        { photos: await fetchStreetPhotos() },
        {
          headers: {
            "Cache-Control": "public, max-age=1800, stale-while-revalidate=86400",
          },
        }
      );
    }

    // 거리 공식 소개문. 사진과 같은 contentId를 쓰지만 본문까지 함께 준다.
    if (op === "street") {
      const intro = await fetchStreetIntro();
      return NextResponse.json({
        overview: intro.overview,
        address: intro.address,
      });
    }

    // 우리가 고른 안산 연계 장소만. 목록 전체를 뿌리면 대부도 캠핑장이 올라온다.
    if (op === "curated") {
      return NextResponse.json({ items: await fetchCuratedSpots() });
    }

    if (op === "nearby") {
      // 반경은 숫자만, 최대 5km. 그 이상은 '원곡동에서 이어갈 곳'이라 보기 어렵다
      const raw = sp.get("radius");
      const radius = raw && /^\d{3,4}$/.test(raw) ? Number(raw) : 3000;
      return NextResponse.json({
        items: await fetchNearbySpots(Math.min(radius, 5000)),
      });
    }

    if (op === "detail") {
      const contentId = sp.get("contentId");
      // 숫자 id만 허용해 임의 값이 외부 API로 그대로 전달되지 않게 한다
      if (!contentId || !/^\d{1,12}$/.test(contentId)) {
        return NextResponse.json(
          { error: "올바른 contentId가 필요합니다" },
          { status: 400 }
        );
      }
      const typeId = sp.get("contentTypeId");
      const detail = await fetchTourDetail(
        contentId,
        typeId && ALLOWED_CONTENT_TYPES.has(typeId) ? typeId : undefined
      );
      if (!detail) {
        return NextResponse.json(
          { error: "해당 관광지 정보를 찾을 수 없습니다" },
          { status: 404 }
        );
      }
      return NextResponse.json({ detail });
    }

    if (op === "festival") {
      const from = sp.get("from");
      // YYYYMMDD 형식만 허용하고, 아니면 오늘 날짜로 대체
      const ymd =
        from && /^\d{8}$/.test(from)
          ? from
          : new Date().toISOString().slice(0, 10).replace(/-/g, "");
      return NextResponse.json({ items: await fetchAnsanFestivals(ymd) });
    }

    if (op !== "area") {
      return NextResponse.json(
        { error: "지원하지 않는 op 값입니다" },
        { status: 400 }
      );
    }

    const contentTypeId = sp.get("contentTypeId");
    if (contentTypeId && !ALLOWED_CONTENT_TYPES.has(contentTypeId)) {
      return NextResponse.json(
        { error: "지원하지 않는 contentTypeId 입니다" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      items: await fetchAnsanSpots(contentTypeId ?? undefined),
    });
  } catch (e) {
    // 내부 에러 메시지에는 외부 API 응답이 섞일 수 있으므로 클라이언트에는
    // 일반화된 문구만 주고, 상세 내용은 서버 로그로만 남긴다.
    console.error("[api/tour]", e);
    return NextResponse.json(
      { error: "관광정보를 불러오지 못했습니다" },
      { status: 502 }
    );
  }
}
