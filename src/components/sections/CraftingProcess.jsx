

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const CraftingProcess = () => {
  const titleRef = useRef(null);
  const stepsRefs = useRef([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Animate title
    gsap.fromTo(
      titleRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.6,
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top center+=100",
          toggleActions: "play none none reverse",
        }
      }
    );

    // Animate each step individually
    stepsRefs.current.forEach((stepRef) => {
      gsap.fromTo(
        stepRef,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.3,
          scrollTrigger: {
            trigger: stepRef,
            start: "top center+=250",
            toggleActions: "play none none reverse",
            ease: "power3.out",
            markers: false
          }
        }
      );
    });
  }, []);

  const steps = [
    {
      number: "I",
      title: "BE BETTER THEN COMPETITORS",
      mainText: "LEARN. TAKE NOTES. STUDY. BUT NEVER COPY.",
      secondaryText: "RESEARCH THE MARKET"
    },
    {
      number: "II", 
      title: "TIME TO BE CREATIVE", 
      mainText: "FUNCTIONALITY AND BEAUTY IS WHAT WE SEEK.",
      secondaryText: "CREATE THE DESIGN"
    },
    {
      number: "III",
      title: "BUILD PROPERLY OR DON’T",
      mainText: "THE BEST TECHNOLOGY CHOICE FOR YOUR NEEDS!",
      secondaryText: "FIND WHAT BEST SUITS YOU"
    }
  ];

  return (
    <div className="min-h-screen w-screen bg-transparent text-white py-20">
      <div className="h-screen flex items-center justify-center px-8">
        <h1 
          ref={titleRef}
          className="text-5xl md:text-7xl font-bold text-center flex flex-col items-center gap-4"
        >
          <p className="leading-[4rem] md:leading-[6rem] font-custom">HERE'S HOW I MAKE YOU</p>
          <img src="/smile.svg" alt="smile" className="w-12 h-12 md:w-16 md:h-16" />
        </h1>
      </div>

      <div 
        className="max-w-6xl md:max-w-full mx-auto grid grid-cols-1 gap-8 md:px-0"
      >
        {steps.map((step, index) => (
          <>
            <div 
              key={index}
              ref={el => stepsRefs.current[index] = el}
              className="font-custom px-8 py-4 transition-all duration-300 relative space-y-10"
            >
              <div className="relative w-full h-10 md:h-14 top-4 left-0">
                <div className="absolute top-0 left-0 bg-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded text-black text-2xl md:text-4xl font-medium">
                  {step.number}
                </div>
              </div>
              <p className="text-gray-400 mt-8 md:text-2xl text-center">{step.secondaryText}</p>
              <h2 className="text-3xl md:text-6xl font-semibold text-center">{step.title}</h2>
              <p className="text-xl md:text-3xl text-gray-300 text-center">{step.mainText}</p>
            </div>
            {index < steps.length - 1 && (
              <div className="col-span-full h-[1px] bg-white bg-opacity-50" />
            )}
          </>
        ))}
      </div>
    </div>
  );
};

export default CraftingProcess;
