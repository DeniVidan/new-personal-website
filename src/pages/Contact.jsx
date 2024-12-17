import React, { useState, useEffect } from "react";

const ContactPage = () => {
  const [messages, setMessages] = useState([]); // State to hold messages
  const [input, setInput] = useState(""); // State for user input
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    interest: "",
  }); // State for user data

  useEffect(() => {
    // Initial AI message
    setMessages([
      {
        sender: "DENI AI",
        text: (
          <>
            Hello, <br /> My name is Deni, and I do most of the creative things
            on web. <br />
            <br /> What is your name?
          </>
        ),
      },
    ]);
  }, []);

  const handleSend = () => {
    // Add user message to messages
    setMessages([...messages, { sender: "You", text: input }]);

    // Process input and update userData
    if (!userData.name) {
      setUserData({ ...userData, name: input });
      setMessages((prev) => [
        ...prev,
        {
          sender: "DENI AI",
          text: (
            <>
              Hi{" "}
              <span
                style={{
                  background: "linear-gradient(to right, red, orange)",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  fontWeight: "bold",
                }}
              >
                {input}
              </span>{" "}
              ! <br />
              How is your day going? <br /> <br />
              What is your email address? <br /> <br />
              Our team will reach out after this conversation!
            </>
          ),
        },
      ]);
    } else if (!userData.email) {
      setUserData({ ...userData, email: input });
      setMessages((prev) => [
        ...prev,
        {
          sender: "DENI AI",
          text: (
            <>
              Thank you! We will send you an email to{" "}
              <span
                style={{
                  background: "linear-gradient(to right, red, orange)",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  fontWeight: "bold",
                }}
              >
                {input}
              </span> {" "}! <br /> <br /> What interests you? <br />
              <br /> Is it a website or a design? ... What is it?
            </>
          ),
        },
      ]);
    } else if (!userData.interest) {
      setUserData({ ...userData, interest: input });
      setMessages((prev) => [
        ...prev,
        {
          sender: "DENI AI",
          text: "Thank you! We will send you offers based on your interests.",
        },
      ]);
      // Here you would send userData to your API
      sendUserDataToAPI(userData);
    }

    setInput(""); // Clear input field
  };

  const sendUserDataToAPI = (data) => {
    // Function to send user data to your API
    console.log("Sending user data to API:", data);
    // Implement your API call here
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default form submission
      handleSend(); // Call handleSend on Enter key press
    }
  };

  return (
    <div className="flex flex-col h-screen text-white mx-auto max-w-[65%]">
      {" "}
      {/* Adjusted width for desktop */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 ${msg.sender === "You" ? "text-right" : ""}`}
          >
            <div className="text-sm text-gray-400 mb-1">{msg.sender}</div>
            <div
              className={`bg-${
                msg.sender === "You"
                  ? "gradient-to-r from-red-500 to-orange-500"
                  : "white"
              } ${
                msg.sender === "You" ? "text-white" : "text-black"
              } p-3 rounded-3xl inline-block px-6 max-w-full`}
            >
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Input Field */}
      <div className="fixed bottom-0 left-0 right-0 p-4 flex items-center mx-auto max-w-[45%]">
        <input
          type="text"
          placeholder="Type something ..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress} // Add key press handler
          className="flex-1 py-3 rounded-3xl bg-white text-gray-700 focus:outline-none pl-5 w-[65%]" // Reduced width by 35%
        />
        <div
          className="ml-2 flex cursor-pointer items-center justify-center text-white !important rounded-full bg-gradient-to-r from-red-500 to-orange-500"
          onClick={handleSend} // Send message on click
          style={{
            height: "48px", // Same height as input
            width: "48px", // Maintain circular shape
          }}
        >
          <img
            src="chess-horse.svg"
            alt="Chess Horse"
            className="w-3/4 h-3/4 object-contain" // Scale image proportionally
          />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
