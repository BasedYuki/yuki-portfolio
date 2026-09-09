"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MoonStar, Volume2, VolumeX } from "lucide-react";
import { useSound } from "./SoundProvider";

export default function Hud() {
  const { muted, toggleMute, play } = useSound();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const time = now
    ? now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false })
    : "--:--";
  const weekday = now ? now.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase() : "";
  const date = now
    ? now.toLocaleDateString("en-US", { month: "short", day: "2-digit" }).toUpperCase()
    : "";

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-4 pt-3 md:px-6"
    >
      <div className="p3-panel clip-corner-sm flex items-center gap-2 -skew-x-12 px-4 py-1.5">
        <span className="inline-flex skew-x-12 items-center gap-2">
          <MoonStar className="h-4 w-4 text-cyan" />
          <span className="text-[11px] font-black italic tracking-[0.25em]">
            YUKI <span className="text-dim">— THE FOOL · 0</span>
          </span>
        </span>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <div className="p3-panel clip-corner-sm flex items-baseline gap-3 -skew-x-12 px-4 py-1.5">
          <span className="inline-flex skew-x-12 items-baseline gap-3">
            <span className="text-xl font-black italic tabular-nums text-cyan md:text-2xl">
              {time}
            </span>
            <span className="text-[10px] font-bold tracking-[0.25em] text-dim">
              {weekday} · {date}
            </span>
          </span>
        </div>

        <button
          onClick={() => {
            toggleMute();
            play("confirm");
          }}
          aria-label={muted ? "Unmute UI sounds" : "Mute UI sounds"}
          className="p3-panel clip-corner-sm -skew-x-12 p-2 text-edge transition-colors hover:text-cyan"
        >
          <span className="inline-block skew-x-12">
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </span>
        </button>
      </div>
    </motion.header>
  );
}
