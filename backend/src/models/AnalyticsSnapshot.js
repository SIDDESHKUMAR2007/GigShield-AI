const mongoose = require('mongoose');

const analyticsSnapshotSchema = new mongoose.Schema({
  disruptionProbability: { type: Number },
  expectedClaimLoad: { type: Number },
  highRiskZones: [{ type: String }],
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AnalyticsSnapshot', analyticsSnapshotSchema);
