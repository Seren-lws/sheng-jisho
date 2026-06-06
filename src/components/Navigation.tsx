"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Search, BookOpen, GraduationCap } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "查词", icon: Search },
  { href: "/vocabulary", label: "生词本", icon: BookOpen },
  { href: "/review", label: "复习", icon: GraduationCap },
] as const;

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#F5F5F4] border-t border-stone-200 z-50">
      <div className="max-w-lg mx-auto flex">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center py-3 text-xs transition-colors ${
                active
                  ? "text-slate-800 font-medium"
                  : "text-stone-400 hover:text-stone-500"
              }`}
            >
              <Icon
                size={20}
                strokeWidth={active ? 2 : 1.5}
                className={active ? "text-slate-700" : ""}
              />
              <span className="mt-1">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
