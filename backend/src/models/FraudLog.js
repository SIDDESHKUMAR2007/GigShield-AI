const mongoose = require('mongoose');

const fraudLogSchema = new mongoose.Schema({
  claimId: { type: mongoose.Schema.Types.ObjectId, ref: 'Claim', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fraudScore: { type: Number, required: true },
  isFraudulent: { type: Boolean, required: true },
  reasons: [{ type: String }],
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FraudLog', fraudLogSchema);
