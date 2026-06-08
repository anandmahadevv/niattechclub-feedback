import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "./AuthContext";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setIsMobileMenuOpen(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `relative px-4 py-2 flex items-center gap-1.5 text-sm font-semibold transition-colors duration-300 z-10 ${
      isActive ? "text-red-700" : "text-gray-600 hover:text-red-600"
    }`;

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all duration-300 z-10 ${
      isActive ? "text-red-700" : "text-gray-700 hover:text-red-600 hover:bg-gray-50/60"
    }`;

  return (
    <div className="fixed top-4 left-0 right-0 z-[150] px-4 md:px-8">
      <div className="max-w-7xl mx-auto relative">
        <nav className={`border transition-all duration-500 rounded-2xl md:rounded-full ${
          isScrolled 
            ? "border-gray-200/50 bg-white/70 backdrop-blur-lg shadow-lg shadow-gray-100/30 hover:shadow-[0_10px_30px_-5px_rgba(239,68,68,0.08)]"
            : "border-transparent bg-transparent shadow-none"
        }`}>
          <div className="px-5 md:px-6 h-16 flex items-center justify-between">
            <Link to="/" onClick={closeMenu} className="flex items-center gap-2.5 hover:opacity-90 transition-opacity z-10">
              <img src="/logo.png" alt="NIAT Tech Club" className="h-9 w-9 object-contain mix-blend-multiply" loading="lazy" decoding="async" />
              <span className="font-extrabold tracking-tight text-gray-900 hidden sm:block text-base">NIAT Tech Club</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1.5 lg:gap-2 text-sm font-medium">
              <NavLink to="/" className={linkClass}>
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="activeNavBackground"
                        className="absolute inset-0 bg-gradient-to-r from-red-50/90 to-orange-50/90 border border-red-100/50 rounded-full -z-10 shadow-sm"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    Home
                  </>
                )}
              </NavLink>

              <NavLink to="/events" className={linkClass}>
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="activeNavBackground"
                        className="absolute inset-0 bg-gradient-to-r from-red-50/90 to-orange-50/90 border border-red-100/50 rounded-full -z-10 shadow-sm"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    Events
                  </>
                )}
              </NavLink>

              <NavLink to="/showcase" className={linkClass}>
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="activeNavBackground"
                        className="absolute inset-0 bg-gradient-to-r from-red-50/90 to-orange-50/90 border border-red-100/50 rounded-full -z-10 shadow-sm"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    Showcase
                  </>
                )}
              </NavLink>

              <NavLink to="/open-source" className={linkClass}>
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="activeNavBackground"
                        className="absolute inset-0 bg-gradient-to-r from-red-50/90 to-orange-50/90 border border-red-100/50 rounded-full -z-10 shadow-sm"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    Open Source
                  </>
                )}
              </NavLink>

              <NavLink to="/learn" className={linkClass}>
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="activeNavBackground"
                        className="absolute inset-0 bg-gradient-to-r from-red-50/90 to-orange-50/90 border border-red-100/50 rounded-full -z-10 shadow-sm"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    Learn
                  </>
                )}
              </NavLink>

              <NavLink to="/ideas" className={linkClass}>
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="activeNavBackground"
                        className="absolute inset-0 bg-gradient-to-r from-red-50/90 to-orange-50/90 border border-red-100/50 rounded-full -z-10 shadow-sm"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <div className="relative flex items-center gap-1.5">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                      </span>
                      <i className="fas fa-lightbulb"></i> Ideas
                    </div>
                  </>
                )}
              </NavLink>

              <span className="h-5 w-px bg-gray-200/80 mx-2 shrink-0" />

              {user ? (
                <>
                  <NavLink to="/profile" className={linkClass}>
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <motion.span
                            layoutId="activeNavBackground"
                            className="absolute inset-0 bg-gradient-to-r from-red-50/90 to-orange-50/90 border border-red-100/50 rounded-full -z-10 shadow-sm"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                        <i className="fas fa-user-circle text-base"></i>
                        <span className="max-w-[100px] truncate hidden lg:inline">{user.name || "Profile"}</span>
                      </>
                    )}
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
                    `relative px-4 py-1.5 rounded-full font-semibold transition-all duration-300 z-10 flex items-center justify-center text-sm ${
                      isActive 
                        ? "text-red-750" 
                        : "bg-gradient-to-r from-red-600 to-red-800 text-white hover:from-red-700 hover:to-orange-700 shadow-md shadow-red-600/10 hover:shadow-red-600/25 hover:scale-[1.03]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId="activeNavBackground"
                          className="absolute inset-0 bg-gradient-to-r from-red-50/90 to-orange-50/90 border border-red-100/50 rounded-full -z-10 shadow-sm"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      Login
                    </>
                  )}
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
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="activeNavBackgroundMobile"
                    className="absolute inset-0 bg-gradient-to-r from-red-50/90 to-orange-50/90 border border-red-100/50 rounded-xl -z-10 shadow-sm"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                Home
              </>
            )}
          </NavLink>

          <NavLink to="/events" onClick={closeMenu} className={mobileLinkClass}>
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="activeNavBackgroundMobile"
                    className="absolute inset-0 bg-gradient-to-r from-red-50/90 to-orange-50/90 border border-red-100/50 rounded-xl -z-10 shadow-sm"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                Events
              </>
            )}
          </NavLink>

          <NavLink to="/showcase" onClick={closeMenu} className={mobileLinkClass}>
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="activeNavBackgroundMobile"
                    className="absolute inset-0 bg-gradient-to-r from-red-50/90 to-orange-50/90 border border-red-100/50 rounded-xl -z-10 shadow-sm"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                Showcase
              </>
            )}
          </NavLink>

          <NavLink to="/open-source" onClick={closeMenu} className={mobileLinkClass}>
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="activeNavBackgroundMobile"
                    className="absolute inset-0 bg-gradient-to-r from-red-50/90 to-orange-50/90 border border-red-100/50 rounded-xl -z-10 shadow-sm"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                Open Source
              </>
            )}
          </NavLink>

          <NavLink to="/learn" onClick={closeMenu} className={mobileLinkClass}>
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="activeNavBackgroundMobile"
                    className="absolute inset-0 bg-gradient-to-r from-red-50/90 to-orange-50/90 border border-red-100/50 rounded-xl -z-10 shadow-sm"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                Learn
              </>
            )}
          </NavLink>

          <NavLink to="/ideas" onClick={closeMenu} className={mobileLinkClass}>
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="activeNavBackgroundMobile"
                    className="absolute inset-0 bg-gradient-to-r from-red-50/90 to-orange-50/90 border border-red-100/50 rounded-xl -z-10 shadow-sm"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <div className="relative flex items-center gap-2">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                  </span>
                  <i className="fas fa-lightbulb"></i> Ideas
                </div>
              </>
            )}
          </NavLink>

          <hr className="border-gray-100 my-2" />

          {user ? (
            <>
              <NavLink to="/profile" onClick={closeMenu} className={mobileLinkClass}>
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="activeNavBackgroundMobile"
                        className="absolute inset-0 bg-gradient-to-r from-red-50/90 to-orange-50/90 border border-red-100/50 rounded-xl -z-10 shadow-sm"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <i className="fas fa-user-circle text-lg"></i>
                    <span>{user.name || "Profile"}</span>
                  </>
                )}
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
                `relative px-4 py-2.5 rounded-xl font-bold flex items-center justify-center transition-all duration-300 z-10 ${
                  isActive
                    ? "text-red-750"
                    : "bg-gradient-to-r from-red-600 to-red-800 text-white hover:from-red-700 hover:to-orange-700 shadow-sm hover:scale-[1.02]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="activeNavBackgroundMobile"
                      className="absolute inset-0 bg-gradient-to-r from-red-50/90 to-orange-50/90 border border-red-100/50 rounded-xl -z-10 shadow-sm"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  Login
                </>
              )}
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
}
