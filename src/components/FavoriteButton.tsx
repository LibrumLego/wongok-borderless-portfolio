"use client";

import clsx from "clsx";
import { useFavoriteStore } from "@/store/useFavoriteStore";
import { useT } from "@/lib/i18n/useT";
import { HeartIcon } from "@/components/icons";

/**
 * 찜 토글.
 *
 * 카드 안에 들어가는 경우가 많아서, 카드 전체가 링크·버튼일 때 클릭이 겹치지
 * 않도록 이벤트 전파를 여기서 끊는다.
 */
export default function FavoriteButton({
  placeId,
  className,
}: {
  placeId: string;
  className?: string;
}) {
  const { t } = useT();
  const ids = useFavoriteStore((s) => s.ids);
  const toggle = useFavoriteStore((s) => s.toggle);
  const on = ids.includes(placeId);

  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? t.favorite.remove : t.favorite.add}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(placeId);
      }}
      /*
       * 손가락으로 누르는 버튼이라 최소 44x44를 확보한다. 아이콘은 20px 그대로 두고
       * 패딩으로 영역만 넓혀, 보기에는 그대로면서 누르기는 편하게 한다.
       */
      className={clsx(
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition duration-150 active:scale-90",
        on ? "text-orange" : "text-navy/25 hover:text-navy/50",
        className
      )}
    >
      <HeartIcon className="h-5 w-5" filled={on} />
    </button>
  );
}
