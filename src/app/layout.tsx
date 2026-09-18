import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { Sparkles } from "lucide-react";
import { MobileNav } from "@/components/mobile-nav";
import { AuthActions } from "@/components/auth-actions";
import { AccountBootstrap } from "@/components/account-bootstrap";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import { InstallPrompt } from "@/components/install-prompt";
import { ServiceWorkerRegistration } from "@/components/service-worker-registration";
import "./globals.css";

const navItems = [
  { label: "Discover", href: "/discover" },
  { label: "Multi-Persona", href: "/chat/multi" },
  { label: "Create Persona", href: "/create-persona" },
  { label: "About", href: "/about" },
];

export const metadata: Metadata = {
  metadataBase: new URL("https://personax-ai.netlify.app"),
  verification: {
    google: "m072IYaONLrTLhf_hDzVPRCm_3zwQeHBLnj6l9aRWLw",
  },
  title: {
    default: "PersonaX AI — One AI. A Thousand Minds.",
    template: "%s | PersonaX AI",
  },
  description:
    "Talk to AI personas inspired by history, science, technology, creativity and expertise. Create your own AI personas and explore a new way to interact with AI.",
  manifest: "/manifest.json",
  openGraph: {
    title: "PersonaX AI — One AI. A Thousand Minds.",
    description:
      "Talk to AI personas inspired by history, science, technology, creativity and expertise. Create your own AI personas and explore a new way to interact with AI.",
    url: "https://personax-ai.netlify.app",
    siteName: "PersonaX AI",
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
        <AccountBootstrap />
        <AnalyticsTracker />
        <InstallPrompt />
        <ServiceWorkerRegistration />
        <div className="min-h-screen bg-[#020817] text-white">
          <div className="mx-auto max-w-[1500px] px-3 pb-8 pt-3 sm:px-6 sm:pt-5 lg:px-8">
            <header className="sticky top-3 z-50 mb-6 rounded-[24px] border border-cyan-300/20 bg-slate-950/88 px-3 py-3 shadow-[0_12px_45px_rgba(2,8,23,0.48)] backdrop-blur-2xl sm:top-5 sm:mb-8 sm:rounded-[28px] sm:px-5 lg:px-7">
              <div className="flex items-center justify-between gap-3">
                <Link href="/" className="flex min-w-0 items-center gap-3 rounded-2xl focus-visible:outline-offset-4 sm:gap-4">
                  <img src="/brand/personax-mark-v2.svg" alt="PersonaX AI" className="h-11 w-11 shrink-0 rounded-2xl shadow-[0_0_24px_rgba(34,211,238,0.22)] sm:h-12 sm:w-12" />
                  <div>
                    <div className="text-lg font-black tracking-[-0.07em] text-white sm:text-xl">
                      PERSONA<span className="text-cyan-400">X</span>
                    </div>
                    <div className="hidden text-[9px] uppercase tracking-[0.22em] text-cyan-200/70 min-[390px]:block">One AI · A thousand minds</div>
                  </div>
                </Link>

                <nav className="hidden items-center gap-1 rounded-full border border-white/8 bg-white/[0.025] p-1 text-sm text-slate-300 lg:flex">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href} className="rounded-full px-4 py-2.5 transition hover:bg-white/5 hover:text-white">
                      {item.label}
                    </Link>
                  ))}
                </nav>

                <div className="flex shrink-0 items-center gap-2">
                  <MobileNav items={navItems} />
                  <div className="hidden items-center gap-2 lg:flex"><AuthActions /></div>
                </div>
              </div>
            </header>

            {children}

            <footer className="mt-10 rounded-[28px] border border-white/10 bg-slate-950/75 px-5 py-6 text-slate-300 shadow-[0_0_20px_rgba(15,23,42,0.8)] sm:px-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                  <img src="/brand/personax-mark-v2.svg" alt="PersonaX AI" className="h-11 w-11 rounded-xl" />
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
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-HET04ZMJ52"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-HET04ZMJ52');
        `}
      </Script>
    </html>
  );
}
