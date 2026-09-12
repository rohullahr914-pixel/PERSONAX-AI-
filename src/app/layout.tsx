import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { MobileNav } from "@/components/mobile-nav";
import { AuthActions } from "@/components/auth-actions";
import "./globals.css";

const navItems = [
  { label: "Discover", href: "/discover" },
  { label: "Multi-Persona", href: "/chat/multi" },
  { label: "Create Persona", href: "/create-persona" },
  { label: "About", href: "/about" },
];

export const metadata: Metadata = {
  metadataBase: new URL("https://personax-ai.example"),
  title: {
    default: "PersonaX AI — One AI. A Thousand Minds.",
    template: "%s | PersonaX AI",
  },
  description:
    "Talk to AI personas inspired by history, science, technology, creativity and expertise. Create your own AI personas and explore a new way to interact with AI.",
  openGraph: {
    title: "PersonaX AI — One AI. A Thousand Minds.",
    description:
      "Talk to AI personas inspired by history, science, technology, creativity and expertise. Create your own AI personas and explore a new way to interact with AI.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PersonaX AI — One AI. A Thousand Minds.",
    description:
      "Talk to AI personas inspired by history, science, technology, creativity and expertise. Create your own AI personas and explore a new way to interact with AI.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-[#020817] text-white">
          <div className="mx-auto max-w-[1500px] px-4 pb-8 pt-6 sm:px-6 lg:px-8">
            <header className="relative mb-8 rounded-[30px] border border-cyan-400/20 bg-slate-950/80 px-5 py-4 shadow-[0_0_35px_rgba(34,211,238,0.08)] backdrop-blur-xl sm:px-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <Link href="/" className="flex items-center gap-4">
                  <img src="/brand/personax-logo.png" alt="PersonaX AI" className="h-12 w-12 rounded-full object-cover shadow-[0_0_24px_rgba(34,211,238,0.3)]" />
                  <div>
                    <div className="text-xl font-black tracking-[-0.08em] text-white">
                      PERSONA<span className="text-cyan-400">X</span>
                    </div>
                    <div className="text-[9px] uppercase tracking-[0.28em] text-cyan-200/70">AI</div>
                  </div>
                </Link>

                <nav className="hidden items-center gap-6 text-sm text-slate-200 md:flex">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href} className="relative py-2 transition hover:text-cyan-300">
                      {item.label}
                    </Link>
                  ))}
                </nav>

                <div className="flex items-center gap-3">
                  <MobileNav items={navItems} />
                  <AuthActions />
                </div>
              </div>
            </header>

            {children}

            <footer className="mt-10 rounded-[28px] border border-white/10 bg-slate-950/75 px-5 py-6 text-slate-300 shadow-[0_0_20px_rgba(15,23,42,0.8)] sm:px-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                  <img src="/brand/personax-logo.png" alt="PersonaX AI" className="h-11 w-11 rounded-full object-cover" />
                  <div>
                    <div className="text-lg font-black tracking-[-0.06em] text-white">PERSONA<span className="text-cyan-400">X</span></div>
                    <div className="text-[9px] uppercase tracking-[0.28em] text-slate-400">AI</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-5 text-sm">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href} className="transition hover:text-cyan-300">
                      {item.label}
                    </Link>
                  ))}
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-500/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-cyan-200">
                  <Sparkles className="h-3.5 w-3.5" />
                  One AI. A Thousand Minds.
                </div>
              </div>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}