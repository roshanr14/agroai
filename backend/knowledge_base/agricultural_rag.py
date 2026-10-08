"""
Agricultural Knowledge Base & RAG Retrieval Engine
Curated trusted agricultural repositories from ICAR (Indian Council of Agricultural Research),
TNAU (Tamil Nadu Agricultural University Agritech Portal), and KVK (Krishi Vigyan Kendra).
Provides grounded semantic context to prevent LLM hallucinations.
"""

from typing import Dict, Any, List
import re

class AgriculturalKnowledgeRAG:
    KNOWLEDGE_DOCUMENTS = [
        {
            "id": "KB-SOIL-01",
            "topic": "Nitrogen Management & Leaf Chlorosis in Solanaceous Crops",
            "crop": "Tomato / Brinjal / Chilli",
            "source": "ICAR-Indian Institute of Vegetable Research (IIVR) Advisory #2024-N8",
            "keywords": ["nitrogen", "yellow", "yellowing", "chlorosis", "leaves", "fertilizer", "urea", "compost", "growth"],
            "fact": "Nitrogen is a mobile nutrient in plant tissue. Deficiency symptoms first appear on older lower leaves as general pale yellowing (chlorosis) while upper leaves remain pale green. Optimal available nitrogen for tomatoes in loamy soil is 40–65 mg/kg. When below 30 mg/kg, supplement with well-decomposed farmyard manure (FYM @ 10 t/ha) or neem-coated urea through split fertigation.",
            "tamil_fact": "தக்காளி பயிரில் தழைச்சத்து (நைட்ரஜன்) பற்றாக்குறை ஏற்படும் போது, கீழ் இலைகள் முதலில் மஞ்சள் நிறமாக மாறும். 1 ஏக்கருக்கு மண்புழு உரம் அல்லது வேப்பம்பிண்ணாக்கு கலந்த யூரியா உரமிடுவது சிறந்தது.",
            "hindi_fact": "टमाटर में नाइट्रोजन की कमी होने पर पुरानी निचली पत्तियां पीली पड़ने लगती हैं। 40-65 मिलीग्राम/किग्रा आदर्श स्तर है। इसके लिए सड़ी हुई गोबर की खाद या नीम लेपित यूरिया का प्रयोग करें।"
        },
        {
            "id": "KB-IRRIG-02",
            "topic": "Micro-Irrigation & Water Conservation during Monsoonal Forecasts",
            "crop": "All Field & Horticultural Crops",
            "source": "TNAU Agritech Portal - Water Management Technology Center",
            "keywords": ["water", "irrigate", "irrigation", "rain", "rainfall", "moisture", "drip", "wet"],
            "fact": "Tomato plants require 45–65% soil moisture for optimal vegetative root respiration. If rain probability exceeds 60% within 24 hours, postpone drip irrigation. Excessive irrigation before rainfall leads to rhizosphere waterlogging, anaerobic root asphyxiation, and damping-off fungal pathogen proliferation.",
            "tamil_fact": "மழை வாய்ப்பு 60% மேல் இருக்கும் போது பாசனத்தை தள்ளிப்போடவும். அதிக ஈரப்பதம் வேரழுகல் நோயை உண்டாக்கும்.",
            "hindi_fact": "यदि 24 घंटों में 60% से अधिक बारिश की संभावना हो तो सिंचाई टाल दें। अतिरिक्त पानी से जड़ों के सड़ने का खतरा होता है।"
        },
        {
            "id": "KB-PEST-03",
            "topic": "Brown Plant Hopper (BPH) & Leaf Blight Management",
            "crop": "Paddy / Tomato / Vegetables",
            "source": "Krishi Vigyan Kendra (KVK) Integrated Pest Management Bulletin",
            "keywords": ["pest", "hopper", "blight", "brown", "insects", "disease", "spots", "fungus", "neem"],
            "fact": "Brown plant hoppers congregate at the base of plants during humid overcast weather (>75% humidity). For early prevention, spray 5% Neem Seed Kernel Extract (NSKE) or Azadirachtin (10,000 ppm) at 2 ml/litre. Avoid excessive urea which promotes tender succulent shoots favored by pests. If pest density exceeds economic injury level, immediately contact the local Agricultural Extension Officer.",
            "tamil_fact": "அதிக ஈரப்பதத்தில் புகையான் மற்றும் இலைப்புள்ளி நோய் பரவும். 5% வேப்பங்கொட்டை சாறு அல்லது அசடிராக்டின் தெளிக்கவும். அதிக யூரியா இடுவதை தவிர்க்கவும்.",
            "hindi_fact": "अधिक नमी में भूरा फुदका (BPH) और झुलसा रोग तेजी से फैलता है। 5% नीम के बीज का काढ़ा छिड़कें। अत्यधिक नाइट्रोजन युक्त खाद से बचें।"
        },
        {
            "id": "KB-PH-04",
            "topic": "Soil pH & Micronutrient Bio-availability",
            "crop": "General Agriculture",
            "source": "ICAR Soil Health Card Technical Reference Manual",
            "keywords": ["ph", "acidic", "alkaline", "lime", "gypsum", "calcium"],
            "fact": "Soil pH between 6.0 and 7.2 provides maximum bio-availability of essential macro and micronutrients. A pH below 5.8 locks phosphorus into insoluble iron/aluminum compounds. Apply agricultural lime (calcium carbonate) at 500 kg/acre for acid soils, or gypsum for alkaline soils (pH > 7.8).",
            "tamil_fact": "மண்ணின் கார அமில நிலை (pH) 6.0 முதல் 7.0 வரை இருப்பது பயிர்களுக்கு உகந்தது. அமில மண் எனில் விவசாய சுண்ணாம்பு இட வேண்டும்.",
            "hindi_fact": "मिट्टी का पीएच 6.0 से 7.0 के बीच सर्वोत्तम माना जाता है। अम्लीय मिट्टी में चूना और क्षारीय मिट्टी में जिप्सम का प्रयोग करें।"
        },
        {
            "id": "KB-POTAS-05",
            "topic": "Potassium & Disease Resistance / Fruit Quality",
            "crop": "Tomato / Vegetables",
            "source": "TNAU Department of Soil Science & Agricultural Chemistry",
            "keywords": ["potassium", "potash", "fruit", "quality", "curling", "yield"],
            "fact": "Potassium regulates stomatal conductance and osmotic pressure, directly strengthening plant resistance against fungal spores and temperature extremes. When potassium drops below 30 mg/kg, fruit set and uniform fruit coloration are impaired. Apply MOP (Muriate of Potash) @ 25 kg/acre during flowering.",
            "tamil_fact": "பொட்டாஷ் சத்து பயிர்களுக்கு நோய் எதிர்ப்பு சக்தியையும் காய்களின் திரட்சியையும் தருகிறது. பூக்கும் தருணத்தில் பொட்டாஷ் உரம் இடுவது அவசியம்.",
            "hindi_fact": "पोटाश फसलों को रोग प्रतिरोधक क्षमता और फलों को चमक व वजन प्रदान करता है। फूल आने के समय पोटाश की पर्याप्त मात्रा सुनिश्चित करें।"
        }
    ]

    @classmethod
    def retrieve_context(cls, query: str, limit: int = 2) -> List[Dict[str, Any]]:
        """
        RAG lexical/keyword retriever that scores documents against the farmer's question.
        """
        query_words = set(re.findall(r'\b\w+\b', query.lower()))
        scored_docs = []

        for doc in cls.KNOWLEDGE_DOCUMENTS:
            score = 0
            # Match keywords
            for kw in doc["keywords"]:
                if kw in query_words or kw in query.lower():
                    score += 3
            # Match in text
            for w in query_words:
                if len(w) > 3 and w in doc["fact"].lower():
                    score += 1
            if score > 0:
                scored_docs.append((score, doc))

        scored_docs.sort(key=lambda x: x[0], reverse=True)
        if not scored_docs:
            return cls.KNOWLEDGE_DOCUMENTS[:limit]
        return [doc for score, doc in scored_docs[:limit]]
