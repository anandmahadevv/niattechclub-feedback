import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AnimatePresence } from "motion/react";
import { Toaster } from "sonner";
import { PageWrapper } from "./components/PageWrapper";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from "./components/AuthContext";
import { UpgradeBannerDemo } from "@/components/UpgradeBannerDemo";
import PageLoader from "./components/PageLoader";

// Helper to retry dynamic imports when they fail (e.g. due to new deployments)
function safeLazy<T>(importFn: () => Promise<{ default: React.ComponentType<T> }>) {
  return lazy(() =>
    importFn().catch((err) => {
      // Check if we already reloaded in the last 10 seconds to prevent loops
      const lastReload = sessionStorage.getItem("last-chunk-reload");
      const now = Date.now();
      if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
        sessionStorage.setItem("last-chunk-reload", now.toString());
        window.location.reload();
        return new Promise<{ default: React.ComponentType<T> }>(() => {}); // Never resolve to stop rendering while reloading
      }
      throw err;
    })
  );
}

const Home = safeLazy(() => import("./pages/Home"));
const Events = safeLazy(() => import("./pages/Events"));
const Showcase = safeLazy(() => import("./pages/Showcase"));
const Ideas = safeLazy(() => import("./pages/Ideas"));
const Admin = safeLazy(() => import("./pages/Admin"));
const OpenSource = safeLazy(() => import("./pages/OpenSource"));
const Login = safeLazy(() => import("./pages/Login"));
const Profile = safeLazy(() => import("./pages/Profile"));
const Learn = safeLazy(() => import("./pages/Learn"));
const NotFound = safeLazy(() => import("./pages/NotFound"));

function AppContent() {
  const location = useLocation();
  const isAuthOrAdminRoute = location.pathname.startsWith('/nigga') || location.pathname === '/login';
  
  return (
    <div className={`flex flex-col min-h-screen font-sans antialiased ${isAuthOrAdminRoute ? 'bg-gray-100 dark:bg-slate-950' : 'bg-gradient-to-b from-white via-gray-50 to-gray-100 text-gray-900'}`}>
      <Toaster position="bottom-right" richColors />
      
      {/* Conditionally render public layout components */}
      {!isAuthOrAdminRoute && (
        <>
          <Navbar />
          <UpgradeBannerDemo />
        </>
      )}

      {/* Dynamic Route Content with Transitions */}
      <Suspense fallback={<PageLoader />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/events" element={<PageWrapper><Events /></PageWrapper>} />
            <Route path="/showcase" element={<PageWrapper><Showcase /></PageWrapper>} />
            <Route path="/ideas" element={<PageWrapper><Ideas /></PageWrapper>} />
            <Route path="/open-source" element={<PageWrapper><OpenSource /></PageWrapper>} />
            <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
            <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
            <Route path="/learn" element={<PageWrapper><Learn /></PageWrapper>} />
            <Route path="/nigga" element={<PageWrapper><Admin /></PageWrapper>} />
            {/* Catch-all route to show 404 page */}
            <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
      </Suspense>

      {/* Footer */}
      {!isAuthOrAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
