export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-auto w-full relative z-20">
      <div className="mx-auto px-6 md:px-20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <img
            src="/photo.png"
            alt="NIAT Tech Club"
            className="h-8 object-contain mix-blend-multiply opacity-50 grayscale hover:grayscale-0 transition-all"
            loading="lazy"
            decoding="async"
          />
          <span className="text-gray-400 font-semibold text-sm">© 2026 NIAT Tech Club</span>
        </div>
        <div className="flex items-center gap-6 text-gray-400 text-xl">
          <a href="#" className="hover:text-indigo-500 transition-colors" title="Discord">
            <i className="fab fa-discord"></i>
          </a>
          <a href="#" className="hover:text-pink-500 transition-colors" title="Instagram">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#" className="hover:text-blue-700 transition-colors" title="LinkedIn">
            <i className="fab fa-linkedin"></i>
          </a>
          <a href="#" className="hover:text-gray-900 transition-colors" title="GitHub">
            <i className="fab fa-github"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}
