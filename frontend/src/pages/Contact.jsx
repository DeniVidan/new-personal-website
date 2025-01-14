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
  const [step, setStep] = useState(1); // Track conversation step

  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  // 1) Warm up backend (non-blocking)
  useEffect(() => {
    const warmUpBackend = async () => {
      try {
        await axios.get(`${API_BASE_URL}/api/warmup`, { timeout: 3000 });
        console.log("Backend warmed up successfully.");
      } catch (error) {
        console.warn("Backend warm-up failed (non-blocking):", error.message);
      }
    };
    warmUpBackend();
  }, []);

  // 2) Initial greeting
  useEffect(() => {
    setMessages([
      { sender: "DENI AI", text: "Hi there! What is your name?", animation: true },
    ]);
  }, []);

  // 3) Scroll to bottom when messages change
  useEffect(() => {
    messagesContainerRef.current?.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  /**
   * handleSend:
   *  - Sends user message to backend
   *  - Removes "Thinking..." placeholder & inserts final chatbot message
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

    // Add "Thinking..."
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

      // Remove placeholder
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));

      if (response.data.showServiceSuggestions) {
        setStep(3); // Step for interest selection
        setMessages((prev) => [
          ...prev,
          { sender: "DENI AI", text: response.data.aiMessage, animation: true },
        ]);
        setTimeout(() => setShowSuggestions(true), 500);
      } else if (response.data.aiMessage) {
        setStep((prevStep) => prevStep + 1);
        setMessages((prev) => [
          ...prev,
          { sender: "DENI AI", text: response.data.aiMessage, animation: true },
        ]);
      }
    } catch (error) {
      console.error("Error in handleSend:", error);
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
      setMessages((prev) => [
        ...prev,
        {
          sender: "DENI AI",
          text: "An error occurred. Please try again later.",
          animation: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 4) Send on Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 5) Show suggestions only during step 3
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (value.trim() === "" && step === 3) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }

    const textarea = inputRef.current;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  return (
    <div className="flex flex-col h-screen text-white mx-auto md:max-w-[65%] font-montserrat">
      {/* Chat container with scrollable messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 flex flex-col px-4 pt-4 pb-2 overflow-y-auto"
        style={{ scrollBehavior: "smooth" }}
      >
        {/* Render messages */}
        {messages.map((msg, index) => {
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

        {showSuggestions && (
          <div className="flex flex-col items-end mb-4 animate-pop">
            {SERVICE_CHOICES.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleSend(choice)}
                className="text-white font-medium py-2 px-4 rounded-full shadow mt-2 border-1 border-orange-500 bg-transparent hover:bg-orange-500 hover:text-black transition-colors duration-200 animate-pop"
              >
                {choice}
              </button>
            ))}
          </div>
        )}

        <div ref={messagesContainerRef} />
      </div>

      {/* Input field */}
      <div className="p-4 sticky bottom-0 bg-black">
        <div className="flex mx-auto lg:max-w-[45%]">
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type something..."
            className="resize-none flex-1 py-3 rounded-3xl bg-white text-gray-700 focus:outline-none pl-5 w-[65%] font-montserrat"
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
