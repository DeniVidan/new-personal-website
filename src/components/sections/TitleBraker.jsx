import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const TitleBraker = ({ message }) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "center-=100px center",
        end: "center center", 
        toggleActions: "play none none reverse",
        markers: false,
      },
    });

    tl.fromTo(
      textRef.current,
      {
        opacity: 0,
        filter: "blur(15px)",
      },
      {
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.8,
        ease: "power3.out",
      }
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen flex items-center justify-center">
      <h1
        ref={textRef}
        className="text-5xl md:text-6xl font-bold text-center leading-[3.5rem] px-4 md:px-20 font-custom"
      >
        {message}
      </h1>
    </div>
  );
};

export default TitleBraker;
