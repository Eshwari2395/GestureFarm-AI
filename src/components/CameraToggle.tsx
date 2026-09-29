import { Camera, CameraOff } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CameraToggleProps {
  isEnabled: boolean;
  onToggle: () => void;
}

const CameraToggle = ({ isEnabled, onToggle }: CameraToggleProps) => {
  const { t } = useLanguage();

  return (
    <button
      onClick={onToggle}
      className={`
        flex items-center gap-2 px-4 py-3 rounded-xl
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-ring
        min-h-[48px]
        ${
          isEnabled
            ? "bg-primary text-primary-foreground shadow-medium"
            : "bg-muted text-muted-foreground hover:bg-muted/80"
        }
      `}
      aria-label={isEnabled ? t.disableCamera : t.enableCamera}
      aria-pressed={isEnabled}
    >
      {isEnabled ? (
        <>
          <Camera className="w-5 h-5" />
          <span className="text-sm font-medium">{t.cameraOn}</span>
        </>
      ) : (
        <>
          <CameraOff className="w-5 h-5" />
          <span className="text-sm font-medium">{t.enableCamera}</span>
        </>
      )}
    </button>
  );
};

export default CameraToggle;
