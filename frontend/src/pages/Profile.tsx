import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";

// ─── BGMI-Style Badge System ──────────────────────────────────────────────────
const BADGES = [
  {
    name: "Beginner",
    min: 0,
    emoji: "🌱",
    gradient: "linear-gradient(135deg, #6b7280 0%, #9ca3af 50%, #6b7280 100%)",
    glow: "rgba(107,114,128,0.6)",
    textColor: "#d1d5db",
    tierColor: "#9ca3af",
    bg: "from-gray-700 to-gray-800",
    border: "border-gray-500",
    shield: "⬡",
    description: "Starting your journey",
    roman: "I",
  },
  {
    name: "Bronze",
    min: 1,
    emoji: "🥉",
    gradient: "linear-gradient(135deg, #92400e 0%, #d97706 40%, #b45309 70%, #92400e 100%)",
    glow: "rgba(217,119,6,0.7)",
    textColor: "#fde68a",
    tierColor: "#f59e0b",
    bg: "from-amber-900 to-amber-800",
    border: "border-amber-500",
    shield: "⬡",
    description: "Battle-tested warrior",
    roman: "II",
  },
  {
    name: "Silver",
    min: 2,
    emoji: "🥈",
    gradient: "linear-gradient(135deg, #4b5563 0%, #d1d5db 40%, #9ca3af 70%, #6b7280 100%)",
    glow: "rgba(209,213,219,0.6)",
    textColor: "#f9fafb",
    tierColor: "#e5e7eb",
    bg: "from-slate-700 to-slate-800",
    border: "border-slate-300",
    shield: "⬡",
    description: "Rising through the ranks",
    roman: "III",
  },
  {
    name: "Gold",
    min: 3,
    emoji: "🥇",
    gradient: "linear-gradient(135deg, #78350f 0%, #fbbf24 35%, #f59e0b 60%, #d97706 100%)",
    glow: "rgba(251,191,36,0.8)",
    textColor: "#fef3c7",
    tierColor: "#fbbf24",
    bg: "from-yellow-800 to-yellow-900",
    border: "border-yellow-400",
    shield: "⬡",
    description: "Proven competitor",
    roman: "IV",
  },
  {
    name: "Platinum",
    min: 5,
    emoji: "💎",
    gradient: "linear-gradient(135deg, #0e7490 0%, #67e8f9 35%, #22d3ee 60%, #0891b2 100%)",
    glow: "rgba(103,232,249,0.7)",
    textColor: "#ecfeff",
    tierColor: "#67e8f9",
    bg: "from-cyan-900 to-cyan-800",
    border: "border-cyan-400",
    shield: "⬡",
    description: "Elite performer",
    roman: "V",
  },
  {
    name: "Diamond",
    min: 8,
    emoji: "💠",
    gradient: "linear-gradient(135deg, #1e1b4b 0%, #818cf8 30%, #6366f1 55%, #4338ca 80%, #1e1b4b 100%)",
    glow: "rgba(129,140,248,0.8)",
    textColor: "#e0e7ff",
    tierColor: "#818cf8",
    bg: "from-indigo-900 to-indigo-800",
    border: "border-indigo-400",
    shield: "⬡",
    description: "Shining brilliance",
    roman: "VI",
  },
  {
    name: "Crown",
    min: 12,
    emoji: "👑",
    gradient: "linear-gradient(135deg, #4a1d96 0%, #c084fc 30%, #a855f7 55%, #7c3aed 80%, #4a1d96 100%)",
    glow: "rgba(192,132,252,0.85)",
    textColor: "#fae8ff",
    tierColor: "#c084fc",
    bg: "from-purple-900 to-purple-800",
    border: "border-purple-400",
    shield: "⬡",
    description: "Royalty of the arena",
    roman: "VII",
  },
  {
    name: "Ace",
    min: 18,
    emoji: "⚡",
    gradient: "linear-gradient(135deg, #7f1d1d 0%, #ef4444 25%, #f97316 50%, #ef4444 75%, #7f1d1d 100%)",
    glow: "rgba(239,68,68,0.9)",
    textColor: "#fef2f2",
    tierColor: "#f87171",
    bg: "from-red-900 to-red-800",
    border: "border-red-500",
    shield: "⬡",
    description: "Legendary conqueror",
    roman: "VIII",
  },
];

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
  { slug: "ai-workshop", name: "AI Tools & Innovation Workshop", date: "April 30, 2026", type: "Workshop", status: "past", icon: "🤖" },
  { slug: "promptwars", name: "PromptWars Hackathon", date: "Aug 2026 (TBD)", type: "Hackathon", status: "upcoming", icon: "⚡" },
];

// ─── Badge Emblem Component (BGMI-style) ──────────────────────────────────────
function BadgeEmblem({ badge, size = "lg" }: { badge: typeof BADGES[0]; size?: "sm" | "lg" }) {
  const isLg = size === "lg";
  return (
    <div className={`relative flex flex-col items-center ${isLg ? "gap-3" : "gap-1"}`}>
      {/* Outer glow ring */}
      <div
        className={`${isLg ? "w-36 h-36" : "w-14 h-14"} rounded-full flex items-center justify-center relative`}
        style={{ boxShadow: `0 0 ${isLg ? "40px" : "12px"} ${badge.glow}, 0 0 ${isLg ? "80px" : "24px"} ${badge.glow}30` }}
      >
        {/* Spinning outer ring */}
        <div
          className={`absolute inset-0 rounded-full border-2 border-transparent`}
          style={{
            background: `conic-gradient(from 0deg, transparent 0deg, ${badge.tierColor} 90deg, transparent 180deg, ${badge.tierColor} 270deg, transparent 360deg)`,
            borderRadius: "50%",
            mask: "radial-gradient(transparent 80%, black 80%)",
            animation: isLg ? "spin 4s linear infinite" : "none",
          }}
        />
        {/* Inner badge */}
        <div
          className={`${isLg ? "w-28 h-28" : "w-12 h-12"} rounded-full flex flex-col items-center justify-center relative overflow-hidden border-2`}
          style={{
            background: badge.gradient,
            borderColor: badge.tierColor,
            boxShadow: `inset 0 2px 8px rgba(255,255,255,0.15), inset 0 -2px 8px rgba(0,0,0,0.3)`,
          }}
        >
          {/* Shine effect */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-full" />
          <span className={isLg ? "text-4xl" : "text-xl"}>{badge.emoji}</span>
          {isLg && (
            <span className="text-xs font-black mt-0.5 tracking-widest" style={{ color: badge.textColor }}>
              {badge.roman}
            </span>
          )}
        </div>
      </div>

      {/* Badge name */}
      <div className="text-center">
        <p
          className={`font-black tracking-widest uppercase ${isLg ? "text-xl" : "text-[10px]"}`}
          style={{ color: badge.tierColor, textShadow: `0 0 10px ${badge.glow}` }}
        >
          {badge.name}
        </p>
        {isLg && <p className="text-xs text-gray-400 mt-0.5 font-medium">{badge.description}</p>}
      </div>
    </div>
  );
}

export default function Profile() {
  const { user, loading, updateLocalUser } = useAuth();
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: "", rollNumber: "", department: "" });
  const [userRsvps, setUserRsvps] = useState<{ event_slug: string; created_at: string }[]>([]);
  const [rsvpsLoading, setRsvpsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "events" | "edit">("overview");

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login?redirect=/profile");
      } else {
        setFormData({ name: user.name || "", rollNumber: user.roll_number || "", department: user.department || "" });
        fetchUserRsvps(user.email);
      }
    }
  }, [user, loading, navigate]);

  const fetchUserRsvps = async (email: string) => {
    setRsvpsLoading(true);
    const { data } = await supabase.from("rsvps").select("event_slug, created_at").eq("email", email);
    setUserRsvps(data || []);
    setRsvpsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const toastId = toast.loading("Updating profile...");
    try {
      const { error } = await supabase.rpc("update_user_profile", {
        user_email: user.email,
        new_name: formData.name,
        new_roll_number: formData.rollNumber,
        new_department: formData.department,
      });
      if (error) throw error;
      updateLocalUser({ ...user, name: formData.name, roll_number: formData.rollNumber, department: formData.department });
      toast.success("Profile updated!", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Failed to update.", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex-grow w-full flex items-center justify-center min-h-screen" style={{ background: "#0a0a0f" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-gray-400 text-sm font-medium tracking-wider uppercase">Loading Profile...</p>
        </div>
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

  return (
    <div className="flex-grow w-full min-h-screen font-sans" style={{ background: "linear-gradient(160deg, #0f0c1a 0%, #13111f 40%, #0a0d1a 100%)" }}>
      <style>{`
        @keyframes shimmer { 0%,100%{opacity:0.5} 50%{opacity:1} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes badge-pulse { 0%,100%{box-shadow:0 0 20px var(--glow)} 50%{box-shadow:0 0 40px var(--glow), 0 0 80px var(--glow)50} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>

      {/* Hero Banner */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(180deg, #1a0a2e 0%, #0f0c1a 100%)", minHeight: "320px" }}>
        {/* Background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 4 + 1 + "px",
                height: Math.random() * 4 + 1 + "px",
                background: badge.tierColor,
                opacity: Math.random() * 0.4 + 0.1,
                top: Math.random() * 100 + "%",
                left: Math.random() * 100 + "%",
                animation: `shimmer ${Math.random() * 3 + 2}s ease-in-out infinite`,
                animationDelay: Math.random() * 2 + "s",
              }}
            />
          ))}
        </div>

        {/* Glow orbs */}
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${badge.glow}20 0%, transparent 70%)`, filter: "blur(40px)" }} />
        <div className="absolute -bottom-10 right-10 w-60 h-60 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${badge.glow}15 0%, transparent 70%)`, filter: "blur(40px)" }} />

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">
          <div className="flex flex-col lg:flex-row items-center lg:items-end gap-8">

            {/* Left: Avatar + name */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 flex-grow">
              {/* Avatar */}
              <div className="relative" style={{ animation: "float 4s ease-in-out infinite" }}>
                <div
                  className="w-28 h-28 rounded-2xl flex items-center justify-center text-white font-black text-5xl relative overflow-hidden"
                  style={{
                    background: badge.gradient,
                    boxShadow: `0 0 30px ${badge.glow}, 0 0 60px ${badge.glow}40`,
                    border: `2px solid ${badge.tierColor}50`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                  <span className="relative z-10">{firstLetter}</span>
                </div>
                {/* Online indicator */}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-gray-900" />
              </div>

              {/* Name & info */}
              <div className="text-center sm:text-left pb-1">
                <h1 className="text-3xl font-black text-white tracking-tight">{formData.name || "Member"}</h1>
                <p className="text-gray-400 text-sm mt-1">{user.email}</p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                  {formData.rollNumber && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold text-gray-300" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
                      🎓 {formData.rollNumber}
                    </span>
                  )}
                  {formData.department && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold text-gray-300" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
                      🏛️ {formData.department}
                    </span>
                  )}
                  {user.github_username && (
                    <a
                      href={`https://github.com/${user.github_username}`}
                      target="_blank" rel="noreferrer"
                      className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all hover:opacity-80"
                      style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#e2e8f0" }}
                    >
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/></svg>
                      @{user.github_username}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Current badge (BGMI-style large emblem) */}
            <div className="flex-shrink-0">
              <BadgeEmblem badge={badge} size="lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ background: "rgba(255,255,255,0.03)", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-8 text-center">
            {[
              { label: "Events Attended", value: attendedEvents.length, icon: "✅" },
              { label: "Upcoming RSVPs", value: registeredEvents.length, icon: "📋" },
              { label: "Current Rank", value: badge.name, icon: badge.emoji },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <span className="text-2xl">{stat.icon}</span>
                <div className="text-left">
                  <p className="text-white font-black text-xl">{stat.value}</p>
                  <p className="text-gray-500 text-xs font-medium">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto px-6 mt-6">
        <div className="flex gap-1 p-1 rounded-2xl w-fit" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
          {(["overview", "events", "edit"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-sm font-bold capitalize transition-all duration-200 ${
                activeTab === tab
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
              style={activeTab === tab ? { background: badge.gradient, boxShadow: `0 0 12px ${badge.glow}40` } : {}}
            >
              {tab === "overview" ? "🏆 Rank" : tab === "events" ? "📅 Events" : "✏️ Edit Profile"}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-5xl mx-auto px-6 py-6 pb-16">

        {/* ── OVERVIEW TAB ────────────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="space-y-6">

            {/* Tier Progress Card */}
            <div className="rounded-3xl p-6 sm:p-8" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <h3 className="text-white font-black text-lg mb-6 flex items-center gap-2">
                <span style={{ color: badge.tierColor }}>⚔️</span> Tier Progress
              </h3>

              <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Progress to next */}
                <div className="flex-grow w-full">
                  {nextBadge ? (
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 text-sm font-semibold">{badge.emoji} {badge.name}</span>
                          <span className="text-gray-600">→</span>
                          <span className="text-sm font-semibold" style={{ color: nextBadge.tierColor }}>{nextBadge.emoji} {nextBadge.name}</span>
                        </div>
                        <span className="text-gray-400 text-sm font-bold tabular-nums">{eventsCount} / {nextBadge.min}</span>
                      </div>

                      {/* Progress bar */}
                      <div className="relative h-4 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                        <div
                          className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000"
                          style={{
                            width: `${progressPct}%`,
                            background: badge.gradient,
                            boxShadow: `0 0 10px ${badge.glow}`,
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0" style={{ animation: "shimmer 2s ease-in-out infinite" }} />
                        </div>
                      </div>
                      <p className="text-gray-500 text-xs mt-2">
                        Attend <span className="font-bold" style={{ color: nextBadge.tierColor }}>{nextBadge.min - eventsCount}</span> more event{nextBadge.min - eventsCount !== 1 ? "s" : ""} to reach <strong style={{ color: nextBadge.tierColor }}>{nextBadge.name}</strong>
                      </p>
                    </>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-4xl mb-3">⚡</p>
                      <p className="font-black text-xl text-white">Maximum Rank Achieved</p>
                      <p className="text-gray-400 text-sm mt-2">You are a legendary Ace. Truly elite.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* All Tiers Grid (BGMI-style showcase) */}
            <div className="rounded-3xl p-6 sm:p-8" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <h3 className="text-white font-black text-lg mb-6">🎖️ All Ranks</h3>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
                {BADGES.map((b) => {
                  const unlocked = eventsCount >= b.min;
                  const isCurrent = badge.name === b.name;
                  return (
                    <div
                      key={b.name}
                      className="flex flex-col items-center gap-2 cursor-default"
                      title={`${b.name}: ${b.min}+ events — ${b.description}`}
                    >
                      <div
                        className="relative"
                        style={{
                          filter: unlocked ? "none" : "grayscale(1) opacity(0.3)",
                          transform: isCurrent ? "scale(1.15)" : "scale(1)",
                          transition: "all 0.3s",
                        }}
                      >
                        <BadgeEmblem badge={b} size="sm" />
                        {isCurrent && (
                          <div
                            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-full h-0.5 rounded-full"
                            style={{ background: b.tierColor, boxShadow: `0 0 8px ${b.glow}` }}
                          />
                        )}
                      </div>
                      {isCurrent && (
                        <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: b.tierColor }}>
                          YOU
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="text-gray-600 text-xs mt-6 text-center">Grayed out ranks are locked. Attend more events to unlock them.</p>
            </div>
          </div>
        )}

        {/* ── EVENTS TAB ──────────────────────────────────────────────────── */}
        {activeTab === "events" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Attended */}
            <div className="rounded-3xl p-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <h3 className="text-white font-black text-base mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-green-900/60 text-green-400 flex items-center justify-center text-sm border border-green-700/40">✅</span>
                Events Attended
              </h3>
              {rsvpsLoading ? (
                <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" /></div>
              ) : attendedEvents.length === 0 ? (
                <div className="text-center py-10 text-gray-600">
                  <p className="text-3xl mb-2">🎯</p>
                  <p className="text-sm font-semibold text-gray-500">No events attended yet</p>
                  <p className="text-xs text-gray-600 mt-1">Attend events to earn badges!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {attendedEvents.map(event => (
                    <div key={event.slug} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)" }}>
                      <span className="text-xl">{event.icon}</span>
                      <div>
                        <p className="text-sm font-bold text-white">{event.name}</p>
                        <p className="text-xs text-gray-500">{event.date} · {event.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming */}
            <div className="rounded-3xl p-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <h3 className="text-white font-black text-base mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-indigo-900/60 text-indigo-400 flex items-center justify-center text-sm border border-indigo-700/40">📋</span>
                Upcoming Registrations
              </h3>
              {rsvpsLoading ? (
                <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" /></div>
              ) : registeredEvents.length === 0 ? (
                <div className="text-center py-10 text-gray-600">
                  <p className="text-3xl mb-2">📅</p>
                  <p className="text-sm font-semibold text-gray-500">No upcoming registrations</p>
                  <p className="text-xs text-gray-600 mt-1">Check the Events page to RSVP!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {registeredEvents.map(event => (
                    <div key={event.slug} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)" }}>
                      <span className="text-xl">{event.icon}</span>
                      <div className="flex-grow">
                        <p className="text-sm font-bold text-white">{event.name}</p>
                        <p className="text-xs text-gray-500">{event.date} · {event.type}</p>
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-black rounded-full uppercase tracking-wider" style={{ background: "rgba(99,102,241,0.2)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.3)" }}>RSVP'd</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── EDIT TAB ────────────────────────────────────────────────────── */}
        {activeTab === "edit" && (
          <div className="rounded-3xl p-6 sm:p-8 max-w-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <h3 className="text-white font-black text-lg mb-6">Edit Profile</h3>
            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { label: "Full Name", name: "name", placeholder: "Your full name", required: true },
                  { label: "Roll Number / Campus ID", name: "rollNumber", placeholder: "e.g. 44226", required: true },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{field.label}</label>
                    <input
                      type="text" name={field.name}
                      required={field.required}
                      value={formData[field.name as keyof typeof formData]}
                      onChange={handleInputChange}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 rounded-xl text-sm text-white font-medium outline-none transition-all"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        caretColor: badge.tierColor,
                      }}
                      onFocus={(e) => { e.target.style.border = `1px solid ${badge.tierColor}60`; e.target.style.boxShadow = `0 0 0 3px ${badge.glow}20`; }}
                      onBlur={(e) => { e.target.style.border = "1px solid rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Department</label>
                <input
                  type="text" name="department" required
                  value={formData.department}
                  onChange={handleInputChange}
                  placeholder="e.g. CSE, ECE, ISE"
                  className="w-full px-4 py-3 rounded-xl text-sm text-white font-medium outline-none transition-all"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                  onFocus={(e) => { e.target.style.border = `1px solid ${badge.tierColor}60`; e.target.style.boxShadow = `0 0 0 3px ${badge.glow}20`; }}
                  onBlur={(e) => { e.target.style.border = "1px solid rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Registered Email</label>
                <input
                  type="email" disabled value={user.email || ""}
                  className="w-full px-4 py-3 rounded-xl text-sm text-gray-600 outline-none cursor-not-allowed"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
                />
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="submit" disabled={saving}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl font-black text-white text-sm transition-all disabled:opacity-60"
                  style={{ background: badge.gradient, boxShadow: `0 0 20px ${badge.glow}60` }}
                >
                  {saving ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
                  ) : (
                    <>Save Changes →</>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
