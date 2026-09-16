"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { ArrowRight, Check, Edit3, LogOut, Plus, Quote, Settings2, ShieldCheck, Trash2 } from "lucide-react";
import { BackButton } from "@/components/back-button";
import { PersonaAvatar } from "@/components/persona-avatar";
import { getCurrentUser, logoutUser, subscribeToAuth } from "@/lib/auth";
import { getCustomPersonas } from "@/lib/custom-personas";
import { getProfilePreferencesSnapshot, saveProfilePreferences, subscribeToProfile } from "@/lib/profile";
import { personas } from "@/lib/personas";

type ProfileStore = Record<string, {
  avatarDataUrl?: string;
  favoritePersonaSlug?: string;
  displayName?: string;
  bio?: string;
  profileVisibility?: "Public" | "Private";
  quote?: string;
  quoteVisibility?: "Public" | "Private";
  pinnedConversations?: Array<{ id: string; title: string; personaName: string; preview: string; date: string }>;
}>;

function parseProfileStore(snapshot: string): ProfileStore {
  if (!snapshot) return {};
  try {
    return JSON.parse(snapshot) as ProfileStore;
  } catch {
    return {};
  }
}

const defaultPinnedConversations = [
  { id: "pinned-1", title: "The question behind the question", personaName: "Socrates", preview: "A sharper way to examine the assumptions shaping your decision.", date: "Today" },
  { id: "pinned-2", title: "Make the idea simpler", personaName: "Leonardo da Vinci", preview: "Observation turns a vague idea into something you can actually build.", date: "Yesterday" },
];

export default function ProfilePage() {
  const user = useSyncExternalStore(subscribeToAuth, getCurrentUser, () => null);
  const profileSnapshot = useSyncExternalStore(subscribeToProfile, getProfilePreferencesSnapshot, () => "");
  const profileStore = parseProfileStore(profileSnapshot);
  const preferences = user ? profileStore[user.id] ?? {} : {};
  const [isEditingIdentity, setIsEditingIdentity] = useState(false);
  const [isEditingQuote, setIsEditingQuote] = useState(false);
  const [isPublicPreview, setIsPublicPreview] = useState(false);
  const [quoteDraft, setQuoteDraft] = useState(preferences.quote ?? "");
  const [quoteVisibility, setQuoteVisibility] = useState<"Public" | "Private">(preferences.quoteVisibility ?? "Private");
  const [conversationDraft, setConversationDraft] = useState({ title: "", personaName: "", preview: "" });
  const [showConversationForm, setShowConversationForm] = useState(false);

  if (!user) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="w-full rounded-[32px] border border-cyan-400/15 bg-slate-950/75 p-8 text-center shadow-[0_0_35px_rgba(34,211,238,0.08)] backdrop-blur-xl sm:p-10">
          <p className="text-[10px] uppercase tracking-[0.28em] text-cyan-300">Your PersonaX space</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.07em] text-white">A profile built around your thinking.</h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-slate-300">Sign in to shape your AI identity, save your favorite minds, and keep your most important conversations close.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/login" className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_22px_rgba(34,211,238,0.3)]">Log in</Link><Link href="/signup" className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-200">Create account</Link></div>
        </div>
      </main>
    );
  }

  const displayName = preferences.displayName ?? user.name;
  const bio = preferences.bio ?? "Curious about ideas that make the future feel more human.";
  const visibility = preferences.profileVisibility ?? "Public";
  const quote = preferences.quote ?? "";
  const initials = displayName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  const favorite = personas.find((persona) => persona.slug === preferences.favoritePersonaSlug);
  const customPersonas = getCustomPersonas();
  const minds = [
    ...(favorite ? [favorite] : []),
    ...customPersonas.map((persona) => ({ ...persona, slug: persona.id, category: persona.expertise || persona.profession, shortDescription: persona.description, avatar: "" })),
  ].filter((persona, index, collection) => collection.findIndex((item) => item.slug === persona.slug) === index);
  const pinnedConversations = preferences.pinnedConversations ?? defaultPinnedConversations;
  const stats = [["Conversations", "12"], ["Favorite Personas", favorite ? "1" : "0"], ["Created Minds", String(customPersonas.length)]];

  const saveIdentity = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    saveProfilePreferences(user.id, {
      displayName: String(form.get("displayName") ?? "").trim() || user.name,
      bio: String(form.get("bio") ?? "").trim(),
      profileVisibility: String(form.get("visibility") ?? "Public") as "Public" | "Private",
    });
    setIsEditingIdentity(false);
  };

  const saveQuote = () => {
    saveProfilePreferences(user.id, { quote: quoteDraft.trim(), quoteVisibility });
    setIsEditingQuote(false);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") saveProfilePreferences(user.id, { avatarDataUrl: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const addConversation = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!conversationDraft.title.trim() || !conversationDraft.personaName.trim()) return;
    saveProfilePreferences(user.id, {
      pinnedConversations: [{ id: crypto.randomUUID(), ...conversationDraft, date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }) }, ...pinnedConversations],
    });
    setConversationDraft({ title: "", personaName: "", preview: "" });
    setShowConversationForm(false);
  };

  const removeConversation = (id: string) => saveProfilePreferences(user.id, { pinnedConversations: pinnedConversations.filter((conversation) => conversation.id !== id) });
  const handleFavorite = (slug: string) => saveProfilePreferences(user.id, { favoritePersonaSlug: slug || undefined });

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[34px] border border-cyan-400/15 bg-slate-950/75 shadow-[0_0_40px_rgba(34,211,238,0.08)] backdrop-blur-xl">
        <div className="relative h-44 overflow-hidden bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.22),transparent_28%),linear-gradient(135deg,#07182f,#15102e)] sm:h-52">
          <img src="/brand/personax-hero.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-screen" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
          <div className="absolute left-5 top-5 sm:left-8"><BackButton href="/discover" label="Back" /></div>
          <div className="absolute right-5 top-5 flex gap-2 sm:right-8"><Link href="/settings" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/60 px-3 py-2 text-xs text-slate-200 backdrop-blur-md transition hover:border-cyan-400/50"><Settings2 className="h-3.5 w-3.5" /> Settings</Link><button type="button" onClick={() => logoutUser()} className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-2 text-xs text-slate-300 backdrop-blur-md transition hover:border-red-400/40 hover:text-red-200"><LogOut className="inline h-3.5 w-3.5" /> <span className="hidden sm:inline">Sign out</span></button></div>
        </div>

        <div className="px-5 pb-9 sm:px-8">
          <div className="-mt-12 flex flex-col gap-6 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[30px] border-4 border-slate-950 bg-gradient-to-br from-cyan-400/30 to-violet-500/30 text-2xl font-black shadow-[0_0_28px_rgba(34,211,238,0.22)] sm:h-28 sm:w-28">{preferences.avatarDataUrl ? <img src={preferences.avatarDataUrl} alt={displayName} className="h-full w-full object-cover" /> : initials}<label htmlFor="profile-avatar" className="absolute bottom-1 right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-slate-950 bg-cyan-400 text-slate-950" title="Upload profile photo"><Edit3 className="h-3.5 w-3.5" /></label><input id="profile-avatar" type="file" accept="image/*" onChange={handleAvatarChange} className="sr-only" /></div>
              <div className="pb-1"><p className="text-[10px] uppercase tracking-[0.24em] text-cyan-300">Personal AI identity</p><h1 className="mt-1 text-3xl font-black tracking-[-0.06em] text-white sm:text-4xl">{displayName}</h1><p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">{bio}</p></div>
            </div>
            <div className="flex flex-wrap items-center gap-2 self-start sm:self-end"><span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-3 py-2 text-xs text-slate-300"><ShieldCheck className="h-3.5 w-3.5 text-cyan-300" /> {visibility} profile</span><button type="button" onClick={() => setIsEditingIdentity((current) => !current)} className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2.5 text-sm text-cyan-100 transition hover:border-cyan-300/60"><Edit3 className="h-4 w-4" /> Edit identity</button></div>
+          </div>

          {isEditingIdentity && <form onSubmit={saveIdentity} className="mt-8 grid gap-4 rounded-[26px] border border-cyan-400/20 bg-cyan-500/5 p-5 sm:grid-cols-2"><label className="text-xs uppercase tracking-[0.2em] text-slate-400">Display name<input name="displayName" defaultValue={displayName} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-cyan-400/50" /></label><label className="text-xs uppercase tracking-[0.2em] text-slate-400">Profile visibility<select name="visibility" defaultValue={visibility} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-cyan-400/50"><option>Public</option><option>Private</option></select></label><label className="text-xs uppercase tracking-[0.2em] text-slate-400 sm:col-span-2">Short bio<textarea name="bio" defaultValue={bio} maxLength={140} className="mt-2 min-h-24 w-full resize-y rounded-xl border border-white/10 bg-slate-950/70 px-3 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-cyan-400/50" /></label><div className="flex gap-3 sm:col-span-2"><button type="submit" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-semibold"><Check className="h-4 w-4" /> Save identity</button><button type="button" onClick={() => setIsPublicPreview((current) => !current)} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-sm text-slate-200">{isPublicPreview ? "Close Public Profile" : "View Public Profile"} <ArrowRight className="h-4 w-4" /></button></div></form>}

          {isPublicPreview && <section className="mt-5 rounded-[26px] border border-cyan-400/20 bg-cyan-500/5 p-6"><p className="text-[10px] uppercase tracking-[0.22em] text-cyan-300">Public profile preview</p><div className="mt-4 flex items-center gap-4"><div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-400/30 to-violet-500/30 text-xl font-black">{preferences.avatarDataUrl ? <img src={preferences.avatarDataUrl} alt={displayName} className="h-full w-full object-cover" /> : initials}</div><div><h2 className="text-2xl font-bold text-white">{displayName}</h2><p className="mt-1 text-sm text-slate-300">{bio}</p></div></div>{visibility === "Public" && quote && quoteVisibility === "Public" && <blockquote className="mt-6 border-l-2 border-violet-300/60 pl-4 text-lg italic leading-7 text-violet-100">{quote}</blockquote>}</section>}

          <div className="mt-8 grid gap-3 sm:grid-cols-3">{stats.map(([label, value]) => <div key={label} className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3"><p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">{label}</p><p className="mt-1 text-2xl font-black tracking-[-0.05em] text-white">{value}</p></div>)}</div>

          <section className="mt-8 rounded-[28px] border border-violet-400/20 bg-[radial-gradient(circle_at_85%_15%,rgba(168,85,247,0.13),transparent_30%),rgba(30,20,52,0.42)] p-6 sm:p-8"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-[10px] uppercase tracking-[0.22em] text-violet-200">A line worth keeping</p><h2 className="mt-2 text-2xl font-bold tracking-[-0.05em] text-white">My Quote</h2></div><button type="button" onClick={() => { setQuoteDraft(quote); setIsEditingQuote((current) => !current); }} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs text-slate-200 transition hover:border-violet-300/50"><Edit3 className="h-3.5 w-3.5" /> {quote ? "Edit quote" : "Add quote"}</button></div>{quote ? <div className="mt-7 flex gap-4"><Quote className="mt-1 h-7 w-7 shrink-0 text-violet-300" /><div><blockquote className="max-w-3xl text-2xl font-medium leading-9 tracking-[-0.03em] text-white sm:text-3xl">{quote}</blockquote><p className="mt-4 text-xs uppercase tracking-[0.2em] text-violet-200">{quoteVisibility} quote</p></div></div> : <p className="mt-7 text-lg italic text-slate-400">Add a sentence that sounds like you.</p>}{isEditingQuote && <div className="mt-6 space-y-3"><textarea value={quoteDraft} onChange={(event) => setQuoteDraft(event.target.value)} maxLength={240} className="min-h-28 w-full resize-y rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-base leading-7 text-white outline-none focus:border-violet-300/60" placeholder="Write a quote or message..." /><div className="flex flex-wrap items-center gap-3"><select value={quoteVisibility} onChange={(event) => setQuoteVisibility(event.target.value as "Public" | "Private")} className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-white"><option>Private</option><option>Public</option></select><button type="button" onClick={saveQuote} className="rounded-full bg-violet-500/80 px-4 py-2 text-xs font-semibold text-white">Save quote</button>{quote && <button type="button" onClick={() => { saveProfilePreferences(user.id, { quote: undefined }); setQuoteDraft(""); setIsEditingQuote(false); }} className="inline-flex items-center gap-1 rounded-full border border-red-400/20 px-4 py-2 text-xs text-red-200"><Trash2 className="h-3.5 w-3.5" /> Delete</button>}</div></div>}</section>

          <section className="mt-8"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-[10px] uppercase tracking-[0.22em] text-cyan-300">Your collection</p><h2 className="mt-2 text-3xl font-black tracking-[-0.06em] text-white">My Minds</h2><p className="mt-2 text-sm text-slate-400">The perspectives you keep close.</p></div><div className="flex flex-wrap items-center gap-3"><select aria-label="Choose favorite persona" value={preferences.favoritePersonaSlug ?? ""} onChange={(event) => handleFavorite(event.target.value)} className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-2.5 text-xs text-white"><option value="">Choose favorite</option>{personas.map((persona) => <option key={persona.slug} value={persona.slug}>{persona.name}</option>)}</select><Link href="/create-persona" className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 px-4 py-2.5 text-sm text-cyan-100 transition hover:border-cyan-300/70"><Plus className="h-4 w-4" /> Create a mind</Link></div></div><div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{minds.length ? minds.map((persona) => <Link key={persona.slug} href={persona.id.startsWith("custom-") ? "/create-persona" : `/persona/${persona.slug}`} className="group rounded-[24px] border border-white/10 bg-slate-900/65 p-4 transition hover:-translate-y-1 hover:border-cyan-400/40"><div className="flex items-center gap-3">{"avatar" in persona && persona.avatar ? <img src={persona.avatar} alt={persona.name} className="h-14 w-14 rounded-2xl object-cover" /> : <PersonaAvatar slug={persona.slug} name={persona.name} className="h-14 w-14 border border-cyan-300/25" />}<div className="min-w-0"><h3 className="truncate text-lg font-bold text-white">{persona.name}</h3><p className="truncate text-xs uppercase tracking-[0.16em] text-cyan-300">{persona.category}</p></div></div><p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-300">{persona.shortDescription}</p><span className="mt-4 inline-flex items-center gap-1 text-xs text-cyan-300">Open mind <ArrowRight className="h-3 w-3 transition group-hover:translate-x-1" /></span></Link>) : <div className="rounded-[24px] border border-dashed border-white/15 bg-white/3 p-6 text-sm text-slate-400 md:col-span-2 xl:col-span-3">Choose a favorite persona or create a custom mind to build your collection.</div>}</div></section>

          <section className="mt-10 rounded-[28px] border border-white/10 bg-slate-900/55 p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-[10px] uppercase tracking-[0.22em] text-cyan-300">Keep the important close</p><h2 className="mt-2 text-3xl font-black tracking-[-0.06em] text-white">Pinned Conversations</h2></div><button type="button" onClick={() => setShowConversationForm((current) => !current)} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-sm text-slate-200 transition hover:border-cyan-400/50"><Plus className="h-4 w-4" /> Pin conversation</button></div>{showConversationForm && <form onSubmit={addConversation} className="mt-5 grid gap-3 rounded-2xl border border-cyan-400/15 bg-cyan-500/5 p-4 md:grid-cols-3"><input value={conversationDraft.title} onChange={(event) => setConversationDraft({ ...conversationDraft, title: event.target.value })} placeholder="Conversation title" className="rounded-xl border border-white/10 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none" /><input value={conversationDraft.personaName} onChange={(event) => setConversationDraft({ ...conversationDraft, personaName: event.target.value })} placeholder="Persona name" className="rounded-xl border border-white/10 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none" /><input value={conversationDraft.preview} onChange={(event) => setConversationDraft({ ...conversationDraft, preview: event.target.value })} placeholder="Short preview" className="rounded-xl border border-white/10 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none" /><button type="submit" className="rounded-xl bg-cyan-500/80 px-4 py-3 text-sm font-semibold text-white md:col-span-3">Save pinned conversation</button></form>}<div className="mt-5 grid gap-3">{pinnedConversations.map((conversation) => <article key={conversation.id} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-950/55 p-4 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-white">{conversation.title}</h3><span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-2 py-1 text-[10px] text-cyan-200">{conversation.personaName}</span></div><p className="mt-2 text-sm leading-6 text-slate-400">{conversation.preview || "No preview added."}</p><p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-500">{conversation.date}</p></div><div className="flex shrink-0 items-center gap-3"><Link href="/discover" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs text-cyan-200 transition hover:border-cyan-400/50">Open <ArrowRight className="h-3 w-3" /></Link><button type="button" onClick={() => removeConversation(conversation.id)} aria-label={`Remove ${conversation.title}`} className="rounded-full border border-white/10 p-2 text-slate-400 transition hover:border-red-400/40 hover:text-red-200"><Trash2 className="h-4 w-4" /></button></div></article>)}</div></section>
        </div>
      </div>
    </main>
  );
}
