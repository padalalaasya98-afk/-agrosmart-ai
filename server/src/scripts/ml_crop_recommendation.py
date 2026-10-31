#!/usr/bin/env python3
"""
AgroSmart AI - Optional Machine Learning Extension (Scikit-Learn Prototype)
Problem ID: HACK-P302

Demonstrates training a multi-class Random Forest Classifier on agro-climatic 
features (N, P, K, Temperature, Humidity, pH, Rainfall) and comparing its 
probabilistic output against the deterministic rule-based engine.
"""

import sys
import json

def run_ml_prototype():
    print("[AgroSmart AI] - Machine Learning Demonstration Extension")
    print("---------------------------------------------------------")
    
    try:
        import numpy as np
        from sklearn.ensemble import RandomForestClassifier
        from sklearn.model_selection import train_test_split
        from sklearn.metrics import accuracy_score
    except ImportError:
        print("Note: numpy / scikit-learn not installed in current Python environment.")
        print("The primary AgroSmart AI application uses the production-grade deterministic engine.")
        print("To run this ML extension: pip install scikit-learn numpy")
        return

    # Synthetic Agronomic Dataset (Features: N, P, K, Temp, Humidity, pH, Rainfall)
    # Target crops: Rice(0), Wheat(1), Maize(2), Cotton(3), Chickpea(4)
    crop_names = ['Rice', 'Wheat', 'Maize', 'Cotton', 'Chickpea']
    
    np.random.seed(42)
    X = []
    y = []

    # Generate synthetic samples centered around documented ICAR crop ranges
    profiles = [
        # [N, P, K, Temp, Hum, pH, Rain]
        ([100, 45, 50, 28, 80, 6.2, 1600], 0, 50), # Rice
        ([115, 55, 45, 18, 55, 6.8, 550],  1, 50), # Wheat
        ([125, 60, 50, 26, 68, 6.6, 800],  2, 50), # Maize
        ([105, 50, 55, 30, 60, 7.2, 850],  3, 50), # Cotton
        ([22,  50, 30, 20, 48, 7.0, 450],  4, 50), # Chickpea
    ]

    for center, label, n_samples in profiles:
        for _ in range(n_samples):
            sample = [
                max(5, center[0] + np.random.normal(0, 10)),
                max(5, center[1] + np.random.normal(0, 8)),
                max(5, center[2] + np.random.normal(0, 8)),
                max(5, center[3] + np.random.normal(0, 3)),
                max(10, min(95, center[4] + np.random.normal(0, 6))),
                max(4.0, min(9.0, center[5] + np.random.normal(0, 0.4))),
                max(100, center[6] + np.random.normal(0, 100))
            ]
            X.append(sample)
            y.append(label)

    X = np.array(X)
    y = np.array(y)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    clf = RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42)
    clf.fit(X_train, y_train)

    preds = clf.predict(X_test)
    acc = accuracy_score(y_test, preds)

    print(f"[SUCCESS] Random Forest Model Trained Successfully!")
    print(f"[ACCURACY] Synthetic Validation Accuracy: {acc * 100:.1f}%")
    print(f"[FEATURES] Model Feature Importances:")
    features = ['Nitrogen', 'Phosphorus', 'Potassium', 'Temperature', 'Humidity', 'pH', 'Rainfall']
    for feat, imp in zip(features, clf.feature_importances_):
        print(f"   - {feat:12s}: {imp:.3f}")

if __name__ == '__main__':
    run_ml_prototype()
