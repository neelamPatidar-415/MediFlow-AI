from fastapi import FastAPI
from pydantic import BaseModel
import joblib

app = FastAPI(title="PulsePilot ML Service")

# Load trained model once when the service starts
model = joblib.load("model/adr_model.joblib")


class PatientReport(BaseModel):
    text: str


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict")
def predict(report: PatientReport):
    prediction = model.predict([report.text])[0]
    probability = model.predict_proba([report.text])[0].max()

    return {
        "prediction": "ADR" if prediction == 1 else "Non-ADR",
        "confidence": round(float(probability), 3)
    }