const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['active', 'paused', 'expired'], default: 'active' },
  riskScore: { type: Number, required: true }, // Out of 100
  weeklyPremium: { type: Number, required: true },
  coverageAmount: { type: Number, required: true }, // Weekly earnings to cover
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Policy', policySchema);
