from fastapi import FastAPI
from pydantic import BaseModel
from risk_scorer import evaluate_risk
from fraud_detector import evaluate_fraud
import random

app = FastAPI(title="GigShield AI Engine")

class RiskScoreRequest(BaseModel):
    worker: dict
    environment: dict

class FraudScoreRequest(BaseModel):
    claim: dict

@app.post("/risk-score")
def calculate_risk(req: RiskScoreRequest):
    return evaluate_risk(req.worker, req.environment)

@app.post("/fraud-score")
def calculate_fraud(req: FraudScoreRequest):
    return evaluate_fraud(req.claim)

@app.get("/prediction")
def get_prediction():
    return {
        "disruptionProbability": round(random.uniform(10, 80), 2),
        "expectedClaimLoad": random.randint(100, 500),
        "highRiskZones": ["Koramangala", "Delhi NCR"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
