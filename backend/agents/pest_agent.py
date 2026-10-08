"""
Pest Intelligence Agent
Computer Vision AI simulation for Crop Pest & Foliar Disease Identification
Models: YOLOv8-ViT-Hybrid, ResNet50-Agri, CropNet-Mobile
Identifies: Brown Plant Hopper, Tomato Early Blight, Fall Armyworm, Tomato Leaf Curl Virus, Healthy
Transparently labels demo/simulated vs field inference.
"""

from typing import Dict, Any, List

class PestIntelligenceAgent:
    AVAILABLE_MODELS = [
        "YOLOv8-ViT-Hybrid (Recommended for Field Imagery)",
        "ResNet50-Agri (Leaf Surface Feature Classifier)",
        "CropNet-Mobile (Edge TensorRT Optimized)"
    ]

    SAMPLE_CONDITIONS = {
        "brown_plant_hopper": {
            "name": "Brown Plant Hopper (Nilaparvata lugens)",
            "category": "Pest",
            "is_healthy": False,
            "confidence": 94.2,
            "severity": "Medium",
            "risk_level": "High",
            "symptom_description": "Hopper burn symptoms, circular drying patches near plant base, honey-dew excretion.",
            "immediate_action": "Drain standing water immediately if applicable. Avoid excessive nitrogen application.",
            "recommended_control": "Spray Neem seed kernel extract (NSKE 5%) or Azadirachtin 10,000 ppm at 2 ml/litre. If critical threshold (>15 hoppers/hill) is crossed, consult local KVK officer for certified botanical or systemic spray."
        },
        "early_blight": {
            "name": "Tomato Early Blight (Alternaria solani)",
            "category": "Fungal Disease",
            "is_healthy": False,
            "confidence": 91.8,
            "severity": "Medium",
            "risk_level": "Medium",
            "symptom_description": "Concentric rings ('target board' spots) on lower leaves, surrounded by yellow chlorotic halo.",
            "immediate_action": "Prune infected lower foliage immediately and burn/bury away from the field.",
            "recommended_control": "Improve row ventilation. Apply copper oxychloride (2.5 g/L) or Trichoderma harzianum bio-agent. Ensure drip irrigation does not splash soil onto foliage."
        },
        "fall_armyworm": {
            "name": "Fall Armyworm (Spodoptera frugiperda)",
            "category": "Pest",
            "is_healthy": False,
            "confidence": 88.5,
            "severity": "High",
            "risk_level": "High",
            "symptom_description": "Skeletonized leaves, ragged feeding holes in whorls and fresh fruit punctures.",
            "immediate_action": "Inspect whorls and install 4-5 pheromone traps per acre for population monitoring.",
            "recommended_control": "Hand-pick egg masses in small plots. Apply Bacillus thuringiensis (Bt) kurstaki at 2 g/L or release egg parasitoids (Trichogramma pretiosum)."
        },
        "leaf_curl": {
            "name": "Tomato Leaf Curl Virus (ToLCV)",
            "category": "Viral Disease",
            "is_healthy": False,
            "confidence": 93.0,
            "severity": "High",
            "risk_level": "Critical",
            "symptom_description": "Upward curling and crinkling of leaf margins, severe stunting and chlorosis transmitted by whiteflies.",
            "immediate_action": "Rogue out and destroy infected viral host plants to prevent vector transmission.",
            "recommended_control": "Install yellow sticky traps (15-20 traps/acre) to control whitefly vector (Bemisia tabaci). Spray neem oil 3%."
        },
        "healthy": {
            "name": "Healthy Canopy (No Disease/Pest Detected)",
            "category": "Healthy",
            "is_healthy": True,
            "confidence": 97.4,
            "severity": "None",
            "risk_level": "Low",
            "symptom_description": "Deep green vigorous foliage with normal leaf expansion and clear venation.",
            "immediate_action": "Maintain scheduled nutrient and moisture monitoring.",
            "recommended_control": "Continue preventive bio-fungicide drenching every 14 days."
        }
    }

    def __init__(self, default_model: str = "YOLOv8-ViT-Hybrid (Recommended for Field Imagery)"):
        self.current_model = default_model

    def analyze(self, image_data: str = None, environmental_context: Dict[str, Any] = None, target_override: str = None) -> Dict[str, Any]:
        """
        Diagnose crop foliage. If target_override is provided (e.g. from UI demo selection), use that preset.
        Otherwise infer based on environmental humidity/temperature risk factors.
        """
        env = environmental_context or {}
        humidity = float(env.get("humidity", 68.0))
        temp = float(env.get("temperature", 31.0))
        pest_risk_env = env.get("pest_risk", "Low")

        # Select condition
        if target_override and target_override in self.SAMPLE_CONDITIONS:
            selected_key = target_override
        elif pest_risk_env == "High" or (humidity > 78 and temp > 28):
            selected_key = "brown_plant_hopper"
        elif humidity > 70:
            selected_key = "early_blight"
        else:
            selected_key = "healthy"

        condition = dict(self.SAMPLE_CONDITIONS[selected_key])

        # Transparently disclose prototype / simulation status
        is_simulation = True
        badge_text = "SIMULATION / PROTOCOL FALLBACK: Image scanned via simulated Edge AI engine (Model weights ready for fine-tuned weights deployment)."

        return {
            "agent": "Pest & Crop Health Intelligence Agent",
            "model_used": self.current_model,
            "is_simulation_mode": is_simulation,
            "transparency_notice": badge_text,
            "condition_key": selected_key,
            "detected_condition": condition["name"],
            "category": condition["category"],
            "is_healthy": condition["is_healthy"],
            "confidence_percentage": condition["confidence"],
            "severity": condition["severity"],
            "risk_level": condition["risk_level"],
            "symptoms": condition["symptom_description"],
            "immediate_action": condition["immediate_action"],
            "recommended_control": condition["recommended_control"],
            "environmental_correlation": f"Ambient Humidity {humidity}% and Canopy Temp {temp}°C align with disease incubation vectors."
        }
