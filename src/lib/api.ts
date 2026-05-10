import Parser from "rss-parser";

// GitHub API Types
export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
}

// Medium RSS Types
export interface MediumPost {
  title: string;
  link: string;
  pubDate: string;
  content: string;
  contentSnippet: string;
  guid: string;
  categories: string[];
  isoDate: string;
}

// GitHub API fonksiyonu
export async function fetchGitHubRepos(
  username: string
): Promise<GitHubRepo[]> {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=10`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
        // Cache for 5 minutes
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos: GitHubRepo[] = await response.json();

    // Fork olmayan ve public olan repoları filtrele
    return repos
      .filter((repo) => !repo.name.includes(".github.io") && repo.description) // README repo'ları ve açıklama olmayan repoları filtrele
      .slice(0, 6); // İlk 6 repo
  } catch (error) {
    console.error("Error fetching GitHub repos:", error);
    return [];
  }
}

// Medium RSS fonksiyonu
export async function fetchMediumPosts(): Promise<MediumPost[]> {
  try {
    const response = await fetch("/api/medium", {
      cache: "no-store", // Her zaman fresh data al
    });

    if (!response.ok) {
      throw new Error(`Medium API error: ${response.status}`);
    }

    const posts: MediumPost[] = await response.json();
    return posts;
  } catch (error) {
    console.error("Error fetching Medium posts:", error);
    return [];
  }
}

// Teknoloji renklerini belirlemek için yardımcı fonksiyon
export function getTechColor(tech: string): string {
  const colors: { [key: string]: string } = {
    JavaScript: "from-yellow-400 to-yellow-600",
    TypeScript: "from-blue-400 to-blue-600",
    React: "from-cyan-400 to-cyan-600",
    "Next.js": "from-gray-700 to-gray-900",
    "Node.js": "from-green-400 to-green-600",
    Python: "from-blue-500 to-yellow-500",
    Java: "from-red-400 to-red-600",
    Go: "from-cyan-400 to-blue-500",
    Rust: "from-orange-400 to-red-500",
    Vue: "from-green-400 to-green-600",
    Angular: "from-red-500 to-red-700",
    Svelte: "from-orange-400 to-red-500",
    PHP: "from-purple-400 to-purple-600",
    "C++": "from-blue-500 to-purple-600",
    "C#": "from-purple-500 to-purple-700",
    Swift: "from-orange-400 to-red-500",
    Kotlin: "from-purple-400 to-pink-500",
    Dart: "from-blue-400 to-cyan-500",
    HTML: "from-orange-400 to-red-500",
    CSS: "from-blue-400 to-blue-600",
    SCSS: "from-pink-400 to-pink-600",
  };

  return colors[tech] || "from-gray-400 to-gray-600";
}

// Metin özetleme fonksiyonu
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

// HTML'den metin çıkarma fonksiyonu
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&[^;]+;/g, " ")
    .trim();
}
