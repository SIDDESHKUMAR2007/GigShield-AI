const cron = require('node-cron');
const { autoInitiateClaims } = require('../services/claimAutomation');

exports.start = () => {
    // Run every 30 minutes
    cron.schedule('*/30 * * * *', async () => {
        console.log('[Weather Trigger] Checking rainfall data...');
        // Mock external API call
        const mockRainfall = Math.random() * 50; 
        
        if (mockRainfall > 30) {
            console.log('[Weather Trigger] Extreme rainfall detected!');
            await autoInitiateClaims({
                type: 'rainfall',
                zone: 'Koramangala', // typically you'd iterate zones API
                severity: mockRainfall
            });
        }
    });
};
