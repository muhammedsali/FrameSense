"use client";

import { useState, useEffect, useCallback } from "react";
import { LangContext } from "@/context/LangContext";
import { T } from "@/data/portfolio";
import type { Lang } from "@/data/portfolio";

import GlobalEffects from "./GlobalEffects";
import Preloader from "./Preloader";
import Navigation from "./Navigation";
import HeroSection from "./HeroSection";
import GitHubActivity from "./GitHubActivity";
import ProjectsSection from "./ProjectsSection";
import OpenSourceSection from "./OpenSourceSection";
import SkillsSection from "./SkillsSection";
import ExperienceSection from "./ExperienceSection";
import EducationSection from "./EducationSection";
import BlogSection from "./BlogSection";
import ContactSection from "./ContactSection";
import BackToTop from "./BackToTop";
import SearchOverlay from "./SearchOverlay";

export default function Portfolio() {
  const [lang, setLang] = useState<Lang>("tr");
  const [preloading, setPreloading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);

  // Cmd/Ctrl+K shortcut
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearch((s) => !s);
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  const handlePreloaderDone = useCallback(() => {
    const el = document.getElementById("preloader");
    if (el) el.classList.add("hidden");
    setTimeout(() => setPreloading(false), 500);
  }, []);

  const t = T[lang];

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {preloading && <Preloader onDone={handlePreloaderDone} />}
      <GlobalEffects />
      <Navigation onSearch={() => setShowSearch(true)} />
      <HeroSection />
      <GitHubActivity />
      <ProjectsSection />
      <OpenSourceSection />
      <SkillsSection />
      <ExperienceSection />
      <EducationSection />
      <BlogSection />
      <ContactSection />
      <BackToTop />
      {showSearch && <SearchOverlay onClose={() => setShowSearch(false)} />}
    </LangContext.Provider>
  );
}
