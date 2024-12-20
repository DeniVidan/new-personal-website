import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // Get the API base URL from .env

const ContactPage = () => {
  const [messages, setMessages] = useState([]); // State to hold messages
  const [input, setInput] = useState(""); // State for user input
  const messagesEndRef = useRef(null); // Ref for scrolling to bottom

  useEffect(() => {
    // Initial message from AI, asking for the user's name.
    setMessages([
      {
        sender: "DENI AI",
        text: "Hi there, what is your name?",
        animation: true,
      },
    ]);
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages update
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return; // Prevent empty messages

    // Add user message to chat
    setMessages((prev) => [
      ...prev,
      { sender: "You", text: input, animation: true },
    ]);

    // Send user input to the backend
    try {
      const response = await axios.post(`${API_BASE_URL}/api/chat`, {
        userInput: input,
      });
      console.log(response)
      // Display AI message
      setMessages((prev) => [
        ...prev,
        {
          sender: "DENI AI",
          text: response.data.aiMessage, // Display AI generated message
          animation: true,
        },
      ]);
    } catch (error) {
      console.error("Error generating AI response:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "DENI AI",
          text: "Sorry, there was an error processing your request. Please try again.",
        },
      ]);
    }

    setInput(""); // Clear input field
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
              className={` ${
                msg.sender === "You"
                  ? "bg-gradient-to-r from-red-500 to-orange-500 text-white"
                  : "bg-white text-black"
              } p-3 rounded-3xl inline-block px-6 max-w-[80%] transform ${
                msg.animation ? "animate-pop" : ""
              } text-left`} // Added text-left to align text to the start
            >
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <div className="fixed bottom-0 left-0 right-0 p-4 flex items-center mx-auto md:max-w-[45%]">
        <input
          type="text"
          placeholder="Type something ..."
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
