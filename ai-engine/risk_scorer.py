def evaluate_risk(worker, environment):
    base_premium = 50.0
    
    weatherRisk = environment.get("weatherRisk", 0) * 0.4
    pollutionRisk = 30 if environment.get("aqi", 0) > 300 else 0
    strikeRisk = 40 if environment.get("curfewActive", False) else 0
    
    zone = worker.get("zone", "")
    safeZoneDiscount = 15 if zone not in ["Koramangala", "Delhi NCR", "HighRiskZone"] else 0
    
    # Premium = base + weatherRisk + pollutionRisk + strikeRisk - safeZoneDiscount
    premium = base_premium + weatherRisk + pollutionRisk + strikeRisk - safeZoneDiscount
    premium = max(premium, 20.0)
    
    score = (premium / 200) * 100
    score = min(score, 100)
    
    return {
        "riskScore": round(score, 2),
        "weeklyPremium": round(premium, 2),
        "eligibility": score < 90
    }
