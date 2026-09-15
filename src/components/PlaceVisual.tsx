"use client";

import { useState } from "react";
import clsx from "clsx";
import { DistrictCode } from "@/types";
import { DISTRICT_EMOJI } from "@/lib/constants";
import { localizeDistrictName } from "@/lib/i18n/places";
import { useT } from "@/lib/i18n/useT";
import GooglePlacePhoto from "@/components/GooglePlacePhoto";

/**
 * 장소 사진 표현.
 *
 * 실제·사용 허가가 확인된 사진만 imageUrl에 넣는다. 사진이 없거나 외부 원본이
 * 실패하면 다른 식당·거리 사진을 대표 사진처럼 재사용하지 않고, 장소 구역을
 * 나타내는 공통 비주얼로 대체한다. 이후 팀이 직접 촬영한 사진을 추가하면 자동으로
 * 대표 이미지로 전환된다.
 */
export default function PlaceVisual({
  imageUrl,
  placeId,
  allowGooglePhoto = false,
  compactGooglePhoto = false,
  placeName,
  district,
  className,
}: {
  imageUrl?: string;
  placeId?: string;
  /** Google Places 사진은 보이는 영역에서만 지연 로딩한다. */
  allowGooglePhoto?: boolean;
  compactGooglePhoto?: boolean;
  placeName: string;
  district: DistrictCode;
  className?: string;
}) {
  const { t, lang } = useT();
  const [failedUrl, setFailedUrl] = useState<string | undefined>();
  const hasImage = Boolean(imageUrl) && failedUrl !== imageUrl;

  return (
    <div
      className={clsx(
        "relative isolate overflow-hidden bg-gradient-to-br from-navy via-navy-light to-orange/80",
        className
      )}
    >
      {hasImage ? (
        // 외부 사진은 추후 현장 촬영본 또는 사용 허가가 확인된 원본만 넣는다.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={placeName}
          onError={() => setFailedUrl(imageUrl)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div
          role="img"
          aria-label={t.place.imageFallback(placeName)}
          className={clsx("flex h-full w-full flex-col text-white", compactGooglePhoto ? "items-center justify-center p-2" : "justify-between p-3")}
        >
          <span className="absolute inset-0 -z-10 opacity-30 [background-image:radial-gradient(circle_at_1px_1px,_white_1px,_transparent_0)] [background-size:18px_18px]" />
          <span className={clsx("text-[9px] font-semibold tracking-[0.2em] text-white/65", compactGooglePhoto && "hidden")}>
            WONGOK · ANSAN
          </span>
          {!compactGooglePhoto && (
            <div className="min-h-0 px-3 py-2">
              <p className="line-clamp-2 text-xl font-bold leading-tight tracking-tight sm:text-3xl">{placeName}</p>
              <p className="mt-2 line-clamp-1 text-[10px] text-white/65">{t.place.imageFallback(placeName)}</p>
            </div>
          )}
          <div className="flex items-end justify-between gap-2">
            <span className={clsx("text-3xl leading-none", !compactGooglePhoto && "sm:text-5xl")} aria-hidden="true">
              {DISTRICT_EMOJI[district]}
            </span>
            <span className={clsx("text-right text-[9px] font-medium leading-tight text-white/80 sm:text-xs", compactGooglePhoto && "hidden")}>
              {localizeDistrictName(district, lang)}
              <br />
              {t.place.imageFallbackLabel}
            </span>
          </div>
        </div>
      )}
      {!hasImage && allowGooglePhoto && placeId && (
        <GooglePlacePhoto
          key={placeId}
          placeId={placeId}
          placeName={placeName}
          compact={compactGooglePhoto}
        />
      )}
    </div>
  );
}
