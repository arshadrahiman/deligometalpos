import { create } from 'zustand';
import { BusinessStockSummary } from '../types';
import { stockService } from '../services/stockService';
import { SEED_STOCK_SUMMARY } from '../services/mockSeedData';

interface StockState {
  summary: BusinessStockSummary;
  isLoading: boolean;
  fetchStock: () => Promise<void>;
  updateRates: (gold24K: number, gold22K: number, silver1Kg: number) => Promise<void>;
}

export const useStockStore = create<StockState>((set) => ({
  summary: SEED_STOCK_SUMMARY,
  isLoading: false,

  fetchStock: async () => {
    set({ isLoading: true });
    try {
      const summary = await stockService.getSummary();
      set({ summary, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  updateRates: async (gold24K: number, gold22K: number, silver1Kg: number) => {
    const updated = await stockService.updateRates(gold24K, gold22K, silver1Kg);
    set({ summary: updated });
  },
}));
