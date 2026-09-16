import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Check,
  Compass,
  MessagesSquare,
  Plus,
  Sparkles,
  Users,
} from "lucide-react";
import { PersonaAvatar } from "@/components/persona-avatar";
import { personas } from "@/lib/personas";

const spotlightSlugs = [
  "albert-einstein",
  "michael-jackson",
  "cristiano-ronaldo",
  "leonardo-da-vinci",
  "fyodor-dostoevsky",
  "elon-musk",
];

const spotlightPersonas = spotlightSlugs.map((slug) => personas.find((persona) => persona.slug === slug)!);
const heroPersonas = spotlightPersonas.slice(0, 3);

const valueCards = [
  {
    icon: BrainCircuit,
    title: "Think from a sharper angle",
    description: "Challenge assumptions with a perspective shaped around a specific mind and discipline.",
  },
  {
    icon: BookOpen,
    title: "Learn through conversation",
    description: "Turn difficult ideas into a focused dialogue instead of another wall of generic information.",
  },
  {
    icon: Users,
    title: "Compare multiple minds",
    description: "Bring contrasting perspectives into one room and reach a clearer, more useful conclusion.",
  },
];

export default function Home() {
  return (
    <main>
      <section className="relative isolate overflow-hidden rounded-[28px] border border-cyan-300/15 bg-[#061022] px-5 py-8 shadow-[0_24px_80px_rgba(2,8,23,0.5)] sm:rounded-[36px] sm:px-8 sm:py-12 lg:px-12 lg:py-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_22%,rgba(34,211,238,0.12),transparent_25%),radial-gradient(circle_at_85%_75%,rgba(99,102,241,0.12),transparent_28%)]" />
        <div className="pointer-events-none absolute inset-0 bg-grid-fade opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />

        <div className="relative grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
          <div className="motion-rise">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/8 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-100 sm:text-xs">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Intelligence with perspective
            </div>

            <h1 className="max-w-3xl text-[clamp(2.9rem,8vw,6.4rem)] font-black leading-[0.92] tracking-[-0.075em] text-white">
              One question.
              <span className="mt-1 block bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">The right mind.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              Explore ideas with AI personas inspired by remarkable thinkers, creators, leaders, and performers.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/discover" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 text-sm font-bold text-white shadow-[0_12px_32px_rgba(14,165,233,0.25)] transition duration-200 hover:-translate-y-0.5 hover:brightness-110">
                Explore personas <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/chat/multi" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/5 px-6 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300/30 hover:bg-white/8">
                <MessagesSquare className="h-4 w-4 text-cyan-300" aria-hidden="true" />
                Open perspective room
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-400">
              {["20 curated personas", "8 conversation modes", "Build your own mind"].map((item) => (
                <span key={item} className="inline-flex items-center gap-2"><Check className="h-3.5 w-3.5 text-cyan-400" aria-hidden="true" />{item}</span>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[680px] motion-rise-delayed">
            <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="relative grid grid-cols-3 items-end gap-2 sm:gap-4">
              {heroPersonas.map((persona, index) => (
                <Link
                  key={persona.id}
                  href={`/persona/${persona.slug}`}
                  className={`group relative overflow-hidden rounded-[22px] border border-white/10 bg-slate-900/85 p-2.5 shadow-[0_18px_55px_rgba(2,8,23,0.45)] transition duration-300 hover:-translate-y-1.5 hover:border-cyan-300/35 sm:rounded-[30px] sm:p-4 ${index === 1 ? "mb-7 sm:mb-12" : ""}`}
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[16px] bg-slate-800 sm:rounded-[22px]">
                    <img src={persona.avatar} alt={persona.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                    <span className="absolute bottom-2 left-2 right-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-cyan-200 sm:bottom-3 sm:left-3 sm:text-[10px]">{persona.category}</span>
                  </div>
                  <div className="px-0.5 pb-1 pt-3 sm:px-1 sm:pt-4">
                    <h2 className="text-sm font-bold leading-tight tracking-[-0.03em] text-white sm:text-lg">{persona.name}</h2>
                    <p className="mt-1 hidden text-xs leading-5 text-slate-400 sm:line-clamp-2 sm:block">{persona.profession}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Start with a perspective</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-[-0.055em] text-white sm:text-5xl">Six minds. Six different ways forward.</h2>
          </div>
          <Link href="/discover" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition hover:text-cyan-100">
            View all personas <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {spotlightPersonas.map((persona) => (
            <article key={persona.id} className="group flex min-h-[230px] flex-col rounded-[26px] border border-white/8 bg-slate-950/55 p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/25 hover:bg-slate-900/75 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <PersonaAvatar slug={persona.slug} name={persona.name} className="h-16 w-16 border border-cyan-300/20 shadow-[0_10px_30px_rgba(2,8,23,0.4)]" />
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-300">{persona.category}</span>
              </div>

              <h3 className="mt-5 text-2xl font-bold tracking-[-0.045em] text-white">{persona.name}</h3>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">{persona.shortDescription}</p>

              <div className="mt-auto flex items-center justify-between border-t border-white/8 pt-5">
                <span className="text-xs text-slate-500">{persona.expertise[0]}</span>
                <Link href={`/persona/${persona.slug}`} aria-label={`Open ${persona.name}`} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-cyan-300 transition group-hover:border-cyan-300/30 group-hover:bg-cyan-400/10">
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[28px] border border-white/8 bg-slate-950/50 p-5 sm:rounded-[34px] sm:p-8 lg:p-10">
        <div className="grid gap-4 lg:grid-cols-3">
          {valueCards.map(({ icon: Icon, title, description }, index) => (
            <div key={title} className="rounded-[24px] border border-white/8 bg-white/[0.025] p-6">
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/15 bg-cyan-400/8 text-cyan-300"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                <span className="text-xs tabular-nums text-slate-600">0{index + 1}</span>
              </div>
              <h3 className="mt-8 text-xl font-bold tracking-[-0.035em] text-white">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative my-16 overflow-hidden rounded-[28px] border border-cyan-300/15 bg-gradient-to-br from-cyan-500/12 via-slate-950 to-violet-500/10 p-6 sm:my-20 sm:rounded-[34px] sm:p-10">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300"><Compass className="h-4 w-4" aria-hidden="true" />Perspective room</span>
            <h2 className="mt-4 max-w-3xl text-3xl font-black tracking-[-0.055em] text-white sm:text-5xl">Don&apos;t settle for one answer.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">Choose several personas, ask one question, and compare how different minds approach the same problem.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link href="/chat/multi" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 text-sm font-bold text-white shadow-[0_12px_30px_rgba(14,165,233,0.24)] transition duration-200 hover:-translate-y-0.5 hover:brightness-110">
              Start a discussion <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/create-persona" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-cyan-300/20 bg-slate-950/35 px-6 text-sm font-semibold text-cyan-50 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300/35 hover:bg-cyan-400/8">
              <Plus className="h-4 w-4" aria-hidden="true" />Create a persona
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
