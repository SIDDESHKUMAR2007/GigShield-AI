/**
 * AI Risk & Premium Calculation Engine
 * Formula-based Risk Scoring Engine mocking predictive models.
 * In a production env, this uses TensorFlow.js to predict risk based on past occurrences.
 */

// Weights for different risk factors
const WEIGHTS = {
  weather: 0.35,
  pollution: 0.20,
  traffic: 0.25,
  zoneRisk: 0.20
};

// Base weekly premium in INR
const BASE_PREMIUM = 50;

/**
 * Calculates a Risk Score (0-100) and suggested weekly premium
 */
function calculateRiskAndPremium(workerData, currentEnvs) {
  // 1. Weather Risk (0-100) based on rainfall API mm/hr
  const weatherRisk = Math.min((currentEnvs.rainfall_mm / 20) * 100, 100);
  
  // 2. Pollution (0-100) based on AQI
  const pollutionRisk = Math.min((currentEnvs.aqi / 500) * 100, 100);

  // 3. Traffic Shutdown (0-100) based on civic unrest/traffic
  const trafficRisk = currentEnvs.curfewActive ? 100 : (currentEnvs.trafficCongestion || 0);

  // 4. Zone Risk Profile (historical factor)
  const zoneRisk = getZoneRiskFactor(workerData.deliveryZone);

  // Calculate Weighted Risk Score (0-100)
  const riskScore = Math.floor(
    (weatherRisk * WEIGHTS.weather) +
    (pollutionRisk * WEIGHTS.pollution) +
    (trafficRisk * WEIGHTS.traffic) +
    (zoneRisk * WEIGHTS.zoneRisk)
  );

  // Dynamic Premium Calculation Formula:
  // For every 10 points in risk score, increase premium by 15%
  let premiumMultiplier = 1 + ((riskScore / 10) * 0.15);
  
  // Safe zone discount
  if (zoneRisk < 20) {
    premiumMultiplier -= 0.10; // 10% discount
  }

  let finalPremium = Math.ceil(BASE_PREMIUM * premiumMultiplier);

  return {
    riskScore,
    suggestedPremium: finalPremium,
    breakdown: { weatherRisk, pollutionRisk, trafficRisk, zoneRisk }
  };
}

function getZoneRiskFactor(zoneName) {
  // Mock function returning historical risk score for a zone
  const zoneData = {
    'Kengeri': 30,
    'Indiranagar': 65, // high traffic
    'Koramangala': 70, // high water logging
    'Whitefield': 50
  };
  return zoneData[zoneName] || 40; // Default risk
}

module.exports = {
  calculateRiskAndPremium,
  getZoneRiskFactor
};
