import { ExchangeTransaction } from '../types';
import { getItem, setItem } from './storage';
import { SEED_EXCHANGE_TXNS } from './mockSeedData';
import { customerService } from './customerService';

const STORAGE_KEY = 'hs_exchange_txns';

export const exchangeService = {
  async getAll(): Promise<ExchangeTransaction[]> {
    let txns = getItem<ExchangeTransaction[]>(STORAGE_KEY, []);
    if (!txns || txns.length === 0) {
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
    // diffGold: positive means customer owes gold, so subtract from customer's credit / add to debt
    // finalCash: positive means customer owes cash
    if (data.customerId) {
      await customerService.updateBalance(
        data.customerId,
        data.type === 'BUY' ? data.diffGold : -data.diffGold,
        data.type === 'BUY' ? data.finalCash : -data.finalCash
      );
    }

    return newTxn;
  },
};
