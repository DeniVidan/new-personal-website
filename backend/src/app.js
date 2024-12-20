const express = require("express");
const cors = require("cors");
require("dotenv").config();


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const mainRoutes = require("./routes/main");
app.use("/api", mainRoutes);


module.exports = app;
