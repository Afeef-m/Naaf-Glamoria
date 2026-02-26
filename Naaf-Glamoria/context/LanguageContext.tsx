"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    shop: "SHOP",
    collections: "COLLECTIONS",
    values: "OUR VALUES",
    about: "ABOUT US",
    contact: "CONTACT",
    search: "SEARCH",
    wishlist: "WISHLIST",
    account: "ACCOUNT",
    menu: "Menu",
    comingSoon: "Coming Soon...",
    comingSoonMobile: "Coming Soon",
    stayGolden: "Stay Golden Stay Glowing",
    brandName: "Naaf Glamoria",
    contactUs: "Contact Us",
  },
  ar: {
    shop: "تسوق",
    collections: "مجموعات",
    values: "قيمنا",
    about: "تواصل معنا",
    contact: "اتصل بنا",
    search: "بحث",
    wishlist: "قائمة الأمنيات",
    account: "حسابي",
    menu: "قائمة",
    comingSoon: "قريباً...",
    comingSoonMobile: "قريباً",
    stayGolden: "ابقي ذهبية، ابقي متألقة",
    brandName: "ناف جلاموريا",
    contactUs: "تواصل معنا",
  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Default is English
  const [language, setLanguageState] = useState<Language>("en");

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    // Update HTML dir and lang attributes
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  // Initialize on mount (optional, ensures consistency if we added persistence later)
  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
