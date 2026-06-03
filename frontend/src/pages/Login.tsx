import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { toast } from "sonner";

// ─── Small SVG icon helpers ───────────────────────────────────────────────────
const IconMail = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
  </svg>
);
const IconLock = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
  </svg>
);
const IconUser = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);
const IconID = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
  </svg>
);
const IconBuildingOffice = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
  </svg>
);
const IconEye = ({ off }: { off?: boolean }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    {off ? (
      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478zM5.364 7.22l1.395 1.394A4 4 0 009 13.528v.001l-3.16-3.16a4.002 4.002 0 01-.476-3.148zM10 15c-1.17 0-2.267-.32-3.2-.873l-1.435 1.435A9.955 9.955 0 0010 17c4.478 0 8.268-2.943 9.542-7a10.049 10.049 0 00-1.904-3.479l-1.432 1.432A4.001 4.001 0 0110 15z" clipRule="evenodd" />
    ) : (
      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10z" fillRule="evenodd" clipRule="evenodd" />
    )}
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

// ─── Branded left panel ────────────────────────────────────────────────────────
function BrandPanel({ isSignUp }: { isSignUp: boolean }) {
  return (
    <div
      className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #0f172a 0%, #1e293b 50%, #7f1d1d 100%)",
        minHeight: "600px",
      }}
    >
      {/* Decorative blobs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #ef4444, transparent)" }} />
      <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, #f97316, transparent)" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #fbbf24, transparent)" }} />

      {/* Logo */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg text-white"
            style={{ background: "linear-gradient(135deg, #ef4444, #f97316)" }}
          >
            N
          </div>
          <div>
            <div className="text-white font-black text-sm tracking-tight">NIAT Tech Club</div>
            <div className="text-red-300/70 text-xs font-medium">Member Portal</div>
          </div>
        </div>

        <h2 className="text-white font-black text-4xl leading-tight mb-4" style={{ letterSpacing: "-0.02em" }}>
          {isSignUp ? "Join the\nCommunity." : "Welcome\nBack."}
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
          {isSignUp
            ? "Create your account to submit projects, share event ideas, and connect with fellow tech enthusiasts."
            : "Sign in to access the NIAT Tech Club showcase, event ideas, and your member profile."}
        </p>
      </div>

      {/* Feature highlights */}
      <div className="relative z-10 space-y-4">
        {[
          { icon: "🚀", text: "Submit & showcase your projects" },
          { icon: "💡", text: "Share event ideas with the club" },
          { icon: "👤", text: "Personalized member profile" },
          { icon: "🔒", text: "Secure, 2-month session" },
        ].map((f) => (
          <div key={f.text} className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-sm flex-shrink-0">
              {f.icon}
            </div>
            <span className="text-slate-300 text-sm">{f.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Floating-label input ──────────────────────────────────────────────────────
interface FloatingInputProps {
  id: string;
  name: string;
  type?: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
  error?: string;
  hint?: string;
  autoComplete?: string;
  rightElement?: React.ReactNode;
}

function FloatingInput({
  id, name, type = "text", label, value, onChange,
  required, placeholder, icon, error, hint, autoComplete, rightElement,
}: FloatingInputProps) {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;
  const lifted = focused || hasValue;

  return (
    <div className="relative">
      <div
        className="relative flex items-center rounded-xl border transition-all duration-200"
        style={{
          borderColor: error ? "#ef4444" : focused ? "#ef4444" : "#e2e8f0",
          boxShadow: focused ? `0 0 0 3px ${error ? "#fecaca" : "#fee2e2"}` : "none",
          background: "#fff",
        }}
      >
        {icon && (
          <div
            className="pl-4 flex-shrink-0 transition-colors duration-200"
            style={{ color: focused ? "#ef4444" : "#94a3b8" }}
          >
            {icon}
          </div>
        )}
        <div className="relative flex-1">
          <label
            htmlFor={id}
            className="absolute left-4 pointer-events-none select-none transition-all duration-200 font-medium"
            style={{
              top: lifted ? "6px" : "50%",
              transform: lifted ? "translateY(0)" : "translateY(-50%)",
              fontSize: lifted ? "0.65rem" : "0.85rem",
              color: error ? "#ef4444" : focused ? "#ef4444" : "#94a3b8",
              letterSpacing: lifted ? "0.06em" : "0",
              textTransform: lifted ? "uppercase" : "none",
            }}
          >
            {label}{required && <span className="ml-0.5" style={{ color: "#ef4444" }}>*</span>}
          </label>
          <input
            id={id}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            autoComplete={autoComplete}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={focused ? placeholder : ""}
            className="w-full bg-transparent outline-none text-gray-900 font-medium text-sm"
            style={{
              paddingTop: lifted ? "22px" : "14px",
              paddingBottom: "10px",
              paddingLeft: "16px",
              paddingRight: rightElement ? "48px" : "16px",
            }}
          />
        </div>
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-xs font-medium flex items-center gap-1" style={{ color: "#ef4444" }}>
          <svg viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3 flex-shrink-0">
            <path fillRule="evenodd" d="M6 0a6 6 0 100 12A6 6 0 006 0zm0 8.25a.75.75 0 110 1.5.75.75 0 010-1.5zm.75-4.5a.75.75 0 00-1.5 0v3a.75.75 0 001.5 0v-3z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="mt-1.5 text-xs" style={{ color: "#94a3b8" }}>{hint}</p>
      )}
    </div>
  );
}

// ─── Password strength pill ────────────────────────────────────────────────────
function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const len = password.length;
  const hasUpper = /[A-Z]/.test(password);
  const hasNum = /[0-9]/.test(password);
  const hasSpec = /[^A-Za-z0-9]/.test(password);
  const score = [len >= 8, hasUpper, hasNum, hasSpec].filter(Boolean).length;

  const levels = [
    { label: "Too short", color: "#ef4444" },
    { label: "Weak", color: "#f97316" },
    { label: "Fair", color: "#eab308" },
    { label: "Good", color: "#22c55e" },
    { label: "Strong", color: "#16a34a" },
  ];
  const { label, color } = levels[Math.min(score, 4)];

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{ backgroundColor: i < score ? color : "#f1f5f9" }}
          />
        ))}
      </div>
      <p className="text-xs font-semibold" style={{ color }}>{label}</p>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function Login() {
  const { signIn, signUp, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [isSignUp, setIsSignUp] = useState(false);
  const [forgotMode, setForgotMode] = useState<'none' | 'email' | 'otp'>('none');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [resetData, setResetData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    generatedOtp: ""
  });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    rollNumber: "",
    department: "",
    bio: "",
  });

  // Clear errors when switching modes
  useEffect(() => {
    setErrors({});
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      rollNumber: "",
      department: "",
      bio: "",
    });
    setShowPassword(false);
    setShowConfirm(false);
  }, [isSignUp]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleResetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResetData((prev) => ({ ...prev, [name]: value }));
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotMode === 'email') {
      if (!resetData.email) return toast.error("Please enter your email");
      setLoading(true);
      const toastId = toast.loading("Sending reset code...");
      try {
        const generated = Math.floor(100000 + Math.random() * 900000).toString();
        // Determine backend URL
        const backendUrl = window.location.hostname === "localhost" ? "http://localhost:5000" : window.location.origin;
        const response = await fetch(`${backendUrl}/api/send-reset-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: resetData.email, otp: generated })
        });
        if (!response.ok) throw new Error("Failed to send email. Check if backend is running.");
        setResetData(prev => ({ ...prev, generatedOtp: generated }));
        setForgotMode('otp');
        toast.success("Reset code sent to your email!", { id: toastId });
      } catch (err: any) {
        toast.error(err.message, { id: toastId });
      } finally {
        setLoading(false);
      }
    } else if (forgotMode === 'otp') {
      if (!resetData.otp || !resetData.newPassword) return toast.error("Please fill all fields");
      if (resetData.otp !== resetData.generatedOtp) return toast.error("Invalid reset code");
      if (resetData.newPassword.length < 6) return toast.error("Password must be at least 6 characters");
      
      setLoading(true);
      const toastId = toast.loading("Resetting password...");
      try {
        if (!resetPassword) throw new Error("Reset password function not available");
        await resetPassword(resetData.email, resetData.newPassword);
        toast.success("Password reset successfully! Please log in.", { id: toastId });
        setForgotMode('none');
        setResetData({ email: '', otp: '', newPassword: '', generatedOtp: '' });
      } catch (err: any) {
        toast.error(err.message, { id: toastId });
      } finally {
        setLoading(false);
      }
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Enter a valid email address.";

    if (!formData.password) newErrors.password = "Password is required.";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";

    if (isSignUp) {
      if (!formData.confirmPassword)
        newErrors.confirmPassword = "Please confirm your password.";
      else if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match.";

      if (!formData.name.trim()) newErrors.name = "Full name is required.";
      if (!formData.rollNumber.trim()) newErrors.rollNumber = "Roll number is required.";
      if (!formData.department.trim()) newErrors.department = "Department is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const toastId = toast.loading(isSignUp ? "Creating your account…" : "Signing you in…");

    try {
      if (isSignUp) {
        await signUp(
          formData.email,
          formData.password,
          formData.name,
          formData.rollNumber,
          formData.department,
          formData.bio
        );
        toast.success("Account created! You can now sign in.", { id: toastId });
        setIsSignUp(false);
      } else {
        await signIn(formData.email, formData.password);
        toast.success("Welcome back! Signed in successfully.", { id: toastId });
        navigate(redirect);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong. Please try again.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const EyeToggle = ({ show, onToggle }: { show: boolean; onToggle: () => void }) => (
    <button
      type="button"
      onClick={onToggle}
      className="p-1.5 rounded-lg transition-colors"
      style={{ color: "#94a3b8" }}
      tabIndex={-1}
      aria-label={show ? "Hide password" : "Show password"}
    >
      <IconEye off={show} />
    </button>
  );

  return (
    <div
      className="flex-grow w-full flex items-center justify-center p-4 sm:p-6"
      style={{ background: "linear-gradient(135deg, #f8fafc 0%, #fef2f2 50%, #fff7ed 100%)", minHeight: "100vh" }}
    >
      {/* Ambient blobs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #fca5a5, transparent)", filter: "blur(60px)" }} />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #fdba74, transparent)", filter: "blur(60px)" }} />
      </div>

      <div
        className="relative w-full max-w-4xl rounded-3xl overflow-hidden"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)" }}
      >
        <div className="grid lg:grid-cols-2">
          {/* ── Left Brand Panel ── */}
          <BrandPanel isSignUp={isSignUp} />

          {/* ── Right Form Panel ── */}
          <div className="bg-white p-8 sm:p-10 flex flex-col justify-center">
            {/* Mobile logo */}
            <div className="flex items-center gap-2.5 mb-8 lg:hidden">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-sm"
                style={{ background: "linear-gradient(135deg, #ef4444, #f97316)" }}
              >N</div>
              <span className="font-black text-sm text-gray-900">NIAT Tech Club</span>
            </div>

            {forgotMode === 'none' ? (
              <>
                {/* Tab switcher */}
                <div className="flex bg-slate-100 p-1 rounded-2xl mb-8">
                  {(["Sign In", "Sign Up"] as const).map((tab, i) => {
                    const active = (i === 0 && !isSignUp) || (i === 1 && isSignUp);
                    return (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setIsSignUp(i === 1)}
                        className="flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-200"
                        style={{
                          background: active ? "#fff" : "transparent",
                          color: active ? "#0f172a" : "#64748b",
                          boxShadow: active ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                        }}
                      >
                        {tab}
                      </button>
                    );
                  })}
                </div>

                {/* Heading */}
                <div className="mb-7">
                  <h1 className="text-2xl font-black text-gray-900" style={{ letterSpacing: "-0.02em" }}>
                    {isSignUp ? "Create Account" : "Welcome Back"}
                  </h1>
                  <p className="text-sm text-slate-500 mt-1">
                    {isSignUp
                      ? "Fill in the details below to join the club."
                      : "Enter your credentials to access your account."}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Email */}
              <FloatingInput
                id="email" name="email" type="email" label="Email Address"
                value={formData.email} onChange={handleChange}
                required placeholder="you@example.com"
                icon={<IconMail />} error={errors.email}
                autoComplete="email"
              />

              {/* Password */}
              <div className="relative">
                <FloatingInput
                  id="password" name="password"
                  type={showPassword ? "text" : "password"}
                  label="Password" value={formData.password}
                  onChange={handleChange} required placeholder="Min. 6 characters"
                  icon={<IconLock />} error={errors.password}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  rightElement={<EyeToggle show={showPassword} onToggle={() => setShowPassword(v => !v)} />}
                />
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => setForgotMode('email')}
                    className="absolute right-0 -bottom-6 text-xs font-semibold text-red-600 hover:text-red-700 transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              {isSignUp && <PasswordStrength password={formData.password} />}

              {/* Confirm Password (sign-up only) */}
              {isSignUp && (
                <FloatingInput
                  id="confirmPassword" name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  label="Confirm Password" value={formData.confirmPassword}
                  onChange={handleChange} required placeholder="Repeat your password"
                  icon={<IconLock />} error={errors.confirmPassword}
                  autoComplete="new-password"
                  rightElement={
                    formData.confirmPassword && !errors.confirmPassword && formData.password === formData.confirmPassword
                      ? (
                        <span className="flex items-center justify-center w-6 h-6 rounded-full" style={{ background: "#22c55e" }}>
                          <span className="text-white"><IconCheck /></span>
                        </span>
                      )
                      : <EyeToggle show={showConfirm} onToggle={() => setShowConfirm(v => !v)} />
                  }
                />
              )}

              {/* Sign-up extra fields */}
              {isSignUp && (
                <>
                  <div className="pt-2 pb-1">
                    <div className="h-px bg-slate-100" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-3">Profile Details</p>
                  </div>

                  {/* Full Name */}
                  <FloatingInput
                    id="name" name="name" label="Full Name"
                    value={formData.name} onChange={handleChange}
                    required placeholder="e.g. Riya Sharma"
                    icon={<IconUser />} error={errors.name}
                    autoComplete="name"
                  />

                  {/* Roll No + Department grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <FloatingInput
                      id="rollNumber" name="rollNumber" label="Roll Number"
                      value={formData.rollNumber} onChange={handleChange}
                      required placeholder="21CS045"
                      icon={<IconID />} error={errors.rollNumber}
                    />
                    <FloatingInput
                      id="department" name="department" label="Department"
                      value={formData.department} onChange={handleChange}
                      required placeholder="CSE / ISE"
                      icon={<IconBuildingOffice />} error={errors.department}
                    />
                  </div>

                  {/* Bio (simple textarea — no floating label needed) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Bio / About You <span className="text-slate-300 normal-case tracking-normal font-normal">(optional)</span>
                    </label>
                    <textarea
                      name="bio" id="bio" rows={2}
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="A short intro about yourself, your stack, interests…"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-gray-900 outline-none resize-none transition-all"
                      style={{ lineHeight: 1.6 }}
                      onFocus={e => e.currentTarget.style.boxShadow = "0 0 0 3px #fee2e2"}
                      onBlur={e => e.currentTarget.style.boxShadow = "none"}
                    />
                  </div>
                </>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full relative overflow-hidden rounded-xl font-bold text-white text-sm py-4 flex items-center justify-center gap-2.5 transition-all duration-200 mt-2"
                style={{
                  background: loading
                    ? "#9ca3af"
                    : "linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f97316 100%)",
                  boxShadow: loading ? "none" : "0 4px 20px rgba(239,68,68,0.4)",
                  transform: loading ? "none" : undefined,
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(239,68,68,0.5)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = loading ? "none" : "0 4px 20px rgba(239,68,68,0.4)"; }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>{isSignUp ? "Creating account…" : "Signing in…"}</span>
                  </>
                ) : (
                  <>
                    <span>{isSignUp ? "Create Account" : "Sign In"}</span>
                    <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                      <path d="M3 8H13M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </>
                )}
              </button>

              {/* Switch mode link */}
              <p className="text-center text-sm text-slate-500 pt-1">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(v => !v)}
                  className="font-bold transition-colors"
                  style={{ color: "#ef4444" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#dc2626"}
                  onMouseLeave={e => e.currentTarget.style.color = "#ef4444"}
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </p>
            </form>
            </>
            ) : (
              /* Forgot Password Flow */
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <button 
                  onClick={() => setForgotMode('none')}
                  className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to login
                </button>
                <div className="mb-7">
                  <h1 className="text-2xl font-black text-gray-900" style={{ letterSpacing: "-0.02em" }}>
                    {forgotMode === 'email' ? "Reset Password" : "Enter Reset Code"}
                  </h1>
                  <p className="text-sm text-slate-500 mt-1">
                    {forgotMode === 'email' 
                      ? "Enter your email and we'll send you a 6-digit reset code."
                      : "Check your email for the code, and enter your new password below."}
                  </p>
                </div>
                
                <form onSubmit={handleForgotSubmit} noValidate className="space-y-4">
                  {forgotMode === 'email' ? (
                    <FloatingInput
                      id="resetEmail" name="email" type="email" label="Email Address"
                      value={resetData.email} onChange={handleResetChange}
                      required placeholder="you@example.com"
                      icon={<IconMail />}
                    />
                  ) : (
                    <>
                      <FloatingInput
                        id="otp" name="otp" type="text" label="6-Digit Code"
                        value={resetData.otp} onChange={handleResetChange}
                        required placeholder="123456"
                        icon={<IconLock />}
                      />
                      <FloatingInput
                        id="newPassword" name="newPassword" 
                        type={showPassword ? "text" : "password"} 
                        label="New Password"
                        value={resetData.newPassword} onChange={handleResetChange}
                        required placeholder="Min. 6 characters"
                        icon={<IconLock />}
                        rightElement={<EyeToggle show={showPassword} onToggle={() => setShowPassword(v => !v)} />}
                      />
                    </>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full relative overflow-hidden rounded-xl font-bold text-white text-sm py-4 flex items-center justify-center gap-2.5 transition-all duration-200 mt-2"
                    style={{
                      background: loading ? "#9ca3af" : "linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f97316 100%)",
                      boxShadow: loading ? "none" : "0 4px 20px rgba(239,68,68,0.4)"
                    }}
                  >
                    {loading ? "Processing..." : (forgotMode === 'email' ? "Send Reset Code" : "Reset Password")}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
