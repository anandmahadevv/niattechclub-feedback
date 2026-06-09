import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Home, Calendar, Users } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-2xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            404
          </h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-lg mx-auto">
            The page you're looking for doesn't exist, has been moved, or is temporarily unavailable. 
            Let's get you back on track.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <Link
              to="/"
              className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all group"
            >
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Home size={24} />
              </div>
              <span className="font-semibold text-gray-900">Go Home</span>
              <span className="text-sm text-gray-500 mt-1">Back to main page</span>
            </Link>

            <Link
              to="/events"
              className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:purple-100 transition-all group"
            >
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Calendar size={24} />
              </div>
              <span className="font-semibold text-gray-900">Events</span>
              <span className="text-sm text-gray-500 mt-1">Upcoming meetups</span>
            </Link>

            <Link
              to="/profile"
              className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:indigo-100 transition-all group"
            >
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Users size={24} />
              </div>
              <span className="font-semibold text-gray-900">Join Us</span>
              <span className="text-sm text-gray-500 mt-1">Become a member</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
