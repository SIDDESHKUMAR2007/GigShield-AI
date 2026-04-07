const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const policyController = require('../controllers/policyController');
const claimController = require('../controllers/claimController');
const { verifyToken, verifyAdmin } = require('../utils/authMiddleware');
const axios = require('axios');

// Auth Routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// Policy Routes
router.post('/policy/activate', verifyToken, policyController.calculateAndCreatePolicy);
router.get('/policy/me', verifyToken, policyController.getWorkerPolicy);
router.get('/policy/all', verifyAdmin, policyController.getAllPolicies);

// Claim Routes
router.get('/claims/me', verifyToken, claimController.getWorkerClaims);
router.get('/claims/all', verifyAdmin, claimController.getAllClaims);
router.post('/claims/payout', verifyAdmin, claimController.simulatePayout);

// Dashboard Analytics Route
router.get('/analytics/dashboard', async (req, res) => {
    try {
        const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://localhost:8000';
        
        let aiPred = { disruptionProbability: 0, expectedClaimLoad: 0, highRiskZones: [] };
        try {
            const resp = await axios.get(`${AI_ENGINE_URL}/prediction`);
            aiPred = resp.data;
        } catch (e) {
            console.warn("AI Engine unreachable for prediction");
        }

        res.json({
            totalInsured: 1520, // Mock stats due to lack of populated db in demo
            activePolicies: 1200,
            claimsTriggered: 120,
            fraudAlerts: 4,
            heatMapData: [],
            aiPrediction: aiPred
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
