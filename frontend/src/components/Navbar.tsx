import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMenu = () => setIsMobileMenuOpen(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "text-red-600 bg-red-50/80 px-3.5 py-1.5 rounded-full font-semibold shadow-sm border border-red-100/50 flex items-center gap-1.5"
      : "hover:text-red-600 hover:bg-gray-50/60 text-gray-600 px-3.5 py-1.5 rounded-full transition-all duration-200 font-medium flex items-center gap-1.5";

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "text-red-600 bg-red-50/80 px-4 py-2.5 rounded-xl font-bold shadow-sm border border-red-100/50 flex items-center gap-2"
      : "hover:text-red-600 hover:bg-gray-50/60 text-gray-700 px-4 py-2.5 rounded-xl transition-all duration-200 font-semibold flex items-center gap-2";
  
  return (
    <div className="fixed top-4 left-0 right-0 z-[150] px-4 md:px-8">
      <div className="max-w-7xl mx-auto relative">
        <nav className="border border-gray-200/50 bg-white/70 backdrop-blur-lg shadow-lg shadow-gray-100/30 rounded-2xl md:rounded-full transition-all duration-300">
          <div className="px-5 md:px-6 h-16 flex items-center justify-between">
            <Link to="/" onClick={closeMenu} className="flex items-center gap-2.5 hover:opacity-90 transition-opacity z-10">
              <img src="/logo.png" alt="NIAT Tech Club" className="h-9 w-9 object-contain mix-blend-multiply" loading="lazy" decoding="async" />
              <span className="font-extrabold tracking-tight text-gray-900 hidden sm:block text-base">NIAT Tech Club</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2 lg:gap-3 text-sm font-medium">
              <NavLink to="/" className={linkClass}>
                Home
              </NavLink>
              <NavLink to="/events" className={linkClass}>
                Events
              </NavLink>
              <NavLink to="/showcase" className={linkClass}>
                Showcase
              </NavLink>
              <NavLink to="/open-source" className={linkClass}>
                Open Source
              </NavLink>
              <NavLink to="/learn" className={linkClass}>
                Learn
              </NavLink>
              <NavLink to="/ideas" className={linkClass}>
                <i className="fas fa-lightbulb"></i> Ideas
              </NavLink>

              <span className="h-5 w-px bg-gray-200/80 mx-2 shrink-0" />

              {user ? (
                <>
                  <NavLink to="/profile" className={linkClass}>
                    <i className="fas fa-user-circle text-base"></i>
                    <span className="max-w-[100px] truncate hidden lg:inline">{user.name || "Profile"}</span>
                  </NavLink>
                  <button
                    onClick={() => signOut()}
                    className="hover:text-red-600 hover:bg-red-50/50 px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer text-gray-600 font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive
                      ? "text-red-600 bg-red-50/80 px-4 py-1.5 rounded-full font-semibold border border-red-100/50 shadow-sm"
                      : "bg-gray-900 text-white hover:bg-gray-800 px-4 py-1.5 rounded-full transition-all duration-200 font-semibold shadow-sm"
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
              <span className={`block w-6 h-0.5 bg-gray-800 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-gray-800 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-gray-800 transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Menu */}
        <div 
          className={`md:hidden absolute top-[72px] left-0 right-0 bg-white/95 backdrop-blur-xl transition-all duration-300 overflow-hidden rounded-2xl border border-gray-200/50 shadow-2xl flex flex-col gap-1.5 ${
            isMobileMenuOpen 
              ? 'max-h-[500px] p-4 opacity-100' 
              : 'max-h-0 p-0 opacity-0 pointer-events-none'
          }`}
        >
          <NavLink to="/" onClick={closeMenu} className={mobileLinkClass}>
            Home
          </NavLink>
          <NavLink to="/events" onClick={closeMenu} className={mobileLinkClass}>
            Events
          </NavLink>
          <NavLink to="/showcase" onClick={closeMenu} className={mobileLinkClass}>
            Showcase
          </NavLink>
          <NavLink to="/open-source" onClick={closeMenu} className={mobileLinkClass}>
            Open Source
          </NavLink>
          <NavLink to="/learn" onClick={closeMenu} className={mobileLinkClass}>
            Learn
          </NavLink>
          <NavLink to="/ideas" onClick={closeMenu} className={mobileLinkClass}>
            <i className="fas fa-lightbulb"></i> Ideas
          </NavLink>

          <hr className="border-gray-100 my-2" />

          {user ? (
            <>
              <NavLink to="/profile" onClick={closeMenu} className={mobileLinkClass}>
                <i className="fas fa-user-circle text-lg"></i>
                <span>{user.name || "Profile"}</span>
              </NavLink>
              <button
                onClick={() => { signOut(); closeMenu(); }}
                className="hover:text-red-600 hover:bg-red-50/50 px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer text-gray-600 font-semibold text-left w-full flex items-center gap-2"
              >
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive
                  ? "text-red-600 bg-red-50/80 px-4 py-2.5 rounded-xl font-bold shadow-sm border border-red-100/50 flex items-center gap-2"
                  : "bg-gray-900 text-white hover:bg-gray-800 px-4 py-2.5 rounded-xl transition-all duration-200 font-bold shadow-sm flex items-center justify-center"
              }
            >
              Login
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
}
