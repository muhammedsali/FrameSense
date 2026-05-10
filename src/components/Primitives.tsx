"use client";

import { useState } from "react";
import { useInView } from "@/hooks/useInView";

export function Reveal({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.55s ease ${delay}s, transform 0.55s ease ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function SectionLabel({
  num,
  children,
}: {
  num: string;
  children: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        marginBottom: "52px",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-dm-mono), monospace",
          fontSize: "11px",
          color: "var(--accent)",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}
      >
        {num} — {children}
      </span>
      <div
        style={{ flex: 1, height: "1px", background: "var(--border2)" }}
      />
    </div>
  );
}

export function Tag({
  children,
  accent,
}: {
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: "6px",
        fontSize: "11px",
        fontFamily: "var(--font-dm-mono), monospace",
        fontWeight: 500,
        background: accent ? "var(--accent-light)" : "var(--bg3)",
        color: accent ? "var(--accent)" : "var(--fg2)",
        border: `1px solid ${accent ? "rgba(79,70,229,0.18)" : "var(--border)"}`,
      }}
    >
      {children}
    </span>
  );
}

export function ExtLink({
  href,
  children,
  icon,
}: {
  href: string;
  children: string;
  icon?: "github";
}) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "3px 10px",
        borderRadius: "6px",
        textDecoration: "none",
        fontSize: "12px",
        fontFamily: "var(--font-dm-mono), monospace",
        background: hov ? "var(--accent-light)" : "var(--bg3)",
        color: hov ? "var(--accent)" : "var(--fg2)",
        border: `1px solid ${hov ? "rgba(79,70,229,0.25)" : "var(--border)"}`,
        transition: "all 0.16s",
      }}
    >
      {icon === "github" ? (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.54-1.38-1.33-1.74-1.33-1.74-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.48 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.13 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
        </svg>
      ) : (
        <svg width="11" height="11" viewBox="0 0 13 13" fill="none">
          <path
            d="M2 11L11 2M11 2H5M11 2V8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {children}
    </a>
  );
}
