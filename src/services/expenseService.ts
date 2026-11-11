import { ExpenseIncomeRecord } from '../types';
import { getItem, setItem } from './storage';
import { SEED_EXPENSES } from './mockSeedData';

const STORAGE_KEY = 'hs_expenses';

export const expenseService = {
  async getAll(): Promise<ExpenseIncomeRecord[]> {
    let records = getItem<ExpenseIncomeRecord[]>(STORAGE_KEY, []);
    if (!records || records.length === 0) {
      records = SEED_EXPENSES;
      setItem(STORAGE_KEY, records);
    }
    return records;
  },

  async create(
    data: Omit<ExpenseIncomeRecord, 'id' | 'recordNo' | 'dateTime'>
  ): Promise<ExpenseIncomeRecord> {
    const records = await this.getAll();
    const nextNo = records.length > 0 ? Math.max(...records.map((r) => r.recordNo)) + 1 : 101;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newRecord: ExpenseIncomeRecord = {
      ...data,
      id: `EXP-${nextNo}`,
      recordNo: nextNo,
      dateTime: now,
    };

    records.unshift(newRecord);
    setItem(STORAGE_KEY, records);
    return newRecord;
  },
};
