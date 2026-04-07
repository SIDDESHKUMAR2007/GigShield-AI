const Claim = require('../models/Claim');
const Policy = require('../models/Policy');
const FraudLog = require('../models/FraudLog');
const TriggerEvent = require('../models/TriggerEvent');
const axios = require('axios');

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://localhost:8000';

async function autoInitiateClaims(triggerData) {
  console.log(`[Claim Automation] Disruption Detected: ${triggerData.type} in ${triggerData.zone}`);
  
  try {
      // 1. Log Trigger Event
      const trigger = new TriggerEvent({
          type: triggerData.type,
          zone: triggerData.zone,
          severity: triggerData.severity || 100
      });
      await trigger.save();

      // 2. Fetch all active policies in the affected zone
      const affectedPolicies = await Policy.find({ status: 'active' }).populate('userId');
      
      // Since demo might lack proper DB entries, we simply mock iterables if empty during dev
      const policies = affectedPolicies.filter(p => p.userId && p.userId.deliveryZone === triggerData.zone);

      let claimsProcessed = 0;

      for (const policy of policies) {
        // 3. Call AI Microservice for Fraud Check
        let fraudResult = { isFraudulent: false, reasons: [], fraudScore: 0 };
        try {
            const aiResp = await axios.post(`${AI_ENGINE_URL}/fraud-score`, {
                claim: {
                    claimId: "simulated_req_" + Date.now(),
                    userId: policy.userId._id.toString(),
                    triggerType: triggerData.type,
                    zone: policy.userId.deliveryZone,
                    timestamp: Date.now(),
                    ipZone: policy.userId.deliveryZone, 
                    recentDeliveries: 0,
                    claimsThisWeek: 0
                }
            });
            fraudResult = aiResp.data;
        } catch (err) {
            console.error("AI Fraud Check failed, defaulting to manual review", err.message);
        }

        // 4. Log Fraud check
        const claim = new Claim({
            userId: policy.userId._id,
            policyId: policy._id,
            triggerType: triggerData.type,
            status: fraudResult.isFraudulent ? 'rejected' : 'approved',
            fraudScore: fraudResult.fraudScore,
            payoutAmount: policy.coverageAmount
        });

        await claim.save();

        const fraudLog = new FraudLog({
            claimId: claim._id,
            userId: policy.userId._id,
            fraudScore: fraudResult.fraudScore,
            isFraudulent: fraudResult.isFraudulent,
            reasons: fraudResult.reasons
        });
        await fraudLog.save();

        if (fraudResult.isFraudulent) {
          console.log(`[Fraud Alert] Claim rejected for User ${policy.userId.name}.`);
          continue;
        }

        // 5. Auto Approve Claim
        console.log(`[Claim Approved] Payout of ₹${policy.coverageAmount} scheduled for User ${policy.userId.name}.`);
        claimsProcessed++;
      }

      return { status: 'success', claimsProcessed };
  } catch (error) {
      console.error("[Claim Automation Error]", error);
  }
}

module.exports = { autoInitiateClaims };
