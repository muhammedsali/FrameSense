export const DATA = {
  name: "Doğanay Balaban",
  photo: "/me.jpg",
  cvUrl: "/cv.pdf",
  github: "https://github.com/DoganayBalaban",
  linkedin: "https://www.linkedin.com/in/doganay-balaban/",
  email: "balabandoganay@gmail.com",
  githubUsername: "DoganayBalaban",
  mediumUsername: "balabandoganay",
  skills: {
    Frontend:           ["React", "Next.js", "Tailwind CSS"],
    Backend:            ["Node.js", "Express", "NestJS", "PostgreSQL", "Prisma", "Redis", "BullMQ", "Socket.IO"],
    "AI / LLM":         ["LangChain", "LlamaIndex", "OpenAI API", "Claude API", "Replicate", "RAG", "Vector DB", "Agentic AI"],
    Diller:             ["TypeScript", "Python", "JavaScript"],
    "DevOps & Araçlar": ["Docker", "Railway", "Vercel", "AWS"],
    "AI Dev Tools":     ["Claude Code", "GitHub Copilot", "Cursor", "OpenAI Codex"],
  } as Record<string, string[]>,
  experience: [
    {
      company: "Kafein Teknoloji",
      period: "Haziran 2025 — Eylül 2025",
      location: "İstanbul",
      tags: ["React", "ReactFlow", "Zustand", "FastAPI", "Python", "Docker", "PostgreSQL", "Supabase"],
      github: "https://github.com/kafein-technology/KAI-Flow",
      demo: "https://www.kaiflow.io/tr/",
    },
  ],
  education: [
    {
      school: "Kırklareli Üniversitesi",
      period: "Eylül 2022 — Haziran 2026",
      gpa: "3.25 / 4.00",
    },
  ],
  projects: [
    {
      title: "Flowbill",
      tags: ["Next.js", "Node.js", "PostgreSQL", "Redis", "BullMQ", "Stripe", "Docker", "Prisma"],
      status: "live" as const,
      github: "https://github.com/DoganayBalaban/Flowbill",
      demo: "https://www.flowbill.xyz/",
    },
    {
      title: "RolyAI",
      tags: ["React Native", "Next.js", "TypeScript", "Node.js", "MongoDB", "GSAP", "Expo"],
      status: "live" as const,
      github: "https://github.com/DoganayBalaban/Roly-AI-Learn-Languages-Through-Real-Life-Roleplay",
      demo: "https://rolyai.vercel.app/",
    },
    {
      title: "Retouchly",
      tags: ["Next.js", "TypeScript", "Zustand", "Replicate", "Supabase", "Tailwind CSS"],
      status: "live" as const,
      github: "https://github.com/DoganayBalaban/Retouchly",
      demo: "https://retouchly-omega.vercel.app/",
    },
    {
      title: "RepoBrief",
      tags: ["Next.js", "TypeScript", "Claude API", "Prisma", "PostgreSQL", "NextAuth", "Octokit", "Tailwind CSS"],
      status: "live" as const,
      github: "https://github.com/DoganayBalaban/repobrief",
      demo: "https://repobrief.vercel.app/",
    },
  ],
};

export const T = {
  tr: {
    /* Nav */
    navAbout: "Hakkımda",
    navProjects: "Projeler",
    navSkills: "Yetenekler",
    navExp: "Deneyim",
    navEdu: "Eğitim",
    navBlog: "Blog",
    navContact: "İletişim",
    /* Hero */
    bio: "Üretim kalitesinde SaaS platformları, AI destekli uygulamalar ve gerçek zamanlı sistemler geliştiren Full-Stack Software Engineer. Next.js, Node.js, TypeScript ve Python ile full-stack projeler üretiyor; LLM entegrasyonları ve AI destekli araçlar üzerine çalışıyorum.",
    heroCtaProjects: "Projelerimi Gör",
    heroCtaCV: "CV İndir",
    /* Sections */
    secProjects: "Projeler",
    secSkills: "Yetenekler",
    secExp: "Deneyim",
    secEdu: "Eğitim",
    secBlog: "Blog",
    secContact: "İletişim",
    /* Contact */
    contactTitle: "Birlikte bir şeyler",
    contactAccent: "inşa edelim.",
    contactDesc: "Full-stack ya da backend pozisyonları için görüşmeye hazırım. Bir proje fikriniz ya da teklif varsa duymak isterim.",
    /* Misc */
    copied: "✓ Kopyalandı!",
    backToTop: "Yukarı",
    ghActivity: "GitHub Aktivitesi",
    ghLastCommit: "Son Commit",
    loading: "Yükleniyor...",
    loadFail: "Yüklenemedi.",
    openSource: "Açık Kaynak",
    liveDemo: "Canlı Demo",
    highlights: "Öne Çıkan Özellikler",
    techStack: "Teknoloji Stack'i",
    live: "Canlı",
    wip: "Geliştirme Aşamasında",
    liveSmall: "canlı",
    wipSmall: "yakında",
    /* Projects */
    projects: [
      {
        subtitle: "Freelancer Business Management SaaS",
        desc: "Serbest çalışanlar için Excel, Word ve WhatsApp'ın yerini alan tam kapsamlı SaaS platform. Zaman takibi, otomatik PDF fatura üretimi ve Stripe ile online ödeme.",
        longDesc: "Freelancer'ların iş süreçlerini tek platformda yönetmesini sağlayan full-stack SaaS. Tek tıkla faturalanabilir/faturalanmaz zaman takibi, VAT ve indirim destekli otomatik PDF fatura üretimi, müşteri portali ve Stripe entegrasyonu içeriyor. BullMQ workers ile async PDF pipeline, Amazon S3 depolama, Sentry monitoring, Socket.IO ile gerçek zamanlı bildirimler; Kanban tarz dnd-kit görev yönetimi ve finansal dashboard.",
        highlights: [
          "Tek tıkla zaman takibi & faturalandırma",
          "BullMQ async PDF üretim pipeline",
          "Stripe ile online ödeme & müşteri portali",
          "Kanban görev yönetimi (dnd-kit)",
          "Finansal dashboard & gelir takibi",
        ],
      },
      {
        subtitle: "AI Language Learning Assistant",
        desc: "20+ beta tester ile sesli rol yapma yöntemiyle 9 dilde dil öğrenme platformu. React Native mobil uygulama ve Next.js landing page.",
        longDesc: "STT/TTS entegrasyonu ile sesli rol yapma senaryoları üzerinden 9 dilde dil öğrenmeyi destekleyen AI platformu. React Native (Expo) ve TypeScript ile cross-platform mobil uygulama, Next.js + GSAP + Tailwind CSS ile yüksek performanslı landing page geliştirildi. Google Play Console beta yayını yönetildi; Next.js Server Actions ve Resend ile sunucu taraflı waitlist sistemi kuruldu.",
        highlights: [
          "9 dilde sesli rol yapma senaryoları",
          "STT / TTS AI entegrasyonu",
          "React Native cross-platform mobil uygulama",
          "Google Play Console beta yönetimi",
          "Sunucu taraflı waitlist sistemi",
        ],
      },
      {
        subtitle: "AI Image Editing Platform",
        desc: "15+ kullanıcıya hizmet eden, 100+ işlenmiş görsel ile AI destekli görsel düzenleme SaaS. Arka plan kaldırma, üretim ve iyileştirme.",
        longDesc: "Kullanıcıların görsellerini AI ile düzenleyebildiği, arka plan kaldırma, görsel üretme ve iyileştirme özelliklerine sahip SaaS platformu. Replicate API ile görüntü işleme, Supabase ile backend, kullanıcı yönetimi ve depolama. Next.js, TypeScript, Zustand ve Tailwind CSS ile yüksek Lighthouse skorlu mobil optimize arayüz.",
        highlights: [
          "Replicate API ile AI görüntü işleme",
          "Arka plan kaldırma & görsel üretimi",
          "15+ kullanıcı, 100+ işlenmiş görsel",
          "Yüksek Lighthouse skorlu mobil arayüz",
        ],
      },
      {
        subtitle: "AI GitHub Repo Analiz Aracı",
        desc: "Claude AI ile herhangi bir GitHub reposunu saniyeler içinde analiz eden SaaS. Mimari diyagram, dosya haritası, onboarding rehberi ve tech stack rozetleri canlı akışla sunuluyor.",
        longDesc: "Claude AI kullanarak GitHub repolarını otomatik olarak analiz eden full-stack SaaS platformu. GitHub OAuth ile giriş, Octokit ile repo dosyalarını puanlayıp en kritik ~15 dosyayı Claude'a gönderiyor. Sonuçlar commit SHA bazlı Neon Postgres önbelleğinde 7 gün tutuluyor; aynı commit = anında sonuç. Her analiz kalıcı bir URL ile paylaşılabilir ve görüntülenme sayısı takip ediliyor. Aylık 5 analiz kotası, 429 ile açık hata mesajı ve kota dashboard widget'i.",
        highlights: [
          "Claude AI ile canlı akışlı repo analizi",
          "Commit SHA bazlı Postgres önbellekleme (7 gün TTL)",
          "Mermaid mimari diyagramı otomatik render",
          "Kalıcı paylaşılabilir analiz linkleri & görüntülenme sayacı",
          "Aylık kota sistemi & rate limiting",
        ],
      },
    ],
    /* Experience */
    experience: [
      {
        role: "Full-Stack Developer Intern",
        desc: "4 kişilik agile ekipte drag-and-drop görsel workflow builder mimarisi kurdum; 255 commit ve 143K+ satır kod katkısı sağladım. Server-Sent Events (SSE) ile gerçek zamanlı workflow takibi, React.memo/lazy loading ile frontend performans optimizasyonu ve Dockerized PostgreSQL backend geliştirdim.",
      },
    ],
    /* Education */
    education: [
      {
        dept: "Yazılım Mühendisliği — B.Sc.",
        note: "Son sınıf öğrencisi",
      },
    ],
  },
  en: {
    /* Nav */
    navAbout: "About",
    navProjects: "Projects",
    navSkills: "Skills",
    navExp: "Experience",
    navEdu: "Education",
    navBlog: "Blog",
    navContact: "Contact",
    /* Hero */
    bio: "Full-Stack Software Engineer building production-grade SaaS platforms, AI-powered applications, and real-time systems. Working with Next.js, Node.js, TypeScript, and Python; focused on LLM integrations and AI-driven tooling.",
    heroCtaProjects: "View Projects",
    heroCtaCV: "Download CV",
    /* Sections */
    secProjects: "Projects",
    secSkills: "Skills",
    secExp: "Experience",
    secEdu: "Education",
    secBlog: "Blog",
    secContact: "Contact",
    /* Contact */
    contactTitle: "Let's build something",
    contactAccent: "together.",
    contactDesc: "I'm open to full-stack or backend roles. If you have a project idea or an offer, I'd love to hear it.",
    /* Misc */
    copied: "✓ Copied!",
    backToTop: "Top",
    ghActivity: "GitHub Activity",
    ghLastCommit: "Latest Commit",
    loading: "Loading...",
    loadFail: "Could not load.",
    openSource: "Open Source",
    liveDemo: "Live Demo",
    highlights: "Highlights",
    techStack: "Tech Stack",
    live: "Live",
    wip: "In Development",
    liveSmall: "live",
    wipSmall: "soon",
    /* Projects */
    projects: [
      {
        subtitle: "Freelancer Business Management SaaS",
        desc: "A full-featured SaaS platform replacing Excel, Word, and WhatsApp for freelancers. Time tracking, automatic PDF invoice generation, and online payments via Stripe.",
        longDesc: "A full-stack SaaS enabling freelancers to manage their entire business in one place. Includes one-click billable/non-billable time tracking, VAT & discount-aware PDF invoice generation, a client portal, and Stripe integration. Features a BullMQ async PDF pipeline, Amazon S3 storage, Sentry monitoring, real-time notifications via Socket.IO, Kanban-style task management with dnd-kit, and a financial dashboard.",
        highlights: [
          "One-click time tracking & invoicing",
          "BullMQ async PDF generation pipeline",
          "Stripe online payments & client portal",
          "Kanban task management (dnd-kit)",
          "Financial dashboard & revenue tracking",
        ],
      },
      {
        subtitle: "AI Language Learning Assistant",
        desc: "A language learning platform for 9 languages via voice role-play, with 20+ beta testers. React Native mobile app and Next.js landing page.",
        longDesc: "An AI platform supporting language learning in 9 languages through voice role-play scenarios with STT/TTS integration. Built a cross-platform mobile app with React Native (Expo) and TypeScript, and a high-performance landing page with Next.js + GSAP + Tailwind CSS. Managed Google Play Console beta publishing and built a server-side waitlist system using Next.js Server Actions and Resend.",
        highlights: [
          "Voice role-play scenarios in 9 languages",
          "STT / TTS AI integration",
          "React Native cross-platform mobile app",
          "Google Play Console beta management",
          "Server-side waitlist system",
        ],
      },
      {
        subtitle: "AI Image Editing Platform",
        desc: "An AI-powered image editing SaaS serving 15+ users with 100+ processed images. Background removal, generation, and enhancement.",
        longDesc: "A SaaS platform where users can edit images with AI — featuring background removal, image generation, and enhancement. Powered by the Replicate API for image processing and Supabase for backend, user management, and storage. Built with Next.js, TypeScript, Zustand, and Tailwind CSS, achieving a high Lighthouse score with a mobile-optimized UI.",
        highlights: [
          "AI image processing via Replicate API",
          "Background removal & image generation",
          "15+ users, 100+ processed images",
          "High Lighthouse score, mobile-optimized UI",
        ],
      },
      {
        subtitle: "AI GitHub Repository Analysis Tool",
        desc: "A SaaS that analyzes any GitHub repository in seconds using Claude AI — architecture diagram, file map, onboarding guide, and tech stack badges streamed live.",
        longDesc: "A full-stack SaaS platform that automatically analyzes GitHub repositories using Claude AI. Signs in via GitHub OAuth, scores and selects the top ~15 key files with Octokit, then streams a structured analysis with Mermaid architecture diagram, file map, onboarding guide, and tech stack badges. Results are commit-SHA cached in Neon Postgres for 7 days — same commit = instant response. Every analysis gets a permanent shareable URL with a view counter. Free plan: 5 analyses/month with quota dashboard and 429 rate limiting.",
        highlights: [
          "Live-streamed repo analysis powered by Claude AI",
          "Commit SHA-based Postgres cache (7-day TTL, instant HIT)",
          "Auto-rendered Mermaid architecture diagram",
          "Permanent shareable analysis links with view counter",
          "Monthly quota system & rate limiting",
        ],
      },
    ],
    /* Experience */
    experience: [
      {
        role: "Full-Stack Developer Intern",
        desc: "Architected a drag-and-drop visual workflow builder in a 4-person agile team, contributing 255 commits and 143K+ lines of code. Built real-time workflow tracking with Server-Sent Events (SSE), optimized frontend performance with React.memo and lazy loading, and developed a Dockerized PostgreSQL backend.",
      },
    ],
    /* Education */
    education: [
      {
        dept: "Software Engineering — B.Sc.",
        note: "Final year student",
      },
    ],
  },
} as const;

export type Lang = keyof typeof T;
export type Translations = (typeof T)[Lang];

export const SEARCH_INDEX = [
  ...DATA.projects.map((p) => ({
    type: "project" as const,
    label: p.title,
    sub: T.tr.projects[DATA.projects.indexOf(p)].subtitle,
    href: "#projects",
  })),
  ...Object.entries(DATA.skills).flatMap(([cat, items]) =>
    items.map((s) => ({
      type: "skill" as const,
      label: s,
      sub: cat,
      href: "#skills",
    }))
  ),
  { type: "page" as const, label: "Hakkımda / About", href: "#about" },
  { type: "page" as const, label: "Deneyim / Experience", href: "#experience" },
  { type: "page" as const, label: "Eğitim / Education", href: "#education" },
  { type: "page" as const, label: "İletişim / Contact", href: "#contact" },
  { type: "page" as const, label: "Blog", href: "#blog" },
];
