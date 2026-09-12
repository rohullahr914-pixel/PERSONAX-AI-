import Link from "next/link";
import { ArrowRight, BrainCircuit, BriefcaseBusiness, Compass, Globe, MessagesSquare, Rocket, Search, Sparkles, Users } from "lucide-react";
import { featureCards, personaHighlights } from "@/lib/site-data";
import { personas } from "@/lib/personas";
import { PersonaAvatar } from "@/components/persona-avatar";

const topPersonas = personas.slice(0, 6);

export default function Home() {
  return (
    <main className="min-h-screen bg-[#020818] text-white">
      <div className="mx-auto max-w-[1500px] px-4 pb-16 pt-2 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[36px] border border-cyan-400/20 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.22),transparent_20%),radial-gradient(circle_at_70%_30%,rgba(168,85,247,0.2),transparent_28%),linear-gradient(180deg,#020817_0%,#020b1d_100%)] px-5 pb-10 pt-10 sm:px-8 lg:px-12 lg:pt-14">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
          <div className="grid items-center gap-10 lg:grid-cols-[1.02fr_1.2fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.28em] text-cyan-200">
                <Sparkles className="h-3.5 w-3.5" />
                One AI. A Thousand Minds.
              </div>

              <h1 className="max-w-xl text-5xl font-black leading-[0.9] tracking-[-0.08em] text-white sm:text-6xl lg:text-[7rem]">
                Talk to History.<br />
                Learn from Experts.<br />
                Build Your Future.
              </h1>

              <p className="mt-6 max-w-xl text-lg text-slate-300">
                PersonaX AI is an advanced AI persona platform where you can chat with historical figures, experts, creators, mentors, and your own custom personas.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/discover" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(34,211,238,0.4)] transition hover:brightness-110">
                  Explore Personas <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/create-persona" className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-white/3 px-6 py-3 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300/80 hover:bg-cyan-500/5">
                  Create Your Persona
                </Link>
              </div>
            </div>

            <div className="relative flex min-h-[430px] items-center justify-center">
              <img src="/brand/personax-hero.png" alt="PersonaX AI: one AI, a thousand minds" className="absolute inset-0 h-full w-full object-contain opacity-35 mix-blend-screen" />
              <div className="absolute left-1/2 top-1/2 h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/30 bg-cyan-500/5 blur-2xl" />
              <div className="relative z-10 grid w-full max-w-[720px] gap-4 sm:grid-cols-3">
                {topPersonas.map((persona, index) => (
                  <div
                    key={persona.id}
                    className={`group relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/70 p-4 shadow-[0_0_30px_rgba(59,130,246,0.14)] transition hover:-translate-y-1 hover:border-cyan-400/40 ${index === 0 ? "sm:translate-y-10" : index === 1 ? "sm:translate-y-4" : index === 2 ? "sm:translate-y-10" : ""}`}
                  >
                    <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-cyan-300/80">
                      <span>{persona.category}</span>
                      <span>{persona.era}</span>
                    </div>
                    <PersonaAvatar slug={persona.slug} name={persona.name} className="mb-3 h-20 w-20 border border-cyan-300/30 shadow-[0_0_30px_rgba(34,211,238,0.25)]" />
                    <h3 className="text-xl font-bold tracking-[-0.05em] text-white">{persona.name}</h3>
                    <p className="mt-2 text-sm text-slate-300">{persona.profession}</p>
                    <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-slate-400">
                      <span>{persona.expertise[0]}</span>
                      <Link href={`/persona/${persona.slug}`} className="text-cyan-300">
                        Open →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featureCards.map((card, index) => (
            <div key={card.title} className="rounded-[24px] border border-white/10 bg-slate-900/50 p-5 transition hover:border-cyan-400/40 hover:bg-slate-900/80">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 text-cyan-300">
                {index === 0 && <BrainCircuit className="h-5 w-5" />}
                {index === 1 && <MessagesSquare className="h-5 w-5" />}
                {index === 2 && <Compass className="h-5 w-5" />}
                {index === 3 && <Search className="h-5 w-5" />}
                {index === 4 && <Users className="h-5 w-5" />}
                {index === 5 && <Sparkles className="h-5 w-5" />}
                {index === 6 && <Rocket className="h-5 w-5" />}
                {index === 7 && <Globe className="h-5 w-5" />}
              </div>
              <h3 className="text-2xl font-bold tracking-[-0.05em] text-white">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{card.description}</p>
            </div>
          ))}
        </section>

        <section className="relative mt-16 overflow-hidden rounded-[32px] border border-cyan-400/20 bg-[radial-gradient(circle_at_85%_20%,rgba(34,211,238,0.16),transparent_26%),linear-gradient(135deg,rgba(8,21,43,0.98),rgba(18,15,46,0.96))] p-6 sm:p-8">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border border-cyan-400/20 bg-cyan-400/5 blur-2xl" />
          <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-500/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-cyan-200"><Users className="h-3.5 w-3.5" /> Perspective Studio</div>
              <h2 className="mt-4 max-w-2xl text-3xl font-black tracking-[-0.06em] text-white sm:text-4xl">One question. Several ways to see it.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Bring scientists, artists, builders, and philosophers into one live discussion. Select the minds, set the question, and compare their reasoning in one stream.</p>
            </div>
            <Link href="/chat/multi" className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(34,211,238,0.3)] transition hover:brightness-110">Open Multi-Persona <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </section>

        <section className="mt-20 rounded-[32px] border border-cyan-400/20 bg-slate-950/50 p-5 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Featured personas</p>
              <h2 className="mt-2 text-4xl font-black tracking-[-0.07em] text-white">Choose a mind.</h2>
            </div>
            <Link href="/discover" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-cyan-200">
              Browse all personas <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {personas.slice(0, 9).map((persona) => (
              <div key={persona.id} className="rounded-[26px] border border-white/10 bg-white/3 p-5 transition hover:border-cyan-400/40 hover:bg-slate-900/75">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <PersonaAvatar slug={persona.slug} name={persona.name} className="h-12 w-12 border border-cyan-300/20" />
                    <div>
                      <h3 className="text-xl font-bold tracking-[-0.05em] text-white">{persona.name}</h3>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{persona.profession}</p>
                    </div>
                  </div>
                  <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-cyan-200">
                    {persona.category}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-300">{persona.shortDescription}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {persona.expertise.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-full border border-white/10 bg-slate-800/70 px-2.5 py-1 text-[11px] text-slate-300">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-xs text-slate-400">{persona.disclaimer}</span>
                  <Link href={`/persona/${persona.slug}`} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white">
                    Chat <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[30px] border border-white/10 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-violet-500/10 p-7">
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Built for the future</p>
            <h3 className="mt-3 text-4xl font-black tracking-[-0.07em] text-white">A platform for specialized minds.</h3>
            <p className="mt-4 max-w-lg text-slate-300">
              PersonaX AI combines structured persona data, prompt engineering, secure server-side AI routing, and memory-aware conversations so every interaction feels like a real expert is present.
            </p>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-slate-950/70 p-7">
            <div className="flex items-center justify-between">
              <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Popular domains</p>
              <BriefcaseBusiness className="h-5 w-5 text-cyan-300" />
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {personaHighlights.map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/3 px-3 py-2 text-sm text-slate-200">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
