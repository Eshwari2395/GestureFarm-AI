import { Mic, MicOff, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface VoiceButtonProps {
  isListening: boolean;
  isConnecting?: boolean;
  isSupported: boolean;
  onToggle: () => void;
  interimTranscript?: string;
}

const VoiceButton = ({ 
  isListening, 
  isConnecting = false,
  isSupported, 
  onToggle,
  interimTranscript 
}: VoiceButtonProps) => {
  const { t } = useLanguage();

  if (!isSupported) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-muted flex items-center justify-center">
          <MicOff className="w-16 h-16 md:w-20 md:h-20 text-muted-foreground" />
        </div>
        <p className="text-base text-destructive text-center max-w-xs font-medium">
          {t.browserNotSupported}
        </p>
      </div>
    );
  }

  // Determine status for display
  const getStatusText = () => {
    if (isConnecting) return t.connecting || "Connecting...";
    if (isListening) return t.speakNow;
    return t.startListening;
  };

  const getStatusColor = () => {
    if (isConnecting) return "text-muted-foreground";
    if (isListening) return "text-secondary";
    return "text-muted-foreground";
  };

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Giant microphone button - farmer friendly */}
      <button
        onClick={onToggle}
        disabled={isConnecting}
        className={`
          relative w-44 h-44 md:w-56 md:h-56 rounded-full
          flex items-center justify-center
          bg-secondary text-secondary-foreground
          shadow-voice transition-all duration-300
          focus:outline-none focus:ring-4 focus:ring-secondary/50
          active:scale-95 touch-manipulation
          ${isConnecting ? "opacity-75 cursor-wait" : ""}
          ${isListening ? "voice-button-active scale-105" : "voice-button-pulse"}
        `}
        aria-label={isListening ? t.stopListening : t.startListening}
        aria-pressed={isListening}
      >
        {/* Pulsing animation rings */}
        {!isConnecting && (
          <>
            <div 
              className={`absolute inset-0 rounded-full bg-secondary opacity-30 ${isListening ? 'animate-ping' : 'animate-pulse'}`}
              style={{ animationDuration: isListening ? "0.8s" : "2s" }} 
            />
            <div 
              className={`absolute inset-2 rounded-full bg-secondary opacity-20 ${isListening ? 'animate-ping' : ''}`}
              style={{ animationDuration: isListening ? "1.2s" : "0s", animationDelay: "0.2s" }} 
            />
          </>
        )}
        
        {/* Icon - extra large */}
        {isConnecting ? (
          <Loader2 className="w-20 h-20 md:w-24 md:h-24 relative z-10 animate-spin" />
        ) : isListening ? (
          <Mic className="w-20 h-20 md:w-24 md:h-24 relative z-10 animate-pulse" />
        ) : (
          <MicOff className="w-20 h-20 md:w-24 md:h-24 relative z-10" />
        )}
      </button>

      {/* Status text - large and clear */}
      <p className={`text-xl md:text-2xl font-bold text-center transition-colors duration-300 ${getStatusColor()}`}>
        {getStatusText()}
      </p>

      {/* Interim transcript display - more prominent */}
      {isListening && interimTranscript && (
        <div className="max-w-sm text-center px-5 py-4 bg-secondary/10 rounded-2xl border-2 border-secondary/30">
          <p className="text-lg md:text-xl text-foreground font-bold animate-pulse">
            "{interimTranscript}"
          </p>
        </div>
      )}
    </div>
  );
};

export default VoiceButton;
