"use client";

import { DATA } from "@/data/portfolio";
import { useLang } from "@/context/LangContext";
import { Reveal, SectionLabel } from "./Primitives";

export default function EducationSection() {
  const { t } = useLang();
  return (
    <section
      id="education"
      style={{ padding: "100px 40px", maxWidth: "calc(var(--max) + 80px)", margin: "0 auto" }}
    >
      <Reveal>
        <SectionLabel num="05">{t.secEdu}</SectionLabel>
        {DATA.education.map((edu, i) => (
          <div
            key={i}
            style={{
              padding: "28px 32px",
              borderRadius: "var(--radius)",
              background: "var(--bg2)",
              border: "1px solid var(--border)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <h3 style={{ fontSize: "17px", fontWeight: 600, marginBottom: "4px" }}>{edu.school}</h3>
              <p style={{ fontSize: "13px", color: "var(--accent)", fontWeight: 500, marginBottom: "6px" }}>
                {t.education[i].dept}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <p style={{ fontSize: "12px", color: "var(--fg3)" }}>{t.education[i].note}</p>
                {edu.gpa && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      fontSize: "12px",
                      fontFamily: "var(--font-dm-mono), monospace",
                      padding: "2px 9px",
                      borderRadius: "6px",
                      background: "var(--accent-light)",
                      color: "var(--accent)",
                      border: "1px solid rgba(79,70,229,0.18)",
                      width: "fit-content",
                    }}
                  >
                    GPA {edu.gpa}
                  </span>
                )}
              </div>
            </div>
            <span
              style={{
                fontFamily: "var(--font-dm-mono), monospace",
                fontSize: "12px",
                color: "var(--fg3)",
              }}
            >
              {edu.period}
            </span>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
