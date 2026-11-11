import { create } from 'zustand';

interface UIState {
  isStockModalOpen: boolean;
  isBhavcutModalOpen: boolean;
  isWhatsAppModalOpen: boolean;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  openStockModal: () => void;
  closeStockModal: () => void;
  openBhavcutModal: () => void;
  closeBhavcutModal: () => void;
  openWhatsAppModal: () => void;
  closeWhatsAppModal: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isStockModalOpen: false,
  isBhavcutModalOpen: false,
  isWhatsAppModalOpen: false,
  toast: null,

  openStockModal: () => set({ isStockModalOpen: true }),
  closeStockModal: () => set({ isStockModalOpen: false }),
  openBhavcutModal: () => set({ isBhavcutModalOpen: true }),
  closeBhavcutModal: () => set({ isBhavcutModalOpen: false }),
  openWhatsAppModal: () => set({ isWhatsAppModalOpen: true }),
  closeWhatsAppModal: () => set({ isWhatsAppModalOpen: false }),

  showToast: (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    set({ toast: { message, type } });
    setTimeout(() => {
      set({ toast: null });
    }, 4000);
  },
  hideToast: () => set({ toast: null }),
}));
