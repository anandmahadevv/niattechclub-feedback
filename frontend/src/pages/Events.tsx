import { Link } from "react-router-dom";

export default function Events() {
  return (
    <div className="flex-grow w-full flex flex-col">
      {/* Header Section */}
      <header className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center w-full">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">Something is cooking...</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          We are preparing our next batch of workshops, hackathons, and community meetups. Stay tuned!
        </p>
      </header>

      {/* Events Content */}
      <main className="max-w-5xl mx-auto px-6 w-full flex-grow pb-20">
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border border-gray-200 border-dashed mb-12">
          <span className="text-6xl mb-4">👨‍🍳</span>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something is cooking!</h2>
          <p className="text-gray-500">New events will be announced here soon.</p>
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
