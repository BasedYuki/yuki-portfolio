"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  EQUIPMENT,
  EXPERIENCE,
  PROFILE,
  PROJECTS,
  SOCIALS,
  STATS,
} from "@/data/content";

// One shared realtime channel for ALL useContent instances.
// Creating a channel per hook with the same name throws
// "cannot add postgres_changes callbacks after subscribe()".
let sharedChannelStarted = false;
const listeners = new Set<() => void>();

function ensureSharedChannel() {
  if (sharedChannelStarted) return;
  const sb = getSupabase();
  if (!sb) return;
  sharedChannelStarted = true;
  sb
    .channel("content-live")
    .on("postgres_changes", { event: "*", schema: "public" }, () => {
      for (const fn of listeners) fn();
    })
    .subscribe();
}

export interface ProfileData {
  handle: string;
  name: string;
  tagline: string;
  arcana: string;
  arcanaNum: string;
  role: string;
  email: string;
  bioHead: string;
  bioBody: string;
  quote: string;
  portraitUrl: string | null;
}

export interface SocialData {
  id: string;
  label: string;
  handle: string;
  url: string;
}

export interface ProjectData {
  id: string;
  title: string;
  category: string;
  arcana: string;
  description: string;
  coverUrl: string | null;
  link: string | null;
}

export interface StatData {
  id: string;
  label: string;
  value: number;
}

export interface EquipmentData {
  id: string;
  label: string;
}

export interface ExperienceData {
  id: string;
  period: string;
  title: string;
  org: string;
  description: string;
}

export interface Content {
  profile: ProfileData;
  socials: SocialData[];
  projects: ProjectData[];
  stats: StatData[];
  equipment: EquipmentData[];
  experience: ExperienceData[];
}

export const FALLBACK: Content = {
  profile: {
    handle: PROFILE.handle,
    name: PROFILE.name,
    tagline: PROFILE.tagline,
    arcana: PROFILE.arcana,
    arcanaNum: PROFILE.arcanaNum,
    role: PROFILE.role,
    email: PROFILE.email,
    bioHead: "",
    bioBody: "",
    quote: PROFILE.tagline,
    portraitUrl: null,
  },
  socials: SOCIALS.map((s, i) => ({ id: String(i), ...s })),
  projects: PROJECTS.map((p, i) => ({
    id: String(i),
    title: p.title,
    category: p.cat,
    arcana: p.arcana,
    description: p.desc,
    coverUrl: null,
    link: null,
  })),
  stats: STATS.map((s, i) => ({ id: String(i), ...s })),
  equipment: EQUIPMENT.map((label, i) => ({ id: String(i), label })),
  experience: EXPERIENCE.map((x, i) => ({ id: String(i), ...x })),
};

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapProfile(row: any): ProfileData {
  return {
    handle: row.handle ?? "",
    name: row.name ?? "",
    tagline: row.tagline ?? "",
    arcana: row.arcana ?? "",
    arcanaNum: row.arcana_num ?? "0",
    role: row.role ?? "",
    email: row.email ?? "",
    bioHead: row.bio_head ?? "",
    bioBody: row.bio_body ?? "",
    quote: row.quote ?? "",
    portraitUrl: row.portrait_url ?? null,
  };
}

function mapProject(row: any): ProjectData {
  return {
    id: row.id,
    title: row.title ?? "",
    category: row.category ?? "",
    arcana: row.arcana ?? "",
    description: row.description ?? "",
    coverUrl: row.cover_url ?? null,
    link: row.link ?? null,
  };
}

export function useContent() {
  const [content, setContent] = useState<Content>(FALLBACK);
  const configured = isSupabaseConfigured();

  const refetch = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) return;
    const [p, so, pr, st, eq, ex] = await Promise.all([
      sb.from("profile").select("*").eq("id", 1).maybeSingle(),
      sb.from("socials").select("*").order("order"),
      sb.from("projects").select("*").eq("published", true).order("order"),
      sb.from("skill_stats").select("*").order("order"),
      sb.from("equipment").select("*").order("order"),
      sb.from("experience").select("*").order("order"),
    ]);

    setContent((prev) => ({
      profile: p?.data ? mapProfile(p.data) : prev.profile,
      socials: so?.data?.length
        ? so.data.map((r: any) => ({ id: r.id, label: r.label, handle: r.handle, url: r.url }))
        : prev.socials,
      projects: pr?.data?.length ? pr.data.map(mapProject) : prev.projects,
      stats: st?.data?.length
        ? st.data.map((r: any) => ({ id: r.id, label: r.label, value: r.value }))
        : prev.stats,
      equipment: eq?.data?.length
        ? eq.data.map((r: any) => ({ id: r.id, label: r.label }))
        : prev.equipment,
      experience: ex?.data?.length
        ? ex.data.map((r: any) => ({
            id: r.id,
            period: r.period,
            title: r.title,
            org: r.org,
            description: r.description,
          }))
        : prev.experience,
    }));
  }, []);

  useEffect(() => {
    if (!configured) return;
    void refetch();
    ensureSharedChannel();
    listeners.add(refetch);
    return () => {
      listeners.delete(refetch);
    };
  }, [configured, refetch]);

  return { content, configured };
}
