import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Showcase from "./pages/Showcase";
import Members from "./pages/Members";
import Ideas from "./pages/Ideas";
import { UpgradeBannerDemo } from "@/components/UpgradeBannerDemo";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 text-gray-900 font-sans antialiased">
        {/* Navigation Bar */}
        <Navbar />

        <UpgradeBannerDemo />

        {/* Dynamic Route Content */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/showcase" element={<Showcase />} />
          <Route path="/members" element={<Members />} />
          <Route path="/ideas" element={<Ideas />} />
          {/* Catch-all redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
