import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { Language, translations, TranslationStrings } from "@/lib/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationStrings;
  formatMessage: (key: keyof TranslationStrings, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "gesturefarm-language";

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Try to get saved language from localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && (saved === "en" || saved === "hi" || saved === "te")) {
        return saved as Language;
      }
    }
    return "en"; // Default to English
  });

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  // Get current translation strings
  const t = translations[language];

  // Format a message with parameters (e.g., {temp} -> 28)
  const formatMessage = useCallback(
    (key: keyof TranslationStrings, params?: Record<string, string | number>): string => {
      let message = translations[language][key] as string;
      
      if (params) {
        Object.entries(params).forEach(([paramKey, value]) => {
          message = message.replace(`{${paramKey}}`, String(value));
        });
      }
      
      return message;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, formatMessage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export default LanguageContext;
