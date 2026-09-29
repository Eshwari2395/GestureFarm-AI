import { useState, useCallback } from "react";

export type CropType = 
  | "rice" 
  | "wheat" 
  | "maize" 
  | "potato" 
  | "sugarcane" 
  | "cotton" 
  | "groundnut"
  | "tomato"
  | "onion"
  | "groundnut";

export type GrowthStage = "seedling" | "vegetative" | "flowering" | "fruiting" | "maturation";

export interface FertilizerRecommendation {
  id: string;
  cropType: CropType;
  growthStage: GrowthStage;
  
  // Nutrient requirements (kg/ha)
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  
  // Secondary nutrients
  sulfur?: number;
  magnesium?: number;
  calcium?: number;
  
  // Micronutrients
  zinc?: number;
  boron?: number;
  iron?: number;
  manganese?: number;
  
  // Application method
  applicationMethod: "basal" | "foliar" | "split" | "fertigation";
  timingDays: number; // Days after planting
  
  // Cost calculation
  estimatedCost: number; // INR per hectare
  yield?: number; // Expected yield increase %
  
  // Fertilizer product recommendations
  products: FertilizerProduct[];
  
  // Notes
  remarks: string;
}

export interface FertilizerProduct {
  name: string; // e.g., "Urea", "DAP", "MOP"
  concentration: number; // % nutrient concentration
  quantity: number; // kg needed
  costInr: number; // Price per kg
  supplier?: string;
}

interface UseFertilizerOptions {
  language?: string;
}

interface UseFertilizerReturn {
  getRecommendation: (crop: CropType, stage: GrowthStage, soilNPK: { n: number; p: number; k: number }) => FertilizerRecommendation;
  getCropSchedule: (crop: CropType) => FertilizerRecommendation[];
  calculateCost: (recommendation: FertilizerRecommendation) => number;
  getAlternativeProducts: (nutrient: string, quantity: number) => FertilizerProduct[];
  isLoading: boolean;
  error: string | null;
}

// Crop-specific fertilizer requirements (kg/ha)
const CROP_REQUIREMENTS: Record<CropType, Record<GrowthStage, { n: number; p: number; k: number }>> = {
  rice: {
    seedling: { n: 0, p: 0, k: 0 },
    vegetative: { n: 80, p: 40, k: 40 },
    flowering: { n: 50, p: 20, k: 20 },
    fruiting: { n: 30, p: 20, k: 30 },
    maturation: { n: 0, p: 0, k: 0 },
  },
  wheat: {
    seedling: { n: 20, p: 60, k: 0 },
    vegetative: { n: 60, p: 0, k: 0 },
    flowering: { n: 40, p: 20, k: 40 },
    fruiting: { n: 20, p: 0, k: 0 },
    maturation: { n: 0, p: 0, k: 0 },
  },
  maize: {
    seedling: { n: 20, p: 80, k: 20 },
    vegetative: { n: 100, p: 0, k: 0 },
    flowering: { n: 60, p: 40, k: 40 },
    fruiting: { n: 30, p: 20, k: 60 },
    maturation: { n: 0, p: 0, k: 0 },
  },
  potato: {
    seedling: { n: 30, p: 100, k: 30 },
    vegetative: { n: 80, p: 0, k: 80 },
    flowering: { n: 50, p: 30, k: 100 },
    fruiting: { n: 30, p: 20, k: 120 },
    maturation: { n: 0, p: 0, k: 0 },
  },
  sugarcane: {
    seedling: { n: 60, p: 60, k: 40 },
    vegetative: { n: 100, p: 30, k: 60 },
    flowering: { n: 60, p: 40, k: 80 },
    fruiting: { n: 40, p: 30, k: 100 },
    maturation: { n: 0, p: 0, k: 0 },
  },
  cotton: {
    seedling: { n: 30, p: 60, k: 20 },
    vegetative: { n: 80, p: 40, k: 40 },
    flowering: { n: 60, p: 60, k: 60 },
    fruiting: { n: 40, p: 40, k: 80 },
    maturation: { n: 0, p: 0, k: 0 },
  },
  groundnut: {
    seedling: { n: 20, p: 60, k: 20 },
    vegetative: { n: 40, p: 0, k: 20 },
    flowering: { n: 30, p: 60, k: 60 },
    fruiting: { n: 20, p: 40, k: 80 },
    maturation: { n: 0, p: 0, k: 0 },
  },
  tomato: {
    seedling: { n: 20, p: 80, k: 20 },
    vegetative: { n: 100, p: 0, k: 40 },
    flowering: { n: 60, p: 40, k: 60 },
    fruiting: { n: 40, p: 40, k: 80 },
    maturation: { n: 0, p: 0, k: 0 },
  },
  onion: {
    seedling: { n: 30, p: 60, k: 30 },
    vegetative: { n: 120, p: 30, k: 60 },
    flowering: { n: 60, p: 40, k: 40 },
    fruiting: { n: 40, p: 20, k: 60 },
    maturation: { n: 0, p: 0, k: 0 },
  },
};

// Standard fertilizer products in India (with prices)
const FERTILIZER_PRODUCTS: Record<string, FertilizerProduct[]> = {
  nitrogen: [
    { name: "Urea (46%)", concentration: 46, quantity: 0, costInr: 5.5, supplier: "Government/Private" },
    { name: "DAP (18-46-0)", concentration: 18, quantity: 0, costInr: 25, supplier: "Multi-nutrient" },
    { name: "Ammonium Nitrate (34%)", concentration: 34, quantity: 0, costInr: 15, supplier: "Specialty" },
  ],
  phosphorus: [
    { name: "DAP (18-46-0)", concentration: 46, quantity: 0, costInr: 25, supplier: "Balanced" },
    { name: "SSP (16%)", concentration: 16, quantity: 0, costInr: 8, supplier: "Budget" },
    { name: "Ammonium Phosphate", concentration: 48, quantity: 0, costInr: 30, supplier: "Premium" },
  ],
  potassium: [
    { name: "MOP (60%)", concentration: 60, quantity: 0, costInr: 12, supplier: "Standard" },
    { name: "SOP (50%)", concentration: 50, quantity: 0, costInr: 18, supplier: "Premium" },
    { name: "Potassium Nitrate", concentration: 44, quantity: 0, costInr: 35, supplier: "Premium" },
  ],
};

// Timing (Days after planting)
const TIMING_MAP: Record<GrowthStage, number> = {
  seedling: 0,
  vegetative: 15,
  flowering: 45,
  fruiting: 65,
  maturation: 85,
};

export const useFertilizerRecommendation = ({
  language = "en",
}: UseFertilizerOptions = {}): UseFertilizerReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Get fertilizer recommendation based on crop, stage, and soil NPK
   */
  const getRecommendation = useCallback(
    (crop: CropType, stage: GrowthStage, soilNPK: { n: number; p: number; k: number }): FertilizerRecommendation => {
      try {
        const cropReq = CROP_REQUIREMENTS[crop][stage];
        
        // Calculate nutrient deficit
        const nDeficit = Math.max(0, cropReq.n - soilNPK.n);
        const pDeficit = Math.max(0, cropReq.p - soilNPK.p);
        const kDeficit = Math.max(0, cropReq.k - soilNPK.k);

        // Recommend products
        const products: FertilizerProduct[] = [];
        
        // Use DAP for combined N+P
        if (nDeficit > 0 && pDeficit > 0) {
          const dapNeeded = Math.max(nDeficit / 0.18, pDeficit / 0.46);
          products.push({
            name: "DAP (18-46-0)",
            concentration: 23,
            quantity: Math.round(dapNeeded),
            costInr: 25,
          });
        } else {
          // Use individual nutrients
          if (nDeficit > 0) {
            products.push({
              name: "Urea (46%)",
              concentration: 46,
              quantity: Math.round(nDeficit / 0.46),
              costInr: 5.5,
            });
          }
          if (pDeficit > 0) {
            products.push({
              name: "SSP (16%)",
              concentration: 16,
              quantity: Math.round(pDeficit / 0.16),
              costInr: 8,
            });
          }
        }

        if (kDeficit > 0) {
          products.push({
            name: "MOP (60%)",
            concentration: 60,
            quantity: Math.round(kDeficit / 0.6),
            costInr: 12,
          });
        }

        // Calculate cost
        const estimatedCost = products.reduce((total, product) => {
          return total + product.quantity * product.costInr;
        }, 0);

        return {
          id: `${crop}-${stage}-${Date.now()}`,
          cropType: crop,
          growthStage: stage,
          nitrogen: nDeficit,
          phosphorus: pDeficit,
          potassium: kDeficit,
          applicationMethod: stage === "seedling" ? "basal" : "split",
          timingDays: TIMING_MAP[stage],
          estimatedCost,
          products,
          yield: Math.min(25, nDeficit / 10), // Estimated yield increase
          remarks: `Apply ${stage} nutrients for ${crop}. Current soil levels: N=${soilNPK.n}, P=${soilNPK.p}, K=${soilNPK.k}`,
        };
      } catch (err) {
        console.error("[Fertilizer] Error getting recommendation:", err);
        throw err;
      }
    },
    []
  );

  /**
   * Get complete fertilizer schedule for a crop (all stages)
   */
  const getCropSchedule = useCallback((crop: CropType): FertilizerRecommendation[] => {
    const schedule: FertilizerRecommendation[] = [];
    const baselineSoilNPK = { n: 280, p: 20, k: 180 }; // Average Indian soil

    for (const stage of Object.keys(CROP_REQUIREMENTS[crop]) as GrowthStage[]) {
      const recommendation = getRecommendation(crop, stage, baselineSoilNPK);
      if (recommendation.nitrogen > 0 || recommendation.phosphorus > 0 || recommendation.potassium > 0) {
        schedule.push(recommendation);
      }
    }

    return schedule;
  }, [getRecommendation]);

  /**
   * Calculate total cost of recommendation
   */
  const calculateCost = useCallback((recommendation: FertilizerRecommendation): number => {
    return recommendation.products.reduce((total, product) => {
      return total + product.quantity * product.costInr;
    }, 0);
  }, []);

  /**
   * Get alternative fertilizer products for a specific nutrient
   */
  const getAlternativeProducts = useCallback(
    (nutrient: string, quantity: number): FertilizerProduct[] => {
      const alternatives = FERTILIZER_PRODUCTS[nutrient.toLowerCase()] || [];
      return alternatives.map((product) => ({
        ...product,
        quantity,
      }));
    },
    []
  );

  return {
    getRecommendation,
    getCropSchedule,
    calculateCost,
    getAlternativeProducts,
    isLoading,
    error,
  };
};

export default useFertilizerRecommendation;
