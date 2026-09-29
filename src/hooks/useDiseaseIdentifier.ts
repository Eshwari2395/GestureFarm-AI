import { useState, useCallback } from "react";

export interface DiseaseDetectionResult {
  id: string;
  imagePath?: string;
  cropType: string;
  
  // Disease info
  diseaseName: string;
  scientificName: string;
  confidence: number; // 0-100
  severity: "mild" | "moderate" | "severe";
  
  // Treatment info
  treatments: Treatment[];
  preventionMeasures: string[];
  
  // Spread risk
  spreadRisk: string;
  affectedArea?: string;
  
  // Urgency
  urgency: "low" | "medium" | "high" | "critical";
  
  // Recommendation
  recommendations: string[];
  nearestLab?: string;
  
  dateDetected: string;
}

export interface Treatment {
  name: string;
  type: "fungicide" | "insecticide" | "bactericide" | "cultural";
  dosage: string;
  frequency: string; // e.g., "Every 7 days" or "Single application"
  duration: string; // How long to apply
  costInr: number;
  availability: string;
}

export interface DiseaseDatabase {
  name: string;
  scientificName: string;
  crops: string[];
  symptoms: string[];
  cause: "fungal" | "bacterial" | "viral" | "insect" | "nutrient";
  spreadMethod: string;
  severity: "low" | "medium" | "high";
  treatments: Treatment[];
  prevention: string[];
}

interface UseDiseaseIdentifierOptions {
  language?: string;
}

interface UseDiseaseIdentifierReturn {
  detectDisease: (imageBase64: string, cropType: string) => Promise<DiseaseDetectionResult>;
  getDiseaseInfo: (diseaseName: string) => DiseaseDatabase | null;
  getTreatments: (diseaseName: string) => Treatment[];
  isLoading: boolean;
  error: string | null;
  confidence: number;
}

// Comprehensive disease database for Indian crops
const DISEASE_DATABASE: Record<string, DiseaseDatabase> = {
  // Rice diseases
  "rice_blast": {
    name: "Rice Blast",
    scientificName: "Pyricularia oryzae",
    crops: ["rice"],
    symptoms: ["Grey-green lesions on leaves", "Spindle-shaped lesions", "Lesions on panicles", "Grain discoloration"],
    cause: "fungal",
    spreadMethod: "Airborne spores, water splash",
    severity: "high",
    treatments: [
      {
        name: "Tricyclazole",
        type: "fungicide",
        dosage: "1 g/L",
        frequency: "Every 10 days",
        duration: "2-3 applications",
        costInr: 450,
        availability: "Widely available",
      },
      {
        name: "Azoxystrobin",
        type: "fungicide",
        dosage: "1.6 ml/L",
        frequency: "Every 15 days",
        duration: "2 applications",
        costInr: 550,
        availability: "Available at agro shops",
      },
    ],
    prevention: [
      "Use blast-resistant varieties",
      "Maintain proper spacing",
      "Avoid excess nitrogen",
      "Remove infected plant parts",
      "Ensure proper drainage",
    ],
  },

  "rice_sheath_blight": {
    name: "Rice Sheath Blight",
    scientificName: "Rhizoctonia solani",
    crops: ["rice"],
    symptoms: ["Grey-green water-soaked lesions on leaf sheath", "Brown band moving upward", "White mycelium visible"],
    cause: "fungal",
    spreadMethod: "Soil-borne, water",
    severity: "high",
    treatments: [
      {
        name: "Trichoderma",
        type: "cultural",
        dosage: "10^8 spores/ml",
        frequency: "One time",
        duration: "Apply at transplanting",
        costInr: 200,
        availability: "Bio-agent available",
      },
      {
        name: "Carbendazim",
        type: "fungicide",
        dosage: "1 g/L",
        frequency: "Every 10 days",
        duration: "2 sprays",
        costInr: 280,
        availability: "Widely available",
      },
    ],
    prevention: [
      "Reduce plant density",
      "Improve drainage",
      "Use disease-free nursery",
      "Soil solarization",
      "Crop rotation",
    ],
  },

  // Wheat diseases
  "wheat_rust": {
    name: "Wheat Rust (Leaf & Stem)",
    scientificName: "Puccinia species",
    crops: ["wheat"],
    symptoms: ["Orange/brown pustules on leaves", "Reddish-brown lesions", "Necrotic patches"],
    cause: "fungal",
    spreadMethod: "Airborne spores",
    severity: "high",
    treatments: [
      {
        name: "Propiconazole",
        type: "fungicide",
        dosage: "0.5 g/L",
        frequency: "Every 10 days",
        duration: "2-3 sprays",
        costInr: 350,
        availability: "Widely available",
      },
      {
        name: "Hexaconazole",
        type: "fungicide",
        dosage: "0.5 g/L",
        frequency: "Once when symptoms appear",
        duration: "Single spray",
        costInr: 320,
        availability: "Available",
      },
    ],
    prevention: [
      "Grow resistant varieties",
      "Timely sowing",
      "Avoid overcrowding",
      "Remove volunteer plants",
      "Monitor regularly",
    ],
  },

  // Potato diseases
  "potato_late_blight": {
    name: "Potato Late Blight",
    scientificName: "Phytophthora infestans",
    crops: ["potato"],
    symptoms: ["Water-soaked lesions on leaves", "Yellow halo around lesions", "White mycelium on leaf underside", "Rotting tubers"],
    cause: "fungal",
    spreadMethod: "Water, wind",
    severity: "high",
    treatments: [
      {
        name: "Mancozeb",
        type: "fungicide",
        dosage: "2.5 g/L",
        frequency: "Every 7 days",
        duration: "4-5 sprays during season",
        costInr: 200,
        availability: "Widely available",
      },
      {
        name: "Metalaxyl + Mancozeb",
        type: "fungicide",
        dosage: "2 g/L",
        frequency: "Every 10 days",
        duration: "2-3 sprays",
        costInr: 400,
        availability: "Available",
      },
    ],
    prevention: [
      "Plant disease-free seed potatoes",
      "Weekly fungicide sprays during monsoon",
      "Improve drainage",
      "Remove infected leaves",
      "Use resistant varieties",
    ],
  },

  // Maize diseases
  "maize_leaf_spot": {
    name: "Maize Leaf Spot (Turcicum)",
    scientificName: "Exserohilum turcicum",
    crops: ["maize"],
    symptoms: ["Oval lesions on leaves", "Tan-colored with dark margins", "Lesions coalesce in severe cases"],
    cause: "fungal",
    spreadMethod: "Airborne spores",
    severity: "medium",
    treatments: [
      {
        name: "Propineb",
        type: "fungicide",
        dosage: "2.5 g/L",
        frequency: "Every 15 days",
        duration: "2 sprays",
        costInr: 250,
        availability: "Available",
      },
      {
        name: "Sulfur",
        type: "fungicide",
        dosage: "3 g/L (wettable sulfur)",
        frequency: "Every 10 days",
        duration: "2-3 sprays",
        costInr: 100,
        availability: "Widely available",
      },
    ],
    prevention: [
      "Grow resistant hybrids",
      "Field sanitation",
      "Crop rotation (2-3 years)",
      "Remove infected leaves",
      "Avoid overhead irrigation",
    ],
  },

  // Tomato diseases
  "tomato_early_blight": {
    name: "Tomato Early Blight",
    scientificName: "Alternaria solani",
    crops: ["tomato"],
    symptoms: ["Concentric rings on lower leaves", "Yellow halo", "Leaf yellowing and dropping"],
    cause: "fungal",
    spreadMethod: "Spores, water splash",
    severity: "medium",
    treatments: [
      {
        name: "Mancozeb",
        type: "fungicide",
        dosage: "2.5 g/L",
        frequency: "Every 10 days",
        duration: "3-4 sprays",
        costInr: 200,
        availability: "Widely available",
      },
      {
        name: "Chlorothalonil",
        type: "fungicide",
        dosage: "2.5 g/L",
        frequency: "Every 15 days",
        duration: "2-3 sprays",
        costInr: 300,
        availability: "Available",
      },
    ],
    prevention: [
      "Remove lower infected leaves",
      "Improve air circulation",
      "Use drip irrigation",
      "Mulching",
      "Stake plants for air flow",
    ],
  },

  // Cotton diseases
  "cotton_leaf_curl": {
    name: "Cotton Leaf Curl Virus",
    scientificName: "Cotton Leaf Curl Virus (CLCuV)",
    crops: ["cotton"],
    symptoms: ["Upward curling of leaves", "Vein thickening", "Stunted growth", "Mosaic patterns"],
    cause: "viral",
    spreadMethod: "Whitefly vector",
    severity: "high",
    treatments: [
      {
        name: "Imidacloprid",
        type: "insecticide",
        dosage: "0.3 ml/L",
        frequency: "Every 10 days",
        duration: "3-4 sprays",
        costInr: 400,
        availability: "Widely available",
      },
      {
        name: "Neem oil",
        type: "cultural",
        dosage: "5%",
        frequency: "Every 7 days",
        duration: "Repeating sprays",
        costInr: 150,
        availability: "Available",
      },
    ],
    prevention: [
      "Use virus-resistant varieties",
      "Control whitefly population",
      "Remove infected plants",
      "Avoid susceptible crops nearby",
      "Yellow sticky traps",
    ],
  },
};

/**
 * Mock AI disease detection using pattern matching
 * In production, use TensorFlow.js or cloud vision APIs
 */
const mockAIDetection = (cropType: string): string[] => {
  // Simulate AI model returning top disease predictions
  const cropDiseases: Record<string, string[]> = {
    rice: ["rice_blast", "rice_sheath_blight"],
    wheat: ["wheat_rust"],
    potato: ["potato_late_blight"],
    maize: ["maize_leaf_spot"],
    tomato: ["tomato_early_blight"],
    cotton: ["cotton_leaf_curl"],
  };

  return cropDiseases[cropType] || [];
};

export const useDiseaseIdentifier = ({
  language = "en",
}: UseDiseaseIdentifierOptions = {}): UseDiseaseIdentifierReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);

  /**
   * Detect disease from image using AI model
   * In production, integrate TensorFlow.js or Google Cloud Vision
   */
  const detectDisease = useCallback(
    async (imageBase64: string, cropType: string): Promise<DiseaseDetectionResult> => {
      try {
        setIsLoading(true);
        setError(null);

        // Simulate AI processing
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Mock detection - in production use actual ML model
        const predictions = mockAIDetection(cropType);
        const detectedDiseaseKey = predictions[0] || "rice_blast";
        const diseaseInfo = DISEASE_DATABASE[detectedDiseaseKey];

        const mockConfidence = Math.floor(Math.random() * (95 - 70) + 70); // 70-95%
        setConfidence(mockConfidence);

        if (!diseaseInfo) {
          throw new Error("Disease not found in database");
        }

        const severity: "mild" | "moderate" | "severe" = 
          mockConfidence > 85 ? "severe" : mockConfidence > 70 ? "moderate" : "mild";

        const urgency: "low" | "medium" | "high" | "critical" =
          diseaseInfo.severity === "high" 
            ? mockConfidence > 80 ? "critical" : "high"
            : mockConfidence > 75 ? "medium" : "low";

        return {
          id: `detection-${Date.now()}`,
          cropType,
          diseaseName: diseaseInfo.name,
          scientificName: diseaseInfo.scientificName,
          confidence: mockConfidence,
          severity,
          treatments: diseaseInfo.treatments,
          preventionMeasures: diseaseInfo.prevention,
          spreadRisk: `Spread by ${diseaseInfo.spreadMethod}`,
          urgency,
          recommendations: [
            `🔬 Disease confidence: ${mockConfidence}% (${severity})`,
            `⚠️ Urgency Level: ${urgency.toUpperCase()}`,
            `💊 Recommended treatment: ${diseaseInfo.treatments[0]?.name}`,
            `🛡️ Primary prevention: ${diseaseInfo.prevention[0]}`,
            `📍 Contact local agricultural extension for field confirmation`,
          ],
          dateDetected: new Date().toISOString(),
        };
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Disease detection failed";
        setError(errorMsg);
        console.error("[DiseaseIdentifier] Error:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Get disease information from database
   */
  const getDiseaseInfo = useCallback((diseaseName: string): DiseaseDatabase | null => {
    return DISEASE_DATABASE[diseaseName.toLowerCase()] || null;
  }, []);

  /**
   * Get treatment recommendations for a disease
   */
  const getTreatments = useCallback((diseaseName: string): Treatment[] => {
    const disease = DISEASE_DATABASE[diseaseName.toLowerCase()];
    return disease?.treatments || [];
  }, []);

  return {
    detectDisease,
    getDiseaseInfo,
    getTreatments,
    isLoading,
    error,
    confidence,
  };
};

export default useDiseaseIdentifier;
