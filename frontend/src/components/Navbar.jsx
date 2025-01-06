import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { gsap } from "gsap";
import SocialLinks from "./SocialLinks";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const linksRef = useRef([]);
  const hoverBgRef = useRef([]);

  const links = [
    { text: "HOME", to: "/" },
    { text: "ABOUT", to: "/about" },
    { text: "MY WORK", to: "/projects" },
    { text: "CONTACT", to: "/contact" },
  ];

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };



  useEffect(() => {
    if (menuOpen) {
      gsap.to(menuRef.current, {
        duration: 0.3,
        opacity: 1,
        pointerEvents: "auto",
      });
      gsap.fromTo(
        linksRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.2,
          duration: 0.3,
          ease: "power3.out",
        }
      );
    } else {
      gsap.to(menuRef.current, {
        duration: 0.3,
        opacity: 0,
        pointerEvents: "none",
      });
    }
  }, [menuOpen]);

  const handleMouseEnter = (index, isActive) => {
    if (!isActive) { // Apply hover effect only if it's not active
      gsap.to(hoverBgRef.current[index], {
        height: "50%",  // Expanding the background to half the height
        width: "100%",
        backgroundColor: "white",
        duration: 0.3,
        ease: "power3.out",
      });
  
      gsap.to(linksRef.current[index], {
        scale: 1,
        duration: 0.3,
        ease: "power3.out",
      });
    }
  };
  
  const handleMouseLeave = (index) => {
    gsap.to(hoverBgRef.current[index], {
      height: "0%",
      duration: 0.3,
      ease: "power3.out",
    });
  
    gsap.to(linksRef.current[index], {
      scale: 1,
      duration: 0.3,
      ease: "power3.out",
    });
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50">
      <div className="flex items-center justify-between p-4 lg:px-20 sm:px-3 sticky z-10">
        {/* Brand Section */}
        <div className="flex items-center gap-3">
          <div className="brand-name text-sm text-white">
            <img className="w-2/3 lg:w-full" src="DENI_logo2.svg" alt="" />
          </div>
        </div>
  
        {/* Hamburger Icon / Close Button */}
        <button
          onClick={toggleMenu}
          className="flex flex-col border-none gap-1.5 p-2 focus:outline-none relative bg-transparent items-end z-50"
        >
          <span
            className={`block h-0.5 bg-white transition-all duration-300 ease-in-out ${
              menuOpen
                ? "w-8 rotate-45 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                : "w-8"
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ease-in-out ${
              menuOpen ? "opacity-0 translate-x-full" : "opacity-100"
            }`}
          ></span>
          <span
            className={`block h-0.5 bg-white transition-all duration-300 ease-in-out ${
              menuOpen
                ? "w-8 -rotate-45 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                : "w-8"
            }`}
          ></span>
        </button>
      </div>
  
      {/* Fullscreen Menu */}
      <div
        ref={menuRef}
        className="fixed inset-0 bg-black h-screen bg-opacity-95 flex flex-col items-center justify-start pt-28 gap-20 transition-all duration-500 ease-in-out"
        style={{
          clipPath: menuOpen ? 'circle(100% at 50% 50%)' : 'circle(0% at 95% 5%)',
          opacity: menuOpen ? 1 : 0,
          visibility: menuOpen ? 'visible' : 'hidden'
        }}
      >
        <SocialLinks className="h-1 w-full flex justify-start" theme="light"/>

        <ul className="flex flex-col items-center w-full gap-1">
          {links.map((link, index) => (
            <NavLink
              key={index}
              to={link.to}
              className={({ isActive }) =>
                `nav-link text-5xl lg:text-7xl font-black hover:text-white w-full relative py-4 transition-transform duration-300 ease-out ${
                  isActive
                    ? "bg-white text-transparent text-stroke"
                    : "text-white"
                }`
              }
              onClick={toggleMenu}
              onMouseEnter={({ isActive }) =>
                handleMouseEnter(index, isActive)
              }
              onMouseLeave={() => handleMouseLeave(index)}
              ref={(el) => (linksRef.current[index] = el)}
            >
              {/* Hover background effect */}
              <span
                ref={(el) => (hoverBgRef.current[index] = el)}
                className="mix-blend-difference absolute top-0 left-0 w-full h-0 bg-white transition-all duration-300 ease-out"
              ></span>
              <div className="z-10">{link.text}</div>
            </NavLink>
          ))}
        </ul>
        <div className="fixed bottom-0 w-full text-center pb-4 text-white text-sm opacity-50">
          <p>&copy; All Rights Reserved</p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
