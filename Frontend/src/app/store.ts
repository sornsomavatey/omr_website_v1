import { create } from 'zustand';

export type Language = 'EN' | 'KH' | 'ZH' | 'KO';

interface AppState {
  language: Language;
  setLanguage: (lang: Language) => void;
  reservationModalOpen: boolean;
  setReservationModalOpen: (open: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const getInitialLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    try {
      const savedSimple = localStorage.getItem('omr_lang');
      if (savedSimple && ['EN', 'KH', 'ZH', 'KO'].includes(savedSimple)) {
        return savedSimple as Language;
      }
      const savedPersist = localStorage.getItem('omr-language-preference');
      if (savedPersist) {
        const parsed = JSON.parse(savedPersist);
        if (parsed?.state?.language && ['EN', 'KH', 'ZH', 'KO'].includes(parsed.state.language)) {
          return parsed.state.language as Language;
        }
      }
    } catch (e) {
      // Ignore fallback
    }
  }
  return 'KH';
};

export const useAppStore = create<AppState>((set) => ({
  language: getInitialLanguage(),
  setLanguage: (language: Language) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('omr_lang', language);
        localStorage.setItem('omr-language-preference', JSON.stringify({ state: { language } }));
      } catch (e) {
        // ignore
      }
    }
    set({ language });
  },
  reservationModalOpen: false,
  setReservationModalOpen: (reservationModalOpen) => set({ reservationModalOpen }),
  mobileMenuOpen: false,
  setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen }),
}));
