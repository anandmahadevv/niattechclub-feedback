import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { toast } from "sonner";

// ─── Small SVG icon helpers ───────────────────────────────────────────────────
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
const IconCheck = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const IconGoogle = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const IconGithub = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

// ─── Branded left panel ────────────────────────────────────────────────────────
function BrandPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-slate-900 text-white min-h-[600px] h-full">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl mix-blend-screen" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 rounded-full bg-purple-500/20 blur-3xl mix-blend-screen" />

      {/* Logo */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-2xl text-white bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
            N
          </div>
          <div>
            <div className="text-white font-black text-xl tracking-tight">NIAT Tech Club</div>
            <div className="text-blue-200/70 text-sm font-medium">Member Portal</div>
          </div>
        </div>

        <h2 className="text-white font-black text-5xl leading-tight mb-6">
          Innovate.<br/>
          Collaborate.<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Build.</span>
        </h2>
        <p className="text-slate-300 text-lg leading-relaxed max-w-sm">
          Join the community to showcase your projects, share ideas, and connect with fellow tech enthusiasts.
        </p>
      </div>

      <div className="relative z-10">
        <div className="flex -space-x-4 mb-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
               <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="avatar" />
            </div>
          ))}
          <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-blue-600 flex items-center justify-center text-xs font-bold">
            +50
          </div>
        </div>
        <p className="text-sm font-medium text-slate-400">Join 50+ members already building the future.</p>
      </div>
    </div>
  );
}

// ─── Input Component ────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  isTextArea?: boolean;
}

function InputField({ label, icon, error, isTextArea, ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-slate-700">
        {label} {props.required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            {icon}
          </div>
        )}
        {isTextArea ? (
          <textarea
            {...(props as any)}
            className={`w-full rounded-xl border px-4 py-3 text-sm text-gray-900 outline-none transition-all placeholder:text-slate-400
              ${error ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"}
              ${icon ? "pl-11" : ""}
            `}
          />
        ) : (
          <input
            {...props}
            className={`w-full rounded-xl border px-4 py-3 text-sm text-gray-900 outline-none transition-all placeholder:text-slate-400
              ${error ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"}
              ${icon ? "pl-11" : ""}
            `}
          />
        )}
      </div>
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
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
    { label: "Too short", color: "bg-red-500", textColor: "text-red-600" },
    { label: "Weak", color: "bg-orange-500", textColor: "text-orange-600" },
    { label: "Fair", color: "bg-yellow-500", textColor: "text-yellow-600" },
    { label: "Good", color: "bg-green-500", textColor: "text-green-600" },
    { label: "Strong", color: "bg-emerald-600", textColor: "text-emerald-700" },
  ];
  const { label, color, textColor } = levels[Math.min(score, 4)];

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i < score ? color : "bg-slate-100"}`}
          />
        ))}
      </div>
      <p className={`text-xs font-bold ${textColor}`}>{label}</p>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function Login() {
  const { signIn, signUp, signInWithProvider } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      name: "",
      rollNumber: "",
      department: "",
      bio: "",
    });
    setShowPassword(false);
  }, [isSignUp]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
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

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      await signInWithProvider(provider);
      // It will redirect the user, so no need for toast on success immediately
    } catch (err: any) {
      console.error(err);
      toast.error(`Failed to sign in with ${provider}.`);
    }
  };

  return (
    <div className="flex-grow w-full bg-slate-50 min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-6xl bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 overflow-hidden flex">
        
        {/* Left Side: Brand Panel */}
        <div className="hidden lg:block lg:w-5/12 flex-shrink-0">
          <BrandPanel />
        </div>

        {/* Right Side: Form Panel */}
        <div className="w-full lg:w-7/12 p-8 sm:p-12 xl:p-16 flex flex-col justify-center relative">
          
          <div className="max-w-md mx-auto w-full">
            {/* Mobile Logo */}
            <div className="flex lg:hidden items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl text-white bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
                N
              </div>
              <span className="font-black text-lg text-slate-900">NIAT Tech Club</span>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
                {isSignUp ? "Create an account" : "Welcome back"}
              </h1>
              <p className="text-slate-500 text-sm sm:text-base">
                {isSignUp ? "Enter your details to join the community." : "Enter your credentials to access your account."}
              </p>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-1 gap-4 mb-8">
              <button
                type="button"
                onClick={() => handleSocialLogin('github')}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all focus:ring-4 focus:ring-slate-100"
              >
                <IconGithub />
                GitHub
              </button>
            </div>

            <div className="relative flex items-center mb-8">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink-0 mx-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Or continue with email
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <InputField
                id="email" name="email" type="email" label="Email Address"
                value={formData.email} onChange={handleChange}
                required placeholder="you@example.com"
                icon={<IconMail />} error={errors.email}
              />

              <div className="relative">
                <InputField
                  id="password" name="password"
                  type={showPassword ? "text" : "password"}
                  label="Password" value={formData.password}
                  onChange={handleChange} required placeholder="••••••••"
                  icon={<IconLock />} error={errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[38px] text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <IconEye off={showPassword} />
                </button>
                {isSignUp && <PasswordStrength password={formData.password} />}
              </div>

              {isSignUp && (
                <div className="pt-4 space-y-5">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Profile Info</h3>
                  <InputField
                    id="name" name="name" label="Full Name"
                    value={formData.name} onChange={handleChange}
                    required placeholder="John Doe"
                    icon={<IconUser />} error={errors.name}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <InputField
                      id="rollNumber" name="rollNumber" label="Roll Number"
                      value={formData.rollNumber} onChange={handleChange}
                      required placeholder="21CS045"
                      icon={<IconID />} error={errors.rollNumber}
                    />
                    <InputField
                      id="department" name="department" label="Department"
                      value={formData.department} onChange={handleChange}
                      required placeholder="CSE"
                      icon={<IconBuildingOffice />} error={errors.department}
                    />
                  </div>

                  <InputField
                    id="bio" name="bio" label="Bio (Optional)"
                    value={formData.bio} onChange={handleChange}
                    placeholder="Tell us a little about yourself..."
                    isTextArea rows={3}
                  />
                </div>
              )}

              {!isSignUp && (
                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Remember me</span>
                  </label>
                  <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                    Forgot password?
                  </a>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <svg className="animate-spin w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <span>{isSignUp ? "Create account" : "Sign in"}</span>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-slate-500 text-sm">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all"
              >
                {isSignUp ? "Sign in instead" : "Sign up for free"}
              </button>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
