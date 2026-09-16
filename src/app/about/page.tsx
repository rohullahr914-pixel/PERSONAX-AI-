import { BackButton } from "@/components/back-button";
import { ArrowUpRight, BrainCircuit, Lightbulb, Mail, MessageCircle, Network, Search, Sparkles, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-[34px] border border-cyan-400/20 bg-[radial-gradient(circle_at_80%_15%,rgba(34,211,238,0.18),transparent_28%),linear-gradient(135deg,#020817,#0b1630_55%,#16102d)] p-6 shadow-[0_0_45px_rgba(34,211,238,0.08)] sm:p-10 lg:p-14">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent" />
          <div className="relative z-10 max-w-3xl">
            <div className="mb-8 flex items-center justify-between gap-4"><BackButton href="/" label="Back" /><span className="rounded-full border border-cyan-400/25 bg-cyan-500/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-cyan-200">About & Contact</span></div>
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">The perspective platform</p>
            <h1 className="mt-4 max-w-2xl text-5xl font-black leading-[0.94] tracking-[-0.08em] text-white sm:text-7xl">Meet PersonaX AI</h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">An AI platform designed to help people think, learn, create, and make better decisions through different minds and perspectives.</p>
          </div>
          <div className="absolute -bottom-20 -right-16 h-64 w-64 rounded-full border border-cyan-300/20 bg-cyan-400/5 blur-2xl" />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[30px] border border-violet-400/20 bg-[radial-gradient(circle_at_90%_10%,rgba(168,85,247,0.15),transparent_30%),rgba(15,23,42,0.78)] p-6 sm:p-8">
            <p className="text-sm uppercase tracking-[0.25em] text-violet-200">Our vision</p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.07em] text-white sm:text-4xl">More than one voice.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-200">AI should be more than one voice. PersonaX gives you access to different perspectives, expertise, personalities, and ways of thinking.</p>
          </div>
          <div className="rounded-[30px] border border-cyan-400/15 bg-slate-950/70 p-6 sm:p-8">
            <div className="flex items-center gap-3"><Sparkles className="h-5 w-5 text-cyan-300" /><p className="text-sm uppercase tracking-[0.25em] text-cyan-300">A new kind of conversation</p></div>
            <p className="mt-5 text-base leading-7 text-slate-300">Choose the perspective that fits the moment, move between minds, and make your own thinking more deliberate.</p>
          </div>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-slate-950/65 p-6 sm:p-8">
          <div className="max-w-2xl"><p className="text-sm uppercase tracking-[0.25em] text-cyan-300">What is PersonaX?</p><h2 className="mt-3 text-3xl font-black tracking-[-0.07em] text-white sm:text-4xl">A place to explore ideas from every angle.</h2><p className="mt-4 text-slate-300">PersonaX helps you turn a single question into a richer conversation with the minds and perspectives you choose.</p></div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              [BrainCircuit, "Talk with AI personas", "Have focused conversations with distinct minds, voices, and expertise."],
              [Users, "Learn from different perspectives", "See familiar questions through new lenses and ways of reasoning."],
              [Lightbulb, "Create your own minds", "Shape custom personas for the roles, interests, and ideas that matter to you."],
              [Network, "Combine multiple personas", "Bring several perspectives together when one answer is not enough."],
              [Search, "Research and explore ideas", "Follow curiosity with thoughtful questions, context, and evidence-aware exploration."],
              [Sparkles, "Build a personalized AI experience", "Make PersonaX feel more useful to the way you learn, work, and create."],
            ].map(([Icon, title, description]) => {
              const FeatureIcon = Icon as typeof BrainCircuit;
              return <div key={title as string} className="rounded-[22px] border border-white/10 bg-white/3 p-5 transition hover:-translate-y-1 hover:border-cyan-400/40"><FeatureIcon className="h-5 w-5 text-cyan-300" /><h3 className="mt-5 text-xl font-bold tracking-[-0.04em] text-white">{title as string}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{description as string}</p></div>;
            })}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[30px] border border-cyan-400/20 bg-cyan-500/5 p-6 sm:p-8"><p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Founder</p><h2 className="mt-4 text-3xl font-black tracking-[-0.07em] text-white">Rohullah Rezai</h2><p className="mt-2 text-lg text-cyan-100">Founder & CEO</p><p className="mt-5 text-sm leading-7 text-slate-300">Building PersonaX AI to create a more human, intentional, and expansive way for people to interact with AI.</p></div>
          <div className="rounded-[30px] border border-white/10 bg-slate-950/70 p-6 sm:p-8"><p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Let&apos;s connect</p><h2 className="mt-3 text-3xl font-black tracking-[-0.07em] text-white">Have an idea, question, or opportunity?</h2><p className="mt-4 max-w-xl text-slate-300">We would love to hear from people who are curious about the future of AI and better ways to think with it.</p><div className="mt-7 flex flex-col gap-3 sm:flex-row"><a href="mailto:fsscorozal@gmail.com" className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(34,211,238,0.3)] transition hover:brightness-110"><Mail className="h-4 w-4" /> Email us <ArrowUpRight className="h-4 w-4" /></a><a href="https://wa.me/93707763729" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-emerald-100 transition hover:border-emerald-300/60"><MessageCircle className="h-4 w-4" /> WhatsApp <ArrowUpRight className="h-4 w-4" /></a></div><p className="mt-3 text-xs text-slate-500">+93 707 763 720</p></div>
        </section>

        <section className="rounded-[24px] border border-amber-400/20 bg-amber-500/5 p-5 text-sm leading-6 text-amber-100/80 sm:p-6"><p className="font-semibold text-amber-100">A note on representation</p><p className="mt-2">PersonaX AI personas are AI simulations inspired by publicly available information. They are not the actual people they represent.</p></section>
      </div>
    </main>
  );
}
