import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";

export default function Profile() {
  const { user, loading, updateLocalUser } = useAuth();
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    department: "",
  });

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login?redirect=/profile");
      } else {
        // Initialize form with custom user fields
        setFormData({
          name: user.name || "",
          rollNumber: user.roll_number || "",
          department: user.department || "",
        });
      }
    }
  }, [user, loading, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    const toastId = toast.loading("Updating profile details...");

    try {
      const { error } = await supabase.rpc("update_user_profile", {
        user_email: user.email,
        new_name: formData.name,
        new_roll_number: formData.rollNumber,
        new_department: formData.department,
      });

      if (error) throw error;

      updateLocalUser({ ...user, name: formData.name, roll_number: formData.rollNumber, department: formData.department });

      toast.success("Profile updated successfully!", { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to update profile.", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex-grow w-full flex items-center justify-center py-20 bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-slate-950 dark:via-zinc-900 dark:to-black">
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const firstLetter = formData.name ? formData.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || "U";

  return (
    <div className="flex-grow w-full flex flex-col items-center justify-start py-16 px-6 relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-slate-950 dark:via-zinc-900 dark:to-black">
      {/* Brand ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 dark:bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-2xl bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-gray-200/55 dark:border-zinc-800/60 shadow-2xl rounded-3xl p-8 md:p-10 relative z-10">
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-gray-200/60 dark:border-zinc-800/60 mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-600 to-orange-500 text-white font-black text-3xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
            {firstLetter}
          </div>
          <div className="text-center sm:text-left flex-grow">
            <h1 className="text-2xl font-black text-gray-950 dark:text-white leading-tight">
              {formData.name || "Member Profile"}
            </h1>
            <p className="text-sm font-semibold text-red-600 dark:text-red-400 mt-1">
              {formData.rollNumber ? `${formData.rollNumber} • ${formData.department}` : "Update your profile info below"}
            </p>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
              Registered email: {user.email}
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-600 dark:text-zinc-400 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-500/50 outline-none transition-all text-sm text-gray-950 dark:text-white font-medium"
                placeholder="Full Name"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-600 dark:text-zinc-400 uppercase tracking-wider mb-2">
                Registered Email
              </label>
              <input
                type="email"
                disabled
                value={user.email || ""}
                className="w-full px-4 py-3 rounded-xl border border-gray-150 dark:border-zinc-850 bg-gray-50 dark:bg-zinc-900/40 text-gray-400 dark:text-zinc-500 text-sm font-medium outline-none cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-600 dark:text-zinc-400 uppercase tracking-wider mb-2">
                Roll Number
              </label>
              <input
                type="text"
                name="rollNumber"
                required
                value={formData.rollNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-500/50 outline-none transition-all text-sm text-gray-950 dark:text-white font-medium"
                placeholder="e.g. 21CS045"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 dark:text-zinc-400 uppercase tracking-wider mb-2">
                Department
              </label>
              <input
                type="text"
                name="department"
                required
                value={formData.department}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-500/50 outline-none transition-all text-sm text-gray-950 dark:text-white font-medium"
                placeholder="e.g. CSE, ECE, ISE"
              />
            </div>
          </div>

<div className="pt-4 border-t border-gray-200/60 dark:border-zinc-800/60 flex items-center justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-red-600 to-orange-500 hover:opacity-90 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span>{saving ? "Saving..." : "Save Changes"}</span>
              <i className={`fas ${saving ? "fa-circle-notch fa-spin" : "fa-save"}`} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
