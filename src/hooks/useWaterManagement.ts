import { useState, useCallback } from "react";

export type CropType = 
  | "rice" 
  | "wheat" 
  | "maize" 
  | "potato" 
  | "sugarcane" 
  | "cotton" 
  | "groundnut";

export interface WeatherData {
  rainfall: number; // mm
  temperature: number; // °C
  humidity: number; // %
  evaporation: number; // mm (pan evaporation)
  windSpeed: number; // km/h
}

export interface IrrigationSchedule {
  id: string;
  cropType: CropType;
  sowingDate: string;
  
  // Water requirements
  totalWaterRequired: number; // mm
  evapoTranspiration: number; // mm/day
  
  // Irrigation events
  irrigations: IrrigationEvent[];
  
  // Savings & efficiency
  waterSavings: number; // % compared to conventional
  costPerHectare: number; // INR
  
  // Recommendations
  recommendations: string[];
}

export interface IrrigationEvent {
  daysAfterSowing: number;
  waterRequired: number; // mm
  method: "flood" | "sprinkler" | "drip";
  duration: number; // hours
  notes: string;
}

interface UseWaterManagementOptions {
  language?: string;
}

interface UseWaterManagementReturn {
  generateSchedule: (crop: CropType, sowingDate: string, weather: WeatherData) => IrrigationSchedule;
  getIrrigationAdvice: (crop: CropType, daysAfterSowing: number, weather: WeatherData) => string;
  calculateWaterSavings: (conventional: number, scheduled: number) => number;
  getOptimalIrrigationMethod: (crop: CropType, soilType: string) => string;
  isLoading: boolean;
  error: string | null;
}

// Crop water requirement (mm) for full season
const CROP_WATER_REQUIREMENTS: Record<CropType, number> = {
  rice: 1000,
  wheat: 400,
  maize: 500,
  potato: 300,
  sugarcane: 1500,
  cotton: 700,
  groundnut: 400,
};

// Growth stages of crops (days)
const CROP_GROWTH_STAGES: Record<CropType, { seedling: number; vegetative: number; flowering: number; fruiting: number }> = {
  rice: { seedling: 30, vegetative: 60, flowering: 25, fruiting: 30 },
  wheat: { seedling: 20, vegetative: 60, flowering: 20, fruiting: 30 },
  maize: { seedling: 20, vegetative: 50, flowering: 15, fruiting: 35 },
  potato: { seedling: 15, vegetative: 40, flowering: 25, fruiting: 25 },
  sugarcane: { seedling: 60, vegetative: 150, flowering: 90, fruiting: 0 },
  cotton: { seedling: 20, vegetative: 50, flowering: 60, fruiting: 50 },
  groundnut: { seedling: 15, vegetative: 35, flowering: 40, fruiting: 40 },
};

// Critical irrigation stages (days after sowing)
const CRITICAL_STAGES: Record<CropType, number[]> = {
  rice: [0, 20, 40, 60, 80], // Frequent irrigation
  wheat: [20, 40, 60], // Key stages
  maize: [20, 40, 60], // Vegetative to flowering
  potato: [20, 35, 50], // Tuber development
  sugarcane: [30, 60, 90, 120, 150], // Throughout season
  cotton: [30, 45, 60], // Flowering critical
  groundnut: [20, 35, 50], // Pod development
};

// Water requirement at each growth stage (% of total)
const STAGE_WATER_REQUIREMENT: Record<string, number> = {
  seedling: 0.1,
  vegetative: 0.35,
  flowering: 0.35,
  fruiting: 0.2,
};

/**
 * Calculate evapotranspiration (ET) using Penman-Monteith equation (simplified)
 * ET = Reference ET × Crop Coefficient
 */
const calculateET = (weather: WeatherData, cropCoefficient: number): number => {
  // Simplified ET calculation
  // ET0 = 0.0023 * (T + 17.8) * (RH)^0.5 * Rs
  const ET0 = 0.0023 * (weather.temperature + 17.8) * Math.sqrt(weather.humidity) * 2.5; // Approximate
  return ET0 * cropCoefficient;
};

/**
 * Get crop coefficient based on growth stage
 */
const getCropCoefficient = (stage: string): number => {
  const coefficients: Record<string, number> = {
    seedling: 0.4,
    vegetative: 0.8,
    flowering: 1.0,
    fruiting: 0.8,
  };
  return coefficients[stage] || 0.5;
};

export const useWaterManagement = ({
  language = "en",
}: UseWaterManagementOptions = {}): UseWaterManagementReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Generate irrigation schedule for a crop
   */
  const generateSchedule = useCallback(
    (crop: CropType, sowingDate: string, weather: WeatherData): IrrigationSchedule => {
      try {
        setIsLoading(true);
        const sowDate = new Date(sowingDate);
        const totalWaterRequired = CROP_WATER_REQUIREMENTS[crop];
        
        // Calculate ET
        const cropCoeff = getCropCoefficient("vegetative");
        const et = calculateET(weather, cropCoeff);
        
        // Generate irrigation events at critical stages
        const irrigations: IrrigationEvent[] = [];
        const criticalStages = CRITICAL_STAGES[crop];
        const stages = CROP_GROWTH_STAGES[crop];
        const totalDays = stages.seedling + stages.vegetative + stages.flowering + stages.fruiting;

        let accumulatedWater = 0;
        
        for (const dayAfterSowing of criticalStages) {
          if (dayAfterSowing > totalDays) break;

          // Water required for this irrigation
          const waterRequired = (totalWaterRequired / criticalStages.length) - weather.rainfall;
          
          if (waterRequired > 0) {
            // Determine growth stage
            let growthStage = "seedling";
            if (dayAfterSowing > stages.seedling + stages.vegetative + stages.flowering) {
              growthStage = "fruiting";
            } else if (dayAfterSowing > stages.seedling + stages.vegetative) {
              growthStage = "flowering";
            } else if (dayAfterSowing > stages.seedling) {
              growthStage = "vegetative";
            }

            // Choose irrigation method based on crop
            let method: "flood" | "sprinkler" | "drip" = "flood";
            if (crop === "potato" || crop === "maize" || crop === "groundnut") {
              method = "sprinkler";
            } else if (crop === "sugarcane" || crop === "cotton") {
              method = "drip";
            }

            irrigations.push({
              daysAfterSowing: dayAfterSowing,
              waterRequired: Math.max(0, waterRequired),
              method,
              duration: waterRequired > 0 ? Math.ceil(waterRequired / 5) : 0, // 5mm/hour rate
              notes: `${growthStage} stage - ${method} irrigation recommended`,
            });

            accumulatedWater += Math.max(0, waterRequired);
          }
        }

        // Calculate water savings
        const conventionalWater = totalWaterRequired + (weather.rainfall * criticalStages.length); // Traditional method uses more
        const scheduledWater = accumulatedWater + weather.rainfall * criticalStages.length;
        const waterSavings = ((conventionalWater - scheduledWater) / conventionalWater) * 100;

        // Cost calculation
        const costPerHectare = Math.round(accumulatedWater * 250); // ₹250 per mm per hectare

        // Recommendations
        const recommendations: string[] = [
          `💧 Total water requirement: ${Math.round(totalWaterRequired)}mm`,
          `☔ Expected rainfall: ${weather.rainfall}mm`,
          `⏱️ Number of irrigations: ${irrigations.length}`,
          `💰 Estimated cost: ₹${costPerHectare}/hectare`,
          `♻️ Water savings: ${Math.round(waterSavings)}% vs conventional method`,
        ];

        if (weather.evaporation > 8) {
          recommendations.push("⚠️ High evaporation detected. Increase irrigation frequency.");
        }

        if (weather.humidity < 40) {
          recommendations.push("⚠️ Low humidity. Increase irrigation to compensate.");
        }

        return {
          id: `schedule-${crop}-${Date.now()}`,
          cropType: crop,
          sowingDate,
          totalWaterRequired: accumulatedWater,
          evapoTranspiration: et,
          irrigations,
          waterSavings: Math.round(waterSavings),
          costPerHectare,
          recommendations,
        };
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Error generating schedule";
        setError(errorMsg);
        console.error("[WaterManagement] Error:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Get irrigation advice for a specific day
   */
  const getIrrigationAdvice = useCallback(
    (crop: CropType, daysAfterSowing: number, weather: WeatherData): string => {
      const criticalStages = CRITICAL_STAGES[crop];
      const isCriticalStage = criticalStages.includes(daysAfterSowing);

      // Calculate soil water deficit
      const etToday = calculateET(weather, getCropCoefficient("vegetative"));
      const deficit = etToday - (weather.rainfall / 10); // Simplified

      let advice = "";

      if (isCriticalStage) {
        advice = `⭐ CRITICAL STAGE: Apply irrigation immediately. Water required: ${Math.round(etToday + 5)}mm`;
      } else if (deficit > 0) {
        advice = `💧 Apply irrigation. Water deficit: ${Math.round(deficit)}mm`;
      } else {
        advice = `☔ Sufficient rainfall. Skip irrigation for today.`;
      }

      if (weather.evaporation > 8) {
        advice += " ⚠️ High evaporation - early morning irrigation recommended.";
      }

      return advice;
    },
    []
  );

  /**
   * Calculate water savings percentage
   */
  const calculateWaterSavings = useCallback(
    (conventional: number, scheduled: number): number => {
      return Math.round(((conventional - scheduled) / conventional) * 100);
    },
    []
  );

  /**
   * Get optimal irrigation method for crop and soil
   */
  const getOptimalIrrigationMethod = useCallback(
    (crop: CropType, soilType: string): string => {
      if (crop === "rice") {
        return "🌊 Flood irrigation (traditional ponding)";
      } else if (crop === "sugarcane" || crop === "cotton") {
        return "💧 Drip irrigation (50% water savings)";
      } else if (crop === "potato" || crop === "maize" || crop === "groundnut") {
        return "🌧️ Sprinkler irrigation (30% water savings)";
      } else {
        return "💧 Micro-irrigation system";
      }
    },
    []
  );

  return {
    generateSchedule,
    getIrrigationAdvice,
    calculateWaterSavings,
    getOptimalIrrigationMethod,
    isLoading,
    error,
  };
};

export default useWaterManagement;
