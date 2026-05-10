"use client";

import { useState, useEffect } from "react";
import { DATA } from "@/data/portfolio";
import { useLang } from "@/context/LangContext";
import { Reveal } from "./Primitives";

interface Commit {
  repo: string;
  message: string;
  date: string;
  sha: string;
}

export default function GitHubActivity() {
  const { lang, t } = useLang();
  const [commit, setCommit] = useState<Commit | null>(null);

  useEffect(() => {
    fetch(`https://api.github.com/users/${DATA.githubUsername}/events/public`)
      .then((r) => r.json())
      .then((data: Array<{ type: string; repo: { name: string }; payload: { commits?: Array<{ message: string; sha: string }> }; created_at: string }>) => {
        const push = data.find((e) => e.type === "PushEvent");
        if (push) {
          const c = push.payload.commits?.slice(-1)[0];
          setCommit({
            repo: push.repo.name.replace(`${DATA.githubUsername}/`, ""),
            message: c?.message?.split("\n")[0] || "",
            date: new Date(push.created_at).toLocaleDateString(
              lang === "tr" ? "tr-TR" : "en-GB",
              { day: "numeric", month: "short" }
            ),
            sha: c?.sha?.slice(0, 7) || "",
          });
        }
      })
      .catch(() => {});
  }, [lang]);

  return (
    <section
      style={{
        padding: "60px 40px 0",
        maxWidth: "calc(var(--max) + 80px)",
        margin: "0 auto",
      }}
    >
      <Reveal>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            marginBottom: "20px",
            flexWrap: "wrap",
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
            GitHub — {t.ghActivity}
          </span>
          <div style={{ flex: 1, height: "1px", background: "var(--border2)" }} />
          {commit && <CommitWidget commit={commit} label={t.ghLastCommit} />}
        </div>

        <div
          style={{
            borderRadius: "var(--radius)",
            overflow: "hidden",
            border: "1px solid var(--border)",
            background: "var(--bg2)",
            padding: "20px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://ghchart.rshah.org/4f46e5/${DATA.githubUsername}`}
            alt="GitHub Activity"
            style={{ width: "100%", maxWidth: "800px", height: "auto", display: "block" }}
          />
        </div>
      </Reveal>
    </section>
  );
}

function CommitWidget({ commit, label }: { commit: Commit; label: string }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        padding: "7px 14px",
        borderRadius: "10px",
        background: "var(--bg2)",
        border: "1px solid var(--border)",
        fontSize: "12px",
        fontFamily: "var(--font-dm-mono), monospace",
        flexWrap: "nowrap",
        overflow: "hidden",
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ color: "var(--accent)", flexShrink: 0 }}>
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.54-1.38-1.33-1.74-1.33-1.74-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.48 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.13 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
      <span style={{ color: "var(--accent)" }}>{commit.repo}</span>
      <span style={{ color: "var(--fg3)" }}>·</span>
      <span
        style={{
          color: "var(--fg2)",
          maxWidth: "160px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {commit.message}
      </span>
      <span style={{ color: "var(--fg3)" }}>·</span>
      <span style={{ color: "var(--fg3)" }}>{commit.sha}</span>
      <span style={{ color: "var(--fg3)" }}>·</span>
      <span style={{ color: "var(--fg3)" }}>{commit.date}</span>
    </div>
  );
}
