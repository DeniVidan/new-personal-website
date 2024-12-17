import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const Text = ({ message }) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Select all the lines and their child words
    const lines = textRef.current.querySelectorAll(".line");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "center top",
        pin: true,
        scrub: 0.5,
        toggleActions: "play none none reverse",
      },
    });

    lines.forEach((line, lineIndex) => {
      const chars = line.querySelectorAll(".char");

      // Animate characters with improved animation
      tl.fromTo(
        chars,
        { 
          opacity: 0,
          y: 50,
          rotateX: -90
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
          stagger: 0.03,
        },
        lineIndex * 0.2
      );
    });

    return () => {
      tl.kill();
    };
  }, []);

  // Helper to create spans for characters
  const renderLine = (line) =>
    line.split(" ").map((word, wordIndex) => (
      <span key={wordIndex} className="word whitespace-nowrap inline-block mr-2">
        {word.split("").map((char, charIndex) => (
          <span key={charIndex} className="char inline-block">
            {char}
          </span>
        ))}
      </span>
    ));

  return (
    <div ref={containerRef} className="relative min-h-screen flex items-center justify-center py-20">
      <div
        ref={textRef}
        className="text-4xl font-bold text-center leading-relaxed space-y-1 perspective-1000 px-4 w-full"
      >
        {message
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line)
          .map((line, index) => (
            <div key={index} className="line whitespace-nowrap">
              {renderLine(line)}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Text;
