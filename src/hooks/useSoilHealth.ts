import { useState, useCallback } from "react";
import { Activity, AlertCircle, TrendingUp } from "lucide-react";

export interface SoilTest {
  id: string;
  userId: string;
  date: string;
  location: string;
  
  // Macronutrients
  nitrogen: number; // kg/ha
  phosphorus: number; // kg/ha
  potassium: number; // kg/ha
  
  // Physical properties
  pH: number; // 0-14
  organicMatter: number; // percentage
  moisture: number; // percentage
  texture: "sandy" | "loamy" | "clay";
  
  // Score & recommendations
  healthScore: number; // 0-100
  recommendations: string[];
  suitableCrops: string[];
  
  // Test results
  testDate?: string;
  labName?: string;
  certifyingAuthority?: string;
}

interface UseSoilHealthOptions {
  language?: string;
}

interface UseSoilHealthReturn {
  currentTest: SoilTest | null;
  tests: SoilTest[];
  analyzeSoil: (test: SoilTest) => SoilTest;
  saveSoilTest: (test: SoilTest) => Promise<void>;
  getRecommendations: (test: SoilTest) => string[];
  getSoilGrade: (score: number) => string;
  isLoading: boolean;
  error: string | null;
}

// Standard soil quality thresholds for Indian soils
const SOIL_STANDARDS = {
  nitrogen: { low: 280, medium: 560, high: 840 }, // kg/ha
  phosphorus: { low: 20, medium: 40, high: 60 }, // kg/ha
  potassium: { low: 180, medium: 420, high: 560 }, // kg/ha
  pH: { min: 6.0, max: 7.5 }, // Optimal range for crop growth
  organicMatter: { low: 0.5, medium: 1.0, high: 2.0 }, // percentage
  humidity: { low: 15, optimal: 25, high: 35 }, // percentage
};

// Soil grade mapping
const GRADE_MAPPING = {
  excellent: { range: [80, 100], label: "Excellent", color: "#10b981" },
  good: { range: [60, 79], label: "Good", color: "#3b82f6" },
  fair: { range: [40, 59], label: "Fair", color: "#f59e0b" },
  poor: { range: [0, 39], label: "Poor", color: "#ef4444" },
};

/**
 * Calculate soil health score based on NPK and other parameters
 * Score: 0-100
 */
const calculateSoilScore = (test: SoilTest): number => {
  let score = 0;
  const weights = {
    npk: 0.4, // 40% weight to NPK
    pH: 0.2, // 20% to pH
    organicMatter: 0.2, // 20% to organic matter
    moisture: 0.2, // 20% to moisture
  };

  // NPK Score (0-40)
  const nScore = Math.min((test.nitrogen / SOIL_STANDARDS.nitrogen.high) * 10, 10);
  const pScore = Math.min((test.phosphorus / SOIL_STANDARDS.phosphorus.high) * 10, 10);
  const kScore = Math.min((test.potassium / SOIL_STANDARDS.potassium.high) * 10, 10);
  const npkScore = ((nScore + pScore + kScore) / 3) * weights.npk;

  // pH score (0-20)
  const pHDiff = Math.abs(test.pH - 6.8); // Optimal pH is ~6.8
  const pHScore = Math.max(0, 20 - pHDiff * 2) * weights.pH;

  // Organic Matter Score (0-20)
  const omScore = Math.min((test.organicMatter / SOIL_STANDARDS.organicMatter.high) * 20, 20) * weights.organicMatter;

  // Moisture Score (0-20)
  const moistureOptimal = SOIL_STANDARDS.humidity.optimal;
  const moistureDiff = Math.abs(test.moisture - moistureOptimal);
  const moistureScore = Math.max(0, 20 - moistureDiff) * weights.moisture;

  score = npkScore + pHScore + omScore + moistureScore;
  return Math.min(100, Math.max(0, Math.round(score)));
};

/**
 * Generate soil health recommendations based on test results
 */
const generateRecommendations = (test: SoilTest): string[] => {
  const recommendations: string[] = [];

  // Nitrogen recommendations
  if (test.nitrogen < SOIL_STANDARDS.nitrogen.low) {
    recommendations.push("🟡 Nitrogen is LOW. Apply 50-60 kg/ha of nitrogen fertilizer (Urea or DAP)");
  } else if (test.nitrogen > SOIL_STANDARDS.nitrogen.high) {
    recommendations.push("🟢 Nitrogen levels are OPTIMAL. Reduce nitrogen application");
  }

  // Phosphorus recommendations
  if (test.phosphorus < SOIL_STANDARDS.phosphorus.low) {
    recommendations.push("🟡 Phosphorus is LOW. Apply 20-25 kg/ha of phosphorus (DAP or SSP)");
  } else if (test.phosphorus > SOIL_STANDARDS.phosphorus.high) {
    recommendations.push("🟢 Phosphorus is at good levels. Current dosage is suitable");
  }

  // Potassium recommendations
  if (test.potassium < SOIL_STANDARDS.potassium.low) {
    recommendations.push("🟡 Potassium is LOW. Apply 20-25 kg/ha potassium (MOP or SOP)");
  } else if (test.potassium > SOIL_STANDARDS.potassium.high) {
    recommendations.push("🟢 Potassium levels are OPTIMAL. Maintain current practices");
  }

  // pH recommendations
  if (test.pH < SOIL_STANDARDS.pH.min) {
    recommendations.push("⚠️ Soil is ACIDIC (pH < 6). Apply lime at 2-3 tons/ha to increase pH");
  } else if (test.pH > SOIL_STANDARDS.pH.max) {
    recommendations.push("⚠️ Soil is ALKALINE (pH > 7.5). Apply sulfur or gypsum to reduce pH");
  } else {
    recommendations.push("✅ Soil pH is OPTIMAL for crop growth");
  }

  // Organic matter
  if (test.organicMatter < SOIL_STANDARDS.organicMatter.low) {
    recommendations.push("🌱 Organic matter is LOW. Add 5-10 tons/ha of compost or FYM annually");
  } else if (test.organicMatter > SOIL_STANDARDS.organicMatter.high) {
    recommendations.push("✅ Organic matter is GOOD. Maintain with annual mulching");
  }

  // Moisture
  if (test.moisture < SOIL_STANDARDS.humidity.low) {
    recommendations.push("💧 Soil is DRY. Increase irrigation frequency and mulching");
  } else if (test.moisture > SOIL_STANDARDS.humidity.high) {
    recommendations.push("⚠️ Soil moisture is HIGH. Check drainage and reduce irrigation");
  }

  // Texture recommendations
  if (test.texture === "sandy") {
    recommendations.push("🏜️ Sandy soil detected. Add organic matter to improve water retention");
  } else if (test.texture === "clay") {
    recommendations.push("🏔️ Clay soil detected. Add sand/gypsum to improve drainage and aeration");
  } else {
    recommendations.push("✅ Loamy soil is ideal for most crops");
  }

  return recommendations;
};

/**
 * Get suitable crops based on soil properties
 */
const getSuitableCrops = (test: SoilTest): string[] => {
  const crops: string[] = [];

  // pH-based crops
  if (test.pH >= 6.0 && test.pH <= 7.5) {
    crops.push("🌾 Wheat", "🌽 Maize", "🥔 Potato");
  }
  if (test.pH >= 6.5 && test.pH <= 7.5) {
    crops.push("🍅 Tomato", "🥒 Cucumber", "🧅 Onion");
  }
  if (test.pH >= 5.5 && test.pH <= 6.5) {
    crops.push("🍚 Rice", "🥬 Tea");
  }
  if (test.pH >= 7.0 && test.pH <= 8.0) {
    crops.push("🥜 Groundnut", "🌾 Sugarcane");
  }

  // Nitrogen-rich crops
  if (test.nitrogen > SOIL_STANDARDS.nitrogen.medium) {
    crops.push("🌽 Maize (high N demand)");
  }

  // Phosphorus-rich crops
  if (test.phosphorus > SOIL_STANDARDS.phosphorus.medium) {
    crops.push("🥔 Potato (high P demand)", "🌰 Pulse crops");
  }

  // Organic matter
  if (test.organicMatter > SOIL_STANDARDS.organicMatter.medium) {
    crops.push("🌱 Leafy vegetables", "🥦 Cabbage", "🥕 Carrot");
  }

  // Texture-based recommendations
  if (test.texture === "loamy") {
    crops.push("✅ Most crops suitable for loamy soil");
  } else if (test.texture === "sandy") {
    crops.push("🍈 Watermelon", "🍉 Melon", "🥕 Root vegetables");
  } else if (test.texture === "clay") {
    crops.push("🍚 Rice", "🌾 Wheat", "🌽 Maize");
  }

  return [...new Set(crops)]; // Remove duplicates
};

export const useSoilHealth = ({
  language = "en",
}: UseSoilHealthOptions = {}): UseSoilHealthReturn => {
  const [currentTest, setCurrentTest] = useState<SoilTest | null>(null);
  const [tests, setTests] = useState<SoilTest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Analyze soil test and generate comprehensive report
   */
  const analyzeSoil = useCallback((test: SoilTest): SoilTest => {
    const healthScore = calculateSoilScore(test);
    const recommendations = generateRecommendations(test);
    const suitableCrops = getSuitableCrops(test);

    const analyzedTest: SoilTest = {
      ...test,
      healthScore,
      recommendations,
      suitableCrops,
      date: test.date || new Date().toISOString(),
    };

    console.log("[SoilHealth] Analysis complete:", {
      score: healthScore,
      recommendations: recommendations.length,
      crops: suitableCrops.length,
    });

    return analyzedTest;
  }, []);

  /**
   * Save soil test to database
   */
  const saveSoilTest = useCallback(
    async (test: SoilTest) => {
      try {
        setIsLoading(true);
        setError(null);

        const analyzedTest = analyzeSoil(test);
        setCurrentTest(analyzedTest);
        setTests((prev) => [analyzedTest, ...prev]);

        console.log("✅ Soil test saved");
        // TODO: Save to Supabase
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to save soil test";
        setError(errorMsg);
        console.error("[SoilHealth] Error saving test:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [analyzeSoil]
  );

  /**
   * Get recommendations for a soil test
   */
  const getRecommendations = useCallback((test: SoilTest): string[] => {
    return generateRecommendations(test);
  }, []);

  /**
   * Get soil grade label and color
   */
  const getSoilGrade = useCallback((score: number): string => {
    for (const [key, value] of Object.entries(GRADE_MAPPING)) {
      if (score >= value.range[0] && score <= value.range[1]) {
        return value.label;
      }
    }
    return "Unknown";
  }, []);

  return {
    currentTest,
    tests,
    analyzeSoil,
    saveSoilTest,
    getRecommendations,
    getSoilGrade,
    isLoading,
    error,
  };
};

export default useSoilHealth;
