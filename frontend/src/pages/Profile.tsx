import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";

// ─── Badge System ─────────────────────────────────────────────────────────────
const BADGES = [
  { name: "Beginner",  min: 0,  color: "#6b7280", light: "#f3f4f6", tag: "bg-gray-100 text-gray-600 border-gray-200" },
  { name: "Bronze",    min: 1,  color: "#b45309", light: "#fffbeb", tag: "bg-amber-50 text-amber-700 border-amber-200" },
  { name: "Silver",    min: 2,  color: "#4b5563", light: "#f9fafb", tag: "bg-gray-100 text-gray-700 border-gray-300" },
  { name: "Gold",      min: 3,  color: "#d97706", light: "#fffbeb", tag: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  { name: "Platinum",  min: 5,  color: "#0891b2", light: "#ecfeff", tag: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  { name: "Diamond",   min: 8,  color: "#4f46e5", light: "#eef2ff", tag: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { name: "Crown",     min: 12, color: "#7c3aed", light: "#f5f3ff", tag: "bg-violet-50 text-violet-700 border-violet-200" },
  { name: "Ace",       min: 18, color: "#dc2626", light: "#fef2f2", tag: "bg-red-50 text-red-700 border-red-200" },
];

const BADGE_ICONS: Record<string, string> = {
  Beginner: "🌱", Bronze: "🥉", Silver: "🥈", Gold: "🥇",
  Platinum: "💎", Diamond: "💠", Crown: "👑", Ace: "⚡",
};

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
      <div className="flex-grow w-full flex items-center justify-center bg-white">
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
    <div className="flex-grow w-full bg-gray-50 min-h-screen">

      {/* ── Top Identity Strip ─────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">

            {/* Avatar */}
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl font-black flex-shrink-0"
              style={{ background: badge.color }}
            >
              {firstLetter}
            </div>

            {/* Name / details */}
            <div className="flex-grow min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-xl font-bold text-gray-900 truncate">{formData.name || "Member"}</h1>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.tag}`}>
                  {BADGE_ICONS[badge.name]} {badge.name}
                </span>
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

            {/* Quick stats */}
            <div className="flex gap-6 flex-shrink-0">
              {[
                { n: attendedEvents.length, label: "Attended" },
                { n: registeredEvents.length, label: "Registered" },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl font-black text-gray-900">{s.n}</p>
                  <p className="text-xs text-gray-400 font-medium">{s.label}</p>
                </div>
              ))}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Current rank card */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Current Rank</p>
                <div className="flex flex-col items-center text-center gap-3 py-2">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-4xl font-black shadow-sm"
                    style={{ background: badge.color }}
                  >
                    {BADGE_ICONS[badge.name]}
                  </div>
                  <div>
                    <p className="text-xl font-black text-gray-900">{badge.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{eventsCount} event{eventsCount !== 1 ? "s" : ""} attended</p>
                  </div>
                </div>

                {nextBadge && (
                  <div className="mt-5 pt-5 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs text-gray-400">Next: <strong className="text-gray-700">{nextBadge.name}</strong></span>
                      <span className="text-xs text-gray-400 tabular-nums">{eventsCount}/{nextBadge.min}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${progressPct}%`, background: badge.color }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      {nextBadge.min - eventsCount} more event{nextBadge.min - eventsCount !== 1 ? "s" : ""} to unlock
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* All ranks */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">All Ranks</p>
                <div className="grid grid-cols-4 gap-3">
                  {BADGES.map(b => {
                    const unlocked = eventsCount >= b.min;
                    const isCurrent = badge.name === b.name;
                    return (
                      <div
                        key={b.name}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all ${
                          isCurrent
                            ? "border-gray-900 bg-gray-50 shadow-sm"
                            : unlocked
                            ? "border-gray-100 bg-white"
                            : "border-gray-100 bg-gray-50 opacity-40"
                        }`}
                        title={`${b.name}: ${b.min}+ events`}
                      >
                        <span className="text-xl">{BADGE_ICONS[b.name]}</span>
                        <span className="text-[10px] font-semibold text-gray-600 leading-tight">{b.name}</span>
                        {isCurrent && (
                          <span className="text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full" style={{ background: badge.color }}>
                            YOU
                          </span>
                        )}
                        {!unlocked && (
                          <span className="text-[9px] text-gray-400">{b.min}+ events</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
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
                    placeholder="Your full name" className={inputCls} />
                </Field>
                <Field label="Roll Number / Campus ID">
                  <input type="text" name="rollNumber" required value={formData.rollNumber}
                    onChange={e => setFormData(p => ({ ...p, rollNumber: e.target.value }))}
                    placeholder="e.g. 44226" className={inputCls} />
                </Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Department">
                  <input type="text" name="department" required value={formData.department}
                    onChange={e => setFormData(p => ({ ...p, department: e.target.value }))}
                    placeholder="e.g. CSE, ECE, ISE" className={inputCls} />
                </Field>
                <Field label="Email">
                  <input type="email" disabled value={user.email || ""}
                    className={`${inputCls} bg-gray-50 text-gray-400 cursor-not-allowed`} />
                </Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="GitHub Username">
                  <input type="text" name="githubUsername" value={formData.githubUsername}
                    onChange={e => {
                      // Extract username if a full URL is pasted
                      let val = e.target.value;
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
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm shadow-red-700/20"
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
