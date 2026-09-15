import type { Place } from "@/types";

// Google Places 사진은 사진 리소스 이름을 보관할 수 없다. 따라서 이 모듈은
// 장소 상세를 열 때마다 텍스트 검색으로 다시 확인하고, 정적 데이터로 저장하지 않는다.
const GOOGLE_PLACES_BASE = "https://places.googleapis.com/v1";

interface GoogleAuthorAttribution {
  displayName?: string;
  uri?: string;
  photoUri?: string;
}

interface GooglePhoto {
  name?: string;
  widthPx?: number;
  heightPx?: number;
  googleMapsUri?: string;
  authorAttributions?: GoogleAuthorAttribution[];
}

interface GooglePlaceCandidate {
  id?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  location?: { latitude?: number; longitude?: number };
  businessStatus?: string;
  googleMapsUri?: string;
  nationalPhoneNumber?: string;
  photos?: GooglePhoto[];
}

interface GoogleTextSearchResponse {
  places?: GooglePlaceCandidate[];
}

export interface GooglePlacePhotoMatch {
  placeId?: string;
  photoName: string;
  googleMapsUri?: string;
  authors: GoogleAuthorAttribution[];
}

export function hasGooglePlacesApiKey(): boolean {
  return Boolean(process.env.GOOGLE_PLACES_API_KEY);
}

// 공백·괄호·기호 차이(예: "아네카 라사" / "아네카라사")만 허용한다.
// \W는 한글을 word 문자로 취급하지 않아 이름 전체를 지워 버리므로 사용하지 않는다.
// 부분 일치로 다른 지점·동명 식당의 사진이 붙는 일을 막기 위해 의도적으로 엄격하다.
function normalizeName(value: string): string {
  return value
    .toLocaleLowerCase("ko-KR")
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}]+/gu, "");
}

function canonicalName(value: string): string {
  return normalizeName(value)
    .replace(/(?:안산|원곡)(?:본점|점)$/u, "")
    .replace(/(?:본점|식당|레스토랑|restaurant)$/u, "");
}

function roadAndNumber(address: string): string | null {
  // 다문화2길처럼 도로명에 숫자가 포함된 주소도 보존한다.
  const match = address.match(/([\p{L}\p{N}]+(?:길|로))\s*(\d+(?:-\d+)?)/u);
  return match ? `${match[1]}${match[2]}` : null;
}

function distanceMeters(place: Place, candidate: GooglePlaceCandidate): number {
  const latitude = candidate.location?.latitude;
  const longitude = candidate.location?.longitude;
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return Number.POSITIVE_INFINITY;
  }

  const rad = Math.PI / 180;
  const latDistance = ((latitude! - place.lat) * rad) / 2;
  const lngDistance = ((longitude! - place.lng) * rad) / 2;
  const a =
    Math.sin(latDistance) ** 2 +
    Math.cos(place.lat * rad) * Math.cos(latitude! * rad) * Math.sin(lngDistance) ** 2;
  return 2 * 6_371_000 * Math.asin(Math.sqrt(a));
}

function comparablePhone(value?: string): string | null {
  if (!value) return null;
  const digits = value.replace(/\D/g, "");
  if (!digits) return null;
  return digits.startsWith("82") ? `0${digits.slice(2)}` : digits;
}

function hasSamePhone(place: Place, candidate: GooglePlaceCandidate): boolean {
  const expected = comparablePhone(place.tel);
  const actual = comparablePhone(candidate.nationalPhoneNumber);
  return Boolean(expected && actual && expected === actual);
}

function isSamePlace(place: Place, candidate: GooglePlaceCandidate): boolean {
  const candidateName = candidate.displayName?.text ?? "";
  const candidateAddress = candidate.formattedAddress ?? "";
  const expectedRoad = roadAndNumber(place.address);
  const compactAddress = candidateAddress.replace(/\s+/g, "");
  const hasSameRoadAndNumber = Boolean(
    expectedRoad && compactAddress.includes(expectedRoad)
  );
  const distanceM = distanceMeters(place, candidate);
  const actualName = canonicalName(candidateName);
  const expectedNames = [place.name, ...(place.nameAliases ?? [])].map(canonicalName);
  const hasCompatibleName = expectedNames.some((expectedName) => {
    const hasExactName = expectedName === actualName;
    const hasContainedName =
      Math.min(expectedName.length, actualName.length) >= 3 &&
      (expectedName.includes(actualName) || actualName.includes(expectedName));
    return hasExactName || (hasContainedName && (hasSameRoadAndNumber || distanceM <= 40));
  });
  const phoneMatches = hasSamePhone(place, candidate);

  return (
    candidate.businessStatus !== "CLOSED_PERMANENTLY" &&
    (hasCompatibleName || phoneMatches) &&
    candidateAddress.includes("안산") &&
    (hasSameRoadAndNumber || distanceM <= 80)
  );
}

function googlePhoneQuery(value: string): string | null {
  const digits = value.replace(/\D/g, "");
  if (!digits.startsWith("0") || digits.length < 9) return null;
  return `+82 ${digits.slice(1)}`;
}

function pickRepresentativePhoto(
  candidate: GooglePlaceCandidate
): GooglePhoto | null {
  const available = Array.from(
    new Map(
      (candidate.photos ?? [])
        .filter((photo): photo is GooglePhoto & { name: string } => Boolean(photo.name))
        .map((photo) => [photo.name, photo])
    ).values()
  );
  if (available.length === 0) return null;

  // 가로 비율을 우선하면 Google이 대표로 정한 매장 사진을 건너뛰고 뒤쪽의
  // 메뉴 사진이 선택될 수 있다. 장소 관련성이 높은 Google의 첫 사진을 따른다.
  return available[0];
}

async function fetchCandidateById(
  apiKey: string,
  placeId: string
): Promise<GooglePlaceCandidate | null> {
  const response = await fetch(
    `${GOOGLE_PLACES_BASE}/places/${encodeURIComponent(placeId)}?languageCode=ko&regionCode=KR`,
    {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "id,displayName,formattedAddress,location,businessStatus,googleMapsUri,nationalPhoneNumber,photos",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) return null;
  return (await response.json()) as GooglePlaceCandidate;
}

async function searchCandidates(
  apiKey: string,
  place: Place,
  textQuery: string,
  pageSize: number
): Promise<GooglePlaceCandidate[]> {
  const response = await fetch(`${GOOGLE_PLACES_BASE}/places:searchText`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask":
        "places.id,places.displayName,places.formattedAddress,places.location,places.businessStatus,places.googleMapsUri,places.nationalPhoneNumber,places.photos",
    },
    body: JSON.stringify({
      textQuery,
      languageCode: "ko",
      regionCode: "KR",
      pageSize,
      locationBias: {
        circle: {
          center: { latitude: place.lat, longitude: place.lng },
          radius: 250,
        },
      },
    }),
    cache: "no-store",
  });

  if (!response.ok) return [];
  const data = (await response.json()) as GoogleTextSearchResponse;
  return data.places ?? [];
}

async function searchNearbyCandidates(
  apiKey: string,
  place: Place
): Promise<GooglePlaceCandidate[]> {
  const includedTypes =
    place.category === "restaurant"
      ? ["restaurant"]
      : place.category === "grocery"
        ? ["grocery_store", "supermarket"]
        : [];
  if (includedTypes.length === 0) return [];

  const response = await fetch(`${GOOGLE_PLACES_BASE}/places:searchNearby`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask":
        "places.id,places.displayName,places.formattedAddress,places.location,places.businessStatus,places.googleMapsUri,places.nationalPhoneNumber,places.photos",
    },
    body: JSON.stringify({
      includedTypes,
      maxResultCount: 10,
      rankPreference: "DISTANCE",
      languageCode: "ko",
      regionCode: "KR",
      locationRestriction: {
        circle: {
          center: { latitude: place.lat, longitude: place.lng },
          radius: 100,
        },
      },
    }),
    cache: "no-store",
  });

  if (!response.ok) return [];
  const data = (await response.json()) as GoogleTextSearchResponse;
  return data.places ?? [];
}

function photoMatch(
  place: Place,
  candidates: GooglePlaceCandidate[]
): GooglePlacePhotoMatch | null {
  for (const candidate of candidates) {
    if (!isSamePlace(place, candidate)) continue;
    const photo = pickRepresentativePhoto(candidate);
    if (!photo?.name) continue;

    return {
      placeId: candidate.id,
      photoName: photo.name,
      googleMapsUri: photo.googleMapsUri ?? candidate.googleMapsUri,
      authors: photo.authorAttributions ?? [],
    };
  }
  return null;
}

/**
 * Google Places Text Search로 상호와 도로명 주소가 모두 일치하는 경우만 찾는다.
 * Photos 필드는 Pro SKU이므로, 카드 목록이 아니라 사용자가 연 장소 상세에서만 호출한다.
 */
export async function findGooglePlacePhoto(
  place: Place
): Promise<GooglePlacePhotoMatch | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return null;

  // 사람이 지도에서 확정한 ID가 있으면 그 지점만 사용한다. 사진이 없더라도
  // 동명인 이전 매장·다른 지점으로 재검색하지 않아 잘못된 사진 노출을 막는다.
  if (place.googlePlaceId) {
    const pinnedCandidate = await fetchCandidateById(apiKey, place.googlePlaceId);
    return pinnedCandidate ? photoMatch(place, [pinnedCandidate]) : null;
  }

  // 전화번호가 있는 곳은 Google 권장 형식(+82)으로 먼저 찾는다. 그 외에는
  // 상호+주소를 우선하고, 실패했을 때만 상호 단독 검색을 한 번 더 수행한다.
  const phoneQuery = place.tel ? googlePhoneQuery(place.tel) : null;
  const names = [place.name, ...(place.nameAliases ?? [])];
  const nameQueries = names.flatMap((name) => [`${name} ${place.address}`, name]);
  const queries = phoneQuery ? [phoneQuery, ...nameQueries] : nameQueries;

  for (const [index, query] of queries.entries()) {
    const candidates = await searchCandidates(
      apiKey,
      place,
      query,
      index === 0 ? 5 : 10
    );
    const match = photoMatch(place, candidates);
    if (match) return match;
  }

  // 상호 표기가 언어별로 크게 다른 업소는 텍스트 검색에서 누락될 수 있다.
  // 좌표 주변의 동일 업종을 한 번 더 확인하되 상호/전화·주소 검증은 유지한다.
  return photoMatch(place, await searchNearbyCandidates(apiKey, place));
}

/** Google이 반환한 사진 리소스 이름으로만 실제 이미지 URL을 받아온다. */
export async function resolveGooglePhotoUrl(
  photoName: string
): Promise<string | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return null;

  const safePath = photoName
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  const response = await fetch(
    `${GOOGLE_PLACES_BASE}/${safePath}/media?maxWidthPx=1200&skipHttpRedirect=true`,
    {
      headers: { "X-Goog-Api-Key": apiKey },
      cache: "no-store",
    }
  );
  if (!response.ok) return null;

  const data = (await response.json()) as { photoUri?: string };
  return data.photoUri ?? null;
}
