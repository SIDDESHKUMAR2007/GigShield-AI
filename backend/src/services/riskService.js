const axios = require('axios');

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://localhost:8000';

exports.getRiskScore = async (workerData) => {
    try {
        const response = await axios.post(`${AI_ENGINE_URL}/risk-score`, workerData);
        return response.data;
    } catch (error) {
        console.error("AI Engine Risk Error:", error.message);
        throw new Error("Unable to fetch AI risk score");
    }
};
