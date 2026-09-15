import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보 처리 안내 | 원곡 보더리스",
};

const GOOGLE_PRIVACY = "https://policies.google.com/privacy";
const OPENAI_PRIVACY = "https://openai.com/policies/privacy-policy/";

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-12 text-sm leading-7 text-navy/75 md:px-8 md:py-20">
      <p className="text-xs font-bold tracking-[0.18em] text-orange">POLICY</p>
      <h1 className="mt-2 text-3xl font-bold text-navy">개인정보 처리 안내</h1>
      <p className="mt-3 text-xs text-navy/45">시행일: 2026년 8월 29일</p>

      <section className="mt-10 space-y-3">
        <h2 className="text-lg font-bold text-navy">처리하는 정보</h2>
        <p>
          원곡 보더리스는 회원가입을 받지 않습니다. 찜한 장소, 코스와 스탬프 기록은
          이용자의 브라우저 저장공간에 보관되며 서비스 서버의 회원 DB에 저장하지
          않습니다.
        </p>
        <p>
          지도에서 현재 위치를 켜거나 현장 인증을 선택하면 브라우저가 위치 권한을
          요청합니다. 좌표는 지도 표시와 방문 거리 계산에 사용하며 서비스 서버에
          저장하지 않습니다. 지도 위치 추적은 현재 위치 버튼을 다시 누르거나 지도
          페이지를 떠나면 종료됩니다. 현재 위치 주변 지도 표시를 위해 카카오맵이
          해당 지역의 지도 타일을 요청할 수 있습니다.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-bold text-navy">외부 서비스</h2>
        <p>
          사진이 없는 장소 상세 화면에서는 Google Places API를 통해 장소명, 주소와
          좌표를 조회하고 일치하는 장소의 사진을 표시할 수 있습니다. Google의 정보
          처리는 {" "}
          <a className="underline" href={GOOGLE_PRIVACY} target="_blank" rel="noopener noreferrer">
            Google 개인정보처리방침
          </a>
          을 따릅니다.
        </p>
        <p>
          AI 가이드에 입력한 질문은 답변 생성을 위해 OpenAI API로 전송됩니다. 서비스는
          대화 내용을 별도 DB에 저장하지 않으며, 외부 처리 기준은 {" "}
          <a className="underline" href={OPENAI_PRIVACY} target="_blank" rel="noopener noreferrer">
            OpenAI 개인정보처리방침
          </a>
          을 따릅니다.
        </p>
        <p>
          방문자 수와 페이지 조회수 확인을 위해 Vercel Analytics를 사용하며, 지도
          표시와 길찾기 연결에는 카카오맵 서비스를 사용합니다.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-bold text-navy">삭제와 문의</h2>
        <p>
          찜·코스·스탬프 기록은 브라우저 사이트 데이터 삭제 또는 서비스 내 초기화
          기능으로 삭제할 수 있습니다. 문의는 {" "}
          <a
            className="underline"
            href="https://github.com/LibrumLego/wongok-borderless-portfolio/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            프로젝트 문의 창구
          </a>
          를 이용할 수 있습니다.
        </p>
      </section>
    </article>
  );
}
