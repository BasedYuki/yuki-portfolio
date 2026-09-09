"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { getSupabase } from "@/lib/supabase/client";
import { Area, Btn, Field, Panel } from "./ui";

interface XpRow {
  id: string;
  period: string;
  title: string;
  org: string;
  description: string;
  order: number;
}

export default function ExperienceAdmin() {
  const [rows, setRows] = useState<XpRow[]>([]);

  const load = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) return;
    const { data } = await sb.from("experience").select("*").order("order");
    setRows((data as XpRow[]) ?? []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const patch = (id: string, k: keyof XpRow, v: string | number) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [k]: v } : r)));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black italic tracking-widest text-cyan">
          EXPERIENCE — {rows.length}
        </h3>
        <Btn
          variant="ghost"
          onClick={async () => {
            const sb = getSupabase();
            if (!sb) return;
            const { data } = await sb
              .from("experience")
              .insert({ period: "YYYY — PRESENT", title: "NEW ROLE", org: "", description: "", order: rows.length })
              .select()
              .single();
            if (data) setRows((rs) => [...rs, data as XpRow]);
          }}
        >
          <span className="inline-flex items-center gap-1">
            <Plus className="h-3 w-3" /> ADD ENTRY
          </span>
        </Btn>
      </div>

      {rows.map((r) => (
        <Panel key={r.id} className="space-y-3">
          <div className="grid gap-3 md:grid-cols-4">
            <Field label="PERIOD" value={r.period} onChange={(e) => patch(r.id, "period", e.target.value)} />
            <Field label="TITLE" value={r.title} onChange={(e) => patch(r.id, "title", e.target.value)} />
            <Field label="ORG" value={r.org} onChange={(e) => patch(r.id, "org", e.target.value)} />
            <Field
              label="ORDER"
              type="number"
              value={r.order}
              onChange={(e) => patch(r.id, "order", Number(e.target.value))}
            />
          </div>
          <Area
            label="DESCRIPTION"
            rows={2}
            value={r.description}
            onChange={(e) => patch(r.id, "description", e.target.value)}
          />
          <div className="flex gap-3">
            <Btn
              onClick={async () => {
                const sb = getSupabase();
                if (!sb) return;
                await sb.from("experience").update(r).eq("id", r.id);
                await load();
              }}
            >
              SAVE
            </Btn>
            <Btn
              variant="danger"
              onClick={async () => {
                const sb = getSupabase();
                if (!sb) return;
                await sb.from("experience").delete().eq("id", r.id);
                setRows((rs) => rs.filter((x) => x.id !== r.id));
              }}
            >
              DELETE
            </Btn>
          </div>
        </Panel>
      ))}

      {rows.length === 0 && (
        <p className="p-6 text-center text-[11px] tracking-[0.3em] text-dim">NO ENTRIES YET</p>
      )}
    </div>
  );
}
