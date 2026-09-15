"use client";

import { useLangStore } from "@/store/useLangStore";
import { UI } from "@/lib/i18n/ui";

/** 현재 언어의 UI 사전과 언어 상태를 함께 돌려준다 */
export function useT() {
  const lang = useLangStore((s) => s.lang);
  const setLang = useLangStore((s) => s.setLang);
  const cycle = useLangStore((s) => s.cycle);
  return { t: UI[lang], lang, setLang, cycle };
}
