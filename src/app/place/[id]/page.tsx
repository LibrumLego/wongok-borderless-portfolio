"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import clsx from "clsx";
import { getPlace, SAMPLE_PLACES } from "@/lib/sampleData";
import { VISIT_COPY } from "@/lib/i18n/placeAdditions";
import PlaceCard from "@/components/PlaceCard";
import {
  CHECKIN_RADIUS_M,
  STAMP_SLOTS,
} from "@/lib/constants";
import { distanceMeters, useStampStore } from "@/store/useStampStore";
import { ClockIcon, PinIcon, WalkIcon } from "@/components/icons";
import PageQrCode from "@/components/PageQrCode";
import PhotoFrame from "@/components/PhotoFrame";
import FavoriteButton from "@/components/FavoriteButton";
import PlaceVisual from "@/components/PlaceVisual";
import { useT } from "@/lib/i18n/useT";
import {
  localizePlace,
  localizeDistrictName,
  localizeStampSlotName,
} from "@/lib/i18n/places";

type CheckinState =
  | { status: "idle" }
  | { status: "locating" }
  | { status: "too-far"; distance: number }
  | { status: "error"; message: string }
  // GPS를 통과하면 문화 퀴즈 단계로 넘어간다 (좌표 위조만으로는 못 얻게)
  | { status: "quiz" }
  | { status: "quiz-wrong" };

export default function PlacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const place = getPlace(id);
  const collect = useStampStore((s) => s.collect);
  const collected = useStampStore((s) =>
    place?.stampSlot ? s.records.some((r) => r.slotId === place.stampSlot) : false
  );
  const [checkin, setCheckin] = useState<CheckinState>({ status: "idle" });
  const { t, lang } = useT();

  if (!place) notFound();

  const loc = localizePlace(place, lang);
  const visit = VISIT_COPY[lang];
  const nearby = SAMPLE_PLACES.filter((p) => p.id !== place.id)
    .map((p) => ({ place: p, distance: distanceMeters(place.lat, place.lng, p.lat, p.lng) }))
    .filter((p) => p.distance <= 500)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3);
  const slot = STAMP_SLOTS.find((s) => s.id === place.stampSlot);
  const externalMapUrl = place.naverPlaceId
    ? `https://map.naver.com/p/entry/place/${place.naverPlaceId}`
    : place.placeUrl;

  function handleCheckin() {
    if (!navigator.geolocation) {
      setCheckin({ status: "error", message: t.place.checkin.noGeo });
      return;
    }
    setCheckin({ status: "locating" });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const d = distanceMeters(
          pos.coords.latitude,
          pos.coords.longitude,
          place!.lat,
          place!.lng
        );
        if (d <= CHECKIN_RADIUS_M) {
          // 퀴즈가 있으면 한 단계 더, 없으면 바로 획득
          if (place!.quiz) {
            setCheckin({ status: "quiz" });
          } else {
            collect(slot!.id, place!.id);
            setCheckin({ status: "idle" });
          }
        } else {
          setCheckin({ status: "too-far", distance: d });
        }
      },
      (error) =>
        setCheckin({
          status: "error",
          message:
            error.code === error.PERMISSION_DENIED
              ? t.place.checkin.permError
              : error.code === error.TIMEOUT
                ? t.place.checkin.timeoutError
                : t.place.checkin.noGeo,
        }),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  function answerQuiz(index: number) {
    if (index === place!.quiz!.answerIndex) {
      collect(slot!.id, place!.id);
      setCheckin({ status: "idle" });
    } else {
      setCheckin({ status: "quiz-wrong" });
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-4 pt-5 md:max-w-3xl md:gap-6 md:px-8 md:pt-10 md:pb-16">
      <button
        onClick={() => router.back()}
        className="self-start text-sm text-navy/50 transition duration-150 hover:text-orange active:scale-95"
      >
        {t.place.back}
      </button>

      <PlaceVisual
        imageUrl={place.imageUrl}
        placeId={place.id}
        allowGooglePhoto
        placeName={loc.name}
        district={place.district}
        className="fade-up h-44 rounded-3xl md:h-72"
      />

      <div className="fade-up" style={{ animationDelay: "70ms" }}>
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-xl font-bold md:text-3xl">{loc.name}</h1>
          <FavoriteButton placeId={place.id} className="mt-0.5 -mr-1.5" />
        </div>
        {/*
          간판에 적힌 한국어 상호. 이 화면을 현지인이나 택시 기사에게 보여줘
          길을 찾는 경우가 실제 사용 시나리오라, 번역명만 두면 쓸 수 없다.
        */}
        {loc.signName && (
          <p lang="ko" className="mt-0.5 text-sm text-navy/40 md:text-base">
            {loc.signName}
          </p>
        )}
        <p className="mt-1 text-sm text-navy/55">{loc.description}</p>
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px]">
          <span className="rounded-md bg-navy px-2 py-1 font-medium text-white">
            {localizeDistrictName(place.district, lang)}
          </span>
          {loc.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-navy/5 px-2 py-1 text-navy/55"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* 기본 정보 */}
      <div
        style={{ animationDelay: "140ms" }}
        className="fade-up flex flex-col gap-2.5 rounded-2xl border border-navy/5 bg-white p-4 text-sm shadow-sm"
      >
        {/* 주소는 번역하지 않는다 — 현장에서 그대로 보여주고 입력해야 하는 값이다 */}
        <p className="flex items-center gap-2">
          <PinIcon className="h-4 w-4 shrink-0 text-navy/35" />
          <span lang="ko">{place.address}</span>
        </p>
        <p className="flex items-center gap-2">
          <WalkIcon className="h-4 w-4 shrink-0 text-navy/35" />
          {/* 라틴 문자 언어는 숫자와 단위 사이를 띄우고, 한중일은 붙여 쓴다 */}
          {lang === "en" || lang === "ru" || lang === "id"
            ? `${t.place.walkFromStation} ${place.walkMinutes} ${t.place.minutes}`
            : `${t.place.walkFromStation} ${place.walkMinutes}${t.place.minutes}`}
        </p>
        {place.tel && (
          <a
            href={`tel:${place.tel.replace(/-/g, "")}`}
            className="flex items-center gap-2 text-navy transition-colors hover:text-orange"
          >
            <span className="w-4 shrink-0 text-center text-navy/35">☎</span>
            {place.tel}
          </a>
        )}
        {/*
          영업시간·평점을 정적 데이터로 복제하면 금방 오래된다.
          추정치를 사실처럼 띄우지 않고 최신 정보가 있는 외부 지도 장소
          페이지로 넘긴다.
        */}
        {externalMapUrl && (
          <a
            href={externalMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 flex items-center gap-2 border-t border-navy/5 pt-3 text-xs font-medium text-orange"
          >
            <ClockIcon className="h-4 w-4 shrink-0" />
            {t.place.kakaoMapCta}
          </a>
        )}
      </div>

      {/*
        문화 스토리텔링 — 아직 번역이 없어 다른 언어에서도 한국어 원문을 보여준다.
        이때 lang="ko"를 반드시 붙인다. <html lang>은 선택한 언어(en/ja/ru 등)로
        바뀌는데, 이 문단만 한국어인 걸 표시해두지 않으면 브라우저·번역기가 페이지
        전체를 해당 언어로 착각해 번역을 제안하지 않고, 스크린리더도 한국어를
        엉뚱한 발음으로 읽는다.
      */}
      {place.story && (
        <section
          style={{ animationDelay: "210ms" }}
          className="fade-up rounded-2xl bg-navy p-5 text-white"
        >
          <p className="text-[11px] font-semibold tracking-[0.15em] text-gold">
            {t.place.cultureStory}
          </p>
          {lang !== "ko" && (
            <p className="mt-1 text-[11px] text-white/40">{t.place.storyKoOnly}</p>
          )}
          <p lang="ko" className="mt-2.5 text-sm leading-relaxed text-white/90">
            {place.story}
          </p>
        </section>
      )}

      {place.category === "restaurant" && (
        <section className="rounded-2xl border border-orange/15 bg-orange-soft/35 p-5">
          <h2 className="text-sm font-bold">{visit.title}</h2>
          <ol className="mt-4 space-y-3">
            {visit.tips.map((tip, index) => (
              <li key={tip} className="flex items-start gap-3 text-xs leading-relaxed text-navy/70">
                <span aria-hidden="true" className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white font-bold text-orange">{index + 1}</span>
                <span>{tip}</span>
              </li>
            ))}
          </ol>
          {place.naverPlaceId && (
            <a href={`https://m.place.naver.com/restaurant/${place.naverPlaceId}/menu`} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-navy px-4 text-xs font-semibold text-white transition hover:bg-orange">
              {visit.menu} ↗
            </a>
          )}
        </section>
      )}

      {nearby.length > 0 && (
        <section className="rounded-2xl border border-navy/10 bg-white p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-bold">{visit.nearby}</h2>
            <Link href={`/map?q=${encodeURIComponent(place.name)}`} className="inline-flex min-h-11 items-center text-xs font-semibold text-orange">{visit.map} →</Link>
          </div>
          <p className="mb-3 text-[11px] text-navy/50">{visit.distance}</p>
          <div className="space-y-3">
            {nearby.map(({ place: nearbyPlace, distance }) => (
              <div key={nearbyPlace.id}>
                <p className="mb-1 text-right text-[11px] font-semibold tabular-nums text-navy/50">≈ {Math.round(distance)} m</p>
                <PlaceCard place={nearbyPlace} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* GPS 스탬프 인증 */}
      {slot && (
        <section
          style={{ animationDelay: "280ms" }}
          className="fade-up rounded-2xl border border-navy/5 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold">{t.place.checkin.title}</p>
            <span className="rounded-md bg-orange-soft px-2 py-1 text-[11px] font-medium text-orange">
              {localizeStampSlotName(slot.id, lang, slot.name)} {t.place.checkin.slotSuffix}
            </span>
          </div>
          {/* 모바일: 실제 GPS 인증. GPS·카메라는 현장에 있어야 의미가 있는 기능이라 PC에는 노출하지 않는다 */}
          <div className="md:hidden">
            <p className="mt-1.5 text-xs leading-relaxed text-navy/50">
              {t.place.checkin.radiusNote(CHECKIN_RADIUS_M)}
            </p>

            {checkin.status === "too-far" && (
              <p className="mt-2.5 rounded-xl bg-navy/5 p-3 text-xs text-navy/60">
                {t.place.checkin.tooFar(
                  checkin.distance >= 1000
                    ? `${(checkin.distance / 1000).toFixed(1)}km`
                    : `${checkin.distance}m`
                )}
              </p>
            )}
            {checkin.status === "error" && (
              <p className="mt-2.5 rounded-xl bg-navy/5 p-3 text-xs text-navy/60">
                {checkin.message}
              </p>
            )}

            {/* GPS 통과 후 문화 퀴즈 — 스토리를 읽어야 풀 수 있어 위치 위조를 걸러낸다 */}
            {!collected &&
              place.quiz &&
              (checkin.status === "quiz" || checkin.status === "quiz-wrong") && (
                <div className="fade-up mt-3 rounded-xl border border-orange/30 bg-orange-soft/40 p-4">
                  <p className="text-[11px] font-semibold tracking-wide text-orange">
                    {t.place.checkin.quizTitle}
                  </p>
                  {/* 퀴즈도 스토리와 함께 한국어 원문이라 lang을 명시한다 */}
                  <p lang="ko" className="mt-1.5 text-sm font-medium leading-relaxed">
                    {place.quiz.question}
                  </p>
                  <div className="mt-3 flex flex-col gap-2">
                    {place.quiz.options.map((opt, i) => (
                      <button
                        key={opt}
                        lang="ko"
                        onClick={() => answerQuiz(i)}
                        className="rounded-xl border border-navy/10 bg-white px-3 py-2.5 text-left text-xs transition duration-150 hover:border-orange hover:text-orange active:scale-[0.99]"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  <p className="mt-2.5 text-[11px] text-navy/50">
                    {checkin.status === "quiz-wrong" && (
                      <>{t.place.checkin.quizWrongPrefix} </>
                    )}
                    <span lang="ko">{place.quiz.hint}</span>
                  </p>
                </div>
              )}

            <button
              onClick={handleCheckin}
              disabled={collected || checkin.status === "locating"}
              className={clsx(
                "mt-3.5 w-full rounded-full py-3 text-sm font-semibold transition duration-200 disabled:cursor-default",
                collected
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-orange text-white hover:shadow-lg hover:shadow-orange/25 active:scale-[0.98] active:bg-orange/90"
              )}
            >
              {collected
                ? t.place.checkin.collected
                : checkin.status === "locating"
                  ? t.place.checkin.locating
                  : t.place.checkin.verify}
            </button>

            {/* 포토스팟은 인증샷 프레임까지 제공 — SNS 공유로 지역 홍보 효과 */}
            {place.category === "photo" && <PhotoFrame placeName={loc.name} />}
          </div>

          {/*
            PC: 스탬프는 현장에서만 받을 수 있는 기능이라, PC에서는 인증 수단을
            주지 않고 "휴대폰으로만 가능하다"는 사실을 먼저 못박는다.
            QR은 그 방법을 잇는 수단일 뿐이라는 순서로 문구를 정리했다.
          */}
          <div className="mt-1.5 hidden md:block">
            <p className="rounded-xl bg-navy/[0.04] px-4 py-3 text-sm font-semibold text-navy">
              {t.place.checkin.pcTitle}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-navy/55">
              {t.place.checkin.pcDesc}
            </p>
            <ol className="mt-3 flex flex-col gap-1.5 text-xs text-navy/60">
              <li>
                <b className="text-navy">1</b> {t.place.checkin.pcStep1}
              </li>
              <li>
                <b className="text-navy">2</b> {t.place.checkin.pcStep2}
              </li>
              <li>
                <b className="text-navy">3</b> {t.place.checkin.pcStep3}
              </li>
            </ol>
            <div className="mt-4 flex items-center gap-4">
              <div className="shrink-0 rounded-xl border border-navy/10 bg-white p-2">
                <PageQrCode className="h-24 w-24" />
              </div>
              <p className="text-[11px] leading-relaxed text-navy/40">
                {t.place.checkin.pcQrNote(loc.name)}
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
