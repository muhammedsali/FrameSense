"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { DATA } from "@/data/portfolio";
import { useLang } from "@/context/LangContext";
import { Reveal, SectionLabel, Tag, ExtLink } from "./Primitives";

type Project = (typeof DATA.projects)[0];
type TProject = { subtitle: string; desc: string; longDesc: string; highlights: readonly string[] };

export default function ProjectsSection() {
  const { t } = useLang();
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  return (
    <section
      id="projects"
      style={{ padding: "100px 40px", maxWidth: "calc(var(--max) + 80px)", margin: "0 auto" }}
    >
      <Reveal>
        <SectionLabel num="01">{t.secProjects}</SectionLabel>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {DATA.projects.map((p, i) => (
            <ProjectCard key={i} p={p} tProj={t.projects[i]} onClick={() => setSelectedIdx(i)} />
          ))}
        </div>
      </Reveal>
      {selectedIdx !== null && (
        <ProjectModal
          project={DATA.projects[selectedIdx]}
          tProj={t.projects[selectedIdx]}
          onClose={() => setSelectedIdx(null)}
        />
      )}
    </section>
  );
}

function ProjectCard({ p, tProj, onClick }: { p: Project; tProj: TProject; onClick: () => void }) {
  const { t } = useLang();
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "28px",
        borderRadius: "var(--radius)",
        cursor: "pointer",
        background: hov ? "#fff" : "var(--bg2)",
        border: `1px solid ${hov ? "rgba(79,70,229,0.2)" : "var(--border)"}`,
        transition: "all 0.22s ease",
        transform: hov ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hov ? "0 12px 40px rgba(26,25,22,0.08)" : "none",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {hov && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "var(--accent)" }} />
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
        <div>
          <div style={{ fontSize: "11px", fontFamily: "var(--font-dm-mono), monospace", color: "var(--fg3)", marginBottom: "4px", letterSpacing: "0.05em" }}>
            {tProj.subtitle}
          </div>
          <h3 style={{ fontSize: "15px", fontWeight: 600, letterSpacing: "-0.01em" }}>{p.title}</h3>
        </div>
        <span
          style={{
            fontSize: "10px",
            padding: "2px 8px",
            borderRadius: "20px",
            fontFamily: "var(--font-dm-mono), monospace",
            whiteSpace: "nowrap",
            flexShrink: 0,
            marginLeft: "10px",
            ...(p.status === "live"
              ? { background: "#dcfce7", color: "#166534", border: "1px solid #bbf7d0" }
              : { background: "#fef9c3", color: "#854d0e", border: "1px solid #fde68a" }),
          }}
        >
          {p.status === "live" ? t.liveSmall : t.wipSmall}
        </span>
      </div>

      <p style={{ fontSize: "13px", color: "var(--fg2)", lineHeight: 1.65, marginBottom: "20px" }}>
        {tProj.desc}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {p.tags.slice(0, 3).map((tag) => <Tag key={tag}>{tag}</Tag>)}
          {p.tags.length > 3 && <Tag>+{p.tags.length - 3}</Tag>}
        </div>
        <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
          {p.github && <ExtLink href={p.github} icon="github">GitHub</ExtLink>}
          {p.demo && <ExtLink href={p.demo}>Demo</ExtLink>}
          <span
            style={{
              fontSize: "12px",
              color: hov ? "var(--accent)" : "var(--fg3)",
              transition: "color 0.2s",
              fontFamily: "var(--font-dm-mono), monospace",
              marginLeft: "auto",
            }}
          >
            Detay →
          </span>
        </div>
      </div>
    </div>
  );
}

function ProjectModal({ project, tProj, onClose }: { project: Project; tProj: TProject; onClose: () => void }) {
  const { t } = useLang();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", fn);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!mounted) return null;
  return createPortal(
    <div className="project-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="project-modal-panel">
        {/* Header */}
        <div
          style={{
            padding: "32px 32px 24px",
            borderBottom: "1px solid var(--border)",
            position: "sticky",
            top: 0,
            background: "var(--bg)",
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: "11px", fontFamily: "var(--font-dm-mono), monospace", color: "var(--fg3)", letterSpacing: "0.1em", marginBottom: "6px" }}>
                {tProj.subtitle}
              </div>
              <h2 style={{ fontSize: "24px", fontWeight: 600, letterSpacing: "-0.03em" }}>{project.title}</h2>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "var(--bg2)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: "18px",
                color: "var(--fg2)",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg3)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--bg2)")}
            >
              ×
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "32px", flex: 1 }}>
          <div style={{ display: "flex", gap: "8px", marginBottom: "28px", flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: "11px",
                padding: "3px 10px",
                borderRadius: "20px",
                fontFamily: "var(--font-dm-mono), monospace",
                ...(project.status === "live"
                  ? { background: "#dcfce7", color: "#166534", border: "1px solid #bbf7d0" }
                  : { background: "#fef9c3", color: "#854d0e", border: "1px solid #fde68a" }),
              }}
            >
              {project.status === "live" ? t.live : t.wip}
            </span>
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer" style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "20px", fontFamily: "var(--font-dm-mono), monospace", background: "var(--accent-light)", color: "var(--accent)", border: "1px solid rgba(79,70,229,0.2)", textDecoration: "none" }}>
                Demo →
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "20px", fontFamily: "var(--font-dm-mono), monospace", background: "var(--bg2)", color: "var(--fg2)", border: "1px solid var(--border)", textDecoration: "none" }}>
                GitHub →
              </a>
            )}
          </div>

          <p style={{ fontSize: "15px", color: "var(--fg2)", lineHeight: 1.8, marginBottom: "32px" }}>
            {tProj.longDesc}
          </p>

          <div style={{ marginBottom: "32px" }}>
            <h4 style={{ fontSize: "12px", fontFamily: "var(--font-dm-mono), monospace", color: "var(--fg3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "14px" }}>
              {t.highlights}
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {tProj.highlights.map((h, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />
                  <span style={{ fontSize: "14px", color: "var(--fg)" }}>{h}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: "12px", fontFamily: "var(--font-dm-mono), monospace", color: "var(--fg3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "14px" }}>
              {t.techStack}
            </h4>
            <div style={{ display: "flex", gap: "7px", flexWrap: "wrap" }}>
              {project.tags.map((tag) => <Tag key={tag} accent>{tag}</Tag>)}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
