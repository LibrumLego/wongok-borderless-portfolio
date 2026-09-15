"use client";

import Link from "next/link";
import clsx from "clsx";
import { COURSES, COURSE_EMOJI } from "@/lib/constants";
import { getPlace } from "@/lib/sampleData";
import { ClockIcon, RouteIcon, StampIcon } from "@/components/icons";
import PageAtmosphere from "@/components/PageAtmosphere";
import Reveal from "@/components/Reveal";
import { useT } from "@/lib/i18n/useT";
import { localizePlace, localizeCourse } from "@/lib/i18n/places";

// 코스 안내문에 붙는 괄호 메모(예: "임페리아푸드 (간식)")는 sampleData 이름에
// 없는 코스 전용 문구라 여기서만 따로 번역을 붙인다.
// 정거장 성격별 색. 식사와 간식이 한눈에 구분돼야 코스가 실제로 돌 만한지 보인다.
const STEP_KIND_STYLE: Record<string, string> = {
  meal: "bg-orange text-white",
  snack: "bg-orange-soft text-orange",
  experience: "bg-navy text-white",
  photo: "bg-gold/15 text-gold",
  shop: "bg-navy/10 text-navy/70",
};

const STEP_NOTE: Record<
  string,
  Partial<Record<"en" | "zh" | "ja" | "ru" | "id", string>>
> = {
  "imperia-food": {
    en: " (snack)",
    zh: "（小吃）",
    ja: "（軽食）",
    ru: " (снек)",
    id: " (kudapan)",
  },
};

export default function CoursePage() {
  const { t, lang } = useT();

  return (
    <div className="page-shell flex flex-col gap-5 p-4 pt-5 md:mx-auto md:max-w-6xl md:gap-8 md:px-8 md:pt-10 md:pb-16">
      <PageAtmosphere variant="course" />
      <div className="page-intro-card fade-up flex items-center justify-between gap-4">
        <div>
          <p className="page-kicker">
            <span className="page-kicker-dot" />
            CURATED ROUTES
          </p>
          <h1 className="text-lg font-bold md:text-3xl">{t.course.title}</h1>
          <p className="mt-1 text-xs text-navy/50 md:mt-2 md:text-base">
            {t.course.subtitle}
          </p>
        </div>
        <span className="page-icon-tile">
          <RouteIcon className="h-6 w-6" />
        </span>
      </div>

      <p className="rounded-xl border border-navy/10 bg-white px-4 py-3 text-xs leading-relaxed text-navy/70">{t.myRoute.estimateNote}</p>
      <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:items-start md:gap-6 lg:grid-cols-3">
        {COURSES.map((course, i) => {
          const cLoc = localizeCourse(course, lang);
          return (
            <Reveal
              asSection
              key={course.id}
              delay={100 + i * 90}
              className="course-showcase-card interactive-panel group relative overflow-hidden rounded-3xl border border-navy/5 bg-white/90 p-5 shadow-sm backdrop-blur md:p-8"
            >
              <span className="course-card-number" aria-hidden="true">
                0{i + 1}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-3xl md:text-4xl">
                  {COURSE_EMOJI[course.id]}
                </span>
                <div>
                  <p className="font-bold md:text-xl">{cLoc.title}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-[11px] text-navy/45">
                    <ClockIcon className="h-3 w-3" />
                    {t.course.about} {Math.round(course.durationMinutes / 60)}
                    {t.common.hourUnit} · {course.steps.length}
                    {t.common.placeCountSuffix}
                  </p>
                </div>
              </div>
              <p className="mt-2.5 text-xs leading-relaxed text-navy/55 md:mt-4 md:text-sm">
                {cLoc.summary}
              </p>

              <ol className="mt-5 flex flex-col md:mt-7">
                {course.steps.map((step, i) => {
                  const next = course.steps[i + 1];
                  const place = getPlace(step.placeId);
                  const stepLoc = place ? localizePlace(place, lang) : null;
                  const stepName = stepLoc?.name ?? step.placeName;
                  const note =
                    lang !== "ko" ? STEP_NOTE[step.placeId]?.[lang] : undefined;
                  return (
                    <li key={step.placeId} className="relative pl-7">
                      {i < course.steps.length - 1 && (
                        <span className="course-route-line absolute left-[9px] top-6 h-[calc(100%-0.5rem)] w-0.5 rounded bg-orange/20" />
                      )}
                      <span className="absolute left-0 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange text-[10px] font-bold text-white">
                        {i + 1}
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5 pb-1">
                        {/* 이 정거장에서 뭘 하는지 — 없으면 전부 '또 밥집'으로 읽힌다 */}
                        <span
                          className={clsx(
                            "shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
                            STEP_KIND_STYLE[step.kind]
                          )}
                        >
                          {t.stepKind[step.kind]}
                        </span>
                        <Link
                          href={`/place/${step.placeId}`}
                          className="inline-block text-sm font-medium transition duration-150 hover:text-orange active:scale-95"
                        >
                          {stepName}
                          {note}
                          {stepLoc?.signName && (
                            <span lang="ko" className="ml-1.5 text-xs font-normal text-navy/40">
                              {stepLoc.signName}
                            </span>
                          )}
                        </Link>
                        {step.hasStamp && (
                          <span className="flex items-center gap-0.5 rounded-md bg-gold/10 px-1.5 py-0.5 text-[10px] font-medium text-gold">
                            <StampIcon className="h-3 w-3" />
                            {t.course.stamp}
                          </span>
                        )}
                      </div>
                      {next?.walkMinutesFromPrev && (
                        <p className="pb-4 text-[11px] text-navy/40">
                          ↓ {t.course.walk} {next.walkMinutesFromPrev}
                          {t.common.minuteUnit} ·{" "}
                          {next.walkDistanceFromPrev}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ol>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
