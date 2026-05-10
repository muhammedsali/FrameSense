"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { SEARCH_INDEX } from "@/data/portfolio";

const TYPE_COLOR = { project: "#4f46e5", skill: "#059669", page: "#d97706" };
const TYPE_LABEL = { project: "Proje", skill: "Yetenek", page: "Sayfa" };

export default function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 50);
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => { clearTimeout(timer); window.removeEventListener("keydown", fn); };
  }, [onClose]);

  const results =
    q.trim().length > 0
      ? SEARCH_INDEX.filter(
          (i) =>
            i.label.toLowerCase().includes(q.toLowerCase()) ||
            ("sub" in i && i.sub?.toLowerCase().includes(q.toLowerCase()))
        )
      : SEARCH_INDEX.slice(0, 6);

  if (!mounted) return null;
  return createPortal(
    <div
      id="search-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          width: "min(600px, 90vw)",
          background: "var(--bg)",
          border: "1px solid var(--border2)",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 24px 80px rgba(26,25,22,0.2)",
          animation: "modalIn 0.25s ease",
        }}
      >
        {/* Input */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "16px 20px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: "var(--fg3)", flexShrink: 0 }}>
            <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Proje, yetenek veya bölüm ara..."
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "15px",
              color: "var(--fg)",
              fontFamily: "var(--font-dm-sans), sans-serif",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: "11px",
              color: "var(--fg3)",
              padding: "2px 7px",
              border: "1px solid var(--border)",
              borderRadius: "5px",
            }}
          >
            ESC
          </span>
        </div>

        {/* Results */}
        <div style={{ maxHeight: "360px", overflowY: "auto" }}>
          {results.length === 0 && (
            <div
              style={{
                padding: "32px",
                textAlign: "center",
                color: "var(--fg3)",
                fontSize: "13px",
                fontFamily: "var(--font-dm-mono), monospace",
              }}
            >
              Sonuç bulunamadı
            </div>
          )}
          {results.map((r, i) => (
            <a
              key={i}
              href={r.href}
              onClick={onClose}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "12px 20px",
                textDecoration: "none",
                borderBottom: "1px solid var(--border)",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg2)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span
                style={{
                  fontSize: "10px",
                  padding: "2px 8px",
                  borderRadius: "5px",
                  fontFamily: "var(--font-dm-mono), monospace",
                  background: TYPE_COLOR[r.type] + "15",
                  color: TYPE_COLOR[r.type],
                  border: `1px solid ${TYPE_COLOR[r.type]}30`,
                  flexShrink: 0,
                }}
              >
                {TYPE_LABEL[r.type]}
              </span>
              <div>
                <div style={{ fontSize: "14px", color: "var(--fg)", fontWeight: 500 }}>{r.label}</div>
                {"sub" in r && r.sub && (
                  <div style={{ fontSize: "11px", color: "var(--fg3)", fontFamily: "var(--font-dm-mono), monospace" }}>
                    {r.sub}
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>

        {/* Footer hints */}
        <div
          style={{
            padding: "10px 20px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            gap: "16px",
          }}
        >
          {["↑↓ gezin", "↵ git", "ESC kapat"].map((hint) => (
            <span
              key={hint}
              style={{
                fontSize: "11px",
                color: "var(--fg3)",
                fontFamily: "var(--font-dm-mono), monospace",
              }}
            >
              {hint}
            </span>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
