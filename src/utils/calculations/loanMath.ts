import { round } from './bullionMath';

/**
 * Updates running balance for double-entry bullion/currency ledger
 * Jama = In / Credit (+), Udhar = Out / Debit (-)
 */
export function calculateRunningBalance(
  oldBalance: number,
  transactionAmount: number,
  isJama: boolean,
  decimals: number = 2
): number {
  const multiplier = isJama ? 1 : -1;
  const delta = (transactionAmount || 0) * multiplier;
  return round((oldBalance || 0) + delta, decimals);
}

/**
 * Aggregates ledger entries to calculate total credits, total debits, and net balance
 */
export function calculateLedgerAggregation(
  entries: Array<{
    goldIn: number;
    goldOut: number;
    cashIn: number;
    cashOut: number;
  }>
): {
  totalGoldIn: number;
  totalGoldOut: number;
  netGoldBalance: number;
  totalCashIn: number;
  totalCashOut: number;
  netCashBalance: number;
} {
  let totalGoldIn = 0;
  let totalGoldOut = 0;
  let totalCashIn = 0;
  let totalCashOut = 0;

  for (const entry of entries) {
    totalGoldIn += entry.goldIn || 0;
    totalGoldOut += entry.goldOut || 0;
    totalCashIn += entry.cashIn || 0;
    totalCashOut += entry.cashOut || 0;
  }

  totalGoldIn = round(totalGoldIn, 3);
  totalGoldOut = round(totalGoldOut, 3);
  const netGoldBalance = round(totalGoldIn - totalGoldOut, 3);

  totalCashIn = round(totalCashIn, 2);
  totalCashOut = round(totalCashOut, 2);
  const netCashBalance = round(totalCashIn - totalCashOut, 2);

  return {
    totalGoldIn,
    totalGoldOut,
    netGoldBalance,
    totalCashIn,
    totalCashOut,
    netCashBalance,
  };
}
