import { describe, it, expect } from 'vitest';
import { calculateRunningBalance, calculateLedgerAggregation } from './loanMath';

describe('Loan Ledger Running Balance (LB Cases)', () => {
  it('LB-01: Adding credit to positive gold balance', () => {
    expect(calculateRunningBalance(10.0, 5.0, true, 3)).toBe(15.0);
  });

  it('LB-02: Crossing from positive to negative gold debt', () => {
    expect(calculateRunningBalance(10.0, 15.0, false, 3)).toBe(-5.0);
  });

  it('LB-03: Partial repayment of cash debt', () => {
    expect(calculateRunningBalance(-50000.0, 30000.0, true, 2)).toBe(-20000.0);
  });

  it('LB-04: New loan from zero cash balance', () => {
    expect(calculateRunningBalance(0.0, 25000.0, false, 2)).toBe(-25000.0);
  });

  it('LB-05: Exact clearance of balance', () => {
    expect(calculateRunningBalance(10000.0, 10000.0, false, 2)).toBe(0.0);
  });
});

describe('Ledger Aggregation', () => {
  it('aggregates multiple credit/debit rows accurately', () => {
    const entries = [
      { goldIn: 10.0, goldOut: 0.0, cashIn: 50000.0, cashOut: 0.0 },
      { goldIn: 0.0, goldOut: 3.5, cashIn: 0.0, cashOut: 20000.0 },
      { goldIn: 2.25, goldOut: 0.0, cashIn: 15000.0, cashOut: 5000.0 },
    ];
    const res = calculateLedgerAggregation(entries);
    expect(res.totalGoldIn).toBe(12.25);
    expect(res.totalGoldOut).toBe(3.5);
    expect(res.netGoldBalance).toBe(8.75);
    expect(res.totalCashIn).toBe(65000.0);
    expect(res.totalCashOut).toBe(25000.0);
    expect(res.netCashBalance).toBe(40000.0);
  });
});

