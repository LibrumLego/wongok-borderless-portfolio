"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  HomeIcon,
  MapIcon,
  RouteIcon,
  SparkleIcon,
  StampIcon,
} from "@/components/icons";
import { useT } from "@/lib/i18n/useT";

function NavItem({
  href,
  label,
  Icon,
  active,
}: {
  href: string;
  label: string;
  Icon: (p: { className?: string; filled?: boolean }) => React.ReactNode;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "bottom-nav-item flex w-14 flex-col items-center gap-0.5 py-1 transition duration-150 active:scale-90",
        active ? "is-active text-orange" : "text-white/45"
      )}
    >
      <Icon className="h-6 w-6" filled={active} />
      <span className={clsx("text-[10px]", active && "font-semibold")}>
        {label}
      </span>
    </Link>
  );
}

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useT();

  const LEFT_ITEMS = [
    { href: "/", label: t.nav.home, Icon: HomeIcon },
    { href: "/map", label: t.nav.mapShort, Icon: MapIcon },
  ] as const;

  const RIGHT_ITEMS = [
    { href: "/course", label: t.nav.courseShort, Icon: RouteIcon },
    { href: "/stamp", label: t.nav.stampShort, Icon: StampIcon },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 mx-auto max-w-md px-2 pb-2">
      <div className="bottom-nav-shell relative px-4 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2">
        <div className="flex items-center justify-between">
          {LEFT_ITEMS.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              active={pathname === item.href}
            />
          ))}

          {/* 중앙 AI 가이드 버튼 */}
          {/* 원과 라벨이 하나의 탭 영역이므로 눌림 효과도 링크에 준다 */}
          <Link
            href="/guide"
            aria-label={t.nav.guide}
            className="relative -mt-8 flex flex-col items-center transition-transform duration-150 active:scale-90"
          >
            <span
              className={clsx(
                "bottom-nav-ai flex h-14 w-14 items-center justify-center rounded-full shadow-lg shadow-orange/30 transition-colors",
                pathname === "/guide"
                  ? "bg-navy text-gold"
                  : "bg-orange text-white"
              )}
            >
              <SparkleIcon className="h-7 w-7" />
            </span>
            <span
              className={clsx(
                "mt-0.5 text-[10px]",
                pathname === "/guide"
                  ? "font-semibold text-orange"
                  : "text-white/45"
              )}
            >
              {t.nav.guide}
            </span>
          </Link>

          {RIGHT_ITEMS.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              active={pathname === item.href}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}
