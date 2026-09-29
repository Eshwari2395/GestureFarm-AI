import { useState, useCallback, useEffect, useRef } from "react";
import { Language } from "@/lib/translations";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  rainChance: number;
  icon: string;
  cityName: string;
}

interface UseWeatherOptions {
  latitude: number | null;
  longitude: number | null;
  language: Language;
}

interface UseWeatherReturn {
  weather: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<WeatherData | null>;
  getFormattedResponse: (weatherOverride?: WeatherData | null) => string;
}

// Cache duration: 30 minutes
const CACHE_DURATION = 30 * 60 * 1000;

// Weather icon mapping
const weatherIcons: Record<string, string> = {
  "01d": "☀️",
  "01n": "🌙",
  "02d": "⛅",
  "02n": "☁️",
  "03d": "☁️",
  "03n": "☁️",
  "04d": "☁️",
  "04n": "☁️",
  "09d": "🌧️",
  "09n": "🌧️",
  "10d": "🌦️",
  "10n": "🌧️",
  "11d": "⛈️",
  "11n": "⛈️",
  "13d": "❄️",
  "13n": "❄️",
  "50d": "🌫️",
  "50n": "🌫️",
};

export const useWeather = ({
  latitude,
  longitude,
  language,
}: UseWeatherOptions): UseWeatherReturn => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const cacheRef = useRef<{ data: WeatherData; timestamp: number } | null>(null);

  const fetchWeather = useCallback(async () => {
    if (latitude === null || longitude === null) {
      return;
    }

    // Check cache
    if (cacheRef.current) {
      const now = Date.now();
      if (now - cacheRef.current.timestamp < CACHE_DURATION) {
        setWeather(cacheRef.current.data);
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/get-weather`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ latitude, longitude }),
        }
      );

      if (!response.ok) {
        throw new Error(`Weather request failed: ${response.status}`);
      }

      const data = await response.json();
      
      const weatherData: WeatherData = {
        temperature: Math.round(data.temperature),
        description: data.description,
        humidity: data.humidity,
        rainChance: data.rainChance || 0,
        icon: weatherIcons[data.icon] || "🌤️",
        cityName: data.cityName,
      };

      // Update cache
      cacheRef.current = {
        data: weatherData,
        timestamp: Date.now(),
      };

      setWeather(weatherData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch weather";
      setError(errorMessage);
      console.error("Weather error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [latitude, longitude]);

  // Fetch weather when location changes
  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      fetchWeather();
    }
  }, [latitude, longitude, fetchWeather]);

  const refresh = useCallback(async () => {
    // Clear cache to force refresh
    cacheRef.current = null;
    await fetchWeather();
    return cacheRef.current?.data ?? null;
  }, [fetchWeather]);

  const getFormattedResponse = useCallback((weatherOverride?: WeatherData | null): string => {
    const currentWeather = weatherOverride ?? weather;

    if (!currentWeather) {
      if (language === "hi") return "मौसम की जानकारी उपलब्ध नहीं है।";
      if (language === "te") return "వాతావరణ సమాచారం అందుబాటులో లేదు.";
      return "Weather information not available.";
    }

    const { icon, temperature, rainChance, cityName } = currentWeather;

    if (language === "hi") {
      return `${cityName} का मौसम: ${icon} तापमान ${temperature}°C। बारिश की संभावना ${rainChance}%।`;
    }
    
    if (language === "te") {
      return `${cityName} వాతావరణం: ${icon} ఉష్ణోగ్రత ${temperature}°C। వర్షం అవకాశం ${rainChance}%.`;
    }

    return `${cityName} Weather: ${icon} Temperature ${temperature}°C. ${rainChance}% chance of rain.`;
  }, [weather, language]);

  return {
    weather,
    isLoading,
    error,
    refresh,
    getFormattedResponse,
  };
};

export default useWeather;
