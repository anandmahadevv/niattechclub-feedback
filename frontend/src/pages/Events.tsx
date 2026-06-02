import { Link } from "react-router-dom";

export default function Events() {
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
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border border-gray-200 border-dashed mb-12">
            <span className="text-6xl mb-4">👨‍🍳</span>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Something is cooking!</h2>
            <p className="text-gray-500">We are preparing our next batch of workshops, hackathons, and community meetups. Stay tuned!</p>
          </div>
        </div>

        <div className="mt-12 text-center">
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
