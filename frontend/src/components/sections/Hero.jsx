import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const Hero = () => {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const textRef1 = useRef(null);
  const textRef2 = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({defaults: {duration: 1, ease: "power3.out"}});

    // Set initial states
    gsap.set([sectionRef.current, imageRef.current, textRef1.current, textRef2.current], {
      opacity: 0
    });
    gsap.set(sectionRef.current, {scale: 0.8});
    gsap.set([textRef1.current, textRef2.current], {y: -50});

    // Animate elements
    tl.to(sectionRef.current, {
      scale: 1,
      opacity: 1
    })
    .to(imageRef.current, {
      opacity: 1,
      duration: 1.5
    }, "-=0.5")
    .to(textRef1.current, {
      y: 0,
      opacity: 1
    }, "-=1.4")
    .to(textRef2.current, {
      y: 0,
      opacity: 1
    }, "-=1.2");

  }, []);

  return (
    <section ref={sectionRef} className="m-16 relative w-48 h-48 lg:w-96 lg:h-96 flex items-center justify-center bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg">
      <img
        ref={imageRef}
        src="hero-img.png"
        alt="Hero"
        className="absolute inset-0 w-full h-full object-cover z-20"
      />
      <div className="absolute -top-8 z-10 text-center text-white w-screen">
        <h1 className="text-6xl lg:text-9xl font-bold flex flex-col items-center justify-center gap-4">
          <div ref={textRef1} className="font-custom">I MAKE IT</div>
          <div ref={textRef2} className="font-custom">HAPPEN</div>
        </h1>
      </div>
    </section>
  );
};

export default Hero;