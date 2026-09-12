"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

type MobileNavProps = {
  items: { label: string; href: string }[];
};

export function MobileNav({ items }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  return (
    <div className="relative md:hidden">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:border-cyan-400/50 hover:text-cyan-200"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {isOpen && (
        <>
          <button type="button" aria-label="Close navigation overlay" onClick={() => setIsOpen(false)} className="fixed inset-0 z-40 h-screen w-screen cursor-default bg-slate-950/45 md:hidden" />
          <nav id="mobile-navigation" aria-label="Mobile navigation menu" className="absolute right-0 top-full z-[60] mt-3 w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-cyan-400/20 bg-slate-950/95 p-2 shadow-[0_0_30px_rgba(2,8,23,0.8)] backdrop-blur-xl">
            {items.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)} className="block rounded-xl px-4 py-3 text-sm text-slate-200 transition hover:bg-cyan-500/10 hover:text-cyan-200">
                {item.label}
              </Link>
            ))}
          </nav>
        </>
      )}
    </div>
  );
}
