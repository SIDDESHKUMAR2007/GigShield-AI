const Policy = require('../models/Policy');
const User = require('../models/User');
const axios = require('axios');

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://localhost:8000';

exports.calculateAndCreatePolicy = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Call FastAPI Microservice to calculate risk & premium
        const aiResponse = await axios.post(`${AI_ENGINE_URL}/risk-score`, {
            worker: {
                zone: user.deliveryZone,
                platform: user.platformType,
                earnings: user.avgWeeklyEarnings,
                hours: user.workingHoursPerDay
            },
            environment: {
                weatherRisk: Math.random() * 50, // mock current weather
                aqi: Math.random() * 200,        // mock current AQI
                curfewActive: false
            }
        });

        const { riskScore, weeklyPremium, eligibility } = aiResponse.data;

        if (!eligibility) {
            return res.status(400).json({ error: 'Not eligible for coverage due to extreme initial risk.' });
        }

        // Create Default Inactive Policy Draft
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + 7); // 1 week

        const policy = new Policy({
            userId,
            status: 'active', // mock immediate activation for demo
            riskScore,
            weeklyPremium,
            coverageAmount: user.avgWeeklyEarnings,
            startDate,
            endDate
        });

        await policy.save();

        res.json({ message: "Policy Created", policy });

    } catch (error) {
        console.error("Policy Calc Error", error.message);
        res.status(500).json({ error: "Failed to generate policy." });
    }
};

exports.getWorkerPolicy = async (req, res) => {
    try {
        const policy = await Policy.findOne({ userId: req.user.id, status: 'active' });
        if (!policy) return res.status(404).json({ error: "No active policy found" });
        res.json(policy);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllPolicies = async (req, res) => {
    try {
        const policies = await Policy.find().populate('userId', 'name phone deliveryZone');
        res.json(policies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
