import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { Toaster } from "sonner";
import { PageWrapper } from "./components/PageWrapper";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Showcase from "./pages/Showcase";
import Members from "./pages/Members";
import Ideas from "./pages/Ideas";
import Admin from "./pages/Admin";
import { UpgradeBannerDemo } from "@/components/UpgradeBannerDemo";
import PageLoader from "./components/PageLoader";
import { AuthProvider } from "./components/AuthContext";
import Login from "./pages/Login";
import Profile from "./pages/Profile";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  return (
    <div className={`flex flex-col min-h-screen font-sans antialiased ${isAdminRoute ? 'bg-gray-100' : 'bg-gradient-to-b from-white via-gray-50 to-gray-100 text-gray-900'}`}>
      <PageLoader />
      <Toaster position="bottom-right" richColors />
      
      {/* Conditionally render public layout components */}
      {!isAdminRoute && (
        <>
          <Navbar />
          <UpgradeBannerDemo />
        </>
      )}

      {/* Dynamic Route Content with Transitions */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/events" element={<PageWrapper><Events /></PageWrapper>} />
          <Route path="/showcase" element={<PageWrapper><Showcase /></PageWrapper>} />
          <Route path="/members" element={<PageWrapper><Members /></PageWrapper>} />
          <Route path="/ideas" element={<PageWrapper><Ideas /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
          <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
          <Route path="/admin" element={<PageWrapper><Admin /></PageWrapper>} />
          {/* Catch-all route to redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>

      {/* Footer */}
      {!isAdminRoute && <Footer />}
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
