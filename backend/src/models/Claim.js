const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  policyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Policy', required: true },
  triggerType: { 
    type: String, 
    enum: ['rainfall', 'aqi', 'curfew', 'traffic'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['initiated', 'verified', 'approved', 'paid', 'rejected'], 
    default: 'initiated' 
  },
  fraudScore: { type: Number, default: 0 }, // Confidence score (0-100)
  payoutAmount: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Claim', claimSchema);
