const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

require('dotenv').config();

const app = express();

// Crucial: Fix CORS network errors
app.use(cors({ origin: '*' }));
app.use(express.json());

// Connect Database
connectDB();

// Setup Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api', require('./routes/api')); // General routes (policies, claims)

// Start Schedulers
const weatherTrigger = require('./triggers/weatherTrigger');
const aqiTrigger = require('./triggers/aqiTrigger');
const trafficTrigger = require('./triggers/trafficTrigger');

weatherTrigger.start();
aqiTrigger.start();
trafficTrigger.start();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend API running cleanly on http://localhost:${PORT}`);
});
