"use client";

import { useLang } from "@/context/LangContext";
import { DATA } from "@/data/portfolio";
import { useState } from "react";
import { Reveal, SectionLabel } from "./Primitives";

export default function ContactSection() {
  const { t } = useLang();
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(DATA.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  };

  return (
    <section
      id="contact"
      style={{
        padding: "100px 40px 160px",
        maxWidth: "calc(var(--max) + 80px)",
        margin: "0 auto",
      }}
    >
      <Reveal>
        <SectionLabel num="07">{t.secContact}</SectionLabel>

        <div
          style={{
            display: "flex",
            gap: "80px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: "1 1 320px" }}>
            <h2
              style={{
                fontSize: "clamp(28px, 5vw, 52px)",
                fontWeight: 600,
                letterSpacing: "-0.04em",
                lineHeight: 1.08,
                marginBottom: "20px",
              }}
            >
              {t.contactTitle}
              <br />
              <span style={{ color: "var(--accent)" }}>{t.contactAccent}</span>
            </h2>
            <p
              style={{
                fontSize: "15px",
                color: "var(--fg2)",
                lineHeight: 1.75,
                maxWidth: "400px",
              }}
            >
              {t.contactDesc}
            </p>
          </div>

          <div
            style={{
              flex: "1 1 260px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <ContactBtn onClick={copy} primary>
              {copied ? t.copied : DATA.email}
            </ContactBtn>
            <ContactBtn href={DATA.linkedin} external>
              LinkedIn →
            </ContactBtn>
            <ContactBtn href={DATA.github} external>
              GitHub →
            </ContactBtn>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "80px",
            paddingTop: "32px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: "12px",
              color: "var(--fg3)",
            }}
          >
            Doğanay Balaban © 2026
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <span
              style={{
                fontFamily: "var(--font-dm-mono), monospace",
                fontSize: "12px",
                color: "var(--fg3)",
              }}
            >
              İstanbul
            </span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function ContactBtn({
  href,
  children,
  primary,
  external,
  onClick,
}: {
  href?: string;
  children: React.ReactNode;
  primary?: boolean;
  external?: boolean;
  onClick?: () => void;
}) {
  const [hov, setHov] = useState(false);
  const style: React.CSSProperties = {
    display: "block",
    padding: "12px 20px",
    borderRadius: "10px",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 500,
    textAlign: "left",
    transition: "all 0.18s",
    fontFamily: "var(--font-dm-sans), sans-serif",
    border: "none",
    width: "100%",
    ...(primary
      ? { background: hov ? "#3730a3" : "var(--fg)", color: "var(--bg)" }
      : {
          background: hov ? "var(--bg3)" : "var(--bg2)",
          color: "var(--fg)",
          border: "1px solid var(--border2)",
        }),
  };

  if (onClick) {
    return (
      <button
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        onClick={onClick}
        style={style}
      >
        {children}
      </button>
    );
  }
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={style}
    >
      {children}
    </a>
  );
}
