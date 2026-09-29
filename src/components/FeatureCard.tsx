import { ReactNode, forwardRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface FeatureCardProps {
  icon: ReactNode;
  variant?: "weather" | "crop" | "price" | "alert" | "pest";
  onClick?: () => void;
  isLoading?: boolean;
}

const variantStyles = {
  weather: "bg-sky text-sky-foreground hover:shadow-[0_8px_30px_-8px_hsl(200_75%_50%/0.4)]",
  crop: "bg-primary text-primary-foreground hover:shadow-[0_8px_30px_-8px_hsl(150_25%_23%/0.4)]",
  price: "bg-accent text-accent-foreground hover:shadow-[0_8px_30px_-8px_hsl(32_90%_44%/0.4)]",
  alert: "bg-secondary text-secondary-foreground hover:shadow-[0_8px_30px_-8px_hsl(32_90%_44%/0.4)]",
  pest: "bg-primary text-primary-foreground hover:shadow-[0_8px_30px_-8px_hsl(150_25%_23%/0.4)]",
};

const FeatureCard = forwardRef<HTMLButtonElement, FeatureCardProps>(({ 
  icon, 
  variant = "crop", 
  onClick, 
  isLoading = false 
}, ref) => {
  const { t } = useLanguage();

  // Get title and subtitle based on variant
  const getLabels = () => {
    switch (variant) {
      case "weather":
        return { title: t.weather, subtitle: t.weatherSubtitle };
      case "crop":
        return { title: t.crop, subtitle: t.cropSubtitle };
      case "price":
        return { title: t.price, subtitle: t.priceSubtitle };
      case "alert":
        return { title: t.alert, subtitle: t.alertSubtitle };
      case "pest":
        return { title: t.pest, subtitle: t.pestSubtitle };
      default:
        return { title: "", subtitle: "" };
    }
  };

  const { title, subtitle } = getLabels();

  return (
    <button
      ref={ref}
      onClick={onClick}
      disabled={isLoading}
      className={`
        w-full p-5 md:p-7 rounded-3xl
        flex flex-col items-center gap-3
        transition-all duration-300 ease-out
        card-hover focus:outline-none focus:ring-4 focus:ring-ring/50
        active:scale-95 touch-manipulation
        min-h-[130px] md:min-h-[150px]
        ${variantStyles[variant]}
        ${isLoading ? "opacity-70 cursor-wait" : ""}
      `}
      aria-label={title}
    >
      {/* Large icon container with emoji for illiterate users */}
      <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
        {icon}
      </div>
      
      {/* Large, clear text */}
      <div className="text-center">
        <h3 className="text-xl md:text-2xl font-extrabold">{title}</h3>
        <p className="text-sm md:text-base opacity-90 mt-0.5 font-semibold">{subtitle}</p>
      </div>
    </button>
  );
});

FeatureCard.displayName = "FeatureCard";

export default FeatureCard;
