// emailTransporter.js
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,          // e.g., "your-email@gmail.com"
    pass: process.env.EMAIL_PASSWORD, // app password if 2FA is on
  },
});

module.exports = transporter;

