import { Hand, ThumbsUp, HandMetal } from "lucide-react";
import { GestureType } from "@/hooks/useGestureDetection";
import { useLanguage } from "@/contexts/LanguageContext";

interface GestureIndicatorProps {
  isActive?: boolean;
  gesture?: GestureType;
}

const gestureIcons: Record<string, React.ReactNode> = {
  pointing: <Hand className="w-10 h-10 md:w-12 md:h-12" />,
  thumbs_up: <ThumbsUp className="w-10 h-10 md:w-12 md:h-12" />,
  peace: <HandMetal className="w-10 h-10 md:w-12 md:h-12" />,
  fist: <Hand className="w-10 h-10 md:w-12 md:h-12" />,
  open_palm: <Hand className="w-10 h-10 md:w-12 md:h-12" />,
};

// Updated gesture labels based on new mappings
const gestureLabels: Record<string, Record<string, string>> = {
  pointing: { en: "☝️ Weather", hi: "☝️ मौसम", te: "☝️ వాతావరణం" },
  open_palm: { en: "🖐️ Rice advice", hi: "🖐️ धान सलाह", te: "🖐️ వరి సలహా" },
  fist: { en: "✊ E-NAM prices", hi: "✊ E-NAM भाव", te: "✊ E-NAM ధరలు" },
  thumbs_up: { en: "👍 Cotton advice", hi: "👍 कपास सलाह", te: "👍 పత్తి సలహా" },
  peace: { en: "✌️ Maize advice", hi: "✌️ मक्का सलाह", te: "✌️ మొక్కజొన్న సలహా" },
};

const GestureIndicator = ({ isActive = false, gesture }: GestureIndicatorProps) => {
  const { language, t } = useLanguage();

  const getGestureLabel = () => {
    if (gesture && gestureLabels[gesture]) {
      return gestureLabels[gesture][language] || gestureLabels[gesture].en;
    }
    return t.showHand;
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div 
        className={`
          w-20 h-20 md:w-24 md:h-24 rounded-2xl
          bg-primary/10 border-2 border-primary/30
          flex items-center justify-center
          transition-all duration-300
          ${isActive ? "bg-primary/20 border-primary gesture-wave" : ""}
        `}
      >
        {gesture && gestureIcons[gesture] ? (
          <div className={`${isActive ? "text-primary" : "text-primary/50"}`}>
            {gestureIcons[gesture]}
          </div>
        ) : (
          <Hand 
            className={`w-10 h-10 md:w-12 md:h-12 ${isActive ? "text-primary" : "text-primary/50"}`} 
          />
        )}
      </div>
      <p className="text-sm text-muted-foreground font-medium text-center">
        {getGestureLabel()}
      </p>
    </div>
  );
};

export default GestureIndicator;
