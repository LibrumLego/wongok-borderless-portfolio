"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 화면에 들어올 때 0에서 목표값까지 세는 숫자.
 * 히어로 통계 배너처럼 첫인상에 힘을 주는 자리에만 쓴다.
 */
export default function CountUp({
  value,
  suffix = "",
  durationMs = 900,
}: {
  value: number;
  suffix?: string;
  durationMs?: number;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const played = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setDisplay(value);
      return;
    }

    const play = () => {
      if (played.current) return;
      played.current = true;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / durationMs);
        // ease-out-cubic: 빠르게 시작해서 목표값 근처에서 부드럽게 멈춘다
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplay(Math.round(value * eased));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        play();
      },
      { threshold: 0.4 }
    );
    io.observe(el);

    // 관찰자나 requestAnimationFrame이 끝내 반응하지 않는 경우(백그라운드 탭 등)를
    // 대비한 안전장치. rAF 자체가 막혀 있을 수 있으니 애니메이션 없이 바로 값을 채운다.
    const fallback = window.setTimeout(() => {
      if (played.current) return;
      played.current = true;
      setDisplay(value);
    }, 2500);

    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, [value, durationMs]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
}
