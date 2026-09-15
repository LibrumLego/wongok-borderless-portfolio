"use client";

import { useEffect, useMemo, useState } from "react";
import { useT } from "@/lib/i18n/useT";

let streetPhotosPromise: Promise<string[]> | null = null;

function loadStreetPhotos(): Promise<string[]> {
  if (!streetPhotosPromise) {
    streetPhotosPromise = fetch("/api/tour?op=photos")
      .then((response) => (response.ok ? response.json() : { photos: [] }))
      .then((data: { photos?: string[] }) =>
        (data.photos ?? [])
          .filter((url) => /^https?:\/\//.test(url))
          .map((url) => url.replace(/^http:\/\//, "https://"))
      )
      .catch(() => []);
  }
  return streetPhotosPromise;
}

function stableIndex(value: string, length: number): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return length ? hash % length : 0;
}

/**
 * 매장 대표 사진이 없을 때 보여주는 한국관광공사 공식 원곡동 거리 사진.
 * 같은 API 요청은 브라우저에서 한 번만 수행하고, 장소별로 사진을 분산한다.
 */
export default function OfficialStreetPhoto({
  placeKey,
  placeName,
  labelClassName,
}: {
  placeKey: string;
  placeName: string;
  labelClassName?: string;
}) {
  const { t } = useT();
  const [photos, setPhotos] = useState<string[]>([]);
  const [failedCount, setFailedCount] = useState(0);

  useEffect(() => {
    let active = true;
    loadStreetPhotos().then((items) => {
      if (active) setPhotos(items);
    });
    return () => {
      active = false;
    };
  }, []);

  const firstIndex = useMemo(
    () => stableIndex(placeKey, photos.length),
    [placeKey, photos.length]
  );
  if (photos.length === 0 || failedCount >= photos.length) return null;

  const src = photos[(firstIndex + failedCount) % photos.length];

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={t.place.officialStreetImage(placeName)}
        onError={() => setFailedCount((count) => count + 1)}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <span
        className={`absolute rounded bg-black/65 px-1.5 py-0.5 text-[7px] leading-tight text-white ${
          labelClassName ?? "bottom-1 left-1 sm:bottom-2 sm:left-2 sm:text-[10px]"
        }`}
      >
        TourAPI · {t.place.imageFallbackLabel}
      </span>
    </>
  );
}
