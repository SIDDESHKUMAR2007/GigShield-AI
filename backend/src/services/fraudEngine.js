/**
 * Fraud Detection Engine
 * Determines if a parametric claim is legitimate based on worker behavior anomalies.
 */

function evaluateFraud(claimRequest, workerHistory) {
  let fraudScore = 0;
  const reasons = [];

  // 1. Time Pattern Verification
  // Validates if the claim timestamp matches the zone's external disruption timestamp
  const timediff = Math.abs(claimRequest.timestamp - claimRequest.disruptionTimestamp);
  if (timediff > 12 * 60 * 60 * 1000) { // 12 hours difference
    fraudScore += 40;
    reasons.push("Claim reported too far from actual disruption time.");
  }

  // 2. Location Validation (GPS Spoofing check)
  // Check if IP location matches delivery zone
  if (claimRequest.ipZone !== claimRequest.registeredZone) {
    fraudScore += 30;
    reasons.push("IP location does not match registered delivery zone.");
  }

  // 3. Fake Inactivity / Duplicate Claims
  // If the worker has delivered within the disruption period
  if (workerHistory.deliveriesDuringDisruption > 0) {
    fraudScore += 80;
    reasons.push("Deliveries registered during active disruption period.");
  }

  // Determine Result
  let isFraudulent = fraudScore > 60;

  return {
    fraudScore,
    isFraudulent,
    reasons,
    confidence: isFraudulent ? 'HIGH' : 'LOW'
  };
}

module.exports = { evaluateFraud };
