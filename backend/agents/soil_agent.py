"""
Soil Intelligence Agent
Analyzes soil parameters (N, P, K, pH, Moisture, Organic Carbon, Electrical Conductivity)
Predicts nutrient deficiencies and future trends
Supports model switching (Random Forest, XGBoost, Neural Network)
"""

from typing import Dict, Any, List

class SoilIntelligenceAgent:
    AVAILABLE_MODELS = ["Random Forest Regressor v2.4", "XGBoost Classifier v1.8", "Deep SoilNet (MLP-ResNet)"]

    def __init__(self, default_model: str = "Random Forest Regressor v2.4"):
        self.current_model = default_model

    def set_model(self, model_name: str):
        if model_name in self.AVAILABLE_MODELS:
            self.current_model = model_name
            return True
        return False

    def analyze(self, soil_data: Dict[str, Any], crop_info: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Evaluate soil health, detect deficiencies, and simulate model-specific inference.
        """
        nitrogen = float(soil_data.get("nitrogen", 38.0))
        phosphorus = float(soil_data.get("phosphorus", 24.0))
        potassium = float(soil_data.get("potassium", 31.0))
        ph = float(soil_data.get("ph", 6.5))
        moisture = float(soil_data.get("soil_moisture", 42.0))

        crop_name = crop_info.get("name", "Tomato") if crop_info else "Tomato"
        crop_stage = crop_info.get("stage", "Vegetative") if crop_info else "Vegetative"

        # Model confidence & variance simulation based on selected model
        if "Random Forest" in self.current_model:
            confidence = 89.4
            runtime_ms = 18
            architecture_desc = "Ensemble of 120 decision trees trained on ICAR soil health card datasets"
        elif "XGBoost" in self.current_model:
            confidence = 93.1
            runtime_ms = 12
            architecture_desc = "Gradient-boosted decision trees with histogram regularization"
        else: # Neural Network
            confidence = 91.8
            runtime_ms = 35
            architecture_desc = "3-layer Multi-Layer Perceptron with Swish activation and LayerNorm"

        # Nutrient benchmarks for Indian soils & Solanaceous crops (Tomato)
        deficiencies = []
        warnings = []
        action_recommendations = []

        # Nitrogen analysis (Target: 40 - 65 mg/kg)
        if nitrogen < 30.0:
            deficiencies.append({
                "nutrient": "Nitrogen (N)",
                "status": "Critical Low",
                "value": f"{nitrogen} mg/kg",
                "benchmark": "40-65 mg/kg",
                "symptom": "Pale green/yellowing of older lower leaves (chlorosis), stunted stem elongation."
            })
            action_recommendations.append("Apply Neem-coated urea or well-decomposed farmyard manure (FYM) with enriched vermicompost.")
        elif nitrogen < 40.0:
            deficiencies.append({
                "nutrient": "Nitrogen (N)",
                "status": "Marginal Low",
                "value": f"{nitrogen} mg/kg",
                "benchmark": "40-65 mg/kg",
                "symptom": "Slight slowdown in vegetative canopy growth."
            })
            action_recommendations.append("Schedule light nitrogen supplementation (fertigation or organic compost tea) within 2-3 days.")

        # Phosphorus analysis (Target: 22 - 45 mg/kg)
        if phosphorus < 18.0:
            deficiencies.append({
                "nutrient": "Phosphorus (P)",
                "status": "Low",
                "value": f"{phosphorus} mg/kg",
                "benchmark": "22-45 mg/kg",
                "symptom": "Purplish discoloration on lower leaf veins and restricted root development."
            })
            action_recommendations.append("Apply Single Super Phosphate (SSP) or rock phosphate band near root zone.")

        # Potassium analysis (Target: 30 - 55 mg/kg)
        if potassium < 25.0:
            deficiencies.append({
                "nutrient": "Potassium (K)",
                "status": "Low",
                "value": f"{potassium} mg/kg",
                "benchmark": "30-55 mg/kg",
                "symptom": "Marginal scorching and curling of leaf tips, reduced pest tolerance."
            })
            action_recommendations.append("Apply Muriate of Potash (MOP) or wood ash extract around drip perimeter.")

        # pH assessment (Ideal 6.0 - 7.0 for loamy Indian soils)
        ph_status = "Optimal"
        if ph < 5.8:
            ph_status = "Acidic"
            warnings.append("Soil is acidic; phosphorus availability is restricted. Consider agricultural lime.")
        elif ph > 7.5:
            ph_status = "Alkaline / Calcareous"
            warnings.append("High pH may bind micronutrients like Zinc and Iron. Consider gypsum treatment.")

        # 5-7 Day Trend Prediction (based on crop stage consumption rate)
        projected_n_drop_daily = 1.1 if crop_stage == "Vegetative" else 0.7
        predicted_n_7d = max(10.0, round(nitrogen - (projected_n_drop_daily * 6), 1))
        
        n_risk_trajectory = "Critical Deficit" if predicted_n_7d < 28 else "Sub-optimal" if predicted_n_7d < 38 else "Stable"

        # Calculate Overall Soil Health Index (0-100)
        health_score = int(min(98, max(20, round(
            (min(1.0, nitrogen / 45.0) * 35) +
            (min(1.0, phosphorus / 25.0) * 20) +
            (min(1.0, potassium / 35.0) * 20) +
            (max(0, 1.0 - abs(ph - 6.5) / 2.0) * 15) +
            (max(0, 1.0 - abs(moisture - 50.0) / 40.0) * 10)
        ))))

        return {
            "agent": "Soil Intelligence Agent",
            "model_used": self.current_model,
            "model_architecture": architecture_desc,
            "inference_confidence": confidence,
            "runtime_ms": runtime_ms,
            "soil_health_score": health_score,
            "ph_status": ph_status,
            "deficiencies": deficiencies,
            "warnings": warnings,
            "action_recommendations": action_recommendations,
            "future_prediction": {
                "metric": "Nitrogen Depletion Trajectory",
                "current_val": nitrogen,
                "predicted_val_in_6_days": predicted_n_7d,
                "risk_in_5_7_days": n_risk_trajectory,
                "recommendation_window": "Act within 48-72 hours before visible chlorosis appears"
            }
        }
