import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'EN' | 'KH' | 'ZH' | 'KO';

interface AppState {
  language: Language;
  setLanguage: (lang: Language) => void;
  reservationModalOpen: boolean;
  setReservationModalOpen: (open: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'EN',
      setLanguage: (language) => set({ language }),
      reservationModalOpen: false,
      setReservationModalOpen: (reservationModalOpen) => set({ reservationModalOpen }),
      mobileMenuOpen: false,
      setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen }),
    }),
    {
      name: 'omr-language-preference',
      partialize: (state) => ({ language: state.language }),
    }
  )
);
