"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SearchIcon } from "@/components/icons";
import { useT } from "@/lib/i18n/useT";

/**
 * 홈 히어로의 검색창.
 * 이전에는 지도로 보내는 링크를 입력창처럼 그려놔서 누르면 입력도 못 하고
 * 바로 화면이 넘어갔다. 여기서 직접 입력받아 검색어를 지도 화면으로 넘긴다.
 */
export default function HomeSearch() {
  const router = useRouter();
  const { t } = useT();
  const [query, setQuery] = useState("");

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const q = query.trim();
        router.push(q ? `/map?q=${encodeURIComponent(q)}` : "/map");
      }}
      className="mt-5 flex items-center gap-2.5 rounded-full bg-white p-1.5 pl-4 shadow-lg shadow-black/10 transition duration-200 focus-within:ring-4 focus-within:ring-orange/25 md:mt-8 md:max-w-xl"
    >
      <SearchIcon className="h-4 w-4 shrink-0 text-navy/30 md:h-5 md:w-5" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t.map.searchPlaceholder}
        aria-label={t.map.searchPlaceholder}
        maxLength={40}
        className="min-h-11 min-w-0 flex-1 bg-transparent text-sm text-navy outline-none placeholder:text-navy/35 md:text-base"
      />
      <button
        type="submit"
        aria-label={t.map.search}
        className="flex min-h-11 shrink-0 items-center rounded-full bg-orange px-4 text-xs font-semibold text-white transition duration-150 hover:bg-orange/90 active:scale-95 md:px-5 md:text-sm"
      >
        {t.map.search}
      </button>
    </form>
  );
}
