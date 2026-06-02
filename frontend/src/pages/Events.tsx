import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function Events() {
  const TOTAL_SLOTS = 50;
  const [rsvpCount, setRsvpCount] = useState<number>(0);

  useEffect(() => {
    async function fetchRsvpCount() {
      const { count, error } = await supabase
        .from('rsvps')
        .select('*', { count: 'exact', head: true })
        .eq('event_slug', 'promptwars');
        
      if (error) {
        console.error("Error fetching RSVP count:", error);
      } else if (count !== null) {
        setRsvpCount(count);
      }
    }
    fetchRsvpCount();
  }, []);

  const remainingSlots = Math.max(0, TOTAL_SLOTS - rsvpCount);
  const isFull = remainingSlots === 0;

  return (
    <div className="flex-grow w-full flex flex-col">
      {/* Header Section */}
      <header className="max-w-4xl mx-auto px-6 pt-6 pb-8 text-center w-full">
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-gray-900 mb-6 drop-shadow-sm flex items-center justify-center gap-4">
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
                <img src="/images/media__1780320484677.jpg" alt="AI Workshop Presentation" className="w-full h-32 object-cover rounded-xl hover:scale-[1.02] transition-transform duration-500 shadow-sm" />
                <img src="/images/media__1780320485068.jpg" alt="AI Workshop Demo" className="w-full h-32 object-cover rounded-xl hover:scale-[1.02] transition-transform duration-500 shadow-sm" />
                <img src="/images/media__1780320484934.jpg" alt="AI Workshop Crowd" className="w-full h-32 object-cover rounded-xl hover:scale-[1.02] transition-transform duration-500 shadow-sm" />
                <img src="/images/media__1780320484800.jpg" alt="AI Workshop Overview" className="w-full h-32 object-cover rounded-xl hover:scale-[1.02] transition-transform duration-500 shadow-sm" />
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
                    <li><i className="fas fa-trophy text-yellow-500 w-5"></i> ₹50,000 Grand Prize</li>
                    <li><i className="fas fa-medal text-gray-400 w-5"></i> Internship Opportunities</li>
                    <li><i className="fas fa-swimmer text-blue-400 w-5"></i> Exclusive Swag</li>
                  </ul>
                </div>
              </div>

              {/* Inline RSVP Form */}
              <div className="lg:w-1/2 p-8 bg-gray-50 flex flex-col justify-center">
                <h4 className="text-xl font-bold text-gray-900 mb-2">Reserve Your Spot</h4>
                <p className="text-sm text-gray-500 mb-6">Fill out the form below to register for this event.</p>
                
                <div className="mb-6">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${isFull ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    <i className={`fas ${isFull ? 'fa-times-circle' : 'fa-check-circle'}`}></i>
                    {isFull ? 'Event is Full' : `${remainingSlots} Slots Remaining`}
                  </span>
                </div>
                
                <form className="space-y-4" onSubmit={async (e) => {
                  e.preventDefault();
                  if (isFull) return;
                  const form = e.target as HTMLFormElement;
                  const name = (form.elements.namedItem('name') as HTMLInputElement).value;
                  const email = (form.elements.namedItem('email') as HTMLInputElement).value;
                  const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
                  
                  if (!email.endsWith('@yenepoya.edu.in')) {
                    const { toast } = await import('sonner');
                    toast.error('Only @yenepoya.edu.in email addresses are allowed to RSVP.');
                    return;
                  }
                  
                  submitBtn.disabled = true;
                  submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Processing...';
                  
                  try {
                    const { supabase } = await import('../lib/supabase');
                    const { toast } = await import('sonner');
                    const { error } = await supabase.from('rsvps').insert([
                      { event_slug: 'promptwars', name, email }
                    ]);
                    
                    if (error) throw error;
                    toast.success("RSVP successful! See you at the hackathon.");
                    form.reset();
                    setRsvpCount(prev => prev + 1);
                  } catch (error: any) {
                    const { toast } = await import('sonner');
                    toast.error(error.message || "Failed to submit RSVP.");
                  } finally {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Confirm RSVP <i class="fas fa-check-circle"></i>';
                  }
                }}>
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <i className="fas fa-user text-sm"></i>
                      </div>
                      <input
                        type="text"
                        name="name"
                        required
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-sm"
                        placeholder="Full Name"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <i className="fas fa-envelope text-sm"></i>
                      </div>
                      <input
                        type="email"
                        name="email"
                        required
                        pattern=".*@yenepoya\.edu\.in$"
                        title="Please enter your @yenepoya.edu.in email address"
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-sm"
                        placeholder="Email Address (@yenepoya.edu.in)"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isFull}
                    className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-lg transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 text-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isFull ? 'Registration Closed' : 'Confirm RSVP'} <i className={`fas ${isFull ? 'fa-ban' : 'fa-check-circle'}`}></i>
                  </button>
                </form>
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
    </div>
  );
}
