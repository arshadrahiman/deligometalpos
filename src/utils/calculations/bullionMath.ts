/**
 * Precision Bullion Mathematical Engine
 * Strict 3-decimal precision for physical weights (milligram standard)
 * Strict 2-decimal precision for currency amounts
 */

export function round(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/**
 * Calculates pure fine gold from gross weight and touch (purity percentage)
 * Formula: (weight * touch) / 100
 */
export function calculateFineGold(weight: number, touch: number): number {
  if (!weight || !touch || weight < 0 || touch < 0) return 0;
  return round((weight * touch) / 100, 3);
}

/**
 * Calculates gold after adding/subtracting allowance (+G / -G)
 * Formula: fineGold + extraGold
 */
export function calculateAfterFine(fineGold: number, extraGold: number = 0): number {
  return round((fineGold || 0) + (extraGold || 0), 3);
}

/**
 * Calculates unsettled gold difference
 * Formula: afterFine - givenGold
 */
export function calculateDiffGold(afterFine: number, givenGold: number = 0): number {
  return round((afterFine || 0) - (givenGold || 0), 3);
}

/**
 * Converts gold difference to monetary value at market rate quoted per 10 grams
 * Formula: (diffGold * ratePer10Gm) / 10
 */
export function calculateDiffAmount(diffGold: number, ratePer10Gm: number): number {
  if (!diffGold || !ratePer10Gm) return 0;
  return round((diffGold * ratePer10Gm) / 10, 2);
}

/**
 * Calculates final payable/receivable cash including labor/handling charges
 * Formula: diffAmount + charges
 */
export function calculateFinalCash(diffAmount: number, charges: number = 0): number {
  return round((diffAmount || 0) + (charges || 0), 2);
}

/**
 * Bhavcut Converter: Cash to Pure Gold
 * Formula: (amount * 10) / ratePer10Gm
 */
export function convertCashToGold(cashAmount: number, ratePer10Gm: number): number {
  if (!cashAmount || !ratePer10Gm || ratePer10Gm <= 0) return 0;
  return round((cashAmount * 10) / ratePer10Gm, 3);
}

/**
 * Bhavcut Converter: Pure Gold to Cash
 * Formula: (goldWeight * ratePer10Gm) / 10
 */
export function convertGoldToCash(goldWeight: number, ratePer10Gm: number): number {
  if (!goldWeight || !ratePer10Gm || ratePer10Gm <= 0) return 0;
  return round((goldWeight * ratePer10Gm) / 10, 2);
}

/**
 * Calculates gross and net valuation for direct bullion buy/sell
 */
export function calculateBuySellNet(
  weight: number,
  ratePer10Gm: number,
  discount: number = 0
): { grossCash: number; netCash: number } {
  if (!weight || !ratePer10Gm || weight <= 0 || ratePer10Gm <= 0) {
    return { grossCash: 0, netCash: 0 };
  }
  const grossCash = round((weight * ratePer10Gm) / 10, 2);
  const netCash = Math.max(0, round(grossCash - (discount || 0), 2));
  return { grossCash, netCash };
}

/**
 * Converts Touch Purity (%) to Karat (K)
 * Formula: (touch * 24) / 100
 */
export function calculateKarat(touch: number): number {
  if (!touch || touch <= 0) return 0;
  return round((touch * 24) / 100, 2);
}

/**
 * Metallurgical Alloy Calculator (Khar / Mel)
 * Calculates required alloy/metal weight to achieve target purity
 * Formula: (currentWeight * |currentPurity - targetPurity|) / |targetPurity - alloyPurity|
 */
export function calculateKharMelAlloy(
  currentWeight: number,
  currentPurity: number,
  targetPurity: number,
  alloyPurity: number = 0
): number {
  if (!currentWeight || currentWeight <= 0 || currentPurity === targetPurity) {
    return 0;
  }
  const purityDelta = Math.abs(currentPurity - targetPurity);
  const alloyDelta = Math.abs(targetPurity - alloyPurity);
  if (alloyDelta === 0) return 0;
  return round((currentWeight * purityDelta) / alloyDelta, 3);
}
