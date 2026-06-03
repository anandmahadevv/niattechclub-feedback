import { PointerHighlight } from "../components/PointerHighlight";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="flex-grow w-full relative hero-pattern flex items-center">
      {/* Soft gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white pointer-events-none"></div>

      <div className="mx-auto px-6 md:px-20 py-24 md:py-32 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 font-semibold text-xs uppercase tracking-wider mb-6 border border-red-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              2025-26 Session Active
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.1] mb-6">
              Build the future with <br />
              <div className="inline-block mt-2">
                <PointerHighlight
                  containerClassName="inline-block"
                  rectangleClassName="border-red-600"
                  pointerClassName="text-red-700"
                >
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
                    NIAT Tech Club
                  </span>
                </PointerHighlight>
              </div>
            </h1>

            <p className="text-lg md:text-xl text-gray-500 leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0">
              We are a community of passionate developers, engineers, and creators. As one of the premier <strong>NIAT student clubs</strong> at the <strong>NIAT Mangalore campus</strong>, the <strong>NIAT Tech Club</strong> invites you to learn new technologies, build impactful projects, and grow your network in <strong>NIAT Manglore</strong>.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/events"
                className="w-full sm:w-auto bg-red-700 hover:bg-red-800 text-white font-semibold py-4 px-8 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-700/20"
              >
                View Events <i className="fas fa-arrow-right text-sm"></i>
              </Link>
              <Link
                to="/showcase"
                className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 font-semibold py-4 px-8 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                Projects <i className="fas fa-laptop-code text-sm text-blue-500"></i>
              </Link>
            </div>
          </div>

          {/* Graphic/Illustration Side */}
          <div className="hidden lg:flex justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-red-100 to-orange-50 rounded-full blur-3xl opacity-50 transform -translate-y-10"></div>
            <img
              src="/photo.png"
              alt="NIAT Tech Club Logo - Leading NIAT Student Clubs at NIAT Mangalore Campus"
              className="relative z-10 h-80 object-contain drop-shadow-2xl mix-blend-multiply transform hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
