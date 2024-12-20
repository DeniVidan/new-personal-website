import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const myWorks = [
  {
    title: "Project 1",
    description: "Designed and developed a website for a client who does live wedding sketching, capturing the essence of their artistry.",
    imagePath: "klara-client/background-gif.gif",
    tags: ["Research", "Creativity", "Design", "Prototype", "Development"]
  },
  {
    title: "Project 2",
    description: "Revamp an e-commerce platform.",
    imagePath: "klara-client/background-gif.gif",
    tags: ["UI/UX", "Development", "Branding"]
  },
  {
    title: "Project 3",
    description: "Create a mobile application for local services.",
    imagePath: "klara-client/background-gif.gif",
    tags: ["Research", "Design", "Development"]
  },
  {
    title: "Project 4",
    description: "Design a marketing campaign for a startup.",
    imagePath: "klara-client/background-gif.gif",
    tags: ["Creativity", "Design", "Marketing"]
  },
  {
    title: "Project 5",
    description: "Build a personal portfolio website.",
    imagePath: "klara-client/background-gif.gif",
    tags: ["Web Development", "Design"]
  },
  {
    title: "Project 6",
    description: "Develop a blog platform.",
    imagePath: "klara-client/background-gif.gif",
    tags: ["Development", "Content Management"]
  }
];

const Projects = () => {
  const divRef = useRef(null);
  const cardsRef = useRef([]);
  const scrollIconRef = useRef(null);
  const titleRef = useRef(null);
  const [cardsLoaded, setCardsLoaded] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Set initial states
    gsap.set(divRef.current, {
      width: "10%",
      borderTopLeftRadius: "5rem",
      borderTopRightRadius: "5rem"
    });
    gsap.set(cardsRef.current, {
      opacity: 0,
      y: 50
    });
    gsap.set(scrollIconRef.current, {
      opacity: 0.5,
      y: 0
    });
    gsap.set(titleRef.current, {
      opacity: 0,
      y: -20
    });

    // Timeline for width animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: divRef.current,
        start: "top bottom",
        end: "top top",
        scrub: true,
        markers: false,
        onEnterBack: () => {  
          setCardsLoaded(false);
          gsap.to(scrollIconRef.current, {
            opacity: 1,
            duration: 0.3
          });
          gsap.to(titleRef.current, {
            opacity: 0,
            y: -20,
            duration: 0.3
          });
          gsap.to(cardsRef.current, {
            opacity: 0,
            y: 20,
            duration: 0.3,
            stagger: 0.1,
            ease: "power3.out"
          });
        },
      }
    });

    // Animate width and border radius
    tl.to(divRef.current, {
      width: "100%", 
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      duration: 0.3,
      ease: "linear",
      onComplete: () => {
        // After width animation, show title first then cards
        gsap.to(scrollIconRef.current, {
          opacity: 0,
          duration: 0.3
        });
        gsap.to(titleRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.3,
          onComplete: () => {
            setCardsLoaded(true);
            gsap.to(cardsRef.current, {
              opacity: 1,
              y: 0,
              duration: 0.3,
              stagger: 0.08,
              ease: "power3.out"
            });
          }
        });
      }
    });
  }, []);

  return (
    <div 
      ref={divRef}
      className="min-h-screen bg-gradient-to-br from-red-500 to-orange-500 mx-auto p-8 py-96 relative"
    >
        <h1
        ref={titleRef}
        className="text-5xl md:text-7xl font-bold text-white text-center mb-12 font-custom"
      >
        PROJECTS
      </h1>
      {!cardsLoaded && (
        <div 
          ref={scrollIconRef}
          className="absolute w-full top-4 left-0 text-white opacity-50 animate-bounce flex flex-col items-center"
        >
          <span className="mb-2">Scroll</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {myWorks.map((work, index) => (
          <div
            key={index}
            ref={el => cardsRef.current[index] = el}
            className="rounded-lg shadow-lg overflow-hidden"
          >
            <img 
              src={work.imagePath} 
              alt={work.title} 
              className="w-full h-72 object-cover" // Increased height for mobile
            />
          </div>
        ))}
        <div
          ref={el => cardsRef.current[6] = el}
          className="bg-white rounded-lg shadow-lg h-72 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors" // Increased height for mobile
          onClick={() => window.location.href = '/projects'}
        >
          <span className="text-xl font-semibold text-gray-800">View More Projects →</span>
        </div>
      </div>
    </div>
  );
};

export default Projects;
