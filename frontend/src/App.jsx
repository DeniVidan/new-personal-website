import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Home";
import AboutPage from "./pages/About";
import ContactPage from "./pages/Contact";
import MyWorkPage from "./pages/Mywork";
import Mesh from "./components/Mesh";
import "./index.css";
import CookieBanner from "./components/consentSection/Banner";
import CookiePolicy from "./components/consentSection/Policy";

function App() {
  return (
    <>
      <Router>
        <Mesh className="z-0" />
        <Navbar />
        <CookieBanner />
        <div className="mt-36 absolute top-0 left-0 w-full h-screen z-10">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/projects" element={<MyWorkPage />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
          </Routes>
        </div>
      </Router>
      
    </>
  );
}

export default App;
