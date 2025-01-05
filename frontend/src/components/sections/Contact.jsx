import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Get the API base URL from .env
const LOCAL_API = "http://localhost:5001"
const Contact = () => {
  const titleRef = useRef(null);
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: ''
  });
  const [loading, setLoading] = useState(false); // State to manage loading

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when submitting

    const userData = {
      name: formData.name,
      email: formData.email,
      request: formData.service // Changed to use the selected service
    };

    try {
      const response = await axios.post(`${LOCAL_API}/api/chatgpt`, userData);
      console.log("Offer Sent: ", response.data);
      alert("Message has been sent!"); // Alert for successful message
    } catch (error) {
      console.error("Error: ", error);
      alert("Message could not be sent."); // Alert for error
    } finally {
      setLoading(false); // Reset loading state
    }
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
          className="space-y-2 font-raleway"
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
              <option value="Website and Webdesign">Website and Web design</option>
              <option value="Website only">Website only</option>
              <option value="Webdesign only">Web design only</option>
              <option value="Logo creation">Logo</option>
              <option value="Branding">Branding</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <span className="font-raleway text-black opacity-50">SEND A MESSAGE</span>
            {loading ? (
              <img src="/loading-circle.gif" alt="Loading..." className="w-8 h-8" /> // Animated loading GIF
            ) : (
              <img src="/chess-horse.svg" alt="chess king" className="w-8 h-8" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
