import Link from "next/link";
import clsx from "clsx";
import { Place } from "@/types";
import { WalkIcon } from "@/components/icons";
import { useT } from "@/lib/i18n/useT";
import { localizePlace, localizeDistrictName } from "@/lib/i18n/places";
import FavoriteButton from "@/components/FavoriteButton";
import PlaceVisual from "@/components/PlaceVisual";

/**
 * onSelect가 주어지면 링크가 아니라 버튼으로 동작한다.
 * 지도 화면에서는 카드를 눌렀을 때 페이지를 떠나는 대신 해당 마커를 선택하고
 * 지도로 스크롤해, 목록과 지도를 오가며 위치를 확인할 수 있게 한다.
 */
export default function PlaceCard({
  place,
  index,
  onSelect,
  selected = false,
}: {
  place: Place;
  index?: number;
  onSelect?: () => void;
  selected?: boolean;
}) {
  const { t, lang } = useT();
  const loc = localizePlace(place, lang);

  // 찜 버튼은 카드 오른쪽 위의 상호 여백에 배치한다.
  const className = clsx(
    "place-card group relative flex w-full gap-3.5 overflow-hidden border bg-white p-3 text-left transition duration-200 hover:-translate-y-0.5 active:scale-[0.98]",
    selected ? "is-selected border-orange" : "border-navy/10"
  );

  const inner = (
    <>
      <div className="place-card-visual-wrap">
        <PlaceVisual
          imageUrl={place.imageUrl}
          placeId={place.id}
          allowGooglePhoto
          compactGooglePhoto
          placeName={loc.name}
          district={place.district}
          className="h-[4.75rem] w-[5.25rem] shrink-0 transition duration-300 group-hover:scale-[1.04] md:h-[5.4rem] md:w-[6rem]"
        />
        {index !== undefined && (
          <span className="place-card-index" aria-hidden="true">
            {String(index).padStart(2, "0")}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        {/* 간판에 적힌 한국어 상호를 함께 보여줘 현장에서 대조할 수 있게 한다 */}
        <p className="line-clamp-2 pr-7 text-[15px] font-bold tracking-tight">
          {loc.name}
          {loc.signName && (
            <span lang="ko" className="ml-1.5 text-xs font-normal text-navy/40">
              {loc.signName}
            </span>
          )}
        </p>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-navy/75">
          {loc.description}
        </p>
        <div className="mt-2 flex flex-wrap gap-1 pr-6">
          {loc.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-md bg-orange/5 px-1.5 py-0.5 text-[10px] text-navy/65">#{tag}</span>
          ))}
        </div>
        {selected && <p lang="ko" className="mt-2 text-xs leading-relaxed text-navy/65">{place.address}</p>}
        <div className="mt-2 flex flex-wrap items-center gap-1.5 pr-8 text-[10px]">
          <span className="place-card-district px-2 py-1 font-semibold text-navy">
            {localizeDistrictName(place.district, lang)}
          </span>
          <span className="flex items-center gap-0.5 text-navy/70">
            <WalkIcon className="h-3.5 w-3.5" />
            {t.common.stationLabel} {place.walkMinutes}
            {t.common.minuteUnit}
          </span>
          {place.tel && (
            <span className="text-navy/70">☎ {place.tel}</span>
          )}
        </div>
      </div>
    </>
  );

  /*
   * 찜 버튼은 카드(button/Link) 안에 넣으면 중첩 인터랙티브 요소가 되어 HTML이
   * 유효하지 않고 클릭도 겹친다. 그래서 래퍼를 두고 형제로 얹는다.
   */
  return (
    <div className="relative">
      {onSelect ? (
        <button type="button" onClick={onSelect} aria-pressed={selected} className={className}>
          {inner}
        </button>
      ) : (
        <Link href={`/place/${place.id}`} className={className}>
          {inner}
        </Link>
      )}
      <FavoriteButton
        placeId={place.id}
        className="absolute top-1 right-1"
      />
      {onSelect && selected && (
        <Link href={`/place/${place.id}`} className="mt-1 flex min-h-11 items-center justify-center rounded-xl bg-navy text-xs font-semibold text-white transition hover:bg-orange">
          {loc.name} →
        </Link>
      )}
    </div>
  );
}
