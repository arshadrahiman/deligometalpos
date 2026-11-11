import React, { useState, useEffect } from 'react';
import { ExpenseIncomeRecord } from '../../types';
import { expenseService } from '../../services/expenseService';
import { useUIStore } from '../../store/useUIStore';
import { DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/common/Badge';
import { ColumnDef } from '@tanstack/react-table';
import {
  DollarSign,
  PlusCircle,
  Save,
  ArrowDownCircle,
  ArrowUpCircle,
  Scale,
  IndianRupee,
} from 'lucide-react';

export const ExpenseIncomePage: React.FC = () => {
  const { showToast } = useUIStore();
  const [records, setRecords] = useState<ExpenseIncomeRecord[]>([]);

  // Expense Form
  const [expName, setExpName] = useState('');
  const [expReason, setExpReason] = useState('');
  const [expCash, setExpCash] = useState<number>(0);
  const [expOnline, setExpOnline] = useState<number>(0);
  const [expGold, setExpGold] = useState<number>(0);

  // Income Form
  const [incName, setIncName] = useState('');
  const [incReason, setIncReason] = useState('');
  const [incCash, setIncCash] = useState<number>(0);
  const [incOnline, setIncOnline] = useState<number>(0);
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
    if (!expName.trim() || !expReason.trim()) {
      showToast('Party Name and Reason are required for Expense!', 'error');
      return;
    }
    await expenseService.create({
      type: 'EXPENSE',
      partyName: expName,
      reason: expReason,
      cashAmount: expCash,
      onlineAmount: expOnline,
      bank2Amount: 0,
      goldWeight: expGold,
    });
    showToast('Expense entry recorded successfully!');
    setExpName('');
    setExpReason('');
    setExpCash(0);
    setExpOnline(0);
    setExpGold(0);
    loadRecords();
  };

  const handleCreateIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incName.trim() || !incReason.trim()) {
      showToast('Party Name and Reason are required for Income!', 'error');
      return;
    }
    await expenseService.create({
      type: 'INCOME',
      partyName: incName,
      reason: incReason,
      cashAmount: incCash,
      onlineAmount: incOnline,
      bank2Amount: 0,
      goldWeight: incGold,
    });
    showToast('Income entry recorded successfully!');
    setIncName('');
    setIncReason('');
    setIncCash(0);
    setIncOnline(0);
    setIncGold(0);
    loadRecords();
  };

  // Summaries
  const totalExpenseCash = records
    .filter((r) => r.type === 'EXPENSE')
    .reduce((acc, r) => acc + r.cashAmount + r.onlineAmount, 0);

  const totalIncomeCash = records
    .filter((r) => r.type === 'INCOME')
    .reduce((acc, r) => acc + r.cashAmount + r.onlineAmount, 0);

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
      cell: (info) => <span className="text-slate-500">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'type',
      header: 'Entry Type',
      cell: (info) => (
        <Badge variant={info.getValue() === 'INCOME' ? 'success' : 'danger'}>
          {info.getValue() as string}
        </Badge>
      ),
    },
    {
      accessorKey: 'partyName',
      header: 'Party / To / From',
      cell: (info) => <span className="font-semibold text-slate-800">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'reason',
      header: 'Reason / Purpose',
      cell: (info) => <span className="text-slate-600">{info.getValue() as string}</span>,
    },
    {
      header: 'Gold Flow',
      cell: (info) => {
        const wt = info.row.original.goldWeight;
        if (!wt) return <span className="text-slate-400">-</span>;
        const isInc = info.row.original.type === 'INCOME';
        return (
          <span className={`font-bold ${isInc ? 'text-emerald-700' : 'text-rose-700'}`}>
            {isInc ? '+' : '-'}{wt.toFixed(3)}g
          </span>
        );
      },
    },
    {
      header: 'Cash Flow',
      cell: (info) => {
        const amt = info.row.original.cashAmount + info.row.original.onlineAmount;
        if (!amt) return <span className="text-slate-400">-</span>;
        const isInc = info.row.original.type === 'INCOME';
        return (
          <span className={`font-extrabold ${isInc ? 'text-emerald-700' : 'text-rose-700'}`}>
            {isInc ? '+' : '-'}₹{amt.toLocaleString('en-IN')}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center space-x-2 border-b pb-3">
        <div className="h-9 w-9 rounded-lg bg-brand-maroon text-brand-gold flex items-center justify-center">
          <DollarSign className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
            EXPENSE | INCOME (खर्च | आय जर्नल)
          </h1>
          <p className="text-xs text-slate-500">
            Dual-entry operational expenditure and income register with simultaneous cash & gold audit
          </p>
        </div>
      </div>

      {/* Summary KPI Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex flex-col">
          <span className="text-[11px] font-bold text-rose-800 uppercase">Total Expense (खर्च)</span>
          <span className="text-lg font-extrabold text-rose-900 mt-0.5">
            ₹ {totalExpenseCash.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-rose-700">Gold Out: {totalExpenseGold.toFixed(3)} g</span>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex flex-col">
          <span className="text-[11px] font-bold text-emerald-800 uppercase">Total Income (आय)</span>
          <span className="text-lg font-extrabold text-emerald-900 mt-0.5">
            ₹ {totalIncomeCash.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-emerald-700">Gold In: {totalIncomeGold.toFixed(3)} g</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col sm:col-span-2 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Net Financial Cash Flow</span>
          <div className="flex items-center justify-between mt-0.5">
            <span
              className={`text-2xl font-black ${
                netCashFlow >= 0 ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {netCashFlow >= 0 ? '+' : ''}₹ {netCashFlow.toLocaleString('en-IN')}
            </span>
            <span
              className={`text-xs font-bold px-2 py-1 rounded ${
                netGoldFlow >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}
            >
              Net Gold: {netGoldFlow >= 0 ? '+' : ''}{netGoldFlow.toFixed(3)} g
            </span>
          </div>
        </div>
      </div>

      {/* Dual Entry Forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Expense Form */}
        <form
          onSubmit={handleCreateExpense}
          className="bg-white rounded-xl border border-rose-200 shadow-xs p-4 space-y-3"
        >
          <div className="flex items-center space-x-1.5 text-xs font-bold text-rose-800 border-b border-rose-100 pb-2">
            <ArrowDownCircle className="h-4 w-4 text-rose-600" />
            <span>RECORD EXPENSE (खर्च दर्ज करें)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                To / Party Name *
              </label>
              <input
                type="text"
                required
                value={expName}
                onChange={(e) => setExpName(e.target.value)}
                placeholder="e.g. Electric Board / Landlord"
                className="w-full px-2.5 py-1 text-xs rounded border border-slate-300 focus:outline-none focus:border-rose-600"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Reason / Purpose *
              </label>
              <input
                type="text"
                required
                value={expReason}
                onChange={(e) => setExpReason(e.target.value)}
                placeholder="e.g. Electricity Bill / Rent"
                className="w-full px-2.5 py-1 text-xs rounded border border-slate-300 focus:outline-none focus:border-rose-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-rose-50/40 p-2.5 rounded-lg border border-rose-100">
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-1">Cash (₹)</label>
              <input
                type="number"
                value={expCash}
                onChange={(e) => setExpCash(Number(e.target.value))}
                className="w-full px-2 py-1 text-xs rounded border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-1">Online (₹)</label>
              <input
                type="number"
                value={expOnline}
                onChange={(e) => setExpOnline(Number(e.target.value))}
                className="w-full px-2 py-1 text-xs rounded border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-1">Gold (gm)</label>
              <input
                type="number"
                step="0.001"
                value={expGold}
                onChange={(e) => setExpGold(Number(e.target.value))}
                className="w-full px-2 py-1 text-xs rounded border border-slate-300 bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-rose-600 text-white font-bold text-xs rounded-lg hover:bg-rose-700 transition-colors shadow-xs"
          >
            Save Expense (खर्च सुरक्षित करें)
          </button>
        </form>

        {/* Right: Income Form */}
        <form
          onSubmit={handleCreateIncome}
          className="bg-white rounded-xl border border-emerald-200 shadow-xs p-4 space-y-3"
        >
          <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-800 border-b border-emerald-100 pb-2">
            <ArrowUpCircle className="h-4 w-4 text-emerald-600" />
            <span>RECORD INCOME (आय दर्ज करें)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                From / Party Name *
              </label>
              <input
                type="text"
                required
                value={incName}
                onChange={(e) => setIncName(e.target.value)}
                placeholder="e.g. Scrap Buyer / Client"
                className="w-full px-2.5 py-1 text-xs rounded border border-slate-300 focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Reason / Purpose *
              </label>
              <input
                type="text"
                required
                value={incReason}
                onChange={(e) => setIncReason(e.target.value)}
                placeholder="e.g. Scrap gold sale / Service fee"
                className="w-full px-2.5 py-1 text-xs rounded border border-slate-300 focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-emerald-50/40 p-2.5 rounded-lg border border-emerald-100">
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-1">Cash (₹)</label>
              <input
                type="number"
                value={incCash}
                onChange={(e) => setIncCash(Number(e.target.value))}
                className="w-full px-2 py-1 text-xs rounded border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-1">Online (₹)</label>
              <input
                type="number"
                value={incOnline}
                onChange={(e) => setIncOnline(Number(e.target.value))}
                className="w-full px-2 py-1 text-xs rounded border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-1">Gold (gm)</label>
              <input
                type="number"
                step="0.001"
                value={incGold}
                onChange={(e) => setIncGold(Number(e.target.value))}
                className="w-full px-2 py-1 text-xs rounded border border-slate-300 bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-emerald-600 text-white font-bold text-xs rounded-lg hover:bg-emerald-700 transition-colors shadow-xs"
          >
            Save Income (आय सुरक्षित करें)
          </button>
        </form>
      </div>

      {/* Journal Table */}
      <DataTable
        columns={columns}
        data={records}
        searchPlaceholder="Search journal entries..."
        exportFileName="expense_income_records.csv"
      />
    </div>
  );
};

