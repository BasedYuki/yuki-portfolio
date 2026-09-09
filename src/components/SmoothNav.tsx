"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { MoonStar } from "lucide-react";

const LINKS = [
  { href: "#about", label: "ABOUT" },
  { href: "#projects", label: "PROJECTS" },
  { href: "#skills", label: "SKILLS" },
  { href: "#experience", label: "BONDS" },
  { href: "#contact", label: "CONTACT" },
];

export default function SmoothNav() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled ? "border-b border-white/5 bg-void/70 backdrop-blur-md" : ""
      }`}
    >
      <motion.div
        className="h-[2px] origin-left bg-gradient-to-r from-p3 via-cyan to-p3"
        style={{ scaleX: progress }}
      />
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5">
        <a href="#top" className="flex items-center gap-2 text-ink transition-colors hover:text-cyan">
          <MoonStar className="h-4 w-4 text-cyan" />
          <span className="text-sm font-semibold tracking-[0.25em]">YUKI</span>
          <span className="hidden text-[10px] font-light tracking-[0.2em] text-dim sm:inline">
            — THE FOOL · 0
          </span>
        </a>

        <div className="flex items-center gap-1 sm:gap-2">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-2.5 py-1.5 text-[10px] font-medium tracking-[0.2em] text-dim transition-colors hover:bg-white/5 hover:text-ink sm:px-3 sm:text-[11px]"
            >
              {l.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
