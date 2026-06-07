import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../components/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Events() {
  const { user } = useAuth();
  const TOTAL_SLOTS = 60;
  const [rsvpCount, setRsvpCount] = useState<number>(0);
  const [isRsvped, setIsRsvped] = useState(false);
  const [attendees, setAttendees] = useState<{ id: number; name: string; created_at: string }[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);

  const fetchRsvps = useCallback(async () => {
    const { data, error, count } = await supabase
      .from('rsvps')
      .select('id, name, created_at', { count: 'exact' })
      .eq('event_slug', 'promptwars')
      .order('created_at', { ascending: true });
      
    if (error) {
      console.error("Error fetching RSVPs:", error);
    } else if (data) {
      setAttendees(data);
      if (count !== null) setRsvpCount(count);
    }
  }, []);

  useEffect(() => {
    if (user?.email) {
      const checkUserRsvp = async () => {
        const { data } = await supabase
          .from('rsvps')
          .select('id')
          .eq('event_slug', 'promptwars')
          .eq('email', user.email)
          .maybeSingle();
          
        if (data) {
          setIsRsvped(true);
        }
      };
      checkUserRsvp();
    }
  }, [user?.email]);

  useEffect(() => {
    fetchRsvps();

    // Set up Supabase Realtime subscription for live updates with unique channel
    const channelId = Math.random().toString(36).substring(7);
    const channel = supabase
      .channel(`public:rsvps-${channelId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'rsvps', filter: 'event_slug=eq.promptwars' },
        () => {
          fetchRsvps();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchRsvps]);

  const remainingSlots = Math.max(0, TOTAL_SLOTS - rsvpCount);
  const isFull = remainingSlots === 0;

  const submitRsvp = async () => {
    if (!user) return;
    if (isFull) return;
    
    setIsSubmittingRsvp(true);
    
    try {
      const { data: existingRsvp } = await supabase
        .from('rsvps')
        .select('id')
        .eq('event_slug', 'promptwars')
        .eq('email', user.email)
        .maybeSingle();
        
      if (existingRsvp) {
        throw new Error("You have already RSVP'd for this event with this email.");
      }

      const { data: newRsvpData, error } = await supabase.from('rsvps').insert([
        { event_slug: 'promptwars', name: user.name, email: user.email, phone: user.roll_number }
      ]).select();
      
      if (error) throw error;
      
      const rsvpId = newRsvpData && newRsvpData[0] ? newRsvpData[0].id : null;
      
      try {
        await fetch('/api/send-rsvp-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: user.name, email: user.email, rsvpId })
        });
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
      }
      
      const { toast } = await import('sonner');
      toast.success("RSVP successful! Confirmation email sent.");
      fetchRsvps();
      setIsRsvped(true);
      setShowConfirmModal(false);
    } catch (error: any) {
      const { toast } = await import('sonner');
      toast.error(error.message || "Failed to submit RSVP.");
    } finally {
      setIsSubmittingRsvp(false);
    }
  };

  return (
    <div className="flex-grow w-full flex flex-col">
      {/* Header Section */}
      <header className="max-w-4xl mx-auto px-6 pt-6 pb-8 text-center w-full">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-gray-900 mb-6 drop-shadow-sm flex items-center justify-center gap-4">
          Events <span className="text-red-500"><i className="far fa-calendar-check"></i></span>
        </h1>
        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
          Discover our upcoming events and explore what we've done in the past.
        </p>
      </header>

      {/* Events Content */}
      <main className="max-w-5xl mx-auto px-6 w-full flex-grow pb-20">
        
        {/* Past Events Section */}
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-4">Past Events</h2>

          {/* Featured Past Event: AI Tools & Innovation Workshop */}
          <div className="bg-white border border-gray-200 rounded-3xl p-8 mb-10 shadow-sm relative overflow-hidden transition-shadow hover:shadow-md">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-md bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider">Workshop</span>
                  <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold flex items-center gap-1">
                    <i className="fas fa-check-circle"></i> Completed
                  </span>
                  <span className="text-gray-500 text-sm font-medium flex items-center gap-1 sm:ml-auto">
                    <i className="far fa-calendar-alt"></i> April 30
                  </span>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">AI Tools & Innovation Workshop</h3>
                <div className="inline-flex items-center gap-2 text-sm text-gray-700 font-semibold bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200 mb-6 w-fit">
                  <i className="fas fa-map-marker-alt text-red-500"></i> LH 18, C Block
                </div>
                
                {/* Speakers */}
                <div className="flex flex-wrap gap-6 mb-6">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 text-sm">
                      <i className="fas fa-user-tie"></i>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Dhanush Shenoy H</p>
                      <p className="text-[10px] text-gray-500">AI/ML Head @YenTech</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0 text-sm">
                      <i className="fas fa-user-tie"></i>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Anand Mahadev</p>
                      <p className="text-[10px] text-gray-500">SDE Intern @BlueStock, Ambassador</p>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 leading-relaxed mb-6 text-sm">
                  A hands-on session introducing industry-leading AI tools (Google AI Studio, Claude Code, and Google Stitch). Students explored prompt engineering, workflow automation, and rapid prototyping, gaining immediate practical insights into modern development cycles.
                </p>
                
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Key Takeaways</h4>
                <ul className="space-y-1.5 mb-6">
                  {[
                    "Hands-on exposure to industry-grade AI assistant tools.",
                    "Core principles of prompt engineering for rapid application development.",
                    "Practical strategies for workflow automation and fast prototyping."
                  ].map((outcome, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-600 text-sm">
                      <i className="fas fa-arrow-right text-red-500 mt-1 flex-shrink-0 text-xs"></i>
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Image Grid in a single row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <img src="/images/media__1780320484677.jpg" alt="AI Workshop Presentation" className="w-full h-32 object-cover rounded-xl hover:scale-[1.02] transition-transform duration-500 shadow-sm" loading="lazy" decoding="async" />
                <img src="/images/media__1780320485068.jpg" alt="AI Workshop Demo" className="w-full h-32 object-cover rounded-xl hover:scale-[1.02] transition-transform duration-500 shadow-sm" loading="lazy" decoding="async" />
                <img src="/images/media__1780320484934.jpg" alt="AI Workshop Crowd" className="w-full h-32 object-cover rounded-xl hover:scale-[1.02] transition-transform duration-500 shadow-sm" loading="lazy" decoding="async" />
                <img src="/images/media__1780320484800.jpg" alt="AI Workshop Overview" className="w-full h-32 object-cover rounded-xl hover:scale-[1.02] transition-transform duration-500 shadow-sm" loading="lazy" decoding="async" />
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Events Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-4">Upcoming Events</h2>
          
          <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/2 p-8 border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider">Hackathon</span>
                  <span className="px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 text-xs font-bold flex items-center gap-1">
                    <i className="fas fa-clock"></i> Upcoming
                  </span>
                  <span className="text-gray-500 text-sm font-medium flex items-center gap-1 ml-auto">
                    <i className="far fa-calendar-alt"></i> Aug (TBD)
                  </span>
                </div>
                <h3 className="text-3xl font-extrabold text-gray-900 mb-4">PromptWars</h3>
                
                <img 
                  src="https://bwnveqipiqlnjjukicah.supabase.co/storage/v1/object/sign/project_images/promptwar.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yZjRiZDA4ZC0wZjZkLTRhMDQtOGMzYy03MzZhNzYwMzMxNzQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwcm9qZWN0X2ltYWdlcy9wcm9tcHR3YXIuanBnIiwiaWF0IjoxNzgwMzkzODE2LCJleHAiOjE4MTE5Mjk4MTZ9.qPoe0GNLwj2xo2YMpxN7hTAg8rru1RPU_7dA8pUIxmk" 
                  alt="PromptWars 2026 Banner" 
                  className="w-full rounded-2xl shadow-sm mb-6 object-cover border border-gray-100" 
                  loading="lazy"
                  decoding="async"
                />

                <div className="inline-flex items-center gap-2 text-sm text-gray-700 font-semibold bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200 mb-6 w-fit">
                  <i className="fas fa-map-marker-alt text-purple-500"></i> Main Auditorium
                </div>
                <p className="text-gray-600 leading-relaxed mb-6">
                  PromptWars is a generative AI hackathon by Google for Developers and Hack2skill. Participants use "vibe coding"—building apps entirely via prompts to AI agents instead of manual coding—leveraging Google Antigravity and AI Studio to rapidly build and deploy projects.
                </p>
                <div className="mt-auto">
                  <p className="text-sm font-bold text-gray-900 mb-2">Prizes include:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li><i className="fas fa-trophy text-yellow-500 w-5"></i> ₹40,000+ Grand Prize</li>
                    <li><i className="fas fa-certificate text-gray-400 w-5"></i> Participation Certification by Google</li>
                    <li><i className="fas fa-gift text-blue-400 w-5"></i> Exclusive Swag</li>
                  </ul>
                </div>
              </div>

              {/* Inline RSVP Form */}
              <div className="lg:w-1/2 p-8 bg-gray-50 flex flex-col justify-center">
                <h4 className="text-xl font-bold text-gray-900 mb-2">Reserve Your Spot</h4>
                <p className="text-sm text-gray-500 mb-6">Fill out the form below to register for this event.</p>
                
                {isRsvped ? (
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-3xl p-8 text-center shadow-sm relative overflow-hidden animate-in fade-in zoom-in duration-500">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-200 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-200 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                    
                    <div className="w-20 h-20 bg-white text-green-500 rounded-full flex items-center justify-center mx-auto mb-5 text-4xl shadow-md border border-green-100 relative z-10">
                      <i className="fas fa-ticket-alt"></i>
                    </div>
                    <h4 className="text-2xl font-extrabold text-gray-900 mb-2 relative z-10">See you there! 🎉</h4>
                    <p className="text-gray-600 font-medium relative z-10 mb-4">
                      Your slot for PromptWars is <span className="text-green-700 font-bold">100% Confirmed</span>.
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-green-100 shadow-sm text-sm font-semibold text-green-700 relative z-10">
                      <i className="fas fa-check-circle"></i> RSVP Verified
                    </div>
                  </div>
                ) : !user ? (
                  <div className="text-center py-6 bg-white border border-gray-200 rounded-2xl shadow-sm animate-in fade-in duration-300">
                    <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3 text-xl">
                      <i className="fas fa-lock"></i>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Login Required</h4>
                    <p className="text-sm text-gray-500 mb-4 px-4">
                      You must be logged in to RSVP for events.
                    </p>
                    <Link
                      to="/login?redirect=/events"
                      className="inline-flex items-center justify-center bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 px-6 rounded-lg transition-colors text-sm shadow-sm"
                    >
                      Login to RSVP <i className="fas fa-arrow-right ml-2 text-xs"></i>
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="mb-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${isFull ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        <i className={`fas ${isFull ? 'fa-times-circle' : 'fa-check-circle'}`}></i>
                        {isFull ? 'Event is Full' : `${remainingSlots} Slots Remaining`}
                      </span>
                    </div>
                    
                    <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-2xl p-5 shadow-sm mb-6 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center text-lg flex-shrink-0">
                        <i className="fas fa-user-circle"></i>
                      </div>
                      <div className="min-w-0 flex-grow">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Registering as</p>
                        <p className="text-sm font-extrabold text-gray-900 dark:text-slate-100 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (isFull) return;
                        setShowConfirmModal(true);
                      }}
                      disabled={isFull}
                      className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isFull ? 'Registration Closed' : 'Register RSVP'} <i className={`fas ${isFull ? 'fa-ban' : 'fa-arrow-right'}`}></i>
                    </button>
                  </>
                )}

                {/* Attendees Avatar Stack */}
                {attendees.length > 0 && (
                  <div className="mt-8 border-t border-gray-200 pt-6 flex items-center gap-4">
                    <div className="flex -space-x-3">
                      {attendees.slice(0, 5).map((attendee, i) => (
                        <div 
                          key={attendee.id} 
                          className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-tr from-purple-500 to-indigo-500 text-white flex items-center justify-center text-sm font-bold shadow-sm relative group cursor-pointer"
                          style={{ zIndex: 10 - i }}
                        >
                          {attendee.name.charAt(0).toUpperCase()}
                          
                          {/* Tooltip on hover */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
                            {attendee.name}
                          </div>
                        </div>
                      ))}
                      {attendees.length > 5 && (
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold shadow-sm z-0">
                          +{attendees.length - 5}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Who's Going?</p>
                      <p className="text-xs font-medium text-gray-500">{attendees.length} people registered</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>



        <div className="mt-16 text-center">
          <div className="inline-flex items-center justify-center p-6 bg-gray-50 rounded-2xl border border-gray-200 border-dashed w-full">
            <div>
              <i className="far fa-lightbulb text-3xl text-yellow-500 mb-3"></i>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Have an idea for an event?</h3>
              <p className="text-gray-500 text-sm mb-4">We are always looking for new workshop topics or guest speakers.</p>
              <Link
                to="/ideas"
                className="inline-flex items-center justify-center bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
              >
                Submit an Idea <i className="fas fa-arrow-right ml-2 text-xs"></i>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {user && showConfirmModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { if (!isSubmittingRsvp) setShowConfirmModal(false); }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
              className="relative bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl overflow-hidden z-10"
            >
              {/* Premium Glow Top bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600" />
              
              {/* Content */}
              <div className="flex flex-col items-center text-center mt-4">
                <div className="w-14 h-14 bg-purple-50 dark:bg-purple-950/50 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4 shadow-inner">
                  <i className="fas fa-ticket-alt text-2xl"></i>
                </div>
                
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2 font-sans">
                  Confirm RSVP
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6 font-sans">
                  Are you sure you want to register for <strong className="text-purple-600 dark:text-purple-400">PromptWars</strong>? This will reserve your slot.
                </p>
                
                {/* Details Card */}
                <div className="w-full bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800/80 rounded-2xl p-4 mb-6 text-left space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-sans">Attendee Name</span>
                    <span className="text-sm font-extrabold text-gray-900 dark:text-slate-100 font-sans">{user.name}</span>
                  </div>
                  <div className="border-t border-gray-100 dark:border-slate-800/50 pt-3">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-sans">Yenepoya Email</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-slate-100 break-all font-sans">{user.email}</span>
                  </div>
                </div>
                
                {/* Buttons */}
                <div className="flex w-full gap-3">
                  <button
                    disabled={isSubmittingRsvp}
                    onClick={() => setShowConfirmModal(false)}
                    className="flex-1 py-3 px-4 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400 font-bold rounded-xl transition-colors text-sm disabled:opacity-50 cursor-pointer font-sans"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isSubmittingRsvp}
                    onClick={submitRsvp}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer font-sans"
                  >
                    {isSubmittingRsvp ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Confirming...
                      </>
                    ) : (
                      <>
                        Yes, Confirm <i className="fas fa-check-circle text-xs"></i>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
