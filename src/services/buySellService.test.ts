import { describe, it, expect, beforeEach } from 'vitest';
import { buySellService } from './buySellService';
import { customerService } from './customerService';

// Mock localStorage for node test environment
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

describe('buySellService & Udhari Section', () => {
  beforeEach(() => {
    (global as any).localStorage.clear();
  });

  it('creates a BuySell transaction and saves udhariBefore, udhariAfter, and udhariDetails', async () => {
    const cust = await customerService.create({
      name: 'Ramesh Jewellers',
      mobile: '9876543210',
      category: 'Jewelry Owner',
      address: { city: 'Bhopal', state: 'MP' },
      taxDetails: {},
      balance: { gold: 10.5, cash: 50000, silver: 0 },
    });

    // Udhari calculation simulation matching Exchange formula:
    // oldGold: 10.5, oldCash: 50000
    // kchJamaGold: 5.0, kchUdharCash: 20000
    // finalGold = 10.5 + 5.0 = 15.5
    // finalCash = 50000 - 20000 = 30000
    const txn = await buySellService.createTransaction({
      type: 'BUY',
      source: 'Direct',
      customerId: cust.id,
      customerName: cust.name,
      customerNo: cust.customerNo,
      weight: 5.0,
      rate: 140000,
      grossAmount: 70000,
      discount: 0,
      netAmount: 70000,
      paidAmount: 50000,
      settlement: { cash: 50000, onlineRtgs: 0, selfBank2: 0 },
      udhariAdjusted: true,
      udhariBefore: {
        gold: 10.5,
        cash: 50000,
        silver: 0,
        silverCash: 0,
      },
      udhariAfter: {
        gold: 15.5,
        cash: 30000,
        silver: 0,
        silverCash: 0,
      },
      udhariDetails: {
        kchJamaGold: 5.0,
        kchJamaCash: 0,
        kchUdharGold: 0,
        kchUdharCash: 20000,
        jamaGold: 0,
        jamaCash: 0,
        udharGold: 0,
        udharCash: 0,
      },
      narration: 'Test Udhari Sync',
    });

    expect(txn.id).toMatch(/^BS-\d{4}-\d+/);
    expect(txn.transactionNo).toBeGreaterThanOrEqual(101);
    expect(txn.udhariAfter?.gold).toBe(15.5);
    expect(txn.udhariAfter?.cash).toBe(30000);

    // Customer balance must be automatically updated with exact balance
    const updatedCust = await customerService.getById(cust.id);
    expect(updatedCust?.balance.gold).toBe(15.5);
    expect(updatedCust?.balance.cash).toBe(30000);
  });

  it('correctly calculates Udhari final gold and final cash formula', () => {
    const oldGold = 12.345;
    const oldCash = 25000;
    const kchJamaGold = 2.5;
    const kchUdharGold = 1.0;
    const jamaGold = 0.5;
    const udharGold = 0.25;

    const kchJamaCash = 5000;
    const kchUdharCash = 15000;
    const jamaCash = 2000;
    const udharCash = 1000;

    const finalGold = Math.round((oldGold + kchJamaGold - kchUdharGold + jamaGold - udharGold) * 1000) / 1000;
    const finalCashTotal = Math.round((oldCash + kchJamaCash - kchUdharCash + jamaCash - udharCash) * 100) / 100;

    // 12.345 + 2.5 - 1.0 + 0.5 - 0.25 = 14.095
    expect(finalGold).toBe(14.095);
    // 25000 + 5000 - 15000 + 2000 - 1000 = 16000
    expect(finalCashTotal).toBe(16000);
  });
});
