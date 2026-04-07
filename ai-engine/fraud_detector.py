def evaluate_fraud(claim):
    fraud_score = 0.0
    reasons = []
    
    if claim.get("zone") != claim.get("ipZone"):
        fraud_score += 45
        reasons.append("Zone Mismatch (GPS Spoofing likely)")
        
    if claim.get("recentDeliveries", 0) > 0:
        fraud_score += 85
        reasons.append("Deliveries logged during disrupted period")
        
    if claim.get("claimsThisWeek", 0) >= 2:
        fraud_score += 30
        reasons.append("Multiple claims submitted in one week")
        
    fraud_score = min(fraud_score, 100)
    
    return {
        "fraudScore": fraud_score,
        "isFraudulent": fraud_score > 70,
        "reasons": reasons
    }
