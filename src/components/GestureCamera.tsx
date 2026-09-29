import { useRef, useCallback, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { Camera, CameraOff, Loader2, WifiOff } from "lucide-react";
import { useGestureDetection, GestureType } from "@/hooks/useGestureDetection";
import { useLanguage } from "@/contexts/LanguageContext";

interface GestureCameraProps {
  isEnabled: boolean;
  onToggle: () => void;
  onGesture: (gesture: GestureType) => void;
}

// Updated gesture labels based on new mappings
const gestureLabels: Record<NonNullable<GestureType>, Record<string, string>> = {
  pointing: { en: "☝️ Weather", hi: "☝️ मौसम", te: "☝️ వాతావరణం" },
  open_palm: { en: "🖐️ Rice advice", hi: "🖐️ धान सलाह", te: "🖐️ వరి సలహా" },
  fist: { en: "✊ E-NAM prices", hi: "✊ E-NAM भाव", te: "✊ E-NAM ధరలు" },
  thumbs_up: { en: "👍 Cotton advice", hi: "👍 कपास सलाह", te: "👍 పత్తి సలహా" },
  peace: { en: "✌️ Maize advice", hi: "✌️ मक्का सलाह", te: "✌️ మొక్కజొన్న సలహా" },
};

// Offline messages in each language
const offlineMessages: Record<string, string> = {
  en: "No internet. Use voice or buttons instead.",
  hi: "इंटरनेट नहीं है। आवाज़ या बटन इस्तेमाल करें।",
  te: "ఇంటర్నెట్ లేదు. వాయిస్ లేదా బటన్లు వాడండి.",
};

const GestureCamera = ({ isEnabled, onToggle, onGesture }: GestureCameraProps) => {
  const webcamRef = useRef<Webcam>(null);
  const { language, t } = useLanguage();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const { isModelLoading, isModelReady, currentGesture, error, isOffline, startDetection, stopDetection } =
    useGestureDetection({
      onGesture,
      isEnabled,
      onOfflineError: () => {
        console.log("Gesture detection unavailable offline");
      },
    });

  // Start detection when camera is ready
  useEffect(() => {
    if (isEnabled && webcamRef.current?.video && hasPermission && !isOffline) {
      const video = webcamRef.current.video;
      
      // Wait for video to be ready
      const checkVideoReady = () => {
        if (video.readyState >= 2) {
          startDetection(video);
        } else {
          setTimeout(checkVideoReady, 100);
        }
      };
      
      checkVideoReady();
    }

    return () => {
      stopDetection();
    };
  }, [isEnabled, hasPermission, isOffline, startDetection, stopDetection]);

  // Check camera permission
  const handleUserMedia = useCallback(() => {
    setHasPermission(true);
  }, []);

  const handleUserMediaError = useCallback(() => {
    setHasPermission(false);
  }, []);

  if (!isEnabled) {
    return (
      <button
        onClick={onToggle}
        className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-muted text-muted-foreground
                   hover:bg-muted/80 transition-colors focus:outline-none focus:ring-4 focus:ring-ring
                   active:scale-95 touch-manipulation"
        aria-label={t.enableCamera}
      >
        <CameraOff className="w-6 h-6" />
        <span className="text-base md:text-lg font-bold">{t.enableCamera}</span>
      </button>
    );
  }

  return (
    <div className="relative">
      {/* Camera toggle button */}
      <button
        onClick={onToggle}
        className="absolute top-2 right-2 z-20 p-2 rounded-full bg-background/80 
                   hover:bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring
                   active:scale-95"
        aria-label={t.disableCamera}
      >
        <Camera className="w-5 h-5 text-primary" />
      </button>

      {/* Camera preview */}
      <div className="relative w-44 h-36 md:w-52 md:h-40 rounded-2xl overflow-hidden bg-muted shadow-medium border-2 border-border">
        
        {/* Offline state - friendly message */}
        {isOffline && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted z-10 p-4 gap-2">
            <WifiOff className="w-8 h-8 text-muted-foreground" />
            <p className="text-sm text-center text-muted-foreground font-medium">
              {offlineMessages[language] || offlineMessages.en}
            </p>
          </div>
        )}
        
        {/* Loading state */}
        {isModelLoading && !isOffline && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground font-medium">{t.loading}</span>
            </div>
          </div>
        )}

        {/* Camera permission denied */}
        {hasPermission === false && !isOffline && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted z-10 p-4">
            <p className="text-sm text-center text-muted-foreground font-medium">
              {t.cameraPermission}
            </p>
          </div>
        )}

        {/* General error */}
        {error && error !== "offline" && !isOffline && (
          <div className="absolute inset-0 flex items-center justify-center bg-destructive/10 z-10 p-4">
            <p className="text-sm text-center text-destructive font-medium">{t.error}</p>
          </div>
        )}

        {/* Webcam - only show if online */}
        {!isOffline && (
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              width: 320,
              height: 240,
              facingMode: "user",
            }}
            onUserMedia={handleUserMedia}
            onUserMediaError={handleUserMediaError}
            className="w-full h-full object-cover transform scale-x-[-1]"
          />
        )}

        {/* Gesture indicator overlay */}
        {currentGesture && !isOffline && (
          <div
            className="absolute bottom-0 left-0 right-0 bg-primary/90 text-primary-foreground 
                        py-3 px-4 text-center animate-in fade-in-0 duration-200"
          >
            <span className="text-base font-bold">
              {gestureLabels[currentGesture]?.[language] || currentGesture}
            </span>
          </div>
        )}

        {/* Status indicator */}
        {isModelReady && !currentGesture && !isOffline && (
          <div className="absolute top-2 left-2 flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs text-primary-foreground bg-background/60 px-2 py-0.5 rounded font-medium">
              {t.cameraOn}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GestureCamera;
