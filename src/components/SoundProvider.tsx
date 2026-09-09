"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { playSound, type SoundName } from "@/lib/sound";

type SoundCtx = {
  muted: boolean;
  toggleMute: () => void;
  play: (name: SoundName) => void;
};

const Ctx = createContext<SoundCtx>({ muted: true, toggleMute: () => {}, play: () => {} });

export function SoundProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
    const stored = localStorage.getItem("yuki:sound");
    setMuted(stored ? stored === "off" : coarse);
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      localStorage.setItem("yuki:sound", next ? "off" : "on");
      return next;
    });
  }, []);

  const play = useCallback(
    (name: SoundName) => {
      if (muted) return;
      playSound(name);
    },
    [muted]
  );

  return <Ctx.Provider value={{ muted, toggleMute, play }}>{children}</Ctx.Provider>;
}

export const useSound = () => useContext(Ctx);
