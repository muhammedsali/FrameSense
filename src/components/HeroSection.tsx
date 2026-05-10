"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { DATA } from "@/data/portfolio";
import { useLang } from "@/context/LangContext";
import { useTypewriter } from "@/hooks/useTypewriter";

const TECH_BADGES = [
  { label: "Next.js",    icon: "nextdotjs",   color: "000000" },
  { label: "TypeScript", icon: "typescript",  color: "3178C6" },
  { label: "Node.js",    icon: "nodedotjs",   color: "339933" },
  { label: "PostgreSQL", icon: "postgresql",  color: "4169E1" },
  { label: "Docker",     icon: "docker",      color: "2496ED" },
  { label: "Python",     icon: "python",      color: "3776AB" },
  { label: "Redis",      icon: "redis",       color: "FF4438" },
  { label: "LangChain",  icon: "langchain",   color: "1C3C3C" },
];

export default function HeroSection() {
  const { lang, t } = useLang();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(timer);
  }, []);

  const typed = useTypewriter(
    lang === "tr"
      ? ["Full Stack Developer", "LLM Entegrasyon Uzmanı", "Backend Engineer", "Next.js Geliştiricisi"]
      : ["Full Stack Developer", "LLM Integration Engineer", "Backend Engineer", "Next.js Developer"],
    70
  );

  return (
    <section
      id="about"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        padding: "100px 40px 60px",
        maxWidth: "calc(var(--max) + 80px)",
        margin: "0 auto",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "80px", width: "100%", flexWrap: "wrap" }}>
        {/* Text side */}
        <div style={{ flex: "1 1 360px", minWidth: 0 }}>
          <h1
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.6s ease 0.1s",
              fontSize: "clamp(36px, 6vw, 68px)",
              fontWeight: 600,
              lineHeight: 1.07,
              letterSpacing: "-0.04em",
              marginBottom: "14px",
              color: "var(--fg)",
            }}
          >
            {DATA.name}
          </h1>

          <div
            style={{
              opacity: mounted ? 1 : 0,
              transition: "opacity 0.6s ease 0.3s",
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: "15px",
              color: "var(--accent)",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              gap: "3px",
              height: "24px",
            }}
          >
            <span>{typed}</span>
            <span style={{ animation: "blink 1s infinite" }}>|</span>
          </div>

          <p
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(12px)",
              transition: "all 0.6s ease 0.4s",
              maxWidth: "460px",
              color: "var(--fg2)",
              fontSize: "15px",
              lineHeight: 1.75,
              marginBottom: "40px",
            }}
          >
            {t.bio}
          </p>

          <div
            style={{
              opacity: mounted ? 1 : 0,
              transition: "opacity 0.6s ease 0.55s",
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <HeroBtn href="#projects" primary>{t.heroCtaProjects}</HeroBtn>
            <CVButton />
            <HeroBtn href={DATA.github} external>GitHub</HeroBtn>
            <HeroBtn href={DATA.linkedin} external>LinkedIn</HeroBtn>
          </div>

          <div style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.6s ease 0.7s" }}>
            <TechBadges />
          </div>
        </div>

        {/* Photo */}
        <div style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.7s ease 0.3s", flexShrink: 0 }}>
          <div
            style={{
              width: "260px",
              height: "320px",
              borderRadius: "20px",
              overflow: "hidden",
              border: "1px solid var(--border2)",
              boxShadow: "0 24px 64px rgba(26,25,22,0.10)",
            }}
          >
            <Image
              src={DATA.photo}
              alt="Doğanay Balaban"
              width={260}
              height={320}
              priority
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center top",
                display: "block",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroBtn({
  href,
  children,
  primary,
  external,
}: {
  href: string;
  children: string;
  primary?: boolean;
  external?: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "10px 22px",
        borderRadius: "9px",
        textDecoration: "none",
        fontSize: "14px",
        fontWeight: 500,
        transition: "all 0.2s",
        display: "inline-block",
        ...(primary
          ? { background: hov ? "#3730a3" : "var(--fg)", color: "var(--bg)" }
          : {
              background: hov ? "var(--bg3)" : "var(--bg2)",
              color: "var(--fg)",
              border: "1px solid var(--border2)",
            }),
      }}
    >
      {children}
    </a>
  );
}

function CVButton() {
  const { t } = useLang();
  const [hov, setHov] = useState(false);
  return (
    <a
      href={DATA.cvUrl}
      download
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "10px 22px",
        borderRadius: "9px",
        textDecoration: "none",
        fontSize: "14px",
        fontWeight: 500,
        transition: "all 0.2s",
        display: "inline-flex",
        alignItems: "center",
        gap: "7px",
        background: hov ? "var(--accent-light)" : "var(--bg2)",
        color: hov ? "var(--accent)" : "var(--fg)",
        border: `1px solid ${hov ? "rgba(79,70,229,0.25)" : "var(--border2)"}`,
      }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M7 1v8M4 6l3 3 3-3M2 11h10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {t.heroCtaCV}
    </a>
  );
}

function TechBadges() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", marginTop: "20px" }}>
      {TECH_BADGES.map((b) => (
        <BadgePill key={b.label} {...b} />
      ))}
    </div>
  );
}

function BadgePill({ label, icon, color }: { label: string; icon: string; color: string }) {
  const [hov, setHov] = useState(false);
  return (
    <span
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "5px 11px",
        borderRadius: "7px",
        fontSize: "11px",
        fontFamily: "var(--font-dm-mono), monospace",
        cursor: "default",
        transition: "all 0.18s",
        background: hov ? `#${color}18` : "var(--bg3)",
        border: `1px solid ${hov ? `#${color}50` : "var(--border)"}`,
        color: hov ? `#${color}` : "var(--fg2)",
        transform: hov ? "translateY(-1px)" : "translateY(0)",
        boxShadow: hov ? `0 4px 12px #${color}20` : "none",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://cdn.simpleicons.org/${icon}/${hov ? color : "aaa89f"}`}
        alt={label}
        width={12}
        height={12}
        style={{ display: "block", flexShrink: 0 }}
        onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
      />
      {label}
    </span>
  );
}
