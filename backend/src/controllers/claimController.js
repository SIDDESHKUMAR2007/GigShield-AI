const Claim = require('../models/Claim');
const Policy = require('../models/Policy');
const User = require('../models/User');
const Payment = require('../models/Payment');
const FraudLog = require('../models/FraudLog');
const axios = require('axios');

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://localhost:8000';

exports.getWorkerClaims = async (req, res) => {
    try {
        const claims = await Claim.find({ userId: req.user.id }).sort({ timestamp: -1 });
        res.json(claims);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllClaims = async (req, res) => {
    try {
        const claims = await Claim.find().populate('userId', 'name phone').sort({ timestamp: -1 });
        res.json(claims);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Processing simulated payout
exports.simulatePayout = async (req, res) => {
    try {
        const { claimId } = req.body;
        const claim = await Claim.findById(claimId).populate('userId');
        
        if (!claim) return res.status(404).json({ error: "Claim not found" });
        if (claim.status !== 'approved') return res.status(400).json({ error: "Claim not approved yet" });

        // Simulate Razorpay mock logic
        claim.status = 'paid';
        await claim.save();

        const payment = new Payment({
            userId: claim.userId._id,
            policyId: claim.policyId,
            claimId: claim._id,
            type: 'claim_payout',
            amount: claim.payoutAmount,
            status: 'completed',
            transactionId: `rzp_mock_${Date.now()}`
        });
        await payment.save();

        res.json({ message: "Payout successful", claim, payment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
