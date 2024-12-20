const express = require('express');
const cors = require('cors'); // Import the cors package
const dotenv = require('dotenv');
const mainRouter = require('./routes/main'); // Import the main routes
dotenv.config(); // Load environment variables

const app = express();

// Enable CORS for all routes (or you can specify certain origins)
app.use(cors()); // You can specify your frontend's URL here if you want more restrictions
app.use(express.json()); // To parse incoming JSON data
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
}));
// Use main router for API routes
app.use('/api', mainRouter);

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
