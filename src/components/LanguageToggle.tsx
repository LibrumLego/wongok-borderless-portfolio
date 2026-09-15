"use client";

import clsx from "clsx";
import { useEffect, useId, useRef, useState } from "react";
import { useT } from "@/lib/i18n/useT";
import { LANGS, Lang } from "@/store/useLangStore";

const LABEL: Record<Lang, string> = {
  ko: "한",
  en: "EN",
  zh: "中",
  ja: "日",
  ru: "RU",
  id: "ID",
};

const FULL_LABEL: Record<Lang, string> = {
  ko: "한국어",
  en: "English",
  zh: "中文",
  ja: "日本語",
  ru: "Русский",
  id: "Bahasa Indonesia",
};

const TRIGGER_LABEL: Record<Lang, (current: string) => string> = {
  ko: (current) => `언어 선택, 현재 ${current}`,
  en: (current) => `Choose language, currently ${current}`,
  zh: (current) => `选择语言，当前为${current}`,
  ja: (current) => `言語を選択、現在は${current}`,
  ru: (current) => `Выбрать язык, сейчас ${current}`,
  id: (current) => `Pilih bahasa, saat ini ${current}`,
};

const MENU_LABEL: Record<Lang, string> = {
  ko: "언어 목록",
  en: "Language options",
  zh: "语言列表",
  ja: "言語一覧",
  ru: "Список языков",
  id: "Daftar bahasa",
};

export default function LanguageToggle({
  className = "",
  variant = "segmented",
}: {
  className?: string;
  variant?: "segmented" | "cycle";
}) {
  const { lang, setLang } = useT();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const compact = variant === "cycle";

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  const selectLanguage = (nextLang: Lang) => {
    setLang(nextLang);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div
      ref={rootRef}
      className={clsx(
        "inline-flex shrink-0 rounded-full",
        compact ? "border" : "relative border p-0.5",
        className
      )}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-label={TRIGGER_LABEL[lang](FULL_LABEL[lang])}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen((open) => !open)}
        className={clsx(
          "flex items-center justify-center gap-1.5 rounded-full font-semibold tracking-wide transition duration-150 hover:bg-white/10 active:scale-95",
          compact
            ? "h-11 min-w-11 px-2.5 text-[11px]"
            : "h-7 min-w-[3.25rem] px-2 text-[11px]"
        )}
      >
        <span aria-hidden="true">{LABEL[lang]}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 12 12"
          className={clsx(
            "h-2.5 w-2.5 fill-none stroke-current transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        >
          <path d="m2.5 4.25 3.5 3.5 3.5-3.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <div
          id={menuId}
          role="menu"
          aria-label={MENU_LABEL[lang]}
          className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-navy/10 bg-white/95 p-1.5 text-navy shadow-[0_16px_45px_rgba(15,34,68,0.22)] backdrop-blur-xl"
        >
          {LANGS.map((option) => {
            const selected = option === lang;

            return (
              <button
                key={option}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                onClick={() => selectLanguage(option)}
                className={clsx(
                  "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition duration-150 active:scale-[0.98]",
                  selected
                    ? "bg-orange/10 text-orange"
                    : "text-navy/70 hover:bg-navy/[0.06] hover:text-navy"
                )}
              >
                <span className="text-sm font-semibold">{FULL_LABEL[option]}</span>
                <span
                  aria-hidden="true"
                  className={clsx(
                    "flex h-6 min-w-7 items-center justify-center rounded-full px-1.5 text-[10px] font-bold",
                    selected ? "bg-orange text-white" : "bg-navy/[0.06] text-navy/50"
                  )}
                >
                  {LABEL[option]}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
