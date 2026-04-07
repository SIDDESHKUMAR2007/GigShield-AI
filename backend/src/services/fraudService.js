const axios = require('axios');

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://localhost:8000';

exports.getFraudScore = async (claimData) => {
    try {
        const response = await axios.post(`${AI_ENGINE_URL}/fraud-score`, claimData);
        return response.data; // { fraudScore, isFraudulent, reasons }
    } catch (error) {
        console.error("AI Engine Fraud Error:", error.message);
        throw new Error("Unable to evaluate fraud score");
    }
};
