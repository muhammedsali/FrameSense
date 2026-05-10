"use client";

import { useLang } from "@/context/LangContext";
import { DATA } from "@/data/portfolio";
import { ExtLink, Reveal, SectionLabel, Tag } from "./Primitives";

export default function ExperienceSection() {
  const { t } = useLang();
  return (
    <section
      id="experience"
      style={{
        padding: "100px 40px",
        maxWidth: "calc(var(--max) + 80px)",
        margin: "0 auto",
      }}
    >
      <Reveal>
        <SectionLabel num="04">{t.secExp}</SectionLabel>
        <div style={{ position: "relative", paddingLeft: "24px" }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: "8px",
              bottom: "8px",
              width: "1px",
              background: "var(--border2)",
            }}
          />
          {DATA.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: "40px", position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: "-28px",
                  top: "7px",
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "var(--accent)",
                  border: "2px solid var(--bg)",
                }}
              />
              <div style={{ marginBottom: "6px" }}>
                <h3
                  style={{
                    fontSize: "17px",
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                    marginBottom: "4px",
                  }}
                >
                  {t.experience[i].role}
                </h3>
                <div
                  style={{ display: "flex", gap: "8px", alignItems: "center" }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      color: "var(--accent)",
                      fontWeight: 500,
                    }}
                  >
                    {exp.company}
                  </span>
                  <span style={{ color: "var(--fg3)", fontSize: "12px" }}>
                    ·
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "var(--fg3)",
                      fontFamily: "var(--font-dm-mono), monospace",
                    }}
                  >
                    {exp.period}
                  </span>
                </div>
              </div>
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--fg2)",
                  lineHeight: 1.7,
                  marginBottom: "14px",
                  maxWidth: "560px",
                }}
              >
                {t.experience[i].desc}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {exp.tags.map((tag) => (
                    <Tag key={tag} accent>{tag}</Tag>
                  ))}
                </div>
                {(exp.demo || exp.github) && (
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {exp.demo && <ExtLink href={exp.demo}>{t.liveDemo}</ExtLink>}
                    {exp.github && (
                      <ExtLink href={exp.github} icon="github">GitHub</ExtLink>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
