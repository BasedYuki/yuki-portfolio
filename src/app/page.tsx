"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BootScreen from "@/components/BootScreen";
import CustomCursor from "@/components/CustomCursor";
import GlitchOverlay from "@/components/GlitchOverlay";
import Hud from "@/components/Hud";
import SideMenu from "@/components/SideMenu";
import { Sections } from "@/components/Sections";
import type { SectionId } from "@/data/content";

export default function Page() {
  const [booted, setBooted] = useState(false);
  const [active, setActive] = useState<SectionId>("home");

  const go = useCallback((id: SectionId) => setActive(id), []);

  return (
    <main className="relative h-screen w-full overflow-hidden">
      <CustomCursor />
      <div className="scanlines pointer-events-none fixed inset-0 z-[60]" />
      <div className="halftone pointer-events-none fixed inset-0 z-[59] opacity-40" />

      <AnimatePresence>
        {!booted && <BootScreen key="boot" onBoot={() => setBooted(true)} />}
      </AnimatePresence>

      {booted && (
        <>
          <Hud />
          <SideMenu active={active} onSelect={go} />
          <GlitchOverlay trigger={active} />

          <div className="absolute inset-0 pb-14 pt-16 md:pl-44 md:pr-6 md:pb-0">
            <div className="mx-auto h-full max-w-5xl px-4 md:px-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  className="h-full"
                  initial={{ opacity: 0, x: 70, filter: "blur(6px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: -70, filter: "blur(6px)" }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Sections section={active} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
