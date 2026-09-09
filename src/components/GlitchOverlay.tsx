"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function GlitchOverlay({ trigger }: { trigger: string }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(true);
    const t = setTimeout(() => setActive(false), 500);
    return () => clearTimeout(t);
  }, [trigger]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key={trigger}
          className="pointer-events-none fixed inset-0 z-[70] overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <motion.div
            className="absolute inset-x-0 top-[28%] h-[9%] bg-cyan/70 mix-blend-screen"
            initial={{ x: "-110%" }}
            animate={{ x: "110%" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />
          <motion.div
            className="absolute inset-x-0 top-[56%] h-[4%] bg-alert/60 mix-blend-screen"
            initial={{ x: "110%" }}
            animate={{ x: "-110%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
          <motion.div
            className="absolute inset-x-0 top-[74%] h-[2%] bg-white/40 mix-blend-screen"
            initial={{ x: "-120%" }}
            animate={{ x: "120%" }}
            transition={{ duration: 0.28, ease: "easeOut", delay: 0.06 }}
          />
          <motion.div
            className="absolute inset-0 bg-cyan"
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
