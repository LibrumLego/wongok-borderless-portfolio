import { Course, District, PlaceCategory, StampSlot, StampTier } from "@/types";

// 카카오 로컬 API로 거리 반경 600m를 조회해 실제 영업 중이 확인된 계열만 둔다
export const DISTRICTS: District[] = [
  { code: "indonesia", name: "인도네시아", shortName: "인도네시아" },
  { code: "chinese", name: "중국동포", shortName: "중국동포" },
  { code: "vietnam", name: "베트남", shortName: "베트남" },
  { code: "thai", name: "태국", shortName: "태국" },
  { code: "southasia", name: "인도·네팔", shortName: "인도·네팔" },
  { code: "centralasia", name: "중앙아시아", shortName: "중앙아시아" },
];

export const DISTRICT_NAME: Record<string, string> = Object.fromEntries(
  DISTRICTS.map((d) => [d.code, d.name])
);

export const DISTRICT_EMOJI: Record<string, string> = {
  indonesia: "🍚",
  chinese: "🥟",
  vietnam: "🍜",
  thai: "🍤",
  southasia: "🍛",
  centralasia: "🥖",
};

// 코스 아이콘. 홈과 코스 페이지가 같은 값을 써야 해서 여기 한 곳에 둔다.
export const COURSE_EMOJI: Record<string, string> = {
  "world-food": "🌏",
  neighbors: "🛒",
  family: "👨‍👩‍👧",
  "night-walk": "🌙",
  halal: "🕌",
  "quick-taste": "⏱️",
  spicy: "🌶️",
  noodle: "🍜",
};

export const CATEGORIES: { code: PlaceCategory | "all"; name: string }[] = [
  { code: "all", name: "전체" },
  { code: "restaurant", name: "음식점" },
  { code: "experience", name: "문화체험" },
  { code: "grocery", name: "식료품점" },
  { code: "photo", name: "포토스팟" },
];

// 원곡동 다문화음식거리 중심 좌표.
// 관광공사 OpenAPI(searchKeyword2)에 등록된 '안산다문화음식거리' 공식 좌표를 사용한다.
// 참고: '안산 다문화특구'(다문화길 16)는 37.329428, 126.790589 로 거의 같은 지점.
export const WONGOK_CENTER = { lat: 37.32905, lng: 126.790414 };

// 스탬프 칸: 특정 매장이 아닌 계열 단위.
// 인증은 안산 12경 스탬프투어와 같은 GPS 위치 인증 방식.
export const STAMP_SLOTS: StampSlot[] = [
  {
    id: "indonesia",
    name: "인도네시아",
    guide: "바타비아, 아네카라사, 누산따라 중 한 곳",
  },
  {
    id: "chinese",
    name: "중국동포",
    guide: "태산양꼬치, 연길초두부, 춘향산 중 한 곳",
  },
  {
    id: "vietnam",
    name: "베트남",
    guide: "베트남고향식당, 디유히엔콴 중 한 곳",
  },
  {
    id: "thai",
    name: "태국",
    guide: "수왈태국레스토랑, 팟타이 중 한 곳",
  },
  {
    id: "southasia",
    name: "인도·네팔",
    guide: "칸티푸르레스토랑, 뉴타지마할 중 한 곳",
  },
  {
    id: "centralasia",
    name: "중앙아시아",
    guide: "사마르칸트, 임페리아푸드, 트로이케밥 중 한 곳",
  },
  {
    id: "culture-center",
    name: "세계문화체험관",
    guide: "외국인주민지원본부 내 체험관 방문",
  },
  {
    id: "photo-spot",
    name: "포토존 인증",
    guide: "외국인주민센터 앞 이정표에서 인증",
  },
];

// 화면에 표시할 총 칸 수. STAMP_SLOTS를 늘리면 여권·진행률이 함께 따라온다.
export const STAMP_TOTAL = STAMP_SLOTS.length;

// 스탬프 완주 목표 안내
export const STAMP_GOAL = `6개 음식 계열과 세계문화체험관·포토존까지, ${STAMP_TOTAL}칸을 모두 채우면 여권 완성`;

// 단계별 배지: 완주까지 가지 않아도 중간 성취를 주어 이탈을 줄인다
export const STAMP_TIERS: StampTier[] = [
  {
    count: 3,
    emoji: "🥉",
    name: "첫 여권 도장",
    description: "세 곳을 방문했어요. 여행이 시작됐습니다",
  },
  {
    count: 6,
    emoji: "🥈",
    name: "골목 탐험가",
    description: "여섯 곳 완주! 절반을 훌쩍 넘었어요",
  },
  {
    count: STAMP_TOTAL,
    emoji: "🏅",
    name: "보더리스 완주자",
    description: `원곡동 ${STAMP_TOTAL}칸을 모두 채운 여행자`,
  },
];

// GPS 인증 반경 (m)
export const CHECKIN_RADIUS_M = 300;

// AI 가이드 예시 질문은 언어별로 달라야 해서 src/lib/i18n/ui.ts의
// guide.quickQuestions로 옮겼다. 데이터로 답할 수 있는 질문만 둔다는 원칙은 그대로다
// ('오늘 문 연 곳'처럼 영업시간이 필요한 질문은 넣지 않는다).

// 코스 7개 고정.
// 도보 시간·거리는 sampleData의 좌표로 실제 계산한 값(하버사인, 분속 67m 기준).
// 거리가 1km 남짓한 골목 안이라 이동은 대부분 1~2분이고, 총 소요시간은
// 각 가게에서 식사·체험하는 시간이 대부분을 차지한다.
export const COURSES: Course[] = [
  {
    id: "world-food",
    title: "세계음식 투어",
    summary: "한 끼 제대로 먹고, 걸으며 간식 · 장보기 구경까지",
    durationMinutes: 180,
    steps: [
      {
        placeId: "vietnam-hometown",
        placeName: "베트남고향식당",
        kind: "meal",
        hasStamp: true,
      },
      {
        placeId: "troy-kebab",
        placeName: "트로이케밥",
        kind: "snack",
        walkMinutesFromPrev: 2,
        walkDistanceFromPrev: "166m",
        hasStamp: true,
      },
      {
        placeId: "sin-china-food",
        placeName: "신중국식품",
        kind: "shop",
        walkMinutesFromPrev: 2,
        walkDistanceFromPrev: "159m",
        hasStamp: false,
      },
      {
        placeId: "suwal-thai",
        placeName: "수왈태국레스토랑",
        kind: "snack",
        walkMinutesFromPrev: 1,
        walkDistanceFromPrev: "95m",
        hasStamp: true,
      },
      {
        placeId: "borderless-photo",
        placeName: "국경없는거리 포토존",
        kind: "photo",
        walkMinutesFromPrev: 1,
        walkDistanceFromPrev: "39m",
        hasStamp: true,
      },
    ],
  },
  {
    // 이 거리의 진짜 얼굴은 식당이 아니라 주민들이 장 보는 가게들이다.
    // 나라별 식료품점을 이어 붙이면 '누가 여기서 어떻게 사는지'가 보인다.
    id: "neighbors",
    title: "이웃의 장보기",
    summary: "네팔·무슬림·중국·러시아 주민이 실제로 장 보는 가게들",
    durationMinutes: 90,
    steps: [
      { placeId: "k2-nepal", placeName: "K2네팔존", kind: "shop", hasStamp: false },
      {
        placeId: "almodina-halal",
        placeName: "알머디나할랄마트",
        kind: "shop",
        walkMinutesFromPrev: 1,
        walkDistanceFromPrev: "94m",
        hasStamp: false,
      },
      {
        placeId: "sin-china-food",
        placeName: "신중국식품",
        kind: "shop",
        walkMinutesFromPrev: 2,
        walkDistanceFromPrev: "129m",
        hasStamp: false,
      },
      {
        placeId: "imperia-food",
        placeName: "임페리아푸드",
        kind: "shop",
        walkMinutesFromPrev: 2,
        walkDistanceFromPrev: "105m",
        hasStamp: true,
      },
    ],
  },
  {
    id: "family",
    title: "가족 체험 코스",
    // 체험관이 주말·공휴일 휴관(관광공사 등록 정보)이라 코스 요약에서 먼저 밝힌다.
    summary: "평일 전용 · 체험관 회차(10:30·13:30·15:00)에 맞춘 아이 동반 반나절",
    durationMinutes: 180,
    steps: [
      {
        placeId: "culture-center",
        placeName: "세계문화체험관",
        kind: "experience",
        hasStamp: true,
      },
      {
        placeId: "imperia-food",
        placeName: "임페리아푸드 (간식)",
        kind: "snack",
        walkMinutesFromPrev: 5,
        walkDistanceFromPrev: "324m",
        hasStamp: true,
      },
      {
        placeId: "borderless-photo",
        placeName: "국경없는거리 포토존",
        kind: "photo",
        walkMinutesFromPrev: 2,
        walkDistanceFromPrev: "109m",
        hasStamp: true,
      },
    ],
  },
  {
    id: "night-walk",
    title: "야간 산책 코스",
    summary: "만국기 아래 포토존에서 시작해 케밥 한 손, 양꼬치로 마무리",
    durationMinutes: 120,
    steps: [
      {
        placeId: "borderless-photo",
        placeName: "국경없는거리 포토존",
        kind: "photo",
        hasStamp: true,
      },
      {
        placeId: "troy-kebab",
        placeName: "트로이케밥",
        kind: "snack",
        walkMinutesFromPrev: 1,
        walkDistanceFromPrev: "57m",
        hasStamp: true,
      },
      {
        placeId: "taesan-skewer",
        placeName: "태산양꼬치",
        kind: "meal",
        walkMinutesFromPrev: 4,
        walkDistanceFromPrev: "272m",
        hasStamp: true,
      },
    ],
  },
  {
    // 원곡동 거주민 중 무슬림(인도네시아·우즈베키스탄 등)이 많고, 방문객도
    // 가장 자주 묻는 조건이다. tags에 '할랄'이 실제로 있는 곳만 넣었다.
    id: "halal",
    title: "할랄 코스",
    summary: "할랄 표기가 확인된 식당과, 무슬림 주민이 장 보는 마트까지",
    durationMinutes: 150,
    steps: [
      {
        placeId: "jakarta-resto",
        placeName: "자카르타",
        kind: "snack",
        hasStamp: false,
      },
      {
        placeId: "batavia",
        placeName: "바타비아",
        kind: "meal",
        walkMinutesFromPrev: 1,
        walkDistanceFromPrev: "23m",
        hasStamp: true,
      },
      {
        placeId: "almodina-halal",
        placeName: "알머디나할랄마트",
        kind: "shop",
        walkMinutesFromPrev: 6,
        walkDistanceFromPrev: "377m",
        hasStamp: false,
      },
      {
        placeId: "borderless-photo",
        placeName: "국경없는거리 포토존",
        kind: "photo",
        walkMinutesFromPrev: 4,
        walkDistanceFromPrev: "244m",
        hasStamp: true,
      },
    ],
  },
  {
    // 안산역 환승·출장 중 짧게 들르는 사람을 위한 최소 코스.
    // 한 시간에 세 끼는 불가능하니 식사 한 곳 + 손에 들고 먹는 것 하나로 짠다.
    id: "quick-taste",
    title: "1시간 맛보기",
    summary: "환승 시간에 딱 맞춘 한 끼 + 케밥 한 손 + 인증샷",
    durationMinutes: 60,
    steps: [
      {
        placeId: "vietnam-hometown",
        placeName: "베트남고향식당",
        kind: "meal",
        hasStamp: true,
      },
      {
        placeId: "troy-kebab",
        placeName: "트로이케밥",
        kind: "snack",
        walkMinutesFromPrev: 2,
        walkDistanceFromPrev: "166m",
        hasStamp: true,
      },
      {
        placeId: "borderless-photo",
        placeName: "국경없는거리 포토존",
        kind: "photo",
        walkMinutesFromPrev: 1,
        walkDistanceFromPrev: "57m",
        hasStamp: true,
      },
    ],
  },
  {
    id: "spicy",
    title: "매운맛 코스",
    summary: "쓰촨 마라로 시작해 향신료 구경, 인도 커리로 마무리",
    durationMinutes: 150,
    steps: [
      {
        placeId: "chunhyangsan",
        placeName: "춘향산",
        kind: "meal",
        hasStamp: true,
      },
      {
        placeId: "sin-china-food",
        placeName: "신중국식품 (향신료 구경)",
        kind: "shop",
        walkMinutesFromPrev: 4,
        walkDistanceFromPrev: "272m",
        hasStamp: false,
      },
      {
        placeId: "new-taj-mahal",
        placeName: "뉴타지마할",
        kind: "meal",
        walkMinutesFromPrev: 2,
        walkDistanceFromPrev: "112m",
        hasStamp: true,
      },
    ],
  },
  {
    id: "noodle",
    title: "면 요리 코스",
    summary: "베트남 쌀국수 한 그릇, 그리고 면을 뽑고 파는 가게들",
    durationMinutes: 120,
    steps: [
      {
        placeId: "dieu-hien-quan",
        placeName: "디유히엔콴",
        kind: "meal",
        hasStamp: true,
      },
      {
        placeId: "ottugi-noodle",
        placeName: "오뚜기수타면 (면 뽑는 모습)",
        kind: "snack",
        walkMinutesFromPrev: 5,
        walkDistanceFromPrev: "316m",
        hasStamp: false,
      },
      {
        placeId: "jindallae-naengmyeon",
        placeName: "연길진달래냉면",
        kind: "snack",
        walkMinutesFromPrev: 5,
        walkDistanceFromPrev: "309m",
        hasStamp: false,
      },
    ],
  },
];
