"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { getSupabase } from "@/lib/supabase/client";
import { Area, Btn, Field, Panel, uploadMedia } from "./ui";

interface ProfileRow {
  handle: string;
  name: string;
  tagline: string;
  arcana: string;
  arcana_num: string;
  role: string;
  bio_head: string;
  bio_body: string;
  quote: string;
  email: string;
  portrait_url: string | null;
}

interface SocialRow {
  id: string;
  label: string;
  handle: string;
  url: string;
  order: number;
}

const EMPTY: ProfileRow = {
  handle: "",
  name: "",
  tagline: "",
  arcana: "THE FOOL",
  arcana_num: "0",
  role: "",
  bio_head: "",
  bio_body: "",
  quote: "",
  email: "",
  portrait_url: null,
};

export default function ProfileAdmin() {
  const [p, setP] = useState<ProfileRow>(EMPTY);
  const [socials, setSocials] = useState<SocialRow[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) return;
    const [pr, so] = await Promise.all([
      sb.from("profile").select("*").eq("id", 1).maybeSingle(),
      sb.from("socials").select("*").order("order"),
    ]);
    if (pr.data) setP(pr.data as ProfileRow);
    setSocials((so.data as SocialRow[]) ?? []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async () => {
    const sb = getSupabase();
    if (!sb) return;
    setBusy(true);
    setErr("");
    setMsg("");
    try {
      let row = { id: 1, ...p };
      if (file) {
        const url = await uploadMedia(file, "portrait");
        row = { ...row, portrait_url: url };
      }
      const { error } = await sb.from("profile").upsert(row);
      if (error) throw error;
      setMsg("PROFILE SAVED ✓");
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message.toUpperCase() : "SAVE FAILED");
    } finally {
      setBusy(false);
    }
  };

  const setS = (k: keyof ProfileRow, v: string | null) => setP({ ...p, [k]: v });

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-black italic tracking-widest text-cyan">PROFILE</h3>

      <Panel className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="HANDLE" value={p.handle} onChange={(e) => setS("handle", e.target.value)} />
          <Field label="REAL NAME" value={p.name} onChange={(e) => setS("name", e.target.value)} />
          <Field
            label="TAGLINE"
            value={p.tagline}
            onChange={(e) => setS("tagline", e.target.value)}
          />
          <Field label="ARCANA" value={p.arcana} onChange={(e) => setS("arcana", e.target.value)} />
          <Field
            label="ARCANA NUMBER"
            value={p.arcana_num}
            onChange={(e) => setS("arcana_num", e.target.value)}
          />
          <Field label="EMAIL" value={p.email} onChange={(e) => setS("email", e.target.value)} />
        </div>

        <Field label="ROLE / STUDY" value={p.role} onChange={(e) => setS("role", e.target.value)} />
        <Area
          label="BIO HEADLINE"
          rows={2}
          value={p.bio_head}
          onChange={(e) => setS("bio_head", e.target.value)}
        />
        <Area
          label="BIO BODY"
          rows={6}
          value={p.bio_body}
          onChange={(e) => setS("bio_body", e.target.value)}
        />
        <Area
          label="QUOTE / CLOSER"
          rows={2}
          value={p.quote}
          onChange={(e) => setS("quote", e.target.value)}
        />

        <div>
          <p className="mb-1.5 text-[9px] font-bold tracking-[0.35em] text-edge">PORTRAIT</p>
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="text-xs text-dim file:mr-3 file:border file:border-edge/40 file:bg-transparent file:px-3 file:py-1 file:text-[10px] file:tracking-[0.2em] file:text-edge"
            />
            {p.portrait_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.portrait_url} alt="portrait" className="h-14 w-11 object-cover" />
            )}
          </div>
        </div>

        {err && <p className="text-[10px] font-bold tracking-[0.2em] text-alert">{err}</p>}
        {msg && <p className="text-[10px] font-bold tracking-[0.2em] text-cyan">{msg}</p>}

        <Btn onClick={save} disabled={busy}>
          {busy ? "SAVING..." : "SAVE PROFILE"}
        </Btn>
      </Panel>

      <h3 className="text-lg font-black italic tracking-widest text-cyan">SOCIAL LINKS</h3>
      <Panel className="space-y-3">
        {socials.map((s) => (
          <div key={s.id} className="flex flex-wrap items-end gap-2">
            <div className="min-w-[110px] flex-1">
              <Field
                label="LABEL"
                value={s.label}
                onChange={(e) =>
                  setSocials((rs) =>
                    rs.map((r) => (r.id === s.id ? { ...r, label: e.target.value } : r))
                  )
                }
              />
            </div>
            <div className="min-w-[110px] flex-1">
              <Field
                label="HANDLE"
                value={s.handle}
                onChange={(e) =>
                  setSocials((rs) =>
                    rs.map((r) => (r.id === s.id ? { ...r, handle: e.target.value } : r))
                  )
                }
              />
            </div>
            <div className="min-w-[160px] flex-[2]">
              <Field
                label="URL"
                value={s.url}
                onChange={(e) =>
                  setSocials((rs) =>
                    rs.map((r) => (r.id === s.id ? { ...r, url: e.target.value } : r))
                  )
                }
              />
            </div>
            <div className="flex gap-1 pb-0.5">
              <Btn
                variant="ghost"
                onClick={async () => {
                  const sb = getSupabase();
                  if (sb && s.id.startsWith("http") === false) {
                    await sb.from("socials").update(s).eq("id", s.id);
                  }
                }}
              >
                SAVE
              </Btn>
              <button
                onClick={async () => {
                  const sb = getSupabase();
                  if (sb) await sb.from("socials").delete().eq("id", s.id);
                  setSocials((rs) => rs.filter((r) => r.id !== s.id));
                }}
                aria-label="Delete social"
                className="px-2 pb-2 text-alert/70 hover:text-alert"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        <Btn
          variant="ghost"
          onClick={async () => {
            const sb = getSupabase();
            if (!sb) return;
            const { data } = await sb
              .from("socials")
              .insert({ label: "NEW LINK", handle: "", url: "https://", order: socials.length })
              .select()
              .single();
            if (data) setSocials((rs) => [...rs, data as SocialRow]);
          }}
        >
          <span className="inline-flex items-center gap-1">
            <Plus className="h-3 w-3" /> ADD LINK
          </span>
        </Btn>
      </Panel>
    </div>
  );
}
