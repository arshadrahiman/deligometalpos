import React, { useState, useEffect } from 'react';
import { ExpenseIncomeRecord } from '../../types';
import { expenseService } from '../../services/expenseService';
import { useUIStore } from '../../store/useUIStore';
import { DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/common/Badge';
import { ColumnDef } from '@tanstack/react-table';
import {
  List,
  Save,
  Printer,
  ChevronLeft,
} from 'lucide-react';

export const ExpenseIncomePage: React.FC = () => {
  const { showToast } = useUIStore();
  const [activeTab, setActiveTab] = useState<'FORM' | 'LIST'>('FORM');
  const [records, setRecords] = useState<ExpenseIncomeRecord[]>([]);

  // Expense Form
  const [expName, setExpName] = useState('');
  const [expReason, setExpReason] = useState('');
  const [expCash, setExpCash] = useState<number>(0);
  const [expOnline, setExpOnline] = useState<number>(0);
  const [expBank2, setExpBank2] = useState<number>(0);
  const [expGold, setExpGold] = useState<number>(0);

  // Income Form
  const [incName, setIncName] = useState('');
  const [incReason, setIncReason] = useState('');
  const [incCash, setIncCash] = useState<number>(0);
  const [incOnline, setIncOnline] = useState<number>(0);
  const [incBank2, setIncBank2] = useState<number>(0);
  const [incGold, setIncGold] = useState<number>(0);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    const list = await expenseService.getAll();
    setRecords(list);
  };

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expName.trim()) {
      showToast('To (Source) name is required for Expense!', 'error');
      return;
    }
    await expenseService.create({
      type: 'EXPENSE',
      partyName: expName,
      reason: expReason || 'N/A',
      cashAmount: expCash,
      onlineAmount: expOnline,
      bank2Amount: expBank2,
      goldWeight: expGold,
    });
    showToast('Expense entry recorded successfully!');
    setExpName('');
    setExpReason('');
    setExpCash(0);
    setExpOnline(0);
    setExpBank2(0);
    setExpGold(0);
    loadRecords();
  };

  const handleCreateIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incName.trim()) {
      showToast('From (Source) name is required for Income!', 'error');
      return;
    }
    await expenseService.create({
      type: 'INCOME',
      partyName: incName,
      reason: incReason || 'N/A',
      cashAmount: incCash,
      onlineAmount: incOnline,
      bank2Amount: incBank2,
      goldWeight: incGold,
    });
    showToast('Income entry recorded successfully!');
    setIncName('');
    setIncReason('');
    setIncCash(0);
    setIncOnline(0);
    setIncBank2(0);
    setIncGold(0);
    loadRecords();
  };

  // Summaries
  const totalExpenseCash = records
    .filter((r) => r.type === 'EXPENSE')
    .reduce((acc, r) => acc + r.cashAmount + r.onlineAmount + (r.bank2Amount || 0), 0);

  const totalIncomeCash = records
    .filter((r) => r.type === 'INCOME')
    .reduce((acc, r) => acc + r.cashAmount + r.onlineAmount + (r.bank2Amount || 0), 0);

  const netCashFlow = totalIncomeCash - totalExpenseCash;

  const totalExpenseGold = records
    .filter((r) => r.type === 'EXPENSE')
    .reduce((acc, r) => acc + r.goldWeight, 0);

  const totalIncomeGold = records
    .filter((r) => r.type === 'INCOME')
    .reduce((acc, r) => acc + r.goldWeight, 0);

  const netGoldFlow = Math.round((totalIncomeGold - totalExpenseGold) * 1000) / 1000;

  const columns: ColumnDef<ExpenseIncomeRecord>[] = [
    {
      accessorKey: 'recordNo',
      header: 'SN',
      cell: (info) => <span className="font-bold">#{info.getValue() as number}</span>,
    },
    {
      accessorKey: 'dateTime',
      header: 'Date / Time',
      cell: (info) => <span className="text-slate-500 font-mono text-[11px]">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: (info) => (
        <Badge variant={info.getValue() === 'INCOME' ? 'success' : 'danger'}>
          {info.getValue() as string}
        </Badge>
      ),
    },
    {
      accessorKey: 'partyName',
      header: 'Source / Party',
      cell: (info) => <span className="font-semibold text-slate-800">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'reason',
      header: 'Reason',
      cell: (info) => <span className="text-slate-600">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'cashAmount',
      header: 'Cash (₹)',
      cell: (info) => <span>{(info.getValue() as number).toLocaleString('en-IN')}</span>,
    },
    {
      accessorKey: 'onlineAmount',
      header: 'Online (₹)',
      cell: (info) => <span>{(info.getValue() as number).toLocaleString('en-IN')}</span>,
    },
    {
      accessorKey: 'bank2Amount',
      header: 'Bank 2 (₹)',
      cell: (info) => <span>{((info.getValue() as number) || 0).toLocaleString('en-IN')}</span>,
    },
    {
      accessorKey: 'goldWeight',
      header: 'Gold (gm)',
      cell: (info) => {
        const val = info.getValue() as number;
        return val ? <span className="font-mono font-bold">{val.toFixed(3)} gm</span> : <span className="text-slate-400">-</span>;
      },
    },
  ];

  return (
    <div className="space-y-4">
      {/* Top Header Matching reference/expense_income_1440.png */}
      <div className="bg-white p-3 rounded-xl border border-amber-300 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <h2 className="text-sm sm:text-base font-extrabold text-slate-800 tracking-wide uppercase">
            PROFIT LIST = INCOME - EXPENSES
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => setActiveTab(activeTab === 'FORM' ? 'LIST' : 'FORM')}
            className="flex items-center space-x-1.5 px-4 py-1.5 bg-brand-maroon text-white font-bold rounded-full hover:bg-brand-maroon-dark transition-all text-xs shadow-xs"
          >
            {activeTab === 'FORM' ? (
              <>
                <List className="h-3.5 w-3.5" />
                <span>List</span>
              </>
            ) : (
              <>
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Form</span>
              </>
            )}
          </button>

          {/* Deligo Technologies Brand Box */}
          <div className="flex items-center space-x-2 pl-4 border-l border-slate-200">
            <div className="h-8 w-8 rounded-lg bg-brand-maroon text-brand-gold flex items-center justify-center font-black text-sm shadow-xs">
              DT
            </div>
            <div className="leading-tight">
              <span className="font-extrabold text-slate-800 tracking-tight text-xs block">
                DELIGO TECHNOLOGIES
              </span>
              <span className="text-[10px] text-brand-maroon font-semibold block">
                Expense & Income Ledger
              </span>
            </div>
          </div>
        </div>
      </div>

      {activeTab === 'FORM' ? (
        <div className="space-y-4">
          {/* Dual Panel Layout: EXPENSE (खर्च) on Left, INCOME (आय) on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Box 1: EXPENSE (खर्च) */}
            <form
              onSubmit={handleCreateExpense}
              className="bg-white rounded-xl border border-slate-300 shadow-xs p-5 space-y-4"
            >
              <div className="text-center">
                <h3 className="text-base font-black text-slate-900 tracking-wide">
                  EXPENSE (खर्च)
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                {/* To (Source) */}
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 w-36 text-right pr-2">
                    To (Source) :
                  </span>
                  <input
                    type="text"
                    required
                    value={expName}
                    onChange={(e) => setExpName(e.target.value)}
                    placeholder="Name"
                    className="flex-1 px-3 py-1.5 rounded border border-slate-300 text-xs focus:outline-none focus:border-brand-maroon"
                  />
                </div>

                {/* Reason */}
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 w-36 text-right pr-2">
                    Reason :
                  </span>
                  <input
                    type="text"
                    value={expReason}
                    onChange={(e) => setExpReason(e.target.value)}
                    placeholder="कारण"
                    className="flex-1 px-3 py-1.5 rounded border border-slate-300 text-xs focus:outline-none focus:border-brand-maroon"
                  />
                </div>

                {/* Amount (-) */}
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 w-36 text-right pr-2">
                    Amount (-) :
                  </span>
                  <div className="flex-1 flex items-center">
                    <input
                      type="number"
                      value={expCash || ''}
                      onChange={(e) => setExpCash(Number(e.target.value))}
                      placeholder="0"
                      className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs font-mono font-bold focus:outline-none focus:border-brand-maroon"
                    />
                    <span className="ml-2 font-bold text-slate-600">₹</span>
                  </div>
                </div>

                {/* ONLINE GIVEN RTGS */}
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 w-36 text-right pr-2">
                    ONLINE GIVEN RTGS :
                  </span>
                  <div className="flex-1 flex items-center">
                    <input
                      type="number"
                      value={expOnline || ''}
                      onChange={(e) => setExpOnline(Number(e.target.value))}
                      placeholder="0"
                      className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs font-mono font-bold focus:outline-none focus:border-brand-maroon"
                    />
                    <span className="ml-2 font-bold text-slate-600">₹</span>
                  </div>
                </div>

                {/* SELF BANK 2 GIVEN RTGS */}
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 w-36 text-right pr-2">
                    SELF BANK 2 GIVEN RTGS :
                  </span>
                  <div className="flex-1 flex items-center">
                    <input
                      type="number"
                      value={expBank2 || ''}
                      onChange={(e) => setExpBank2(Number(e.target.value))}
                      placeholder="0"
                      className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs font-mono font-bold focus:outline-none focus:border-brand-maroon"
                    />
                    <span className="ml-2 font-bold text-slate-600">₹</span>
                  </div>
                </div>

                {/* Gold (-) */}
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 w-36 text-right pr-2">
                    Gold (-) :
                  </span>
                  <div className="flex-1 flex items-center">
                    <input
                      type="number"
                      step="0.001"
                      value={expGold || ''}
                      onChange={(e) => setExpGold(Number(e.target.value))}
                      placeholder="0.000"
                      className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs font-mono font-bold focus:outline-none focus:border-brand-maroon"
                    />
                    <span className="ml-2 font-bold text-slate-600">gm</span>
                  </div>
                </div>
              </div>

              {/* Floppy Disk Save Button */}
              <div className="text-center pt-2">
                <button
                  type="submit"
                  className="p-2 rounded bg-brand-maroon text-white hover:bg-brand-maroon-dark transition-colors inline-flex items-center justify-center shadow-xs"
                  title="Save Expense"
                >
                  <Save className="h-4 w-4" />
                </button>
              </div>
            </form>

            {/* Box 2: INCOME (आय) */}
            <form
              onSubmit={handleCreateIncome}
              className="bg-white rounded-xl border border-slate-300 shadow-xs p-5 space-y-4"
            >
              <div className="text-center">
                <h3 className="text-base font-black text-slate-900 tracking-wide">
                  INCOME (आय)
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                {/* From (Source) */}
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 w-36 text-right pr-2">
                    From (Source) :
                  </span>
                  <input
                    type="text"
                    required
                    value={incName}
                    onChange={(e) => setIncName(e.target.value)}
                    placeholder="Name"
                    className="flex-1 px-3 py-1.5 rounded border border-slate-300 text-xs focus:outline-none focus:border-emerald-700"
                  />
                </div>

                {/* Reason */}
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 w-36 text-right pr-2">
                    Reason :
                  </span>
                  <input
                    type="text"
                    value={incReason}
                    onChange={(e) => setIncReason(e.target.value)}
                    placeholder="कारण"
                    className="flex-1 px-3 py-1.5 rounded border border-slate-300 text-xs focus:outline-none focus:border-emerald-700"
                  />
                </div>

                {/* Amount (+) */}
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 w-36 text-right pr-2">
                    Amount (+) :
                  </span>
                  <div className="flex-1 flex items-center">
                    <input
                      type="number"
                      value={incCash || ''}
                      onChange={(e) => setIncCash(Number(e.target.value))}
                      placeholder="0"
                      className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs font-mono font-bold focus:outline-none focus:border-emerald-700"
                    />
                    <span className="ml-2 font-bold text-slate-600">₹</span>
                  </div>
                </div>

                {/* ONLINE RECIEVED RTGS */}
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 w-36 text-right pr-2">
                    ONLINE RECIEVED RTGS :
                  </span>
                  <div className="flex-1 flex items-center">
                    <input
                      type="number"
                      value={incOnline || ''}
                      onChange={(e) => setIncOnline(Number(e.target.value))}
                      placeholder="0"
                      className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs font-mono font-bold focus:outline-none focus:border-emerald-700"
                    />
                    <span className="ml-2 font-bold text-slate-600">₹</span>
                  </div>
                </div>

                {/* SELF BANK 2 RECIEVED RTGS */}
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 w-36 text-right pr-2">
                    SELF BANK 2 RECIEVED RTGS :
                  </span>
                  <div className="flex-1 flex items-center">
                    <input
                      type="number"
                      value={incBank2 || ''}
                      onChange={(e) => setIncBank2(Number(e.target.value))}
                      placeholder="0"
                      className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs font-mono font-bold focus:outline-none focus:border-emerald-700"
                    />
                    <span className="ml-2 font-bold text-slate-600">₹</span>
                  </div>
                </div>

                {/* Gold (+) */}
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 w-36 text-right pr-2">
                    Gold (+) :
                  </span>
                  <div className="flex-1 flex items-center">
                    <input
                      type="number"
                      step="0.001"
                      value={incGold || ''}
                      onChange={(e) => setIncGold(Number(e.target.value))}
                      placeholder="0.000"
                      className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs font-mono font-bold focus:outline-none focus:border-emerald-700"
                    />
                    <span className="ml-2 font-bold text-slate-600">gm</span>
                  </div>
                </div>
              </div>

              {/* Floppy Disk Save Button */}
              <div className="text-center pt-2">
                <button
                  type="submit"
                  className="p-2 rounded bg-brand-maroon text-white hover:bg-brand-maroon-dark transition-colors inline-flex items-center justify-center shadow-xs"
                  title="Save Income"
                >
                  <Save className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Quick Summary Pill Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-xs">
              <span className="font-bold text-rose-800 block text-[11px] uppercase">Total Expense</span>
              <span className="font-extrabold text-rose-900 text-sm">₹{totalExpenseCash.toLocaleString('en-IN')}</span>
              {totalExpenseGold > 0 && <span className="block text-slate-600 font-mono">Gold: {totalExpenseGold.toFixed(3)}g</span>}
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs">
              <span className="font-bold text-emerald-800 block text-[11px] uppercase">Total Income</span>
              <span className="font-extrabold text-emerald-900 text-sm">₹{totalIncomeCash.toLocaleString('en-IN')}</span>
              {totalIncomeGold > 0 && <span className="block text-slate-600 font-mono">Gold: {totalIncomeGold.toFixed(3)}g</span>}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs">
              <span className="font-bold text-amber-800 block text-[11px] uppercase">Net Profit / Flow</span>
              <span className={`font-extrabold text-sm ${netCashFlow >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {netCashFlow >= 0 ? '+' : ''}₹{netCashFlow.toLocaleString('en-IN')}
              </span>
              {netGoldFlow !== 0 && (
                <span className="block text-slate-600 font-mono">
                  Gold: {netGoldFlow >= 0 ? '+' : ''}{netGoldFlow.toFixed(3)}g
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-xl border border-slate-300 shadow-xs p-4 space-y-3">
          <DataTable
            columns={columns}
            data={records}
            searchPlaceholder="Search expense / income by party, reason..."
            exportFileName="expense_income_log.csv"
          />
        </div>
      )}
    </div>
  );
};
