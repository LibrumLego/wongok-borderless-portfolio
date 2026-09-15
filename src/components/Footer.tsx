"use client";

import Link from "next/link";
import { SparkleIcon } from "@/components/icons";
import { DISTRICTS } from "@/lib/constants";
import { useT } from "@/lib/i18n/useT";
import { localizeDistrictName } from "@/lib/i18n/places";

const POLICY_LINKS = [
  { href: "/privacy", label: "개인정보 처리 안내" },
  { href: "/terms", label: "서비스 이용약관" },
];

export default function Footer() {
  const { t, lang } = useT();

  const MENU = [
    { href: "/map", label: t.nav.map },
    { href: "/guide", label: t.nav.guide },
    { href: "/course", label: t.nav.course },
    { href: "/stamp", label: t.nav.stamp },
  ];

  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto flex max-w-md items-center justify-center gap-4 px-4 pb-24 pt-5 text-[11px] text-white/55 md:hidden">
        {POLICY_LINKS.map((item) => (
          <Link key={item.href} href={item.href} className="underline-offset-4 hover:underline">
            {item.label}
          </Link>
        ))}
      </div>

      <div className="mx-auto hidden max-w-6xl grid-cols-[1.5fr_1fr_1fr] gap-10 px-8 py-14 md:grid">
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange">
              <SparkleIcon className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold tracking-tight">
              원곡 보더리스
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/45">
            {t.footer.tagline}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-[0.15em] text-gold">
            {t.footer.exploreLabel}
          </p>
          <ul className="mt-4 flex flex-col gap-2.5">
            {MENU.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-white/55 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-[0.15em] text-gold">
            {t.footer.districtLabel}
          </p>
          <ul className="mt-4 flex flex-col gap-2.5">
            {DISTRICTS.map((d) => (
              <li key={d.code}>
                <Link
                  href={`/map?district=${d.code}`}
                  className="text-sm text-white/55 transition-colors hover:text-white"
                >
                  {localizeDistrictName(d.code, lang)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto hidden max-w-6xl items-center justify-between gap-6 px-8 py-5 text-xs text-white/35 md:flex">
          <p>{t.footer.bottomLeft}</p>
          <div className="flex items-center gap-4">
            {POLICY_LINKS.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-white/70">
                {item.label}
              </Link>
            ))}
            <p>{t.footer.bottomRight}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
