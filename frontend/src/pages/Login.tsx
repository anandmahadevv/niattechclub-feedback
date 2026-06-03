import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { toast } from "sonner";

// ─── SVG Icons ─────────────────────────────────────────────────────────────
const IconMail = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
  </svg>
);
const IconLock = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
  </svg>
);
const IconUser = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);
const IconID = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
    <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
  </svg>
);
const IconBuildingOffice = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
  </svg>
);
const IconEye = ({ off }: { off?: boolean }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    {off ? (
      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478zM5.364 7.22l1.395 1.394A4 4 0 009 13.528v.001l-3.16-3.16a4.002 4.002 0 01-.476-3.148zM10 15c-1.17 0-2.267-.32-3.2-.873l-1.435 1.435A9.955 9.955 0 0010 17c4.478 0 8.268-2.943 9.542-7a10.049 10.049 0 00-1.904-3.479l-1.432 1.432A4.001 4.001 0 0110 15z" clipRule="evenodd" />
    ) : (
      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10z" fillRule="evenodd" clipRule="evenodd" />
    )}
  </svg>
);
const IconGithub = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

// ─── Input Component ────────────────────────────────────────────────────────
interface FloatingInputProps {
  id: string;
  name: string;
  type?: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
  error?: string;
  autoComplete?: string;
  rightElement?: React.ReactNode;
  isTextArea?: boolean;
  rows?: number;
}

function FloatingInput({
  id, name, type = "text", label, value, onChange,
  required, placeholder, icon, error, autoComplete, rightElement, isTextArea, rows
}: FloatingInputProps) {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;
  const lifted = focused || hasValue;

  return (
    <div className="relative">
      <div
        className={`relative flex items-center rounded-2xl border transition-all duration-300 overflow-hidden bg-white/50 backdrop-blur-xl ${
          error ? "border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]" : 
          focused ? "border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.15)]" : "border-slate-200 hover:border-slate-300"
        }`}
      >
        {icon && (
          <div className={`pl-4 flex-shrink-0 transition-colors duration-300 ${focused ? 'text-indigo-500' : 'text-slate-400'}`}>
            {icon}
          </div>
        )}
        <div className="relative flex-1">
          <label
            htmlFor={id}
            className="absolute left-4 pointer-events-none select-none transition-all duration-300 font-medium z-10"
            style={{
              top: lifted ? "8px" : isTextArea ? "16px" : "50%",
              transform: lifted ? "translateY(0)" : "translateY(-50%)",
              fontSize: lifted ? "0.65rem" : "0.875rem",
              color: error ? "#ef4444" : focused ? "#6366f1" : "#64748b",
              letterSpacing: lifted ? "0.05em" : "0",
              textTransform: lifted ? "uppercase" : "none",
            }}
          >
            {label}{required && <span className="ml-1 text-red-500">*</span>}
          </label>
          
          {isTextArea ? (
            <textarea
              id={id} name={name} value={value} onChange={onChange}
              onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
              placeholder={focused ? placeholder : ""}
              rows={rows || 3}
              className="w-full bg-transparent outline-none text-slate-800 font-medium text-sm resize-none relative z-0"
              style={{ paddingTop: lifted ? "26px" : "16px", paddingBottom: "12px", paddingLeft: "16px", paddingRight: "16px" }}
            />
          ) : (
            <input
              id={id} name={name} type={type} value={value} onChange={onChange}
              autoComplete={autoComplete}
              onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
              placeholder={focused ? placeholder : ""}
              className="w-full bg-transparent outline-none text-slate-800 font-medium text-sm relative z-0"
              style={{ paddingTop: lifted ? "24px" : "16px", paddingBottom: "8px", paddingLeft: "16px", paddingRight: rightElement ? "48px" : "16px" }}
            />
          )}
        </div>
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">{rightElement}</div>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-500 pl-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
          <svg viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M6 0a6 6 0 100 12A6 6 0 006 0zm0 8.25a.75.75 0 110 1.5.75.75 0 010-1.5zm.75-4.5a.75.75 0 00-1.5 0v3a.75.75 0 001.5 0v-3z" clipRule="evenodd" /></svg>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Password Strength ──────────────────────────────────────────────────────
const getPasswordScore = (password: string) => {
  if (!password) return 0;
  const len = password.length;
  const hasUpper = /[A-Z]/.test(password);
  const hasNum = /[0-9]/.test(password);
  const hasSpec = /[^A-Za-z0-9]/.test(password);
  return [len >= 8, hasUpper, hasNum, hasSpec].filter(Boolean).length;
};

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const score = getPasswordScore(password);

  const levels = [
    { label: "Too short", color: "bg-red-500", shadow: "shadow-red-500/50" },
    { label: "Weak", color: "bg-orange-500", shadow: "shadow-orange-500/50" },
    { label: "Fair", color: "bg-yellow-400", shadow: "shadow-yellow-400/50" },
    { label: "Good", color: "bg-emerald-400", shadow: "shadow-emerald-400/50" },
    { label: "Strong", color: "bg-emerald-600", shadow: "shadow-emerald-600/50" },
  ];
  const { label, color, shadow } = levels[Math.min(score, 4)];

  return (
    <div className="mt-3 px-1 animate-in fade-in">
      <div className="flex gap-1.5 mb-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-1.5 flex-1 rounded-full bg-slate-200 overflow-hidden">
            <div className={`h-full transition-all duration-500 w-full ${i < score ? color + " " + shadow : "translate-x-[-100%]"}`} />
          </div>
        ))}
      </div>
      <p className={`text-xs font-bold uppercase tracking-wider ${color.replace('bg-', 'text-')}`}>{label}</p>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function Login() {
  const { signIn, signUp, resetPassword, signInWithProvider } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [isSignUp, setIsSignUp] = useState(false);
  const [forgotMode, setForgotMode] = useState<'none' | 'email' | 'otp'>('none');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    email: "", password: "", confirmPassword: "", name: "", rollNumber: "", department: ""
  });

  const [resetData, setResetData] = useState({
    email: "", otp: "", newPassword: "", generatedOtp: ""
  });

  useEffect(() => {
    setErrors({});
    setFormData({ email: "", password: "", confirmPassword: "", name: "", rollNumber: "", department: "" });
    setShowPassword(false);
    setShowConfirm(false);
    setForgotMode('none');
  }, [isSignUp]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleResetChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setResetData(prev => ({ ...prev, [name]: value }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Enter a valid email.";
    
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (isSignUp && getPasswordScore(formData.password) < 3) {
      newErrors.password = "Password is too weak. Make it 'Good' or 'Strong'.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Must be at least 6 characters.";
    }

    if (isSignUp) {
      if (!formData.confirmPassword) newErrors.confirmPassword = "Confirm your password.";
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
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
    const toastId = toast.loading(isSignUp ? "Creating account..." : "Signing in...");
    try {
      if (isSignUp) {
        await signUp(formData.email, formData.password, formData.name, formData.rollNumber, formData.department);
        toast.success("Account created! Please sign in.", { id: toastId });
        setIsSignUp(false);
      } else {
        await signIn(formData.email, formData.password);
        toast.success("Signed in successfully.", { id: toastId });
        navigate(redirect);
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      await signInWithProvider(provider);
    } catch (err: any) {
      toast.error(`Failed to sign in with ${provider}.`);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotMode === 'email') {
      if (!resetData.email) return toast.error("Enter your email");
      setLoading(true);
      const toastId = toast.loading("Sending reset code...");
      try {
        const generated = Math.floor(100000 + Math.random() * 900000).toString();
        const backendUrl = window.location.hostname === "localhost" ? "http://localhost:5000" : window.location.origin;
        const response = await fetch(`${backendUrl}/api/send-reset-email`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: resetData.email, otp: generated })
        });
        if (!response.ok) throw new Error("Failed to send email. Ensure backend is running.");
        setResetData(prev => ({ ...prev, generatedOtp: generated }));
        setForgotMode('otp');
        toast.success("Reset code sent!", { id: toastId });
      } catch (err: any) {
        toast.error(err.message, { id: toastId });
      } finally {
        setLoading(false);
      }
    } else if (forgotMode === 'otp') {
      if (!resetData.otp || !resetData.newPassword) return toast.error("Fill all fields");
      if (resetData.otp !== resetData.generatedOtp) return toast.error("Invalid reset code");
      if (resetData.newPassword.length < 6) return toast.error("Password too short");
      setLoading(true);
      const toastId = toast.loading("Resetting password...");
      try {
        await resetPassword(resetData.email, resetData.newPassword);
        toast.success("Password reset successfully!", { id: toastId });
        setForgotMode('none');
        setResetData({ email: '', otp: '', newPassword: '', generatedOtp: '' });
      } catch (err: any) {
        toast.error(err.message, { id: toastId });
      } finally {
        setLoading(false);
      }
    }
  };

  const EyeToggle = ({ show, onToggle }: { show: boolean; onToggle: () => void }) => (
    <button type="button" onClick={onToggle} className="p-2 text-slate-400 hover:text-indigo-500 transition-colors rounded-full hover:bg-indigo-50" tabIndex={-1}>
      <IconEye off={show} />
    </button>
  );

  return (
    <div className="flex-grow w-full min-h-screen flex items-center justify-center p-4 sm:p-8 relative bg-slate-50 overflow-hidden font-sans">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="absolute top-5 left-5 z-50 flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-600 hover:text-indigo-700 bg-white/70 hover:bg-white backdrop-blur-sm border border-white/60 hover:border-indigo-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Back
      </button>
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-[100px] animate-[pulse_8s_ease-in-out_infinite_alternate]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-blue-400/20 to-emerald-400/20 blur-[120px] animate-[pulse_10s_ease-in-out_infinite_alternate_reverse]" />
        <div className="absolute top-[20%] right-[10%] w-[30vw] h-[30vw] rounded-full bg-gradient-to-bl from-pink-500/10 to-orange-400/10 blur-[80px] animate-[pulse_12s_ease-in-out_infinite_alternate]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row bg-white/60 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-white/50 overflow-hidden min-h-[700px]">
        
        {/* Left Branding Panel */}
        <div className="hidden lg:flex lg:w-5/12 flex-col justify-between p-14 relative bg-slate-900 text-white overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-600/40 via-transparent to-purple-800/60" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-16">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-3xl text-white bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_30px_rgba(99,102,241,0.5)] border border-white/10">
                N
              </div>
              <div>
                <h2 className="font-black text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">NIAT Tech Club</h2>
                <p className="text-indigo-300 font-medium tracking-wide text-sm">Member Portal</p>
              </div>
            </div>

            <h1 className="text-5xl font-black leading-[1.15] mb-6 tracking-tight">
              Innovate.<br/>
              Collaborate.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Accelerate.</span>
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed max-w-sm font-medium">
              Join the elite community of developers showcasing their work and building the future.
            </p>
          </div>

          <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-4 mb-3">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-800 bg-slate-700 overflow-hidden shadow-lg">
                    <img src={`https://i.pravatar.cc/100?img=${i + 15}`} alt="avatar" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="text-sm font-bold">
                <span className="text-white block">50+ Developers</span>
                <span className="text-indigo-300">already joined</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="w-full lg:w-7/12 p-8 sm:p-12 xl:p-16 flex flex-col relative bg-transparent">
          
          <div className="max-w-md mx-auto w-full flex-grow flex flex-col justify-center">
            {/* Mobile Header */}
            <div className="flex lg:hidden items-center gap-3 mb-10">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-2xl text-white bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                N
              </div>
              <span className="font-black text-xl text-slate-900 tracking-tight">NIAT Tech Club</span>
            </div>

            {forgotMode === 'none' ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Tab Switcher */}
                <div className="flex bg-slate-200/50 backdrop-blur-sm p-1.5 rounded-2xl mb-10 border border-white/60 shadow-inner">
                  {(["Sign In", "Sign Up"] as const).map((tab, i) => {
                    const active = (i === 0 && !isSignUp) || (i === 1 && isSignUp);
                    return (
                      <button
                        key={tab} type="button" onClick={() => setIsSignUp(i === 1)}
                        className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                          active ? "bg-white text-indigo-900 shadow-[0_4px_15px_rgba(0,0,0,0.05)]" : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        {tab}
                      </button>
                    );
                  })}
                </div>

                <div className="mb-8 text-center sm:text-left">
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
                    {isSignUp ? "Create an account" : "Welcome back"}
                  </h2>
                  <p className="text-slate-500 font-medium">
                    {isSignUp ? "Enter your details to join the community." : "Enter your credentials to access your account."}
                  </p>
                </div>

                {/* Social Login */}
                <div className="mb-8">
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('github')}
                    className="w-full relative flex items-center justify-center gap-3 px-4 py-3.5 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-indigo-300 hover:shadow-[0_4px_20px_rgba(99,102,241,0.1)] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-100 group"
                  >
                    <span className="group-hover:scale-110 transition-transform duration-300 text-slate-900"><IconGithub /></span>
                    Continue with GitHub
                  </button>
                </div>

                <div className="relative flex items-center mb-8">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink-0 mx-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Or continue with email</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <FloatingInput
                    id="email" name="email" type="email" label="Email Address"
                    value={formData.email} onChange={handleChange} required placeholder="you@example.com"
                    icon={<IconMail />} error={errors.email} autoComplete="email"
                  />

                  <div className="relative">
                    <FloatingInput
                      id="password" name="password" type={showPassword ? "text" : "password"}
                      label="Password" value={formData.password} onChange={handleChange} required placeholder="Min. 6 characters"
                      icon={<IconLock />} error={errors.password} autoComplete={isSignUp ? "new-password" : "current-password"}
                      rightElement={<EyeToggle show={showPassword} onToggle={() => setShowPassword(v => !v)} />}
                    />
                    {!isSignUp && (
                      <button
                        type="button" onClick={() => setForgotMode('email')}
                        className="absolute right-1 -bottom-7 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  {isSignUp && <PasswordStrength password={formData.password} />}

                  {isSignUp && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                      <div className="pt-2 pb-5">
                        <FloatingInput
                          id="confirmPassword" name="confirmPassword" type={showConfirm ? "text" : "password"}
                          label="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required placeholder="Repeat your password"
                          icon={<IconLock />} error={errors.confirmPassword} autoComplete="new-password"
                          rightElement={
                            formData.confirmPassword && !errors.confirmPassword && formData.password === formData.confirmPassword ? (
                              <div className="p-2 text-emerald-500 animate-in zoom-in"><IconCheck /></div>
                            ) : <EyeToggle show={showConfirm} onToggle={() => setShowConfirm(v => !v)} />
                          }
                        />
                      </div>

                      <div className="pt-2 pb-4 border-t border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Profile Details</p>
                        <div className="space-y-5">
                          <FloatingInput id="name" name="name" label="Full Name" value={formData.name} onChange={handleChange} required placeholder="e.g. Riya Sharma" icon={<IconUser />} error={errors.name} autoComplete="name" />
                          <div className="grid grid-cols-2 gap-4">
                            <FloatingInput id="rollNumber" name="campusID" label="Campus ID" value={formData.rollNumber} onChange={handleChange} required placeholder="e.g. 44226" icon={<IconID />} error={errors.rollNumber} />
                            <FloatingInput id="department" name="department" label="Department" value={formData.department} onChange={handleChange} required placeholder="CSE / ISE" icon={<IconBuildingOffice />} error={errors.department} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit" disabled={loading}
                    className="w-full relative overflow-hidden rounded-2xl font-bold text-white text-sm py-4 mt-4 transition-all duration-300 shadow-[0_8px_25px_rgba(99,102,241,0.4)] hover:shadow-[0_12px_35px_rgba(99,102,241,0.5)] hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none bg-gradient-to-r from-indigo-600 to-purple-600"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        {isSignUp ? "Create Account" : "Sign In"}
                        <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4"><path d="M3 8H13M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                    )}
                  </button>
                </form>

                <p className="mt-8 text-center text-slate-500 font-medium text-sm">
                  {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                  <button type="button" onClick={() => setIsSignUp(v => !v)} className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                    {isSignUp ? "Sign In" : "Sign Up"}
                  </button>
                </p>
              </div>
            ) : (
              /* ─── Forgot Password Flow ─── */
              <div className="animate-in fade-in slide-in-from-right-8 duration-500 h-full flex flex-col justify-center">
                <button onClick={() => setForgotMode('none')} className="mb-8 w-fit flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors group">
                  <span className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-indigo-50 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                  </span>
                  Back to login
                </button>
                
                <div className="mb-10">
                  <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                    {forgotMode === 'email' ? (
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    ) : (
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>
                    )}
                  </div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-3">
                    {forgotMode === 'email' ? "Reset Password" : "Check Your Email"}
                  </h1>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    {forgotMode === 'email' 
                      ? "Enter the email associated with your account and we'll send you a 6-digit reset code."
                      : `We've sent a 6-digit code to ${resetData.email}. Enter it below along with your new password.`}
                  </p>
                </div>
                
                <form onSubmit={handleForgotSubmit} noValidate className="space-y-5">
                  {forgotMode === 'email' ? (
                    <FloatingInput id="resetEmail" name="email" type="email" label="Email Address" value={resetData.email} onChange={handleResetChange} required placeholder="you@example.com" icon={<IconMail />} />
                  ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-5">
                      <FloatingInput id="otp" name="otp" type="text" label="6-Digit Code" value={resetData.otp} onChange={handleResetChange} required placeholder="123456" icon={<IconLock />} />
                      <FloatingInput id="newPassword" name="newPassword" type={showPassword ? "text" : "password"} label="New Password" value={resetData.newPassword} onChange={handleResetChange} required placeholder="Min. 6 characters" icon={<IconLock />} rightElement={<EyeToggle show={showPassword} onToggle={() => setShowPassword(v => !v)} />} />
                      <PasswordStrength password={resetData.newPassword} />
                    </div>
                  )}
                  <button type="submit" disabled={loading} className="w-full relative overflow-hidden rounded-2xl font-bold text-white text-sm py-4 mt-2 transition-all duration-300 shadow-[0_8px_25px_rgba(99,102,241,0.4)] hover:shadow-[0_12px_35px_rgba(99,102,241,0.5)] hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed bg-gradient-to-r from-indigo-600 to-purple-600">
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
