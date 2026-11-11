import { round } from './bullionMath';

export interface JewelleryCalculationResult {
  netWeight: number;
  fineGold: number;
  wastageWeight: number;
  totalPureDue: number;
  labourAmount: number;
}

/**
 * Calculates net weight, fine requirement, wastage allowance, and labour cost for jewellery manufacturing
 */
export function calculateJewelleryOrder(
  grossWeight: number,
  lessWeight: number = 0,
  purityPercent: number,
  wastagePercent: number = 0,
  labourRatePerGram: number = 0
): JewelleryCalculationResult {
  const netWeight = Math.max(0, round((grossWeight || 0) - (lessWeight || 0), 3));
  const fineGold = round((netWeight * (purityPercent || 0)) / 100, 3);
  const wastageWeight = round((netWeight * (wastagePercent || 0)) / 100, 3);
  const totalPureDue = round(fineGold + wastageWeight, 3);
  const labourAmount = round(netWeight * (labourRatePerGram || 0), 2);

  return {
    netWeight,
    fineGold,
    wastageWeight,
    totalPureDue,
    labourAmount,
  };
}

