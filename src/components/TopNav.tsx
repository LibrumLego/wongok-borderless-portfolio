"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { SparkleIcon } from "@/components/icons";
import { useT } from "@/lib/i18n/useT";
import LanguageToggle from "@/components/LanguageToggle";

export default function TopNav() {
  const pathname = usePathname();
  const { t } = useT();

  const MENU = [
    { href: "/", label: t.nav.home },
    { href: "/story", label: t.nav.story },
    { href: "/map", label: t.nav.map },
    { href: "/guide", label: t.nav.guide },
    { href: "/course", label: t.nav.course },
    { href: "/stamp", label: t.nav.stamp },
  ];

  return (
    <header className="top-nav-shell sticky top-0 z-20 hidden text-white md:block">
      <div className="flex w-full items-center justify-between px-6 py-3 lg:px-8 xl:px-12 2xl:px-16">
        <Link href="/" className="group flex items-center gap-3">
          <span className="top-nav-mark">
            <SparkleIcon className="h-4 w-4" />
            <b>WB</b>
          </span>
          <span className="leading-none">
            <span className="block text-[15px] font-extrabold tracking-tight">원곡 보더리스</span>
            <span className="mt-1 block text-[9px] font-bold tracking-[0.19em] text-white/40">WONGOK · BORDERLESS</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <nav>
            <ul className="flex gap-0.5">
              {MENU.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={clsx(
                        "top-nav-link block px-3 py-2 text-sm transition duration-150 active:scale-95",
                        active
                          ? "bg-orange font-semibold text-white"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <LanguageToggle className="border-white/15 text-white" />
        </div>
      </div>
    </header>
  );
}
