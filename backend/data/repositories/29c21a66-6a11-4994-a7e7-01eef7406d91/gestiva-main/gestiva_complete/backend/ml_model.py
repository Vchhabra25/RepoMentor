"""
Gestiva - Maternal Health Risk ML Model
Model: GradientBoostingClassifier (scikit-learn)
Features: 22 clinical inputs → Risk Level (Low / Medium / High)

Run this file standalone to train and test the model:
    python ml_model.py
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
from sklearn.pipeline import Pipeline
import joblib

# ──────────────────────────────────────────────────────────────
# FEATURE COLUMNS (must match what the API sends)
# ──────────────────────────────────────────────────────────────
FEATURE_COLS = [
    "age", "gestational_week", "systolic_bp", "diastolic_bp",
    "blood_glucose", "body_temp", "heart_rate", "hemoglobin", "bmi",
    "fever", "severe_cramps", "heavy_bleeding", "weakness", "depression",
    "mood_swings", "sleep_issues", "swelling", "headache",
    "visual_disturbance", "previous_complications",
    "diabetes_history", "hypertension_history"
]

RISK_LABELS = {0: "Low", 1: "Medium", 2: "High"}


def generate_data(n=2000):
    """
    Synthetic maternal health dataset based on clinical guidelines.
    In production, replace this with your real dataset.
    """
    np.random.seed(42)

    df = pd.DataFrame({
        "age":                    np.random.normal(27, 5, n).clip(15, 50).astype(int),
        "gestational_week":       np.random.randint(4, 42, n),
        "systolic_bp":            np.random.normal(115, 15, n).clip(70, 200),
        "diastolic_bp":           np.random.normal(75, 10, n).clip(50, 130),
        "blood_glucose":          np.random.normal(95, 25, n).clip(50, 300),
        "body_temp":              np.random.normal(98.4, 0.8, n).clip(95, 104),
        "heart_rate":             np.random.normal(82, 12, n).clip(50, 150),
        "hemoglobin":             np.random.normal(11.5, 1.5, n).clip(6, 17),
        "bmi":                    np.random.normal(24, 4, n).clip(15, 45),
        "fever":                  np.random.choice([0, 1], n, p=[0.8, 0.2]),
        "severe_cramps":          np.random.choice([0, 1], n, p=[0.75, 0.25]),
        "heavy_bleeding":         np.random.choice([0, 1], n, p=[0.85, 0.15]),
        "weakness":               np.random.choice([0, 1], n, p=[0.6, 0.4]),
        "depression":             np.random.choice([0, 1], n, p=[0.7, 0.3]),
        "mood_swings":            np.random.choice([0, 1], n, p=[0.6, 0.4]),
        "sleep_issues":           np.random.choice([0, 1], n, p=[0.55, 0.45]),
        "swelling":               np.random.choice([0, 1], n, p=[0.65, 0.35]),
        "headache":               np.random.choice([0, 1], n, p=[0.7, 0.3]),
        "visual_disturbance":     np.random.choice([0, 1], n, p=[0.9, 0.1]),
        "previous_complications": np.random.choice([0, 1], n, p=[0.75, 0.25]),
        "diabetes_history":       np.random.choice([0, 1], n, p=[0.82, 0.18]),
        "hypertension_history":   np.random.choice([0, 1], n, p=[0.8, 0.2]),
    })

    # Clinical risk scoring (based on WHO maternal health guidelines)
    score = np.zeros(n)
    score += (df["systolic_bp"] >= 140).astype(int) * 3
    score += (df["diastolic_bp"] >= 90).astype(int) * 2
    score += (df["blood_glucose"] >= 140).astype(int) * 2
    score += (df["blood_glucose"] >= 180).astype(int) * 2
    score += (df["hemoglobin"] < 9).astype(int) * 2
    score += (df["hemoglobin"] < 11).astype(int) * 1
    score += df["fever"] * 1.5
    score += df["heavy_bleeding"] * 3
    score += df["severe_cramps"] * 2
    score += df["visual_disturbance"] * 3
    score += df["swelling"] * 1.5
    score += df["headache"] * 1
    score += df["previous_complications"] * 2
    score += df["diabetes_history"] * 1.5
    score += df["hypertension_history"] * 2
    score += (df["age"] < 18).astype(int) * 2
    score += (df["age"] > 35).astype(int) * 1.5
    score += (df["bmi"] > 30).astype(int) * 1.5
    score += (df["bmi"] < 18.5).astype(int) * 1

    # Low=0  Medium=1  High=2
    df["risk_level"] = pd.cut(score, bins=[-np.inf, 3, 8, np.inf], labels=[0, 1, 2]).astype(int)
    return df


def train():
    print("Generating training data...")
    df = generate_data(2000)

    X = df[FEATURE_COLS]
    y = df["risk_level"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    model = Pipeline([
        ("scaler", StandardScaler()),
        ("clf", GradientBoostingClassifier(
            n_estimators=200,
            learning_rate=0.08,
            max_depth=5,
            random_state=42
        ))
    ])

    print("Training GradientBoostingClassifier...")
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"\nAccuracy: {acc:.4f}")
    print(classification_report(y_test, y_pred, target_names=["Low", "Medium", "High"]))

    # Save model
    joblib.dump(model, "maternal_risk_model.pkl")
    print("Model saved → maternal_risk_model.pkl")

    return model, acc


def predict(model, patient_data: dict):
    """
    Predict risk for a single patient.
    patient_data: dict with keys matching FEATURE_COLS
    """
    X = pd.DataFrame([patient_data])[FEATURE_COLS]
    risk_idx = int(model.predict(X)[0])
    probs = model.predict_proba(X)[0]
    return {
        "risk_level": RISK_LABELS[risk_idx],
        "probability_low":    round(probs[0] * 100, 1),
        "probability_medium": round(probs[1] * 100, 1),
        "probability_high":   round(probs[2] * 100, 1),
    }


if __name__ == "__main__":
    model, acc = train()

    # Quick test prediction
    test_patient = {
        "age": 32, "gestational_week": 28,
        "systolic_bp": 145, "diastolic_bp": 95,
        "blood_glucose": 160, "body_temp": 99.1,
        "heart_rate": 95, "hemoglobin": 9.5, "bmi": 29,
        "fever": 1, "severe_cramps": 0, "heavy_bleeding": 0,
        "weakness": 1, "depression": 0, "mood_swings": 0,
        "sleep_issues": 1, "swelling": 1, "headache": 1,
        "visual_disturbance": 0, "previous_complications": 1,
        "diabetes_history": 1, "hypertension_history": 1,
    }

    result = predict(model, test_patient)
    print("\nTest prediction:")
    print(f"  Risk Level : {result['risk_level']}")
    print(f"  Low  {result['probability_low']}%  |  Medium  {result['probability_medium']}%  |  High  {result['probability_high']}%")
