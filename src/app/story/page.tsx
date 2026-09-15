"use client";

import Link from "next/link";
import PageAtmosphere from "@/components/PageAtmosphere";
import Reveal from "@/components/Reveal";
import { ClockIcon, RouteIcon } from "@/components/icons";
import { useT } from "@/lib/i18n/useT";
import { STORY_BY_LANG } from "@/lib/i18n/story";

/**
 * 원곡동이 어떻게 지금의 거리가 되었나 — 연표 한 장.
 *
 * 이 거리를 '이국적인 먹자골목'으로만 보면 놓치는 게 있다. 여기 사람들이 왜
 * 여기에 왔는지를 알고 나면 같은 골목이 다르게 읽힌다. 그래서 코스나 지도보다
 * 앞이 아니라, 홈에서 한 번 눌러 들어오는 자리에 뒀다.
 */
export default function StoryPage() {
  const { lang } = useT();
  const s = STORY_BY_LANG[lang];

  return (
    <div className="page-shell flex flex-col gap-5 p-4 pt-5 md:mx-auto md:max-w-4xl md:gap-8 md:px-8 md:pt-10 md:pb-16">
      <PageAtmosphere variant="story" />

      <div className="page-intro-card fade-up flex items-center justify-between gap-4">
        <div>
          <p className="page-kicker">
            <span className="page-kicker-dot" />
            {s.kicker}
          </p>
          <h1 className="text-lg font-bold leading-snug break-keep md:text-3xl">
            {s.title}
          </h1>
          <p className="mt-1.5 break-keep text-xs leading-relaxed text-navy/55 md:mt-3 md:text-base md:leading-7">
            {s.lead}
          </p>
        </div>
        <span className="page-icon-tile shrink-0">
          <ClockIcon className="h-6 w-6" />
        </span>
      </div>

      <ol className="flex flex-col">
        {s.chapters.map((c, i) => {
          const last = i === s.chapters.length - 1;
          return (
            <Reveal
              key={c.year + c.title}
              as="li"
              delay={80 + i * 70}
              className="relative pl-9 md:pl-12"
            >
              {/* 세로선 — 마지막 장에는 이어질 곳이 없다 */}
              {!last && (
                <span
                  aria-hidden="true"
                  className="absolute left-[11px] top-7 h-[calc(100%-1rem)] w-0.5 rounded bg-orange/15 md:left-[15px]"
                />
              )}
              <span
                aria-hidden="true"
                className={`absolute left-0 top-1.5 h-6 w-6 rounded-full border-4 border-white shadow-sm md:h-8 md:w-8 ${
                  last ? "bg-orange" : "bg-orange/35"
                }`}
              />
              <p className="text-[11px] font-bold tracking-wide text-orange md:text-sm">
                {c.year}
              </p>
              <h2 className="mt-0.5 break-keep text-sm font-bold md:text-xl">
                {c.title}
              </h2>
              <p className="mt-1 break-keep pb-7 text-xs leading-relaxed text-navy/60 md:pb-10 md:text-base md:leading-7">
                {c.body}
              </p>
            </Reveal>
          );
        })}
      </ol>

      {/* 지어낸 이야기가 아니라는 걸 밝히는 게 이 페이지의 값어치다 */}
      <Reveal asSection className="rounded-2xl bg-navy/[0.04] p-4 md:rounded-3xl md:p-6">
        <p className="text-[11px] font-bold text-navy/50 md:text-xs">
          {s.sourceLabel}
        </p>
        <ul className="mt-1.5 flex flex-col gap-1">
          {s.sources.map((src) => (
            <li
              key={src}
              className="text-[11px] leading-relaxed text-navy/45 md:text-xs"
            >
              {src}
            </li>
          ))}
        </ul>
      </Reveal>

      <Link
        href="/course"
        className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-navy text-sm font-semibold text-white shadow-sm transition duration-150 hover:shadow-md active:scale-[0.98] md:text-base"
      >
        <RouteIcon className="h-4 w-4" />
        {s.nextLabel}
      </Link>
    </div>
  );
}
