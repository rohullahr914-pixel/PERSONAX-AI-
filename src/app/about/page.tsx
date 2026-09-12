import { BackButton } from "@/components/back-button";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="rounded-[32px] border border-cyan-400/15 bg-slate-950/75 p-6 shadow-[0_0_35px_rgba(34,211,238,0.08)] backdrop-blur-xl sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <BackButton href="/" label="Back" />
          <div className="rounded-full border border-cyan-400/25 bg-cyan-500/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-cyan-200">
            About
          </div>
        </div>

        <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">About PersonaX AI</p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.08em] text-white">One AI. A Thousand Minds.</h1>

        <div className="mt-8 space-y-6 text-lg leading-8 text-slate-300">
          <p>
            PersonaX AI is a text-first AI persona platform where users can select specialized minds, ask focused questions, and explore conversations with simulated experts, historical figures, creators, philosophers, and custom personas.
          </p>
          <p>
            The vision is simple: instead of one generic assistant, users can meet many distinct modes of reasoning, expertise, and personality. It is not a voice product; it is a premium AI conversation system centered on choice, identity, and context.
          </p>
          <p>
            The engine combines platform context, persona context, user context, memory, and prompt design to produce a richer and more intentional experience. Every conversation is framed as an AI simulation grounded in public information and designed to clarify rather than pretend.
          </p>
        </div>

        <div className="mt-10 rounded-[26px] border border-cyan-400/20 bg-cyan-500/5 p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Founder</p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.06em]">Rohullah Rezai</h2>
          <p className="mt-2 text-lg text-slate-200">Founder & CEO of PersonaX AI</p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-300">
            {['AI Engineering', 'AI Agents', 'AI Automation', 'Software Engineering', 'AI-powered products'].map((item) => (
              <span key={item} className="rounded-full border border-white/10 bg-white/3 px-3 py-1.5">{item}</span>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
