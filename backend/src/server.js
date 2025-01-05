const express = require('express');
const cors = require('cors'); // Import the cors package
const dotenv = require('dotenv');
const mainRouter = require('./routes/main'); // Import the main routes
dotenv.config(); // Load environment variables

const app = express();

// Enable CORS for all routes (or you can specify certain origins)
app.use(cors({
    /* origin: 'https://new-personal-website-d7ja85xsm-denis-projects-0fd97f98.vercel.app/', */ // Replace with your deployed frontend URL on Vercel
    origin: 'http://localhost:5173/',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true, // If using cookies/auth headers
}));
app.use(express.json());
// Use main router for API routes
app.use('/api', mainRouter);

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
