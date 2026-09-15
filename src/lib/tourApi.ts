// 한국관광공사 국문 관광정보 서비스(KorService2) 서버 사이드 클라이언트.
// 규정상 OpenAPI 실시간 호출 필수(파일데이터 불인정), 원천 데이터 가공 비권장.
import { CURATED_GROUPS, type CuratedGroupId } from "./ansanLinks";

const TOUR_API_BASE = "https://apis.data.go.kr/B551011/KorService2";

// 원곡동 다문화음식거리 중심 좌표 (관광공사 OpenAPI 등록 좌표와 동일)
const WONGOK_CENTER = { lat: 37.32905, lng: 126.790414 };

// TourAPI 지역코드: 경기도 31 / 안산시 15 (areaCode2 오퍼레이션으로 확인 가능)
export const AREA_GYEONGGI = "31";
export const SIGUNGU_ANSAN = "15";

export interface TourItem {
  contentId: string;
  title: string;
  address: string;
  imageUrl: string;
  mapX: string;
  mapY: string;
  tel: string;
  contentTypeId: string;
  /** 좌표 기반 조회(locationBasedList2)에서만 채워지는 중심점까지 거리(m) */
  distanceM?: number;
}

interface TourApiParams {
  [key: string]: string | number | undefined;
}

interface RawTourResponse {
  response?: {
    header?: { resultCode?: string; resultMsg?: string };
    body?: {
      items?: { item?: RawTourItem[] | RawTourItem } | "";
      totalCount?: number;
    };
  };
}

interface RawTourItem {
  contentid?: string;
  title?: string;
  addr1?: string;
  firstimage?: string;
  mapx?: string;
  mapy?: string;
  tel?: string;
  contenttypeid?: string;
  overview?: string;
  homepage?: string;
  /** locationBasedList2가 주는 중심점까지 거리(m, 소수점 포함 문자열) */
  dist?: string;
}

/**
 * 상세 조회 결과. detailCommon2(개요·홈페이지)에 detailIntro2(운영정보)를 합친다.
 *
 * 우리 데이터에는 영업시간이 없다고 계속 밝혀왔는데, 관광공사가 등록·관리하는
 * 관광지에 한해서는 detailIntro2가 실제 이용시간·휴무일·주차 여부를 준다.
 * 추정이 아니라 공공데이터 원문이므로 그대로 보여줄 수 있다.
 */
export interface TourDetail extends TourItem {
  overview: string;
  homepage: string;
  useTime: string;
  restDate: string;
  parking: string;
  infoCenter: string;
  /** detailImage2가 주는 추가 사진 URL. 대표 이미지(imageUrl)는 제외한다 */
  images: string[];
}

export function hasTourApiKey(): boolean {
  return Boolean(process.env.TOUR_API_KEY);
}

async function callTourApi(
  endpoint: string,
  params: TourApiParams
): Promise<TourItem[]> {
  const apiKey = process.env.TOUR_API_KEY;
  if (!apiKey) {
    throw new Error("TOUR_API_KEY_MISSING");
  }

  const query = new URLSearchParams({
    MobileOS: "ETC",
    // 운영계정 승인 요건: MobileApp 파라미터에 서비스 고유명 사용
    MobileApp: "WongokBorderless",
    _type: "json",
    numOfRows: "12",
    pageNo: "1",
    arrange: "O",
  });
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined) query.set(k, String(v));
  }

  // serviceKey는 이미 인코딩된 형태로 발급되므로 URLSearchParams를 거치지 않음
  const url = `${TOUR_API_BASE}/${endpoint}?serviceKey=${apiKey}&${query.toString()}`;
  const res = await fetch(url, { next: { revalidate: 1800 } });
  if (!res.ok) {
    throw new Error(`관광정보 API 호출 실패: ${res.status}`);
  }

  const data: RawTourResponse = await res.json();
  const code = data.response?.header?.resultCode;
  if (code && code !== "0000") {
    throw new Error(
      `관광정보 API 오류: ${data.response?.header?.resultMsg ?? code}`
    );
  }

  const itemsField = data.response?.body?.items;
  // items는 결과가 없을 때 빈 문자열("")로 오기도 하는 TourAPI 특유의 응답 형태
  const raw = itemsField ? (itemsField.item ?? []) : [];
  const list = Array.isArray(raw) ? raw : [raw];

  return list
    .filter((it) => it.title)
    .map((it) => ({
      contentId: it.contentid ?? "",
      title: it.title ?? "",
      address: it.addr1 ?? "",
      imageUrl: it.firstimage ?? "",
      mapX: it.mapx ?? "",
      mapY: it.mapy ?? "",
      tel: it.tel ?? "",
      contentTypeId: it.contenttypeid ?? "",
      ...(it.dist ? { distanceM: Math.round(Number(it.dist)) } : {}),
    }));
}

// 지역기반 관광정보 조회: 안산시 일대 관광지/문화시설 등
export function fetchAnsanSpots(contentTypeId?: string) {
  return callTourApi("areaBasedList2", {
    areaCode: AREA_GYEONGGI,
    sigunguCode: SIGUNGU_ANSAN,
    contentTypeId,
  });
}

/**
 * 손으로 고른 안산 연계 장소만 실시간 정보를 붙여 돌려준다.
 *
 * 지역기반 조회는 contentId 하나씩 부를 수 없어 관광지(12)·문화시설(14) 목록을
 * 통째로 받아 우리 명단으로 거른다. 목록 두 번이면 끝나고 각각 30분 캐시가
 * 걸리므로, 개별 상세를 여덟 번 부르는 것보다 API 할당량을 훨씬 덜 쓴다.
 *
 * 정렬은 API가 준 순서가 아니라 우리가 정한 순서(안산역에서 가까운 순)를 따른다.
 */
export async function fetchCuratedSpots(): Promise<
  (TourItem & { group: CuratedGroupId; distanceKm: number })[]
> {
  const [spots, culture] = await Promise.all([
    callTourApi("areaBasedList2", {
      areaCode: AREA_GYEONGGI,
      sigunguCode: SIGUNGU_ANSAN,
      contentTypeId: "12",
      numOfRows: "100",
    }),
    callTourApi("areaBasedList2", {
      areaCode: AREA_GYEONGGI,
      sigunguCode: SIGUNGU_ANSAN,
      contentTypeId: "14",
      numOfRows: "100",
    }),
  ]);

  const found = new Map([...spots, ...culture].map((it) => [it.contentId, it]));
  return CURATED_GROUPS.flatMap((g) =>
    g.spots.flatMap((s) => {
      const item = found.get(s.contentId);
      // 공공데이터에서 사라진 항목은 조용히 빠진다. 우리가 가진 이름만 남겨
      // 빈 카드를 만드는 것보다 낫다.
      if (!item) return [];
      return [{ ...item, group: g.id, distanceKm: s.distanceKm }];
    })
  );
}

/**
 * 좌표 기반 조회(locationBasedList2): 원곡동 다문화음식거리를 중심으로 가까운 순.
 *
 * 지역기반 조회(areaBasedList2)는 '안산시'로만 묶여 대부도·선감도처럼 20km 넘게
 * 떨어진 곳이 먼저 나온다. 원곡동을 방문한 사람이 이어서 갈 곳을 제안하려면
 * 실제 거리로 정렬해야 해서 이 오퍼레이션을 쓴다. 응답의 dist(m)도 그대로 쓴다.
 */
export async function fetchNearbySpots(radiusM = 3000) {
  const items = await callTourApi("locationBasedList2", {
    mapX: String(WONGOK_CENTER.lng),
    mapY: String(WONGOK_CENTER.lat),
    radius: String(radiusM),
    // 거리순 정렬(E) — 이 오퍼레이션에서만 쓸 수 있다
    arrange: "E",
  });

  // 원곡동은 시 경계와 가까워 반경 검색만 하면 시흥시 장소도 섞인다.
  // 서비스 범위에 맞게 안산시 주소만 노출한다.
  return items.filter((item) => item.address.includes("안산시"));
}

// 키워드 검색 조회
export function fetchKeywordSearch(keyword: string) {
  return callTourApi("searchKeyword2", {
    keyword,
    areaCode: AREA_GYEONGGI,
    sigunguCode: SIGUNGU_ANSAN,
  });
}

const stripTags = (s: string) =>
  s
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();

/** 상세 계열 오퍼레이션에서 여러 건이 오는 경우(사진 목록 등) */
async function callDetailList(
  endpoint: string,
  params: Record<string, string>
): Promise<Record<string, string>[]> {
  const apiKey = process.env.TOUR_API_KEY;
  if (!apiKey) throw new Error("TOUR_API_KEY_MISSING");

  const query = new URLSearchParams({
    MobileOS: "ETC",
    MobileApp: "WongokBorderless",
    _type: "json",
    numOfRows: "10",
    pageNo: "1",
    ...params,
  });

  const res = await fetch(
    `${TOUR_API_BASE}/${endpoint}?serviceKey=${apiKey}&${query.toString()}`,
    { next: { revalidate: 1800 } }
  );
  if (!res.ok) throw new Error(`관광정보 조회 실패: ${res.status}`);

  const data: RawTourResponse = await res.json();
  const itemsField = data.response?.body?.items;
  const raw = itemsField ? (itemsField.item ?? []) : [];
  const list = Array.isArray(raw) ? raw : [raw];
  return list as unknown as Record<string, string>[];
}

/** 상세 계열 오퍼레이션 공통 호출부 */
async function callDetail(
  endpoint: string,
  params: Record<string, string>
): Promise<Record<string, string> | null> {
  const apiKey = process.env.TOUR_API_KEY;
  if (!apiKey) throw new Error("TOUR_API_KEY_MISSING");

  const query = new URLSearchParams({
    MobileOS: "ETC",
    MobileApp: "WongokBorderless",
    _type: "json",
    ...params,
  });

  const res = await fetch(
    `${TOUR_API_BASE}/${endpoint}?serviceKey=${apiKey}&${query.toString()}`,
    { next: { revalidate: 1800 } }
  );
  if (!res.ok) throw new Error(`관광정보 상세 조회 실패: ${res.status}`);

  const data: RawTourResponse = await res.json();
  const itemsField = data.response?.body?.items;
  const raw = itemsField ? itemsField.item : undefined;
  const it = Array.isArray(raw) ? raw[0] : raw;
  return (it as Record<string, string> | undefined) ?? null;
}

/**
 * 상세정보 조회. detailCommon2(개요)와 detailIntro2(운영정보)를 함께 부른다.
 *
 * detailIntro2는 contentTypeId에 따라 필드명이 달라진다. 관광지(12)는 usetime,
 * 문화시설(14)은 usetimeculture처럼 접미사가 붙어서, 알려진 후보 키를 순서대로
 * 훑어 처음 값이 있는 것을 쓴다. 운영정보가 없는 항목은 빈 문자열로 남고
 * 화면에서는 그 줄을 아예 그리지 않는다.
 */
export async function fetchTourDetail(
  contentId: string,
  contentTypeId?: string
): Promise<TourDetail | null> {
  const common = await callDetail("detailCommon2", { contentId });
  if (!common?.title) return null;

  const typeId = contentTypeId || common.contenttypeid || "";

  // 운영정보와 추가 사진은 있으면 좋은 정보라, 실패해도 개요는 그대로 보여준다
  const [intro, imageList] = await Promise.all([
    typeId
      ? callDetail("detailIntro2", { contentId, contentTypeId: typeId }).catch(
          () => null
        )
      : Promise.resolve(null),
    callDetailList("detailImage2", { contentId, imageYN: "Y" }).catch(() => []),
  ]);

  const mainImage = common.firstimage ?? "";
  const images = imageList
    .map((im) => im.originimgurl || im.smallimageurl || "")
    .filter((url) => url && url !== mainImage);

  const pick = (...keys: string[]) => {
    for (const k of keys) {
      const v = intro?.[k];
      if (v && String(v).trim()) return stripTags(String(v));
    }
    return "";
  };

  return {
    contentId: common.contentid ?? contentId,
    title: common.title,
    address: common.addr1 ?? "",
    imageUrl: mainImage,
    mapX: common.mapx ?? "",
    mapY: common.mapy ?? "",
    tel: common.tel ?? "",
    contentTypeId: typeId,
    overview: stripTags(common.overview ?? ""),
    homepage: stripTags(common.homepage ?? ""),
    useTime: pick("usetime", "usetimeculture", "usetimefestival", "opentimefood"),
    restDate: pick("restdate", "restdateculture", "restdatefood"),
    parking: pick("parking", "parkingculture", "parkingfood", "parkingleports"),
    infoCenter: pick(
      "infocenter",
      "infocenterculture",
      "infocenterfood",
      "sponsor1tel"
    ),
    images: images.slice(0, 6),
  };
}

/**
 * 다문화음식거리 자체의 공식 사진과 소개글.
 *
 * 이 거리는 관광공사에 관광지로 등록돼 있어 사진 5장과 소개글이 함께 온다.
 * 사진은 히어로 배경에, 소개글은 거리 안내에 쓴다. 우리가 쓴 문장이 아니라
 * 공공데이터 원문이라 출처가 분명하고, 안산시 홈페이지를 긁어올 이유가 없다.
 *
 * 소개글에는 우리가 따로 알 수 없던 사실이 들어 있다 — 특히 오전 11시부터
 * 오후 8시까지 차 없는 거리로 운영된다는 점은 방문 계획에 직접 영향을 준다.
 */
export const WONGOK_STREET_CONTENT_ID = "3035809";

export interface StreetIntro {
  photos: string[];
  overview: string;
  address: string;
}

export async function fetchStreetIntro(): Promise<StreetIntro> {
  const [common, list] = await Promise.all([
    callDetail("detailCommon2", {
      contentId: WONGOK_STREET_CONTENT_ID,
    }).catch(() => null),
    callDetailList("detailImage2", {
      contentId: WONGOK_STREET_CONTENT_ID,
      imageYN: "Y",
    }).catch(() => []),
  ]);

  const urls = [
    common?.firstimage ?? "",
    ...list.map((im) => im.originimgurl || im.smallimageurl || ""),
  ].filter(Boolean);

  return {
    // 같은 사진이 대표·목록에 겹쳐 오는 경우가 있어 중복을 제거한다
    photos: [...new Set(urls)],
    overview: stripTags(common?.overview ?? ""),
    address: common?.addr1 ?? "",
  };
}

export async function fetchStreetPhotos(): Promise<string[]> {
  return (await fetchStreetIntro()).photos;
}

/**
 * 행사정보 조회.
 *
 * 안산에 등록된 축제는 실제로 0건이라(2026-07 기준) 시군구를 좁히면 항상 빈
 * 목록이 온다. 화면에서는 이 오퍼레이션 대신 좌표 기반 조회를 쓰고 있고,
 * 이 함수는 API 라우트의 op=festival 경로용으로 남겨둔다.
 */
export function fetchAnsanFestivals(eventStartDate: string) {
  return callTourApi("searchFestival2", {
    eventStartDate,
    areaCode: AREA_GYEONGGI,
    sigunguCode: SIGUNGU_ANSAN,
  });
}
