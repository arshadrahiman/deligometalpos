import { describe, it, expect } from 'vitest';
import {
  calculateFineGold,
  calculateAfterFine,
  calculateDiffGold,
  calculateDiffAmount,
  calculateFinalCash,
  convertCashToGold,
  convertGoldToCash,
  calculateBuySellNet,
  calculateKarat,
  calculateKharMelAlloy,
} from './bullionMath';

describe('Fine Gold Calculations (FG Cases)', () => {
  it('FG-01: Standard 22K (91.60%) 10gm gold item', () => {
    expect(calculateFineGold(10.0, 91.6)).toBe(9.16);
  });

  it('FG-02: Bullion bar 99.90% 100gm', () => {
    expect(calculateFineGold(100.0, 99.9)).toBe(99.9);
  });

  it('FG-03: Zero weight edge case', () => {
    expect(calculateFineGold(0.0, 75.0)).toBe(0);
  });

  it('FG-04: Decimal milligram weight & odd purity', () => {
    expect(calculateFineGold(14.523, 83.5)).toBe(12.127);
  });

  it('FG-05: Large wholesale batch (1250.750gm, 92.45%)', () => {
    expect(calculateFineGold(1250.75, 92.45)).toBe(1156.318);
  });

  it('FG-06: Zero touch edge case', () => {
    expect(calculateFineGold(5.0, 0.0)).toBe(0);
  });
});

describe('Gold Allowance & Net Gold Difference (GA Cases)', () => {
  it('GA-01: Exact 1:1 settlement', () => {
    const afterFine = calculateAfterFine(9.16, 0.0);
    expect(afterFine).toBe(9.16);
    expect(calculateDiffGold(afterFine, 9.16)).toBe(0);
  });

  it('GA-02: Positive allowance, excess gold due', () => {
    const afterFine = calculateAfterFine(9.16, 0.5);
    expect(afterFine).toBe(9.66);
    expect(calculateDiffGold(afterFine, 9.0)).toBe(0.66);
  });

  it('GA-03: Negative allowance (deduction), shop owes gold', () => {
    const afterFine = calculateAfterFine(15.0, -0.2);
    expect(afterFine).toBe(14.8);
    expect(calculateDiffGold(afterFine, 16.0)).toBe(-1.2);
  });

  it('GA-04: All zeros edge case', () => {
    expect(calculateAfterFine(0, 0)).toBe(0);
    expect(calculateDiffGold(0, 0)).toBe(0);
  });

  it('GA-05: No gold given physically', () => {
    const afterFine = calculateAfterFine(50.25, 1.0);
    expect(afterFine).toBe(51.25);
    expect(calculateDiffGold(afterFine, 0)).toBe(51.25);
  });
});

describe('Gold Difference Monetary Valuation (DA Cases)', () => {
  it('DA-01: Standard 10gm unit calculation at ₹75,000/10gm', () => {
    expect(calculateDiffAmount(10.0, 75000)).toBe(75000.0);
  });

  it('DA-02: Single gram rate conversion at ₹78,500/10gm', () => {
    expect(calculateDiffAmount(1.0, 78500)).toBe(7850.0);
  });

  it('DA-03: Negative gold balance conversion (-2.500gm at ₹80,000/10gm)', () => {
    expect(calculateDiffAmount(-2.5, 80000)).toBe(-20000.0);
  });

  it('DA-04: Zero balance edge case', () => {
    expect(calculateDiffAmount(0.0, 75000)).toBe(0.0);
  });

  it('DA-05: Irregular decimal milligram weight (14.325gm at ₹82,450/10gm)', () => {
    expect(calculateDiffAmount(14.325, 82450)).toBe(118109.63);
  });
});

describe('Final Cash Settlement (FC Cases)', () => {
  it('FC-01: Standard positive settlement with fee', () => {
    expect(calculateFinalCash(75000.0, 500.0)).toBe(75500.0);
  });

  it('FC-02: Negative settlement with fee adjustment', () => {
    expect(calculateFinalCash(-20000.0, 300.0)).toBe(-19700.0);
  });

  it('FC-03: Zero gold difference, fee only', () => {
    expect(calculateFinalCash(0.0, 250.0)).toBe(250.0);
  });

  it('FC-04: Zero charges edge case', () => {
    expect(calculateFinalCash(150000.0, 0.0)).toBe(150000.0);
  });

  it('FC-05: Decimal cents precision', () => {
    expect(calculateFinalCash(118109.63, 1500.5)).toBe(119610.13);
  });
});

describe('Bhavcut Converter: Cash to Gold (BG Cases)', () => {
  it('BG-01: Exact 10 gram equivalent at ₹75,000/10gm', () => {
    expect(convertCashToGold(75000.0, 75000.0)).toBe(10.0);
  });

  it('BG-02: Clean division (₹1,00,000 at ₹80,000/10gm)', () => {
    expect(convertCashToGold(100000.0, 80000.0)).toBe(12.5);
  });

  it('BG-03: Repeating decimal rounded to 3 digits (₹50,000 at ₹78,450/10gm)', () => {
    expect(convertCashToGold(50000.0, 78450.0)).toBe(6.373);
  });

  it('BG-04: Zero cash edge case', () => {
    expect(convertCashToGold(0.0, 75000.0)).toBe(0.0);
  });

  it('BG-05: Wholesale transaction (₹50,00,000 at ₹85,000/10gm)', () => {
    expect(convertCashToGold(5000000.0, 85000.0)).toBe(588.235);
  });
});

describe('Bhavcut Converter: Gold to Cash (BC Cases)', () => {
  it('BC-01: Standard 10gm reverse test', () => {
    expect(convertGoldToCash(10.0, 75000.0)).toBe(75000.0);
  });

  it('BC-02: Clean division reverse (12.5gm at ₹80,000/10gm)', () => {
    expect(convertGoldToCash(12.5, 80000.0)).toBe(100000.0);
  });

  it('BC-03: Roundtrip precision check (6.373gm at ₹78,450/10gm)', () => {
    expect(convertGoldToCash(6.373, 78450.0)).toBe(49996.19);
  });

  it('BC-04: Zero gold reverse', () => {
    expect(convertGoldToCash(0.0, 75000.0)).toBe(0.0);
  });
});

describe('Buy-Sell Net Cash (BS Cases)', () => {
  it('BS-01: Bulk 100gm purchase with discount', () => {
    const { grossCash, netCash } = calculateBuySellNet(100.0, 75000.0, 500.0);
    expect(grossCash).toBe(750000.0);
    expect(netCash).toBe(749500.0);
  });

  it('BS-02: Zero discount', () => {
    const { grossCash, netCash } = calculateBuySellNet(25.0, 80000.0, 0.0);
    expect(grossCash).toBe(200000.0);
    expect(netCash).toBe(200000.0);
  });

  it('BS-03: Zero weight edge case', () => {
    const { grossCash, netCash } = calculateBuySellNet(0.0, 75000.0, 0.0);
    expect(grossCash).toBe(0.0);
    expect(netCash).toBe(0.0);
  });

  it('BS-04: Small retail sale with ₹100 discount', () => {
    const { grossCash, netCash } = calculateBuySellNet(1.5, 76000.0, 100.0);
    expect(grossCash).toBe(11400.0);
    expect(netCash).toBe(11300.0);
  });
});

describe('Karat Conversion (KT Cases)', () => {
  it('KT-01: 91.60% touch -> 21.98 Karat', () => {
    expect(calculateKarat(91.6)).toBe(21.98);
  });

  it('KT-02: 75.00% touch -> 18.00 Karat', () => {
    expect(calculateKarat(75.0)).toBe(18.0);
  });

  it('KT-03: 58.50% touch -> 14.04 Karat', () => {
    expect(calculateKarat(58.5)).toBe(14.04);
  });

  it('KT-04: 99.90% touch -> 23.98 Karat', () => {
    expect(calculateKarat(99.9)).toBe(23.98);
  });
});

describe('Khar / Mel Metallurgical Alloy (KM Cases)', () => {
  it('KM-01: Diluting 100gm 99.9% gold to 91.6% by adding copper (0% purity)', () => {
    expect(calculateKharMelAlloy(100.0, 99.9, 91.6, 0.0)).toBe(9.061);
  });

  it('KM-02: Raising 100gm 85.0% gold to 91.6% by adding pure gold (100% purity)', () => {
    expect(calculateKharMelAlloy(100.0, 85.0, 91.6, 100.0)).toBe(78.571);
  });

  it('KM-03: Already at target purity', () => {
    expect(calculateKharMelAlloy(50.0, 91.6, 91.6, 0.0)).toBe(0.0);
  });

  it('KM-04: Zero current weight', () => {
    expect(calculateKharMelAlloy(0.0, 99.9, 91.6, 0.0)).toBe(0.0);
  });

  it('KM-05: Diluting 250gm 95.0% to 75.0% by adding copper (0% purity)', () => {
    expect(calculateKharMelAlloy(250.0, 95.0, 75.0, 0.0)).toBe(66.667);
  });
});
