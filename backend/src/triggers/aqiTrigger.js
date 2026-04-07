const cron = require('node-cron');
const { autoInitiateClaims } = require('../services/claimAutomation');

exports.start = () => {
    // Run every hour
    cron.schedule('0 * * * *', async () => {
        console.log('[AQI Trigger] Checking pollution data...');
        const mockAQI = Math.random() * 600; 
        
        if (mockAQI > 400) {
            console.log('[AQI Trigger] Hazardous Air Quality detected!');
            await autoInitiateClaims({
                type: 'aqi',
                zone: 'Delhi NCR',
                severity: mockAQI
            });
        }
    });
};
