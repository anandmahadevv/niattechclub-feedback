import { NavLink, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function Navbar() {
  const { user, signOut } = useAuth();
  
  return (
    <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 w-full">
      <div className="mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img src="/logo.png" alt="NIAT Tech Club" className="h-10 object-contain mix-blend-multiply" />
          <span className="font-bold tracking-tight text-gray-900 hidden md:block">NIAT Tech Club</span>
        </Link>
        <div className="flex items-center gap-4 md:gap-6 text-sm font-medium text-gray-500 overflow-x-auto no-scrollbar">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-red-700 font-semibold" : "hover:text-red-700 transition-colors"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/events"
            className={({ isActive }) =>
              isActive ? "text-red-700 font-semibold" : "hover:text-red-700 transition-colors"
            }
          >
            Events
          </NavLink>
          <NavLink
            to="/showcase"
            className={({ isActive }) =>
              isActive ? "text-red-700 font-semibold" : "hover:text-red-700 transition-colors"
            }
          >
            Showcase
          </NavLink>
          <NavLink
            to="/members"
            className={({ isActive }) =>
              isActive ? "text-red-700 font-semibold" : "hover:text-red-700 transition-colors"
            }
          >
            Members
          </NavLink>
          <NavLink
            to="/ideas"
            className={({ isActive }) =>
              isActive
                ? "text-red-700 font-semibold bg-red-50 px-3 py-1.5 rounded-full"
                : "hover:text-red-700 transition-colors"
            }
          >
            <i className="fas fa-lightbulb mr-1.5"></i> Ideas
          </NavLink>

          <span className="h-4 w-px bg-gray-300 mx-1 shrink-0" />

          {user ? (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive
                    ? "text-red-700 font-semibold flex items-center gap-1.5"
                    : "hover:text-red-700 transition-colors flex items-center gap-1.5"
                }
              >
                <i className="fas fa-user-circle text-lg"></i>
                <span className="max-w-[100px] truncate hidden sm:inline">{user.user_metadata?.name || "Profile"}</span>
              </NavLink>
              <button
                onClick={() => signOut()}
                className="hover:text-red-700 transition-colors cursor-pointer text-gray-500 font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? "text-red-700 font-semibold" : "hover:text-red-700 transition-colors"
              }
            >
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}
