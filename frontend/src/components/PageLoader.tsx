import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Component as AiLoader } from "./ui/ai-loader";

const MESSAGES: Record<string, string> = {
  "/": "Loading",
  "/events": "Syncing",
  "/showcase": "Creating",
  "/members": "Profiles",
  "/ideas": "Planning",
  "/admin": "Securing",
};

export default function PageLoader() {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Loading");

  useEffect(() => {
    const message = MESSAGES[location.pathname] || "Loading";
    setStatusMessage(message);

    setIsVisible(true);

    const timeoutId = window.setTimeout(() => {
      setIsVisible(false);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
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
          className="fixed inset-0 z-50 select-none overflow-hidden"
        >
          <AiLoader text={statusMessage} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
