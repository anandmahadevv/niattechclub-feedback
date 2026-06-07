import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// ─── Badge System ─────────────────────────────────────────────────────────────
// ─── Badge System ─────────────────────────────────────────────────────────────
const BADGES = [
  { name: "Beginner",       min: 0,  color: "#6b7280", light: "#f3f4f6", tag: "bg-gray-100 text-gray-600 border-gray-200" },
  { name: "Bronze",         min: 1,  color: "#b45309", light: "#fffbeb", tag: "bg-amber-50 text-amber-700 border-amber-200" },
  { name: "Silver",         min: 2,  color: "#4b5563", light: "#f9fafb", tag: "bg-gray-100 text-gray-700 border-gray-300" },
  { name: "Gold",           min: 3,  color: "#d97706", light: "#fffbeb", tag: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  { name: "Platinum",       min: 5,  color: "#0891b2", light: "#ecfeff", tag: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  { name: "Diamond",        min: 8,  color: "#4f46e5", light: "#eef2ff", tag: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { name: "Crown",          min: 12, color: "#7c3aed", light: "#f5f3ff", tag: "bg-violet-50 text-violet-700 border-violet-200" },
  { name: "Ace",            min: 18, color: "#dc2626", light: "#fef2f2", tag: "bg-red-50 text-red-700 border-red-200" },
  { name: "Ace Master",     min: 25, color: "#1e1b4b", light: "#f5f3ff", tag: "bg-indigo-950 text-purple-300 border-purple-800" },
  { name: "Ace Dominator",  min: 35, color: "#701a75", light: "#fdf4ff", tag: "bg-fuchsia-950 text-fuchsia-300 border-fuchsia-800" },
  { name: "Conqueror",      min: 50, color: "#ea580c", light: "#fff7ed", tag: "bg-orange-50 text-orange-700 border-orange-200" },
];


const IMAGE_BADGES: Record<string, { src: string; glow: string; shadow: string }> = {
  Bronze: {
    src: "/Badges/bronze.png",
    glow: "bg-amber-600/15",
    shadow: "drop-shadow-[0_6px_10px_rgba(180,83,9,0.35)]"
  },
  Crown: {
    src: "/Badges/crown.png",
    glow: "bg-yellow-600/20",
    shadow: "drop-shadow-[0_6px_12px_rgba(217,119,6,0.4)]"
  },
  Ace: {
    src: "/Badges/ace.png",
    glow: "bg-red-600/20",
    shadow: "drop-shadow-[0_6px_12px_rgba(220,38,38,0.4)]"
  },
  "Ace Master": {
    src: "/Badges/acemaster.png",
    glow: "bg-emerald-600/20",
    shadow: "drop-shadow-[0_6px_12px_rgba(5,150,105,0.4)]"
  },
  "Ace Dominator": {
    src: "/Badges/acedominator.png",
    glow: "bg-blue-600/20",
    shadow: "drop-shadow-[0_6px_12px_rgba(37,99,235,0.4)]"
  },
  Conqueror: {
    src: "/Badges/conquerorbadge.png",
    glow: "bg-orange-500/20",
    shadow: "drop-shadow-[0_6px_12px_rgba(234,88,12,0.5)]"
  }
};

function BadgeEmblem({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-16 h-20 text-[8px]",
    md: "w-24 h-30 text-[10px]",
    lg: "w-28 h-36 text-[12px]",
  };

  const imgConfig = IMAGE_BADGES[name];
  if (imgConfig) {
    const sizeClassesImg = {
      sm: "w-16 h-18 object-contain",
      md: "w-24 h-26 object-contain",
      lg: "w-28 h-32 object-contain",
    };
    return (
      <div className={`relative flex flex-col items-center select-none group ${sizeClasses[size]}`}>
        {/* Glow effect */}
        <div className={`absolute inset-0 rounded-full ${imgConfig.glow} opacity-30 blur-xl scale-110 group-hover:scale-125 transition-transform duration-500 animate-pulse`} />
        <img
          src={imgConfig.src}
          alt={`${name} Badge`}
          className={`${sizeClassesImg[size]} ${imgConfig.shadow} transition-transform duration-500 group-hover:scale-105 group-hover:rotate-1`}
        />
      </div>
    );
  }

  const rankConfig: Record<string, {
    border: string[];
    fill: string[];
    innerFill: string[];
    icon: string;
    iconColor: string;
    bannerBg: string;
    bannerText: string;
    numeral: string;
    hasWings?: boolean;
    hasEliteWings?: boolean;
  }> = {
    Beginner: {
      border: ["#9ca3af", "#d1d5db", "#4b5563"],
      fill: ["#f3f4f6", "#d1d5db"],
      innerFill: ["#e5e7eb", "#9ca3af"],
      icon: "fa-seedling",
      iconColor: "text-emerald-500",
      bannerBg: "from-gray-500 to-gray-600",
      bannerText: "text-white",
      numeral: "I"
    },
    Bronze: {
      border: ["#a16207", "#ca8a04", "#78350f"],
      fill: ["#fffbeb", "#fcd34d"],
      innerFill: ["#ca8a04", "#78350f"],
      icon: "fa-parachute-box",
      iconColor: "text-amber-500",
      bannerBg: "from-amber-700 to-amber-800",
      bannerText: "text-amber-100",
      numeral: "I"
    },
    Silver: {
      border: ["#9ca3af", "#f3f4f6", "#6b7280"],
      fill: ["#f9fafb", "#d1d5db"],
      innerFill: ["#d1d5db", "#4b5563"],
      icon: "fa-crosshairs",
      iconColor: "text-slate-400",
      bannerBg: "from-slate-600 to-slate-700",
      bannerText: "text-slate-100",
      numeral: "I"
    },
    Gold: {
      border: ["#eab308", "#fef08a", "#a16207"],
      fill: ["#fffbeb", "#fbbf24"],
      innerFill: ["#f59e0b", "#9a3412"],
      icon: "fa-trophy",
      iconColor: "text-yellow-400",
      bannerBg: "from-yellow-600 to-yellow-700",
      bannerText: "text-yellow-100",
      numeral: "I"
    },
    Platinum: {
      border: ["#06b6d4", "#cffafe", "#0891b2"],
      fill: ["#ecfeff", "#67e8f9"],
      innerFill: ["#22d3ee", "#0f766e"],
      icon: "fa-shield-halved",
      iconColor: "text-cyan-400",
      bannerBg: "from-cyan-700 to-cyan-800",
      bannerText: "text-cyan-100",
      numeral: "I",
      hasWings: true
    },
    Diamond: {
      border: ["#3b82f6", "#bfdbfe", "#1d4ed8"],
      fill: ["#eef2ff", "#a5b4fc"],
      innerFill: ["#4f46e5", "#1e1b4b"],
      icon: "fa-gem",
      iconColor: "text-indigo-400",
      bannerBg: "from-indigo-600 to-indigo-700",
      bannerText: "text-indigo-100",
      numeral: "I",
      hasWings: true
    },
    Crown: {
      border: ["#fbbf24", "#fef08a", "#7c3aed"],
      fill: ["#f5f3ff", "#d8b4fe"],
      innerFill: ["#7c3aed", "#2e1065"],
      icon: "fa-crown",
      iconColor: "text-yellow-300",
      bannerBg: "from-purple-700 to-purple-800",
      bannerText: "text-purple-100",
      numeral: "I",
      hasEliteWings: true
    },
    Ace: {
      border: ["#ef4444", "#fca5a5", "#b91c1c"],
      fill: ["#fef2f2", "#fca5a5"],
      innerFill: ["#dc2626", "#7f1d1d"],
      icon: "fa-fire",
      iconColor: "text-orange-400 animate-pulse",
      bannerBg: "from-red-700 to-red-800",
      bannerText: "text-red-100",
      numeral: "I",
      hasEliteWings: true
    },
    "Ace Master": {
      border: ["#c084fc", "#fae8ff", "#701a75"],
      fill: ["#fae8ff", "#e879f9"],
      innerFill: ["#a21caf", "#4a044e"],
      icon: "fa-skull-crossbones",
      iconColor: "text-fuchsia-400 animate-pulse",
      bannerBg: "from-fuchsia-800 to-fuchsia-950",
      bannerText: "text-fuchsia-100",
      numeral: "I",
      hasEliteWings: true
    },
    "Ace Dominator": {
      border: ["#ec4899", "#fbcfe8", "#9d174d"],
      fill: ["#fdf2f8", "#f472b6"],
      innerFill: ["#be185d", "#500724"],
      icon: "fa-award",
      iconColor: "text-pink-300",
      bannerBg: "from-pink-700 to-pink-900",
      bannerText: "text-pink-100",
      numeral: "I",
      hasEliteWings: true
    }
  };

  const rank = rankConfig[name] || rankConfig.Beginner;
  const gradBorderId = `border-${name.replace(/\s+/g, "-")}`;
  const gradFillId = `fill-${name.replace(/\s+/g, "-")}`;
  const gradInnerId = `inner-${name.replace(/\s+/g, "-")}`;

  return (
    <div className={`relative flex flex-col items-center select-none group transition-all duration-300 hover:scale-105 ${sizeClasses[size]}`}>
      {/* Dynamic Pulsating Glow for high ranks */}
      {["Crown", "Ace", "Ace Master", "Ace Dominator"].includes(name) && (
        <div 
          className="absolute inset-0 rounded-full opacity-25 blur-xl scale-125 animate-pulse transition-transform duration-500 group-hover:scale-150" 
          style={{ backgroundColor: rank.innerFill[0] }} 
        />
      )}

      {/* SVG Layout */}
      <svg viewBox="0 0 100 125" className="w-full h-auto drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]">
        <defs>
          <linearGradient id={gradBorderId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={rank.border[0]} />
            <stop offset="50%" stopColor={rank.border[1] || rank.border[0]} />
            <stop offset="100%" stopColor={rank.border[2] || rank.border[0]} />
          </linearGradient>
          <linearGradient id={gradFillId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={rank.fill[0]} />
            <stop offset="100%" stopColor={rank.fill[1] || rank.fill[0]} />
          </linearGradient>
          <linearGradient id={gradInnerId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={rank.innerFill[0]} />
            <stop offset="100%" stopColor={rank.innerFill[1] || rank.innerFill[0]} />
          </linearGradient>
        </defs>

        {/* 1. WINGS BACKGROUND (Elite tiers) */}
        {rank.hasEliteWings && (
          <g className="transition-all duration-500 group-hover:translate-y-[-2px]">
            {/* Left Wing */}
            <path
              d="M 28 25 C 10 8 0 25 10 50 C 16 62 25 55 28 45"
              style={{ fill: `url(#${gradBorderId})` }}
              className="drop-shadow-sm"
            />
            <path
              d="M 26 30 C 14 18 6 30 14 48 C 18 55 24 50 26 42"
              style={{ fill: `url(#${gradInnerId})` }}
              opacity="0.9"
            />
            {/* Right Wing */}
            <path
              d="M 72 25 C 90 8 100 25 90 50 C 84 62 75 55 72 45"
              style={{ fill: `url(#${gradBorderId})` }}
              className="drop-shadow-sm"
            />
            <path
              d="M 74 30 C 86 18 94 30 86 48 C 82 55 76 50 74 42"
              style={{ fill: `url(#${gradInnerId})` }}
              opacity="0.9"
            />
            {/* Top Crowns / Swords Accent */}
            <polygon points="50,2 45,12 55,12" style={{ fill: `url(#${gradBorderId})` }} />
            <circle cx="50" cy="1" r="1.5" fill="#fef08a" />
          </g>
        )}

        {/* 2. REGULAR WINGS (Mid tiers: Platinum, Diamond) */}
        {rank.hasWings && (
          <g className="transition-all duration-500">
            {/* Left Wing Tip */}
            <path
              d="M 25 35 C 12 30 8 40 18 48 C 22 51 25 45 25 40"
              style={{ fill: `url(#${gradBorderId})` }}
            />
            {/* Right Wing Tip */}
            <path
              d="M 75 35 C 88 30 92 40 82 48 C 78 51 75 45 75 40"
              style={{ fill: `url(#${gradBorderId})` }}
            />
          </g>
        )}

        {/* 3. HANGING RIBBON/BANNER */}
        <g className="transition-all duration-300 group-hover:translate-y-[1px]">
          {/* Ribbon Outer border */}
          <path
            d="M 30,42 L 70,42 L 70,95 L 50,114 L 30,95 Z"
            style={{ fill: `url(#${gradBorderId})` }}
          />
          {/* Ribbon Inner fill */}
          <path
            d="M 33,42 L 67,42 L 67,92 L 50,107 L 33,92 Z"
            style={{ fill: `url(#${gradInnerId})` }}
          />
          {/* Vertical Texture Stripe */}
          <path
            d="M 46,42 L 54,42 L 54,103 L 50,107 L 46,103 Z"
            fill="white"
            opacity="0.08"
          />
        </g>

        {/* 4. METALLIC CIRCLE MEDAL */}
        <g className="transition-all duration-500 group-hover:scale-105 origin-[50px_42px]">
          {/* Outer circle border (Metal ring) */}
          <circle
            cx="50"
            cy="42"
            r="23"
            style={{ fill: `url(#${gradBorderId})` }}
          />
          {/* Inner circle background */}
          <circle
            cx="50"
            cy="42"
            r="19"
            style={{ fill: `url(#${gradFillId})` }}
          />
          {/* Decorative circular dashed line */}
          <circle
            cx="50"
            cy="42"
            r="16.5"
            fill="none"
            stroke="white"
            strokeOpacity="0.25"
            strokeWidth="0.75"
            strokeDasharray="3,2"
          />
        </g>

        {/* 5. RANK LEVEL SHIELD (Mini Shield at bottom of medal) */}
        <g className="transition-all duration-300 origin-[50px_68px]">
          {/* Mini shield border */}
          <path
            d="M 43,62 L 57,62 L 57,72 L 50,78 L 43,72 Z"
            style={{ fill: `url(#${gradBorderId})` }}
          />
          {/* Mini shield inner */}
          <path
            d="M 45,63 L 55,63 L 55,71 L 50,75 L 45,71 Z"
            fill="#111827"
          />
          {/* Numeral text inside shield */}
          <text
            x="50"
            y="71"
            fill="white"
            fontSize="7"
            fontWeight="900"
            fontFamily="'Outfit', sans-serif"
            textAnchor="middle"
            className="select-none"
            opacity="0.9"
          >
            {rank.numeral}
          </text>
        </g>
      </svg>

      {/* FontAwesome Icon Overlaid absolutely */}
      <div className="absolute top-[32.5%] left-1/2 -translate-x-1/2 flex items-center justify-center text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] group-hover:scale-110 transition-transform duration-500">
        <i className={`fas ${rank.icon} text-lg md:text-xl lg:text-2xl ${rank.iconColor}`} />
      </div>

      {/* Rank Name Text at bottom of banner */}
      <div 
        className={`absolute bottom-[16%] left-0 right-0 text-center font-black uppercase tracking-wider text-white select-none drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.85)] group-hover:scale-105 transition-transform duration-300`}
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        {name}
      </div>
    </div>
  );
}

function getBadge(n: number) {
  let b = BADGES[0];
  for (const badge of BADGES) if (n >= badge.min) b = badge;
  return b;
}
function getNextBadge(n: number) {
  for (const badge of BADGES) if (n < badge.min) return badge;
  return null;
}

// ─── Event Definitions ────────────────────────────────────────────────────────
const ALL_EVENTS = [
  { slug: "ai-workshop", name: "AI Tools & Innovation Workshop", date: "April 30, 2026", type: "Workshop", status: "past" },
  { slug: "promptwars", name: "PromptWars Hackathon", date: "Aug 2026 (TBD)", type: "Hackathon", status: "upcoming" },
];

// ─── Reusable label/input ─────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-3.5 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 font-medium outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all placeholder-gray-400";

export default function Profile() {
  const { user, loading, updateLocalUser } = useAuth();
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: "", rollNumber: "", department: "", githubUsername: "" });
  const [userRsvps, setUserRsvps] = useState<{ event_slug: string }[]>([]);
  const [rsvpsLoading, setRsvpsLoading] = useState(true);
  const [tab, setTab] = useState<"overview" | "events" | "edit">("overview");
  const [showLeaguesModal, setShowLeaguesModal] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) navigate("/login?redirect=/profile");
      else {
        setFormData({ name: user.name || "", rollNumber: user.roll_number || "", department: user.department || "", githubUsername: user.github_username || "" });
        supabase.from("rsvps").select("event_slug").eq("email", user.email).then(({ data }) => {
          setUserRsvps(data || []);
          setRsvpsLoading(false);
        });
      }
    }
  }, [user, loading, navigate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (formData.githubUsername) {
      const ghRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
      if (!ghRegex.test(formData.githubUsername)) {
        toast.error("Invalid GitHub username format.");
        return;
      }
    }

    setSaving(true);
    const id = toast.loading("Saving...");
    try {
      const { error } = await supabase.rpc("update_user_profile", {
        user_email: user.email,
        new_name: formData.name,
        new_roll_number: formData.rollNumber,
        new_department: formData.department,
        new_github_username: formData.githubUsername,
      });
      if (error) throw error;
      updateLocalUser({ ...user, name: formData.name, roll_number: formData.rollNumber, department: formData.department, github_username: formData.githubUsername });
      toast.success("Profile updated.", { id });
    } catch (err: any) {
      toast.error(err.message || "Failed to update.", { id });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex-grow w-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const attendedSlugs = new Set(userRsvps.filter(r => ALL_EVENTS.find(e => e.slug === r.event_slug && e.status === "past")).map(r => r.event_slug));
  const registeredSlugs = new Set(userRsvps.filter(r => ALL_EVENTS.find(e => e.slug === r.event_slug && e.status === "upcoming")).map(r => r.event_slug));
  const attendedEvents = ALL_EVENTS.filter(e => attendedSlugs.has(e.slug));
  const registeredEvents = ALL_EVENTS.filter(e => registeredSlugs.has(e.slug));
  const eventsCount = attendedEvents.length;

  const badge = getBadge(eventsCount);
  const nextBadge = getNextBadge(eventsCount);
  const progressPct = nextBadge ? Math.min(100, (eventsCount / nextBadge.min) * 100) : 100;
  const firstLetter = (formData.name || user.email || "U").charAt(0).toUpperCase();

  const TABS = [
    { key: "overview", label: "Overview" },
    { key: "events",   label: "Events" },
    { key: "edit",     label: "Edit Profile" },
  ] as const;

  return (
    <div className="flex-grow w-full text-gray-900">

      {/* ── Top Identity Strip ─────────────────────────────────────────────── */}
      <div className="bg-white/60 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">

            {/* Avatar */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black flex-shrink-0 shadow-sm"
              style={{ background: badge.color }}
            >
              {firstLetter}
            </div>

            {/* Name / details */}
            <div className="flex-grow min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-xl font-bold text-gray-900 truncate">{formData.name || "Member"}</h1>
              </div>
              <p className="text-sm text-gray-400 mt-0.5">{user.email}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.rollNumber && <span className="text-xs text-gray-500 font-medium">#{formData.rollNumber}</span>}
                {formData.rollNumber && formData.department && <span className="text-gray-300 text-xs">·</span>}
                {formData.department && <span className="text-xs text-gray-500 font-medium">{formData.department}</span>}
                {user.github_username && (
                  <>
                    <span className="text-gray-300 text-xs">·</span>
                    <a
                      href={`https://github.com/${user.github_username}`}
                      target="_blank" rel="noreferrer"
                      className="text-xs text-gray-500 font-medium hover:text-gray-900 flex items-center gap-1 transition-colors"
                    >
                      <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/></svg>
                      @{user.github_username}
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-4xl mx-auto px-6">
          <nav className="flex gap-0 -mb-px">
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                  tab === t.key
                    ? "border-red-600 text-red-600"
                    : "border-transparent text-gray-400 hover:text-gray-700"
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Tab Content ────────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div className="max-w-xl mx-auto">
            {/* See all leagues trigger */}
            <div className="flex justify-end mb-4 px-2">
              <button 
                onClick={() => setShowLeaguesModal(true)} 
                className="text-xs font-black uppercase tracking-wider text-amber-600 hover:text-amber-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                <i className="fas fa-trophy text-[10px]" /> See all leagues
              </button>
            </div>

            <div className="relative bg-white border border-gray-200 text-gray-900 rounded-3xl p-8 shadow-md overflow-hidden group transition-all duration-500 hover:border-gray-300 hover:shadow-lg">
              {/* Active rank glow background */}
              <div 
                className="absolute -top-20 -left-20 w-64 h-64 rounded-full opacity-10 blur-[100px] pointer-events-none animate-pulse" 
                style={{ backgroundColor: badge.color }}
              />
              <div 
                className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full opacity-10 blur-[100px] pointer-events-none animate-pulse" 
                style={{ backgroundColor: badge.color }}
              />

              {/* Card Header */}
              <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase">NIAT Tech Club Rank</span>
                </div>
                <span className="text-xs font-mono font-bold text-gray-400">ID: #{formData.rollNumber || "GUEST"}</span>
              </div>

              {/* Card Body: Emblem and Rank Name */}
              <div className="flex flex-col items-center text-center gap-4 py-4">
                <div className="relative flex items-center justify-center p-3 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)]">
                  <BadgeEmblem name={badge.name} size="lg" />
                </div>
                
                <div className="mt-2">
                  <h2 
                    className="text-3xl font-black uppercase tracking-wider bg-gradient-to-b bg-clip-text text-transparent filter drop-shadow-sm"
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      backgroundImage: badge.name === "Conqueror" 
                        ? "linear-gradient(to bottom, #ea580c, #9a3412)"
                        : badge.name === "Ace" || badge.name === "Ace Master" || badge.name === "Ace Dominator"
                        ? "linear-gradient(to bottom, #dc2626, #7f1d1d)"
                        : badge.name === "Crown"
                        ? "linear-gradient(to bottom, #7c3aed, #4c1d95)"
                        : badge.name === "Gold"
                        ? "linear-gradient(to bottom, #d97706, #78350f)"
                        : "linear-gradient(to bottom, #374151, #111827)"
                    }}
                  >
                    {badge.name}
                  </h2>
                  <p className="text-xs font-bold text-gray-400 tracking-widest mt-1 uppercase">
                    Events Attended: <span className="text-gray-900 font-mono text-sm font-black">{eventsCount}</span>
                  </p>
                </div>
              </div>

              {/* Progress bar container */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                {nextBadge ? (
                  <div>
                    {/* Labels and point counts */}
                    <div className="flex justify-between items-end mb-2 px-1">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Current Tier</span>
                        <span className="text-xs font-bold text-gray-700">{badge.name}</span>
                      </div>
                      <div className="text-center bg-gray-50 border border-gray-200/60 px-3 py-1 rounded-full shadow-sm">
                        <span className="text-xs font-mono font-black text-red-600">
                          {eventsCount} <span className="text-gray-400 text-[10px]">/</span> {nextBadge.min}
                        </span>
                        <span className="text-[9px] font-bold text-gray-500 ml-1.5 uppercase tracking-wide">Attended</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Next Tier</span>
                        <span className="text-xs font-bold text-red-600 flex items-center gap-1">
                          <i className="fas fa-lock text-[9px]" /> {nextBadge.name}
                        </span>
                      </div>
                    </div>

                    {/* Gaming-style Progress bar */}
                    <div className="h-3 bg-gray-100 rounded-full border border-gray-200/80 relative overflow-hidden p-0.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]">
                      <div
                        className="h-full rounded-full transition-all duration-700 bg-gradient-to-r relative overflow-hidden"
                        style={{ 
                          width: `${progressPct}%`, 
                          backgroundImage: `linear-gradient(to right, ${badge.color}, ${nextBadge.color || badge.color})` 
                        }}
                      >
                        {/* Inner shimmer animation */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                      </div>
                    </div>

                    {/* Progression status message */}
                    <div className="mt-3 flex flex-wrap items-center justify-between text-xs gap-2 px-1 text-gray-500">
                      <span className="flex items-center gap-1">
                        <i className="fas fa-circle-info text-[10px] text-gray-400" />
                        <span>Complete events to climb the leaderboard rank.</span>
                      </span>
                      <span className="font-semibold text-red-600 animate-pulse">
                        {nextBadge.min - eventsCount} more event{nextBadge.min - eventsCount !== 1 ? "s" : ""} to unlock
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-3 px-4 bg-amber-50 rounded-xl border border-amber-200/50">
                    <p className="text-sm font-black uppercase text-amber-700 tracking-wider animate-pulse">
                      🏆 Max Rank Achieved!
                    </p>
                    <p className="text-[10px] text-amber-600/90 mt-1 uppercase font-semibold">
                      You have attained the ultimate Conqueror status in the NIAT Tech Club.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Leagues Progression Modal */}
            <AnimatePresence>
              {showLeaguesModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                  {/* Backdrop */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowLeaguesModal(false)}
                    className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
                  />
                  
                  {/* Modal Container */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    transition={{ type: "spring", duration: 0.4 }}
                    className="relative w-full max-w-2xl bg-white border border-gray-200 text-gray-900 rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[85vh] z-[210]"
                  >
                    <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
                      <div className="flex items-center gap-2">
                        <i className="fas fa-trophy text-amber-500 text-lg" />
                        <h3 className="text-lg font-black uppercase tracking-wider font-outfit text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
                          Leagues Progression
                        </h3>
                      </div>
                      <button 
                        onClick={() => setShowLeaguesModal(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
                      >
                        <i className="fas fa-times text-lg" />
                      </button>
                    </div>

                    {/* Leagues Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {BADGES.map(b => {
                        const unlocked = eventsCount >= b.min;
                        const isCurrent = badge.name === b.name;
                        return (
                          <div
                            key={b.name}
                            className={`flex flex-col items-center justify-between gap-3 p-3 rounded-2xl border text-center transition-all ${
                              isCurrent
                                ? "border-amber-400 bg-amber-50/50 shadow-sm shadow-amber-500/5"
                                : unlocked
                                ? "border-gray-200 bg-gray-50/50"
                                : "border-gray-100 bg-gray-50/20 opacity-50"
                            }`}
                          >
                            <div className="relative flex items-center justify-center">
                              <BadgeEmblem name={b.name} size="sm" />
                              {!unlocked && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/20 rounded-lg">
                                  <i className="fas fa-lock text-[10px] text-gray-400 bg-white border border-gray-200 p-1.5 rounded-full shadow-sm" />
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col items-center gap-0.5">
                              <span className="text-[10px] font-bold text-gray-800 leading-tight">{b.name}</span>
                              {isCurrent ? (
                                <span className="text-[8px] font-black text-amber-600 uppercase tracking-widest leading-none mt-1">
                                  CURRENT
                                </span>
                              ) : unlocked ? (
                                <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest leading-none mt-1">
                                  UNLOCKED
                                </span>
                              ) : (
                                <span className="text-[9px] text-gray-400 font-semibold mt-1">{b.min}+ events</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* EVENTS */}
        {tab === "events" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Attended",
                list: attendedEvents,
                emptyText: "No events attended yet.",
                emptyHint: "Attend events to earn badges.",
                accent: "bg-green-500",
                tagClass: "bg-green-50 text-green-700 border-green-200",
                tag: "Attended",
              },
              {
                title: "Upcoming Registrations",
                list: registeredEvents,
                emptyText: "Not registered for any events.",
                emptyHint: "Check the Events page to RSVP.",
                accent: "bg-red-500",
                tagClass: "bg-red-50 text-red-700 border-red-200",
                tag: "RSVP'd",
              },
            ].map(section => (
              <div key={section.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">{section.title}</p>
                {rsvpsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : section.list.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-sm text-gray-500 font-medium">{section.emptyText}</p>
                    <p className="text-xs text-gray-400 mt-1">{section.emptyHint}</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {section.list.map(event => (
                      <div key={event.slug} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${section.accent}`} />
                        <div className="flex-grow min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{event.name}</p>
                          <p className="text-xs text-gray-400">{event.date} · {event.type}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${section.tagClass}`}>
                          {section.tag}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* EDIT */}
        {tab === "edit" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-2xl">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">Personal Information</p>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name">
                  <input type="text" name="name" required value={formData.name}
                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                    placeholder="Your full name" className={inputCls} maxLength={50} pattern="^[a-zA-Z\s]+$" title="Only letters and spaces are allowed" />
                </Field>
                <Field label="Roll Number / Campus ID">
                  <input type="text" name="rollNumber" required value={formData.rollNumber}
                    onChange={e => setFormData(p => ({ ...p, rollNumber: e.target.value }))}
                    placeholder="e.g. 44226" className={inputCls} maxLength={20} pattern="^[a-zA-Z0-9]+$" title="Only alphanumeric characters are allowed" />
                </Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Department">
                  <input type="text" name="department" required value={formData.department}
                    onChange={e => setFormData(p => ({ ...p, department: e.target.value }))}
                    placeholder="e.g. CSE, ECE, ISE" className={inputCls} maxLength={50} />
                </Field>
                <Field label="Email">
                  <input type="email" disabled value={user.email || ""}
                    className={`${inputCls} bg-gray-50 text-gray-400 cursor-not-allowed`} />
                </Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="GitHub Username">
                  <input type="text" name="githubUsername" value={formData.githubUsername}
                    maxLength={39}
                    onChange={e => {
                      // Extract username if a full URL is pasted
                      let val = e.target.value.trim();
                      if (val.includes('github.com/')) {
                        val = val.split('github.com/')[1].split('/')[0];
                      }
                      setFormData(p => ({ ...p, githubUsername: val }));
                    }}
                    placeholder="e.g. torvalds" className={inputCls} />
                </Field>
              </div>
              <div className="pt-2 flex justify-end">
                <button
                  type="submit" disabled={saving}
                  className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-red-700/20"
                >
                  {saving ? (
                    <><div className="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin" />Saving...</>
                  ) : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
