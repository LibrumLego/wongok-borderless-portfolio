"use client";

import { useEffect, useRef, useState } from "react";

interface Author {
  name: string;
  uri: string;
  photoUri?: string;
}

interface PhotoMeta {
  available: boolean;
  googleMapsUri?: string | null;
  authors?: Author[];
}

function externalUrl(uri: string): string | null {
  if (uri.startsWith("https://") || uri.startsWith("http://")) return uri;
  if (uri.startsWith("//")) return `https:${uri}`;
  return null;
}

/**
 * Google Places 사진의 표시 전용 레이어.
 * 썸네일 목록에서는 호출하지 않아 비용을 통제하고, 상세 화면에서만 상호·주소
 * 일치 검증을 거친 사진과 필수 저작자 표시를 함께 보여준다.
 */
export default function GooglePlacePhoto({
  placeId,
  placeName,
  compact = false,
}: {
  placeId: string;
  placeName: string;
  /** 지도 카드처럼 작은 영역에서는 링크 대신 최소 출처 문구만 표시한다. */
  compact?: boolean;
}) {
  const [meta, setMeta] = useState<PhotoMeta | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || shouldLoad) return;
    if (!("IntersectionObserver" in window)) {
      const timer = setTimeout(() => setShouldLoad(true), 0);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: "180px" }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [shouldLoad]);

  useEffect(() => {
    if (!shouldLoad) return;
    const controller = new AbortController();

    fetch(`/api/place-photo?id=${encodeURIComponent(placeId)}&mode=meta`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : { available: false }))
      .then((data: PhotoMeta) => {
        if (!controller.signal.aborted) setMeta(data);
      })
      .catch(() => {
        if (!controller.signal.aborted) setMeta({ available: false });
      });

    return () => controller.abort();
  }, [placeId, shouldLoad]);

  const validAuthors = (meta?.authors ?? []).filter((author) => author.name);
  const googleMapsUri = meta?.googleMapsUri
    ? externalUrl(meta.googleMapsUri)
    : null;

  return (
    <div ref={containerRef} className="absolute inset-0">
      {meta?.available && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/place-photo?id=${encodeURIComponent(placeId)}&mode=media`}
            alt={placeName}
            onLoad={() => setLoaded(true)}
            onError={() => setMeta({ available: false })}
            className="absolute inset-0 h-full w-full object-cover"
          />
          {loaded && compact && (
            <div
              className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/80 to-transparent px-1 pb-1 pt-4 text-[7px] leading-none text-white"
              title={["Google Maps", ...validAuthors.map((author) => author.name)].join(" · ")}
            >
              <span translate="no">Google Maps</span>
              {validAuthors[0] && <span> · {validAuthors[0].name}</span>}
            </div>
          )}
          {loaded && !compact && (
            <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-x-2 gap-y-1 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-6 text-[11px] text-white">
              {googleMapsUri ? (
                <a
                  href={googleMapsUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  translate="no"
                  className="font-normal text-white underline decoration-white/50 underline-offset-2"
                >
                  Google Maps
                </a>
              ) : (
                <span translate="no">Google Maps</span>
              )}
              {validAuthors.map((author) => {
                const authorUri = externalUrl(author.uri);
                return authorUri ? (
                  <a
                    key={`${author.name}-${author.uri}`}
                    href={authorUri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/90 underline decoration-white/40 underline-offset-2"
                  >
                    {author.name}
                  </a>
                ) : (
                  <span key={author.name} className="text-white/90">
                    {author.name}
                  </span>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
