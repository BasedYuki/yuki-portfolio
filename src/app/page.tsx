"use client";

import SmoothNav from "@/components/SmoothNav";
import {
  Sections,
} from "@/components/Sections";

export default function Page() {
  return (
    <div className="relative">
      <SmoothNav />
      <main className="thin-scroll">
        <Sections section="home" />
        <Sections section="about" />
        <Sections section="projects" />
        <Sections section="skills" />
        <Sections section="experience" />
        <Sections section="contact" />
      </main>
    </div>
  );
}
