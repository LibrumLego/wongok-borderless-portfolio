import { NextRequest, NextResponse } from "next/server";
import {
  findGooglePlacePhoto,
  hasGooglePlacesApiKey,
  resolveGooglePhotoUrl,
} from "@/lib/googlePlacePhoto";
import { getPlace } from "@/lib/sampleData";
import { checkRateLimit, getClientId } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = {
  "Cache-Control": "private, no-store, max-age=0",
  "X-Content-Type-Options": "nosniff",
};

// 지도 카드는 화면에 들어온 항목만 요청한다. 빠르게 스크롤해도 현재 화면의
// 사진이 끊기지 않되 무제한 수집은 막을 수 있는 범위로 제한한다.
const PHOTO_LIMIT = 40;
const PHOTO_WINDOW_MS = 60_000;

function noPhoto() {
  return NextResponse.json({ available: false }, { headers: NO_STORE_HEADERS });
}

// Google은 사진 리소스 이름을 캐시할 수 없게 한다. meta와 media 요청 모두
// 매번 상호·주소를 다시 대조하며, 클라이언트·서버 어느 쪽에도 사진 이름을 저장하지 않는다.
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const mode = req.nextUrl.searchParams.get("mode") ?? "meta";
  const place = id ? getPlace(id) : undefined;

  if (!place || (mode !== "meta" && mode !== "media")) {
    return NextResponse.json({ error: "잘못된 사진 요청입니다." }, { status: 400 });
  }
  if (!hasGooglePlacesApiKey() || place.imageUrl) return noPhoto();

  const limit = await checkRateLimit(
    `place-photo:${getClientId(req)}`,
    PHOTO_LIMIT,
    PHOTO_WINDOW_MS
  );
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "사진 요청이 많습니다. 잠시 후 다시 시도해주세요." },
      { status: 429, headers: { ...NO_STORE_HEADERS, "Retry-After": String(limit.retryAfterSec) } }
    );
  }

  try {
    const match = await findGooglePlacePhoto(place);
    if (!match) return noPhoto();

    if (mode === "meta") {
      return NextResponse.json(
        {
          available: true,
          googleMapsUri: match.googleMapsUri ?? null,
          authors: match.authors.map((author) => ({
            name: author.displayName ?? "",
            uri: author.uri ?? "",
            photoUri: author.photoUri ?? "",
          })),
        },
        { headers: NO_STORE_HEADERS }
      );
    }

    const photoUrl = await resolveGooglePhotoUrl(match.photoName);
    if (!photoUrl) return noPhoto();
    const image = await fetch(photoUrl, { cache: "no-store" });
    if (!image.ok || !image.body) return noPhoto();

    return new NextResponse(image.body, {
      headers: {
        ...NO_STORE_HEADERS,
        "Content-Type": image.headers.get("Content-Type") ?? "image/jpeg",
      },
    });
  } catch (error) {
    console.warn("[api/place-photo] Google Places photo lookup failed", error);
    return noPhoto();
  }
}
