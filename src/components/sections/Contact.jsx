import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const Contact = () => {
  const titleRef = useRef(null);
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: ''
  });

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Animate title
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top center+=100",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Animate form

  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div className="min-h-screen bg-transparent text-white py-20 px-4">
      <div className="h-screen flex items-center justify-center">
        <h1 
          ref={titleRef}
          className="text-5xl lg:text-7xl font-bold text-center font-custom"
        >
          OWNER MAKE A MOVE...
        </h1>
      </div>

      <div className="max-w-2xl mx-auto h-1/2">
        <form 
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-2"
        >
          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="ENTER YOUR NAME"
              className="w-full bg-white text-gray-500 rounded-full py-10 px-6 focus:outline-none"
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ENTER E-MAIL"
              className="w-full bg-white text-gray-500 rounded-full py-10 px-6 focus:outline-none"
            />
          </div>

          <div>
            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              className="w-full bg-white text-gray-500 rounded-full py-10 px-6 focus:outline-none"
            >
              <option value="" disabled>CHOOSE SERVICE</option>
              <option value="service1">Service 1</option>
              <option value="service2">Service 2</option>
              <option value="service3">Service 3</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-5 px-6 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <span>SEND MESSAGE</span>
            <img src="/chess-horse.svg" alt="chess king" className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
