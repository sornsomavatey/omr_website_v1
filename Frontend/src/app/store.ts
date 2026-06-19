import { create } from 'zustand';

export type Language = 'EN' | 'KH';

interface AppState {
  language: Language;
  setLanguage: (lang: Language) => void;
  reservationModalOpen: boolean;
  setReservationModalOpen: (open: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  language: 'EN',
  setLanguage: (language) => set({ language }),
  reservationModalOpen: false,
  setReservationModalOpen: (reservationModalOpen) => set({ reservationModalOpen }),
  mobileMenuOpen: false,
  setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen }),
}));
