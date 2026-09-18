"use client";

import { FormEvent, useEffect, useState } from "react";
import { BarChart3, Globe2, KeyRound, Monitor, RefreshCw, ShieldCheck, Smartphone } from "lucide-react";
import { API_BASE_URL } from "@/lib/api-client";

type Item = { label: string; count: string };
type Data = { overview: { total: string; visitors: string; sessions: string }; countries: Item[]; devices: Item[]; pages: Item[]; browsers: Item[] };

function List({ items }: { items: Item[] }) {
  const max = Math.max(...items.map((item) => Number(item.count)), 1);
  return <div className="space-y-4">{items.map((item) => <div key={item.label}><div className="mb-1 flex justify-between gap-3 text-sm"><span className="truncate text-slate-200">{item.label}</span><span className="tabular-nums text-cyan-300">{item.count}</span></div><div className="h-2 overflow-hidden rounded-full bg-white/8"><div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: `${Math.max(5, Number(item.count) / max * 100)}%` }} /></div></div>)}</div>;
}

export default function AdminPage() {
  const [data, setData] = useState<Data | null>(null);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const token = window.localStorage.getItem("personax_admin_token");
    const response = await fetch(`${API_BASE_URL}/admin/analytics`, { headers: token ? { Authorization: `Bearer ${token}` } : undefined, cache: "no-store" });
    if (response.status === 401 || response.status === 403) { setNeedsLogin(true); return; }
    if (!response.ok) throw new Error("اتصال سرور Node آماده نیست. ابتدا npm run server:dev را اجرا کنید.");
    const payload = await response.json() as { data: Data };
    setData(payload.data);
  };

  useEffect(() => { void load().catch((reason: Error) => setError(reason.message)); }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const result = await response.json() as { data?: { token: string }; error?: { message?: string } };
      if (!response.ok || !result.data?.token) throw new Error(result.error?.message ?? "ورود انجام نشد.");
      window.localStorage.setItem("personax_admin_token", result.data.token);
      await load(); setPassword("");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "ورود انجام نشد."); }
    finally { setBusy(false); }
  }

  if (needsLogin && !data) return <main className="mx-auto flex min-h-[65vh] max-w-md items-center px-5 py-16"><section className="w-full rounded-3xl border border-cyan-300/20 bg-slate-950/85 p-7 shadow-[0_25px_80px_rgba(2,8,23,0.55)] sm:p-9"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10 text-cyan-300"><KeyRound className="h-6 w-6" /></div><p className="mt-6 text-center text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">Restricted area</p><h1 className="mt-3 text-center text-3xl font-black text-white">ورود مدیر</h1><p className="mt-3 text-center text-sm leading-6 text-slate-400">برای مشاهده آمار کاربران وارد حساب مدیر شوید.</p><form onSubmit={handleLogin} className="mt-7 space-y-4"><label className="block text-sm font-semibold text-slate-200">ایمیل<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-white outline-none focus:border-cyan-300/50" placeholder="admin@example.com" /></label><label className="block text-sm font-semibold text-slate-200">رمز عبور<input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-white outline-none focus:border-cyan-300/50" placeholder="••••••••" /></label>{error && <p className="rounded-xl border border-rose-300/20 bg-rose-400/10 px-3 py-2 text-sm leading-6 text-rose-200">{error}</p>}<button disabled={busy} className="flex h-12 w-full items-center justify-center rounded-xl bg-cyan-400 font-bold text-slate-950 disabled:opacity-60">{busy ? "در حال بررسی..." : "ورود به پنل"}</button></form></section></main>;

  if (error) return <main className="mx-auto max-w-4xl px-5 py-20 text-center"><ShieldCheck className="mx-auto h-12 w-12 text-rose-300" /><h1 className="mt-5 text-3xl font-black text-white">پنل در دسترس نیست</h1><p className="mt-3 text-slate-400">{error}</p></main>;
  if (!data) return <main className="mx-auto max-w-7xl px-5 py-20 text-center text-slate-400">در حال بارگذاری آمار...</main>;

  const cards = [{ label: "بازدید ۳۰ روز اخیر", value: data.overview.total, icon: BarChart3 }, { label: "بازدیدکننده یکتا", value: data.overview.visitors, icon: Globe2 }, { label: "ورودهای ثبت‌شده", value: data.overview.sessions, icon: ShieldCheck }];
  const sections = [{ title: "کشورها", icon: Globe2, items: data.countries }, { title: "بخش‌های پربازدید", icon: BarChart3, items: data.pages }, { title: "دستگاه‌ها", icon: Smartphone, items: data.devices }, { title: "مرورگرها", icon: Monitor, items: data.browsers }];
  return <main className="mx-auto max-w-7xl px-4 pb-12 pt-4 text-white sm:px-6 lg:px-8"><div className="flex flex-col justify-between gap-5 border-b border-white/10 pb-8 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">Admin intelligence</p><h1 className="mt-3 text-4xl font-black sm:text-6xl">مرکز آمار PersonaX</h1><p className="mt-3 text-slate-400">نمای زنده‌ی رفتار کاربران در ۳۰ روز گذشته</p></div><button onClick={() => void load()} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-bold"><RefreshCw className="h-4 w-4" /> تازه‌سازی</button></div><div className="mt-7 grid gap-4 md:grid-cols-3">{cards.map(({ label, value, icon: Icon }) => <div key={label} className="rounded-2xl border border-white/10 bg-slate-950/70 p-5"><Icon className="h-5 w-5 text-cyan-300" /><p className="mt-6 text-sm text-slate-400">{label}</p><p className="mt-2 text-4xl font-black tabular-nums">{value}</p></div>)}</div><div className="mt-6 grid gap-6 lg:grid-cols-2">{sections.map(({ title, icon: Icon, items }) => <section key={title} className="rounded-2xl border border-white/10 bg-slate-950/70 p-5"><div className="mb-6 flex items-center gap-3"><Icon className="h-5 w-5 text-cyan-300" /><h2 className="text-xl font-bold">{title}</h2></div><List items={items} /></section>)}</div></main>;
}
