import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Home";
import AboutPage from "./pages/About";
import ContactPage from "./pages/Contact";
import MyWorkPage from "./pages/Mywork";
import Mesh from "./components/Mesh";
import CookieBanner from "./components/consentSection/Banner";
import CookiePolicy from "./components/consentSection/Policy";
import LoadingScreen from "./components/loadingScreen.jsx/LoadingScreen";

function App() {
  const [loaded, setLoaded] = useState(false); // Track loading state
  const [showBanner, setShowBanner] = useState(false);

  const forceShowBanner = () => {
    setShowBanner(true);
  };

  if (!loaded) {
    // Enable font loading by passing `loadFonts` prop as true
    return <LoadingScreen setLoaded={setLoaded} loadFonts={true} />;
  }

  return (
    <Router>
      <Mesh className="z-0" />
      <Navbar />

      {/* If "showBanner" is true, we force show the cookie banner */}
      <CookieBanner forceShow={showBanner} />

      <div className="mt-36 absolute top-0 left-0 w-full h-screen z-10">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="/contact"
            element={<ContactPage onForceShowBanner={forceShowBanner} />}
          />
          <Route path="/projects" element={<MyWorkPage />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
