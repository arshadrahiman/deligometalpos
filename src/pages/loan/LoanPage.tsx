import React, { useState, useEffect } from 'react';
import { Customer, LoanEntry } from '../../types';
import { loanService } from '../../services/loanService';
import { useUIStore } from '../../store/useUIStore';
import { calculateRunningBalance } from '../../utils/calculations/loanMath';
import { CustomerSelect } from '../../components/shared/CustomerSelect';
import { DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/common/Badge';
import { ColumnDef } from '@tanstack/react-table';
import {
  BookOpen,
  PlusCircle,
  List,
  Save,
  Layers,
  Scale,
  IndianRupee,
} from 'lucide-react';

export const LoanPage: React.FC = () => {
  const { showToast } = useUIStore();

  const [activeTab, setActiveTab] = useState<'FORM' | 'LIST'>('FORM');
  const [entries, setEntries] = useState<LoanEntry[]>([]);

  // Form
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Gold credit/debit
  const [goldType, setGoldType] = useState<'JAMA' | 'UDHAR'>('UDHAR');
  const [goldWeight, setGoldWeight] = useState<number>(0.0);

  // Cash credit/debit
  const [cashType, setCashType] = useState<'JAMA' | 'UDHAR'>('UDHAR');
  const [cashAmount, setCashAmount] = useState<number>(0.0);
  const [onlineAmount, setOnlineAmount] = useState<number>(0.0);
  const [bank2Amount, setBank2Amount] = useState<number>(0.0);

  const [narration, setNarration] = useState<string>('');

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    const list = await loanService.getAll();
    setEntries(list);
  };

  const oldGold = selectedCustomer?.balance.gold || 0;
  const oldCash = selectedCustomer?.balance.cash || 0;

  const finalGold = calculateRunningBalance(oldGold, goldWeight, goldType === 'JAMA', 3);
  const totalCashTrans = (cashAmount || 0) + (onlineAmount || 0) + (bank2Amount || 0);
  const finalCash = calculateRunningBalance(oldCash, totalCashTrans, cashType === 'JAMA', 2);

  const handleSave = async () => {
    if (!selectedCustomer) {
      showToast('Please select a customer first!', 'error');
      return;
    }

    if (goldWeight === 0 && totalCashTrans === 0) {
      showToast('Please enter either gold weight or cash amount!', 'error');
      return;
    }

    const newEntry = await loanService.createEntry({
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerNo: selectedCustomer.customerNo,
      gold: {
        oldBalance: oldGold,
        type: goldType,
        transactionWeight: goldWeight,
        newBalance: finalGold,
      },
      cash: {
        oldBalance: oldCash,
        type: cashType,
        transactionAmount: cashAmount,
        onlineAmount,
        bank2Amount,
        newBalance: finalCash,
      },
      narration: narration || 'Loan / Advance entry',
    });

    showToast(`Loan ledger entry #${newEntry.transactionNo} created!`);
    loadEntries();
    setGoldWeight(0);
    setCashAmount(0);
    setOnlineAmount(0);
    setBank2Amount(0);
    setNarration('');
  };

  const columns: ColumnDef<LoanEntry>[] = [
    {
      accessorKey: 'transactionNo',
      header: 'SN',
      cell: (info) => <span className="font-bold">#{info.getValue() as number}</span>,
    },
    {
      accessorKey: 'dateTime',
      header: 'Date / Time',
      cell: (info) => <span className="text-slate-500">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'customerName',
      header: 'Customer',
      cell: (info) => (
        <span className="font-semibold text-slate-800">{info.getValue() as string}</span>
      ),
    },
    {
      header: 'Gold In / Out',
      cell: (info) => {
        const g = info.row.original.gold;
        if (!g.transactionWeight) return <span className="text-slate-400">-</span>;
        return (
          <Badge variant={g.type === 'JAMA' ? 'success' : 'danger'}>
            {g.type === 'JAMA' ? '+In ' : '-Out '}
            {g.transactionWeight.toFixed(3)}g
          </Badge>
        );
      },
    },
    {
      header: 'Final Gold (g)',
      cell: (info) => (
        <span
          className={`font-bold ${
            info.row.original.gold.newBalance >= 0 ? 'text-emerald-700' : 'text-rose-700'
          }`}
        >
          {info.row.original.gold.newBalance >= 0 ? '+' : ''}
          {info.row.original.gold.newBalance.toFixed(3)}g
        </span>
      ),
    },
    {
      header: 'Cash In / Out',
      cell: (info) => {
        const c = info.row.original.cash;
        const total = (c.transactionAmount || 0) + (c.onlineAmount || 0) + (c.bank2Amount || 0);
        if (!total) return <span className="text-slate-400">-</span>;
        return (
          <Badge variant={c.type === 'JAMA' ? 'success' : 'danger'}>
            {c.type === 'JAMA' ? '+In ' : '-Out '}₹{total.toLocaleString('en-IN')}
          </Badge>
        );
      },
    },
    {
      header: 'Final Cash (₹)',
      cell: (info) => (
        <span
          className={`font-bold ${
            info.row.original.cash.newBalance >= 0 ? 'text-emerald-700' : 'text-rose-700'
          }`}
        >
          ₹{info.row.original.cash.newBalance.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      accessorKey: 'narration',
      header: 'Narration',
      cell: (info) => (
        <span className="text-slate-600 truncate max-w-[150px] inline-block">
          {info.getValue() as string}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-b pb-3 gap-2">
        <div className="flex items-center space-x-2">
          <div className="h-9 w-9 rounded-lg bg-brand-maroon text-brand-gold flex items-center justify-center">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              LOAN & CREDIT LEDGER (उधार खाता)
            </h1>
            <p className="text-xs text-slate-500">
              Double-entry bullion weight and cash advances, deposits, and loan balance tracking
            </p>
          </div>
        </div>

        <div className="flex rounded-lg bg-slate-200/80 p-0.5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('FORM')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'FORM' ? 'bg-brand-maroon text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>New Credit/Debit Entry</span>
          </button>
          <button
            onClick={() => setActiveTab('LIST')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'LIST' ? 'bg-brand-maroon text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <List className="h-3.5 w-3.5" />
            <span>Loan Log ({entries.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'FORM' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Customer (ग्राहक) <span className="text-red-500">*</span>
              </label>
              <CustomerSelect
                value={selectedCustomer?.id || ''}
                onChange={(c) => setSelectedCustomer(c)}
              />
            </div>

            {/* (सोना) GOLD Section */}
            <div className="rounded-lg border border-amber-200 bg-amber-50/40 p-3.5 space-y-3">
              <div className="flex items-center justify-between border-b border-amber-200 pb-1.5">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
                  <Scale className="h-4 w-4 text-brand-gold" />
                  <span>(सोना) GOLD CREDIT / DEBIT</span>
                </div>
                <span className="text-xs text-slate-600">
                  Previous: <span className="font-bold">{oldGold.toFixed(3)} gm</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                <div className="flex rounded-md bg-white border border-slate-300 p-0.5">
                  <button
                    type="button"
                    onClick={() => setGoldType('UDHAR')}
                    className={`flex-1 py-1.5 text-center text-xs font-bold rounded ${
                      goldType === 'UDHAR' ? 'bg-rose-600 text-white' : 'text-slate-600'
                    }`}
                  >
                    Udhar / Out (-)
                  </button>
                  <button
                    type="button"
                    onClick={() => setGoldType('JAMA')}
                    className={`flex-1 py-1.5 text-center text-xs font-bold rounded ${
                      goldType === 'JAMA' ? 'bg-emerald-600 text-white' : 'text-slate-600'
                    }`}
                  >
                    Jama / In (+)
                  </button>
                </div>

                <div>
                  <input
                    type="number"
                    step="0.001"
                    value={goldWeight}
                    onChange={(e) => setGoldWeight(Number(e.target.value))}
                    placeholder="Gold Weight (gm)"
                    className="w-full px-3 py-1.5 text-xs font-bold rounded border border-slate-300 bg-white focus:outline-none"
                  />
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">FINAL GOLD:</span>
                  <span
                    className={`font-black text-sm ${
                      finalGold >= 0 ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {finalGold >= 0 ? '+' : ''}
                    {finalGold.toFixed(3)} gm
                  </span>
                </div>
              </div>
            </div>

            {/* (पैसे) CASH Section */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
                  <IndianRupee className="h-4 w-4 text-emerald-600" />
                  <span>(पैसे) CASH ADVANCE / PAYMENT</span>
                </div>
                <span className="text-xs text-slate-600">
                  Previous: <span className="font-bold">₹ {oldCash.toLocaleString('en-IN')}</span>
                </span>
              </div>

              <div className="flex rounded-md bg-white border border-slate-300 p-0.5 max-w-xs">
                <button
                  type="button"
                  onClick={() => setCashType('UDHAR')}
                  className={`flex-1 py-1.5 text-center text-xs font-bold rounded ${
                    cashType === 'UDHAR' ? 'bg-rose-600 text-white' : 'text-slate-600'
                  }`}
                >
                  Udhar / Out (-)
                </button>
                <button
                  type="button"
                  onClick={() => setCashType('JAMA')}
                  className={`flex-1 py-1.5 text-center text-xs font-bold rounded ${
                    cashType === 'JAMA' ? 'bg-emerald-600 text-white' : 'text-slate-600'
                  }`}
                >
                  Jama / In (+)
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Cash (रोकड़ ₹)
                  </label>
                  <input
                    type="number"
                    value={cashAmount}
                    onChange={(e) => setCashAmount(Number(e.target.value))}
                    className="w-full px-2.5 py-1 text-xs rounded border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Online / RTGS (₹)
                  </label>
                  <input
                    type="number"
                    value={onlineAmount}
                    onChange={(e) => setOnlineAmount(Number(e.target.value))}
                    className="w-full px-2.5 py-1 text-xs rounded border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Self Bank 2 (₹)
                  </label>
                  <input
                    type="number"
                    value={bank2Amount}
                    onChange={(e) => setBank2Amount(Number(e.target.value))}
                    className="w-full px-2.5 py-1 text-xs rounded border border-slate-300 bg-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <input
                type="text"
                value={narration}
                onChange={(e) => setNarration(e.target.value)}
                placeholder="Narration / Remark (Diwali advance, Karigar wage, settlement note)..."
                className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-none focus:border-brand-maroon"
              />
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="flex items-center space-x-1.5 px-5 py-2.5 bg-brand-maroon text-white font-bold text-xs rounded-lg hover:bg-brand-maroon-dark transition-all shadow-xs"
            >
              <Save className="h-4 w-4" />
              <span>Save Ledger Entry (खाते में दर्ज करें)</span>
            </button>
          </div>

          {/* Right Summary Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3 h-fit">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800 border-b pb-2">
              <Layers className="h-4 w-4 text-brand-maroon" />
              <span>Balance Preview</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-200">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">
                  New Gold Balance
                </span>
                <span
                  className={`text-xl font-extrabold ${
                    finalGold >= 0 ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {finalGold >= 0 ? '+' : ''}
                  {finalGold.toFixed(3)} gm
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">
                  New Cash Balance
                </span>
                <span
                  className={`text-xl font-extrabold ${
                    finalCash >= 0 ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  ₹ {finalCash.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={entries}
          searchPlaceholder="Search loan ledger entries..."
          exportFileName="loan_entries.csv"
        />
      )}
    </div>
  );
};
