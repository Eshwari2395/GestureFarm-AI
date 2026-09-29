// Generic Telangana crop prices for offline/fallback use
// These are estimated modal prices in INR per quintal

import { Language } from "./translations";

export interface GenericCropPrice {
  commodity: string;
  commodityHi: string;
  commodityTe: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  unit: string;
  trend: "up" | "down" | "stable";
  trendPercent: number;
}

// Realistic Telangana prices based on recent APMC/E-NAM data
export const genericTelanganasPrices: GenericCropPrice[] = [
  {
    commodity: "Rice (Paddy)",
    commodityHi: "धान (चावल)",
    commodityTe: "వరి (ధాన్యం)",
    minPrice: 1900,
    maxPrice: 2200,
    modalPrice: 2050,
    unit: "quintal",
    trend: "stable",
    trendPercent: 0,
  },
  {
    commodity: "Cotton",
    commodityHi: "कपास",
    commodityTe: "పత్తి",
    minPrice: 6000,
    maxPrice: 7000,
    modalPrice: 6500,
    unit: "quintal",
    trend: "up",
    trendPercent: 3,
  },
  {
    commodity: "Chilli (Red)",
    commodityHi: "लाल मिर्च",
    commodityTe: "ఎర్ర మిర్చి",
    minPrice: 8000,
    maxPrice: 12000,
    modalPrice: 10000,
    unit: "quintal",
    trend: "up",
    trendPercent: 5,
  },
  {
    commodity: "Maize",
    commodityHi: "मक्का",
    commodityTe: "మొక్కజొన్న",
    minPrice: 1800,
    maxPrice: 2100,
    modalPrice: 1950,
    unit: "quintal",
    trend: "stable",
    trendPercent: 1,
  },
  {
    commodity: "Groundnut",
    commodityHi: "मूंगफली",
    commodityTe: "వేరుశెనగ",
    minPrice: 5200,
    maxPrice: 6400,
    modalPrice: 5800,
    unit: "quintal",
    trend: "down",
    trendPercent: -2,
  },
  {
    commodity: "Soybean",
    commodityHi: "सोयाबीन",
    commodityTe: "సోయాబీన్",
    minPrice: 4000,
    maxPrice: 4600,
    modalPrice: 4300,
    unit: "quintal",
    trend: "stable",
    trendPercent: 0,
  },
  {
    commodity: "Turmeric",
    commodityHi: "हल्दी",
    commodityTe: "పసుపు",
    minPrice: 12000,
    maxPrice: 16000,
    modalPrice: 14000,
    unit: "quintal",
    trend: "up",
    trendPercent: 8,
  },
  {
    commodity: "Onion",
    commodityHi: "प्याज",
    commodityTe: "ఉల్లిపాయ",
    minPrice: 800,
    maxPrice: 1400,
    modalPrice: 1100,
    unit: "quintal",
    trend: "down",
    trendPercent: -5,
  },
  {
    commodity: "Tomato",
    commodityHi: "टमाटर",
    commodityTe: "టమాట",
    minPrice: 1200,
    maxPrice: 2400,
    modalPrice: 1800,
    unit: "quintal",
    trend: "up",
    trendPercent: 10,
  },
  {
    commodity: "Bengal Gram",
    commodityHi: "चना",
    commodityTe: "శెనగలు",
    minPrice: 5000,
    maxPrice: 5800,
    modalPrice: 5400,
    unit: "quintal",
    trend: "stable",
    trendPercent: 1,
  },
];

// Get formatted speech text for generic prices
export const getGenericPricesSpeechText = (language: Language): string => {
  const topPrices = genericTelanganasPrices.slice(0, 4);
  
  if (language === "hi") {
    return `💰 तेलंगाना मंडी भाव (अनुमानित): ` +
      topPrices.map(c => `${c.commodityHi} ₹${c.modalPrice}/क्विंटल`).join(", ") +
      `. ये अनुमानित कीमतें हैं।`;
  } else if (language === "te") {
    return `💰 తెలంగాణ మార్కెట్ ధరలు (అంచనా): ` +
      topPrices.map(c => `${c.commodityTe} ₹${c.modalPrice}/క్వింటాల్`).join(", ") +
      `. ఇవి అంచనా ధరలు.`;
  } else {
    return `💰 Telangana Market Prices (Est.): ` +
      topPrices.map(c => `${c.commodity} ₹${c.modalPrice}/quintal`).join(", ") +
      `. These are estimated prices.`;
  }
};

// Generic location for fallback
export const genericLocation = {
  state: "Telangana",
  stateLocalized: "తెలంగాణ",
  district: "Hyderabad",
};
