"use client";

import { Check, Send, Sparkles, Users, Zap } from "lucide-react";
import { useMemo, useState, useSyncExternalStore } from "react";
import { getFeaturedPersonas } from "@/lib/personas";
import { PersonaAvatar } from "@/components/persona-avatar";
import { BackButton } from "@/components/back-button";
import { getCurrentUser, subscribeToAuth } from "@/lib/auth";
import { getProfilePreferences } from "@/lib/profile";

type MultiMessage = {
  id: string;
  speaker: string;
  content: string;
  tone: "assistant" | "user";
  personaSlug?: string;
};

const sessionPersonaSet = ["albert-einstein", "leonardo-da-vinci", "steve-jobs"];
const discussionModes = ["Debate", "Brainstorm", "Mentor"] as const;

function splitPersonaResponses(content: string, participants: Array<{ name: string; slug: string }>) {
  const markers = participants.map((persona) => `[PERSONA: ${persona.name}]`);
  const responses = participants.flatMap((persona, index) => {
    const marker = markers[index];
    const start = content.indexOf(marker);
    if (start < 0) return [];
    const bodyStart = start + marker.length;
    const nextStarts = markers.slice(index + 1).map((nextMarker) => content.indexOf(nextMarker, bodyStart)).filter((position) => position >= 0);
    const end = nextStarts.length ? Math.min(...nextStarts) : content.length;
    const body = content.slice(bodyStart, end).trim();
    return body ? [{ id: crypto.randomUUID(), speaker: persona.name, content: body, tone: "assistant" as const, personaSlug: persona.slug }] : [];
  });

  return responses.length ? responses : [{ id: crypto.randomUUID(), speaker: "Discussion", content: content.trim(), tone: "assistant" as const }];
}

export default function MultiPersonaChatPage() {
  const allPersonas = getFeaturedPersonas();
  const initial = useMemo(
    () => allPersonas.filter((persona) => sessionPersonaSet.includes(persona.slug)).slice(0, 3),
    [allPersonas],
  );

  const [selected, setSelected] = useState(initial);
  const [input, setInput] = useState("How should we combine scientific imagination with product design?");
    const [mode, setMode] = useState<(typeof discussionModes)[number]>("Debate");
  const [messages, setMessages] = useState<MultiMessage[]>([
    {
      id: "intro-a",
      speaker: "Albert Einstein",
      content: "The question is not only what we build, but what problem deserves our attention most.",
      tone: "assistant",
      personaSlug: "albert-einstein",
    },
    {
      id: "intro-b",
      speaker: "Leonardo da Vinci",
      content: "Observation, curiosity, and craft are the bridge between imagination and invention.",
      tone: "assistant",
      personaSlug: "leonardo-da-vinci",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const user = useSyncExternalStore(subscribeToAuth, getCurrentUser, () => null);
  const userAvatar = user ? getProfilePreferences(user.id).avatarDataUrl ?? null : null;

  const togglePersona = (persona: (typeof initial)[number]) => {
    setSelected((current) => {
      const exists = current.some((item) => item.id === persona.id);
      if (exists) {
        if (current.length === 1) return current;
        return current.filter((item) => item.id !== persona.id);
      }

      return [...current, persona];
    });
  };

  const handleSubmit = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading || selected.length === 0) return;

    const userMessage: MultiMessage = {
      id: crypto.randomUUID(),
      speaker: "You",
      content: trimmed,
      tone: "user",
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat/multi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: trimmed,
          mode,
          participants: selected.map((persona) => ({
            name: persona.name,
            role: persona.profession,
            expertise: persona.expertise,
            style: persona.speakingStyle,
          })),
          conversationGoal: "Explore the topic from several expert angles while preserving distinct voices.",
          message: trimmed,
          history: messages.slice(-8).map((message) => ({
            role: message.tone === "user" ? "user" : "assistant",
            content: `${message.speaker}: ${message.content}`,
          })),
        }),
      });

      const data = (await response.json()) as { ok?: boolean; content?: string; error?: string };

      if (!response.ok || !data.ok || typeof data.content !== "string" || !data.content.trim()) {
        throw new Error(data.error ?? "The multi-persona conversation could not generate a result.");
      }

      const assistantContent = data.content.trim();

      setMessages((current) => [...current, ...splitPersonaResponses(assistantContent, selected)]);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to generate the discussion.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="rounded-[32px] border border-cyan-400/15 bg-slate-950/75 p-6 shadow-[0_0_35px_rgba(34,211,238,0.09)] backdrop-blur-xl sm:p-8">
        <div className="mb-5 flex items-center justify-between">
          <BackButton href="/discover" label="Back" />
            <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-cyan-200"><Zap className="h-3.5 w-3.5" /> Perspective studio</span>
        </div>
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/3 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-cyan-300/30 bg-cyan-500/10 text-sm font-bold text-cyan-100">{userAvatar ? <img src={userAvatar} alt={user?.name ?? "User"} className="h-full w-full object-cover" /> : user?.name?.slice(0, 2).toUpperCase() ?? "GU"}</div>
            <div><p className="text-[10px] uppercase tracking-[0.2em] text-cyan-300">Speaking as</p><p className="text-sm font-semibold text-white">{user?.name ?? "Guest"}</p></div>
          </div>
          {!user && <a href="/login" className="text-xs font-medium text-cyan-300">Log in to personalize</a>}
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Multi-persona discussion</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-[-0.07em] text-white">
              {selected.map((p) => p.name).join(" + ") || "Choose a mind"}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Ask one question and get distinct answers from every selected perspective. Each voice stays separate in the thread.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-cyan-200">
            <Users className="h-4 w-4" /> {selected.length} active
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-300">Choose the shape of the discussion.</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Discussion mode">
            {discussionModes.map((option) => <button key={option} type="button" onClick={() => setMode(option)} className={`rounded-full border px-3 py-1.5 text-xs transition ${mode === option ? "border-cyan-400/60 bg-cyan-500/15 text-cyan-100" : "border-white/10 bg-slate-900/70 text-slate-400 hover:border-cyan-400/40"}`}>{option}</button>)}
          </div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {allPersonas.slice(0, 6).map((persona) => {
            const active = selected.some((item) => item.id === persona.id);

            return (
              <button
                key={persona.id}
                type="button"
                onClick={() => togglePersona(persona)}
                aria-pressed={active}
                className={`rounded-[24px] border p-4 text-left transition ${
                  active
                    ? "border-cyan-400/60 bg-cyan-500/10 shadow-[0_0_25px_rgba(34,211,238,0.12)]"
                    : "border-white/10 bg-white/3 hover:border-cyan-400/40 hover:bg-slate-900/70"
                }`}
              >
                <div className="flex items-center gap-3">
                  <PersonaAvatar slug={persona.slug} name={persona.name} className="h-12 w-12 border border-cyan-300/25 shadow-[0_0_18px_rgba(34,211,238,0.15)]" />
                  <div>
                    <div className="font-bold text-white">{persona.name}</div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">{persona.category}</div>
                  </div>
                  <span className={`ml-auto flex h-6 w-6 items-center justify-center rounded-full border ${active ? "border-cyan-300 bg-cyan-300 text-slate-950" : "border-white/10 text-transparent"}`}><Check className="h-3.5 w-3.5" /></span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">{persona.shortDescription}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-8 rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.08),_transparent_30%),rgba(15,23,42,0.9)] p-5 shadow-[0_0_24px_rgba(15,23,42,0.8)]">
          <div className="mb-4 flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-cyan-300">
            <Sparkles className="h-4 w-4" /> Current discussion
          </div>

          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[90%] rounded-2xl border p-4 leading-7 ${
                  message.tone === "user"
                    ? "ml-auto rounded-br-md border-violet-400/20 bg-violet-500/15 text-slate-100"
                    : "rounded-bl-md border-cyan-400/20 bg-slate-900/80 text-slate-200 shadow-[0_0_18px_rgba(34,211,238,0.06)]"
                }`}
              >
                <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-slate-400">
                  {message.personaSlug && <PersonaAvatar slug={message.personaSlug} name={message.speaker} className="h-6 w-6 border border-cyan-300/20" />}
                  <span className="font-semibold text-cyan-200">{message.speaker}</span>
                </div>
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            ))}

            {isLoading && (
              <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-cyan-400/20 bg-cyan-500/8 p-4 text-slate-200">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />
                  Thinking across multiple perspectives...
                </span>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </div>
          )}

          <div className="mt-5 flex flex-col gap-2 rounded-[22px] border border-white/10 bg-slate-900/75 p-2 sm:flex-row">
            <input
              aria-label="Multi persona prompt"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSubmit();
                }
              }}
              placeholder="Ask the group a question..."
              className="min-w-0 flex-1 rounded-full border border-white/5 bg-transparent px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || selected.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(34,211,238,0.28)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send className="h-4 w-4" /> Send
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
