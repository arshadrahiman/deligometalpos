import { BuySellTransaction } from '../types';
import { getItem, setItem } from './storage';

const STORAGE_KEY = 'hs_buysell_txns';

export const buySellService = {
  async getAll(): Promise<BuySellTransaction[]> {
    return getItem<BuySellTransaction[]>(STORAGE_KEY, []);
  },

  async createTransaction(
    data: Omit<BuySellTransaction, 'id' | 'transactionNo' | 'dateTime'>
  ): Promise<BuySellTransaction> {
    const txns = await this.getAll();
    const nextNo = txns.length > 0 ? Math.max(...txns.map((t) => t.transactionNo)) + 1 : 101;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newTxn: BuySellTransaction = {
      ...data,
      id: `BS-${new Date().getFullYear()}-${nextNo}`,
      transactionNo: nextNo,
      dateTime: now,
    };

    txns.unshift(newTxn);
    setItem(STORAGE_KEY, txns);
    return newTxn;
  },
};

