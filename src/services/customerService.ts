import { Customer } from '../types';
import { getItem, setItem } from './storage';
import { SEED_CUSTOMERS } from './mockSeedData';

const STORAGE_KEY = 'hs_customers';

export const customerService = {
  async getAll(): Promise<Customer[]> {
    let customers = getItem<Customer[]>(STORAGE_KEY, []);
    if (!customers || customers.length === 0) {
      customers = SEED_CUSTOMERS;
      setItem(STORAGE_KEY, customers);
    }
    return customers;
  },

  async getById(id: string): Promise<Customer | null> {
    const customers = await this.getAll();
    return customers.find((c) => c.id === id) || null;
  },

  async create(data: Omit<Customer, 'id' | 'customerNo' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
    const customers = await this.getAll();
    const nextNo = customers.length > 0 ? Math.max(...customers.map((c) => c.customerNo)) + 1 : 101;
    const now = new Date().toISOString();
    const newCustomer: Customer = {
      ...data,
      id: `CUST-${nextNo}`,
      customerNo: nextNo,
      createdAt: now,
      updatedAt: now,
    };
    customers.push(newCustomer);
    setItem(STORAGE_KEY, customers);
    return newCustomer;
  },

  async update(id: string, updates: Partial<Customer>): Promise<Customer | null> {
    const customers = await this.getAll();
    const index = customers.findIndex((c) => c.id === id);
    if (index === -1) return null;
    const updated = {
      ...customers[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    customers[index] = updated;
    setItem(STORAGE_KEY, customers);
    return updated;
  },

  async updateBalance(
    customerId: string,
    goldDelta: number,
    cashDelta: number
  ): Promise<Customer | null> {
    const customer = await this.getById(customerId);
    if (!customer) return null;
    const newGold = Math.round((customer.balance.gold + goldDelta) * 1000) / 1000;
    const newCash = Math.round((customer.balance.cash + cashDelta) * 100) / 100;
    return this.update(customerId, {
      balance: {
        ...customer.balance,
        gold: newGold,
        cash: newCash,
      },
    });
  },

  async delete(id: string): Promise<boolean> {
    const customers = await this.getAll();
    const filtered = customers.filter((c) => c.id !== id);
    setItem(STORAGE_KEY, filtered);
    return true;
  },
};
