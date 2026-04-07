const mongoose = require('mongoose');

const triggerEventSchema = new mongoose.Schema({
  type: { type: String, enum: ['rainfall', 'aqi', 'curfew', 'traffic'], required: true },
  zone: { type: String, required: true },
  severity: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  resolved: { type: Boolean, default: false }
});

module.exports = mongoose.model('TriggerEvent', triggerEventSchema);
