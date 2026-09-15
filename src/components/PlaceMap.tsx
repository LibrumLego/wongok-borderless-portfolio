"use client";

import { useEffect, useState } from "react";
import {
  Circle,
  CustomOverlayMap,
  Map,
  useKakaoLoader,
} from "react-kakao-maps-sdk";
import clsx from "clsx";
import { Place } from "@/types";
import { DISTRICT_EMOJI, WONGOK_CENTER } from "@/lib/constants";
import { LocateIcon, MapIcon } from "@/components/icons";
import { useT } from "@/lib/i18n/useT";
import { localizePlace, localizeDistrictName } from "@/lib/i18n/places";

const KAKAO_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;

interface PlaceMapProps {
  places: Place[];
  /** 목록·지도가 같은 선택 상태를 공유하도록 부모가 들고 있는다 */
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

interface DisplayPlace extends Place {
  displayLat: number;
  displayLng: number;
}

type GeoStatus = "idle" | "locating" | "ready" | "denied" | "unavailable" | "timeout";

interface UserLocation {
  lat: number;
  lng: number;
  accuracy: number;
}

/**
 * 같은 건물의 다른 층처럼 좌표가 사실상 같은 장소는 마커가 완전히 포개진다.
 * 원본 좌표는 건드리지 않고 화면에 그리는 위치만 실제 지점을 중심으로 작게 펼친다.
 */
function spreadOverlappingMarkers(places: Place[]): DisplayPlace[] {
  const result = places.map((place) => ({
    ...place,
    displayLat: place.lat,
    displayLng: place.lng,
  }));
  const visited = new Set<string>();

  for (const place of result) {
    if (visited.has(place.id)) continue;

    const group = result.filter((candidate) => {
      const latMeters = (candidate.lat - place.lat) * 111_000;
      const lngMeters =
        (candidate.lng - place.lng) *
        111_000 *
        Math.cos((place.lat * Math.PI) / 180);
      return Math.hypot(latMeters, lngMeters) < 2;
    });

    group.forEach((candidate) => visited.add(candidate.id));
    if (group.length < 2) continue;

    group.forEach((candidate, index) => {
      const angle = (2 * Math.PI * index) / group.length - Math.PI / 2;
      const radiusMeters = 4;
      candidate.displayLat =
        place.lat + (Math.sin(angle) * radiusMeters) / 111_000;
      candidate.displayLng =
        place.lng +
        (Math.cos(angle) * radiusMeters) /
          (111_000 * Math.cos((place.lat * Math.PI) / 180));
    });
  }

  return result;
}

function Placeholder() {
  const { t } = useT();
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 text-navy/30">
      <MapIcon className="h-8 w-8" />
      <p className="px-6 text-center text-xs leading-relaxed">
        {t.home.loadError}
      </p>
    </div>
  );
}

function KakaoMapInner({ places, selectedId, onSelect }: PlaceMapProps) {
  const { t, lang } = useT();
  const [tracking, setTracking] = useState(false);
  const [geoStatus, setGeoStatus] = useState<GeoStatus>("idle");
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [loading, error] = useKakaoLoader({
    appkey: KAKAO_KEY!,
    // SDK 기본값은 프로토콜 상대 URL(//dapi...)이라 http 환경에서 http로 로드된다.
    // CSP를 https로만 열어두기 위해 여기서 프로토콜을 고정한다.
    url: "https://dapi.kakao.com/v2/maps/sdk.js",
  });

  useEffect(() => {
    if (!tracking) return;

    let active = true;
    const watchId = navigator.geolocation.watchPosition(
      ({ coords }) => {
        if (!active) return;
        setUserLocation({
          lat: coords.latitude,
          lng: coords.longitude,
          accuracy: coords.accuracy,
        });
        setGeoStatus("ready");
      },
      (geoError) => {
        if (!active) return;
        setUserLocation(null);
        setGeoStatus(
          geoError.code === geoError.PERMISSION_DENIED
            ? "denied"
            : geoError.code === geoError.TIMEOUT
              ? "timeout"
              : "unavailable"
        );
        setTracking(false);
      },
      { enableHighAccuracy: true, maximumAge: 5_000, timeout: 10_000 }
    );

    return () => {
      active = false;
      navigator.geolocation.clearWatch(watchId);
    };
  }, [tracking]);

  function toggleTracking() {
    if (tracking) {
      setTracking(false);
      setUserLocation(null);
      setGeoStatus("idle");
      return;
    }

    if (!("geolocation" in navigator)) {
      setGeoStatus("unavailable");
      return;
    }

    onSelect(null);
    setGeoStatus("locating");
    setTracking(true);
  }

  if (loading)
    return (
      <div
        className="h-full animate-pulse rounded-2xl bg-navy/5"
        aria-label="지도 로딩 중"
      />
    );
  if (error) return <Placeholder />;

  const selected = places.find((p) => p.id === selectedId);
  const displayPlaces = spreadOverlappingMarkers(places);
  const selectedLoc = selected ? localizePlace(selected, lang) : null;
  // 선택된 곳이 있으면 그 지점을 중심으로 옮겨 화면 밖에 있어도 보이게 한다
  const onlyResult = places.length === 1 ? places[0] : null;
  const centerPlace = selected ?? (!userLocation ? onlyResult : null);
  const center = selected
    ? { lat: selected.lat, lng: selected.lng }
    : userLocation ??
      (onlyResult
        ? { lat: onlyResult.lat, lng: onlyResult.lng }
        : WONGOK_CENTER);

  const geoMessage =
    geoStatus === "locating"
      ? t.map.locating
      : geoStatus === "ready"
        ? t.map.locationReady
        : geoStatus === "denied"
          ? t.map.locationDenied
          : geoStatus === "timeout"
            ? t.map.locationTimeout
            : geoStatus === "unavailable"
              ? t.map.locationUnavailable
              : null;

  return (
    <div className="relative h-full">
      <Map
        key={centerPlace?.id ?? (userLocation ? "user-location" : "all-places")}
        center={center}
        isPanto
        level={centerPlace ? 3 : 4}
        className="h-full w-full"
      >
        {userLocation && (
          <>
            <Circle
              center={userLocation}
              radius={userLocation.accuracy}
              strokeWeight={1}
              strokeColor="#2563eb"
              strokeOpacity={0.5}
              fillColor="#3b82f6"
              fillOpacity={0.12}
            />
            <CustomOverlayMap
              position={userLocation}
              yAnchor={0.5}
              zIndex={20}
            >
              <span className="user-location-marker" role="img" aria-label={t.map.myLocation}>
                <i />
              </span>
            </CustomOverlayMap>
          </>
        )}
        {displayPlaces.map((p) => (
          <CustomOverlayMap
            key={p.id}
            position={{ lat: p.displayLat, lng: p.displayLng }}
            yAnchor={1}
            zIndex={selectedId === p.id ? 10 : 1}
          >
            <button
              onClick={() => onSelect(selectedId === p.id ? null : p.id)}
              className={clsx(
                "flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white text-sm shadow-md transition duration-200 hover:scale-110 hover:border-orange/60 hover:shadow-lg active:scale-95 md:h-9 md:w-9 md:text-base",
                selectedId === p.id
                  ? "scale-110 border-orange ring-4 ring-orange/20"
                  : "border-navy/15"
              )}
              aria-label={localizePlace(p, lang).name}
            >
              {DISTRICT_EMOJI[p.district]}
            </button>
          </CustomOverlayMap>
        ))}
      </Map>

      <div className="absolute right-3 top-3 z-20 flex max-w-[calc(100%-1.5rem)] flex-col items-end gap-2">
        <button
          type="button"
          onClick={toggleTracking}
          aria-pressed={tracking}
          aria-label={tracking ? t.map.stopTracking : t.map.myLocation}
          className={clsx("map-location-button", tracking && "is-tracking")}
        >
          <LocateIcon className="h-5 w-5" />
          <span className="sr-only">
            {tracking ? t.map.stopTracking : t.map.myLocation}
          </span>
          {geoStatus === "locating" && <i className="map-location-spinner" aria-hidden="true" />}
        </button>
        {geoMessage && geoStatus !== "ready" && geoStatus !== "locating" && (
          <p
            className={clsx(
              "map-location-message",
              geoStatus === "denied" || geoStatus === "unavailable" || geoStatus === "timeout"
                ? "is-error"
                : ""
            )}
            role="status"
          >
            {geoMessage}
          </p>
        )}
      </div>

      {selected && selectedLoc && (
        <div
          key={selected.id}
          className="fade-up absolute bottom-3 left-3 right-3 z-10 rounded-2xl border border-navy/5 bg-white p-3 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-soft text-xl">
              {DISTRICT_EMOJI[selected.district]}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {selectedLoc.name}
                {selectedLoc.signName && (
                  <span lang="ko" className="ml-1.5 text-[11px] font-normal text-navy/40">
                    {selectedLoc.signName}
                  </span>
                )}
              </p>
              <p className="truncate text-[11px] text-navy/45">
                {localizeDistrictName(selected.district, lang)} ·{" "}
                {t.common.stationLabel} {selected.walkMinutes}
                {t.common.minuteUnit}
                {selected.tel ? ` · ${selected.tel}` : ""}
              </p>
            </div>
            <button
              onClick={() => onSelect(null)}
              aria-label="닫기"
              className="shrink-0 rounded-full px-2 py-1 text-navy/35 transition-colors hover:text-navy/70"
            >
              ✕
            </button>
          </div>
          <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-navy/55">
            {selectedLoc?.description}
          </p>
          <a
            href={`/place/${selected.id}`}
            className="mt-2.5 block rounded-full bg-orange py-2 text-center text-xs font-semibold text-white transition duration-150 active:scale-[0.98]"
          >
            {t.map.detail}
          </a>
        </div>
      )}
    </div>
  );
}

export default function PlaceMap(props: PlaceMapProps) {
  if (!KAKAO_KEY) {
    return <Placeholder />;
  }
  return <KakaoMapInner {...props} />;
}
