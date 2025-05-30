const { OpenAI } = require("openai");
const nodemailer = require("nodemailer");
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { generatePrompt } = require("../utils/generatePrompt");
const ConversationManager = require("../controllers/conversationManager")
const { getSessionData, updateSessionData, clearSession, createOrUpdateSession} = require("../firebase/firebaseSessionStore")
require("dotenv").config();
const cookieParser = require("cookie-parser");
const { format } = require("date-fns"); // Add at the top of your file

function getTimestamp() {
  return format(new Date(), "yyyy-MM-dd HH:mm:ss");
}


const router = express.Router();


router.use(cookieParser());


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
const conversationManager = new ConversationManager();


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
      to: process.env.ADMIN_EMAIL || "denividan@gmail.com", // Your email to receive the copy
      subject: `New Offer Sent to ${name}`,
      text: `Offer ${request} sent to ${name} (${email}):\n\n${offerText}`,
    };

    // Send the email to the user
    const userEmailResponse = await transporter.sendMail(mailOptionsToUser);
    console.log("Email sent to user:", userEmailResponse);
  
    const adminEmailResponse = await transporter.sendMail(mailOptionsToSelf);
    console.log("Email sent to admin:", adminEmailResponse);
  
    res.status(200).json({ message: "Offer sent successfully" });
  } catch (error) {
    console.error("Error generating offer or sending email:", error);
    res.status(500).json({ message: "An error occurred", error });
  }
});

// Store user data temporarily (in production, this would be in a database)



router.post("/chat", async (req, res) => {
  const { userInput } = req.body;
  const existingToken = req.cookies.sessionToken;

  console.log(`[${getTimestamp()}] Incoming Cookies:`, req.cookies);
  console.log(`[${getTimestamp()}] Request Headers:`, req.headers);

  try {
    let sessionToken = existingToken;
    let sessionData;

    // Add headers for cross-origin and cache control
    res.setHeader("Access-Control-Allow-Origin", "https://denividan.com"); // Replace with your domain
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
    res.setHeader("Pragma", "no-cache");

    if (!sessionToken) {
      // Create token & session if no cookie yet
      sessionToken = uuidv4();
      sessionData = { userData: {}, step: "name" };

      // Save to Firestore with expiry
      await createOrUpdateSession(sessionToken, sessionData);

      // Set cookie (cross-origin compatible)
      res.cookie("sessionToken", sessionToken, {
        domain: ".denividan.com", // notice the dot prefix
        path: "/",
        secure: true, // require HTTPS
        sameSite: "none", // if you need cross-subdomain usage
        httpOnly: true,
        maxAge: 3 * 60 * 1000, // 3 minutes
      });

      console.log(`[${getTimestamp()}] New session created:`, sessionToken);
    } else {
      try {
        sessionData = await getSessionData(sessionToken);
        console.log(`[${getTimestamp()}] Existing session loaded:`, sessionData);
      } catch (error) {
        if (error.message === "Session has expired.") {
          console.log(`[${getTimestamp()}] Session expired for token:`, sessionToken);
          return res.status(400).json({
            error: "Wait a few more minutes before chatting again.",
          });
        } else {
          throw error;
        }
      }
    }

    // Process user input
    console.log(`[${getTimestamp()}] Processing user input...`);
    const { aiMessage, updatedSession, showServiceSuggestions  } = await conversationManager.processInput(
      userInput,
      openai,
      sessionData,
      sessionToken
    );

    // Update session in Firestore
    console.log(`[${getTimestamp()}] Updating session in Firestore...`);
    await createOrUpdateSession(sessionToken, updatedSession);

    // Respond with AI message
    console.log(`[${getTimestamp()}] Sending AI message response.`);
    return res.json({ aiMessage, showServiceSuggestions: !!showServiceSuggestions, });
  } catch (error) {
    console.error(`[${getTimestamp()}] Error in /chat route:`, error);
    return res.status(500).json({ error: "An error occurred. Please try again later." });
  }
});


module.exports = router; // Export the router for use in server.js
