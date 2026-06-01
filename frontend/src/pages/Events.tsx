import { Link } from "react-router-dom";

export default function Events() {
  return (
    <div className="flex-grow w-full flex flex-col">
      {/* Header Section */}
      <header className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center w-full">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">Upcoming Events</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Join us for our latest workshops, hackathons, and community meetups.
        </p>
      </header>

      {/* Events Content */}
      <main className="max-w-5xl mx-auto px-6 w-full flex-grow pb-20">
        <div className="space-y-6">
          {/* Event 1 */}
          <div className="event-card p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-red-700"></div>

            <div className="flex-shrink-0 text-center bg-red-50 rounded-xl p-4 w-24 border border-red-100">
              <span className="block text-red-700 font-bold text-sm uppercase tracking-wide">Oct</span>
              <span className="block text-3xl font-extrabold text-gray-900 mt-1">15</span>
            </div>

            <div className="flex-grow">
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold">Workshop</span>
                <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium">
                  <i className="far fa-clock mr-1"></i> 10:00 AM - 1:00 PM
                </span>
                <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium">
                  <i className="fas fa-map-marker-alt mr-1"></i> Lab 3
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-red-700 transition-colors">
                Intro to Web Development
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Learn the fundamentals of HTML, CSS, and vanilla JavaScript in this hands-on workshop led by our senior
                members.
              </p>
            </div>

            <div className="flex-shrink-0 mt-4 md:mt-0 w-full md:w-auto">
              <button className="w-full md:w-auto bg-gray-900 hover:bg-black text-white font-semibold py-2.5 px-6 rounded-lg transition-colors">
                RSVP Now
              </button>
            </div>
          </div>

          {/* Event 2 */}
          <div className="event-card p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600"></div>

            <div className="flex-shrink-0 text-center bg-indigo-50 rounded-xl p-4 w-24 border border-indigo-100">
              <span className="block text-indigo-700 font-bold text-sm uppercase tracking-wide">Nov</span>
              <span className="block text-3xl font-extrabold text-gray-900 mt-1">02</span>
            </div>

            <div className="flex-grow">
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-semibold">
                  Hackathon
                </span>
                <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium">
                  <i className="far fa-clock mr-1"></i> 9:00 AM (24 Hours)
                </span>
                <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium">
                  <i className="fas fa-map-marker-alt mr-1"></i> Main Auditorium
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                InnovateHack 2026
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Our flagship 24-hour hackathon. Form teams, build incredible solutions, and win exciting prizes
                sponsored by our tech partners.
              </p>
            </div>

            <div className="flex-shrink-0 mt-4 md:mt-0 w-full md:w-auto">
              <button className="w-full md:w-auto bg-gray-900 hover:bg-black text-white font-semibold py-2.5 px-6 rounded-lg transition-colors">
                Register Team
              </button>
            </div>
          </div>
        </div>

        {/* Past Events Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-4">Past Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Past Event 1 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 relative overflow-hidden flex flex-col opacity-80 hover:opacity-100 transition-opacity">
              <div className="flex justify-between items-start mb-4">
                <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-semibold">Workshop</span>
                <span className="px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold flex items-center gap-1">
                  <i className="fas fa-check-circle"></i> Completed
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Introduction to UI/UX Design</h3>
              <p className="text-gray-500 text-sm mb-4 flex-grow">
                A deep dive into Figma, user research, and wireframing for beginners.
              </p>
              <div className="text-gray-400 text-xs font-medium flex items-center gap-2">
                <i className="far fa-calendar-alt"></i> September 12, 2025
              </div>
            </div>

            {/* Past Event 2 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 relative overflow-hidden flex flex-col opacity-80 hover:opacity-100 transition-opacity">
              <div className="flex justify-between items-start mb-4">
                <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-semibold">Seminar</span>
                <span className="px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold flex items-center gap-1">
                  <i className="fas fa-check-circle"></i> Completed
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI in the Real World</h3>
              <p className="text-gray-500 text-sm mb-4 flex-grow">
                Guest lecture by industry experts on the practical applications of Machine Learning and GenAI.
              </p>
              <div className="text-gray-400 text-xs font-medium flex items-center gap-2">
                <i className="far fa-calendar-alt"></i> August 28, 2025
              </div>
            </div>
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
