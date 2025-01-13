import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "../components/sections/Hero";
import Services from "../components/sections/Services";
import Text from "../components/sections/Text";
import Projects from "../components/sections/Projects";
import About from "../components/sections/About";
import CraftingProcess from "../components/sections/CraftingProcess";
import Contact from "../components/sections/Contact";
import TitleBraker from "../components/sections/TitleBraker";
import Footer from "../components/sections/Footer";

const Homepage = () => {
    const textRef = useRef(null);
    
    useEffect(() => {
      gsap.registerPlugin(ScrollTrigger);
      const textDiv = document.getElementById("text");

      // Scroll to top on page load
      window.scrollTo(0, 0);
    }, []);

    return (
      <div className="flex flex-col items-center overflow-x-hidden mt-36">
        <Hero />
        <Services />
        <div ref={textRef} className="mb-96">
          <Text id="text" message={`I am a passionate and \n detail-oriented web \n developer with a strong \n drive for creating \n innovative digital \n solutions.`} />
        </div>
        <Projects />
        <About />
        <CraftingProcess className="mt-96" />
        <section id="contact">
          <Contact />
        </section>
        <TitleBraker message="TODAY’S DECISION MAKES FUTURE SIMPLE" />
        <Footer />
      </div>
    );
  };
  
  export default Homepage;