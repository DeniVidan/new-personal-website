import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const Services = () => {
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const text3Ref = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const line3Ref = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const tl = gsap.timeline({ defaults: { duration: 1, ease: "power3.out" }});

    // Set initial states
    gsap.set([text1Ref.current, text3Ref.current], { x: -100, opacity: 0 });
    gsap.set(text2Ref.current, { x: 100, opacity: 0 });
    gsap.set([line1Ref.current, line3Ref.current], { x: 100, opacity: 0 });
    gsap.set(line2Ref.current, { x: -100, opacity: 0 });

    // Animate elements
    tl.to([text1Ref.current, line1Ref.current], {
      x: 0,
      opacity: 1,
      stagger: 0.2
    })
    .to([line2Ref.current, text2Ref.current], {
      x: 0,
      opacity: 1,
      stagger: 0.2
    }, "-=0.5")
    .to([text3Ref.current, line3Ref.current], {
      x: 0,
      opacity: 1,
      stagger: 0.2
    }, "-=0.5");

    // Fade out on scroll
    gsap.to(sectionRef.current, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "top -=200",
        scrub: true,
      },
      opacity: 0
    });

  }, []);

  return (
    <section ref={sectionRef} className="mt-28 w-full px-4 min-h-auto bg-transparent text-white overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col gap-4">
          <div className="flex whitespace-nowrap">
            <h2 ref={text1Ref} className="text-3xl lg:text-5xl font-custom self-center shrink-0">WEB DEVELOPER</h2>
            <div ref={line1Ref} className="bg-white h-8 md:h-10 w-full ml-4"></div>
          </div>
          
          <div className="flex whitespace-nowrap">
            <div ref={line2Ref} className="bg-white h-8 md:h-10 w-full mr-4"></div>
            <h2 ref={text2Ref} className="text-3xl lg:text-5xl font-custom self-center shrink-0">WEB DESIGNER</h2>
          </div>
          
          <div className="flex whitespace-nowrap">
            <h2 ref={text3Ref} className="text-3xl lg:text-5xl font-custom self-center shrink-0">LOGO DESIGNER</h2>
            <div ref={line3Ref} className="bg-white h-8 md:h-10 w-full ml-4"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;