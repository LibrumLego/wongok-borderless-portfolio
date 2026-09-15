"use client";

import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n/useT";

/**
 * 거리 공식 소개(관광공사 등록 정보)에서 방문 전에 알면 좋은 것만 뽑아 보여준다.
 *
 * 팀원이 만든 소개 카드는 이 거리가 어떤 곳인지 분위기를 전하는 글이고, 여기는
 * 그것과 겹치지 않게 '언제 가야 하는가'만 다룬다. 특히 오전 11시~오후 8시가
 * 차 없는 거리라는 사실은 방문 시간을 좌우하는데 우리 데이터에는 없던 정보다.
 *
 * 전문은 접어두고 필요할 때만 펼친다. 우리가 쓴 문장이 아니라 공공데이터 원문이라
 * 출처를 밝히고 한국어 원문 그대로 두되, lang="ko"로 표시해 번역기가 잡을 수 있게 한다.
 */
export default function StreetNotice() {
  const { t } = useT();
  const [overview, setOverview] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/tour?op=street")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && typeof data?.overview === "string") {
          setOverview(data.overview);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="rounded-2xl border border-gold/25 bg-gold/[0.06] p-3.5 md:rounded-3xl md:p-5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="rounded-md bg-gold/20 px-2 py-0.5 text-[10px] font-bold tracking-wide text-gold">
          {t.streetNotice.tipLabel}
        </span>
        <p className="text-xs font-semibold text-navy md:text-sm">
          {t.streetNotice.carFree}
        </p>
      </div>
      <p className="mt-1.5 text-[11px] leading-relaxed text-navy/55 md:text-xs">
        {t.streetNotice.carFreeWhy}
      </p>

      {overview && (
        <>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="mt-2 inline-flex min-h-11 items-center text-[11px] font-medium text-orange transition duration-150 hover:underline active:scale-95 md:text-xs"
          >
            {open ? t.streetNotice.hideOfficial : t.streetNotice.showOfficial}
          </button>
          {open && (
            <div className="mt-1">
              <p
                lang="ko"
                className="whitespace-pre-line text-[11px] leading-relaxed text-navy/65 md:text-xs"
              >
                {overview}
              </p>
              <p className="mt-2 text-[10px] text-navy/35">
                {t.streetNotice.source}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
