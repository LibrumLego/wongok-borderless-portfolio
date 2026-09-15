/**
 * 원곡동 다문화음식거리에 실제로 영업 중인 음식 계열로 구분한다.
 * 카카오 로컬 API로 거리 반경 600m를 조회해 확인된 가게만 담는다.
 *
 * - southasia: 인도·네팔 계열이 한 가게에서 함께 나오는 경우가 많아 묶었다
 * - centralasia: 우즈베키스탄·러시아권·튀르키예
 *   ('고려인'은 선부동 땟골에 밀집한 별개 집단이라 원곡동 구역명으로는 쓰지 않는다)
 */
export type DistrictCode =
  | "indonesia"
  | "chinese"
  | "vietnam"
  | "thai"
  | "southasia"
  | "centralasia";

export interface District {
  code: DistrictCode;
  name: string;
  shortName: string;
}

export type PlaceCategory = "restaurant" | "experience" | "grocery" | "photo";

// 현장 인증용 문화 퀴즈. GPS만으로는 위치 위조를 막기 어려워, 그 장소의
// 문화 스토리를 실제로 읽어야 풀 수 있는 문제를 한 단계 더 둔다.
export interface CultureQuiz {
  question: string;
  options: string[];
  answerIndex: number;
  hint: string;
}

export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  district: DistrictCode;
  /** 카카오 로컬 API가 준 실제 좌표 */
  lat: number;
  lng: number;
  /** 도로명 주소 (카카오 로컬 API 확인값) */
  address: string;
  /** 안산역 4호선 기준 도보 추정(직선거리 × 1.3, 분속 67m) */
  walkMinutes: number;
  tel?: string;
  /**
   * 외부 지도 서비스의 장소 상세 URL.
   * 영업시간·평점·리뷰를 우리가 복제하지 않고 최신 정보가 있는 페이지로 보낸다.
   */
  placeUrl?: string;
  /** 지도 서비스마다 다른 상호 표기를 안전하게 대조하기 위한 별칭. */
  nameAliases?: string[];
  /** 사람이 상호·주소를 대조해 확정한 Google Places 장소 ID. */
  googlePlaceId?: string;
  /** 네이버 지도에서 상호·주소와 함께 확인한 장소 ID. */
  naverPlaceId?: string;
  /** 지도 핀 좌표를 최종 확인한 기준. */
  locationSource?: "naver" | "kakao" | "curated";
  tags: string[];
  description?: string;
  story?: string;
  /** 직접 촬영했거나 사용 허가·출처가 확인된 대표 사진만 설정한다. */
  imageUrl?: string;
  stampSlot?: StampSlotId;
  quiz?: CultureQuiz;
}

// 스탬프 칸: 매장 단위가 아닌 카테고리 단위 (후보 매장 중 한 곳만 방문하면 획득).
// 칸 수는 STAMP_SLOTS 길이로 계산하니, 여기에 추가하면 화면도 따라 늘어난다.
export type StampSlotId =
  | "indonesia"
  | "chinese"
  | "vietnam"
  | "thai"
  | "southasia"
  | "centralasia"
  | "culture-center"
  | "photo-spot";

export interface StampSlot {
  id: StampSlotId;
  name: string;
  guide: string;
}

export interface StampRecord {
  slotId: StampSlotId;
  placeId: string;
  collectedAt: string;
}

// 2·4·6칸 달성마다 주는 단계별 배지. 완주 전에도 성취를 주어 이탈을 줄인다.
export interface StampTier {
  count: number;
  emoji: string;
  name: string;
  description: string;
}

/**
 * 정거장에서 실제로 하는 일.
 *
 * 이게 없으면 코스가 '식당 다섯 곳'이 되어버린다. 한 사람이 네 시간에 정식을
 * 다섯 번 먹을 수는 없으니, 제대로 앉아 먹는 곳은 한두 곳으로 두고 나머지는
 * 손에 들고 걷는 간식·구경·체험으로 채워야 실제로 돌 수 있는 코스가 된다.
 */
export type StepKind = "meal" | "snack" | "experience" | "photo" | "shop";

export interface CourseStep {
  placeId: string;
  placeName: string;
  kind: StepKind;
  walkMinutesFromPrev?: number;
  walkDistanceFromPrev?: string;
  hasStamp: boolean;
}

export interface Course {
  id: string;
  title: string;
  summary: string;
  durationMinutes: number;
  steps: CourseStep[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
