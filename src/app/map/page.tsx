"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import clsx from "clsx";
import { CATEGORIES, DISTRICTS } from "@/lib/constants";
import { SAMPLE_PLACES } from "@/lib/sampleData";
import { DistrictCode, Place, PlaceCategory } from "@/types";
import PlaceCard from "@/components/PlaceCard";
import PlaceMap from "@/components/PlaceMap";
import PageAtmosphere from "@/components/PageAtmosphere";
import { HeartIcon, MapIcon, PinIcon, SearchIcon } from "@/components/icons";
import { useT } from "@/lib/i18n/useT";
import {
  getPlaceSearchTerms,
  localizeDistrictName,
  localizeCategoryName,
} from "@/lib/i18n/places";
import { useFavoriteStore } from "@/store/useFavoriteStore";
import MyRoute from "@/components/MyRoute";

/**
 * 필터 칩. 카테고리 줄과 거리 줄이 같은 색을 쓰고 줄마다 제목을 달아,
 * 색이 다른 두 줄이 "다중 선택"처럼 오해되지 않도록 한다.
 * 결과가 0건인 선택지는 숫자로 미리 보여주고 누를 수 없게 한다.
 */
function Chip({
  active,
  count,
  onClick,
  children,
}: {
  active: boolean;
  count: number;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const empty = count === 0;
  return (
    <button
      onClick={onClick}
      disabled={empty && !active}
      aria-pressed={active}
      className={clsx(
        "filter-chip flex min-h-11 shrink-0 items-center gap-1 rounded-full border px-3.5 text-xs font-medium transition duration-150",
        active
          ? "filter-chip-active border-orange bg-orange text-white"
          : empty
            ? "cursor-not-allowed border-navy/5 bg-navy/[0.03] text-navy/25"
            : "border-navy/10 bg-white/90 text-navy/60 hover:border-orange/50 hover:text-orange"
      )}
    >
      <span className="relative z-10">{children}</span>
      <span className={clsx("relative z-10 text-[10px]", active ? "text-white/70" : "text-navy/35")}>
        {count}
      </span>
    </button>
  );
}

function MapContent() {
  const params = useSearchParams();
  const { t, lang } = useT();

  const [category, setCategory] = useState<PlaceCategory | "all">("all");
  const [district, setDistrict] = useState<DistrictCode | "all">(
    (params.get("district") as DistrictCode | null) ?? "all"
  );
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const favoriteIds = useFavoriteStore((s) => s.ids);
  const mapRef = useRef<HTMLDivElement>(null);

  const matchesQuery = (p: Place, q: string) => {
    if (!q.trim()) return true;
    const needle = q.trim().toLocaleLowerCase();
    return getPlaceSearchTerms(p)
      .join(" ")
      .toLocaleLowerCase()
      .includes(needle);
  };

  const places = useMemo(
    () =>
      SAMPLE_PLACES.filter(
        (p) =>
          (category === "all" || p.category === category) &&
          (district === "all" || p.district === district) &&
          (!onlyFavorites || favoriteIds.includes(p.id)) &&
          matchesQuery(p, query)
      ),
    [category, district, query, onlyFavorites, favoriteIds]
  );

  // 각 선택지를 눌렀을 때 몇 건이 남는지 미리 계산해 칩에 숫자로 보여준다
  const countFor = (
    nextCategory: PlaceCategory | "all",
    nextDistrict: DistrictCode | "all"
  ) =>
    SAMPLE_PLACES.filter(
      (p) =>
        (nextCategory === "all" || p.category === nextCategory) &&
        (nextDistrict === "all" || p.district === nextDistrict) &&
        (!onlyFavorites || favoriteIds.includes(p.id)) &&
        matchesQuery(p, query)
    ).length;

  // 목록에서 고르면 지도의 마커를 선택하고, 지도가 화면 위쪽에 있는
  // 모바일에서는 지도까지 스크롤해 위치를 바로 확인할 수 있게 한다
  function selectFromList(id: string) {
    const nextId = selectedId === id ? null : id;
    setSelectedId(nextId);
    if (nextId && window.matchMedia("(max-width: 767px)").matches) {
      mapRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
        block: "start",
      });
    }
  }

  return (
    <div className="map-page page-shell flex flex-col gap-4 px-4 pb-8 pt-4 md:mx-auto md:max-w-7xl md:gap-6 md:px-8 md:pb-16 md:pt-8">
      <PageAtmosphere variant="map" />
      <section className="map-hero fade-up">
        <div className="map-hero-grid" aria-hidden="true" />
        <div className="map-hero-copy">
          <p className="map-hero-kicker">
            <span className="map-live-signal" />
            LIVE · WONGOK STREET
          </p>
          <h1>{t.map.title}</h1>
          <div className="map-hero-stats" aria-label={`${SAMPLE_PLACES.length}${t.map.resultsSuffix}`}>
            <span><b>{SAMPLE_PLACES.length}</b>{t.map.resultsSuffix}</span>
            <i aria-hidden="true" />
            <span><b>{DISTRICTS.length}</b> DISTRICTS</span>
          </div>
        </div>
        <div className="map-passport-mark" aria-hidden="true">
          <span className="map-passport-ring"><MapIcon className="h-7 w-7" /></span>
          <b>WB</b>
          <small>LOCAL<br />EXPLORER</small>
        </div>
        <span className="map-hero-coordinate" aria-hidden="true">37.3270° N · 126.7901° E</span>
      </section>

      {/* 검색 */}
      <form
        onSubmit={(e) => e.preventDefault()}
        role="search"
        style={{ animationDelay: "60ms" }}
        className="map-search-panel interactive-panel fade-up flex items-center gap-3 px-4 py-2.5 transition duration-200 focus-within:border-orange focus-within:ring-4 focus-within:ring-orange/10 md:px-5"
      >
        <span className="map-search-icon"><SearchIcon className="h-4 w-4" /></span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.map.searchPlaceholder}
          aria-label={t.map.searchPlaceholder}
          maxLength={40}
          className="min-h-11 min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:font-normal placeholder:text-navy/35 md:text-base"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label={t.map.clearSearch}
            className="shrink-0 text-navy/35 transition-colors hover:text-navy/70"
          >
            ✕
          </button>
        )}
      </form>

      {/* 찜한 곳만 보기 — 목록을 훑다 모아둔 곳으로 바로 좁힐 수 있게 한다 */}
      {favoriteIds.length > 0 && (
        <button
          onClick={() => setOnlyFavorites((v) => !v)}
          aria-pressed={onlyFavorites}
          style={{ animationDelay: "90ms" }}
          className={clsx(
            "fade-up flex min-h-11 items-center gap-1.5 self-start rounded-full border px-3.5 text-xs font-medium transition duration-150 active:scale-95",
            onlyFavorites
              ? "border-orange bg-orange text-white"
              : "border-navy/10 bg-white text-navy/60 hover:border-orange/50 hover:text-orange"
          )}
        >
          <HeartIcon className="h-3.5 w-3.5" filled={onlyFavorites} />
          {t.favorite.filter}
          <span className={onlyFavorites ? "text-white/70" : "text-navy/35"}>
            {favoriteIds.length}
          </span>
        </button>
      )}

      {/* 한 곳만 저장해도 안산역에서 출발하는 동선을 보여주고, 여러 곳이면 가까운 순으로 묶는다 */}
      <MyRoute />

      {/* 필터 — 줄마다 제목을 달아 두 줄의 역할을 구분한다 */}
      <div className="map-filter-deck flex flex-col gap-3">
        <div className="fade-up" style={{ animationDelay: "120ms" }}>
          <p className="filter-group-label mb-1.5 text-[11px] font-semibold text-navy/40">
            {t.map.whatLabel}
          </p>
          <div className="filter-chip-row no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-2 md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:py-1">
            {CATEGORIES.map((c) => (
              <Chip
                key={c.code}
                active={category === c.code}
                count={countFor(c.code, district)}
                onClick={() => setCategory(c.code)}
              >
                {localizeCategoryName(c.code, lang)}
              </Chip>
            ))}
          </div>
        </div>
        <div className="fade-up" style={{ animationDelay: "180ms" }}>
          <p className="filter-group-label mb-1.5 text-[11px] font-semibold text-navy/40">
            {t.map.whereLabel}
          </p>
          <div className="filter-chip-row no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-2 md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:py-1">
            <Chip
              active={district === "all"}
              count={countFor(category, "all")}
              onClick={() => setDistrict("all")}
            >
              {t.map.all}
            </Chip>
            {DISTRICTS.map((d) => (
              <Chip
                key={d.code}
                active={district === d.code}
                count={countFor(category, d.code)}
                onClick={() => setDistrict(d.code)}
              >
                {localizeDistrictName(d.code, lang)}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      <div className="map-explorer-grid flex flex-col gap-4 md:flex-row-reverse md:items-start md:gap-5">
        {/* 지도: NEXT_PUBLIC_KAKAO_MAP_KEY 설정 시 카카오맵 표시 */}
        {/* 모바일에서는 목록을 가리지 않도록 일반 흐름에 두고, 넓은 화면에서만 고정한다 */}
        <section
          ref={mapRef}
          style={{ animationDelay: "240ms" }}
          className="map-frame map-showcase fade-up relative z-10 flex h-[22rem] flex-col overflow-hidden bg-white md:sticky md:top-20 md:h-[42rem] md:flex-1"
        >
          <div className="map-frame-bar">
            <span className="map-frame-status"><i /> LIVE MAP</span>
            <span className="map-frame-location"><PinIcon className="h-3.5 w-3.5" /> ANSAN · WONGOK</span>
          </div>
          <div className="min-h-0 flex-1">
            <PlaceMap
              places={places}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>
        </section>

        <section
          className="map-results fade-up flex flex-col gap-2.5 md:max-h-[42rem] md:w-[23rem] md:shrink-0 md:overflow-y-auto md:pr-1 lg:w-[27rem]"
          style={{ animationDelay: "300ms" }}
        >
          <header className="map-results-header">
            <div>
              <span>CURATED SPOTS</span>
              <strong>{places.length}<small>{t.map.resultsSuffix}</small></strong>
            </div>
            {query.trim() && (
              <p>
                {lang === "en" || lang === "ru" || lang === "id" ? (
                  <>{t.map.searchResultFor} &lsquo;{query.trim()}&rsquo;</>
                ) : (
                  <>&lsquo;{query.trim()}&rsquo; {t.map.searchResultFor}</>
                )}
              </p>
            )}
          </header>
          {places.map((p, i) => (
            <div
              key={p.id}
              className="fade-up"
              style={{
                animationDelay: `${360 + Math.min(i, 10) * 35}ms`,
              }}
            >
              <PlaceCard
                place={p}
                index={i + 1}
                selected={selectedId === p.id}
                onSelect={() => selectFromList(p.id)}
              />
            </div>
          ))}
          {places.length === 0 && (
            <div
              className="fade-up py-10 text-center"
              style={{ animationDelay: "360ms" }}
            >
              <p className="text-sm text-navy/45">{t.map.empty}</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                <span className="w-full text-[11px] text-navy/35">
                  {t.map.suggestions}
                </span>
                {t.map.recommendedTerms.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="rounded-full border border-navy/10 bg-white px-3 py-1.5 text-xs text-navy/60 transition hover:border-orange hover:text-orange"
                  >
                    {term}
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  setQuery("");
                  setCategory("all");
                  setDistrict("all");
                  setOnlyFavorites(false);
                  setSelectedId(null);
                }}
                className="mt-3 rounded-full border border-navy/15 px-4 py-2 text-xs text-navy/60 transition-colors hover:border-orange hover:text-orange"
              >
                {t.map.resetFilters}
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense>
      <MapContent />
    </Suspense>
  );
}
