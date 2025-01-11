import React, { useState, useEffect, useRef } from "react";
import { Cookies } from "react-cookie-consent";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Get the API base URL from .env
const LOCAL_API = "http://localhost:5001"

const ContactPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // 1) Show the initial greeting. This is purely client-side.
  useEffect(() => {
    setMessages([
      {
        sender: "DENI AI",
        text: "Hi there! What is your name?",
        animation: true,
      },
    ]);
  }, []);

  // 2) Scroll to bottom on each new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
  
    const userMessage = input.trim();
    setInput("");
  
    setMessages((prev) => [
      ...prev,
      { sender: "You", text: userMessage, animation: true },
    ]);
    setLoading(true);
  
    try {
      const consent = Cookies.get("userConsent");
      if (consent === "true") {
        const response = await axios.post(
          `${API_BASE_URL}/api/chat`,
          { userInput: userMessage },
          {
            withCredentials: true, // Send cookies only if consented
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
  
        if (response.data.aiMessage) {
          setMessages((prev) => [
            ...prev,
            { sender: "DENI AI", text: response.data.aiMessage, animation: true },
          ]);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "DENI AI", text: "Cookies are required to use the chatbot. Please accept cookies." },
        ]);
      }
    } catch (error) {
      console.error("Error in handleSend:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "DENI AI", text: "An error occurred. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };
  

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen text-white mx-auto md:max-w-[65%] font-montserrat">
      <div className="flex-1 flex flex-col justify-end mb-20 p-4 pb-24">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 ${msg.sender === "You" ? "text-right" : ""}`}
          >
            <div className="text-sm text-gray-400 mb-1">{msg.sender}</div>
            <div
              className={`${
                msg.sender === "You"
                  ? "bg-gradient-to-r from-red-500 to-orange-500 text-white"
                  : "bg-white text-black"
              } p-3 rounded-3xl inline-block px-6 max-w-[80%] ${
                msg.animation ? "animate-pop" : ""
              } text-left`}
            >
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-center">
            <img
              src="/loading-circle.gif"
              alt="Loading..."
              className="w-8 h-8 mx-auto"
            />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <div className="fixed bottom-0 left-0 right-0 p-4 flex items-center mx-auto md:max-w-[45%]">
        <input
          type="text"
          placeholder="Type something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 py-3 rounded-3xl bg-white text-gray-700 focus:outline-none pl-5 w-[65%] font-montserrat"
        />
        <div
          className="ml-2 flex cursor-pointer items-center justify-center text-white rounded-full bg-gradient-to-r from-red-500 to-orange-500"
          onClick={handleSend}
          style={{
            height: "48px",
            width: "48px",
          }}
        >
          <img
            src="chess-horse.svg"
            alt="Chess Horse"
            className="w-3/4 h-3/4 object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
