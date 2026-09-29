import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useRef } from "react";

interface ResponseBubbleProps {
  message: string;
  isVisible?: boolean;
  isSpeaking?: boolean;
  isLoading?: boolean;
  onSpeak?: () => void;
  autoSpeak?: boolean;
}

const ResponseBubble = ({ 
  message, 
  isVisible = true,
  isSpeaking = false,
  isLoading = false,
  onSpeak,
  autoSpeak = false,
}: ResponseBubbleProps) => {
  const { t } = useLanguage();
  const lastMessageRef = useRef<string>("");

  // Auto-speak when message changes (if enabled)
  useEffect(() => {
    if (autoSpeak && message && message !== lastMessageRef.current && onSpeak && !isSpeaking && !isLoading) {
      lastMessageRef.current = message;
      // Small delay to ensure state is settled
      const timer = setTimeout(() => {
        onSpeak();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [message, autoSpeak, onSpeak, isSpeaking, isLoading]);

  if (!isVisible || !message) return null;

  return (
    <div 
      className="
        max-w-lg mx-auto p-6 md:p-8 rounded-3xl
        bg-card shadow-medium border-2 border-border
        animate-in fade-in-0 slide-in-from-bottom-4 duration-500
      "
    >
      {/* Larger, clearer text for farmers */}
      <p className="text-xl md:text-2xl text-foreground text-center font-medium leading-relaxed mb-6">
        {message}
      </p>

      {/* Prominent TTS button */}
      {onSpeak && (
        <div className="flex justify-center">
          <button
            onClick={onSpeak}
            disabled={isLoading}
            className={`
              flex items-center gap-3 px-6 py-4 rounded-2xl
              transition-all duration-200
              focus:outline-none focus:ring-4 focus:ring-ring
              active:scale-95 touch-manipulation
              min-w-[160px] justify-center
              ${
                isSpeaking
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }
              ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
            `}
            aria-label={isSpeaking ? t.speaking : t.speakAgain}
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : isSpeaking ? (
              <>
                <Volume2 className="w-6 h-6 animate-pulse" />
                <span className="text-lg font-bold">{t.speaking}</span>
              </>
            ) : (
              <>
                <VolumeX className="w-6 h-6" />
                <span className="text-lg font-bold">{t.speakAgain}</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ResponseBubble;
