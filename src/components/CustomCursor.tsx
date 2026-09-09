"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 280, damping: 24, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 280, damping: 24, mass: 0.6 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    setEnabled(fine);
    if (!fine) return;
    document.documentElement.classList.add("cursor-none-target");
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      document.documentElement.classList.remove("cursor-none-target");
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed z-[80] h-2 w-2 bg-cyan"
        style={{ left: x, top: y, x: "-50%", y: "-50%" }}
      />
      <motion.div
        className="pointer-events-none fixed z-[80] h-8 w-8 border border-edge/60"
        style={{ left: rx, top: ry, x: "-50%", y: "-50%" }}
      />
    </>
  );
}
