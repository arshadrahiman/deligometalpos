import { describe, it, expect } from 'vitest';
import { calculateRefineryLossAndTax, calculateHallmarkCharge, calculateBullionGST } from './taxMath';

describe('Refinery Loss and Tax (RF Cases)', () => {
  it('RF-01: 500gm refining batch with 18% GST', () => {
    const res = calculateRefineryLossAndTax(500.0, 485.0, 480.0, 20.0, 18.0);
    expect(res.meltLoss).toBe(15.0);
    expect(res.refineLoss).toBe(5.0);
    expect(res.serviceCharge).toBe(10000.0);
    expect(res.gstAmount).toBe(1800.0);
    expect(res.totalInvoice).toBe(11800.0);
  });

  it('RF-02: Zero loss, zero GST job work', () => {
    const res = calculateRefineryLossAndTax(100.0, 100.0, 100.0, 25.0, 0.0);
    expect(res.meltLoss).toBe(0.0);
    expect(res.refineLoss).toBe(0.0);
    expect(res.serviceCharge).toBe(2500.0);
    expect(res.gstAmount).toBe(0.0);
    expect(res.totalInvoice).toBe(2500.0);
  });

  it('RF-03: Decimal weight with 5% GST tier', () => {
    const res = calculateRefineryLossAndTax(250.5, 245.2, 240.0, 15.0, 5.0);
    expect(res.meltLoss).toBe(5.3);
    expect(res.refineLoss).toBe(5.2);
    expect(res.serviceCharge).toBe(3757.5);
    expect(res.gstAmount).toBe(187.88);
    expect(res.totalInvoice).toBe(3945.38);
  });

  it('RF-04: Zero gross weight edge case', () => {
    const res = calculateRefineryLossAndTax(0.0, 0.0, 0.0, 20.0, 18.0);
    expect(res.meltLoss).toBe(0.0);
    expect(res.refineLoss).toBe(0.0);
    expect(res.serviceCharge).toBe(0.0);
    expect(res.gstAmount).toBe(0.0);
    expect(res.totalInvoice).toBe(0.0);
  });

  it('RF-05: High-volume 1.2kg lot', () => {
    const res = calculateRefineryLossAndTax(1200.0, 1180.0, 1175.0, 30.0, 18.0);
    expect(res.meltLoss).toBe(20.0);
    expect(res.refineLoss).toBe(5.0);
    expect(res.serviceCharge).toBe(36000.0);
    expect(res.gstAmount).toBe(6480.0);
    expect(res.totalInvoice).toBe(42480.0);
  });
});

describe('Hallmark Charge & Bullion GST', () => {
  it('calculates hallmark piece rate accurately', () => {
    expect(calculateHallmarkCharge(25, 45.0)).toBe(1125.0);
    expect(calculateHallmarkCharge(0, 45.0)).toBe(0.0);
  });

  it('calculates bullion 3% GST accurately', () => {
    const res = calculateBullionGST(100000.0, 3.0);
    expect(res.gstAmount).toBe(3000.0);
    expect(res.totalAmount).toBe(103000.0);
  });
});
