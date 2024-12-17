import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Services from '../components/sections/Services';
import PhotoDump from '../components/aboutsections/PhotoDump';
import Contact from '../components/sections/Contact';
import Footer from '../components/sections/Footer';
import TitleBraker from '../components/sections/TitleBraker';
const AboutPage = () => {
  const textRefs = useRef([]);
  const imageRef = useRef(null);
  const bioTextRefs = useRef([]);
  const rectangleRef = useRef(null);
  const servicesRef = useRef(null);

  useEffect(() => {
    // Animate floating text
    textRefs.current.forEach((ref, index) => {
      gsap.fromTo(ref,
        {
          opacity: 0,
          y: 20
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          delay: index * 0.2,
          ease: "power3.out"
        }
      );
    });

    // Animate rectangle behind image
    gsap.fromTo(rectangleRef.current,
      {
        opacity: 0
      },
      {
        opacity: 1,
        duration: 3,
        ease: "power3.out"
      }
    );

    // Animate image
    gsap.fromTo(imageRef.current,
      {
        opacity: 0,
        filter: "blur(10px)"
      },
      {
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.5,
        delay: 0.3,
        ease: "power3.out"
      }
    );

    // Animate bio text
    bioTextRefs.current.forEach((ref, index) => {
      gsap.fromTo(ref,
        {
          opacity: 0,
          y: 20
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          delay: 0.8 + (index * 0.15),
          ease: "power3.out"
        }
      );
    });

    // Animate services section on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          gsap.fromTo(servicesRef.current,
            {
              opacity: 0,
              y: 50
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power3.out"
            }
          );
        }
      });
    }, { threshold: 0.1 });

    if (servicesRef.current) {
      observer.observe(servicesRef.current);
    }

    return () => {
      if (servicesRef.current) {
        observer.unobserve(servicesRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center text-white">
      <div className="relative w-full">
        <div className="relative w-full h-80 md:h-[80vh] mb-20">
          <p ref={el => textRefs.current[0] = el} className="text-3xl md:text-5xl font-bold mb-2 font-custom transform -rotate-12 absolute left-12 md:left-1/4 top-4">PASSIONATE</p>
          <p ref={el => textRefs.current[1] = el} className="text-2xl md:text-4xl font-bold mb-2 font-custom transform rotate-6 absolute right-10 md:right-1/4 top-16">DETAIL-ORIENTED</p>
          <p ref={el => textRefs.current[2] = el} className="text-4xl md:text-6xl font-bold mb-2 font-custom transform -rotate-3 absolute left-12 md:left-1/4 top-32 md:top-52">HARD WORKING</p>
          <p ref={el => textRefs.current[3] = el} className="text-3xl md:text-5xl font-bold mb-2 font-custom transform rotate-6 absolute right-8 md:right-1/4 bottom-20 md:bottom-72 md:right-[150px]">STRONG DRIVE</p>
          <p ref={el => textRefs.current[4] = el} className="text-2xl md:text-4xl font-bold mb-2 font-custom transform -rotate-6 absolute left-16 md:left-1/3 bottom-0 md:bottom-40 md:left-[250px]">INNOVATIVE SOLUTIONS</p>
        </div>
        <div className="md:flex md:items-center md:justify-between">
          <div className="relative w-full md:w-1/2 h-96 md:h-[600px]">
            <div ref={rectangleRef} className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-500"></div>
            <img ref={imageRef} src="/hero-img.png" alt="Profile" className="absolute -bottom-[1px] w-full h-full object-cover" />
          </div>
          <div className="w-full md:w-1/2 p-8 mt-44 md:mt-0 space-y-6 text-center">
            <p ref={el => bioTextRefs.current[0] = el} className="text-lg md:text-3xl text-gray-200">
              My name is Deni Vidan
            </p>
            <p ref={el => bioTextRefs.current[1] = el} className="text-lg md:text-3xl text-gray-200">
              24 years old
            </p>
            <p ref={el => bioTextRefs.current[2] = el} className="text-lg md:text-3xl text-gray-200">
              I love creating
            </p>
            <p ref={el => bioTextRefs.current[3] = el} className="text-lg md:text-3xl text-gray-200">
              Challenges excite me
            </p>
            <p ref={el => bioTextRefs.current[4] = el} className="text-lg md:text-3xl text-gray-200">
              100% locked in
            </p>
          </div>
        </div>
        <section ref={servicesRef} className="h-screen flex items-center justify-center opacity-0">
          <Services />
        </section>
        <section>
          <PhotoDump />
        </section>
        <section>
          <Contact />
        </section>
        <section>
          <TitleBraker message="TODAY’S DECISION MAKES FUTURE SIMPLE" />
        </section>
        <section>
          <Footer />
        </section>
      </div>
    </div>
  );
};

export default AboutPage;