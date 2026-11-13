import { create } from 'zustand';

export type MetalMode = 'GOLD' | 'SILVER';

interface MetalState {
  metalMode: MetalMode;
  setMetalMode: (mode: MetalMode) => void;
  toggleMetalMode: () => void;
}

const STORAGE_KEY = 'hs_metal_mode';

export const useMetalStore = create<MetalState>((set) => ({
  metalMode: (localStorage.getItem(STORAGE_KEY) as MetalMode) || 'GOLD',

  setMetalMode: (mode: MetalMode) => {
    localStorage.setItem(STORAGE_KEY, mode);
    set({ metalMode: mode });
  },

  toggleMetalMode: () => {
    set((state) => {
      const nextMode = state.metalMode === 'GOLD' ? 'SILVER' : 'GOLD';
      localStorage.setItem(STORAGE_KEY, nextMode);
      return { metalMode: nextMode };
    });
  },
}));

