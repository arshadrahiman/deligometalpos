import { BusinessStockSummary } from '../types';
import { getItem, setItem } from './storage';
import { SEED_STOCK_SUMMARY } from './mockSeedData';

const STORAGE_KEY = 'hs_stock_summary';

export const DEFAULT_INITIAL_STOCK: BusinessStockSummary = {
  liquidCash: 0,
  primaryBank: 0,
  secondaryBank: 0,
  pureGoldStock: {
    weightGm: 0,
    avgBuyRate: 0,
    avgSellRate: 0,
    todayBuyWeight: 0,
    todaySellWeight: 0,
  },
  rawScrapStock: {
    kachaGrossWeight: 0,
    kachaFineEquivalent: 0,
    todayGrossWeight: 0,
    todayFineEquivalent: 0,
  },
  silverStock: {
    weightGm: 0,
    avgRate: 0,
    avgSellRate: 0,
    todayBuyWeight: 0,
    todaySellWeight: 0,
  },
  marketRates: {
    gold24K: 75000,
    gold22K: 68750,
    silver1Kg: 90000,
  },
  udhariOutstanding: {
    netCustomerGold: 0,
    netCustomerCash: 0,
    netCustomerSilver: 0,
    udharGold: 0,
    jamaGold: 0,
    udharSilver: 0,
    jamaSilver: 0,
    udharCash: 0,
    jamaCash: 0,
  },
  capital: {
    netPoonjeeCash: 0,
    totalValuationCash: 0,
    todayCashProfit: 0,
    netPoonjeeGold: 0,
    totalValuationGold: 0,
    todayGoldProfit: 0,
    netPoonjeeSilver: 0,
    totalValuationSilver: 0,
    todaySilverProfit: 0,
  },
  totalBusinessWorth: 0,
  todayProfit: 0,
};

export function calculateBusinessWorth(stock: BusinessStockSummary): number {
  const g24 = stock.marketRates.gold24K || 75000;
  const sRate = stock.marketRates.silver1Kg || 90000;

  const cashTotal = (stock.liquidCash || 0) + (stock.primaryBank || 0) + (stock.secondaryBank || 0);
  const pureGoldVal = ((stock.pureGoldStock.weightGm || 0) * g24) / 10;
  const scrapGoldVal = ((stock.rawScrapStock.kachaFineEquivalent || 0) * g24) / 10;
  const silverVal = ((stock.silverStock.weightGm || 0) * sRate) / 1000;

  const udharCash = stock.udhariOutstanding.netCustomerCash || 0;
  const udharGold = ((stock.udhariOutstanding.netCustomerGold || 0) * g24) / 10;
  const udharSilver = (((stock.udhariOutstanding.netCustomerSilver || 0) * sRate) / 1000);

  return Math.round(cashTotal + pureGoldVal + scrapGoldVal + silverVal + udharCash + udharGold + udharSilver);
}

export const stockService = {
  async getSummary(): Promise<BusinessStockSummary> {
    let stock = getItem<BusinessStockSummary | null>(STORAGE_KEY, null);
    if (!stock) {
      stock = DEFAULT_INITIAL_STOCK;
      setItem(STORAGE_KEY, stock);
    }
    return stock;
  },

  async saveCalibration(calibration: Partial<BusinessStockSummary>): Promise<BusinessStockSummary> {
    const current = await this.getSummary();
    const updated: BusinessStockSummary = {
      ...current,
      ...calibration,
      pureGoldStock: {
        ...current.pureGoldStock,
        ...(calibration.pureGoldStock || {}),
      },
      rawScrapStock: {
        ...current.rawScrapStock,
        ...(calibration.rawScrapStock || {}),
      },
      silverStock: {
        ...current.silverStock,
        ...(calibration.silverStock || {}),
      },
      marketRates: {
        ...current.marketRates,
        ...(calibration.marketRates || {}),
      },
      udhariOutstanding: {
        ...current.udhariOutstanding,
        ...(calibration.udhariOutstanding || {}),
      },
      capital: {
        ...current.capital,
        ...(calibration.capital || {}),
      },
    };

    updated.totalBusinessWorth = calculateBusinessWorth(updated);
    setItem(STORAGE_KEY, updated);
    return updated;
  },

  async updateRates(
    gold24K: number,
    gold22K: number,
    silver1Kg: number
  ): Promise<BusinessStockSummary> {
    return this.saveCalibration({
      marketRates: { gold24K, gold22K, silver1Kg },
    });
  },

  async resetStock(): Promise<BusinessStockSummary> {
    setItem(STORAGE_KEY, DEFAULT_INITIAL_STOCK);
    return DEFAULT_INITIAL_STOCK;
  },

  async loadDemoStock(): Promise<BusinessStockSummary> {
    const demo = { ...SEED_STOCK_SUMMARY };
    demo.totalBusinessWorth = calculateBusinessWorth(demo);
    setItem(STORAGE_KEY, demo);
    return demo;
  },
};
