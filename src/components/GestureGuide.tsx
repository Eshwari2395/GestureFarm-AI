import { useLanguage } from "@/contexts/LanguageContext";

const gestureGuide = [
  { emoji: "☝️", gesture: "pointing", labelKey: "pointing" as const },
  { emoji: "🖐️", gesture: "open_palm", labelKey: "openPalm" as const },
  { emoji: "✊", gesture: "fist", labelKey: "fist" as const },
  { emoji: "👍", gesture: "thumbs_up", labelKey: "thumbsUp" as const },
];

interface GestureGuideProps {
  currentGesture?: string | null;
}

const GestureGuide = ({ currentGesture }: GestureGuideProps) => {
  const { t } = useLanguage();

  return (
    <div className="w-full bg-card rounded-2xl p-4 border border-border shadow-soft">
      <p className="text-sm font-bold text-muted-foreground mb-3 text-center">
        {t.showHand}
      </p>
      <div className="grid grid-cols-4 gap-2">
        {gestureGuide.map(({ emoji, gesture, labelKey }) => (
          <div
            key={gesture}
            className={`
              flex flex-col items-center gap-1 p-2 rounded-xl transition-all
              ${currentGesture === gesture 
                ? "bg-primary text-primary-foreground scale-105 shadow-md" 
                : "bg-muted/50"
              }
            `}
          >
            <span className="text-2xl">{emoji}</span>
            <span className="text-xs font-medium text-center leading-tight">
              {t[labelKey].split(" = ")[1] || t[labelKey]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GestureGuide;
