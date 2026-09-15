/**
 * 원곡동 다음에 이어 갈 만한 안산 안의 장소들.
 *
 * 왜 목록을 손으로 고르는가: 관광공사 지역기반 조회로 '안산시'를 부르면 80건이
 * 나오는데 그중 절반 가까이가 대부도의 캠핑장·낚시터·골프장이다. 안산역에서
 * 20~40km 떨어져 있고 차가 있어야 하며, 골목을 걷다 이어서 갈 곳이 아니다.
 * 그대로 뿌리면 '안산 관광지 목록'이 될 뿐 원곡동과 아무 관계가 없다.
 *
 * 그래서 두 가지 기준만 남겼다.
 *  1. 원곡동을 이해하는 데 도움이 되거나
 *  2. 안산역에서 지하철 몇 정거장 안에 실제로 이어 갈 수 있거나
 *
 * distanceKm는 안산역(37.326859, 126.789216)에서 각 장소의 공공데이터 좌표까지
 * 직선거리를 계산해 넣은 값이다. 지역기반 조회는 거리를 주지 않기 때문에
 * 우리가 계산해 고정해 둔다. 좌표가 바뀌면 다시 계산해야 한다.
 */

export interface CuratedSpot {
  contentId: string;
  contentTypeId: string;
  /** 안산역 기준 직선거리(km) */
  distanceKm: number;
  /** 사람 눈으로 확인한 이름 — 공공데이터가 바뀌면 눈치채려고 적어둔다 */
  refName: string;
}

export type CuratedGroupId = "near" | "people";

export const CURATED_GROUPS: {
  id: CuratedGroupId;
  spots: CuratedSpot[];
}[] = [
  {
    // 안산역에서 걷거나 한두 정거장. 같은 날에 붙일 수 있는 곳들.
    id: "near",
    spots: [
      {
        contentId: "2034480",
        contentTypeId: "12",
        distanceKm: 0.3,
        refName: "안산 다문화특구",
      },
      {
        contentId: "2757183",
        contentTypeId: "12",
        distanceKm: 1.1,
        refName: "신길역사유적공원",
      },
      {
        contentId: "2615489",
        contentTypeId: "12",
        distanceKm: 2.1,
        refName: "화랑유원지",
      },
      {
        contentId: "130556",
        contentTypeId: "14",
        distanceKm: 3.0,
        refName: "안산문화예술의전당",
      },
    ],
  },
  {
    // 안산이 기억하는 사람들. 네 곳이 상록구 한 구역에 모여 있어 하루로 묶인다
    // (김홍도미술관 공공데이터 소개문도 "주변에는 단원조각공원, 성호박물관 등이
    // 있어 함께 관광하기 좋다"고 적고 있다).
    id: "people",
    spots: [
      {
        contentId: "2615563",
        contentTypeId: "14",
        distanceKm: 5.7,
        refName: "김홍도미술관",
      },
      {
        contentId: "2757176",
        contentTypeId: "12",
        distanceKm: 6.4,
        refName: "단원조각공원",
      },
      {
        contentId: "130557",
        contentTypeId: "14",
        distanceKm: 6.4,
        refName: "성호박물관",
      },
      {
        contentId: "2362944",
        contentTypeId: "14",
        distanceKm: 7.2,
        refName: "최용신기념관",
      },
    ],
  },
];

export const CURATED_BY_ID = new Map(
  CURATED_GROUPS.flatMap((g) => g.spots).map((s) => [s.contentId, s])
);
