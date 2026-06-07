import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, MapPin, Sparkles } from "lucide-react";
import { supabase } from "../lib/supabase";

interface Event {
  id: number;
  slug: string;
  title: string;
  type: string;
  status: string;
  date: string;
  location: string | null;
  description: string | null;
  image_url: string | null;
}

export function EventNotification() {
  const [event, setEvent] = useState<Event | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    async function fetchLatestEvent() {
      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("status", "Upcoming")
          .order("created_at", { ascending: false })
          .limit(1);

        if (error) {
          console.error("Error fetching latest event for notification:", error);
          return;
        }

        if (data && data.length > 0) {
          const latestEvent = data[0];
          
          // Check if user dismissed this specific event
          const dismissed = localStorage.getItem(`techclub_dismissed_event_${latestEvent.slug}`);
          if (!dismissed) {
            setEvent(latestEvent);
            // Delay entrance animation slightly for a smoother UX
            const timer = setTimeout(() => {
              setIsVisible(true);
            }, 1500);
            return () => clearTimeout(timer);
          }
        }
      } catch (err) {
        console.error("Failed to fetch notification event:", err);
      }
    }

    fetchLatestEvent();
  }, []);

  const handleDismiss = () => {
    if (event) {
      localStorage.setItem(`techclub_dismissed_event_${event.slug}`, "true");
    }
    setIsVisible(false);
  };

  if (!event) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-[200] w-[calc(100%-3rem)] sm:w-96 overflow-hidden bg-white/80 backdrop-blur-md border border-red-100 shadow-2xl rounded-2xl flex flex-col pointer-events-auto"
        >
          {/* Glowing Red Top Border */}
          <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-orange-500 to-red-800" />

          <div className="p-5 flex flex-col relative">
            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              aria-label="Dismiss notification"
            >
              <X size={16} />
            </button>

            {/* Header Badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
              <span className="px-2.5 py-0.5 bg-red-50 text-red-700 text-[10px] font-bold uppercase tracking-wider rounded-md border border-red-100">
                New {event.type || "Event"} Alert
              </span>
              <Sparkles size={12} className="text-orange-500 animate-pulse" />
            </div>

            {/* Event Title */}
            <h3 className="text-base font-extrabold text-gray-900 mb-1.5 leading-snug pr-6">
              {event.title}
            </h3>

            {/* Event Description Snippet */}
            {event.description && (
              <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">
                {event.description}
              </p>
            )}

            {/* Event Details Row */}
            <div className="flex flex-col gap-2 mb-5 text-gray-600 text-xs">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-red-600 shrink-0" />
                <span className="font-medium">{event.date}</span>
              </div>
              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-red-600 shrink-0" />
                  <span className="font-medium truncate">{event.location}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5">
              <Link
                to="/events"
                onClick={handleDismiss}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold py-2.5 px-4 rounded-xl transition-all text-xs text-center shadow-lg shadow-red-700/10 flex items-center justify-center gap-1.5"
              >
                RSVP & Register <i className="fas fa-arrow-right text-[10px]"></i>
              </Link>
              <button
                onClick={handleDismiss}
                className="px-3.5 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-gray-700 font-bold rounded-xl transition-colors text-xs"
              >
                Later
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
