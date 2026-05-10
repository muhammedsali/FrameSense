"use client";

import { useState, useEffect } from "react";
import { DATA } from "@/data/portfolio";
import { useLang } from "@/context/LangContext";
import { Reveal, SectionLabel } from "./Primitives";

interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
}

const LANG_COLOR: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
};

export default function OpenSourceSection() {
  const { t } = useLang();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `https://api.github.com/users/${DATA.githubUsername}/repos?sort=updated&per_page=6&type=public`
    )
      .then((r) => r.json())
      .then((data: Repo[]) => {
        if (Array.isArray(data)) {
          setRepos(data.filter((r) => !r.fork).slice(0, 6));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (!loading && repos.length === 0) return null;

  return (
    <section
      id="opensource"
      style={{ padding: "100px 40px", maxWidth: "calc(var(--max) + 80px)", margin: "0 auto" }}
    >
      <Reveal>
        <SectionLabel num="02">{t.openSource}</SectionLabel>
        {loading ? (
          <div style={{ color: "var(--fg3)", fontFamily: "var(--font-dm-mono), monospace", fontSize: "13px" }}>
            {t.loading}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "12px",
            }}
          >
            {repos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        )}
      </Reveal>
    </section>
  );
}

function RepoCard({ repo }: { repo: Repo }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "block",
        padding: "20px",
        borderRadius: "12px",
        textDecoration: "none",
        background: hov ? "#fff" : "var(--bg2)",
        border: `1px solid ${hov ? "rgba(79,70,229,0.2)" : "var(--border)"}`,
        transition: "all 0.2s",
        transform: hov ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hov ? "0 8px 24px rgba(26,25,22,0.07)" : "none",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {hov && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "var(--accent)" }} />
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
        <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--fg)", letterSpacing: "-0.01em" }}>
          {repo.name}
        </span>
        <svg
          width="13"
          height="13"
          viewBox="0 0 13 13"
          fill="none"
          style={{
            color: hov ? "var(--accent)" : "var(--fg3)",
            transition: "all 0.18s",
            flexShrink: 0,
            marginLeft: "8px",
            transform: hov ? "translate(2px,-2px)" : "none",
          }}
        >
          <path d="M2 11L11 2M11 2H5M11 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {repo.description && (
        <p style={{ fontSize: "12px", color: "var(--fg2)", lineHeight: 1.6, marginBottom: "14px" }}>
          {repo.description}
        </p>
      )}

      <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
        {repo.language && (
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: LANG_COLOR[repo.language] || "var(--fg3)",
              }}
            />
            <span style={{ fontSize: "11px", color: "var(--fg3)", fontFamily: "var(--font-dm-mono), monospace" }}>
              {repo.language}
            </span>
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--fg3)" }}>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span style={{ fontSize: "11px", color: "var(--fg3)", fontFamily: "var(--font-dm-mono), monospace" }}>
            {repo.stargazers_count}
          </span>
        </div>
      </div>
    </a>
  );
}
