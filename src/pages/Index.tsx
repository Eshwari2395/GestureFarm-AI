import { useState, useCallback } from "react";
import { ArrowRight, Bug, Cloud, IndianRupee, MapPin, ShieldCheck, Sparkles, Sprout } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import VoiceButton from "@/components/VoiceButton";
import GestureIndicator from "@/components/GestureIndicator";
import GestureCamera from "@/components/GestureCamera";

import FeatureCard from "@/components/FeatureCard";
import ResponseBubble from "@/components/ResponseBubble";
import CameraToggle from "@/components/CameraToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { useVoiceRecognition, CommandType } from "@/hooks/useVoiceRecognition";
import { useMultiLanguageTTS } from "@/hooks/useMultiLanguageTTS";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useWeather } from "@/hooks/useWeather";
import { useMarketPrices } from "@/hooks/useMarketPrices";
import { GestureType } from "@/hooks/useGestureDetection";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-farm.jpg";

const Index = () => {
  const [response, setResponse] = useState("");
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [currentGesture, setCurrentGesture] = useState<GestureType>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [priceLoading, setPriceLoading] = useState(false);

  const { language, t } = useLanguage();
  const { toast } = useToast();
  const { latitude, longitude } = useGeolocation();
  const { weather, isLoading: isWeatherLoading, getFormattedResponse, refresh: refreshWeather } = useWeather({
    latitude,
    longitude,
    language,
  });

  // E-NAM Market prices hook
  const { 
    isLoading: isMarketLoading, 
    getFormattedResponse: getMarketResponse, 
    refresh: refreshMarketPrices,
    location: marketLocation,
  } = useMarketPrices({
    latitude,
    longitude,
    language,
  });

  const { speak, stop: stopTTS, isSpeaking, isLoading: isTTSLoading } = useMultiLanguageTTS({
    language,
    onStart: () => console.log("🎤 TTS started"),
    onEnd: () => console.log("🎤 TTS ended"),
    onError: (error) => {
      console.error("🎤 TTS error:", error);
      toast({
        title: language === "te" ? "వాయిస్ అందుబాటులో లేదు" : language === "hi" ? "आवाज़ उपलब्ध नहीं है" : "Voice unavailable",
        description: error,
        variant: "destructive",
      });
    },
  });

  // Handle command from any input source
  const handleCommand = useCallback(
    async (command: CommandType) => {
      if (!command) return;

      console.log(`📋 Processing command: ${command}, language: ${language}`);

      let responseText = "";

      const cropAdvice = {
        rice: { label: language === "hi" ? "धान" : language === "te" ? "వరి" : "Rice", advice: t.riceAdvice },
        cotton: { label: language === "hi" ? "कपास" : language === "te" ? "పత్తి" : "Cotton", advice: t.cottonAdvice },
        maize: { label: language === "hi" ? "मक्का" : language === "te" ? "మొక్కజొన్న" : "Maize", advice: t.maizeAdvice },
      } as const;

      const getCropWeatherAdvice = (crop: keyof typeof cropAdvice, weatherOverride = weather) => {
        const selected = cropAdvice[crop];
        const location = weatherOverride?.cityName || (language === "hi" ? "आपके क्षेत्र" : language === "te" ? "మీ ప్రాంతం" : "your area");
        const temp = weatherOverride?.temperature ?? "--";
        const rain = weatherOverride?.rainChance ?? "--";
        return t.cropWeatherAdvice
          .replace("{crop}", selected.label)
          .replace("{location}", location)
          .replace("{temp}", String(temp))
          .replace("{rain}", String(rain))
          .replace("{advice}", selected.advice);
      };

      switch (command) {
        case "weather":
          setWeatherLoading(true);
          responseText = getFormattedResponse(await refreshWeather());
          setWeatherLoading(false);
          break;
        case "crop":
          responseText = getCropWeatherAdvice("rice", await refreshWeather());
          break;
        case "price":
          // Fetch real market prices based on location
          setPriceLoading(true);
          await refreshMarketPrices();
          responseText = getMarketResponse();
          setPriceLoading(false);
          break;
        case "alert":
          responseText = t.alertResponse;
          break;
        case "pest":
          responseText = t.pestResponse;
          break;
        case "rice":
          responseText = getCropWeatherAdvice("rice", await refreshWeather());
          break;
        case "cotton":
          responseText = getCropWeatherAdvice("cotton", await refreshWeather());
          break;
        case "maize":
          responseText = getCropWeatherAdvice("maize", await refreshWeather());
          break;
      }

      setResponse(responseText);

      // Auto-speak the response with explicit language
      if (responseText) {
        console.log(`🔊 Speaking response with language=${language}: "${responseText.substring(0, 50)}..."`);
        speak(responseText, language);
      }
    },
    [t, getFormattedResponse, refreshWeather, speak, language, refreshMarketPrices, getMarketResponse]
  );

  // Voice recognition
  const {
    isListening,
    isConnecting,
    isSupported,
    interimTranscript,
    startListening,
    stopListening,
  } = useVoiceRecognition({
    language,
    onResult: (transcript, command) => {
      console.log("Voice result:", transcript, command);
      if (command) {
        handleCommand(command);
      } else {
        setResponse(t.understood);
      }
    },
    onInterimResult: (interim) => {
      // Show listening feedback
      if (!response.includes("🎤")) {
        setResponse(t.listening);
      }
    },
    onError: (error) => {
      console.error("Voice error:", error);
      toast({
        title: language === "hi" ? "आवाज़ त्रुटि" : language === "te" ? "వాయిస్ లోపం" : "Voice Error",
        description: error,
        variant: "destructive",
      });
    },
    onConnecting: () => {
      console.log("Voice: connecting...");
    },
    onListening: () => {
      console.log("Voice: now listening");
      toast({
        title: language === "hi" ? "🎤 सुन रहा हूँ" : language === "te" ? "🎤 వింటున్నాను" : "🎤 Listening",
        description: language === "hi" ? "अब बोलिए..." : language === "te" ? "ఇప్పుడు మాట్లాడండి..." : "Speak now...",
      });
    },
  });

  // Handle voice button toggle - STOP TTS FIRST to avoid audio conflict
  const handleVoiceToggle = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      // Stop any playing TTS before starting voice recognition
      stopTTS();
      setResponse(t.listening);
      // Small delay to ensure audio is released
      setTimeout(() => {
        startListening();
      }, 100);
    }
  }, [isListening, startListening, stopListening, stopTTS, t.listening]);

  // Handle gesture detection - Updated mappings
  const handleGesture = useCallback(
    (gesture: GestureType) => {
      setCurrentGesture(gesture);
      
      console.log(`🖐️  Gesture detected: ${gesture}, current language: ${language}`);

      // New gesture to command mapping based on user's specifications
      const gestureToCommand: Record<string, CommandType> = {
        pointing: "weather",      // 1 finger = Weather
        open_palm: "rice",        // Open palm = rice advice
        fist: "price",            // Closed fist = E-NAM prices
        thumbs_up: "cotton",      // Thumbs up = cotton advice
        peace: "maize",           // Peace sign = maize advice
      };

      if (gesture && gestureToCommand[gesture]) {
        handleCommand(gestureToCommand[gesture]);
      }
    },
    [handleCommand, language]
  );

  // Handle feature card click
  const handleFeatureClick = useCallback(
    (feature: CommandType) => {
      handleCommand(feature);
    },
    [handleCommand]
  );

  // Handle speak button
  const handleSpeak = useCallback(() => {
    if (isSpeaking) {
      stopTTS();
    } else if (response) {
      speak(response, language);
    }
  }, [isSpeaking, response, speak, stopTTS, language]);

  // Camera toggle
  const handleCameraToggle = useCallback(() => {
    setCameraEnabled((prev) => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* Decorative corner elements */}
      <div className="corner-decoration-top-left" />
      <div className="corner-decoration-bottom-right" />

      <Header />

      {/* Hero Section */}
      <section className="relative px-4 py-6 md:py-8 z-10">
        <div className="relative overflow-hidden rounded-[2rem] border border-primary/10 bg-card shadow-medium">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${heroImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-foreground/35" />
          <div className="relative grid gap-8 px-6 py-8 md:px-10 md:py-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" />
                {t.aiPoweredCompanion}
              </div>

              <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white md:text-6xl">
                {t.gestureFarmTitle}
              </h1>

              <p className="mt-4 max-w-xl text-lg text-white/90 md:text-xl">
                {t.heroDescription}
              </p>

              <p className="mt-3 max-w-xl text-sm text-white/80 md:text-base">
                {t.speakOrGesture}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/features"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02]"
                >
                  {t.exploreFeatures}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/how-it-works"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/15"
                >
                  {t.howItWorks}
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap gap-2 text-xs text-white/85 md:text-sm">
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5">{t.voiceCommandsLabel}</span>
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5">{t.gestureControlLabel}</span>
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5">{t.farmInsightsLabel}</span>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/20 bg-white/10 p-5 backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">{t.liveSupport}</p>

              <div className="mt-5 space-y-3">
                <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-3">
                  <div className="rounded-xl bg-primary/70 p-2 text-white">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.reliableGuidance}</p>
                    <p className="text-xs text-white/70">{t.reliableGuidanceText}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-3">
                  <div className="rounded-xl bg-secondary p-2 text-white">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.localAwareness}</p>
                    <p className="text-xs text-white/70">{t.localAwarenessText}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-3">
                  <div className="rounded-xl bg-sky p-2 text-white">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.fastActions}</p>
                    <p className="text-xs text-white/70">{t.fastActionsText}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Voice & Gesture Section - Made more prominent */}
      <section className="px-4 py-8 md:py-12 flex flex-col items-center gap-8 z-10">
        <div className="flex items-center gap-8 md:gap-16">
          {/* Gesture indicator or camera */}













          {cameraEnabled ? (
            <GestureCamera
              isEnabled={cameraEnabled}
              onToggle={handleCameraToggle}
              onGesture={handleGesture}
            />



          ) : (
            <GestureIndicator isActive={!!currentGesture} gesture={currentGesture} />
          )}
          
          {/* Giant voice button */}
          <VoiceButton 
            isListening={isListening}
            isConnecting={isConnecting}
            isSupported={isSupported}
            onToggle={handleVoiceToggle}
            interimTranscript={interimTranscript}
          />
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <p className="text-center text-muted-foreground text-base md:text-lg max-w-sm font-medium">
            {t.speakOrGesture}
          </p>
          
          {/* Camera toggle button */}
          {!cameraEnabled && (
            <CameraToggle isEnabled={cameraEnabled} onToggle={handleCameraToggle} />
          )}
        </div>
      </section>

      {/* Response Section - Auto-speak enabled */}
      <section className="px-4 py-4 z-10">
        <ResponseBubble 
          message={response} 
          isVisible={!!response}
          isSpeaking={isSpeaking}
          isLoading={isTTSLoading}
          onSpeak={handleSpeak}
          autoSpeak={false} // Disabled since we auto-speak in handleCommand
        />
      </section>

      {/* Features Grid - Larger buttons for farmers */}
      <section className="px-4 py-8 md:py-10 mt-auto z-10">
        <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-2xl mx-auto">
          <FeatureCard
            variant="weather"
            icon={<Cloud className="w-12 h-12 md:w-14 md:h-14" />}
            onClick={() => handleFeatureClick("weather")}
            isLoading={weatherLoading || isWeatherLoading}
          />
          <FeatureCard
            variant="crop"
            icon={<Sprout className="w-12 h-12 md:w-14 md:h-14" />}
            onClick={() => handleFeatureClick("crop")}
          />
          <FeatureCard
            variant="price"
            icon={<IndianRupee className="w-12 h-12 md:w-14 md:h-14" />}
            onClick={() => handleFeatureClick("price")}
            isLoading={priceLoading || isMarketLoading}
          />
          <FeatureCard
            variant="pest"
            icon={<Bug className="w-12 h-12 md:w-14 md:h-14" />}
            onClick={() => handleFeatureClick("pest")}
          />
        </div>
      </section>

      {/* Location & Offline Indicator */}
      <footer className="px-4 py-4 text-center z-10">
        <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-primary/10">
          <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
          <span className="text-sm md:text-base text-primary font-bold">
            {marketLocation?.stateLocalized || weather?.cityName || t.offlineReady} • GestureFarm-AI
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
