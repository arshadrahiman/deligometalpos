import { create } from 'zustand';
import { BusinessStockSummary } from '../types';
import { stockService, DEFAULT_INITIAL_STOCK } from '../services/stockService';

interface StockState {
  summary: BusinessStockSummary;
  isLoading: boolean;
  fetchStock: () => Promise<void>;
  updateRates: (gold24K: number, gold22K: number, silver1Kg: number) => Promise<void>;
  saveCalibration: (calibration: Partial<BusinessStockSummary>) => Promise<BusinessStockSummary>;
  resetStock: () => Promise<void>;
  loadDemoStock: () => Promise<void>;
}

export const useStockStore = create<StockState>((set) => ({
  summary: DEFAULT_INITIAL_STOCK,
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

  saveCalibration: async (calibration: Partial<BusinessStockSummary>) => {
    set({ isLoading: true });
    try {
      const updated = await stockService.saveCalibration(calibration);
      set({ summary: updated, isLoading: false });
      return updated;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  resetStock: async () => {
    const reset = await stockService.resetStock();
    set({ summary: reset });
  },

  loadDemoStock: async () => {
    const demo = await stockService.loadDemoStock();
    set({ summary: demo });
  },
}));
