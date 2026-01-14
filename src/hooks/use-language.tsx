
'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Language } from '@/lib/types';
import { dictionaries } from '@/lib/dictionaries';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const storedLang = localStorage.getItem('language') as Language;
    if (storedLang && ['en', 'fr', 'ht'].includes(storedLang)) {
      setLanguageState(storedLang);
    } else {
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'fr') setLanguageState('fr');
      else if (browserLang === 'ht') setLanguageState('ht');
      else setLanguageState('en');
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  };

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      let translation = dictionaries[language]?.[key] || dictionaries['en'][key] || key;
      if (params) {
        Object.entries(params).forEach(([paramKey, paramValue]) => {
          translation = translation.replace(`{{${paramKey}}}`, String(paramValue));
        });
      }
      return translation;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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

    