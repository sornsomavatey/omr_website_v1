import React, { createContext, useContext, useState, useEffect } from 'react';

export type CmsLanguage = 'en' | 'kh' | 'zh' | 'ko';

export interface LanguageInfo {
  code: CmsLanguage;
  label: string;
  short: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', label: 'English', short: 'EN', flag: '' },
  { code: 'kh', label: 'Khmer (ខ្មែរ)', short: 'KH', flag: '' },
  { code: 'zh', label: 'Chinese (中文)', short: 'ZH', flag: '' },
  { code: 'ko', label: 'Korean (한국어)', short: 'KO', flag: '' },
];

interface CmsLanguageContextType {
  language: CmsLanguage;
  setLanguage: (lang: CmsLanguage) => void;
  currentLangInfo: LanguageInfo;
}

const CmsLanguageContext = createContext<CmsLanguageContextType | undefined>(undefined);

export const CmsLanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<CmsLanguage>(() => {
    return (localStorage.getItem('omr_cms_language') as CmsLanguage) || 'en';
  });

  const setLanguage = (lang: CmsLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('omr_cms_language', lang);
  };

  const currentLangInfo = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <CmsLanguageContext.Provider value={{ language, setLanguage, currentLangInfo }}>
      {children}
    </CmsLanguageContext.Provider>
  );
};

export const useCmsLanguage = () => {
  const context = useContext(CmsLanguageContext);
  if (!context) {
    throw new Error('useCmsLanguage must be used within a CmsLanguageProvider');
  }
  return context;
};
