import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Resource {
  title: string;
  description: string;
  url: string;
  type: "video" | "playlist" | "docs" | "course" | "article";
  duration?: string;
  author?: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  free: boolean;
}

interface Category {
  id: string;
  label: string;
  icon: string;
  description: string;
  resources: Resource[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const CATEGORIES: Category[] = [
  {
    id: "web",
    label: "Web Development",
    icon: "fa-globe",
    description: "HTML, CSS, JavaScript, React — everything to build for the browser.",
    resources: [
      {
        title: "The Odin Project",
        description: "A free, open-source, full-stack curriculum. Best structured path to become a web developer.",
        url: "https://www.theodinproject.com",
        type: "course",
        author: "The Odin Project",
        level: "Beginner",
        free: true,
      },
      {
        title: "JavaScript Full Course – freeCodeCamp",
        description: "8-hour comprehensive JavaScript crash course from complete beginner to advanced topics.",
        url: "https://www.youtube.com/watch?v=jS4aFq5-91M",
        type: "video",
        duration: "8h",
        author: "freeCodeCamp",
        level: "Beginner",
        free: true,
      },
      {
        title: "React Official Docs",
        description: "The official interactive documentation. Best way to learn React from the source.",
        url: "https://react.dev/learn",
        type: "docs",
        author: "Meta / React Team",
        level: "Intermediate",
        free: true,
      },
      {
        title: "CSS – Kevin Powell",
        description: "The go-to YouTube channel for mastering CSS. Clear, practical, and comprehensive.",
        url: "https://www.youtube.com/@KevinPowell",
        type: "playlist",
        author: "Kevin Powell",
        level: "Beginner",
        free: true,
      },
      {
        title: "Tailwind CSS Crash Course",
        description: "Get productive with Tailwind in under an hour. Great for styling React apps quickly.",
        url: "https://www.youtube.com/watch?v=UBOj6rqRUME",
        type: "video",
        duration: "1h",
        author: "Traversy Media",
        level: "Beginner",
        free: true,
      },
    ],
  },
  {
    id: "programming",
    label: "Programming Basics",
    icon: "fa-code",
    description: "Core concepts every developer needs — logic, problem-solving, and data structures.",
    resources: [
      {
        title: "CS50 – Introduction to Computer Science",
        description: "Harvard's legendary intro CS course. Covers C, Python, SQL, and web. Absolutely free.",
        url: "https://cs50.harvard.edu/x/",
        type: "course",
        author: "Harvard / David Malan",
        level: "Beginner",
        free: true,
      },
      {
        title: "Python for Beginners – freeCodeCamp",
        description: "4-hour beginner-friendly Python course. Perfect first language for new coders.",
        url: "https://www.youtube.com/watch?v=rfscVS0vtbw",
        type: "video",
        duration: "4.5h",
        author: "freeCodeCamp",
        level: "Beginner",
        free: true,
      },
      {
        title: "Data Structures & Algorithms – Abdul Bari",
        description: "Deep, intuitive explanations of DSA. A must-watch playlist before technical interviews.",
        url: "https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O",
        type: "playlist",
        author: "Abdul Bari",
        level: "Intermediate",
        free: true,
      },
      {
        title: "LeetCode 75 Study Plan",
        description: "A curated set of 75 problems that cover all major interview topics. Great practice.",
        url: "https://leetcode.com/studyplan/leetcode-75/",
        type: "course",
        author: "LeetCode",
        level: "Intermediate",
        free: true,
      },
    ],
  },
  {
    id: "ai",
    label: "AI & Machine Learning",
    icon: "fa-robot",
    description: "AI tools, prompt engineering, ML foundations, and modern AI development.",
    resources: [
      {
        title: "Google AI Studio",
        description: "Build and prototype with Gemini models directly in your browser. Free to use.",
        url: "https://aistudio.google.com",
        type: "docs",
        author: "Google",
        level: "Beginner",
        free: true,
      },
      {
        title: "Prompt Engineering Guide",
        description: "Comprehensive guide to writing effective prompts for LLMs like GPT and Gemini.",
        url: "https://www.promptingguide.ai/",
        type: "docs",
        author: "DAIR.AI",
        level: "Beginner",
        free: true,
      },
      {
        title: "Machine Learning – Andrew Ng",
        description: "The most popular ML course ever. Starts from scratch and builds up to neural networks.",
        url: "https://www.coursera.org/specializations/machine-learning-introduction",
        type: "course",
        author: "Andrew Ng / Stanford",
        level: "Intermediate",
        free: false,
      },
      {
        title: "Andrej Karpathy – Neural Networks: Zero to Hero",
        description: "Build neural networks from scratch in Python. Phenomenal deep-dive series.",
        url: "https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ",
        type: "playlist",
        author: "Andrej Karpathy",
        level: "Advanced",
        free: true,
      },
    ],
  },
  {
    id: "git",
    label: "Git & Open Source",
    icon: "fa-code-branch",
    description: "Version control, GitHub workflows, and contributing to open source projects.",
    resources: [
      {
        title: "Git & GitHub Crash Course",
        description: "Learn Git from zero — commits, branches, merging, and GitHub pull requests.",
        url: "https://www.youtube.com/watch?v=RGOj5yH7evk",
        type: "video",
        duration: "1h",
        author: "freeCodeCamp",
        level: "Beginner",
        free: true,
      },
      {
        title: "Pro Git Book",
        description: "The definitive free book on Git. Covers everything from basics to internals.",
        url: "https://git-scm.com/book/en/v2",
        type: "docs",
        author: "Scott Chacon",
        level: "Beginner",
        free: true,
      },
      {
        title: "First Contributions",
        description: "A friendly repo that walks you through your very first open source pull request.",
        url: "https://github.com/firstcontributions/first-contributions",
        type: "article",
        author: "firstcontributions",
        level: "Beginner",
        free: true,
      },
    ],
  },
  {
    id: "devtools",
    label: "Dev Tools & Workflow",
    icon: "fa-terminal",
    description: "Terminal, VS Code, productivity tools — the essentials for modern development.",
    resources: [
      {
        title: "VS Code Tutorial for Beginners",
        description: "Master the most popular code editor — shortcuts, extensions, and debugging.",
        url: "https://www.youtube.com/watch?v=VqCgcpAypFQ",
        type: "video",
        duration: "1h",
        author: "freeCodeCamp",
        level: "Beginner",
        free: true,
      },
      {
        title: "Linux Command Line Basics",
        description: "The terminal commands every developer must know. Navigating, files, processes.",
        url: "https://www.youtube.com/watch?v=ZtqBQ68cfJc",
        type: "video",
        duration: "3h",
        author: "freeCodeCamp",
        level: "Beginner",
        free: true,
      },
      {
        title: "Developer Roadmaps",
        description: "Visual, community-driven roadmaps for frontend, backend, DevOps, and more.",
        url: "https://roadmap.sh",
        type: "docs",
        author: "roadmap.sh",
        level: "Beginner",
        free: true,
      },
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const TYPE_META: Record<Resource["type"], { label: string; icon: string; cls: string }> = {
  video:    { label: "Video",    icon: "fa-play-circle",   cls: "bg-red-50 text-red-700 border-red-100" },
  playlist: { label: "Playlist", icon: "fa-list",          cls: "bg-orange-50 text-orange-700 border-orange-100" },
  course:   { label: "Course",   icon: "fa-graduation-cap",cls: "bg-blue-50 text-blue-700 border-blue-100" },
  docs:     { label: "Docs",     icon: "fa-book-open",     cls: "bg-green-50 text-green-700 border-green-100" },
  article:  { label: "Article",  icon: "fa-file-alt",      cls: "bg-purple-50 text-purple-700 border-purple-100" },
};

const LEVEL_CLS: Record<Resource["level"], string> = {
  Beginner:     "bg-emerald-50 text-emerald-700 border-emerald-100",
  Intermediate: "bg-yellow-50 text-yellow-700 border-yellow-100",
  Advanced:     "bg-red-50 text-red-700 border-red-100",
};

function ResourceCard({ r }: { r: Resource }) {
  const tm = TYPE_META[r.type];
  return (
    <a
      href={r.url}
      target="_blank"
      rel="noreferrer"
      className="group flex flex-col bg-white border border-gray-100 rounded-xl p-4 hover:shadow-sm hover:border-gray-200 transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-red-700 transition-colors leading-snug flex-grow">
          {r.title}
        </h3>
        <i className="fas fa-external-link-alt text-gray-300 group-hover:text-red-400 transition-colors text-xs mt-0.5 flex-shrink-0" />
      </div>
      <p className="text-xs text-gray-500 leading-relaxed flex-grow mb-3">{r.description}</p>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${tm.cls}`}>
          <i className={`fas ${tm.icon}`} /> {tm.label}
        </span>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${LEVEL_CLS[r.level]}`}>
          {r.level}
        </span>
        {r.duration && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium text-gray-400 bg-gray-50 border border-gray-100">
            <i className="fas fa-clock mr-1" />{r.duration}
          </span>
        )}
        {!r.free && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-100 ml-auto">
            Paid
          </span>
        )}
        {r.free && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium text-gray-400 ml-auto">Free</span>
        )}
      </div>
    </a>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Learn() {
  const { user, loading } = useAuth();

  const [activeCategory, setActiveCategory] = useState<string>("web");

  if (loading) {
    return (
      <div className="flex-grow w-full flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-grow w-full min-h-[60vh] flex flex-col items-center justify-center p-6 relative bg-slate-50 overflow-hidden font-sans">
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[20%] left-[10%] w-[30vw] h-[30vw] rounded-full bg-gradient-to-br from-red-500/10 to-orange-500/10 blur-[80px]" />
          <div className="absolute bottom-[20%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-tr from-indigo-400/10 to-purple-400/10 blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-md w-full bg-white/60 backdrop-blur-3xl rounded-3xl p-8 sm:p-10 border border-white/50 shadow-[0_8px_40px_rgba(0,0,0,0.06)] text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner animate-bounce">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
          
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">
            Member Access Only
          </h2>
          <p className="text-slate-500 font-medium leading-relaxed mb-8">
            Please sign in to access teaching videos, developer roadmaps, and custom tutorials handpicked by the NIAT Tech Club team.
          </p>

          <Link
            to="/login?redirect=/learn"
            className="w-full relative overflow-hidden rounded-2xl font-bold text-white text-sm py-4 transition-all duration-300 shadow-[0_8px_25px_rgba(220,38,38,0.25)] hover:shadow-[0_12px_35px_rgba(220,38,38,0.35)] hover:-translate-y-1 active:translate-y-0 bg-gradient-to-r from-red-600 to-orange-600 flex items-center justify-center gap-2 group"
          >
            <span>Sign In to Access</span>
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"><path d="M3 8H13M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>
      </div>
    );
  }
  const [levelFilter, setLevelFilter] = useState<string>("All");

  const category = CATEGORIES.find(c => c.id === activeCategory)!;
  const filtered = category.resources.filter(
    r => levelFilter === "All" || r.level === levelFilter
  );

  return (
    <div className="flex-grow w-full">

      {/* Header */}
      <header className="border-b border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-6 pt-10 pb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
            <Link to="/" className="hover:text-red-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-600">Learn</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-3">
            Learn <span className="text-red-600">Basics</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">
            Curated videos, courses, and docs handpicked by the Tech Club team — the fastest path to getting productive as a developer.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row gap-8">

          {/* ── Sidebar (category list) ──────────────────────────────────── */}
          <aside className="md:w-52 flex-shrink-0">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Topics</p>
            <nav className="flex flex-col gap-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setLevelFilter("All"); }}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-all w-full ${
                    activeCategory === cat.id
                      ? "bg-red-50 text-red-700 font-semibold"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <i className={`fas ${cat.icon} w-4 text-center text-sm ${activeCategory === cat.id ? "text-red-600" : "text-gray-400"}`} />
                  {cat.label}
                  <span className="ml-auto text-[10px] font-bold text-gray-300">{cat.resources.length}</span>
                </button>
              ))}
            </nav>

            {/* Level filter */}
            <div className="mt-8">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Level</p>
              <div className="flex flex-col gap-1">
                {["All", "Beginner", "Intermediate", "Advanced"].map(l => (
                  <button
                    key={l}
                    onClick={() => setLevelFilter(l)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium text-left transition-all ${
                      levelFilter === l
                        ? "bg-gray-900 text-white"
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Main content ─────────────────────────────────────────────── */}
          <div className="flex-grow min-w-0">
            {/* Category header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                  <i className={`fas ${category.icon} text-red-600 text-sm`} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{category.label}</h2>
              </div>
              <p className="text-sm text-gray-400 ml-11">{category.description}</p>
            </div>

            {/* Resources grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <i className="fas fa-filter text-2xl mb-3 block" />
                <p className="font-medium">No {levelFilter} resources in this category.</p>
                <button onClick={() => setLevelFilter("All")} className="mt-3 text-sm text-red-600 hover:underline">
                  Clear filter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filtered.map((r) => (
                  <ResourceCard key={r.url} r={r} />
                ))}
              </div>
            )}

            {/* Suggest a resource */}
            <div className="mt-10 p-5 rounded-2xl border border-dashed border-gray-200 bg-gray-50 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                <i className="fas fa-plus text-gray-400 text-sm" />
              </div>
              <div className="flex-grow">
                <p className="text-sm font-semibold text-gray-700">Know a great resource?</p>
                <p className="text-xs text-gray-400 mt-0.5">Submit it so we can add it to this page for everyone.</p>
              </div>
              <Link
                to="/ideas"
                className="flex-shrink-0 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Suggest →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
