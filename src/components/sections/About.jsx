import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const About = () => {
  const titleRef = useRef(null);
  const textRef = useRef(null);
  const benefitsRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  
    // Set initial states
    gsap.set([titleRef.current, textRef.current], {
      opacity: 0,
      y: 100,
    });
  
    // Animate and pin the title
    gsap.fromTo(
      titleRef.current,
      { 
        opacity: 0,
        filter: "blur(10px)",
        y: "0%"
      },
      {
        opacity: 1,
        filter: "blur(0px)", 
        y: "0%",
        duration: 0.6,
        ease: "power4.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "center center",
          end: "+=300",
          pin: true,
          scrub: true,
          pinSpacing: true,
          pinSpacer: true,
          toggleActions: "play none none reset",
          markers: false,
        },
      }
    );
  
    // Animate main text
    gsap.fromTo(
      textRef.current,
      { opacity: 0},
      {
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: textRef.current,
          start: "top center",
          end: "center center",
          toggleActions: "play none none reverse",
          markers: false,
        },
      }
    );
  
    // Animate benefits
    gsap.fromTo(
      benefitsRef.current.children,
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: benefitsRef.current,
          start: "top+=100 bottom-=100",
          toggleActions: "play none none reverse",
          markers: false,
        },
      }
    );
  }, []);
  

  return (
    <div className="min-h-screen bg-transparent">
      <div className="h-screen flex items-center justify-center px-8">
        <h1 
          ref={titleRef}
          className="text-5xl md:text-7xl font-bold text-center text-white font-custom"
        >
          LET'S BUILD YOUR VALUE TOO
        </h1>
      </div>

      <div className="h-screen flex items-center justify-center">
        <div 
          ref={textRef}
          className="max-w-3xl mx-auto text-xl text-gray-200 leading-relaxed px-8"
        >
          <p className="text-xl md:text-3xl">
            I'm a passionate web developer dedicated to crafting exceptional digital experiences. 
            With a keen eye for detail and a love for clean, efficient code, I transform ideas into 
            engaging web solutions that make an impact.
          </p>
        </div>
      </div>

      <div 
        ref={benefitsRef}
        className="max-w-4xl mx-auto grid grid-cols-1 px-8 py-20"
      >
        <div className="p-6 rounded-lg shadow-sm flex flex-col md:flex-row items-center gap-8">
          <img src="smile-bg.svg" alt="Smile Icon" className="w-22 h-full" />
          <ul className="text-gray-200 list-disc pl-5 text-xl md:text-3xl space-y-3 text-left">
            <li>Creative & Functional Designs</li>
            <li>Customizable Outputs</li>
            <li>Strong Technical Expertise</li>
            <li>Brand-Centric Approach</li>
            <li>Attention to User Experience</li>
            <li>Problem-Solving</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
