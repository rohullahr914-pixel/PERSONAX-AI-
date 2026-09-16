"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ArrowRight, Heart } from "lucide-react";
import { BackButton } from "@/components/back-button";
import { PersonaAvatar } from "@/components/persona-avatar";
import { getCurrentUser, subscribeToAuth } from "@/lib/auth";
import { getProfilePreferencesSnapshot, saveProfilePreferences, subscribeToProfile } from "@/lib/profile";
import { personas } from "@/lib/personas";

export default function FavoritesPage() {
  const user = useSyncExternalStore(subscribeToAuth, getCurrentUser, () => null);
  const profileSnapshot = useSyncExternalStore(subscribeToProfile, getProfilePreferencesSnapshot, () => "");
  let profileStore: Record<string, { favoritePersonaSlug?: string }> = {};
  try {
    profileStore = profileSnapshot ? JSON.parse(profileSnapshot) as Record<string, { favoritePersonaSlug?: string }> : {};
  } catch {
    profileStore = {};
  }
  const favoriteSlug = user ? profileStore[user.id]?.favoritePersonaSlug ?? "" : "";

  const toggleFavorite = (slug: string) => {
    if (!user) return;
    const next = favoriteSlug === slug ? "" : slug;
    saveProfilePreferences(user.id, { favoritePersonaSlug: next || undefined });
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="rounded-[32px] border border-cyan-400/15 bg-slate-950/75 p-6 shadow-[0_0_35px_rgba(34,211,238,0.08)] backdrop-blur-xl sm:p-8">
        <div className="mb-6 flex items-center justify-between"><BackButton href="/discover" label="Back" /><span className="text-[10px] uppercase tracking-[0.2em] text-cyan-200">Your collection</span></div>
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Favorites</p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.07em] text-white">Saved minds</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">Choose one persona to feature on your profile. Your favorite is saved to this browser account.</p>

        {!user && <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-sm text-amber-100">Log in to save your favorite persona across sessions. <Link href="/login" className="font-semibold underline">Log in</Link></div>}

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{personas.slice(0, 8).map((persona) => { const active = favoriteSlug === persona.slug; return <article key={persona.id} className={`rounded-[24px] border p-5 transition ${active ? "border-cyan-400/60 bg-cyan-500/10 shadow-[0_0_25px_rgba(34,211,238,0.12)]" : "border-white/10 bg-white/3 hover:border-cyan-400/40"}`}><PersonaAvatar slug={persona.slug} name={persona.name} className="h-14 w-14 border border-cyan-300/25" /><h2 className="mt-4 text-xl font-bold tracking-[-0.05em] text-white">{persona.name}</h2><p className="mt-2 text-sm text-slate-300">{persona.profession}</p><p className="mt-3 text-xs uppercase tracking-[0.2em] text-cyan-300">{persona.category}</p><div className="mt-5 flex items-center justify-between"><button type="button" disabled={!user} onClick={() => toggleFavorite(persona.slug)} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"><Heart className={`h-3.5 w-3.5 ${active ? "fill-cyan-300 text-cyan-300" : ""}`} />{active ? "Featured" : "Feature"}</button><Link href={`/persona/${persona.slug}`} className="inline-flex items-center gap-1 text-xs text-cyan-300">Open <ArrowRight className="h-3 w-3" /></Link></div></article>; })}</div>
      </div>
    </main>
  );
}
