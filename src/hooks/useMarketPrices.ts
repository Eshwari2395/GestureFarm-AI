import { useState, useCallback, useEffect } from "react";
import { Language } from "@/lib/translations";
import { 
  genericTelanganasPrices, 
  getGenericPricesSpeechText, 
  genericLocation,
  GenericCropPrice 
} from "@/lib/genericPrices";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export interface CropPrice {
  commodity: string;
  commodityHi: string;
  commodityTe: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  unit: string;
  priceDate: string;
  trend: "up" | "down" | "stable";
  trendPercent: number;
}

export interface MarketPricesResponse {
  success: boolean;
  location: {
    state: string;
    stateLocalized: string;
    district: string;
  };
  prices: CropPrice[];
  speechText: string;
  source: string;
  lastUpdated: string;
  error?: string;
}

interface UseMarketPricesOptions {
  latitude?: number | null;
  longitude?: number | null;
  language: Language;
}

interface UseMarketPricesReturn {
  prices: CropPrice[];
  location: MarketPricesResponse["location"] | null;
  speechText: string;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  getFormattedResponse: () => string;
  isUsingGenericPrices: boolean;
}

// Convert generic prices to CropPrice format
const convertToApiFormat = (genericPrices: GenericCropPrice[]): CropPrice[] => {
  return genericPrices.map(gp => ({
    ...gp,
    priceDate: new Date().toISOString().split('T')[0],
  }));
};

export const useMarketPrices = ({
  latitude,
  longitude,
  language,
}: UseMarketPricesOptions): UseMarketPricesReturn => {
  // Initialize with generic prices immediately for instant availability
  const [prices, setPrices] = useState<CropPrice[]>(convertToApiFormat(genericTelanganasPrices));
  const [location, setLocation] = useState<MarketPricesResponse["location"]>(genericLocation);
  const [speechText, setSpeechText] = useState(getGenericPricesSpeechText(language));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUsingGenericPrices, setIsUsingGenericPrices] = useState(true);

  // Update speech text when language changes
  useEffect(() => {
    if (isUsingGenericPrices) {
      setSpeechText(getGenericPricesSpeechText(language));
    }
  }, [language, isUsingGenericPrices]);

  const refresh = useCallback(async () => {
    // Use default coords if not available (Hyderabad, Telangana)
    const lat = latitude ?? 17.3850;
    const lon = longitude ?? 78.4867;

    setIsLoading(true);
    setError(null);

    try {
      // Try to fetch real prices, but with short timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/get-market-prices`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            latitude: lat,
            longitude: lon,
            language,
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data: MarketPricesResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch market prices");
      }

      // Use API data if successful
      setPrices(data.prices);
      setLocation(data.location);
      setSpeechText(data.speechText);
      setIsUsingGenericPrices(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch prices";
      console.warn("API price fetch failed, using generic prices:", errorMessage);
      
      // Fall back to generic prices (already set as default)
      setPrices(convertToApiFormat(genericTelanganasPrices));
      setLocation(genericLocation);
      setSpeechText(getGenericPricesSpeechText(language));
      setIsUsingGenericPrices(true);
      
      // Don't set error - we have fallback data
      // setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [latitude, longitude, language]);

  const getFormattedResponse = useCallback(() => {
    if (speechText) {
      return speechText;
    }

    if (prices.length === 0) {
      return language === "hi" 
        ? "मंडी भाव उपलब्ध नहीं है।"
        : language === "te"
        ? "మార్కెట్ ధరలు అందుబాటులో లేవు."
        : "Market prices not available.";
    }

    const topCrops = prices.slice(0, 4);
    const state = location?.stateLocalized || location?.state || "Telangana";
    const estLabel = isUsingGenericPrices ? " (Est.)" : "";

    if (language === "hi") {
      return `💰 ${state} मंडी भाव${estLabel}: ` + 
        topCrops.map(c => `${c.commodityHi} ₹${c.modalPrice}/क्विंटल`).join(", ");
    } else if (language === "te") {
      return `💰 ${state} మార్కెట్ ధరలు${estLabel}: ` + 
        topCrops.map(c => `${c.commodityTe} ₹${c.modalPrice}/క్వింటాల్`).join(", ");
    } else {
      return `💰 ${state} Market Prices${estLabel}: ` + 
        topCrops.map(c => `${c.commodity} ₹${c.modalPrice}/quintal`).join(", ");
    }
  }, [prices, location, speechText, language, isUsingGenericPrices]);

  return {
    prices,
    location,
    speechText,
    isLoading,
    error,
    refresh,
    getFormattedResponse,
    isUsingGenericPrices,
  };
};

export default useMarketPrices;
