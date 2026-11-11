import { describe, it, expect } from 'vitest';
import { calculateJewelleryOrder } from './jewelleryMath';

describe('Jewellery Manufacturing & Wastage (JW Cases)', () => {
  it('JW-01: Standard 22K (91.60%) ring order with 3% wastage', () => {
    const res = calculateJewelleryOrder(25.5, 2.5, 91.6, 3.0, 450.0);
    expect(res.netWeight).toBe(23.0);
    expect(res.fineGold).toBe(21.068);
    expect(res.wastageWeight).toBe(0.69);
    expect(res.totalPureDue).toBe(21.758);
    expect(res.labourAmount).toBe(10350.0);
  });

  it('JW-02: 18K plain band without stones or wastage', () => {
    const res = calculateJewelleryOrder(10.0, 0.0, 75.0, 0.0, 300.0);
    expect(res.netWeight).toBe(10.0);
    expect(res.fineGold).toBe(7.5);
    expect(res.wastageWeight).toBe(0.0);
    expect(res.totalPureDue).toBe(7.5);
    expect(res.labourAmount).toBe(3000.0);
  });

  it('JW-03: Zero gross weight edge case', () => {
    const res = calculateJewelleryOrder(0.0, 0.0, 91.6, 2.5, 400.0);
    expect(res.netWeight).toBe(0.0);
    expect(res.fineGold).toBe(0.0);
    expect(res.wastageWeight).toBe(0.0);
    expect(res.totalPureDue).toBe(0.0);
    expect(res.labourAmount).toBe(0.0);
  });

  it('JW-04: Heavy necklace with 4.5% wastage and higher labour rate', () => {
    const res = calculateJewelleryOrder(55.8, 5.8, 92.0, 4.5, 600.0);
    expect(res.netWeight).toBe(50.0);
    expect(res.fineGold).toBe(46.0);
    expect(res.wastageWeight).toBe(2.25);
    expect(res.totalPureDue).toBe(48.25);
    expect(res.labourAmount).toBe(30000.0);
  });

  it('JW-05: Intricate antique piece with stone deduction', () => {
    const res = calculateJewelleryOrder(100.0, 12.35, 83.5, 2.0, 500.0);
    expect(res.netWeight).toBe(87.65);
    expect(res.fineGold).toBe(73.188);
    expect(res.wastageWeight).toBe(1.753);
    expect(res.totalPureDue).toBe(74.941);
    expect(res.labourAmount).toBe(43825.0);
  });
});

