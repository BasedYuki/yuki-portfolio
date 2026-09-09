"use client";

import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { useSound } from "@/components/SoundProvider";

export const ARCANA = [
  "THE FOOL",
  "THE MAGICIAN",
  "THE PRIESTESS",
  "THE EMPRESS",
  "THE EMPEROR",
  "THE HIEROPHANT",
  "THE LOVERS",
  "THE CHARIOT",
  "JUSTICE",
  "THE HERMIT",
  "FORTUNE",
  "STRENGTH",
  "THE HANGED MAN",
  "DEATH",
  "TEMPERANCE",
  "THE DEVIL",
  "THE TOWER",
  "THE STAR",
  "THE MOON",
  "THE SUN",
  "JUDGEMENT",
  "THE WORLD",
];

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`p3-panel clip-corner p-5 ${className}`}>{children}</div>;
}

export function Label({ children }: { children: ReactNode }) {
  return (
    <p className="mb-1.5 text-[9px] font-bold tracking-[0.35em] text-edge">{children}</p>
  );
}

export function Field({
  label,
  ...props
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        {...props}
        className="w-full border border-edge/30 bg-abyss px-3 py-2 text-sm text-ink outline-none transition-colors placeholder:text-dim/50 focus:border-cyan"
      />
    </div>
  );
}

export function Area({
  label,
  ...props
}: { label: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <Label>{label}</Label>
      <textarea
        {...props}
        className="w-full resize-y border border-edge/30 bg-abyss px-3 py-2 text-sm leading-relaxed text-ink outline-none transition-colors placeholder:text-dim/50 focus:border-cyan"
      />
    </div>
  );
}

export function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <Label>{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-edge/30 bg-abyss px-3 py-2 text-sm text-ink outline-none focus:border-cyan"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

export function Btn({
  children,
  onClick,
  variant = "primary",
  disabled,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "danger";
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const { play } = useSound();
  const styles =
    variant === "primary"
      ? "bg-gradient-to-r from-p3 to-cyan text-void font-black hover:brightness-110"
      : variant === "danger"
        ? "border border-alert/60 text-alert hover:bg-alert/15"
        : "border border-edge/40 text-ink hover:border-cyan hover:text-cyan";
  return (
    <button
      type={type}
      disabled={disabled}
      onMouseEnter={() => !disabled && play("move")}
      onClick={() => {
        if (disabled) return;
        play("confirm");
        onClick?.();
      }}
      className={`clip-corner-sm -skew-x-12 px-4 py-2 text-[11px] font-bold tracking-[0.25em] transition-all disabled:cursor-not-allowed disabled:opacity-40 ${styles}`}
    >
      <span className="inline-block skew-x-12">{children}</span>
    </button>
  );
}

export async function uploadMedia(
  file: File,
  path: string
): Promise<string | null> {
  const { getSupabase } = await import("@/lib/supabase/client");
  const sb = getSupabase();
  if (!sb) return null;
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const full = `${path}/${Date.now()}-${safe}`;
  const { error } = await sb.storage.from("media").upload(full, file, { upsert: true });
  if (error) throw error;
  const { data } = sb.storage.from("media").getPublicUrl(full);
  return data.publicUrl;
}
