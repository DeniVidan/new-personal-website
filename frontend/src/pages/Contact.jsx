import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Define the list of services you want to appear as separate messages
const SERVICE_CHOICES = ["Website Design", "Logo Design", "Branding", "SEO", "Other"];

const ContactPage = ({ onForceShowBanner }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [thinkingMessageId, setThinkingMessageId] = useState(null);
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

    // 1) Add user's message
    setMessages((prev) => [...prev, { sender: "You", text: userMessage }]);

    // 2) Add "Thinking..." message
    const tempId = `thinking-${Date.now()}`;
    setThinkingMessageId(tempId);
    setMessages((prev) => [
      ...prev,
      { sender: "DENI AI", text: "", id: tempId, thinking: true },
    ]);
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/chat`,
        { userInput: userMessage },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );

      // Remove "Thinking..."
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));

      if (response.data.showServiceSuggestions) {
        // *** Return multiple "fake user messages" on the right side ***
        // each with style: border radius 9999px, border color pink->orange, background none, text white
        // We'll skip adding the normal AI message
        SERVICE_CHOICES.forEach((service) => {
          setMessages((prev) => [
            ...prev,
            {
              sender: "You", // appear on the right
              text: service,
              styleServiceChoice: true, // custom styling
            },
          ]);
        });
      } else {
        // Normal AI message
        const finalMsg = response.data.aiMessage;
        if (finalMsg) {
          setMessages((prev) => [
            ...prev,
            { sender: "DENI AI", text: finalMsg, animation: true },
          ]);
        }
      }
    } catch (error) {
      console.error("Error in handleSend:", error);
      // Remove "Thinking..."
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== tempId)
      );
      // Show error message
      setMessages((prev) => [
        ...prev,
        { sender: "DENI AI", text: "An error occurred. Please try again." },
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
      <div className="flex-1 flex flex-col justify-end mb-20 p-4 pb-24 overflow-y-auto">
        {messages.map((msg, index) => {
          // COOKIES PROMPT
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

          // "Thinking..." gradient
          if (msg.thinking) {
            return (
              <div key={index} className="mb-4">
                <div className="text-sm text-gray-400 mb-1">DENI AI</div>
                <div
                  className="p-3 rounded-3xl inline-block px-6 max-w-[80%] text-left"
                  style={{
                    backgroundImage: "linear-gradient(90deg, #000, #FFF, #000)",
                    backgroundSize: "200% 200%",
                    animation: "gradient-move 3s linear infinite forwards",
                    color: "transparent",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                  }}
                >
                  Thinking...
                </div>
              </div>
            );
          }

          // SERVICE CHOICE special styling
          if (msg.styleServiceChoice) {
            // user side with circle gradient border, background none, text white
            return (
              <div key={index} className="mb-4 text-right">
                <div className="text-sm text-gray-400 mb-1">You</div>
                <div
                  className="inline-block px-6 py-2 max-w-[80%] text-white rounded-full border-2"
                  style={{
                    borderImage: "linear-gradient(to right, pink, orange) 1",
                    background: "none",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            );
          }

          // Normal messages
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
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input field */}
      <div className="fixed bottom-0 left-0 right-0 p-4 flex items-center mx-auto md:max-w-[45%]">
        <textarea
          ref={inputRef}
          rows={1}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            const textarea = inputRef.current;
            textarea.style.height = "auto";
            textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
          }}
          onKeyPress={handleKeyPress}
          placeholder="Type something..."
          className="
            resize-none
            flex-1
            py-3
            rounded-3xl
            bg-white
            text-gray-700
            focus:outline-none
            pl-5
            w-[65%]
            font-montserrat
            overflow-y-auto
            overflow-x-hidden
            custom-scrollbar
            overscroll-contain
            touch-pan-y
          "
          style={{
            lineHeight: "1.5",
            maxHeight: "120px",
          }}
        />
        <div
          className="ml-2 flex cursor-pointer items-center justify-center text-white rounded-full bg-gradient-to-r from-red-500 to-orange-500"
          onClick={handleSend}
          style={{ height: "48px", width: "48px" }}
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
