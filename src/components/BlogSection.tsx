"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/context/LangContext";
import { Reveal, SectionLabel, Tag } from "./Primitives";

interface BlogPost {
  title: string;
  link: string;
  pubDate: string;
  categories: string[];
  isoDate: string;
}

export default function BlogSection() {
  const { lang, t } = useLang();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/medium")
      .then((r) => r.json())
      .then((data: BlogPost[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setPosts(data);
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString(
        lang === "tr" ? "tr-TR" : "en-GB",
        { year: "numeric", month: "long", day: "numeric" }
      );
    } catch {
      return iso;
    }
  };

  return (
    <section
      id="blog"
      style={{ padding: "100px 40px", maxWidth: "calc(var(--max) + 80px)", margin: "0 auto" }}
    >
      <Reveal>
        <SectionLabel num="06">{t.secBlog}</SectionLabel>

        {loading && (
          <div style={{ color: "var(--fg3)", fontFamily: "var(--font-dm-mono), monospace", fontSize: "13px", textAlign: "center", padding: "40px" }}>
            {t.loading}
          </div>
        )}

        {error && !loading && (
          <div style={{ padding: "32px", borderRadius: "var(--radius)", background: "var(--bg2)", border: "1px solid var(--border)", textAlign: "center" }}>
            <p style={{ fontSize: "14px", color: "var(--fg2)" }}>{t.loadFail}</p>
          </div>
        )}

        {!loading && posts.length > 0 && (
          <div style={{ borderRadius: "var(--radius)", overflow: "hidden", border: "1px solid var(--border)" }}>
            {posts.map((post, i) => (
              <BlogRow
                key={i}
                post={post}
                date={formatDate(post.isoDate || post.pubDate)}
                last={i === posts.length - 1}
              />
            ))}
          </div>
        )}
      </Reveal>
    </section>
  );
}

function BlogRow({ post, date, last }: { post: BlogPost; date: string; last: boolean }) {
  const [hov, setHov] = useState(false);
  const tag = post.categories?.[0] || "Yazı";

  return (
    <a
      href={post.link}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "18px 24px",
        background: hov ? "#fff" : "var(--bg2)",
        borderBottom: last ? "none" : "1px solid var(--border)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "16px",
        transition: "background 0.18s",
        textDecoration: "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "14px", minWidth: 0 }}>
        <Tag>{tag}</Tag>
        <span
          style={{
            fontSize: "14px",
            fontWeight: 500,
            color: hov ? "var(--fg)" : "var(--fg2)",
            transition: "color 0.18s",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {post.title}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
        <span style={{ fontSize: "11px", color: "var(--fg3)", fontFamily: "var(--font-dm-mono), monospace" }}>
          {date}
        </span>
        <svg
          width="13"
          height="13"
          viewBox="0 0 13 13"
          fill="none"
          style={{
            color: hov ? "var(--accent)" : "var(--fg3)",
            transition: "all 0.2s",
            transform: hov ? "translate(2px,-2px)" : "translate(0,0)",
          }}
        >
          <path d="M2 11L11 2M11 2H5M11 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </a>
  );
}
