"use client";

import { useEffect, useState } from "react";
import { PinIcon } from "@/components/icons";
import { useT } from "@/lib/i18n/useT";

interface TourItem {
  contentId: string;
  title: string;
  address: string;
  imageUrl: string;
  mapX?: string;
  mapY?: string;
  tel?: string;
  contentTypeId?: string;
  /** 좌표 기반 조회에서만 온다 */
  distanceM?: number;
  /** 선별 목록에서만 온다 */
  group?: "near" | "people";
  distanceKm?: number;
}

interface TourDetail extends TourItem {
  overview: string;
  homepage: string;
  useTime?: string;
  restDate?: string;
  parking?: string;
  infoCenter?: string;
  images?: string[];
}

type State =
  | { status: "loading" }
  | { status: "no-key" }
  | { status: "error" }
  | { status: "ready"; items: TourItem[] };

type DetailState =
  | { status: "idle" }
  | { status: "loading"; item: TourItem }
  | { status: "ready"; detail: TourDetail }
  | { status: "error"; item: TourItem };

/**
 * 축제 탭은 뺐다. 관광공사 API에 안산 등록 축제가 0건이고(경기 전체로 넓혀도
 * 양평·포천 2건뿐, 그마저 종료된 행사) 항상 빈 화면이 나온다.
 *
 * 관광지·문화시설을 통째로 뿌리던 탭도 뺐다. 안산시로 조회하면 80건 중 절반이
 * 대부도 캠핑장·낚시터라 원곡동을 걷다 이어 갈 곳과는 무관했다. 대신 손으로 고른
 * 명단(ansanLinks.ts)만 보여준다.
 */
const TABS = [
  { id: "nearby", query: "op=nearby&radius=3000" },
  { id: "curated", query: "op=curated" },
] as const;

type TabId = (typeof TABS)[number]["id"];

// 공공데이터(지역기반 관광정보)로 안산 시내를 실시간 조회.
// 원곡동 방문 후 이어갈 수 있는 안산 동선 제안용 섹션. 탭마다 실제 API가 다르다:
// 관광지·문화시설은 areaBasedList2, 축제는 searchFestival2(오늘 이후 열리는 행사만).
export default function NearbySpots() {
  const { t } = useT();
  const TAB_LABEL: Record<TabId, string> = {
    nearby: t.home.tabNearby,
    curated: t.home.tabCurated,
  };
  const [tab, setTab] = useState<TabId>("nearby");
  const [cache, setCache] = useState<Partial<Record<TabId, State>>>({});
  const [detail, setDetail] = useState<DetailState>({ status: "idle" });

  useEffect(() => {
    if (cache[tab]) return;
    const meta = TABS.find((t) => t.id === tab)!;
    let cancelled = false;
    fetch(`/api/tour?${meta.query}`)
      .then(async (res) => {
        if (cancelled) return;
        if (res.status === 503) {
          setCache((c) => ({ ...c, [tab]: { status: "no-key" } }));
          return;
        }
        if (!res.ok) {
          setCache((c) => ({ ...c, [tab]: { status: "error" } }));
          return;
        }
        const data = await res.json();
        setCache((c) => ({
          ...c,
          [tab]: { status: "ready", items: (data.items ?? []).slice(0, 12) },
        }));
      })
      .catch(() => {
        if (!cancelled) setCache((c) => ({ ...c, [tab]: { status: "error" } }));
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  // cache에 아직 없을 때만 loading으로 취급 (렌더 중 계산, effect 안에서 setState하지 않는다)
  const state: State = cache[tab] ?? { status: "loading" };

  async function openDetail(item: TourItem) {
    setDetail({ status: "loading", item });
    try {
      // contentTypeId를 함께 넘기면 detailIntro2에서 이용시간·휴무를 받아올 수 있다
      const typeParam = item.contentTypeId
        ? `&contentTypeId=${encodeURIComponent(item.contentTypeId)}`
        : "";
      const res = await fetch(
        `/api/tour?op=detail&contentId=${encodeURIComponent(item.contentId)}${typeParam}`
      );
      if (!res.ok) throw new Error("실패");
      const data = await res.json();
      setDetail({ status: "ready", detail: data.detail });
    } catch {
      setDetail({ status: "error", item });
    }
  }

  return (
    <>
      <div className="mb-3 flex gap-1.5">
        {TABS.map((tabItem) => (
          <button
            key={tabItem.id}
            onClick={() => setTab(tabItem.id)}
            className={`flex min-h-11 items-center rounded-full px-3.5 text-xs font-semibold transition duration-200 active:scale-95 ${
              tab === tabItem.id
                ? "bg-navy text-white shadow-sm"
                : "bg-navy/5 text-navy/50 hover:bg-navy/10"
            }`}
          >
            {TAB_LABEL[tabItem.id]}
          </button>
        ))}
      </div>

      {state.status === "no-key" && (
        <div className="rounded-2xl border border-dashed border-navy/15 bg-white p-4 text-xs leading-relaxed text-navy/50 md:p-6 md:text-sm">
          <p className="font-semibold text-navy/70">{t.home.noApiKey}</p>
          <p className="mt-1">{t.home.noApiKeyBody}</p>
        </div>
      )}

      {state.status === "error" && (
        <p className="rounded-2xl bg-navy/5 p-4 text-xs text-navy/50">
          {t.home.loadError}
        </p>
      )}

      {state.status === "loading" && (
        <div className="flex gap-3 overflow-hidden md:grid md:grid-cols-4 md:gap-5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-36 w-40 shrink-0 animate-pulse rounded-2xl bg-navy/5 md:w-auto"
            />
          ))}
        </div>
      )}

      {state.status === "ready" && state.items.length === 0 && (
        <p className="rounded-2xl bg-navy/5 p-4 text-xs text-navy/50">
          {t.home.noInfo}
        </p>
      )}

      {state.status === "ready" && state.items.length > 0 && (
        tab === "curated" ? (
          /* 선별 목록은 왜 이 곳들인지가 절반이라, 묶음 제목을 함께 보여준다 */
          <div className="flex flex-col gap-5 md:gap-8">
            {(["near", "people"] as const).map((groupId) => {
              const items = state.items.filter((it) => it.group === groupId);
              if (items.length === 0) return null;
              return (
                <div key={groupId}>
                  <p className="text-xs font-bold text-navy md:text-base">
                    {groupId === "near" ? t.home.groupNear : t.home.groupPeople}
                  </p>
                  <p className="mt-0.5 break-keep text-[11px] leading-relaxed text-navy/45 md:text-sm">
                    {groupId === "near"
                      ? t.home.groupNearDesc
                      : t.home.groupPeopleDesc}
                  </p>
                  <div className="mt-2.5 grid grid-cols-2 gap-2.5 md:mt-4 md:grid-cols-4 md:gap-5">
                    {items.map((item) => (
                      <SpotCard
                        key={item.contentId}
                        item={item}
                        onOpen={openDetail}
                        viewLabel={t.home.viewInfo}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 md:mx-0 md:grid md:snap-none md:grid-cols-4 md:gap-5 md:overflow-visible md:px-0">
            {state.items.map((item) => (
              <SpotCard
                key={item.contentId}
                item={item}
                onOpen={openDetail}
                viewLabel={t.home.viewInfo}
                scrollCard
              />
            ))}
          </div>
        )
      )}

      {detail.status !== "idle" && (
        <SpotDetailModal state={detail} onClose={() => setDetail({ status: "idle" })} />
      )}
    </>
  );
}

/** 목록 카드. 가로 스크롤(가까운 순)과 격자(선별) 양쪽에서 쓴다 */
function SpotCard({
  item,
  onOpen,
  viewLabel,
  scrollCard = false,
}: {
  item: TourItem;
  onOpen: (item: TourItem) => void;
  viewLabel: string;
  scrollCard?: boolean;
}) {
  // 가까운 순 탭은 API가 준 실제 거리(m), 선별 탭은 우리가 계산해 둔 안산역 기준 거리
  const distance =
    item.distanceM !== undefined
      ? item.distanceM < 1000
        ? `${item.distanceM}m`
        : `${(item.distanceM / 1000).toFixed(1)}km`
      : item.distanceKm !== undefined
        ? `${item.distanceKm}km`
        : null;

  return (
    <button
      onClick={() => onOpen(item)}
      className={`overflow-hidden rounded-2xl border border-navy/5 bg-white text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] ${
        scrollCard ? "w-40 shrink-0 snap-start md:w-auto" : ""
      }`}
    >
      {item.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.imageUrl}
          alt={item.title}
          className="h-24 w-full object-cover md:h-32"
        />
      ) : (
        <div className="flex h-24 w-full items-center justify-center bg-navy/5 text-navy/20 md:h-32">
          <PinIcon className="h-6 w-6" />
        </div>
      )}
      {/* 관광정보 API가 주는 원천 텍스트는 한국어다 */}
      <div className="p-2.5 md:p-4">
        <p lang="ko" className="truncate text-xs font-semibold md:text-sm">
          {item.title}
        </p>
        <p
          lang="ko"
          className="mt-0.5 truncate text-[10px] text-navy/40 md:mt-1 md:text-xs"
        >
          {item.address}
        </p>
        {distance && (
          <p className="mt-1 text-[10px] font-semibold text-navy/55">
            {distance}
          </p>
        )}
        <p className="mt-1 text-[10px] font-medium text-orange">{viewLabel}</p>
      </div>
    </button>
  );
}

/** 공공데이터에서 받아온 관광지 안내를 띄우는 모달 */
function SpotDetailModal({
  state,
  onClose,
}: {
  state: Exclude<DetailState, { status: "idle" }>;
  onClose: () => void;
}) {
  const { t } = useT();
  const item = state.status === "ready" ? state.detail : state.item;
  const d = state.status === "ready" ? state.detail : null;
  // 좌표가 있으면 카카오맵 길찾기로 이어준다 (앱/웹 모두 열리는 주소)
  const mapUrl =
    item.mapY && item.mapX
      ? `https://map.kakao.com/link/map/${encodeURIComponent(item.title)},${item.mapY},${item.mapX}`
      : null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${item.title} 안내`}
      className="fixed inset-0 z-50 flex items-end justify-center bg-navy/40 p-0 backdrop-blur-sm md:items-center md:p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="fade-up max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl md:rounded-3xl md:p-7"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold tracking-wider text-orange">
              {t.home.spotDetailKicker}
            </p>
            <h3 lang="ko" className="mt-0.5 text-lg font-bold md:text-xl">
              {item.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="닫기"
            className="shrink-0 rounded-full px-2 py-1 text-navy/35 transition-colors hover:text-navy/70"
          >
            ✕
          </button>
        </div>

        {item.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.title}
            className="mt-4 h-44 w-full rounded-2xl object-cover md:h-56"
          />
        )}

        {state.status === "loading" && (
          <div className="mt-4 space-y-2">
            <div className="h-3 w-full animate-pulse rounded bg-navy/5" />
            <div className="h-3 w-4/5 animate-pulse rounded bg-navy/5" />
            <div className="h-3 w-3/5 animate-pulse rounded bg-navy/5" />
          </div>
        )}

        {state.status === "error" && (
          <p className="mt-4 rounded-xl bg-navy/[0.04] p-3 text-xs text-navy/55">
            {t.home.detailLoadError}
          </p>
        )}

        {/* detailImage2로 받은 추가 사진. 사진이 부족한 편이라 있으면 함께 보여준다 */}
        {d && d.images && d.images.length > 0 && (
          <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
            {d.images.map((url) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={url}
                src={url}
                alt=""
                className="h-20 w-28 shrink-0 rounded-xl object-cover md:h-24 md:w-36"
              />
            ))}
          </div>
        )}

        {d && (
          <>
            {d.overview && (
              <p
                lang="ko"
                className="mt-4 whitespace-pre-line text-sm leading-relaxed text-navy/70"
              >
                {d.overview}
              </p>
            )}
            {/*
              detailIntro2가 주는 운영정보. 우리 가게 데이터에는 영업시간이 없지만
              관광공사가 관리하는 관광지·문화시설은 실제 이용시간·휴무·주차를 준다.
              추정값이 아니라 공공데이터 원문이라 그대로 보여줄 수 있다.
            */}
            {(d.useTime || d.restDate || d.parking) && (
              <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 rounded-xl bg-navy/[0.04] p-3 text-xs">
                {d.useTime && (
                  <>
                    <dt className="font-semibold text-navy/60">
                      {t.home.infoUseTime}
                    </dt>
                    <dd lang="ko" className="whitespace-pre-line text-navy/70">
                      {d.useTime}
                    </dd>
                  </>
                )}
                {d.restDate && (
                  <>
                    <dt className="font-semibold text-navy/60">
                      {t.home.infoRestDate}
                    </dt>
                    <dd lang="ko" className="whitespace-pre-line text-navy/70">
                      {d.restDate}
                    </dd>
                  </>
                )}
                {d.parking && (
                  <>
                    <dt className="font-semibold text-navy/60">
                      {t.home.infoParking}
                    </dt>
                    <dd lang="ko" className="whitespace-pre-line text-navy/70">
                      {d.parking}
                    </dd>
                  </>
                )}
              </dl>
            )}
            <div className="mt-4 flex flex-col gap-1.5 text-xs text-navy/55">
              {d.address && <p lang="ko">📍 {d.address}</p>}
              {d.tel && <p>☎ {d.tel}</p>}
              {!d.tel && d.infoCenter && <p lang="ko">☎ {d.infoCenter}</p>}
            </div>
            {d.homepage && (
              <p className="mt-2 break-all text-[11px] text-navy/35">
                {d.homepage}
              </p>
            )}
          </>
        )}

        {mapUrl && (
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 block rounded-full bg-navy py-3 text-center text-sm font-semibold text-white transition duration-150 active:scale-[0.98]"
          >
            {t.home.findOnMap}
          </a>
        )}
      </div>
    </div>
  );
}
