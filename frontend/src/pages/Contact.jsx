import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ContactPage = ({ onForceShowBanner }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setMessages([
      {
        sender: "DENI AI",
        text: "Hi there! What is your name?",
        animation: true,
      },
    ]);
  }, []);

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
      const hasConsent = localStorage.getItem("cookiesAccepted") === "true";
      if (!hasConsent) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "DENI AI",
            text: "Cookies are required to use the chatbot. Please accept cookies.",
            acceptCookiesPrompt: true,
          },
        ]);
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/chat`,
        { userInput: userMessage },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.aiMessage) {
        setMessages((prev) => [
          ...prev,
          { sender: "DENI AI", text: response.data.aiMessage, animation: true },
        ]);
      }
    } catch (error) {
      console.error("Error in handleSend:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "DENI AI",
          text: "An error occurred. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChatAcceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true");
    if (onForceShowBanner) onForceShowBanner();
    window.location.reload();
  };

  return (
    <div className="flex flex-col h-screen text-white mx-auto md:max-w-[65%] font-montserrat">
      <div className="flex-1 flex flex-col justify-end mb-20 p-4 pb-24">
        {messages.map((msg, index) => {
          if (msg.acceptCookiesPrompt) {
            return (
              <div
                key={index}
                className={`mb-4 ${msg.sender === "You" ? "text-right" : ""}`}
              >
                <div className="text-sm text-gray-400 mb-1">{msg.sender}</div>
                <div className="bg-white text-black p-3 rounded-3xl inline-block px-6 max-w-[80%] text-left">
                  <p>{msg.text}</p>
                  <button
                    className="ml-2 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded shadow mt-2"
                    onClick={handleChatAcceptCookies}
                  >
                    Accept Cookies
                  </button>
                </div>
              </div>
            );
          }

          return (
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
                } p-3 rounded-3xl inline-block px-6 max-w-[80%] text-left`}
              >
                <p>{msg.text}</p>
              </div>
            </div>
          );
        })}

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

      {/* Input field */}
      {/* Input field */}
      <div className="fixed bottom-0 left-0 right-0 p-4 flex items-center mx-auto md:max-w-[45%]">
  <textarea
    ref={inputRef}
    rows={1}
    value={input}
    onChange={(e) => {
      setInput(e.target.value);
      // Dynamically adjust the height of the textarea
      const textarea = inputRef.current;
      textarea.style.height = "auto"; // Reset height
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`; // Set new height (max 120px)
    }}
    onKeyPress={handleKeyPress}
    placeholder="Type something..."
    className="resize-none flex-1 py-3 rounded-3xl bg-white text-gray-700 focus:outline-none pl-5 w-[65%] font-montserrat overflow-y-auto overflow-x-hidden custom-scrollbar"
    style={{
      lineHeight: "1.5",
      maxHeight: "120px", // Maximum height of 6 rows
    }}
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
