'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Language = 'ko' | 'en' | 'ja' | 'zh' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ko');

  // Client-side only
  useEffect(() => {
    const saved = localStorage.getItem('nunchi_language');
    if (saved) {
      setLanguageState(saved as Language);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('nunchi_language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
