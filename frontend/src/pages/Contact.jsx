import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Define the list of services you want to appear as clickable options
const SERVICE_CHOICES = ["Website", "Website Design", "Logo Design", "Branding"];

const ContactPage = ({ onForceShowBanner }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [thinkingMessageId, setThinkingMessageId] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Remove or handle warm-up gracefully
  useEffect(() => {
    const warmUpBackend = async () => {
      try {
        // Optional warmup. If it fails, just log a warning—don't break the chat.
        await axios.get(`${API_BASE_URL}/api/warmup`, { timeout: 3000 });
        console.log("Backend warmed up successfully.");
      } catch (error) {
        console.warn("Backend warm-up failed (non-blocking):", error.message);
      }
    };
    warmUpBackend();
  }, []);

  // Initial greeting
  useEffect(() => {
    setMessages([
      { sender: "DENI AI", text: "Hi there! What is your name?", animation: true },
    ]);
  }, []);

  // Scroll to the latest message whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /**
   * handleSend:
   *  - Sends user message to backend
   *  - Replaces "Thinking..." with final AI message
   */
  const handleSend = async (message) => {
    const userMessage = message || input.trim();
    if (!userMessage) return;
    setInput("");

    // Add user's message
    setMessages((prev) => [
      ...prev,
      { sender: "You", text: userMessage, animation: true },
    ]);
    setShowSuggestions(false);

    // Add "Thinking..." placeholder
    const tempId = `thinking-${Date.now()}`;
    setThinkingMessageId(tempId);
    setMessages((prev) => [
      ...prev,
      { sender: "DENI AI", text: "", id: tempId, thinking: true },
    ]);
    setLoading(true);

    try {
      // POST to /api/chat
      const response = await axios.post(
        `${API_BASE_URL}/api/chat`,
        { userInput: userMessage },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );

      // Remove placeholder
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));

      if (response.data.showServiceSuggestions) {
        // Show AI message
        setMessages((prev) => [
          ...prev,
          { sender: "DENI AI", text: response.data.aiMessage, animation: true },
        ]);
        // Delay suggestions by 0.5s
        setTimeout(() => {
          setShowSuggestions(true);
        }, 500);
      } else if (response.data.aiMessage) {
        // Normal AI message
        setMessages((prev) => [
          ...prev,
          { sender: "DENI AI", text: response.data.aiMessage, animation: true },
        ]);
      }
    } catch (error) {
      console.error("Error in handleSend:", error);
      // Remove placeholder
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));

      // Show error
      setMessages((prev) => [
        ...prev,
        { sender: "DENI AI", text: "An error occurred. Please try again.", animation: true },
      ]);
    } finally {
      setLoading(false);
      // Scroll to bottom on each send
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Send on Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Re-show suggestions if user clears text
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    // If user fully clears input, re-show suggestions
    if (value.trim() === "") {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }

    // Dynamic textarea height
    const textarea = inputRef.current;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  return (
    <div className="flex flex-col h-screen text-white mx-auto md:max-w-[65%] font-montserrat">
      {/* Chat container - scrollable */}
      <div
        className="
          flex-1
          flex
          flex-col
          p-4
          pt-4
          overflow-y-scroll
          custom-scrollbar
        "
        style={{
          // Example of minimal scrollbar styling (for desktop)
          scrollbarWidth: "thin",        // Firefox
          scrollbarColor: "#999 #444",   // Firefox
        }}
      >
        {messages.map((msg, index) => {
          // Accept cookies
          if (msg.acceptCookiesPrompt) {
            return (
              <div key={index} className={`mb-4 ${msg.sender === "You" ? "text-right" : "text-left"} animate-pop`}>
                <div className="text-sm text-gray-400 mb-1">{msg.sender}</div>
                <div className="bg-white text-black p-3 rounded-3xl inline-block px-6 max-w-[80%]">
                  <p>{msg.text}</p>
                </div>
              </div>
            );
          }

          // "Thinking..." placeholder
          if (msg.thinking) {
            return (
              <div key={index} className="mb-4 animate-pop text-left">
                <div className="text-sm text-gray-400 mb-1">DENI AI</div>
                <div
                  className="p-3 rounded-3xl inline-block px-6 max-w-[80%]"
                  style={{
                    backgroundImage: "linear-gradient(90deg, #000, #FFF, #000)",
                    backgroundSize: "200% 200%",
                    animation: "gradient-move 3s linear infinite",
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

          // Normal messages
          return (
            <div
              key={index}
              className={`mb-4 animate-pop ${
                msg.sender === "You" ? "text-right" : "text-left"
              }`}
            >
              <div className="text-sm text-gray-400 mb-1">{msg.sender}</div>
              <div
                className={`${
                  msg.sender === "You"
                    ? "bg-gradient-to-r from-red-500 to-orange-500 text-white"
                    : "bg-white text-black"
                } p-3 rounded-3xl inline-block px-6 max-w-[80%]`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}

        {/* Delayed suggestions */}
        {showSuggestions && (
          <div
            className="flex flex-col items-end mb-4 animate-pop"
            style={{ animationDelay: "0.5s" }}
          >
            {SERVICE_CHOICES.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleSend(choice)}
                className="
                  text-white
                  font-medium
                  py-2
                  px-4
                  rounded-full
                  shadow
                  mt-2
                  border-2
                  border-orange-500
                  bg-transparent
                  hover:bg-orange-500
                  hover:text-black
                  transition-colors
                  duration-200
                  animate-pop
                "
                style={{ animationDelay: "0.5s" }}
              >
                {choice}
              </button>
            ))}
          </div>
        )}

        {/* So we can always scroll to last message */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input field (no background behind it) */}
      <div className="p-4">
        <div className="flex mx-auto md:max-w-[45%]">
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={handleInputChange}
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
            onClick={() => handleSend()}
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
    </div>
  );
};

export default ContactPage;
