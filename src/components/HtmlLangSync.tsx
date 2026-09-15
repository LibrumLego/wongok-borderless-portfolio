"use client";

import { useEffect } from "react";
import { useLangStore } from "@/store/useLangStore";

/** <html lang> 속성을 실제 표시 언어와 맞춘다 (스크린리더·번역기 접근성) */
export default function HtmlLangSync() {
  const lang = useLangStore((s) => s.lang);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
