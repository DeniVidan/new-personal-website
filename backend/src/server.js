const express = require('express');
const cors = require('cors'); // Import the cors package
const dotenv = require('dotenv');
const mainRouter = require('./routes/main'); // Import the main routes
const { OpenAI } = require('openai'); // Import OpenAI for warm-up
dotenv.config(); // Load environment variables

const app = express();

// Initialize OpenAI API
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// **1. Warm-Up OpenAI API**
(async () => {
  try {
    console.log('Warming up OpenAI API...');
    await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Warm-up for chatbot.' },
        { role: 'user', content: 'Hi there!' },
      ],
    });
    console.log('OpenAI warm-up complete.');
  } catch (error) {
    console.error('Failed to warm up OpenAI:', error.message);
  }
})();

// Enable CORS for all routes (or specify certain origins)
app.use(
  cors({
    origin: 'https://denividan.com', // Replace with your deployed frontend URL on Vercel
    credentials: true, // Allow cookies/auth headers
  })
);

app.use(express.json());

// **2. Add Request Profiling Middleware**
app.use((req, res, next) => {
  req.startTime = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - req.startTime;
    console.log(`${req.method} ${req.originalUrl} - ${duration}ms`);
  });
  next();
});

// Use main router for API routes
app.use('/api', mainRouter);

// **3. Health Check Endpoint for UptimeRobot**
app.get('/health', (req, res) => {
  res.status(200).send('Server is healthy.');
});
router.get('/warmup', (req, res) => {
    res.status(200).send('Backend is ready!');
  });

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
