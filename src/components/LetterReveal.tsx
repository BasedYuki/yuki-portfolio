"use client";

import { motion } from "framer-motion";

type Props = {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
};

export default function LetterReveal({ text, className, delay = 0, stagger = 0.025 }: Props) {
  return (
    <motion.span
      className={className}
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      aria-label={text}
    >
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block whitespace-pre"
          variants={{
            hidden: { opacity: 0, y: 16, rotateX: -70 },
            show: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.25, ease: "easeOut" } },
          }}
        >
          {ch}
        </motion.span>
      ))}
    </motion.span>
  );
}
