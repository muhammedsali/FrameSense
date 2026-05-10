"use client";

import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function Preloader({ onDone }: { onDone: () => void }) {
  const barRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const bar = barRef.current;
    if (bar) setTimeout(() => { bar.style.width = "100%"; }, 50);
    const t = setTimeout(onDone, 1400);
    return () => clearTimeout(t);
  }, [onDone]);

  if (!mounted) return null;
  return createPortal(
    <div id="preloader">
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: "13px",
            color: "var(--fg2)",
            marginBottom: "20px",
            letterSpacing: "0.08em",
          }}
        >
          db<span style={{ color: "var(--accent)" }}>.</span>
        </div>
        <div
          style={{
            width: "120px",
            height: "2px",
            background: "var(--bg3)",
            borderRadius: "2px",
            overflow: "hidden",
          }}
        >
          <div
            ref={barRef}
            style={{
              width: 0,
              height: "2px",
              background: "var(--accent)",
              transition: "width 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
              borderRadius: "2px",
            }}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
