"use client";

import { useState } from "react";
import { DATA } from "@/data/portfolio";
import { useLang } from "@/context/LangContext";
import { Reveal, SectionLabel } from "./Primitives";

export default function SkillsSection() {
  const { t } = useLang();
  return (
    <section
      id="skills"
      style={{ padding: "100px 40px", maxWidth: "calc(var(--max) + 80px)", margin: "0 auto" }}
    >
      <Reveal>
        <SectionLabel num="03">{t.secSkills}</SectionLabel>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
            gap: "16px",
          }}
        >
          {Object.entries(DATA.skills).map(([cat, items]) => (
            <div
              key={cat}
              style={{
                padding: "24px",
                borderRadius: "var(--radius)",
                background: "var(--bg2)",
                border: "1px solid var(--border)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />
                <span style={{ fontSize: "11px", fontFamily: "var(--font-dm-mono), monospace", color: "var(--accent)", letterSpacing: "0.08em" }}>
                  {cat}
                </span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {items.map((skill) => (
                  <SkillBadge key={skill}>{skill}</SkillBadge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function SkillBadge({ children }: { children: string }) {
  const [hov, setHov] = useState(false);
  return (
    <span
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-block",
        padding: "4px 11px",
        borderRadius: "7px",
        fontSize: "12px",
        fontFamily: "var(--font-dm-mono), monospace",
        cursor: "default",
        background: hov ? "var(--accent-light)" : "var(--bg)",
        border: `1px solid ${hov ? "rgba(79,70,229,0.25)" : "var(--border)"}`,
        color: hov ? "var(--accent)" : "var(--fg2)",
        transition: "all 0.16s ease",
        transform: hov ? "translateY(-1px)" : "translateY(0)",
      }}
    >
      {children}
    </span>
  );
}
