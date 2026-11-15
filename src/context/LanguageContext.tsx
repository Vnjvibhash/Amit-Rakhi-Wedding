import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language, TRANSLATIONS } from '../translations/translations';
import { Globe } from 'lucide-react';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isHindi: boolean;
}

const STORAGE_KEY = 'wedding_preferred_language';

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to 'hi' (Hindi) unless user has explicitly chosen 'en' previously
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'hi') {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'hi';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string, params?: Record<string, string | number>): string => {
    const entry = TRANSLATIONS[key];
    let text = entry ? entry[language] || entry.en || key : key;
    if (params) {
      Object.entries(params).forEach(([paramKey, paramVal]) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
      });
    }
    return text;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isHindi: language === 'hi'
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}

export const LanguageToggle: React.FC<{
  className?: string;
  variant?: 'pill' | 'minimal' | 'full';
}> = ({ className = '', variant = 'pill' }) => {
  const { language, setLanguage } = useLanguage();

  if (variant === 'minimal') {
    return (
      <button
        type="button"
        onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide border border-gold-400/50 bg-maroon-950/70 text-gold-200 hover:bg-gold-500/20 hover:text-gold-100 transition shadow-sm ${className}`}
        title={language === 'hi' ? 'Switch to English' : 'हिंदी में देखें'}
        aria-label={language === 'hi' ? 'Switch language to English' : 'भाषा हिंदी में बदलें'}
      >
        <Globe className="w-3.5 h-3.5 text-gold-400" />
        <span>{language === 'hi' ? 'English' : 'हिंदी'}</span>
      </button>
    );
  }

  return (
    <div
      role="group"
      aria-label="Language selector"
      className={`inline-flex items-center p-0.5 rounded-full bg-maroon-950/80 border border-gold-400/50 shadow-inner ${className}`}
    >
      <button
        type="button"
        onClick={() => setLanguage('hi')}
        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
          language === 'hi'
            ? 'bg-gradient-to-r from-gold-300 to-gold-500 text-maroon-950 font-bold shadow-sm'
            : 'text-ivory-pure/80 hover:text-gold-200'
        }`}
        aria-pressed={language === 'hi'}
      >
        हिंदी
      </button>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
          language === 'en'
            ? 'bg-gradient-to-r from-gold-300 to-gold-500 text-maroon-950 font-bold shadow-sm'
            : 'text-ivory-pure/80 hover:text-gold-200'
        }`}
        aria-pressed={language === 'en'}
      >
        ENG
      </button>
    </div>
  );
};
