import { Place } from "@/types";
import { distanceMeters } from "@/store/useStampStore";

/** 안산역 4호선 — 코스의 출발점 */
const STATION = { lat: 37.326859, lng: 126.789216 };

/** 직선거리에 보행 우회 계수를 곱하고 분속 67m로 나눈다 (sampleData와 같은 기준) */
const WALK_FACTOR = 1.3;
const METERS_PER_MIN = 67;

export interface RouteStep {
  place: Place;
  /** 앞 지점(첫 칸은 안산역)에서 여기까지 */
  walkMeters: number;
  walkMinutes: number;
}

export interface PlannedRoute {
  steps: RouteStep[];
  totalWalkMeters: number;
  totalWalkMinutes: number;
}

/**
 * 찜한 곳을 걸어서 도는 순서로 정렬한다.
 *
 * 안산역에서 출발해 매번 가장 가까운 다음 지점을 고르는 최근접 이웃 방식이다.
 * 최단 경로를 보장하지는 않지만, 거리가 1km 남짓한 골목 안이고 보통 3~5곳을
 * 담으므로 사람이 실제로 걷는 순서와 거의 일치한다. 여기서 굳이 엄밀한 TSP를
 * 풀어봐야 결과가 같고, 목록이 늘어도 즉시 계산되는 쪽이 낫다.
 *
 * 거리는 우리가 카카오 로컬 API로 확인한 좌표에서 나오므로 추정 라벨이 아니라
 * 실제 좌표 기반 값이다.
 */
export function planRoute(places: Place[]): PlannedRoute {
  const remaining = [...places];
  const steps: RouteStep[] = [];
  let cursor = STATION;

  while (remaining.length > 0) {
    let bestIndex = 0;
    let bestMeters = Infinity;

    remaining.forEach((p, i) => {
      const d = distanceMeters(cursor.lat, cursor.lng, p.lat, p.lng);
      if (d < bestMeters) {
        bestMeters = d;
        bestIndex = i;
      }
    });

    const [next] = remaining.splice(bestIndex, 1);
    const walkMeters = Math.round(bestMeters * WALK_FACTOR);
    steps.push({
      place: next,
      walkMeters,
      walkMinutes: Math.max(1, Math.round(walkMeters / METERS_PER_MIN)),
    });
    cursor = { lat: next.lat, lng: next.lng };
  }

  return {
    steps,
    totalWalkMeters: steps.reduce((sum, s) => sum + s.walkMeters, 0),
    totalWalkMinutes: steps.reduce((sum, s) => sum + s.walkMinutes, 0),
  };
}
