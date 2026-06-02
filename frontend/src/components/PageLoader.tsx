import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

const MESSAGES: Record<string, string> = {
  "/": "Initializing Tech Hub...",
  "/events": "Syncing upcoming opportunities...",
  "/showcase": "Assembling student creations...",
  "/members": "Loading innovator profiles...",
  "/ideas": "Structuring inspiration...",
  "/admin": "Securing management dashboard...",
};

export default function PageLoader() {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Loading...");
  const prevPath = useRef<string | null>(null);

  useEffect(() => {
    // Only trigger on actual path change
    if (prevPath.current === location.pathname) return;
    prevPath.current = location.pathname;

    // Get current message or fallback
    const message = MESSAGES[location.pathname] || "Loading system resources...";
    setStatusMessage(message);

    // Reset and start animation
    setProgress(0);
    setIsVisible(true);

    const duration = 850; // progress animation duration in ms
    const startTime = performance.now();
    let animationFrameId: number;
    let timeoutId: number | undefined;

    const updateProgress = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      
      // Cubic ease-out calculation: 1 - (1 - t)^3
      const currentProgress = Math.round((1 - Math.pow(1 - t, 3)) * 100);
      setProgress(currentProgress);

      if (t < 1) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        // Hold 100% for 150ms before fading out
        timeoutId = window.setTimeout(() => {
          setIsVisible(false);
        }, 150);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white text-gray-900 select-none overflow-hidden"
        >
          {/* Subtle grid/dot background */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(220,38,38,0.04)_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none" />
          
          {/* Soft ambient red/orange glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-50/50 rounded-full blur-3xl pointer-events-none animate-pulse duration-[3000ms]" />

          {/* Loader Content Wrapper */}
          <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
            
            {/* Logo/Icon Container */}
            <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
              {/* Outer rotating dashed ring */}
              <svg className="absolute inset-0 w-full h-full animate-[spin_10s_linear_infinite]" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="rgba(220, 38, 38, 0.12)"
                  strokeWidth="2.5"
                  fill="transparent"
                  strokeDasharray="6 5"
                />
              </svg>

              {/* Inner fast-rotating indicator */}
              <svg className="absolute inset-0 w-full h-full animate-[spin_2s_cubic-bezier(0.4,0,0.2,1)_infinite]" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="url(#loader-gradient)"
                  strokeWidth="3.5"
                  fill="transparent"
                  strokeDasharray="45 175"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="loader-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#dc2626" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Tech Club Monogram in Center */}
              <div className="relative w-14 h-14 bg-white rounded-full border border-gray-150 shadow-md flex items-center justify-center overflow-hidden">
                {/* Glowing center spot */}
                <div className="absolute w-8 h-8 bg-red-500/5 rounded-full blur-md animate-pulse" />
                <span className="relative text-lg font-black tracking-tighter bg-gradient-to-br from-red-600 to-red-800 bg-clip-text text-transparent">
                  NIAT
                </span>
              </div>
            </div>

            {/* Percentage Text */}
            <div className="mb-4">
              <span className="font-mono text-5xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500 drop-shadow-[0_2px_8px_rgba(220,38,38,0.1)]">
                {progress}%
              </span>
            </div>

            {/* Progress Bar Container */}
            <div className="w-64 h-1.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200/60 shadow-inner mb-6 relative">
              <div
                className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 rounded-full transition-all duration-75 ease-out shadow-[0_1px_6px_rgba(220,38,38,0.25)]"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Status Message */}
            <div className="h-6 flex items-center justify-center">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500 animate-pulse duration-1000">
                {statusMessage}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
