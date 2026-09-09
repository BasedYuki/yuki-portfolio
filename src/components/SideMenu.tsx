"use client";

import { motion } from "framer-motion";
import {
  FolderGit2,
  Home,
  Milestone,
  Send,
  SlidersHorizontal,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { MENU, type SectionId } from "@/data/content";
import { useSound } from "./SoundProvider";

const ICONS: Record<string, LucideIcon> = {
  Home,
  UserRound,
  FolderGit2,
  SlidersHorizontal,
  Milestone,
  Send,
};

type Props = {
  active: SectionId;
  onSelect: (id: SectionId) => void;
};

export default function SideMenu({ active, onSelect }: Props) {
  const { play } = useSound();

  const items = MENU.map((m) => {
    const Icon = ICONS[m.icon];
    return { ...m, Icon };
  });

  return (
    <>
      <nav className="fixed left-0 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-2 pl-4 md:flex">
        {items.map(({ id, label, Icon }, i) => {
          const isActive = active === id;
          return (
            <motion.button
              key={id}
              initial={{ x: -80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.4, ease: "easeOut" }}
              onMouseEnter={() => play("move")}
              onClick={() => {
                play("confirm");
                onSelect(id);
              }}
              className={`group flex w-32 -skew-x-12 items-center gap-3 border px-3 py-2 transition-all duration-200 hover:translate-x-2 ${
                isActive
                  ? "border-cyan bg-gradient-to-r from-p3/80 to-panel-2 text-void"
                  : "border-edge/25 bg-abyss/70 text-ink hover:border-cyan/60"
              }`}
              style={isActive ? { background: "linear-gradient(90deg,#ff2d46,#a3001e)" } : undefined}
            >
              <span className="inline-flex skew-x-12 items-center gap-3">
                <Icon className={`h-4 w-4 ${isActive ? "text-void" : "text-edge"}`} />
                <span
                  className={`text-[11px] font-black italic tracking-[0.2em] ${
                    isActive ? "text-void" : ""
                  }`}
                >
                  {label}
                </span>
              </span>
            </motion.button>
          );
        })}
      </nav>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t border-edge/20 bg-abyss/90 backdrop-blur md:hidden">
        {items.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => {
                play("confirm");
                onSelect(id);
              }}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 ${
                isActive ? "text-cyan" : "text-dim"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[8px] font-black italic tracking-[0.2em]">{label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
