"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { LogOut, MoonStar } from "lucide-react";
import LetterReveal from "@/components/LetterReveal";
import { useSound } from "@/components/SoundProvider";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { Btn, Panel } from "@/components/admin/ui";
import ProfileAdmin from "@/components/admin/ProfileAdmin";
import ProjectsAdmin from "@/components/admin/ProjectsAdmin";
import StatsAdmin from "@/components/admin/StatsAdmin";
import ExperienceAdmin from "@/components/admin/ExperienceAdmin";

type Tab = "PROFILE" | "PROJECTS" | "STATS" | "BONDS";
const TABS: Tab[] = ["PROFILE", "PROJECTS", "STATS", "BONDS"];

function Gate({ children }: { children: ReactNode }) {
  return (
    <div className="admin-root flex min-h-screen flex-col items-center justify-center bg-void p-6">
      <div className="scanlines pointer-events-none fixed inset-0" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="mb-6 flex items-center justify-center gap-2 text-edge">
          <MoonStar className="h-5 w-5" />
          <LetterReveal text="ADMIN TERMINAL" className="text-sm font-black italic tracking-[0.4em]" />
        </div>
        {children}
      </motion.div>
    </div>
  );
}

function NotConfigured() {
  return (
    <Gate>
      <Panel className="space-y-4 text-sm leading-relaxed text-ink/85">
        <h2 className="text-lg font-black italic tracking-widest text-gold">
          SUPABASE NOT CONNECTED
        </h2>
        <ol className="list-inside list-decimal space-y-2 text-xs md:text-sm">
          <li>
            اعمل حساب على{" "}
            <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-cyan underline">
              supabase.com
            </a>{" "}
            واعمل New project (احفظ الـ Database password)
          </li>
          <li>
            من Project Settings → API انسخ <b>Project URL</b> و <b>anon public key</b> وحطهم في{" "}
            <code className="bg-abyss px-1 text-cyan">.env.local</code> (شوف{" "}
            <code className="bg-abyss px-1 text-cyan">SETUP.md</code>)
          </li>
          <li>
            من SQL Editor شغّل ملف <code className="bg-abyss px-1 text-cyan">supabase/schema.sql</code>
          </li>
          <li>Restart الـ dev server وارجع هنا</li>
        </ol>
      </Panel>
    </Gate>
  );
}

function LoginGate() {
  const { play } = useSound();
  const [mode, setMode] = useState<"setup" | "signin">("setup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const setupCode = process.env.NEXT_PUBLIC_ADMIN_SETUP_CODE;

  const submit = async () => {
    const sb = getSupabase();
    if (!sb) return;
    setBusy(true);
    setErr("");
    setOk("");
    try {
      if (mode === "setup") {
        if (setupCode && code.trim().toUpperCase() !== setupCode.toUpperCase()) {
          setErr("WRONG SETUP CODE");
          return;
        }
        const { data, error } = await sb.auth.signUp({ email, password });
        if (error) {
          if (/already|registered/i.test(error.message)) {
            setErr("THIS EMAIL IS ALREADY REGISTERED — SWITCH TO SIGN IN");
          } else {
            setErr(error.message.toUpperCase());
          }
          return;
        }
        if (!data.session) {
          setOk("ACCOUNT CREATED — CHECK EMAIL CONFIRMATION (DISABLE IT IN SUPABASE AUTH SETTINGS FOR EASIER LOGIN)");
          setMode("signin");
          return;
        }
        setOk("ADMIN CREATED ✓");
      } else {
        const { error } = await sb.auth.signInWithPassword({ email, password });
        if (error) {
          setErr(error.message.toUpperCase());
          return;
        }
        setOk("SIGNED IN ✓");
      }
    } finally {
      setBusy(false);
      play("confirm");
    }
  };

  return (
    <Gate>
      <Panel className="space-y-4">
        <div className="flex gap-2">
          {(["setup", "signin"] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setErr("");
                play("move");
              }}
              className={`clip-corner-sm -skew-x-12 px-4 py-2 text-[10px] font-black tracking-[0.3em] ${
                mode === m ? "bg-gradient-to-r from-p3 to-cyan text-void" : "border border-edge/40 text-dim"
              }`}
            >
              <span className="inline-block skew-x-12">
                {m === "setup" ? "FIRST-RUN SETUP" : "SIGN IN"}
              </span>
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <div>
            <p className="mb-1.5 text-[9px] font-bold tracking-[0.35em] text-edge">EMAIL</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="omarabdlhamedd7@gmail.com"
              className="w-full border border-edge/30 bg-abyss px-3 py-2 text-sm outline-none focus:border-cyan"
            />
          </div>
          <div>
            <p className="mb-1.5 text-[9px] font-bold tracking-[0.35em] text-edge">PASSWORD</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              className="w-full border border-edge/30 bg-abyss px-3 py-2 text-sm outline-none focus:border-cyan"
            />
          </div>
          {mode === "setup" && (
            <div>
              <p className="mb-1.5 text-[9px] font-bold tracking-[0.35em] text-edge">
                SETUP CODE (FROM .ENV)
              </p>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="YUKI-ARCANA-0"
                className="w-full border border-edge/30 bg-abyss px-3 py-2 text-sm outline-none focus:border-cyan"
              />
            </div>
          )}
        </div>

        {err && <p className="text-[10px] font-bold tracking-[0.2em] text-alert">{err}</p>}
        {ok && <p className="text-[10px] font-bold tracking-[0.2em] text-cyan">{ok}</p>}

        <Btn onClick={submit} disabled={busy}>
          {busy ? "WORKING..." : mode === "setup" ? "CREATE ADMIN" : "SIGN IN"}
        </Btn>

        <p className="text-[9px] leading-relaxed tracking-[0.15em] text-dim">
          TIP: IN SUPABASE → AUTHENTICATION → PROVIDERS → EMAIL, TURN OFF &quot;CONFIRM EMAIL&quot;
          FOR A SMOOTHER FIRST LOGIN.
        </p>
      </Panel>
    </Gate>
  );
}

export default function AdminPage() {
  const { play } = useSound();
  const [session, setSession] = useState<object | null | undefined>(undefined);
  const [tab, setTab] = useState<Tab>("PROJECTS");
  const configured = isSupabaseConfigured();

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;
    sb.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!configured) return <NotConfigured />;
  if (session === undefined) {
    return (
      <Gate>
        <p className="text-center text-[11px] tracking-[0.4em] text-dim">CONNECTING...</p>
      </Gate>
    );
  }
  if (!session) return <LoginGate />;

  return (
    <div className="admin-root min-h-screen bg-void">
      <div className="scanlines pointer-events-none fixed inset-0" />
      <header className="sticky top-0 z-10 border-b border-edge/20 bg-abyss/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2 text-edge">
            <MoonStar className="h-4 w-4" />
            <span className="text-xs font-black italic tracking-[0.35em]">YUKI · ADMIN</span>
          </div>
          <button
            onClick={async () => {
              const sb = getSupabase();
              if (sb) await sb.auth.signOut();
              play("back");
            }}
            className="flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] text-dim hover:text-alert"
          >
            <LogOut className="h-3.5 w-3.5" /> SIGN OUT
          </button>
        </div>
        <div className="mx-auto flex max-w-5xl gap-2 px-4 pb-3">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                play("move");
              }}
              className={`clip-corner-sm -skew-x-12 px-4 py-1.5 text-[10px] font-black tracking-[0.3em] ${
                tab === t
                  ? "bg-gradient-to-r from-p3 to-cyan text-void"
                  : "border border-edge/30 text-dim hover:text-cyan"
              }`}
            >
              <span className="inline-block skew-x-12">{t}</span>
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <motion.div key={tab} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {tab === "PROFILE" && <ProfileAdmin />}
          {tab === "PROJECTS" && <ProjectsAdmin />}
          {tab === "STATS" && <StatsAdmin />}
          {tab === "BONDS" && <ExperienceAdmin />}
        </motion.div>
        <p className="mt-8 text-center text-[9px] tracking-[0.3em] text-dim/60">
          EDITS GO LIVE ON THE SITE AUTOMATICALLY — NO REDEPLOY NEEDED
        </p>
      </main>
    </div>
  );
}
