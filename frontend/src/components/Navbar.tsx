import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMenu = () => setIsMobileMenuOpen(false);
  
  return (
    <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 w-full">
      <div className="mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
        <Link to="/" onClick={closeMenu} className="flex items-center gap-3 hover:opacity-80 transition-opacity z-10">
          <img src="/logo.png" alt="NIAT Tech Club" className="h-10 object-contain mix-blend-multiply" />
          <span className="font-bold tracking-tight text-gray-900 hidden sm:block">NIAT Tech Club</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6 text-sm font-medium text-gray-500">
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
            to="/open-source"
            className={({ isActive }) =>
              isActive ? "text-red-700 font-semibold" : "hover:text-red-700 transition-colors"
            }
          >
            Open Source
          </NavLink>

          <NavLink
            to="/learn"
            className={({ isActive }) =>
              isActive ? "text-red-700 font-semibold" : "hover:text-red-700 transition-colors"
            }
          >
            Learn
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
                <span className="max-w-[100px] truncate hidden lg:inline">{user.name || "Profile"}</span>
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

        {/* Mobile Menu Toggle Button */}
        <button 
          className="md:hidden flex flex-col items-center justify-center w-10 h-10 space-y-1.5 focus:outline-none z-10"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          <span className={`block w-6 h-0.5 bg-gray-600 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-gray-600 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-gray-600 transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <div 
        className={`md:hidden absolute top-20 left-0 w-full bg-white/95 backdrop-blur-md transition-all duration-300 overflow-hidden shadow-xl shadow-black/5 ${isMobileMenuOpen ? 'max-h-96 border-b border-gray-100' : 'max-h-0'}`}
      >
        <div className="px-6 py-6 flex flex-col gap-4 text-base font-medium text-gray-600">
          <NavLink
            to="/"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? "text-red-700 font-bold" : "hover:text-red-700 transition-colors"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/events"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? "text-red-700 font-bold" : "hover:text-red-700 transition-colors"
            }
          >
            Events
          </NavLink>
          <NavLink
            to="/showcase"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? "text-red-700 font-bold" : "hover:text-red-700 transition-colors"
            }
          >
            Showcase
          </NavLink>
          <NavLink
            to="/open-source"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? "text-red-700 font-bold" : "hover:text-red-700 transition-colors"
            }
          >
            Open Source
          </NavLink>

          <NavLink
            to="/learn"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? "text-red-700 font-bold" : "hover:text-red-700 transition-colors"
            }
          >
            Learn
          </NavLink>

          <NavLink
            to="/ideas"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive
                ? "text-red-700 font-bold bg-red-50 px-4 py-2 rounded-xl inline-block w-fit"
                : "hover:text-red-700 transition-colors py-2 inline-block w-fit"
            }
          >
            <i className="fas fa-lightbulb mr-2" />Ideas
          </NavLink>

          <hr className="border-gray-100 my-2" />

          {user ? (
            <>
              <NavLink
                to="/profile"
                onClick={closeMenu}
                className={({ isActive }) =>
                  isActive
                    ? "text-red-700 font-bold flex items-center gap-2"
                    : "hover:text-red-700 transition-colors flex items-center gap-2"
                }
              >
                <i className="fas fa-user-circle text-xl"></i>
                <span>{user.name || "Profile"}</span>
              </NavLink>
              <button
                onClick={() => { signOut(); closeMenu(); }}
                className="hover:text-red-700 transition-colors cursor-pointer text-gray-500 font-medium text-left mt-2 w-fit"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive ? "text-red-700 font-bold" : "hover:text-red-700 transition-colors"
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
