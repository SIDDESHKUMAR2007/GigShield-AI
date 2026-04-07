const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  policyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Policy' },
  claimId: { type: mongoose.Schema.Types.ObjectId, ref: 'Claim' },
  type: { type: String, enum: ['premium_collection', 'claim_payout'], required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
  transactionId: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);
