"use client";

import { useEffect, useRef } from "react";
import clsx from "clsx";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** 같은 화면에 여러 개가 동시에 들어올 때 시차를 주는 지연(ms) */
  delay?: number;
  /** 콘텐츠 블록을 감쌀 때 div 대신 section으로 렌더링 */
  asSection?: boolean;
  /**
   * div/section 외의 태그가 필요할 때. 연표처럼 ol 안에 들어가면 li여야
   * 목록으로 읽히는데, 그때 래퍼용 div를 하나 더 두면 마크업이 어긋난다.
   */
  as?: "li";
}

// 화면에 들어오면 한 번만 나타나는 래퍼. 실제 숨김/표시 스타일은 globals.css의 .reveal 참고.
export default function Reveal({
  children,
  className,
  delay = 0,
  asSection = false,
  as,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  // Tag가 div/section/li로 달라져 ref 타입이 하나로 안 좁혀진다.
  // 실제로 쓰는 건 classList뿐이라 공통 조상인 HTMLElement로 맞춘다.

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // IntersectionObserver를 못 쓰는 환경에서는 그냥 보이게 둔다.
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible");
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add("is-visible");
        io.disconnect();
      },
      {
        // 위쪽은 크게 확장해서 이미 지나친 요소도 교차 상태로 잡히게 한다.
        // (스크롤 위치 복원이나 한 번에 점프했을 때 영영 숨겨지는 것을 방지)
        // 아래쪽은 살짝 줄여서 요소가 조금 올라온 뒤에 재생되도록 한다.
        rootMargin: "9999px 0px -8% 0px",
        threshold: 0.05,
      }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as ?? (asSection ? "section" : "div");

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={clsx("reveal", className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
