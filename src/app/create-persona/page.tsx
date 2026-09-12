"use client";

import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { BackButton } from "@/components/back-button";
import { saveCustomPersona } from "@/lib/custom-personas";

const initialForm = { name: "", profession: "", description: "", personality: "", expertise: "" };

export default function CreatePersonaPage() {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");

  const updateField = (field: keyof typeof initialForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setMessage("");
  };

  const publishPersona = () => {
    if (!form.name.trim() || !form.profession.trim() || !form.description.trim()) {
      setMessage("Add a name, profession, and description before publishing.");
      return;
    }

    saveCustomPersona({ id: crypto.randomUUID(), ...form, createdAt: new Date().toISOString() });
    setMessage("Persona saved to your browser workspace.");
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="rounded-[32px] border border-cyan-400/15 bg-slate-950/75 p-6 shadow-[0_0_35px_rgba(34,211,238,0.08)] backdrop-blur-xl sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <BackButton href="/discover" label="Back" />
          <div className="rounded-full border border-cyan-400/25 bg-cyan-500/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-cyan-200">
            Persona Builder
          </div>
        </div>

        <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Persona Builder</p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.07em] text-white">Create your own digital mind.</h1>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            {(["name", "profession", "expertise", "personality"] as const).map((field) => <div key={field} className="rounded-2xl border border-white/10 bg-white/4 p-3 shadow-[0_0_12px_rgba(15,23,42,0.5)]"><label htmlFor={`persona-${field}`} className="text-xs uppercase tracking-[0.22em] text-slate-400">{field}</label><input id={`persona-${field}`} value={form[field]} onChange={(event) => updateField(field, event.target.value)} className="mt-2 w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none" placeholder={`Your persona's ${field}`} /></div>)}
            <div className="rounded-2xl border border-white/10 bg-white/4 p-3 shadow-[0_0_12px_rgba(15,23,42,0.5)]"><label htmlFor="persona-description" className="text-xs uppercase tracking-[0.22em] text-slate-400">Description</label><textarea id="persona-description" value={form.description} onChange={(event) => updateField("description", event.target.value)} className="mt-2 min-h-28 w-full resize-y bg-transparent text-sm leading-6 text-white placeholder:text-slate-500 focus:outline-none" placeholder="What makes this mind useful?" /></div>
          </div>

          <div className="rounded-[26px] border border-cyan-400/20 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.12),_transparent_30%),rgba(12,18,32,0.9)] p-5 shadow-[0_0_24px_rgba(15,23,42,0.8)]">
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Live preview</p>
            <div className="mt-6 rounded-[22px] border border-white/10 bg-slate-900/80 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/30 to-violet-500/30 text-sm font-bold text-white">AI</div>
                <div>
                    <h2 className="text-xl font-bold tracking-[-0.05em]">{form.name || "New Persona"}</h2>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Custom Mind</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-300">{form.description || "A custom persona builder for thoughtful, role-specific interaction, grounded in user-defined identity and style."}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-cyan-200">{form.profession && <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-2.5 py-1">{form.profession}</span>}{form.expertise && <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">{form.expertise}</span>}</div>
            </div>

            <button type="button" onClick={publishPersona} className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(34,211,238,0.28)]">
              <Sparkles className="h-4 w-4" /> Publish Persona
            </button>
            {message && <p className="mt-3 inline-flex items-center gap-2 text-sm text-cyan-200"><Check className="h-4 w-4" />{message}</p>}
          </div>
        </div>
      </div>
    </main>
  );
}
