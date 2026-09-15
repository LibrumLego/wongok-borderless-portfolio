import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "서비스 이용약관 | 원곡 보더리스",
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-12 text-sm leading-7 text-navy/75 md:px-8 md:py-20">
      <p className="text-xs font-bold tracking-[0.18em] text-orange">TERMS</p>
      <h1 className="mt-2 text-3xl font-bold text-navy">서비스 이용약관</h1>
      <p className="mt-3 text-xs text-navy/45">시행일: 2026년 8월 29일</p>

      <section className="mt-10 space-y-3">
        <h2 className="text-lg font-bold text-navy">서비스 성격</h2>
        <p>
          원곡 보더리스는 안산 원곡동 방문을 돕는 관광 안내 서비스입니다. 장소 정보,
          코스와 AI 답변은 여행 계획을 위한 참고 정보이며 실제 영업시간, 메뉴, 가격과
          현장 상황은 방문 전에 해당 업체 또는 연결된 지도 서비스에서 확인해야 합니다.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-bold text-navy">데이터와 외부 콘텐츠</h2>
        <p>
          관광지 정보는 한국관광공사 TourAPI, 지도와 길찾기는 카카오맵, 일부 장소
          사진은 Google Maps Platform을 통해 제공됩니다. 각 외부 콘텐츠에는 해당
          제공자의 약관과 정책이 적용됩니다.
        </p>
        <p>
          Google Maps 콘텐츠를 사용하는 경우 {" "}
          <a
            className="underline"
            href="https://cloud.google.com/maps-platform/terms"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Maps Platform 이용약관
          </a>
          과 Google의 관련 정책이 함께 적용됩니다. Google 사진은 서비스가 저장하지
          않으며 화면에 표시된 Google Maps 및 촬영자 링크를 통해 원본을 확인할 수
          있습니다.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-bold text-navy">이용자 책임과 제한</h2>
        <p>
          이용자는 서비스를 정상적인 관광 정보 탐색 목적으로 사용해야 하며, API를
          과도하게 반복 호출하거나 서비스 운영을 방해해서는 안 됩니다. 위치 인증은
          실제 방문 여부 확인을 보조하는 기능이며 안전한 이동과 현장 규칙 준수의 책임은
          이용자에게 있습니다.
        </p>
      </section>
    </article>
  );
}
