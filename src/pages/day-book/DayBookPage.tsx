import React, { useState } from 'react';
import { DayBookEntry } from '../../types';
import { DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/common/Badge';
import { ColumnDef } from '@tanstack/react-table';
import { BookOpen, Printer, Download, Sparkles } from 'lucide-react';

export const DayBookPage: React.FC = () => {
  const [entries, setEntries] = useState<DayBookEntry[]>([
    {
      id: 'DB-101',
      dateTime: '2026-11-11 09:30:00',
      partyName: 'Opening Stock Balance',
      sourceModule: 'Exchange',
      referenceId: 'OPEN-01',
      cashFlow: { debit: 0, credit: 2540000, runningBalance: 2540000 },
      goldFlow: { debit: 0, credit: 350.25, runningBalance: 350.25 },
      silverFlow: { debit: 0, credit: 12500, runningBalance: 12500 },
      narration: 'Day opening physical safe balance',
    },
    {
      id: 'DB-102',
      dateTime: '2026-11-11 11:20:00',
      partyName: 'Rajesh Swarnakar',
      sourceModule: 'Exchange',
      referenceId: 'EX-2026-101',
      cashFlow: { debit: 22562.1, credit: 0, runningBalance: 2517437.9 },
      goldFlow: { debit: 0, credit: 2.942, runningBalance: 353.192 },
      silverFlow: { debit: 0, credit: 0, runningBalance: 12500 },
      narration: 'Old lagdi exchange transaction',
    },
    {
      id: 'DB-103',
      dateTime: '2026-11-11 14:45:00',
      partyName: 'Pooja Jewellers',
      sourceModule: 'BuySell',
      referenceId: 'BS-2026-102',
      cashFlow: { debit: 0, credit: 151000, runningBalance: 2668437.9 },
      goldFlow: { debit: 20.0, credit: 0, runningBalance: 333.192 },
      silverFlow: { debit: 0, credit: 0, runningBalance: 12500 },
      narration: '20gm pure bar cash sale',
    },
  ]);

  const columns: ColumnDef<DayBookEntry>[] = [
    {
      accessorKey: 'dateTime',
      header: 'Time',
      cell: (info) => (
        <span className="text-slate-500 font-mono">
          {(info.getValue() as string).split(' ')[1]}
        </span>
      ),
    },
    {
      accessorKey: 'partyName',
      header: 'Party / Description',
      cell: (info) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-800">{info.getValue() as string}</span>
          <span className="text-[10px] text-slate-400 font-medium">
            {info.row.original.narration}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'sourceModule',
      header: 'Source',
      cell: (info) => <Badge variant="info">{info.getValue() as string}</Badge>,
    },
    {
      header: 'Cash Flow (₹)',
      cell: (info) => {
        const c = info.row.original.cashFlow;
        return (
          <div className="flex flex-col text-right">
            {c.credit > 0 && (
              <span className="font-bold text-emerald-700">+₹{c.credit.toLocaleString('en-IN')}</span>
            )}
            {c.debit > 0 && (
              <span className="font-bold text-rose-700">-₹{c.debit.toLocaleString('en-IN')}</span>
            )}
            <span className="text-[10px] text-slate-500 font-semibold">
              Bal: ₹{c.runningBalance.toLocaleString('en-IN')}
            </span>
          </div>
        );
      },
    },
    {
      header: 'Gold Flow (gm)',
      cell: (info) => {
        const g = info.row.original.goldFlow;
        return (
          <div className="flex flex-col text-right">
            {g.credit > 0 && (
              <span className="font-bold text-emerald-700">+{g.credit.toFixed(3)}g</span>
            )}
            {g.debit > 0 && (
              <span className="font-bold text-rose-700">-{g.debit.toFixed(3)}g</span>
            )}
            <span className="text-[10px] text-amber-800 font-semibold">
              Bal: {g.runningBalance.toFixed(3)}g
            </span>
          </div>
        );
      },
    },
    {
      header: 'Silver Flow (gm)',
      cell: (info) => {
        const s = info.row.original.silverFlow;
        return (
          <div className="flex flex-col text-right">
            {s.credit > 0 && (
              <span className="font-bold text-emerald-700">+{s.credit.toFixed(1)}g</span>
            )}
            {s.debit > 0 && (
              <span className="font-bold text-rose-700">-{s.debit.toFixed(1)}g</span>
            )}
            <span className="text-[10px] text-slate-500 font-semibold">
              Bal: {s.runningBalance.toFixed(1)}g
            </span>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-b pb-3 gap-2">
        <div className="flex items-center space-x-2">
          <div className="h-9 w-9 rounded-lg bg-brand-maroon text-brand-gold flex items-center justify-center">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              DAY BOOK (दैनिक बहीखाता)
            </h1>
            <p className="text-xs text-slate-500">
              Real-time triple-currency transaction ledger auditing Cash (₹), Gold (gm), and Silver (gm) simultaneously
            </p>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
        >
          <Printer className="h-3.5 w-3.5" />
          <span>Print Today's Day Book (A4)</span>
        </button>
      </div>

      {/* Triple-Currency Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase block">
            Closing Cash in Vault
          </span>
          <span className="text-xl font-black text-slate-900 mt-1 block">
            ₹ 26,68,437.90
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold">
            Today Net Inflow: +₹ 1,28,437.90
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase block">
            Closing 99.9 Gold Vault
          </span>
          <span className="text-xl font-black text-amber-700 mt-1 block">
            333.192 gm
          </span>
          <span className="text-[10px] text-rose-600 font-semibold">
            Today Net Sales: -17.058 gm
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase block">
            Closing Physical Silver
          </span>
          <span className="text-xl font-black text-slate-800 mt-1 block">
            12.500 kg
          </span>
          <span className="text-[10px] text-slate-400 font-semibold">
            Zero silver movement today
          </span>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={entries}
        searchPlaceholder="Search day book entries..."
        exportFileName="day_book_daily.csv"
      />
    </div>
  );
};
