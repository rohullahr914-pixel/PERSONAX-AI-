"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ArrowRight, Heart, LogOut, Mail, MessageSquareText, Pencil, Settings2, Sparkles, Star, Upload, Wand2 } from "lucide-react";
import { BackButton } from "@/components/back-button";
import { PersonaAvatar } from "@/components/persona-avatar";
import { RobotMotion } from "@/components/robot-motion";
import { getCurrentUser, logoutUser, subscribeToAuth } from "@/lib/auth";
import { getProfilePreferencesSnapshot, saveProfilePreferences, subscribeToProfile } from "@/lib/profile";
import { getFeaturedPersonas, personas } from "@/lib/personas";

const stats = [
  ["Conversations", "12", MessageSquareText, "text-cyan-300"],
  ["Favorites", "7", Star, "text-violet-300"],
  ["Created minds", "3", Wand2, "text-cyan-300"],
  ["Usage", "84%", Sparkles, "text-cyan-300"],
] as const;

export default function ProfilePage() {
  const featured = getFeaturedPersonas().slice(0, 3);
  const user = useSyncExternalStore(subscribeToAuth, getCurrentUser, () => null);
  const profileSnapshot = useSyncExternalStore(subscribeToProfile, getProfilePreferencesSnapshot, () => "");
  const profileStore = profileSnapshot ? JSON.parse(profileSnapshot) as Record<string, { avatarDataUrl?: string; favoritePersonaSlug?: string }> : {};
  const preferences = user ? profileStore[user.id] ?? {} : {};
  const avatarDataUrl = preferences.avatarDataUrl ?? null;
  const favoriteSlug = preferences.favoritePersonaSlug ?? "";

  if (!user) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="w-full rounded-[32px] border border-cyan-400/15 bg-slate-950/75 p-8 text-center shadow-[0_0_35px_rgba(34,211,238,0.08)] backdrop-blur-xl sm:p-10">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] border border-cyan-400/30 bg-cyan-500/10 shadow-[0_0_28px_rgba(34,211,238,0.2)]"><RobotMotion /></div>
          <p className="mt-7 text-[10px] uppercase tracking-[0.28em] text-cyan-300">Your PersonaX space</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.07em] text-white">A profile built around your thinking.</h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-slate-300">Sign in to save your favorite minds, personalize your identity, and continue conversations from one focused workspace.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/login" className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_22px_rgba(34,211,238,0.3)]">Log in</Link><Link href="/signup" className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-200">Create account</Link></div>
        </div>
      </main>
    );
  }

  const initials = user.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  const favorite = personas.find((persona) => persona.slug === favoriteSlug);
  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      saveProfilePreferences(user.id, { avatarDataUrl: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleFavorite = (slug: string) => {
    saveProfilePreferences(user.id, { favoritePersonaSlug: slug || undefined });
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[34px] border border-cyan-400/15 bg-slate-950/75 shadow-[0_0_40px_rgba(34,211,238,0.08)] backdrop-blur-xl">
        <div className="relative h-44 overflow-hidden bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.22),transparent_28%),linear-gradient(135deg,#07182f,#15102e)] sm:h-52">
          <img src="/brand/personax-hero.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-screen" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
          <div className="absolute left-5 top-5 sm:left-8"><BackButton href="/discover" label="Back" /></div>
          <div className="absolute right-5 top-5 flex gap-2 sm:right-8"><Link href="/settings" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/60 px-3 py-2 text-xs text-slate-200 backdrop-blur-md transition hover:border-cyan-400/50"><Settings2 className="h-3.5 w-3.5" /> Settings</Link><button type="button" onClick={() => logoutUser()} className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-2 text-xs text-slate-300 backdrop-blur-md transition hover:border-red-400/40 hover:text-red-200"><LogOut className="inline h-3.5 w-3.5" /> <span className="hidden sm:inline">Sign out</span></button></div>
        </div>

        <div className="relative px-5 pb-7 sm:px-8 sm:pb-9">
          <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[30px] border-4 border-slate-950 bg-gradient-to-br from-cyan-400/30 to-violet-500/30 text-2xl font-black shadow-[0_0_28px_rgba(34,211,238,0.22)] sm:h-28 sm:w-28">{avatarDataUrl ? <img src={avatarDataUrl} alt={user.name} className="h-full w-full object-cover" /> : initials}<label htmlFor="profile-avatar" className="absolute bottom-1 right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-slate-950 bg-cyan-400 text-slate-950" title="Upload profile photo"><Pencil className="h-3.5 w-3.5" /></label><input id="profile-avatar" type="file" accept="image/*" onChange={handleAvatarChange} className="sr-only" /></div>
              <div className="pb-1"><p className="text-[10px] uppercase tracking-[0.24em] text-cyan-300">Personal profile</p><h1 className="mt-1 text-3xl font-black tracking-[-0.06em] text-white sm:text-4xl">{user.name}</h1><p className="mt-1 inline-flex items-center gap-1.5 text-sm text-slate-300"><Mail className="h-3.5 w-3.5 text-cyan-300" />{user.email}</p></div>
            </div>
            <div className="flex items-center gap-3 self-start sm:self-end"><div className="flex items-center gap-2 rounded-2xl border border-cyan-400/20 bg-slate-900/80 p-2"><RobotMotion /><span className="hidden pr-2 text-[9px] uppercase tracking-[0.18em] text-cyan-200 sm:block">Online</span></div><label htmlFor="profile-avatar" className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2.5 text-sm text-cyan-100 transition hover:border-cyan-300/60"><Upload className="h-4 w-4" /> Photo</label></div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3"><div className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3"><p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Member since</p><p className="mt-1 text-sm font-semibold text-white">{memberSince}</p></div><div className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3"><p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Preferred language</p><p className="mt-1 text-sm font-semibold text-white">{user.language === "en" ? "English" : user.language}</p></div><div className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3"><p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Workspace status</p><p className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200"><span className="h-2 w-2 rounded-full bg-cyan-300" /> Active</p></div></div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(([label, value, Icon, color]) => <div key={label} className="rounded-[22px] border border-white/10 bg-slate-900/75 p-4"><div className="flex items-center justify-between"><p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{label}</p><Icon className={`h-4 w-4 ${color}`} /></div><p className="mt-3 text-3xl font-black tracking-[-0.06em] text-white">{value}</p></div>)}</div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-[26px] border border-violet-400/20 bg-violet-500/5 p-5 sm:p-6"><div className="flex items-center justify-between"><div><p className="text-[10px] uppercase tracking-[0.2em] text-violet-200">Featured interest</p><h2 className="mt-1 text-2xl font-bold tracking-[-0.05em] text-white">Your favorite mind</h2></div><Heart className="h-5 w-5 text-violet-300" /></div><select value={favoriteSlug} onChange={(event) => handleFavorite(event.target.value)} className="mt-5 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-3 text-sm text-white focus:outline-none"><option value="">Choose a persona</option>{personas.map((persona) => <option key={persona.slug} value={persona.slug}>{persona.name} · {persona.profession}</option>)}</select>{favorite ? <Link href={`/persona/${favorite.slug}`} className="mt-5 flex items-center gap-3 rounded-2xl border border-violet-300/20 bg-slate-950/45 p-3 transition hover:border-violet-300/50"><PersonaAvatar slug={favorite.slug} name={favorite.name} className="h-14 w-14 border border-violet-300/30" /><div className="min-w-0"><p className="font-bold text-white">{favorite.name}</p><p className="text-sm text-slate-300">{favorite.profession}</p><p className="mt-1 text-xs text-violet-200">Open profile <ArrowRight className="inline h-3 w-3" /></p></div></Link> : <p className="mt-5 text-sm leading-6 text-slate-300">Choose the mind you want to keep closest to your workspace.</p>}</section>
            <section className="rounded-[26px] border border-cyan-400/15 bg-cyan-500/5 p-5 sm:p-6"><p className="text-[10px] uppercase tracking-[0.2em] text-cyan-300">Quick actions</p><h2 className="mt-1 text-2xl font-bold tracking-[-0.05em] text-white">Keep moving</h2><div className="mt-5 space-y-3"><Link href="/discover" className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/55 p-3 text-sm text-slate-200 transition hover:border-cyan-400/40"><span>Discover a new mind</span><ArrowRight className="h-4 w-4 text-cyan-300" /></Link><Link href="/chat/multi" className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/55 p-3 text-sm text-slate-200 transition hover:border-cyan-400/40"><span>Start a multi-persona discussion</span><ArrowRight className="h-4 w-4 text-cyan-300" /></Link><Link href="/create-persona" className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/55 p-3 text-sm text-slate-200 transition hover:border-cyan-400/40"><span>Create your own mind</span><ArrowRight className="h-4 w-4 text-cyan-300" /></Link></div></section>
          </div>

          <section className="mt-8 rounded-[26px] border border-white/10 bg-slate-900/55 p-5 sm:p-6"><div className="flex items-center justify-between"><div><p className="text-[10px] uppercase tracking-[0.2em] text-cyan-300">Recommended for you</p><h2 className="mt-1 text-2xl font-bold tracking-[-0.05em] text-white">Continue exploring</h2></div><Link href="/discover" className="text-sm text-cyan-300">View all</Link></div><div className="mt-5 grid gap-3 md:grid-cols-3">{featured.map((persona) => <Link key={persona.id} href={`/persona/${persona.slug}`} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/55 p-3 transition hover:border-cyan-400/40"><PersonaAvatar slug={persona.slug} name={persona.name} className="h-11 w-11 border border-cyan-300/20" /><div className="min-w-0"><p className="truncate font-semibold text-white">{persona.name}</p><p className="truncate text-xs text-slate-400">{persona.profession}</p></div></Link>)}</div></section>
        </div>
      </div>
    </main>
  );
}
