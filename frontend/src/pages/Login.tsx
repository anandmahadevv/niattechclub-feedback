import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    rollNumber: "",
    department: "",
    bio: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading(isSignUp ? "Creating account..." : "Signing in...");

    try {
      if (isSignUp) {
        // Sign Up
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
              roll_number: formData.rollNumber,
              department: formData.department,
              bio: formData.bio,
            },
          },
        });

        if (error) throw error;

        // If automatic sign-in isn't configured/possible or requires verification
        if (data.session) {
          toast.success("Account created successfully!", { id: toastId });
          navigate(redirect);
        } else {
          toast.success("Sign up successful! Please check your email for verification.", { id: toastId });
          setIsSignUp(false);
        }
      } else {
        // Sign In
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        toast.success("Signed in successfully!", { id: toastId });
        navigate(redirect);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "An authentication error occurred.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow w-full flex flex-col items-center justify-center py-16 px-6 relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-slate-950 dark:via-zinc-900 dark:to-black">
      {/* Subtle brand ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/5 dark:bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-gray-200/55 dark:border-zinc-800/60 shadow-2xl rounded-3xl p-8 relative z-10 transition-all">
        {/* Toggle tabs */}
        <div className="flex bg-gray-100 dark:bg-zinc-850 p-1.5 rounded-2xl mb-8">
          <button
            type="button"
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all duration-250 ${
              !isSignUp
                ? "bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all duration-250 ${
              isSignUp
                ? "bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Sign Up
          </button>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-black tracking-tight text-gray-950 dark:text-white">
            {isSignUp ? "Create an Account" : "Welcome Back"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
            {isSignUp ? "Join the NIAT Tech Club community" : "Sign in to access events and showcase"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-500/50 outline-none transition-all text-sm text-gray-950 dark:text-white"
              placeholder="you@domain.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-500/50 outline-none transition-all text-sm text-gray-950 dark:text-white"
              placeholder="••••••••"
            />
          </div>

          {isSignUp && (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-500/50 outline-none transition-all text-sm text-gray-950 dark:text-white"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    name="rollNumber"
                    required
                    value={formData.rollNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-500/50 outline-none transition-all text-sm text-gray-950 dark:text-white"
                    placeholder="e.g. 21CS045"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    required
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-500/50 outline-none transition-all text-sm text-gray-950 dark:text-white"
                    placeholder="e.g. CSE, ISE"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                  Bio / About You
                </label>
                <textarea
                  name="bio"
                  rows={2}
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-500/50 outline-none transition-all text-sm text-gray-950 dark:text-white resize-none"
                  placeholder="Share a short bio..."
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:opacity-90 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span>{isSignUp ? "Register" : "Sign In"}</span>
            <i className={`fas ${loading ? "fa-circle-notch fa-spin" : "fa-sign-in-alt"}`} />
          </button>
        </form>
      </div>
    </div>
  );
}
