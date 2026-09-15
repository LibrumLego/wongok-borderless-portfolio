import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * 원곡동 거주 외국인 구성과 거리의 음식 구성을 함께 반영한 언어 목록.
 * zh(중국계 71%)·ru(우즈베키스탄·러시아·카자흐스탄 등 러시아어권 2위 그룹)가
 * 거주민 기준 근거가 가장 크고, id는 거리에서 식당 수가 가장 많은 계열이라 넣었다.
 */
export type Lang = "ko" | "en" | "zh" | "ja" | "ru" | "id";
export const LANGS: Lang[] = ["ko", "en", "zh", "ja", "ru", "id"];

interface LangState {
  lang: Lang;
  setLang: (lang: Lang) => void;
  cycle: () => void;
}

// 경로는 그대로 두고(/en/, /zh/ 서브패스 없음) 클라이언트 상태로만 언어를 전환한다.
// 이미 QR·배포 링크가 /map, /place/[id] 형태로 팀원·심사위원에게 공유된 뒤라
// Next.js 공식 가이드의 app/[lang] 라우팅 전면 재구성은 위험 대비 이득이 적다.
export const useLangStore = create<LangState>()(
  persist(
    (set, get) => ({
      lang: "ko",
      setLang: (lang) => set({ lang }),
      cycle: () => {
        const i = LANGS.indexOf(get().lang);
        set({ lang: LANGS[(i + 1) % LANGS.length] });
      },
    }),
    { name: "wongok-lang" }
  )
);
