const { OpenAI } = require("openai");
const nodemailer = require("nodemailer");
const express = require("express");
const { generatePrompt } = require("../utils/generatePrompt");
require("dotenv").config();

const router = express.Router();

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Mailer Setup (using Nodemailer)
const transporter = nodemailer.createTransport({
  service: "gmail", // Change this based on your email provider
  auth: {
    user: process.env.EMAIL, // Your email address
    pass: process.env.EMAIL_PASSWORD, // Your email password or app password
  },
});

router.post("/chatgpt", async (req, res) => {
  const { name, email, request } = req.body; // Get the user data from the frontend

  // Predefined prompt to generate the offer (you can customize this based on your business)
  const offerPrompt = generatePrompt(name, request);


  try {
    // Request ChatGPT to generate the offer based on user input
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // You can switch to GPT-4 if you're using that
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant for generating custom offers. Include emoji.",
        },
        { role: "user", content: offerPrompt },
      ],
    });

    // Extract the offer from the response
    const offerText = response.choices[0].message.content;

    // Send the generated offer to the user's email
    const mailOptionsToUser = {
      from: process.env.EMAIL, // Your email address
      to: email,
      subject: `Your Custom Offer from Our Store`,
      text: `${offerText}`,
    };

    // Send a copy of the email to yourself
    const mailOptionsToSelf = {
      from: process.env.EMAIL, // Your email address
      to: "denividan@gmail.com", // Your email to receive the copy
      subject: `New Offer Sent to ${name}`,
      text: `Offer ${request} sent to ${name} (${email}):\n\n${offerText}`,
    };

    // Send the email to the user
    transporter.sendMail(mailOptionsToUser, (error, info) => {
      if (error) {
        return res.status(500).json({ message: "Error sending email", error });
      }

      // Send a copy to yourself
      transporter.sendMail(mailOptionsToSelf, (error) => {
        if (error) {
          console.error("Error sending copy to self:", error);
        }
      });

      res.status(200).json({ message: "Offer sent successfully", info });
    });
  } catch (error) {
    console.error("Error generating offer or sending email:", error);
    res.status(500).json({ message: "An error occurred", error });
  }
});

// Store user data temporarily (in production, this would be in a database)

let userData = {
    name: "",
    email: "",
    interest: "",
};

let conversationState = {
    step: 1, // Step 1: waiting for name, 2: waiting for email, 3: waiting for interest
};

// Helper functions for validation
const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
};

// Function to handle user input and generate appropriate responses
const handleUserInput = async (input) => {
    let response = "";

    switch (conversationState.step) {
        case 1:
            // If the input is likely a name (not empty or short), accept it
            if (input.trim().length > 1) {
                userData.name = input;
                conversationState.step = 2;
                response = `Nice to meet you, ${input}! Can you please provide your email address?`;
            } else {
                response = "Please provide a valid name.";
            }
            break;
        case 2:
            // Validate and save email
            if (validateEmail(input)) {
                userData.email = input;
                conversationState.step = 3;
                response = "Thank you! Now, what are you interested in?";
            } else {
                response = "Please enter a valid email address.";
            }
            break;
        case 3:
            // Save the user's interest
            userData.interest = input;

            // Generate the prompt for the personalized offer
            const offerPrompt = generatePrompt(userData.name, input); // Generate the offer prompt using generatePrompt.js

            // Now pass this generated offer prompt to OpenAI for the response
            const offerResponse = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant for generating custom offers.",
                    },
                    { role: "user", content: offerPrompt },
                ],
            });

            // Get the generated offer text from OpenAI's response
            const offerText = offerResponse.choices[0].message.content;

            // Send the offer to the user's email
            const mailOptions = {
                from: process.env.EMAIL,
                to: userData.email,
                subject: `Your Custom Offer from Our Store`,
                text: offerText,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("Error sending email:", error);
                } else {
                    // Send a copy to yourself
                    const mailOptionsToSelf = {
                        from: process.env.EMAIL,
                        to: "denividan@gmail.com",
                        subject: `New Offer Sent to ${userData.name}`,
                        text: `Offer sent to ${userData.name} (${userData.email}):\n\n${offerText}`,
                    };

                    transporter.sendMail(mailOptionsToSelf, (error) => {
                        if (error) {
                            console.error("Error sending copy to self:", error);
                        }
                    });
                }
            });

            conversationState.step = 4; // End of conversation
            response = "Thank you for providing all the information! Your offer has been sent via email.";
            break;
        default:
            response = "Thank you for your patience! This page is currently in progress.";
            break;
    }

    return response;
};

router.post('/chat', async (req, res) => {
    const { userInput } = req.body;

    // Handle the user input and generate the next message based on the step
    const aiResponse = await handleUserInput(userInput);

    // If it's the first message (no previous state), send the initial message
    if (conversationState.step === 1 && aiResponse.includes("Hi there")) {
        return res.json({ aiMessage: aiResponse });
    }

    // Send the AI's response back to the frontend
    res.json({ aiMessage: aiResponse });
});

module.exports = router; // Export the router for use in server.js
