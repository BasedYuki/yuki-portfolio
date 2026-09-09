"use client";

import { motion } from "framer-motion";
import { ExternalLink, MoonStar } from "lucide-react";
import LetterReveal from "./LetterReveal";
import { useContent } from "@/lib/useContent";
import { PROFILE } from "@/data/content";
import type { SectionId } from "@/data/content";

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <Reveal className="mb-10">
      <p className="mb-2 font-mono text-[11px] tracking-[0.4em] text-dim">{kicker}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-ink md:text-5xl">{title}</h2>
      <div className="mt-4 h-px w-16 bg-gradient-to-r from-cyan to-transparent" />
    </Reveal>
  );
}

function Hero() {
  return (
    <section id="top" className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-p3/25 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[380px] w-[480px] translate-x-1/3 rounded-full bg-cyan/10 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5"
      >
        <MoonStar className="h-3.5 w-3.5 text-cyan" />
        <span className="font-mono text-[10px] tracking-[0.35em] text-dim">
          {PROFILE.arcana} — ARCANA {PROFILE.arcanaNum}
        </span>
      </motion.div>

      <LetterReveal
        text={PROFILE.handle}
        delay={0.2}
        stagger={0.09}
        className="bg-gradient-to-b from-white via-ink to-p3 bg-clip-text pr-[0.18em] text-[24vw] font-semibold leading-none tracking-tight text-transparent md:text-[9.5rem]"
      />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="mt-5 text-lg italic text-dim md:text-xl"
      >
        ( {PROFILE.tagline} )
      </motion.p>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="group mt-16 flex flex-col items-center gap-2 text-dim transition-colors hover:text-cyan"
      >
        <span className="font-mono text-[10px] tracking-[0.4em]">SCROLL</span>
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
          ▾
        </motion.span>
      </motion.a>
    </section>
  );
}

function About() {
  const { content } = useContent();
  const p = content.profile;
  return (
    <section id="about" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-28">
      <SectionHeading kicker="PERSONA FILE" title="About" />
      <div className="grid gap-10 md:grid-cols-[260px_1fr]">
        <Reveal>
          <div className="glass overflow-hidden rounded-2xl">
            {p.portraitUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.portraitUrl} alt={p.name} className="aspect-[3/4] w-full object-cover" />
            ) : (
              <div className="flex aspect-[3/4] flex-col items-center justify-center gap-3">
                <MoonStar className="h-14 w-14 text-cyan/60" strokeWidth={1} />
                <p className="max-w-[170px] text-center font-mono text-[10px] leading-relaxed tracking-[0.2em] text-dim">
                  PORTRAIT SLOT — REPLACE VIA DASHBOARD
                </p>
              </div>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="space-y-5 text-[15px] leading-relaxed text-dim">
          {p.bioBody ? (
            <>
              {p.bioHead && (
                <p className="text-lg font-medium text-ink md:text-xl">{p.bioHead}</p>
              )}
              <p className="whitespace-pre-line">{p.bioBody}</p>
            </>
          ) : (
            <>
              <p>
                <span className="font-medium text-ink">{p.name}</span> — aka{" "}
                <span className="font-medium text-ink">{p.handle}</span>, a 21-year-old student
                of <span className="text-ink">{p.role}</span>, walking The Fool&apos;s path:
                infinite possibility at the start of the journey.
              </p>
              <p>
                Power systems and simulations by day.{" "}
                <span className="text-ink">Graphic design</span>,{" "}
                <span className="text-ink">video editing</span> and{" "}
                <span className="text-ink">vibe coding</span> by night — turning ideas into
                things that look and feel alive.
              </p>
            </>
          )}
          <p className="font-mono text-sm italic text-cyan/90">{p.quote || p.tagline}</p>
        </Reveal>
      </div>
    </section>
  );
}

function Projects() {
  const { content } = useContent();
  return (
    <section id="projects" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-28">
      <SectionHeading kicker="ARCHIVE // LIVE FROM DATABASE" title="Projects" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {content.projects.map((proj, i) => (
          <Reveal key={proj.id} delay={0.05 * Math.min(i, 6)}>
            <article className="glass glass-hover group flex h-full flex-col gap-3 rounded-2xl p-5">
              {proj.coverUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={proj.coverUrl}
                  alt={proj.title}
                  className="aspect-video w-full rounded-xl object-cover"
                />
              )}
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[9px] tracking-[0.25em] text-dim">
                  {proj.category}
                </span>
                <span className="font-mono text-[9px] italic text-gold/80">{proj.arcana}</span>
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-ink">{proj.title}</h3>
              <p className="text-sm leading-relaxed text-dim">{proj.description}</p>
              <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-3">
                {proj.link ? (
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] text-dim transition-colors hover:text-cyan"
                  >
                    OPEN <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="font-mono text-[10px] tracking-[0.2em] text-dim/50">
                    NO LINK YET
                  </span>
                )}
                <span className="h-1.5 w-1.5 rounded-full bg-cyan/30 transition-colors group-hover:bg-cyan" />
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Skills() {
  const { content } = useContent();
  return (
    <section id="skills" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-28">
      <SectionHeading kicker="SOCIAL STATS & EQUIPMENT" title="Skills" />
      <div className="grid gap-12 md:grid-cols-2">
        <div className="space-y-7">
          {content.stats.map((s, i) => (
            <Reveal key={s.id} delay={0.05 * i}>
              <div className="mb-2 flex items-baseline justify-between">
                <span className="text-sm font-medium tracking-[0.15em] text-ink">{s.label}</span>
                <span className="font-mono text-xs text-cyan">{s.value}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${s.value}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 + i * 0.1 }}
                  className="h-full rounded-full bg-gradient-to-r from-p3 to-cyan"
                />
              </div>
            </Reveal>
          ))}
        </div>
        <div>
          <p className="mb-5 font-mono text-[10px] tracking-[0.35em] text-dim">EQUIPMENT</p>
          <div className="flex flex-wrap gap-2">
            {content.equipment.map((e, i) => (
              <Reveal key={e.id} delay={0.03 * Math.min(i, 10)}>
                <span className="inline-block rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 font-mono text-[10px] tracking-[0.15em] text-ink/80 transition-colors hover:border-cyan/40 hover:text-ink">
                  {e.label}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Experience() {
  const { content } = useContent();
  return (
    <section id="experience" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-28">
      <SectionHeading kicker="JOURNEY LOG" title="Experience" />
      <div className="relative space-y-10 border-l border-white/10 pl-8">
        {content.experience.map((x, i) => (
          <Reveal key={x.id} delay={0.08 * i} className="relative">
            <span className="absolute -left-[37px] top-1.5 h-2.5 w-2.5 rounded-full bg-cyan shadow-[0_0_12px_rgba(255,59,82,0.6)]" />
            <p className="font-mono text-[11px] tracking-[0.3em] text-cyan/90">{x.period}</p>
            <h3 className="mt-1.5 text-xl font-semibold tracking-tight text-ink">{x.title}</h3>
            <p className="mt-0.5 text-sm text-dim">{x.org}</p>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-dim/90">{x.description}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231L18.244 2.25ZM17.083 19.72h1.833L7.084 4.126H5.117L17.083 19.72Z" />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.66 1.082 1.66 1.082.967 1.665 2.537 1.184 3.157.902.097-.7.367-1.18.667-1.45-2.72-.3-5.577-1.36-5.577-6.058 0-1.335.477-2.425 1.26-3.28-.105-.3-.456-1.5.1-3.11 0 0 .81-.26 2.65 1 .78-.22 1.6-.33 2.43-.34.83.01 1.65.12 2.43.33 1.84-1.26 2.65-1 2.65-1 .55 1.61.2 2.81.1 3.11.78.855 1.05 1.945 1.05 3.28 0 4.71-2.86 5.75-5.59 6.05.44.38.83 1.13.83 2.28 0 1.65-.015 2.98-.015 3.38 0 .32.21.7.83.575C20.565 21.795 24 17.295 24 12.297c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.227V9h3.892v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  );
}

function Contact() {
  const { content } = useContent();
  const socials = content.socials.map((s) => {
    const label = s.label.toUpperCase();
    if (label.includes("X") || label.includes("TWITTER")) return { ...s, key: "x" };
    if (label.includes("GITHUB")) return { ...s, key: "github" };
    if (label.includes("LINKEDIN")) return { ...s, key: "linkedin" };
    return { ...s, key: "other" };
  });

  return (
    <section id="contact" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-28">
      <SectionHeading kicker="OPEN CHANNEL" title="Contact" />

      <Reveal className="flex flex-col items-center gap-8">
        <div className="flex items-center gap-4 sm:gap-5">
          {socials.map((s) => (
            <a
              key={s.id}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="glass glass-hover flex h-14 w-14 items-center justify-center rounded-full text-ink transition-colors hover:text-cyan"
            >
              {s.key === "x" && <XIcon className="h-5 w-5" />}
              {s.key === "github" && <GithubIcon className="h-5 w-5" />}
              {s.key === "linkedin" && <LinkedinIcon className="h-5 w-5" />}
              {s.key === "other" && <ExternalLink className="h-5 w-5" />}
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-6 text-center">
        <p className="font-mono text-[10px] tracking-[0.3em] text-dim">
          © 2026 YUKI · big dream small dih · THE FOOL 0
        </p>
      </div>
    </footer>
  );
}

export function Sections({ section }: { section: SectionId }) {
  switch (section) {
    case "home":
      return <Hero />;
    case "about":
      return <About />;
    case "projects":
      return <Projects />;
    case "skills":
      return <Skills />;
    case "experience":
      return <Experience />;
    case "contact":
      return <Contact />;
  }
}
