import { ExchangeTransaction } from '../types';
import { getItem, setItem } from './storage';
import { SEED_EXCHANGE_TXNS } from './mockSeedData';
import { customerService } from './customerService';

const STORAGE_KEY = 'hs_exchange_txns';

export const exchangeService = {
  async getAll(): Promise<ExchangeTransaction[]> {
    let txns = getItem<ExchangeTransaction[]>(STORAGE_KEY, []);
    if (!txns || txns.length === 0 || !txns.some((t) => t.transactionNo === 100)) {
      txns = SEED_EXCHANGE_TXNS;
      setItem(STORAGE_KEY, txns);
    }
    return txns;
  },

  async createTransaction(
    data: Omit<ExchangeTransaction, 'id' | 'transactionNo' | 'dateTime'>
  ): Promise<ExchangeTransaction> {
    const txns = await this.getAll();
    const nextNo = txns.length > 0 ? Math.max(...txns.map((t) => t.transactionNo)) + 1 : 101;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newTxn: ExchangeTransaction = {
      ...data,
      id: `EX-${new Date().getFullYear()}-${nextNo}`,
      transactionNo: nextNo,
      dateTime: now,
    };

    txns.unshift(newTxn);
    setItem(STORAGE_KEY, txns);

    // Automatically update customer udhari balance
    if (data.customerId) {
      if (data.udhariAfter) {
        await customerService.setExactBalance(
          data.customerId,
          data.udhariAfter.gold,
          data.udhariAfter.cash,
          data.udhariAfter.silver
        );
      } else {
        await customerService.updateBalance(
          data.customerId,
          data.type === 'BUY' ? data.diffGold : -data.diffGold,
          data.type === 'BUY' ? data.finalCash : -data.finalCash
        );
      }
    }

    return newTxn;
  },
};

