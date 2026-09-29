import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENWEATHERMAP_API_KEY = Deno.env.get("OPENWEATHERMAP_API_KEY");
    
    if (!OPENWEATHERMAP_API_KEY) {
      throw new Error("OPENWEATHERMAP_API_KEY is not configured");
    }

    const { latitude, longitude } = await req.json();

    if (latitude === undefined || longitude === undefined) {
      throw new Error("Latitude and longitude are required");
    }

    // Fetch current weather
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${OPENWEATHERMAP_API_KEY}`;
    
    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      const errorText = await weatherResponse.text();
      console.error("OpenWeatherMap API error:", errorText);
      throw new Error(`Weather API failed: ${weatherResponse.status}`);
    }

    const weatherData = await weatherResponse.json();

    // Fetch forecast for rain probability
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&cnt=4&appid=${OPENWEATHERMAP_API_KEY}`;
    
    let rainChance = 0;
    
    try {
      const forecastResponse = await fetch(forecastUrl);
      if (forecastResponse.ok) {
        const forecastData = await forecastResponse.json();
        // Get average rain probability from next few hours
        const rainProbabilities = forecastData.list
          .map((item: { pop?: number }) => (item.pop || 0) * 100)
          .slice(0, 4);
        rainChance = Math.round(
          rainProbabilities.reduce((a: number, b: number) => a + b, 0) / rainProbabilities.length
        );
      }
    } catch (forecastError) {
      console.error("Forecast fetch error:", forecastError);
      // Continue without rain probability
    }

    const result = {
      temperature: weatherData.main.temp,
      description: weatherData.weather[0].description,
      humidity: weatherData.main.humidity,
      rainChance,
      icon: weatherData.weather[0].icon,
      cityName: weatherData.name,
      windSpeed: weatherData.wind.speed,
      feelsLike: weatherData.main.feels_like,
    };

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    console.error("Weather error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
