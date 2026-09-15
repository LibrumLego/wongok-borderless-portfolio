"use client";

import Link from "next/link";
import {
  COURSES,
  COURSE_EMOJI,
  DISTRICTS,
  DISTRICT_EMOJI,
  STAMP_SLOTS,
} from "@/lib/constants";
import { SAMPLE_PLACES } from "@/lib/sampleData";
import { ClockIcon, StampIcon } from "@/components/icons";
import NearbySpots from "@/components/NearbySpots";
import StreetNotice from "@/components/StreetNotice";
import Reveal from "@/components/Reveal";
import HomeSearch from "@/components/HomeSearch";
import CountUp from "@/components/CountUp";
import StoryCarousel from "@/components/StoryCarousel";
import PageAtmosphere from "@/components/PageAtmosphere";
import OfficialStreetPhoto from "@/components/OfficialStreetPhoto";
import { useT } from "@/lib/i18n/useT";
import {
  localizeDistrictName,
  localizeCourse,
  localizeStampSlotName,
} from "@/lib/i18n/places";

// 히어로 여권 카드(데스크톱 전용)에 쓰는 6칸 아이콘
const SLOT_EMOJI: Record<string, string> = {
  ...DISTRICT_EMOJI,
  "culture-center": "🎎",
  "photo-spot": "📸",
};

const DISTRICT_ACCENT: Record<string, string> = {
  indonesia: "from-rose-500/15 via-white to-orange-400/10",
  chinese: "from-amber-400/20 via-white to-red-500/10",
  vietnam: "from-emerald-400/15 via-white to-cyan-400/10",
  thai: "from-lime-400/15 via-white to-emerald-400/10",
  southasia: "from-violet-400/15 via-white to-rose-400/10",
  centralasia: "from-sky-400/15 via-white to-indigo-400/10",
};

export default function Home() {
  const { t, lang } = useT();

  return (
    <div className="page-shell flex flex-col gap-7 p-4 pt-5 md:gap-0 md:p-0">
      <PageAtmosphere variant="home" />
      {/* 히어로 — 모바일은 카드, 데스크톱은 전체 폭 배너. 박스 전체가 하나로 등장한다 */}
      <section className="hero-stage relative overflow-hidden rounded-3xl bg-navy text-white md:rounded-none">
        <OfficialStreetPhoto
          placeKey="home-hero"
          placeName={t.place.imageFallbackLabel}
          labelClassName="right-3 top-3 z-20 text-[9px] md:right-5 md:top-5 md:text-[10px]"
        />
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-navy/95 via-navy/85 to-navy/55" />
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />
        <div className="hero-grid" />
        <div className="hero-orbit hidden md:block" aria-hidden="true">
          <span />
        </div>
        <div className="hero-food hero-food-one" aria-hidden="true">🥟</div>
        <div className="hero-food hero-food-two" aria-hidden="true">🍜</div>
        <div className="hero-food hero-food-three" aria-hidden="true">🥘</div>
        <div className="p-6 md:mx-auto md:max-w-6xl md:px-8 md:py-14 lg:py-20">
          <div className="lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14">
            <div className="relative z-10">
              <p className="fade-up mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-[11px] font-semibold tracking-[0.16em] text-gold backdrop-blur md:text-xs">
                <span className="hero-pulse h-1.5 w-1.5 rounded-full bg-orange" />
                {t.home.badge}
              </p>
              {/* break-keep: 한국어를 글자가 아닌 어절 단위로 줄바꿈 */}
              <h1
                className="fade-up break-keep text-3xl font-black leading-[1.15] tracking-[-0.045em] md:text-5xl md:leading-[1.08] lg:text-6xl"
                style={{ animationDelay: "60ms" }}
              >
                {t.home.titleLine1}
                <br />
                <span className="hero-gradient-text">{t.home.titleHighlight}</span>
              </h1>
              <p
                className="fade-up mt-3 max-w-xl break-keep text-xs leading-relaxed text-white/55 md:mt-5 md:text-lg md:leading-relaxed md:text-white/65"
                style={{ animationDelay: "120ms" }}
              >
                {t.home.subtitle}
              </p>
              <div className="fade-up" style={{ animationDelay: "180ms" }}>
                <HomeSearch />
              </div>
              <div
                className="fade-up hidden md:mt-6 md:flex md:items-center md:gap-3"
                style={{ animationDelay: "240ms" }}
              >
                <Link
                  href="/course"
                  className="rounded-full bg-orange px-5 py-2.5 text-sm font-semibold transition duration-200 hover:bg-orange/90 hover:shadow-lg hover:shadow-orange/25 active:scale-95"
                >
                  {t.home.ctaCourse}
                </Link>
                <Link
                  href="/guide"
                  className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-white/80 transition duration-200 hover:border-white/40 hover:bg-white/5 hover:text-white active:scale-95"
                >
                  {t.home.ctaGuide}
                </Link>
              </div>
            </div>

            {/* 여권 카드 미리보기 — 넓은 화면에서만 노출되는 히어로 비주얼 */}
            <div
              className="fade-up relative z-10 hidden lg:block"
              style={{ animationDelay: "180ms" }}
            >
              <div className="passport-float rotate-2 rounded-[2rem] border border-white/15 bg-white/[0.08] p-7 shadow-2xl shadow-black/30 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold tracking-[0.2em] text-gold">
                    BORDERLESS PASSPORT
                  </p>
                  <span className="text-[10px] text-white/40">
                    WONGOK · ANSAN
                  </span>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {STAMP_SLOTS.map((slot) => (
                    <div
                      key={slot.id}
                      className="passport-slot flex flex-col items-center gap-1.5 rounded-2xl border border-dashed border-white/15 py-4"
                    >
                      <span className="text-2xl">{SLOT_EMOJI[slot.id]}</span>
                      <span className="text-[10px] text-white/45">
                        {localizeStampSlotName(slot.id, lang, slot.name)}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-xs leading-relaxed text-white/45">
                  {t.common.stampGoal(STAMP_SLOTS.length)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 border-t border-white/10 bg-black/5 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl divide-x divide-white/10 text-center text-[11px] text-white/60 md:px-8 md:text-sm">
            <div
              className="fade-up flex-1 py-3 md:py-5"
              style={{ animationDelay: "260ms" }}
            >
              <span className="font-bold text-white">
                <CountUp value={SAMPLE_PLACES.length} suffix={t.home.statPlaces} />
              </span>{" "}
              {t.home.statPlacesLabel}
            </div>
            <div
              className="fade-up flex-1 py-3 md:py-5"
              style={{ animationDelay: "310ms" }}
            >
              <span className="font-bold text-white">{t.home.statLineBold}</span>{" "}
              {t.home.statLineRest}
            </div>
            <div
              className="fade-up flex-1 py-3 md:py-5"
              style={{ animationDelay: "360ms" }}
            >
              {t.home.statSpecial1}{" "}
              <span className="font-bold text-white">{t.home.statSpecial2}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 움직이는 국가명 띠 — 첫 화면과 콘텐츠 사이를 무대 전환처럼 연결 */}
      <div
        className="fade-up world-ticker -mx-4 overflow-hidden border-y border-orange/10 bg-white/75 py-2.5 backdrop-blur md:mx-0 md:py-3"
        style={{ animationDelay: "420ms" }}
        aria-hidden="true"
      >
        <div className="world-ticker-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {[
                ["INDONESIA", "🍚"],
                ["CHINA", "🥟"],
                ["VIETNAM", "🍜"],
                ["THAILAND", "🍤"],
                ["INDIA·NEPAL", "🍛"],
                ["CENTRAL ASIA", "🥖"],
              ].map(([name, emoji]) => (
                <span key={`${copy}-${name}`} className="ticker-item">
                  <b>{emoji}</b>
                  {name}
                  <i>✦</i>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 이하 본문 — 모바일에서는 display:contents 로 기존 간격 유지, 데스크톱에서만 컨테이너 */}
      <div className="contents md:mx-auto md:flex md:max-w-6xl md:flex-col md:gap-16 md:px-8 md:py-16">
        <Reveal asSection>
          <StoryCarousel
            ariaLabel={t.home.aboutKicker}
            stories={[
              {
                kicker: t.home.aboutKicker,
                title: t.home.aboutTitle,
                body: t.home.aboutBody,
                mark: "01",
              },
              {
                kicker: t.home.aboutCard2Kicker,
                title: t.home.aboutCard2Title,
                body: t.home.aboutCard2Body,
                mark: "02",
              },
              {
                kicker: t.home.aboutCard3Kicker,
                title: t.home.aboutCard3Title,
                body: t.home.aboutCard3Body,
                mark: "03",
              },
            ]}
          />
          {/* 소개 카드를 읽고 더 궁금해진 사람만 연표까지 간다 */}
          <Link
            href="/story"
            className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-xs font-semibold text-orange transition duration-150 hover:gap-2.5 active:scale-95 md:mt-5 md:text-sm"
          >
            {t.home.storyLink}
            <span aria-hidden="true">→</span>
          </Link>
        </Reveal>

        {/* 소개 카드가 '어떤 곳인지'를 말한다면, 여기는 '언제 가야 하는지'다. */}
        <Reveal asSection>
          <StreetNotice />
        </Reveal>

        {/* 구역 배지 */}
        <Reveal asSection>
          <div className="mb-3 flex items-end justify-between md:mb-7">
            <div>
              <p className="section-kicker">{t.home.sec01Kicker}</p>
              <h2 className="section-title">{t.home.sec01Title}</h2>
            </div>
            <span className="hidden text-xs text-navy/35 md:block">{t.home.sec01Hint}</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 md:gap-4 lg:grid-cols-6">
            {DISTRICTS.map((d, index) => {
              const count = SAMPLE_PLACES.filter(
                (p) => p.district === d.code
              ).length;
              return (
                <div
                  key={d.code}
                  style={{ transitionDelay: `${index * 70}ms` }}
                  className="reveal-item"
                >
                  <Link
                    href={`/map?district=${d.code}`}
                    className={`district-card district-card-live group relative flex min-h-28 h-full flex-col items-center justify-center gap-1.5 overflow-hidden rounded-2xl border border-white/80 bg-gradient-to-br py-4 shadow-sm transition duration-300 active:scale-[0.97] md:min-h-44 md:gap-3 md:rounded-3xl ${DISTRICT_ACCENT[d.code] ?? "from-orange/10 via-white to-gold/10"}`}
                  >
                    <span className="district-glow absolute -right-7 -top-7 h-20 w-20 rounded-full bg-white/70 blur-xl" />
                    <span className="district-sweep" />
                    <span className="absolute right-2.5 top-2.5 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-bold text-navy/50 backdrop-blur md:right-3.5 md:top-3.5 md:px-2.5 md:text-xs">
                      {count}
                      {t.common.placeCountSuffix}
                    </span>
                    <span className="relative text-3xl transition duration-300 group-hover:-translate-y-1 group-hover:scale-110 md:text-5xl">
                      {DISTRICT_EMOJI[d.code]}
                    </span>
                    <span className="relative text-[11px] font-bold md:text-base">
                      {localizeDistrictName(d.code, lang)}
                    </span>
                    <span className="relative hidden text-[10px] font-medium text-navy/35 md:block">
                      EXPLORE 0{index + 1}
                    </span>
                  </Link>
                </div>
              );
            })}
          </div>
        </Reveal>

        {/* 스탬프 혜택 배너 */}
        <Reveal>
          <Link
            href="/stamp"
            className="stamp-shine group relative flex items-center gap-3.5 overflow-hidden rounded-2xl bg-gradient-to-r from-[#ef5b0c] via-orange to-[#f5a338] p-4 text-white shadow-lg shadow-orange/25 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange/30 active:scale-[0.99] md:gap-6 md:rounded-3xl md:p-7 lg:p-9"
          >
          <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/20 transition duration-300 group-hover:rotate-[-8deg] group-hover:scale-110 md:h-16 md:w-16">
            <StampIcon className="h-6 w-6 md:h-8 md:w-8" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold md:text-xl lg:text-2xl">
              {t.home.stampBannerTitle}
            </p>
            <p className="mt-0.5 truncate text-xs text-white/85 md:mt-1.5 md:whitespace-normal md:text-sm lg:text-base">
              {t.common.stampGoal(STAMP_SLOTS.length)}
            </p>
          </div>
            <span className="hidden shrink-0 rounded-full bg-white px-6 py-3 text-sm font-semibold text-orange lg:ml-auto lg:block">
              {t.home.stampBannerCta}
            </span>
          </Link>
        </Reveal>

        {/* 추천 코스 */}
        <Reveal asSection>
          <div className="mb-2.5 flex items-baseline justify-between md:mb-6">
            <div>
              <p className="section-kicker">{t.home.sec02Kicker}</p>
              <h2 className="section-title">{t.home.sec02Title}</h2>
            </div>
            <Link
              href="/course"
              className="-mr-2 inline-flex min-h-11 items-center px-2 text-xs font-medium text-orange transition duration-150 hover:underline active:scale-95 md:text-sm"
            >
              {t.home.seeAll}
            </Link>
          </div>
          {/*
            홈에서는 대표 3개만 보여주고 나머지는 코스 페이지로 넘긴다.
            7개를 다 깔면 모바일에서 이 섹션 하나가 한 화면을 통째로 먹어,
            아래의 '안산으로 이어가기'까지 내려오는 사람이 줄어든다.
          */}
          <div className="flex flex-col gap-2.5 md:grid md:grid-cols-3 md:gap-6">
            {COURSES.slice(0, 3).map((c, index) => {
              const cLoc = localizeCourse(c, lang);
              return (
                <Link
                  key={c.id}
                  href="/course"
                  style={{ transitionDelay: `${index * 80}ms` }}
                  className="reveal-item course-card group relative flex items-center gap-3.5 overflow-hidden rounded-2xl border border-white/80 bg-white/85 p-4 shadow-sm backdrop-blur transition duration-300 active:scale-[0.98] md:flex-col md:items-start md:gap-4 md:rounded-3xl md:p-6 lg:p-8"
                >
                  <span className="absolute right-4 top-3 text-5xl font-black text-navy/[0.035] md:text-7xl">
                    0{index + 1}
                  </span>
                  <span className="relative text-3xl transition duration-300 group-hover:rotate-6 group-hover:scale-110 md:text-4xl lg:text-5xl">
                    {COURSE_EMOJI[c.id]}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold md:text-lg lg:text-xl">{cLoc.title}</p>
                    <p className="mt-0.5 line-clamp-1 text-xs text-navy/45 md:mt-2 md:line-clamp-2 md:text-sm md:leading-relaxed">
                      {cLoc.summary}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-navy/40 md:mt-3 md:text-xs">
                      <ClockIcon className="h-3 w-3" />
                      {t.course.about} {Math.round(c.durationMinutes / 60)}
                      {t.common.hourUnit}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </Reveal>

        {/*
          '역에서 가까운 맛' 목록은 뺐다. 지도 페이지가 같은 카드를 필터·검색과 함께
          더 잘 보여주는데 홈에서 한 화면을 더 쓰고 있었고, 그만큼 아래의
          '온 김에 안산' 섹션까지 내려오는 사람이 줄었다. 개별 가게는 구역 카드나
          지도에서 들어가는 흐름으로 통일한다.
        */}

        {/* 관광정보 OpenAPI 연동: 안산 시내 관광지.
            공모전 규정상 서비스 화면에 주최 기관명을 노출하지 않는다. */}
        <Reveal asSection>
          <div className="mb-2.5 md:mb-6">
            <p className="section-kicker">{t.home.sec04Kicker}</p>
            <h2 className="section-title">{t.home.sec04Title}</h2>
            <p className="mt-0.5 text-[11px] text-navy/40 md:mt-2 md:text-sm">
              {t.home.sec04Sub}
            </p>
          </div>
          <NearbySpots />
        </Reveal>
      </div>
    </div>
  );
}
