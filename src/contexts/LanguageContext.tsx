'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

console.log('🔍 [LanguageContext] 파일 로드됨');

export type Language = 'ko' | 'en' | 'ja' | 'zh' | 'es' | 'vi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  console.log('🔍 [LanguageProvider] 렌더링');

  const [language, setLanguageState] = useState<Language>('ko');

  // Client-side only
  useEffect(() => {
    console.log('🔍 [LanguageProvider] 마운트됨');
    const saved = localStorage.getItem('nunchi_language');
    if (saved) {
      console.log('🔍 [LanguageProvider] localStorage에서 언어 복원:', saved);
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
