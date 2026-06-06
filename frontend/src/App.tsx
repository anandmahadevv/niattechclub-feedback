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

const Home = lazy(() => import("./pages/Home"));
const Events = lazy(() => import("./pages/Events"));
const Showcase = lazy(() => import("./pages/Showcase"));
const Ideas = lazy(() => import("./pages/Ideas"));
const Admin = lazy(() => import("./pages/Admin"));
const OpenSource = lazy(() => import("./pages/OpenSource"));
const Login = lazy(() => import("./pages/Login"));
const Profile = lazy(() => import("./pages/Profile"));
const Learn = lazy(() => import("./pages/Learn"));

function AppContent() {
  const location = useLocation();
  const isAuthOrAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/login';
  
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
            <Route path="/admin" element={<PageWrapper><Admin /></PageWrapper>} />
            {/* Catch-all route to redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
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
