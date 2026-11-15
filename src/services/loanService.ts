import { LoanEntry } from '../types';
import { getItem, setItem } from './storage';
import { customerService } from './customerService';

const STORAGE_KEY = 'hs_loan_entries';

export const loanService = {
  async getAll(): Promise<LoanEntry[]> {
    return getItem<LoanEntry[]>(STORAGE_KEY, []);
  },

  async getByCustomerId(customerId: string): Promise<LoanEntry[]> {
    const entries = await this.getAll();
    return entries.filter((e) => e.customerId === customerId);
  },

  async createEntry(
    data: Omit<LoanEntry, 'id' | 'transactionNo' | 'dateTime'>
  ): Promise<LoanEntry> {
    const entries = await this.getAll();
    const nextNo = entries.length > 0 ? Math.max(...entries.map((e) => e.transactionNo)) + 1 : 101;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newEntry: LoanEntry = {
      ...data,
      id: `LN-${new Date().getFullYear()}-${nextNo}`,
      transactionNo: nextNo,
      dateTime: now,
    };

    entries.unshift(newEntry);
    setItem(STORAGE_KEY, entries);

    // Update customer balance directly
    const goldDelta = data.gold.type === 'JAMA' ? data.gold.transactionWeight : -data.gold.transactionWeight;
    const totalCashPaid = (data.cash.transactionAmount || 0) + (data.cash.onlineAmount || 0) + (data.cash.bank2Amount || 0);
    const cashDelta = data.cash.type === 'JAMA' ? totalCashPaid : -totalCashPaid;

    if (data.customerId) {
      await customerService.updateBalance(data.customerId, goldDelta, cashDelta);
    }

    return newEntry;
  },

  async create(
    data: Omit<LoanEntry, 'id' | 'transactionNo' | 'dateTime'>
  ): Promise<LoanEntry> {
    return this.createEntry(data);
  },
};

