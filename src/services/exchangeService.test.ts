import { describe, it, expect, beforeEach } from 'vitest';
import { exchangeService } from './exchangeService';
import { customerService } from './customerService';

const storageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: storageMock,
});

describe('Exchange Service & POS Calculation Engine', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('correctly creates an Exchange BUY transaction and synchronizes customer udhari balances', async () => {
    // 1. Create a customer with initial balance
    const cust = await customerService.create({
      name: 'Ramesh Jewellers',
      mobile: '9876543210',
      category: 'Jewelry Owner',
      address: { city: 'Bhopal', state: 'Madhya Pradesh' },
      taxDetails: {},
      balance: { gold: 10.0, cash: 25000, silver: 0 },
    });

    // 2. Perform Exchange POS calculation based on reference slip
    // Weight = 100.000 gm, Less Weight = 0.000, Touch = 91.60%, Extra = 0
    // Fine = 91.600 gm, Given Gold = 90.000 gm, Diff Gold = 1.600 gm
    // Pur Rate = 80,000 Rs/10gm -> Diff Amount = 12,800 Rs
    // Charges = 300 Rs -> Final Cash = 12,500 Rs
    const txn = await exchangeService.createTransaction({
      type: 'BUY',
      customerId: cust.id,
      customerName: cust.name,
      customerNo: cust.customerNo,
      weight: 100.0,
      touch: 91.6,
      sample: 'lagdi',
      fineGold: 91.6,
      extraGold: 0.0,
      afterFine: 91.6,
      settledGold: 90.0,
      diffGold: 1.6,
      rate: 80000,
      diffAmount: 12800,
      charges: 300,
      finalCash: 12500,
      settlement: { physicalCash: 12500, onlineRtgs: 0, selfBank2: 0 },
      udhariBefore: { gold: 10.0, cash: 25000, silver: 0, silverCash: 0 },
      udhariAfter: { gold: 11.6, cash: 25000, silver: 0, silverCash: 0 },
      udhariDetails: {
        kchJamaGold: 1.6,
        kchJamaCash: 0,
        kchUdharGold: 0,
        kchUdharCash: 0,
        jamaGold: 0,
        jamaCash: 0,
        udharGold: 0,
        udharCash: 0,
      },
      narration: 'Exchange POS Test',
    });

    expect(txn.transactionNo).toBeDefined();
    expect(txn.id).toContain('EX-');
    expect(txn.finalCash).toBe(12500);

    // 3. Verify customer balance was updated to exact udhariAfter values
    const updatedCust = await customerService.getById(cust.id);
    expect(updatedCust).not.toBeNull();
    expect(updatedCust?.balance.gold).toBe(11.6);
    expect(updatedCust?.balance.cash).toBe(25000);
  });

  it('correctly calculates silver exchange transaction with ₹/kg valuation', async () => {
    const cust = await customerService.create({
      name: 'Silver Merchant',
      mobile: '9123456789',
      category: 'Whole Seller',
      address: { city: 'Indore', state: 'Madhya Pradesh' },
      taxDetails: {},
      balance: { gold: 0, cash: 0, silver: 500 },
    });

    // 1000 gm silver bar, 99.99% touch, rate 95,000 ₹/kg
    // diffGold = 100 gm -> diffAmount = (100 * 95000) / 1000 = 9500 ₹
    const txn = await exchangeService.createTransaction({
      type: 'SELL',
      customerId: cust.id,
      customerName: cust.name,
      customerNo: cust.customerNo,
      weight: 1000.0,
      touch: 99.99,
      sample: 'Chandi Sil',
      fineGold: 999.9,
      extraGold: 0.0,
      afterFine: 999.9,
      settledGold: 899.9,
      diffGold: 100.0,
      rate: 95000,
      diffAmount: 9500,
      charges: 50,
      finalCash: 9450,
      settlement: { physicalCash: 9450, onlineRtgs: 0, selfBank2: 0 },
      udhariBefore: { gold: 0, cash: 0, silver: 500, silverCash: 0 },
      udhariAfter: { gold: 0, cash: 9450, silver: 400, silverCash: 0 },
      udhariDetails: {
        kchJamaGold: 0,
        kchJamaCash: 0,
        kchUdharGold: 100,
        kchUdharCash: 0,
        jamaGold: 0,
        jamaCash: 0,
        udharGold: 0,
        udharCash: 0,
      },
    });

    expect(txn.finalCash).toBe(9450);
    const updatedCust = await customerService.getById(cust.id);
    expect(updatedCust?.balance.silver).toBe(400);
    expect(updatedCust?.balance.cash).toBe(9450);
  });
});
