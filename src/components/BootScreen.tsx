"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import LetterReveal from "./LetterReveal";
import { useSound } from "./SoundProvider";

const MODULES = [
  "ESTABLISHING SIGNAL...",
  "LOADING ARCANA...",
  "SYNCING SOCIAL STATS...",
  "CALIBRATING HUD...",
  "WAKING THE FOOL...",
];

export default function BootScreen({ onBoot }: { onBoot: () => void }) {
  const { play } = useSound();
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const bootedRef = useRef(false);

  useEffect(() => {
    const start = performance.now();
    const dur = 2200;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(100, Math.round(((t - start) / dur) * 100));
      setProgress(p);
      if (p < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setReady(true);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const handle = () => {
      if (bootedRef.current) return;
      bootedRef.current = true;
      play("confirm");
      onBoot();
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [ready, onBoot, play]);

  const msg = MODULES[Math.min(MODULES.length - 1, Math.floor((progress / 100) * MODULES.length))];

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-void"
      exit={{ opacity: 0, filter: "brightness(3) blur(8px)" }}
      transition={{ duration: 0.45, ease: "easeIn" }}
    >
      <div className="halftone pointer-events-none absolute inset-0" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className="mb-4 -skew-x-12 border border-edge/30 px-4 py-1 text-[10px] font-bold tracking-[0.4em] text-edge">
          <span className="inline-block skew-x-12">THE FOOL — ARCANA 0</span>
        </div>

        <LetterReveal
          text="YUKI"
          delay={0.3}
          stagger={0.12}
          className="bg-gradient-to-b from-white via-ink to-p3 bg-clip-text pr-[0.18em] text-[26vw] font-black italic leading-none tracking-tighter text-transparent drop-shadow-[0_0_40px_rgba(255,45,70,0.4)] md:text-[13rem]"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="mt-2 text-sm italic tracking-widest text-dim"
        >
          ( big dream small dih )
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-16 w-64 md:w-80"
      >
        <div className="mb-2 flex items-end justify-between text-[10px] font-bold tracking-[0.3em] text-dim">
          <span>{msg}</span>
          <span className="text-cyan">{progress}%</span>
        </div>
        <div className="clip-corner-sm h-3 -skew-x-12 border border-edge/40 bg-abyss p-[2px]">
          <motion.div
            className="h-full bg-gradient-to-r from-p3 to-cyan"
            style={{ width: `${progress}%` }}
          />
        </div>
      </motion.div>

      <div className="mt-14 h-8">
        {ready && (
          <button
            onClick={() => {
              if (bootedRef.current) return;
              bootedRef.current = true;
              play("confirm");
              onBoot();
            }}
            className="blink text-lg font-black italic tracking-[0.5em] text-cyan md:text-xl"
          >
            PRESS START
          </button>
        )}
      </div>
    </motion.div>
  );
}
