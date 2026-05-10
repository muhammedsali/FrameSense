"use client";

import { useLang } from "@/context/LangContext";
import type { Lang } from "@/data/portfolio";
import { DATA } from "@/data/portfolio";
import { useEffect, useState } from "react";

export default function Navigation({ onSearch }: { onSearch: () => void }) {
  const { lang, setLang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const links: [string, string][] = [
    [t.navAbout, "#about"],
    [t.navProjects, "#projects"],
    [t.navSkills, "#skills"],
    [t.navExp, "#experience"],
    [t.navEdu, "#education"],
    [t.navBlog, "#blog"],
  ];

  return (
    <>
      <style>{`
        .nav-desktop { display: flex; }
        .nav-hamburger { display: none; }
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>

      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "0 40px",
          height: "58px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background:
            scrolled || menuOpen ? "rgba(249,248,246,0.96)" : "transparent",
          backdropFilter: scrolled || menuOpen ? "blur(16px)" : "none",
          borderBottom:
            scrolled || menuOpen
              ? "1px solid var(--border)"
              : "1px solid transparent",
          transition: "all 0.3s ease",
        }}
      >
        <a
          href="#"
          style={{
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: "13px",
            color: "var(--fg)",
            textDecoration: "none",
            fontWeight: 500,
            zIndex: 110,
          }}
        >
          db<span style={{ color: "var(--accent)" }}>.</span>
        </a>

        {/* Desktop nav */}
        <div
          className="nav-desktop"
          style={{ gap: "24px", alignItems: "center" }}
        >
          {links.map(([label, href]) => (
            <NavLink key={href} href={href}>
              {label}
            </NavLink>
          ))}

          <button
            onClick={onSearch}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "5px 12px",
              borderRadius: "7px",
              border: "1px solid var(--border2)",
              background: "transparent",
              color: "var(--fg3)",
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: "11px",
              cursor: "pointer",
              transition: "all 0.18s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--bg2)";
              e.currentTarget.style.color = "var(--fg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--fg3)";
            }}
          >
            <SearchIcon />
          </button>

          <a
            href={`mailto:${DATA.email}`}
            style={{
              padding: "6px 16px",
              borderRadius: "8px",
              fontSize: "13px",
              textDecoration: "none",
              background: "var(--fg)",
              color: "var(--bg)",
              fontWeight: 500,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.82")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            {t.navContact}
          </a>

          <button
            onClick={() => setLang((lang === "tr" ? "en" : "tr") as Lang)}
            style={{
              padding: "5px 12px",
              borderRadius: "7px",
              border: "1px solid var(--border2)",
              background: "transparent",
              color: "var(--fg2)",
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: "11px",
              letterSpacing: "0.06em",
              cursor: "pointer",
              transition: "all 0.18s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--bg2)";
              e.currentTarget.style.color = "var(--fg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--fg2)";
            }}
          >
            {lang === "tr" ? "EN" : "TR"}
          </button>
        </div>

        {/* Mobile hamburger */}
        <div
          className="nav-hamburger"
          style={{ alignItems: "center", gap: "12px", zIndex: 110 }}
        >
          <button
            onClick={onSearch}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "6px",
              borderRadius: "7px",
              border: "none",
              background: "transparent",
              color: "var(--fg3)",
              cursor: "pointer",
            }}
          >
            <SearchIcon />
          </button>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "36px",
              height: "36px",
              gap: "5px",
              borderRadius: "8px",
              border: "1px solid var(--border2)",
              background: "transparent",
              cursor: "pointer",
              padding: "0",
            }}
          >
            <span
              style={{
                display: "block",
                width: "16px",
                height: "1.5px",
                background: "var(--fg)",
                borderRadius: "2px",
                transition: "transform 0.25s ease, opacity 0.25s ease",
                transform: menuOpen
                  ? "translateY(6.5px) rotate(45deg)"
                  : "none",
              }}
            />
            <span
              style={{
                display: "block",
                width: "16px",
                height: "1.5px",
                background: "var(--fg)",
                borderRadius: "2px",
                transition: "opacity 0.25s ease",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                display: "block",
                width: "16px",
                height: "1.5px",
                background: "var(--fg)",
                borderRadius: "2px",
                transition: "transform 0.25s ease, opacity 0.25s ease",
                transform: menuOpen
                  ? "translateY(-6.5px) rotate(-45deg)"
                  : "none",
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu drawer */}
      <div
        style={{
          position: "fixed",
          top: "58px",
          left: 0,
          right: 0,
          zIndex: 99,
          background: "rgba(249,248,246,0.97)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border)",
          padding: menuOpen ? "24px 40px 32px" : "0 40px",
          display: "flex",
          flexDirection: "column",
          gap: "0",
          overflow: "hidden",
          maxHeight: menuOpen ? "600px" : "0",
          opacity: menuOpen ? 1 : 0,
          transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease, padding 0.3s ease",
          pointerEvents: menuOpen ? "auto" : "none",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            marginBottom: "24px",
          }}
        >
          {links.map(([label, href], i) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontSize: "22px",
                fontWeight: 500,
                color: "var(--fg)",
                textDecoration: "none",
                padding: "10px 0",
                borderBottom: "1px solid var(--border)",
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateX(0)" : "translateX(-12px)",
                transition: `opacity 0.3s ease ${i * 0.04}s, transform 0.3s ease ${i * 0.04}s`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {label}
              <span style={{ color: "var(--accent)", fontSize: "18px" }}>→</span>
            </a>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            opacity: menuOpen ? 1 : 0,
            transform: menuOpen ? "translateY(0)" : "translateY(8px)",
            transition: `opacity 0.3s ease ${links.length * 0.04 + 0.05}s, transform 0.3s ease ${links.length * 0.04 + 0.05}s`,
          }}
        >
          <a
            href={`mailto:${DATA.email}`}
            onClick={() => setMenuOpen(false)}
            style={{
              flex: 1,
              textAlign: "center",
              padding: "10px 16px",
              borderRadius: "10px",
              fontSize: "13px",
              textDecoration: "none",
              background: "var(--fg)",
              color: "var(--bg)",
              fontWeight: 500,
            }}
          >
            {t.navContact}
          </a>

          <button
            onClick={() => {
              setLang((lang === "tr" ? "en" : "tr") as Lang);
            }}
            style={{
              padding: "10px 20px",
              borderRadius: "10px",
              border: "1px solid var(--border2)",
              background: "transparent",
              color: "var(--fg2)",
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: "12px",
              letterSpacing: "0.06em",
              cursor: "pointer",
            }}
          >
            {lang === "tr" ? "EN" : "TR"}
          </button>
        </div>
      </div>

      {/* Backdrop */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 98,
            background: "rgba(0,0,0,0.15)",
          }}
        />
      )}
    </>
  );
}

function SearchIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M9.5 9.5L13 13"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function NavLink({ href, children }: { href: string; children: string }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontSize: "13px",
        color: hov ? "var(--fg)" : "var(--fg2)",
        textDecoration: "none",
        transition: "color 0.18s",
      }}
    >
      {children}
    </a>
  );
}
