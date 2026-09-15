"use client";

import Link from "next/link";
import clsx from "clsx";
import {
  STAMP_SLOTS,
  STAMP_GOAL,
  STAMP_TIERS,
  STAMP_TOTAL,
} from "@/lib/constants";
import { useStampStore } from "@/store/useStampStore";
import { CheckIcon, LockIcon, StampIcon } from "@/components/icons";
import PageAtmosphere from "@/components/PageAtmosphere";
import { useT } from "@/lib/i18n/useT";
import {
  localizeStampSlotName,
  localizeStampSlotGuide,
  localizeTier,
} from "@/lib/i18n/places";

export default function StampPage() {
  const { t, lang } = useT();
  const records = useStampStore((s) => s.records);
  const reset = useStampStore((s) => s.reset);
  const collected = new Set(records.map((r) => r.slotId));
  const done = collected.size;
  const nextTier = STAMP_TIERS.find((tier) => done < tier.count);

  function handleReset() {
    if (done === 0 || !window.confirm(t.stamp.resetConfirm)) return;
    reset();
  }

  return (
    // 모바일은 한 칼럼 그대로, 데스크톱만 2단 그리드로 재배치(DOM 순서는 유지)
    <div className="page-shell mx-auto flex w-full max-w-2xl flex-col gap-5 p-4 pt-5 md:max-w-6xl md:px-8 md:pt-10 md:pb-16 lg:grid lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-x-8 lg:gap-y-6">
      <PageAtmosphere variant="stamp" />
      <div className="page-intro-card fade-up flex items-center justify-between gap-4 lg:col-span-2">
        <div>
          <p className="page-kicker">
            <span className="page-kicker-dot" />
            BORDERLESS PASSPORT
          </p>
          <h1 className="text-lg font-bold md:text-3xl">{t.stamp.title}</h1>
        </div>
        <span className="page-icon-tile">
          <StampIcon className="h-6 w-6" />
        </span>
      </div>

      {/* 여권 카드 */}
      <div
        className="stamp-passport-card interactive-panel fade-up overflow-hidden rounded-3xl bg-navy text-white lg:col-start-1 lg:row-start-2"
        style={{ animationDelay: "70ms" }}
      >
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-gold">
              BORDERLESS PASSPORT
            </p>
            <span className="text-[10px] text-white/40">WONGOK · ANSAN</span>
          </div>
          <p className="mt-3 text-4xl font-bold">
            {done}
            <span className="text-lg font-normal text-white/50">
              {" "}
              / {STAMP_TOTAL}
            </span>
          </p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange to-gold transition-all"
              style={{ width: `${(done / STAMP_TOTAL) * 100}%` }}
            />
          </div>
          <button
            type="button"
            onClick={handleReset}
            disabled={done === 0}
            className="mt-4 rounded-full border border-white/20 px-3 py-1.5 text-[11px] font-medium text-white/65 transition hover:border-white/45 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            {t.stamp.reset}
          </button>
        </div>
        {/* 단계별 배지 — 6칸 완주 전에도 2·4칸에서 성취를 준다 */}
        <div className="flex divide-x divide-white/10 border-t border-white/10">
          {STAMP_TIERS.map((tier) => {
            const unlocked = done >= tier.count;
            const tierLoc = localizeTier(tier, lang, STAMP_TOTAL);
            return (
              <div
                key={tier.count}
                className={clsx(
                  "flex-1 px-3 py-3 text-center transition-opacity",
                  unlocked ? "opacity-100" : "opacity-35"
                )}
              >
                <p className={clsx("text-xl", unlocked && "stamp-pop")}>
                  {unlocked ? tier.emoji : "🔒"}
                </p>
                <p className="mt-1 text-[10px] font-semibold text-white/90">
                  {tierLoc.name}
                </p>
                <p className="text-[9px] text-white/40">
                  {tier.count}
                  {t.stamp.slotSuffix}
                </p>
              </div>
            );
          })}
        </div>
        <div className="border-t border-white/10 bg-white/5 px-6 py-3 text-xs text-white/70">
          {nextTier
            ? t.stamp.untilTier(
                localizeTier(nextTier, lang, STAMP_TOTAL).name,
                nextTier.count - done,
                localizeTier(nextTier, lang, STAMP_TOTAL).description
              )
            : lang === "ko"
              ? STAMP_GOAL
              : t.common.stampGoal(STAMP_TOTAL)}
          {/* STAMP_GOAL은 ko 전용 상수, en/zh는 t.common.stampGoal이 담당 */}
        </div>
      </div>

      {/* 인증 방식 안내 */}
      <div
        style={{ animationDelay: "140ms" }}
        className="interactive-panel fade-up rounded-2xl border border-navy/5 bg-white/90 p-4 text-xs leading-relaxed text-navy/60 shadow-sm backdrop-blur md:p-6 md:text-sm lg:col-start-1 lg:row-start-3"
      >
        <p className="font-semibold text-navy">{t.stamp.howTitle}</p>
        {lang === "ko" && (
          <p className="mt-1">
            각 칸은 특정 매장이 아닌 <b>구역 단위</b>예요. 후보 매장 중 아무 곳이나
            방문한 뒤, 상세 페이지에서 <b>GPS 현장 인증</b>을 누르면 채워집니다.
            (안산 12경 스탬프투어와 같은 위치 인증 방식)
          </p>
        )}
        {lang === "en" && (
          <p className="mt-1">
            Each slot represents a <b>district</b>, not one specific shop. Visit
            any candidate shop, then tap <b>GPS check-in</b> on its detail page
            to fill the slot. (Same location-verification method as Ansan&apos;s
            12 Views stamp tour.)
          </p>
        )}
        {lang === "zh" && (
          <p className="mt-1">
            每一格代表的是<b>一个片区</b>，而不是特定的某家店。到候选店铺中任意一家参观后，
            在详情页点击<b>GPS现场认证</b>即可填满该格。（与安山12景集章之旅相同的位置验证方式）
          </p>
        )}
        {lang === "ja" && (
          <p className="mt-1">
            各マスは特定の店舗ではなく<b>地区単位</b>です。候補の店舗のどこかを訪問した後、
            詳細ページで<b>GPS現地認証</b>を押すと埋まります。
            （アンサン12景スタンプツアーと同じ位置認証方式）
          </p>
        )}
        {lang === "ru" && (
          <p className="mt-1">
            Каждая ячейка соответствует <b>району</b>, а не конкретному магазину. Посетите
            любой из подходящих магазинов, затем нажмите <b>GPS-отметку</b> на его странице,
            чтобы заполнить ячейку. (Тот же способ проверки местоположения, что и в туре
            печатей «12 видов Ансана».)
          </p>
        )}
      </div>

      {/* 스탬프 칸 */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:col-start-2 lg:row-start-2 lg:row-end-5">
        {STAMP_SLOTS.map((slot, i) => {
          const isDone = collected.has(slot.id);
          return (
            <div
              key={slot.id}
              style={{ animationDelay: `${210 + i * 55}ms` }}
              className={clsx(
                "stamp-collect-card interactive-panel fade-up relative flex flex-col items-center rounded-2xl border p-4 text-center shadow-sm transition-colors",
                isDone
                  ? "border-orange/40 bg-orange-soft"
                  : "border-dashed border-navy/15 bg-white"
              )}
            >
              <span
                className={clsx(
                  "flex h-12 w-12 items-center justify-center rounded-full border-2",
                  isDone
                    ? "stamp-pop border-orange bg-orange text-white"
                    : "border-dashed border-navy/20 text-navy/25"
                )}
              >
                {isDone ? (
                  <CheckIcon className="h-6 w-6" />
                ) : (
                  <LockIcon className="h-5 w-5" />
                )}
              </span>
              <p className="mt-2.5 text-sm font-semibold">
                {localizeStampSlotName(slot.id, lang, slot.name)}
              </p>
              <p
                className={clsx(
                  "mt-1 text-[11px] leading-snug",
                  isDone ? "font-medium text-orange" : "text-navy/45"
                )}
              >
                {isDone
                  ? t.stamp.collectedLabel
                  : localizeStampSlotGuide(slot.id, lang, slot.guide)}
              </p>
            </div>
          );
        })}
      </div>

      <Link
        href="/map"
        style={{ animationDelay: "670ms" }}
        className="fade-up rounded-full bg-navy py-3.5 text-center text-sm font-semibold text-white transition duration-200 hover:bg-navy-light hover:shadow-lg hover:shadow-navy/20 active:scale-[0.98] md:px-8 lg:col-start-1 lg:row-start-4 lg:self-start"
      >
        {t.stamp.findOnMap}
      </Link>
    </div>
  );
}
