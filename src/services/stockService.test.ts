import { describe, it, expect, beforeEach } from 'vitest';
import { stockService, DEFAULT_INITIAL_STOCK, calculateBusinessWorth } from './stockService';
import { customerService } from './customerService';
import { exchangeService } from './exchangeService';
import { initializeFreshProductionStorage, resetAllDataToFresh, getDatabaseRecordCounts } from './dataInit';

// Mock localStorage for node environment
const storageMock: Record<string, string> = {};
(global as any).localStorage = {
  getItem: (key: string) => storageMock[key] || null,
  setItem: (key: string, val: string) => {
    storageMock[key] = val;
  },
  removeItem: (key: string) => {
    delete storageMock[key];
  },
  clear: () => {
    for (const k of Object.keys(storageMock)) delete storageMock[k];
  },
};

describe('Production Data & Stock Calibration Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts fresh with zero customers and zero exchange transactions', async () => {
    const customers = await customerService.getAll();
    expect(customers).toEqual([]);

    const txns = await exchangeService.getAll();
    expect(txns).toEqual([]);

    const counts = getDatabaseRecordCounts();
    expect(counts.totalRecords).toBe(0);
    expect(counts.customerCount).toBe(0);
  });

  it('initializes stock with clean default starting values', async () => {
    const stock = await stockService.getSummary();
    expect(stock.liquidCash).toBe(0);
    expect(stock.primaryBank).toBe(0);
    expect(stock.pureGoldStock.weightGm).toBe(0);
    expect(stock.totalBusinessWorth).toBe(0);
  });

  it('calibrates stock and computes net business worth correctly', async () => {
    const calibrated = await stockService.saveCalibration({
      liquidCash: 100000,
      primaryBank: 50000,
      pureGoldStock: {
        weightGm: 10,
        avgBuyRate: 75000,
        avgSellRate: 76000,
        todayBuyWeight: 2,
        todaySellWeight: 1,
      },
      marketRates: {
        gold24K: 75000,
        gold22K: 68750,
        silver1Kg: 90000,
      },
    });

    expect(calibrated.liquidCash).toBe(100000);
    expect(calibrated.primaryBank).toBe(50000);
    expect(calibrated.pureGoldStock.weightGm).toBe(10);

    // 100000 + 50000 + (10 * 75000)/10 = 150000 + 75000 = 225000
    expect(calibrated.totalBusinessWorth).toBe(225000);
  });

  it('resets all data cleanly with resetAllDataToFresh', async () => {
    // Add customer
    await customerService.create({
      name: 'Ramesh',
      mobile: '9876543210',
      category: 'Jewelry Owner',
      address: { state: 'Madhya Pradesh (23)' },
      taxDetails: {},
      balance: { gold: 1.5, cash: 5000, silver: 0 },
    });

    const countsBefore = getDatabaseRecordCounts();
    expect(countsBefore.customerCount).toBe(1);

    resetAllDataToFresh();

    const countsAfter = getDatabaseRecordCounts();
    expect(countsAfter.customerCount).toBe(0);
    expect(countsAfter.totalRecords).toBe(0);
  });

  it('updates purchase rate and sell rate in stock section for gold and silver', async () => {
    const updatedGold = await stockService.updateMetalRates('GOLD', 140000, 144500);
    expect(updatedGold.pureGoldStock.avgBuyRate).toBe(140000);
    expect(updatedGold.pureGoldStock.avgSellRate).toBe(144500);
    expect(updatedGold.marketRates.gold24K).toBe(140000);

    const updatedSilver = await stockService.updateMetalRates('SILVER', 95000, 98000);
    expect(updatedSilver.silverStock.avgRate).toBe(95000);
    expect(updatedSilver.silverStock.avgSellRate).toBe(98000);
    expect(updatedSilver.marketRates.silver1Kg).toBe(95000);
  });

  it('records transaction impact on stock inventory and cash', async () => {
    // Calibrate initial stock
    await stockService.saveCalibration({
      liquidCash: 500000,
      pureGoldStock: {
        weightGm: 100,
        avgBuyRate: 140000,
        avgSellRate: 144500,
        todayBuyWeight: 0,
        todaySellWeight: 0,
      },
      marketRates: {
        gold24K: 140000,
        gold22K: 128300,
        silver1Kg: 95000,
      },
    });

    // Record BUY transaction of 10g at 140000 (diffCash: 140000)
    const afterBuy = await stockService.recordTransactionImpact({
      metal: 'GOLD',
      type: 'BUY',
      fineWeight: 10,
      rate: 140000,
      cashAmount: 140000,
    });

    expect(afterBuy.pureGoldStock.weightGm).toBe(110);
    expect(afterBuy.pureGoldStock.todayBuyWeight).toBe(10);
    expect(afterBuy.pureGoldStock.avgBuyRate).toBe(140000);
    expect(afterBuy.liquidCash).toBe(360000);
  });
});
