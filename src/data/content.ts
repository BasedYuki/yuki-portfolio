export type SectionId = "home" | "about" | "projects" | "skills" | "experience" | "contact";

export const MENU: { id: SectionId; label: string; icon: string }[] = [
  { id: "home", label: "HOME", icon: "Home" },
  { id: "about", label: "PERSONA", icon: "UserRound" },
  { id: "projects", label: "BUILDS", icon: "FolderGit2" },
  { id: "skills", label: "STATS", icon: "SlidersHorizontal" },
  { id: "experience", label: "BONDS", icon: "Milestone" },
  { id: "contact", label: "SIGNAL", icon: "Send" },
];

export const PROFILE = {
  handle: "YUKI",
  name: "Omar Abdelhamed",
  tagline: "big dream small dih",
  arcana: "THE FOOL",
  arcanaNum: "0",
  role: "Smart Electric Power Grids — Faculty of Engineering, Zagazig University",
  email: "omarabdlhamedd7@gmail.com",
};

export const SOCIALS = [
  { label: "X / TWITTER", handle: "@Yukisobased", url: "https://x.com/Yukisobased" },
  { label: "GITHUB", handle: "@BasedYuki", url: "https://github.com/BasedYuki" },
  {
    label: "LINKEDIN",
    handle: "in/omar-mohamed",
    url: "https://www.linkedin.com/in/omar-mohamed-b4201540a",
  },
];

export const STATS = [
  { label: "GRAPHIC DESIGN", value: 85 },
  { label: "VIDEO EDITING", value: 80 },
  { label: "VIBE CODING", value: 72 },
];

export const EQUIPMENT = [
  "MATLAB",
  "SIMULINK",
  "POWER ELECTRONICS SIMULATION",
  "PROTEUS",
  "PvSYST",
  "ETAP",
  "ECAD",
  "AUTOCAD",
  "DIALUX EVO",
  "MICROSOFT OFFICE",
];

export type Project = {
  title: string;
  cat: string;
  arcana: string;
  desc: string;
};

export const PROJECTS: Project[] = [
  {
    title: "GRID FLOW STUDY",
    cat: "POWER / ENGINEERING",
    arcana: "THE MAGICIAN",
    desc: "Load-flow and fault simulation of a small distribution network — ETAP / MATLAB content slot.",
  },
  {
    title: "SOLAR SUITE",
    cat: "POWER / ENGINEERING",
    arcana: "THE SUN",
    desc: "Off-grid solar unit: PVSyst sizing + Proteus prototype. Content slot.",
  },
  {
    title: "BRAND ARCANA",
    cat: "GRAPHIC DESIGN",
    arcana: "THE EMPRESS",
    desc: "Full identity kit — logo, palette, posters. Content slot.",
  },
  {
    title: "POSTER RUN",
    cat: "GRAPHIC DESIGN",
    arcana: "THE STAR",
    desc: "Poster series exploring motion-style typography. Content slot.",
  },
  {
    title: "CUT & FLOW",
    cat: "VIDEO / MOTION",
    arcana: "THE MOON",
    desc: "Short-form edit pack: rhythm cuts, color grade, SFX. Content slot.",
  },
  {
    title: "MOTION ID",
    cat: "VIDEO / MOTION",
    arcana: "THE CHARIOT",
    desc: "Animated ident / intro sting concept. Content slot.",
  },
];

export const EXPERIENCE = [
  {
    period: "2023 — PRESENT",
    title: "B.Sc. STUDENT",
    org: "Smart Electric Power Grids — Faculty of Engineering, Zagazig University",
    description: "Power systems, electronics, and energy engineering coursework, labs, and projects.",
  },
  {
    period: "ONGOING",
    title: "CREATIVE PRACTICE",
    org: "Freelance / Self-taught",
    description: "Graphic design, video editing, and vibe coding — building things that look and feel alive.",
  },
];
