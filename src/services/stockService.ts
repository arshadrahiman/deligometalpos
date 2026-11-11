import { BusinessStockSummary } from '../types';
import { getItem, setItem } from './storage';
import { SEED_STOCK_SUMMARY } from './mockSeedData';

const STORAGE_KEY = 'hs_stock_summary';

export const stockService = {
  async getSummary(): Promise<BusinessStockSummary> {
    let stock = getItem<BusinessStockSummary>(STORAGE_KEY, SEED_STOCK_SUMMARY);
    if (!stock) {
      stock = SEED_STOCK_SUMMARY;
      setItem(STORAGE_KEY, stock);
    }
    return stock;
  },

  async updateRates(
    gold24K: number,
    gold22K: number,
    silver1Kg: number
  ): Promise<BusinessStockSummary> {
    const stock = await this.getSummary();
    const updated: BusinessStockSummary = {
      ...stock,
      marketRates: {
        gold24K,
        gold22K,
        silver1Kg,
      },
      // Re-evaluate net worth based on market rates
      totalBusinessWorth: Math.round(
        stock.liquidCash +
          stock.primaryBank +
          stock.secondaryBank +
          (stock.pureGoldStock.weightGm * gold24K) / 10 +
          (stock.rawScrapStock.kachaFineEquivalent * gold24K) / 10 +
          stock.udhariOutstanding.netCustomerCash +
          (stock.udhariOutstanding.netCustomerGold * gold24K) / 10
      ),
    };
    setItem(STORAGE_KEY, updated);
    return updated;
  },
};
