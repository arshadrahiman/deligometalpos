import React, { useState } from 'react';
import {
  Printer,
  Calendar,
  Lock,
  ChevronLeft,
  ChevronDown,
} from 'lucide-react';

interface DayBookDetailedRow {
  sn: number;
  dateTime: string;
  customer: string;
  source: string;
  subSource?: string;
  outAmt: number;
  inAmt: number;
  balAmt: number;
  outGold: number;
  inGold: number;
  balGold: number;
  outSilver: number;
  inSilver: number;
  balSilver: number;
}

export const DayBookPage: React.FC = () => {
  const [fromDate, setFromDate] = useState('2026-11-11');
  const [toDate, setToDate] = useState('2026-11-11');
  const [selectedMonth, setSelectedMonth] = useState('Select Month');
  const [selectedAction, setSelectedAction] = useState('All Actions');
  const [selectedSource, setSelectedSource] = useState('All Sources');
  const [selectedCustomer, setSelectedCustomer] = useState('All Customers');

  const rows: DayBookDetailedRow[] = [
    {
      sn: 1,
      dateTime: '03 : 54 : 01 : pm',
      customer: '386 / RAHUL 1',
      source: 'Exchange (G)',
      subSource: '[ Wt: 98.000 | Tounch: 85.00% | Fin: 83.300 | Diff: 3.496 | Rate: 1,40,000 ]',
      outAmt: 38944,
      inAmt: 0,
      balAmt: 7230290,
      outGold: 80.0,
      inGold: 0,
      balGold: 469.009,
      outSilver: 0,
      inSilver: 0,
      balSilver: 151498.093,
    },
    {
      sn: 2,
      dateTime: '03 : 50 : 29 : pm',
      customer: '386 / RAHUL 1',
      source: 'Exchange (G)',
      subSource: '[ Wt: 105.000 | Tounch: 85.00% | Fin: 89.250 | Diff: 89.460 | Rate: 1,40,000 ]',
      outAmt: 1252390,
      inAmt: 0,
      balAmt: 7269234,
      outGold: 0,
      inGold: 0,
      balGold: 549.009,
      outSilver: 0,
      inSilver: 0,
      balSilver: 151498.093,
    },
    {
      sn: 3,
      dateTime: '01 : 35 : 14 : pm',
      customer: '100 / XYZ',
      source: 'Exchange (G)',
      subSource: '[ Wt: 12.000 | Tounch: 75.00% | Fin: 9.000 | Diff: 9.024 | Rate: 1,40,000 ]',
      outAmt: 126286,
      inAmt: 0,
      balAmt: 8521624,
      outGold: 0,
      inGold: 0,
      balGold: 549.009,
      outSilver: 0,
      inSilver: 0,
      balSilver: 151498.093,
    },
    {
      sn: 4,
      dateTime: '01 : 01 : 17 : pm',
      customer: 'bank / bank',
      source: 'Income Expense (G)',
      outAmt: 0,
      inAmt: 0,
      balAmt: 8647910,
      outGold: 0,
      inGold: 0,
      balGold: 549.009,
      outSilver: 0,
      inSilver: 0,
      balSilver: 151498.093,
    },
    {
      sn: 5,
      dateTime: '01 : 00 : 08 : pm',
      customer: '99 / Bank (Online)',
      source: 'Loan (G)',
      subSource: '( Udhari )',
      outAmt: 50000,
      inAmt: 0,
      balAmt: 8647910,
      outGold: 0,
      inGold: 0,
      balGold: 549.009,
      outSilver: 0,
      inSilver: 0,
      balSilver: 151498.093,
    },
    {
      sn: 6,
      dateTime: '12 : 59 : 14 : pm',
      customer: '99 / Bank (Online)',
      source: 'Loan (G)',
      subSource: '( Udhari )',
      outAmt: 50000,
      inAmt: 0,
      balAmt: 8697910,
      outGold: 0,
      inGold: 0,
      balGold: 549.009,
      outSilver: 0,
      inSilver: 0,
      balSilver: 151498.093,
    },
  ];

  return (
    <div className="space-y-3">
      {/* Breadcrumb Bar */}
      <div className="flex items-center space-x-2 text-xs font-bold text-white">
        <div className="bg-brand-maroon px-3 py-1 rounded-l-md">Day Book</div>
        <div className="bg-rose-700 px-3 py-1 rounded-r-md">Detail Day Book</div>
      </div>

      {/* Top Header Controls Bar Matching reference/day_book_1440.png */}
      <div className="bg-white p-3 rounded-xl border border-slate-300 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div>
          <h2 className="text-base font-extrabold text-slate-800 leading-tight">
            Detailed Day Book
          </h2>
          <p className="text-[11px] text-slate-500">
            Track cash, gold, and silver ledger flows instantly.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 text-amber-300 font-bold rounded-lg text-xs hover:bg-black shadow-xs"
          >
            <Lock className="h-3 w-3" />
            <span>OPENING STOCK</span>
          </button>

          <button
            type="button"
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 text-amber-300 font-bold rounded-lg text-xs hover:bg-black shadow-xs"
          >
            <Lock className="h-3 w-3" />
            <span>CLOSING STOCK</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center space-x-1 px-3 py-1.5 bg-brand-maroon text-white font-bold rounded-lg text-xs hover:bg-brand-maroon-dark shadow-xs"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print</span>
          </button>

          <button
            type="button"
            className="px-3 py-1.5 bg-brand-maroon text-white font-bold rounded-lg text-xs hover:bg-brand-maroon-dark shadow-xs"
          >
            Old Records
          </button>

          <button
            type="button"
            className="h-7 w-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-300 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-2.5 rounded-xl border border-slate-300 shadow-xs flex flex-wrap items-center gap-2 text-xs">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-2.5 py-1.5 rounded border border-slate-300 font-medium text-slate-700 text-xs"
        >
          <option value="Select Month">Select Month</option>
          <option value="November 2026">November 2026</option>
          <option value="October 2026">October 2026</option>
        </select>

        <div className="flex items-center space-x-1">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="px-2 py-1 rounded border border-slate-300 font-medium text-slate-700 text-xs"
          />
        </div>

        <div className="flex items-center space-x-1">
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="px-2 py-1 rounded border border-slate-300 font-medium text-slate-700 text-xs"
          />
        </div>

        <select
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
          className="px-2.5 py-1.5 rounded border border-slate-300 font-medium text-slate-700 text-xs"
        >
          <option value="All Actions">All Actions</option>
          <option value="Debit">Debit</option>
          <option value="Credit">Credit</option>
        </select>

        <select
          value={selectedSource}
          onChange={(e) => setSelectedSource(e.target.value)}
          className="px-2.5 py-1.5 rounded border border-slate-300 font-medium text-slate-700 text-xs"
        >
          <option value="All Sources">All Sources</option>
          <option value="Exchange">Exchange</option>
          <option value="Loan (Udhari)">Loan (Udhari)</option>
          <option value="Buy/Sell">Buy/Sell</option>
          <option value="Expense/Income">Expense/Income</option>
        </select>

        <select
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
          className="px-2.5 py-1.5 rounded border border-slate-300 font-medium text-slate-700 text-xs"
        >
          <option value="All Customers">All Customers</option>
          <option value="386 / RAHUL 1">386 / RAHUL 1</option>
          <option value="100 / XYZ">100 / XYZ</option>
          <option value="99 / Bank (Online)">99 / Bank (Online)</option>
        </select>
      </div>

      {/* Two-Tier Table Matching reference/day_book_1440.png */}
      <div className="bg-white rounded-xl border border-slate-300 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              {/* Super Header Tier */}
              <tr className="bg-slate-700 text-white font-bold text-center">
                <th colSpan={4} className="py-2 px-3 border border-slate-600 bg-slate-700"></th>
                <th colSpan={3} className="py-2 px-3 border border-slate-600 bg-slate-800 text-emerald-300 uppercase tracking-wider">
                  Amount
                </th>
                <th colSpan={3} className="py-2 px-3 border border-slate-600 bg-slate-800 text-amber-300 uppercase tracking-wider">
                  Gold
                </th>
                <th colSpan={3} className="py-2 px-3 border border-slate-600 bg-slate-800 text-slate-200 uppercase tracking-wider">
                  Silver
                </th>
                <th className="py-2 px-3 border border-slate-600 bg-slate-700">Action</th>
              </tr>

              {/* Secondary Column Headers */}
              <tr className="bg-slate-600 text-white font-semibold text-center border-b border-slate-500">
                <th className="py-2 px-2 border border-slate-500 w-10">SN</th>
                <th className="py-2 px-3 border border-slate-500 w-28">Date/Time</th>
                <th className="py-2 px-3 border border-slate-500 w-36">C. No/C. Name</th>
                <th className="py-2 px-3 border border-slate-500 w-48">Source</th>
                <th className="py-2 px-3 border border-slate-500 w-24">Out Amt.(-)</th>
                <th className="py-2 px-3 border border-slate-500 w-24">In Amt.(+)</th>
                <th className="py-2 px-3 border border-slate-500 w-28">Bal. Amt.</th>
                <th className="py-2 px-3 border border-slate-500 w-24">Out Gold(-)</th>
                <th className="py-2 px-3 border border-slate-500 w-24">In Gold(+)</th>
                <th className="py-2 px-3 border border-slate-500 w-28">Bal. Gold</th>
                <th className="py-2 px-3 border border-slate-500 w-24">Out Silver(-)</th>
                <th className="py-2 px-3 border border-slate-500 w-24">In Silver(+)</th>
                <th className="py-2 px-3 border border-slate-500 w-28">Bal. Silver</th>
                <th className="py-2 px-2 border border-slate-500 w-12">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 text-center">
              {rows.map((r) => (
                <tr key={r.sn} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2 px-2 border-r border-slate-200 font-bold text-slate-700">{r.sn}</td>
                  <td className="py-2 px-3 border-r border-slate-200 text-slate-600 font-mono text-[11px]">{r.dateTime}</td>
                  <td className="py-2 px-3 border-r border-slate-200 font-semibold text-slate-800">{r.customer}</td>
                  <td className="py-2 px-3 border-r border-slate-200 text-left">
                    <span className="font-bold text-slate-800 block">{r.source}</span>
                    {r.subSource && (
                      <span className={`text-[10px] block ${r.subSource.includes('Udhari') ? 'text-amber-800 font-bold' : 'text-slate-500'}`}>
                        {r.subSource}
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-3 border-r border-slate-200 font-mono text-rose-600 font-bold">
                    {r.outAmt > 0 ? `${r.outAmt.toLocaleString('en-IN')} ₹` : '-'}
                  </td>
                  <td className="py-2 px-3 border-r border-slate-200 font-mono text-emerald-700 font-bold">
                    {r.inAmt > 0 ? `${r.inAmt.toLocaleString('en-IN')} ₹` : '-'}
                  </td>
                  <td className="py-2 px-3 border-r border-slate-200 font-mono font-bold text-slate-900">
                    {r.balAmt.toLocaleString('en-IN')} ₹
                  </td>
                  <td className="py-2 px-3 border-r border-slate-200 font-mono text-rose-600 font-bold">
                    {r.outGold > 0 ? `${r.outGold.toFixed(3)} gm` : '-'}
                  </td>
                  <td className="py-2 px-3 border-r border-slate-200 font-mono text-emerald-700 font-bold">
                    {r.inGold > 0 ? `${r.inGold.toFixed(3)} gm` : '-'}
                  </td>
                  <td className="py-2 px-3 border-r border-slate-200 font-mono font-bold text-slate-900">
                    {r.balGold.toFixed(3)} gm
                  </td>
                  <td className="py-2 px-3 border-r border-slate-200 font-mono text-rose-600 font-bold">
                    {r.outSilver > 0 ? `${r.outSilver.toFixed(3)} gm` : '-'}
                  </td>
                  <td className="py-2 px-3 border-r border-slate-200 font-mono text-emerald-700 font-bold">
                    {r.inSilver > 0 ? `${r.inSilver.toFixed(3)} gm` : '-'}
                  </td>
                  <td className="py-2 px-3 border-r border-slate-200 font-mono font-bold text-slate-900">
                    {r.balSilver.toFixed(3)} gm
                  </td>
                  <td className="py-2 px-2 text-center text-slate-400">
                    -
                  </td>
                </tr>
              ))}
            </tbody>

            {/* Footer Summary Matching reference/day_book_1440.png */}
            <tfoot>
              <tr className="bg-slate-600 text-white font-bold text-center border-t-2 border-slate-400">
                <td colSpan={4} className="py-2 px-3 border border-slate-500 bg-slate-600"></td>
                <td className="py-2 px-3 border border-slate-500 bg-white text-slate-900 font-mono font-black">
                  17,91,061 ₹
                </td>
                <td className="py-2 px-3 border border-slate-500 bg-white text-slate-900 font-mono font-black">
                  4,84,195 ₹
                </td>
                <td className="py-2 px-3 border border-slate-500 bg-slate-600"></td>
                <td className="py-2 px-3 border border-slate-500 bg-white text-slate-900 font-mono font-black">
                  232.890 gm
                </td>
                <td className="py-2 px-3 border border-slate-500 bg-white text-slate-900 font-mono font-black">
                  553.000 gm
                </td>
                <td className="py-2 px-3 border border-slate-500 bg-slate-600"></td>
                <td className="py-2 px-3 border border-slate-500 bg-white text-slate-900 font-mono font-black">
                  1,506.176 gm
                </td>
                <td className="py-2 px-3 border border-slate-500 bg-white text-slate-900 font-mono font-black">
                  553.088 gm
                </td>
                <td className="py-2 px-3 border border-slate-500 bg-slate-600"></td>
                <td className="py-2 px-2 border border-slate-500 bg-white text-center">
                  <button
                    onClick={() => window.print()}
                    className="p-1 rounded text-brand-maroon hover:bg-rose-50 inline-flex items-center justify-center"
                    title="Print Day Book"
                  >
                    <Printer className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
