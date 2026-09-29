import { Language, languageNames } from "@/lib/translations";
import { useLanguage } from "@/contexts/LanguageContext";

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  const languages: Language[] = ["hi", "te", "en"];

  return (
    <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
      {languages.map((lang) => (
        <button
          key={lang}
          onClick={() => setLanguage(lang)}
          className={`
            px-3 py-2 rounded-lg text-sm font-bold
            transition-all duration-200
            min-w-[44px] min-h-[44px]
            focus:outline-none focus:ring-2 focus:ring-ring
            ${
              language === lang
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            }
          `}
          aria-label={`Switch to ${lang === "en" ? "English" : lang === "hi" ? "Hindi" : "Telugu"}`}
          aria-pressed={language === lang}
        >
          {languageNames[lang]}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;
