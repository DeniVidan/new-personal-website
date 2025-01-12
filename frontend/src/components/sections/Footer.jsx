import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import SocialLinks from '../SocialLinks';

const Footer = () => {
  const footerRef = useRef(null);
  const socialRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(
      socialRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: socialRef.current,
          start: "top bottom-=100",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      const yOffset = -100; // Offset to account for any fixed headers
      const y = contactSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y+500, behavior: 'smooth' });
    }
  };

  return (
    <footer ref={footerRef} className="bg-[#E1E1E1] text-white pt-10 pb-6 w-screen">
      <div className="container mx-auto md:px-8 lg:px-16">
        {/* Social Media Links */}
        <div ref={socialRef} className="flex justify-center space-x-8 mb-16">
            <SocialLinks theme="dark" />
        </div>

        {/* Navigation and Back to Top Button */}
        <div className="flex justify-between items-center mb-8 pl-8">
          <div className="flex flex-col text-start gap-2 md:gap-4 font-raleway">
            <Link to="/projects" className="text-black hover:text-red-500 transition-colors underline text-base md:text-2xl">PROJECTS</Link>
            <Link to="/about" className="text-black hover:text-red-500 transition-colors underline text-base md:text-2xl">ABOUT</Link>
            <Link to="/contact" className="text-black hover:text-red-500 transition-colors underline text-base md:text-2xl">CONTACT</Link>
          </div>
          
          <button 
            onClick={scrollToTop}
            className="font-raleway px-8 py-3 md:px-12 md:py-4 md:text-xl rounded-full bg-transparent border border-red-500 text-red-500 hover:opacity-90 transition-opacity focus:outline-none"
          >
            BACK TO TOP
          </button>
        </div>

        {/* Desktop: Logo, Handshake and Copyright in one row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          {/* Handshake Image with CTA Button - Full width on mobile, 1/2 on desktop */}
          <div className="relative w-full md:w-1/2 mb-16 md:mb-0 order-1 md:order-2">
            <img src="/handshake.png" alt="Handshake" className="w-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={scrollToContact}
                className="font-raleway px-8 py-3 rounded-full bg-gradient-to-r from-red-500 to-orange-500 hover:opacity-90 transition-opacity focus:outline-none text-white font-bold"
              >
                Let's Work Together
              </button>
            </div>
          </div>

          {/* Copyright and Logo - Stack on mobile, side by side on desktop */}
          <div className="flex flex-col items-center space-y-4 md:w-1/2 order-2 md:order-1">
            <img src="/logo-outline.svg" alt="Logo" className="w-full md:w-full md:px-10" />
            <p className="text-sm text-black">DENI VIDAN LIMITED ©2024</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
