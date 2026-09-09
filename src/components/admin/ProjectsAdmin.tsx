"use client";

import { useCallback, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { getSupabase } from "@/lib/supabase/client";
import { ARCANA, Area, Btn, Field, Panel, Select, uploadMedia } from "./ui";

interface Row {
  id: string;
  title: string;
  category: string;
  arcana: string;
  description: string;
  cover_url: string | null;
  link: string | null;
  published: boolean;
  order: number;
}

const EMPTY: Row = {
  id: "",
  title: "",
  category: "POWER / ENGINEERING",
  arcana: "THE FOOL",
  description: "",
  cover_url: null,
  link: null,
  published: true,
  order: 0,
};

export default function ProjectsAdmin() {
  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<Row | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const load = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) return;
    const { data } = await sb.from("projects").select("*").order("order");
    setRows((data as Row[]) ?? []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const openNew = () => {
    setEditing({ ...EMPTY });
    setIsNew(true);
    setFile(null);
    setErr("");
  };

  const openEdit = (r: Row) => {
    setEditing({ ...r });
    setIsNew(false);
    setFile(null);
    setErr("");
  };

  const save = async () => {
    const sb = getSupabase();
    if (!sb || !editing) return;
    if (!editing.title.trim()) {
      setErr("TITLE IS REQUIRED");
      return;
    }
    setBusy(true);
    setErr("");
    try {
      let row = { ...editing };
      if (file) {
        const url = await uploadMedia(file, "covers");
        row = { ...row, cover_url: url };
      }
      const { error } = isNew
        ? await sb.from("projects").insert(row)
        : await sb.from("projects").update(row).eq("id", row.id);
      if (error) throw error;
      setEditing(null);
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message.toUpperCase() : "SAVE FAILED");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    const sb = getSupabase();
    if (!sb) return;
    if (!window.confirm("DELETE THIS PROJECT?")) return;
    await sb.from("projects").delete().eq("id", id);
    await load();
  };

  if (editing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black italic tracking-widest text-cyan">
            {isNew ? "NEW PROJECT" : "EDIT PROJECT"}
          </h3>
          <Btn variant="ghost" onClick={() => setEditing(null)}>
            ← BACK
          </Btn>
        </div>

        <Panel className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="TITLE *"
              value={editing.title}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              placeholder="PROJECT NAME"
            />
            <Field
              label="CATEGORY"
              value={editing.category}
              onChange={(e) => setEditing({ ...editing, category: e.target.value })}
              placeholder="POWER / ENGINEERING"
            />
            <Select
              label="ARCANA"
              value={editing.arcana}
              onChange={(v) => setEditing({ ...editing, arcana: v })}
              options={ARCANA}
            />
            <Field
              label="ORDER"
              type="number"
              value={editing.order}
              onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })}
            />
          </div>

          <Area
            label="DESCRIPTION"
            rows={4}
            value={editing.description}
            onChange={(e) => setEditing({ ...editing, description: e.target.value })}
            placeholder="WHAT IS THIS PROJECT?"
          />

          <Field
            label="LINK (OPTIONAL)"
            value={editing.link ?? ""}
            onChange={(e) => setEditing({ ...editing, link: e.target.value || null })}
            placeholder="https://..."
          />

          <div>
            <p className="mb-1.5 text-[9px] font-bold tracking-[0.35em] text-edge">
              COVER IMAGE
            </p>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="text-xs text-dim file:mr-3 file:border file:border-edge/40 file:bg-transparent file:px-3 file:py-1 file:text-[10px] file:tracking-[0.2em] file:text-edge"
              />
              {editing.cover_url && (
                <span className="max-w-[200px] truncate text-[10px] text-cyan">
                  CURRENT: {editing.cover_url.split("/").pop()}
                </span>
              )}
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-[10px] font-bold tracking-[0.3em] text-dim">
            <input
              type="checkbox"
              checked={editing.published}
              onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
              className="accent-cyan"
            />
            PUBLISHED ON SITE
          </label>

          {err && <p className="text-[10px] font-bold tracking-[0.2em] text-alert">{err}</p>}

          <div className="flex gap-3 pt-2">
            <Btn onClick={save} disabled={busy}>
              {busy ? "SAVING..." : "SAVE"}
            </Btn>
            <Btn variant="ghost" onClick={() => setEditing(null)}>
              CANCEL
            </Btn>
          </div>
        </Panel>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black italic tracking-widest text-cyan">
          PROJECTS — {rows.length}
        </h3>
        <Btn onClick={openNew}>+ NEW</Btn>
      </div>

      <div className="space-y-2">
        {rows.map((r) => (
          <div
            key={r.id}
            className="p3-panel clip-corner-sm flex items-center gap-4 px-4 py-3"
          >
            {r.cover_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={r.cover_url} alt="" className="h-10 w-14 -skew-x-6 object-cover" />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black italic">{r.title}</p>
              <p className="text-[9px] tracking-[0.25em] text-dim">
                {r.category} · {r.arcana} {r.published ? "" : "· DRAFT"}
              </p>
            </div>
            <Btn variant="ghost" onClick={() => openEdit(r)}>
              EDIT
            </Btn>
            <button
              onClick={() => remove(r.id)}
              aria-label="Delete project"
              className="text-alert/70 transition-colors hover:text-alert"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {rows.length === 0 && (
          <p className="p-6 text-center text-[11px] tracking-[0.3em] text-dim">
            NO PROJECTS YET — ADD YOUR FIRST BUILD
          </p>
        )}
      </div>
    </div>
  );
}
