"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { getSupabase } from "@/lib/supabase/client";
import { Btn, Field, Panel } from "./ui";

interface StatRow {
  id: string;
  label: string;
  value: number;
  order: number;
}

interface EqRow {
  id: string;
  label: string;
  order: number;
}

export default function StatsAdmin() {
  const [stats, setStats] = useState<StatRow[]>([]);
  const [equipment, setEquipment] = useState<EqRow[]>([]);
  const [newEq, setNewEq] = useState("");

  const load = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) return;
    const [st, eq] = await Promise.all([
      sb.from("skill_stats").select("*").order("order"),
      sb.from("equipment").select("*").order("order"),
    ]);
    setStats((st.data as StatRow[]) ?? []);
    setEquipment((eq.data as EqRow[]) ?? []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const saveStat = async (s: StatRow) => {
    const sb = getSupabase();
    if (!sb) return;
    await sb.from("skill_stats").update({ label: s.label, value: s.value, order: s.order }).eq("id", s.id);
    await load();
  };

  const addStat = async () => {
    const sb = getSupabase();
    if (!sb) return;
    const { data } = await sb
      .from("skill_stats")
      .insert({ label: "NEW STAT", value: 50, order: stats.length })
      .select()
      .single();
    if (data) setStats((rs) => [...rs, data as StatRow]);
  };

  const addEq = async () => {
    const sb = getSupabase();
    if (!sb || !newEq.trim()) return;
    const { data } = await sb
      .from("equipment")
      .insert({ label: newEq.trim().toUpperCase(), order: equipment.length })
      .select()
      .single();
    if (data) setEquipment((rs) => [...rs, data as EqRow]);
    setNewEq("");
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-black italic tracking-widest text-cyan">SOCIAL STATS</h3>
      <Panel className="space-y-3">
        {stats.map((s) => (
          <div key={s.id} className="flex items-end gap-2">
            <div className="flex-[2]">
              <Field
                label="LABEL"
                value={s.label}
                onChange={(e) =>
                  setStats((rs) => rs.map((r) => (r.id === s.id ? { ...r, label: e.target.value } : r)))
                }
              />
            </div>
            <div className="w-28">
              <Field
                label="VALUE 0-100"
                type="number"
                min={0}
                max={100}
                value={s.value}
                onChange={(e) =>
                  setStats((rs) =>
                    rs.map((r) =>
                      r.id === s.id
                        ? { ...r, value: Math.max(0, Math.min(100, Number(e.target.value))) }
                        : r
                    )
                  )
                }
              />
            </div>
            <div className="w-20">
              <Field
                label="ORDER"
                type="number"
                value={s.order}
                onChange={(e) =>
                  setStats((rs) =>
                    rs.map((r) => (r.id === s.id ? { ...r, order: Number(e.target.value) } : r))
                  )
                }
              />
            </div>
            <div className="flex gap-1 pb-0.5">
              <Btn variant="ghost" onClick={() => saveStat(s)}>
                SAVE
              </Btn>
              <button
                onClick={async () => {
                  const sb = getSupabase();
                  if (sb) await sb.from("skill_stats").delete().eq("id", s.id);
                  setStats((rs) => rs.filter((r) => r.id !== s.id));
                }}
                aria-label="Delete stat"
                className="px-2 pb-2 text-alert/70 hover:text-alert"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        <Btn variant="ghost" onClick={addStat}>
          <span className="inline-flex items-center gap-1">
            <Plus className="h-3 w-3" /> ADD STAT
          </span>
        </Btn>
      </Panel>

      <h3 className="text-lg font-black italic tracking-widest text-cyan">EQUIPMENT</h3>
      <Panel className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {equipment.map((e) => (
            <span
              key={e.id}
              className="clip-corner-sm flex items-center gap-2 border border-edge/25 bg-panel/60 px-3 py-1.5 text-[10px] font-bold tracking-[0.2em]"
            >
              {e.label}
              <button
                onClick={async () => {
                  const sb = getSupabase();
                  if (sb) await sb.from("equipment").delete().eq("id", e.id);
                  setEquipment((rs) => rs.filter((r) => r.id !== e.id));
                }}
                aria-label="Delete equipment"
                className="text-alert/70 hover:text-alert"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </span>
          ))}
          {equipment.length === 0 && (
            <p className="text-[11px] tracking-[0.3em] text-dim">NO EQUIPMENT YET</p>
          )}
        </div>
        <div className="flex items-end gap-2">
          <div className="w-64">
            <Field
              label="NEW EQUIPMENT"
              value={newEq}
              onChange={(e) => setNewEq(e.target.value)}
              placeholder="E.G. ETAP"
            />
          </div>
          <Btn onClick={addEq} disabled={!newEq.trim()}>
            ADD
          </Btn>
        </div>
      </Panel>
    </div>
  );
}
