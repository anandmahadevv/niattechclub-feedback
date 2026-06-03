import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";

// ─── Badge System ────────────────────────────────────────────────────────────
const BADGES = [
  { name: "Beginner",  min: 0,  icon: "🌱", color: "from-gray-400 to-gray-500",    text: "text-gray-600",    bg: "bg-gray-100",     border: "border-gray-300" },
  { name: "Bronze",    min: 1,  icon: "🥉", color: "from-amber-600 to-yellow-700", text: "text-amber-700",   bg: "bg-amber-50",     border: "border-amber-300" },
  { name: "Silver",    min: 2,  icon: "🥈", color: "from-slate-400 to-slate-500",  text: "text-slate-600",   bg: "bg-slate-100",    border: "border-slate-300" },
  { name: "Gold",      min: 3,  icon: "🥇", color: "from-yellow-400 to-amber-500", text: "text-yellow-700",  bg: "bg-yellow-50",    border: "border-yellow-300" },
  { name: "Platinum",  min: 5,  icon: "💎", color: "from-cyan-400 to-sky-500",     text: "text-cyan-700",    bg: "bg-cyan-50",      border: "border-cyan-300" },
  { name: "Diamond",   min: 8,  icon: "💠", color: "from-blue-400 to-indigo-500",  text: "text-indigo-700",  bg: "bg-indigo-50",    border: "border-indigo-300" },
  { name: "Crown",     min: 12, icon: "👑", color: "from-purple-500 to-violet-600",text: "text-purple-700",  bg: "bg-purple-50",    border: "border-purple-300" },
  { name: "Ace",       min: 18, icon: "⚡", color: "from-red-500 to-rose-600",     text: "text-red-700",     bg: "bg-red-50",       border: "border-red-300" },
];

function getBadge(eventsAttended: number) {
  let badge = BADGES[0];
  for (const b of BADGES) {
    if (eventsAttended >= b.min) badge = b;
  }
  return badge;
}

function getNextBadge(eventsAttended: number) {
  for (const b of BADGES) {
    if (eventsAttended < b.min) return b;
  }
  return null;
}

// ─── Event Definitions ───────────────────────────────────────────────────────
const ALL_EVENTS = [
  {
    slug: "ai-workshop",
    name: "AI Tools & Innovation Workshop",
    date: "April 30, 2026",
    type: "Workshop",
    status: "past",
    icon: "🤖",
  },
  {
    slug: "promptwars",
    name: "PromptWars Hackathon",
    date: "Aug 2026 (TBD)",
    type: "Hackathon",
    status: "upcoming",
    icon: "⚡",
  },
];

export default function Profile() {
  const { user, loading, updateLocalUser } = useAuth();
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: "", rollNumber: "", department: "" });
  const [userRsvps, setUserRsvps] = useState<{ event_slug: string; created_at: string }[]>([]);
  const [rsvpsLoading, setRsvpsLoading] = useState(true);

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
    const { data } = await supabase
      .from("rsvps")
      .select("event_slug, created_at")
      .eq("email", email);
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
      <div className="flex-grow w-full flex items-center justify-center py-20 bg-white">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const attendedSlugs = new Set(
    userRsvps.filter(r => ALL_EVENTS.find(e => e.slug === r.event_slug && e.status === "past")).map(r => r.event_slug)
  );
  const registeredSlugs = new Set(
    userRsvps.filter(r => ALL_EVENTS.find(e => e.slug === r.event_slug && e.status === "upcoming")).map(r => r.event_slug)
  );

  const attendedEvents = ALL_EVENTS.filter(e => attendedSlugs.has(e.slug));
  const registeredEvents = ALL_EVENTS.filter(e => registeredSlugs.has(e.slug));
  const eventsAttendedCount = attendedEvents.length;

  const badge = getBadge(eventsAttendedCount);
  const nextBadge = getNextBadge(eventsAttendedCount);
  const firstLetter = (formData.name || user.email || "U").charAt(0).toUpperCase();

  return (
    <div className="flex-grow w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40">
      {/* Header */}
      <div className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span className="text-2xl">👤</span> My Profile
          </h1>
          <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
            {badge.icon} {badge.name}
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">

        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${badge.color} text-white font-black text-4xl flex items-center justify-center shadow-lg flex-shrink-0`}>
              {firstLetter}
            </div>
            <div className="text-center sm:text-left flex-grow">
              <h2 className="text-2xl font-black text-gray-900">{formData.name || "Member"}</h2>
              <p className="text-sm text-gray-500 mt-1">{user.email}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                {formData.rollNumber && (
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                    🎓 {formData.rollNumber}
                  </span>
                )}
                {formData.department && (
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                    🏛️ {formData.department}
                  </span>
                )}
                {user.github_username && (
                  <a
                    href={`https://github.com/${user.github_username}`}
                    target="_blank" rel="noreferrer"
                    className="px-2.5 py-1 bg-gray-900 text-white rounded-full text-xs font-semibold flex items-center gap-1 hover:bg-gray-700 transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/></svg>
                    @{user.github_username}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Badge Progress Card */}
        <div className={`bg-white rounded-3xl shadow-sm border ${badge.border} p-8`}>
          <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
            🏆 Badge & Progress
          </h3>
          <div className="flex flex-col sm:flex-row items-center gap-8">
            {/* Current Badge */}
            <div className={`flex flex-col items-center gap-3 p-6 rounded-2xl ${badge.bg} border ${badge.border} min-w-[140px]`}>
              <span className="text-5xl">{badge.icon}</span>
              <div className="text-center">
                <p className={`text-xl font-black ${badge.text}`}>{badge.name}</p>
                <p className="text-xs text-gray-500 mt-1">{eventsAttendedCount} event{eventsAttendedCount !== 1 ? "s" : ""} attended</p>
              </div>
            </div>

            {/* Progress bar to next badge */}
            <div className="flex-grow w-full">
              {nextBadge ? (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-700">Progress to {nextBadge.icon} {nextBadge.name}</span>
                    <span className="text-sm font-bold text-gray-500">{eventsAttendedCount}/{nextBadge.min}</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${badge.color} transition-all duration-700`}
                      style={{ width: `${Math.min(100, (eventsAttendedCount / nextBadge.min) * 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Attend {nextBadge.min - eventsAttendedCount} more event{nextBadge.min - eventsAttendedCount !== 1 ? "s" : ""} to unlock {nextBadge.name}</p>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-2xl mb-1">⚡</p>
                  <p className="font-black text-gray-900">You've reached the highest rank!</p>
                  <p className="text-sm text-gray-500 mt-1">You are an Ace. Legendary status.</p>
                </div>
              )}

              {/* All badge levels */}
              <div className="flex flex-wrap gap-2 mt-5">
                {BADGES.map((b) => {
                  const unlocked = eventsAttendedCount >= b.min;
                  const current = badge.name === b.name;
                  return (
                    <div
                      key={b.name}
                      title={`${b.name}: ${b.min}+ events`}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                        current
                          ? `${b.bg} ${b.text} ${b.border} ring-2 ring-offset-1 ${b.border}`
                          : unlocked
                          ? `${b.bg} ${b.text} ${b.border} opacity-70`
                          : "bg-gray-50 text-gray-400 border-gray-200 opacity-50"
                      }`}
                    >
                      {b.icon} {b.name}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Two column: Events Attended + Currently Registered */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Events Attended */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-green-100 text-green-600 flex items-center justify-center text-sm">✅</span>
              Events Attended
            </h3>
            {rsvpsLoading ? (
              <div className="flex justify-center py-6"><div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"/></div>
            ) : attendedEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p className="text-3xl mb-2">🎯</p>
                <p className="text-sm font-medium">No events attended yet</p>
                <p className="text-xs mt-1">Attend events to earn badges!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {attendedEvents.map(event => (
                  <div key={event.slug} className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-100">
                    <span className="text-xl">{event.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{event.name}</p>
                      <p className="text-xs text-gray-500">{event.date} · {event.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Currently Registered */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">📋</span>
              Upcoming Registrations
            </h3>
            {rsvpsLoading ? (
              <div className="flex justify-center py-6"><div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"/></div>
            ) : registeredEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p className="text-3xl mb-2">📅</p>
                <p className="text-sm font-medium">Not registered for any upcoming events</p>
                <p className="text-xs mt-1">Check out the Events page!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {registeredEvents.map(event => (
                  <div key={event.slug} className="flex items-center gap-3 p-3 rounded-xl bg-indigo-50 border border-indigo-100">
                    <span className="text-xl">{event.icon}</span>
                    <div className="flex-grow">
                      <p className="text-sm font-bold text-gray-900">{event.name}</p>
                      <p className="text-xs text-gray-500">{event.date} · {event.type}</p>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-100 text-indigo-700 rounded-full">RSVP'd</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
            ✏️ Edit Profile
          </h3>
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                <input
                  type="text" name="name" required value={formData.name} onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all text-sm text-gray-900 font-medium"
                  placeholder="Full Name"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Registered Email</label>
                <input
                  type="email" disabled value={user.email || ""}
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-gray-400 text-sm outline-none cursor-not-allowed"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Roll Number / Campus ID</label>
                <input
                  type="text" name="rollNumber" required value={formData.rollNumber} onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all text-sm text-gray-900 font-medium"
                  placeholder="e.g. 44226"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Department</label>
                <input
                  type="text" name="department" required value={formData.department} onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all text-sm text-gray-900 font-medium"
                  placeholder="e.g. CSE, ECE, ISE"
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit" disabled={saving}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Saving...</>
                ) : (
                  <>Save Changes <span>→</span></>
                )}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
