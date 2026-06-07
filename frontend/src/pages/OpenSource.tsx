import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import Tilt from "react-parallax-tilt";
import Leaderboard from "../components/Leaderboard";

const DEFAULT_REPOS = [
  {
    id: 1,
    name: "first-contributions / first-contributions",
    description: "Help beginners to contribute to open source projects. A great place to make your very first open source contribution.",
    motive: "Lower the barrier to entry for beginners",
    languages: ["Markdown", "HTML"],
    link: "https://github.com/firstcontributions/first-contributions",
    tags: ["Beginner Friendly", "Documentation"],
  },
  {
    id: 2,
    name: "freeCodeCamp / freeCodeCamp",
    description: "freeCodeCamp.org's open-source codebase and curriculum. Learn to code for free.",
    motive: "Make learning web development accessible to everyone",
    languages: ["TypeScript", "JavaScript", "CSS"],
    link: "https://github.com/freeCodeCamp/freeCodeCamp",
    tags: ["Education", "Web Development"],
  },
  {
    id: 3,
    name: "Codecademy / docs",
    description: "An open-source repository for Codecademy's Docs. A community-driven collection of code documentation.",
    motive: "Create a central hub for web development documentation",
    languages: ["Markdown", "TypeScript", "React"],
    link: "https://github.com/Codecademy/docs",
    tags: ["Documentation", "Beginner Friendly"],
  },
  {
    id: 4,
    name: "kamranahmedse / developer-roadmap",
    description: "Interactive roadmaps, guides and other educational content to help developers grow in their careers.",
    motive: "Provide clear learning paths for different roles in software engineering",
    languages: ["TypeScript", "Astro"],
    link: "https://github.com/kamranahmedse/developer-roadmap",
    tags: ["Career", "Guide"],
  },
  {
    id: 5,
    name: "EddieHubCommunity / LinkFree",
    description: "Open source alternative to Linktree. Connect to your audience with a single link.",
    motive: "Empower content creators and open source maintainers with a customizable profile",
    languages: ["JavaScript", "Next.js", "Tailwind CSS"],
    link: "https://github.com/EddieHubCommunity/LinkFree",
    tags: ["Next.js", "Social"],
  },
  {
    id: 6,
    name: "MunGell / awesome-for-beginners",
    description: "A list of awesome beginners-friendly projects. A fantastic starting point for finding repos based on language.",
    motive: "Curate a list of projects that are actively seeking beginner contributions",
    languages: ["Markdown"],
    link: "https://github.com/MunGell/awesome-for-beginners",
    tags: ["Curated List", "Beginner Friendly"],
  }
];

function parseArrayField(val: any): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      try {
        return JSON.parse(val);
      } catch (e) {
        // Fallback to comma separation on parse error
      }
    }
    return val.split(',').map(v => v.trim()).filter(v => v !== '');
  }
  return [];
}

export default function OpenSource() {
  const [dbRepos, setDbRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRepos() {
      try {
        const { data, error } = await supabase
          .from("tracked_repos")
          .select("*")
          .order("id", { ascending: true });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const formatted = data.map(r => ({
            id: r.id,
            name: `${r.owner} / ${r.repo}`,
            description: r.description || "Tracked repository for community contributions.",
            motive: r.motive || "Contribute to open source",
            languages: parseArrayField(r.languages),
            link: r.link || `https://github.com/${r.owner}/${r.repo}`,
            tags: parseArrayField(r.tags),
          }));
          setDbRepos(formatted);
        } else {
          setDbRepos([]);
        }
      } catch (err) {
        console.error("Error loading repos from database:", err);
      } finally {
        setLoading(false);
      }
    }
    loadRepos();
  }, []);

  const displayRepos = dbRepos.length > 0 ? dbRepos : DEFAULT_REPOS;

  return (
    <div className="flex-grow w-full flex flex-col pb-20">
      <header className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center w-full">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-gray-900 mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Open Source Contributions
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Discover incredible open-source repositories perfect for your next contribution. Explore their motives, tech stacks, and get started!
        </p>
      </header>

      <main className="max-w-6xl mx-auto px-6 w-full flex-grow flex flex-col items-center">
        
        <Leaderboard />

        <div className="w-full text-center mt-8 mb-8 border-t border-gray-200 pt-16">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Tracked Repositories
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Get your PRs merged in these repositories to climb the leaderboard!
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {displayRepos.map((repo) => (
              <Tilt key={repo.id} tiltMaxAngleX={4} tiltMaxAngleY={4} scale={1.02} transitionSpeed={2000} className="w-full flex">
              <article className="flex flex-col w-full bg-white border border-gray-100 shadow-sm hover:shadow-xl rounded-2xl overflow-hidden transition-all p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{repo.name}</h3>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {repo.languages.map((lang: string, idx: number) => (
                      <span key={idx} className="px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[10px] font-bold uppercase tracking-wider">{lang}</span>
                    ))}
                  </div>
                </div>
                
                <div className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                  <p className="font-semibold text-gray-800 mb-1">About:</p>
                  <p className="mb-3">{repo.description}</p>
                  <p className="font-semibold text-gray-800 mb-1">Motive:</p>
                  <p className="italic">{repo.motive}</p>
                </div>
                
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1">
                    {repo.tags.map((tag: string, idx: number) => (
                      <span key={idx} className="px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-md text-[10px] font-bold uppercase tracking-wider">{tag}</span>
                    ))}
                  </div>
                  
                  <a href={repo.link} target="_blank" rel="noreferrer" className="text-red-600 hover:text-red-800 transition-colors flex items-center gap-1 font-semibold text-xs bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg shrink-0">
                    Contribute <i className="fas fa-external-link-alt text-[10px]"></i>
                  </a>
                </div>
              </article>
            </Tilt>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
