import { getItem, setItem } from './storage';
import {
  SEED_CUSTOMERS,
  SEED_EXCHANGE_TXNS,
  SEED_BUYSELL_TXNS,
  SEED_LOAN_ENTRIES,
  SEED_EXPENSES,
  SEED_STOCK_SUMMARY,
} from './mockSeedData';
import { DEFAULT_INITIAL_STOCK } from './stockService';

const CLEAN_INIT_FLAG = 'hs_fresh_prod_account_v1';

/**
 * Initializes clean storage on first load of the production release.
 * If legacy seed records were cached previously, they are safely cleared.
 */
export function initializeFreshProductionStorage(): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    const isClean = localStorage.getItem(CLEAN_INIT_FLAG);
    if (!isClean) {
      // Purge old mock/seed data from previous demo sessions so user gets a clean production state
      localStorage.removeItem('hs_customers');
      localStorage.removeItem('hs_exchange_txns');
      localStorage.removeItem('hs_buysell_txns');
      localStorage.removeItem('hs_loan_entries');
      localStorage.removeItem('hs_expenses');
      localStorage.removeItem('hs_stock_summary');
      localStorage.setItem(CLEAN_INIT_FLAG, 'true');
    }
  } catch (e) {
    console.warn('Storage init warning:', e);
  }
}

/**
 * Completely resets customer and transaction records to zero for a fresh account.
 */
export function resetAllDataToFresh(): void {
  try {
    setItem('hs_customers', []);
    setItem('hs_exchange_txns', []);
    setItem('hs_buysell_txns', []);
    setItem('hs_loan_entries', []);
    setItem('hs_expenses', []);
    setItem('hs_stock_summary', DEFAULT_INITIAL_STOCK);
    localStorage.setItem(CLEAN_INIT_FLAG, 'true');
  } catch (e) {
    console.error('Failed to reset data:', e);
  }
}

/**
 * Populates sample testing data if the user explicitly wants to test features.
 */
export function loadSampleDemoData(): void {
  try {
    setItem('hs_customers', SEED_CUSTOMERS);
    setItem('hs_exchange_txns', SEED_EXCHANGE_TXNS);
    setItem('hs_buysell_txns', SEED_BUYSELL_TXNS);
    setItem('hs_loan_entries', SEED_LOAN_ENTRIES);
    setItem('hs_expenses', SEED_EXPENSES);
    setItem('hs_stock_summary', SEED_STOCK_SUMMARY);
    localStorage.setItem(CLEAN_INIT_FLAG, 'true');
  } catch (e) {
    console.error('Failed to load demo data:', e);
  }
}

/**
 * Returns current counts of stored records.
 */
export function getDatabaseRecordCounts() {
  const customers = getItem<any[]>('hs_customers', []);
  const exchangeTxns = getItem<any[]>('hs_exchange_txns', []);
  const buySellTxns = getItem<any[]>('hs_buysell_txns', []);
  const loanEntries = getItem<any[]>('hs_loan_entries', []);
  const expenses = getItem<any[]>('hs_expenses', []);

  return {
    customerCount: Array.isArray(customers) ? customers.length : 0,
    exchangeCount: Array.isArray(exchangeTxns) ? exchangeTxns.length : 0,
    buySellCount: Array.isArray(buySellTxns) ? buySellTxns.length : 0,
    loanCount: Array.isArray(loanEntries) ? loanEntries.length : 0,
    expenseCount: Array.isArray(expenses) ? expenses.length : 0,
    totalRecords:
      (Array.isArray(customers) ? customers.length : 0) +
      (Array.isArray(exchangeTxns) ? exchangeTxns.length : 0) +
      (Array.isArray(buySellTxns) ? buySellTxns.length : 0) +
      (Array.isArray(loanEntries) ? loanEntries.length : 0) +
      (Array.isArray(expenses) ? expenses.length : 0),
  };
}
