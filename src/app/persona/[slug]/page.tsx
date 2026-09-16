import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";
import { getPersona, getPersonas, getPersonaBySlug } from "@/lib/personas";
import { BackButton } from "@/components/back-button";
import { PersonaAvatar } from "@/components/persona-avatar";
import { PersonaActions } from "@/components/persona-actions";

export function generateStaticParams() {
  return getPersona("albert-einstein") ? getPersonas().map((persona) => ({ slug: persona.slug })) : [];
}

export default function PersonaProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  return <PersonaProfileContent params={params} />;
}

async function PersonaProfileContent({ params }: { params: Promise<{ slug: string }> }) {
  const resolved = await params;
  const persona = getPersonaBySlug(resolved.slug);

  if (!persona) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/60">
        <div className="relative h-52 overflow-hidden bg-gradient-to-r from-cyan-500/20 via-violet-500/15 to-blue-500/20">
          <img src="/brand/personax-hero.png" alt="" className="h-full w-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        </div>
        <div className="p-6 sm:p-8">
          <div className="mb-6">
            <BackButton href="/discover" label="Back to discover" />
          </div>
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="flex items-center gap-4">
              <PersonaAvatar slug={persona.slug} name={persona.name} className="h-20 w-20 border-2 border-cyan-300/50 shadow-[0_0_25px_rgba(34,211,238,0.25)]" />
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">{persona.category}</p>
                <h1 className="mt-2 text-4xl font-black tracking-[-0.07em]">{persona.name}</h1>
                <p className="text-slate-300">{persona.profession}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <PersonaActions slug={persona.slug} name={persona.name} />
              <Link href={`/chat/${persona.slug}`} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white">
                Start Chat <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.7fr_1fr]">
            <div className="space-y-6">
              <section className="rounded-[24px] border border-white/10 bg-white/3 p-5">
                <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Description</p>
                <p className="mt-3 text-slate-200">{persona.description}</p>
              </section>

              <section className="rounded-[24px] border border-white/10 bg-white/3 p-5">
                <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Biography</p>
                <p className="mt-3 leading-7 text-slate-300">{persona.biography}</p>
              </section>

              <section className="rounded-[24px] border border-white/10 bg-white/3 p-5">
                <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Expertise</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {persona.expertise.map((item) => (
                    <span key={item} className="rounded-full border border-white/10 bg-slate-800/70 px-3 py-1.5 text-sm text-slate-200">
                      {item}
                    </span>
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-6">
              <div className="rounded-[24px] border border-white/10 bg-white/3 p-5">
                <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Profile</p>
                <dl className="mt-4 space-y-3 text-sm text-slate-300">
                  <div className="flex justify-between gap-4"><dt>Era</dt><dd>{persona.era}</dd></div>
                  <div className="flex justify-between gap-4"><dt>Country</dt><dd>{persona.country}</dd></div>
                  <div className="flex justify-between gap-4"><dt>Languages</dt><dd>{persona.languages.join(", ")}</dd></div>
                  <div className="flex justify-between gap-4"><dt>Visibility</dt><dd>{persona.visibility}</dd></div>
                </dl>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/3 p-5">
                <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Suggested prompts</p>
                <ul className="mt-4 space-y-3">
                  {persona.suggestedPrompts.map((prompt) => (
                    <li key={prompt} className="rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-slate-200">
                      {prompt}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[24px] border border-cyan-400/20 bg-cyan-500/5 p-5">
                <div className="flex items-center gap-2 text-cyan-300"><Sparkles className="h-4 w-4" /> AI simulation notice</div>
                <p className="mt-3 text-sm leading-6 text-slate-200">{persona.disclaimer}</p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
