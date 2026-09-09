"use client";

import { motion } from "framer-motion";
import { ExternalLink, Mail, MoonStar } from "lucide-react";
import LetterReveal from "./LetterReveal";
import { useSound } from "./SoundProvider";
import { useContent, type Content } from "@/lib/useContent";

function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-8">
      <p className="mb-1 text-[10px] font-bold tracking-[0.45em] text-edge">{kicker}</p>
      <LetterReveal
        text={title}
        stagger={0.04}
        className="text-4xl font-black italic tracking-tight text-ink md:text-6xl"
      />
      <div className="mt-3 h-[3px] w-24 -skew-x-12 bg-gradient-to-r from-cyan to-transparent" />
    </div>
  );
}

function Hero({ c }: { c: Content }) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-5 -skew-x-12 border border-edge/30 bg-abyss/60 px-5 py-1.5"
      >
        <span className="inline-flex skew-x-12 items-center gap-2 text-[10px] font-bold tracking-[0.4em] text-edge">
          <MoonStar className="h-3.5 w-3.5" />
          {c.profile.arcana} — ARCANA {c.profile.arcanaNum}
        </span>
      </motion.div>

      <LetterReveal
        text={c.profile.handle}
        delay={0.35}
        stagger={0.12}
        className="bg-gradient-to-b from-white via-ink to-p3 bg-clip-text pr-[0.18em] text-[22vw] font-black italic leading-none tracking-tighter text-transparent drop-shadow-[0_0_50px_rgba(255,45,70,0.35)] md:text-[11rem]"
      />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-4 text-base italic tracking-[0.25em] text-dim md:text-lg"
      >
        ( {c.profile.tagline} )
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-6 text-xs font-bold tracking-[0.35em] text-edge"
      >
        ( {c.profile.name.toUpperCase()} )
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-10 hidden text-[10px] tracking-[0.3em] text-dim md:block"
      >
        ▸ USE THE MENU ON YOUR LEFT
      </motion.p>
    </div>
  );
}

function About({ c }: { c: Content }) {
  const p = c.profile;
  return (
    <div className="thin-scroll h-full overflow-y-auto pr-2">
      <SectionTitle kicker="PERSONA FILE" title="ABOUT" />
      <div className="grid gap-6 md:grid-cols-[280px_1fr]">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="p3-panel clip-corner floaty flex aspect-[3/4] flex-col items-center justify-center gap-3 overflow-hidden"
        >
          {p.portraitUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.portraitUrl} alt={p.name} className="h-full w-full object-cover" />
          ) : (
            <>
              <MoonStar className="h-16 w-16 text-edge" strokeWidth={1.2} />
              <p className="max-w-[180px] text-center text-[10px] tracking-[0.25em] text-dim">
                PORTRAIT SLOT — REPLACE VIA DASHBOARD
              </p>
            </>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-5 text-sm leading-relaxed text-ink/90 md:text-base"
        >
          {p.bioBody ? (
            <>
              {p.bioHead && <p className="font-black italic text-cyan">{p.bioHead}</p>}
              <p className="whitespace-pre-line">{p.bioBody}</p>
            </>
          ) : (
            <>
              <p>
                <span className="font-black italic text-cyan">{p.name}</span> — aka{" "}
                <span className="font-black italic">{p.handle}</span>. A student of{" "}
                <span className="text-edge">{p.role}</span>, walking The Fool&apos;s path:
                infinite possibility at the start of the journey.
              </p>
              <p>
                By day: power systems, simulations, and engineering software. By night:{" "}
                <span className="text-cyan">graphic design</span>,{" "}
                <span className="text-cyan">video editing</span>, and{" "}
                <span className="text-cyan">vibe coding</span> — turning ideas into things that
                look alive.
              </p>
            </>
          )}
          <p className="italic text-dim">{p.quote || p.tagline}</p>
        </motion.div>
      </div>
    </div>
  );
}

function Projects({ c }: { c: Content }) {
  return (
    <div className="thin-scroll h-full overflow-y-auto pr-2">
      <SectionTitle kicker="ARCHIVE // LIVE FROM DATABASE" title="PROJECTS" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {c.projects.map((p, i) => (
          <motion.article
            key={p.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 * Math.min(i, 8), duration: 0.45 }}
            className="group p3-panel clip-corner relative flex flex-col gap-2 p-5 transition-colors hover:border-cyan/60"
          >
            {p.coverUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.coverUrl}
                alt={p.title}
                className="clip-corner-sm mb-2 aspect-video w-full object-cover"
              />
            )}
            <div className="flex items-start justify-between gap-2">
              <span className="text-[9px] font-bold tracking-[0.3em] text-edge">{p.category}</span>
              <span className="text-[9px] italic tracking-[0.15em] text-gold">{p.arcana}</span>
            </div>
            <h3 className="text-xl font-black italic tracking-tight">{p.title}</h3>
            <p className="text-xs leading-relaxed text-dim">{p.description}</p>
            <div className="mt-auto flex items-center justify-between border-t border-edge/15 pt-3">
              {p.link ? (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[9px] tracking-[0.3em] text-dim transition-colors group-hover:text-cyan"
                >
                  OPEN <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <span className="text-[9px] tracking-[0.3em] text-dim/60">NO LINK YET</span>
              )}
              <span className="h-2 w-2 -skew-x-12 bg-cyan/40 transition-colors group-hover:bg-cyan" />
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

function Skills({ c }: { c: Content }) {
  return (
    <div className="thin-scroll h-full overflow-y-auto pr-2">
      <SectionTitle kicker="SOCIAL STATS & EQUIPMENT" title="SKILLS" />
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <p className="text-[10px] font-bold tracking-[0.35em] text-edge">SOCIAL STATS</p>
          {c.stats.map((s, i) => (
            <div key={s.id}>
              <div className="mb-1.5 flex items-baseline justify-between">
                <span className="text-xs font-black italic tracking-[0.25em]">{s.label}</span>
                <span className="text-[10px] tabular-nums text-cyan">{s.value}</span>
              </div>
              <div className="h-3.5 -skew-x-12 border border-edge/30 bg-abyss p-[2px]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${s.value}%` }}
                  transition={{ delay: 0.15 + i * 0.12, duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-p3 to-cyan"
                />
              </div>
            </div>
          ))}
          <p className="pt-2 text-[10px] italic tracking-[0.2em] text-dim">
            ▸ STATS LEVEL UP AS NEW PROJECTS ARE ADDED
          </p>
        </div>

        <div>
          <p className="mb-6 text-[10px] font-bold tracking-[0.35em] text-edge">EQUIPMENT</p>
          <div className="flex flex-wrap gap-2">
            {c.equipment.map((e, i) => (
              <motion.span
                key={e.id}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.04 * Math.min(i, 10) }}
                className="clip-corner-sm border border-edge/25 bg-panel/60 px-3 py-1.5 text-[10px] font-bold tracking-[0.2em] text-ink/90"
              >
                {e.label}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Experience({ c }: { c: Content }) {
  return (
    <div className="thin-scroll h-full overflow-y-auto pr-2">
      <SectionTitle kicker="JOURNEY LOG" title="EXPERIENCE" />
      <div className="relative space-y-6 border-l border-edge/25 pl-6">
        {c.experience.map((x, i) => (
          <motion.div
            key={x.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * Math.min(i, 6), duration: 0.45 }}
            className="relative"
          >
            <span className="absolute -left-[31px] top-1 h-3 w-3 -skew-x-12 bg-cyan" />
            <p className="text-[10px] font-bold tracking-[0.35em] text-edge">{x.period}</p>
            <h3 className="mt-1 text-xl font-black italic tracking-tight">{x.title}</h3>
            <p className="text-xs tracking-[0.15em] text-cyan/80">{x.org}</p>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-dim">{x.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Contact({ c }: { c: Content }) {
  const { play } = useSound();
  return (
    <div className="thin-scroll h-full overflow-y-auto pr-2">
      <SectionTitle kicker="OPEN CHANNEL" title="CONTACT" />
      <div className="space-y-6">
        <motion.a
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          href={`mailto:${c.profile.email}`}
          onMouseEnter={() => play("move")}
          className="p3-panel clip-corner flex items-center gap-4 px-5 py-4 transition-colors hover:border-cyan/60"
        >
          <Mail className="h-6 w-6 shrink-0 text-edge" />
          <div>
            <p className="text-[10px] font-bold tracking-[0.35em] text-edge">DIRECT LINE</p>
            <p className="text-sm font-bold md:text-base">{c.profile.email}</p>
          </div>
        </motion.a>

        <div className="grid gap-4 sm:grid-cols-3">
          {c.socials.map((s, i) => (
            <motion.a
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * Math.min(i, 4), duration: 0.4 }}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => play("move")}
              className="group p3-panel clip-corner flex items-center justify-between px-4 py-3 transition-colors hover:border-cyan/60"
            >
              <div>
                <p className="text-[9px] font-bold tracking-[0.3em] text-edge">{s.label}</p>
                <p className="text-xs text-ink/85">{s.handle}</p>
              </div>
              <ExternalLink className="h-4 w-4 text-dim transition-colors group-hover:text-cyan" />
            </motion.a>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="pt-4 text-xs italic tracking-[0.2em] text-dim"
        >
          &quot;{c.profile.tagline}&quot; — reach out, the signal is always open.
        </motion.p>
      </div>
    </div>
  );
}

export function Sections({ section }: { section: import("@/data/content").SectionId }) {
  const { content } = useContent();
  switch (section) {
    case "home":
      return <Hero c={content} />;
    case "about":
      return <About c={content} />;
    case "projects":
      return <Projects c={content} />;
    case "skills":
      return <Skills c={content} />;
    case "experience":
      return <Experience c={content} />;
    case "contact":
      return <Contact c={content} />;
  }
}
