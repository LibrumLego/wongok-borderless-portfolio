"use client";

import Link from "next/link";
import { SAMPLE_PLACES } from "@/lib/sampleData";
import { planRoute } from "@/lib/routePlanner";
import { useFavoriteStore } from "@/store/useFavoriteStore";
import { useT } from "@/lib/i18n/useT";
import { localizePlace } from "@/lib/i18n/places";
import { WalkIcon } from "@/components/icons";

/**
 * 찜한 곳을 걷는 순서로 묶어주는 '내 코스'.
 *
 * 저장 기능만 두면 목록이 하나 더 생길 뿐이라, 우리가 가진 것(실측 좌표)으로
 * 한 걸음 더 간다 — 고른 곳들을 안산역에서 출발하는 도보 순서로 세우고 총
 * 걷는 시간을 알려준다. 정해진 코스 7개와 달리 방문객이 직접 고른 조합이다.
 */
export default function MyRoute() {
  const { t, lang } = useT();
  const ids = useFavoriteStore((s) => s.ids);
  const remove = useFavoriteStore((s) => s.remove);

  const places = ids
    .map((id) => SAMPLE_PLACES.find((p) => p.id === id))
    .filter((p): p is (typeof SAMPLE_PLACES)[number] => Boolean(p));

  // 한 곳만 저장해도 안산역에서 출발하는 다음 방문지를 바로 보여준다.
  if (places.length === 0) return null;

  const route = planRoute(places);

  return (
    <section className="rounded-2xl border border-orange/20 bg-orange-soft/40 p-4 md:rounded-3xl md:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-sm font-bold md:text-lg">{t.myRoute.title}</h2>
        <p className="shrink-0 text-[11px] text-navy/50 md:text-xs">
          {t.myRoute.summary(places.length, route.totalWalkMinutes)}
        </p>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-navy/70">{t.myRoute.estimateNote}</p>

      <ol className="mt-3 flex flex-col md:mt-4">
        {route.steps.map((step, i) => {
          const loc = localizePlace(step.place, lang);
          return (
            <li key={step.place.id} className="relative pl-7">
              {i < route.steps.length - 1 && (
                <span className="absolute left-[9px] top-6 h-[calc(100%-0.5rem)] w-0.5 rounded bg-orange/25" />
              )}
              <span className="absolute left-0 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange text-[10px] font-bold text-white">
                {i + 1}
              </span>
              <div className="flex min-h-11 items-center gap-1">
                <Link
                  href={`/place/${step.place.id}`}
                  className="min-w-0 truncate text-sm font-medium transition duration-150 hover:text-orange active:scale-95"
                >
                  {loc.name}
                  {loc.signName && (
                    <span lang="ko" className="ml-1.5 text-xs font-normal text-navy/40">
                      {loc.signName}
                    </span>
                  )}
                </Link>
                <button
                  type="button"
                  onClick={() => remove(step.place.id)}
                  aria-label={t.myRoute.remove(loc.name)}
                  className="ml-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm text-navy/65 transition hover:bg-navy/5 hover:text-navy"
                >
                  ✕
                </button>
              </div>
              <p className="flex items-center gap-1 pb-3 text-[11px] text-navy/45">
                <WalkIcon className="h-3 w-3" />
                {i === 0 ? t.myRoute.fromStation : t.myRoute.fromPrev}{" "}
                {step.walkMinutes}
                {t.common.minuteUnit} · {step.walkMeters}m
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
