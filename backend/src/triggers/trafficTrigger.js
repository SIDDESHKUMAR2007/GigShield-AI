const cron = require('node-cron');
const { autoInitiateClaims } = require('../services/claimAutomation');

exports.start = () => {
    // Run daily
    cron.schedule('0 0 * * *', async () => {
        console.log('[Traffic Trigger] Checking civic unrest/traffic status...');
        // Mock curfews or massive jams
        const isCurfew = Math.random() > 0.9; 
        
        if (isCurfew) {
            console.log('[Traffic Trigger] Government curfew / Massive disruption detected!');
            await autoInitiateClaims({
                type: 'curfew',
                zone: 'Indiranagar',
                severity: 100
            });
        }
    });
};
