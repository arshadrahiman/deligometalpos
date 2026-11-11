import { round } from './bullionMath';

export interface RefineryCalculationResult {
  meltLoss: number;
  refineLoss: number;
  serviceCharge: number;
  gstAmount: number;
  totalInvoice: number;
}

/**
 * Calculates refinery melting loss, refining loss, taxable service charges, and GST
 */
export function calculateRefineryLossAndTax(
  grossWeight: number,
  meltWeight: number,
  refineWeight: number,
  ratePerGram: number,
  gstPercent: number = 18.0
): RefineryCalculationResult {
  const meltLoss = Math.max(0, round((grossWeight || 0) - (meltWeight || 0), 3));
  const refineLoss = Math.max(0, round((meltWeight || 0) - (refineWeight || 0), 3));
  const serviceCharge = round((grossWeight || 0) * (ratePerGram || 0), 2);
  const gstAmount = round((serviceCharge * (gstPercent || 0)) / 100, 2);
  const totalInvoice = round(serviceCharge + gstAmount, 2);

  return {
    meltLoss,
    refineLoss,
    serviceCharge,
    gstAmount,
    totalInvoice,
  };
}

/**
 * Hallmark job order total calculation
 */
export function calculateHallmarkCharge(pieces: number, chargePerPiece: number): number {
  if (!pieces || !chargePerPiece || pieces <= 0 || chargePerPiece <= 0) return 0;
  return round(pieces * chargePerPiece, 2);
}

/**
 * Bullion 3% GST computation
 */
export function calculateBullionGST(
  taxableAmount: number,
  gstPercent: number = 3.0
): { gstAmount: number; totalAmount: number } {
  if (!taxableAmount || taxableAmount <= 0) {
    return { gstAmount: 0, totalAmount: 0 };
  }
  const gstAmount = round((taxableAmount * gstPercent) / 100, 2);
  const totalAmount = round(taxableAmount + gstAmount, 2);
  return { gstAmount, totalAmount };
}

