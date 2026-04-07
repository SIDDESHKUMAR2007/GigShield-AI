const cron = require('node-cron');
const { autoInitiateClaims } = require('../services/claimAutomation');

/**
 * Creates node-cron schedulers that constantly poll external APIs for triggers.
 */
function startSchedulers() {
  console.log('[Scheduler] Automation Workflow Engine Started.');

  // Weather check every 30 minutes (Simulated every 1 hour here)
  cron.schedule('0 * * * *', async () => {
    console.log('[Scheduler] Running Weather API Poll...');
    const simulatedRainfall = Math.random() * 50; // Mock mm/hr
    if (simulatedRainfall > 30) {
      await autoInitiateClaims({
        type: 'rainfall',
        zone: 'Koramangala',
        timestamp: Date.now(),
        severity: simulatedRainfall
      });
    }
  });

  // Pollution check every 1 hour
  cron.schedule('30 * * * *', async () => {
    console.log('[Scheduler] Running Pollution API Poll...');
    const simulatedAQI = Math.random() * 600; 
    if (simulatedAQI > 400) {
      await autoInitiateClaims({
        type: 'aqi',
        zone: 'Delhi NCR',
        timestamp: Date.now()
      });
    }
  });

  // Curfew detection daily check
  cron.schedule('0 0 * * *', () => {
    console.log('[Scheduler] Running Daily Curfew Detection Poll...');
  });
}

module.exports = { startSchedulers };
