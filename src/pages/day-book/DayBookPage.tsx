import React, { useState, useEffect } from 'react';
import {
  Printer,
  Calendar,
  Lock,
  ChevronDown,
  BookOpen,
} from 'lucide-react';
import { exchangeService } from '../../services/exchangeService';
import { loanService } from '../../services/loanService';
import { expenseService } from '../../services/expenseService';
import { buySellService } from '../../services/buySellService';
import { useStockStore } from '../../store/useStockStore';

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
  const [fromDate, setFromDate] = useState(() => new Date().toISOString().substring(0, 10));
  const [toDate, setToDate] = useState(() => new Date().toISOString().substring(0, 10));
  const [selectedSource, setSelectedSource] = useState('All Sources');
  const [selectedCustomer, setSelectedCustomer] = useState('All Customers');

  const [rows, setRows] = useState<DayBookDetailedRow[]>([]);
  const { summary, fetchStock } = useStockStore();

  useEffect(() => {
    fetchStock();
    async function loadDayBook() {
      try {
        const [exchanges, loans, expenses, buysell] = await Promise.all([
          exchangeService.getAll(),
          loanService.getAll(),
          expenseService.getAll(),
          buySellService.getAll(),
        ]);

        const combined: DayBookDetailedRow[] = [];
        let sn = 1;

        // 1. Exchange POS Txns
        for (const ex of exchanges) {
          combined.push({
            sn: sn++,
            dateTime: ex.dateTime || '',
            customer: `${ex.customerNo || ''} / ${ex.customerName || 'Walk-in'}`,
            source: 'Exchange (G)',
            subSource: `[ Wt: ${(ex.weight || 0).toFixed(3)} | Touch: ${(ex.touch || 0).toFixed(2)}% | Fin: ${(ex.fineGold || 0).toFixed(3)} | Diff: ${(ex.diffGold || 0).toFixed(3)} | Rate: ${(ex.rate || 0).toLocaleString('en-IN')} ]`,
            outAmt: ex.type === 'BUY' ? ex.finalCash || 0 : 0,
            inAmt: ex.type === 'SELL' ? ex.finalCash || 0 : 0,
            balAmt: summary.liquidCash,
            outGold: ex.type === 'SELL' ? ex.diffGold || 0 : 0,
            inGold: ex.type === 'BUY' ? ex.diffGold || 0 : 0,
            balGold: summary.pureGoldStock?.weightGm || 0,
            outSilver: 0,
            inSilver: 0,
            balSilver: summary.silverStock?.weightGm || 0,
          });
        }

        // 2. Loans
        for (const ln of loans) {
          combined.push({
            sn: sn++,
            dateTime: ln.dateTime || '',
            customer: `${ln.customerNo || ''} / ${ln.customerName || 'Customer'}`,
            source: 'Loan (G)',
            subSource: `( ${ln.cash?.type || 'CASH'} / ${ln.gold?.type || 'GOLD'} )`,
            outAmt: ln.cash?.type === 'UDHAR' ? ln.cash.transactionAmount || 0 : 0,
            inAmt: ln.cash?.type === 'JAMA' ? ln.cash.transactionAmount || 0 : 0,
            balAmt: summary.liquidCash,
            outGold: ln.gold?.type === 'UDHAR' ? ln.gold.transactionWeight || 0 : 0,
            inGold: ln.gold?.type === 'JAMA' ? ln.gold.transactionWeight || 0 : 0,
            balGold: summary.pureGoldStock?.weightGm || 0,
            outSilver: 0,
            inSilver: 0,
            balSilver: summary.silverStock?.weightGm || 0,
          });
        }

        // 3. Expenses & Income
        for (const exp of expenses) {
          const totalExpenseCash = (exp.cashAmount || 0) + (exp.onlineAmount || 0) + (exp.bank2Amount || 0);
          combined.push({
            sn: sn++,
            dateTime: exp.dateTime || '',
            customer: exp.partyName || 'Cash Account',
            source: 'Income Expense (G)',
            subSource: exp.reason || '',
            outAmt: exp.type === 'EXPENSE' ? totalExpenseCash : 0,
            inAmt: exp.type === 'INCOME' ? totalExpenseCash : 0,
            balAmt: summary.liquidCash,
            outGold: exp.type === 'EXPENSE' ? exp.goldWeight || 0 : 0,
            inGold: exp.type === 'INCOME' ? exp.goldWeight || 0 : 0,
            balGold: summary.pureGoldStock?.weightGm || 0,
            outSilver: 0,
            inSilver: 0,
            balSilver: summary.silverStock?.weightGm || 0,
          });
        }

        // 4. Bullion Buy/Sell
        for (const bs of buysell) {
          combined.push({
            sn: sn++,
            dateTime: bs.dateTime || '',
            customer: `${bs.customerNo || ''} / ${bs.customerName || 'Bullion Account'}`,
            source: 'Buy/Sell (G)',
            subSource: `[ Rate: ${(bs.rate || 0).toLocaleString('en-IN')} | Wt: ${(bs.weight || 0).toFixed(3)}g ]`,
            outAmt: bs.type === 'BUY' ? bs.netAmount || bs.grossAmount || 0 : 0,
            inAmt: bs.type === 'SELL' ? bs.netAmount || bs.grossAmount || 0 : 0,
            balAmt: summary.liquidCash,
            outGold: bs.type === 'SELL' ? bs.weight || 0 : 0,
            inGold: bs.type === 'BUY' ? bs.weight || 0 : 0,
            balGold: summary.pureGoldStock?.weightGm || 0,
            outSilver: 0,
            inSilver: 0,
            balSilver: summary.silverStock?.weightGm || 0,
          });
        }

        setRows(combined);
      } catch (err) {
        console.error('Error loading day book records:', err);
      }
    }

    loadDayBook();
  }, [fetchStock, summary.liquidCash, summary.pureGoldStock?.weightGm, summary.silverStock?.weightGm]);

  // Filter rows
  const displayRows = rows.filter((r) => {
    if (selectedSource !== 'All Sources' && !r.source.includes(selectedSource)) return false;
    if (selectedCustomer !== 'All Customers' && !r.customer.includes(selectedCustomer)) return false;
    return true;
  });

  // Calculate dynamic totals
  const totalOutAmt = displayRows.reduce((acc, r) => acc + r.outAmt, 0);
  const totalInAmt = displayRows.reduce((acc, r) => acc + r.inAmt, 0);
  const totalOutGold = displayRows.reduce((acc, r) => acc + r.outGold, 0);
  const totalInGold = displayRows.reduce((acc, r) => acc + r.inGold, 0);
  const totalOutSilver = displayRows.reduce((acc, r) => acc + r.outSilver, 0);
  const totalInSilver = displayRows.reduce((acc, r) => acc + r.inSilver, 0);

  return (
    <div className="space-y-3">
      {/* Breadcrumb Bar */}
      <div className="flex items-center space-x-2 text-xs font-bold text-white">
        <div className="bg-brand-maroon px-3 py-1 rounded-l-md">Day Book</div>
        <div className="bg-rose-700 px-3 py-1 rounded-r-md">Detail Day Book</div>
      </div>

      {/* Top Header Controls Bar Matching reference/day_book_1440.png */}
      <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-300 dark:border-slate-700 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div>
          <h2 className="text-base font-extrabold text-slate-800 dark:text-white leading-tight">
            Detailed Day Book
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
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
        </div>
      </div>

      {/* Filters Bar Matching reference/day_book_1440.png */}
      <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-300 dark:border-slate-700 shadow-xs text-xs space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Picker 1 */}
          <div className="flex items-center space-x-1 border border-slate-300 dark:border-slate-600 rounded-lg px-2 py-1.5 bg-slate-50 dark:bg-slate-700/50">
            <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-transparent font-mono text-xs focus:outline-none dark:text-white"
            />
          </div>

          <span className="text-slate-400 font-bold">to</span>

          {/* Date Picker 2 */}
          <div className="flex items-center space-x-1 border border-slate-300 dark:border-slate-600 rounded-lg px-2 py-1.5 bg-slate-50 dark:bg-slate-700/50">
            <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-transparent font-mono text-xs focus:outline-none dark:text-white"
            />
          </div>

          {/* Select Source */}
          <div className="relative">
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="appearance-none border border-slate-300 dark:border-slate-600 rounded-lg pl-3 pr-8 py-1.5 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none"
            >
              <option value="All Sources">All Sources (सभी स्रोत)</option>
              <option value="Exchange">Exchange POS</option>
              <option value="Loan">Loan</option>
              <option value="Income Expense">Income / Expense</option>
              <option value="Buy/Sell">Bullion Buy/Sell</option>
            </select>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Multi-Metal Ledger Table Matching Reference Layout */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 shadow-xs overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              {/* Primary Group Headers */}
              <tr className="bg-slate-700 text-white font-bold text-center border-b border-slate-600">
                <th colSpan={4} className="py-2 px-3 border border-slate-600 bg-slate-700"></th>
                <th colSpan={3} className="py-2 px-3 border border-slate-600 bg-slate-800 text-slate-200 uppercase tracking-wider">
                  Amount
                </th>
                <th colSpan={3} className="py-2 px-3 border border-slate-600 bg-slate-800 text-slate-200 uppercase tracking-wider">
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

            <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-center">
              {displayRows.length === 0 ? (
                <tr>
                  <td colSpan={14} className="py-12 text-center text-slate-400">
                    <BookOpen className="h-8 w-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                    <p className="font-bold text-sm text-slate-600 dark:text-slate-300">
                      No Day Book Transactions Recorded
                    </p>
                    <p className="text-xs text-slate-400">
                      Entries created in Exchange POS, Bullion Buy/Sell, Loan, or Expense will automatically appear here.
                    </p>
                  </td>
                </tr>
              ) : (
                displayRows.map((r) => (
                  <tr key={r.sn} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="py-2 px-2 border-r border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300">{r.sn}</td>
                    <td className="py-2 px-3 border-r border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-mono text-[11px]">{r.dateTime}</td>
                    <td className="py-2 px-3 border-r border-slate-200 dark:border-slate-700 font-semibold text-slate-800 dark:text-white">{r.customer}</td>
                    <td className="py-2 px-3 border-r border-slate-200 dark:border-slate-700 text-left">
                      <span className="font-bold text-slate-800 dark:text-white block">{r.source}</span>
                      {r.subSource && (
                        <span className={`text-[10px] block ${r.subSource.includes('Udhari') ? 'text-amber-800 dark:text-amber-300 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
                          {r.subSource}
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 dark:border-slate-700 font-mono text-rose-600 font-bold">
                      {r.outAmt > 0 ? `${r.outAmt.toLocaleString('en-IN')} ₹` : '-'}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 dark:border-slate-700 font-mono text-emerald-700 font-bold">
                      {r.inAmt > 0 ? `${r.inAmt.toLocaleString('en-IN')} ₹` : '-'}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 dark:border-slate-700 font-mono font-bold text-slate-900 dark:text-white">
                      {r.balAmt.toLocaleString('en-IN')} ₹
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 dark:border-slate-700 font-mono text-rose-600 font-bold">
                      {r.outGold > 0 ? `${r.outGold.toFixed(3)} gm` : '-'}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 dark:border-slate-700 font-mono text-emerald-700 font-bold">
                      {r.inGold > 0 ? `${r.inGold.toFixed(3)} gm` : '-'}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 dark:border-slate-700 font-mono font-bold text-slate-900 dark:text-white">
                      {r.balGold.toFixed(3)} gm
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 dark:border-slate-700 font-mono text-rose-600 font-bold">
                      {r.outSilver > 0 ? `${r.outSilver.toFixed(3)} gm` : '-'}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 dark:border-slate-700 font-mono text-emerald-700 font-bold">
                      {r.inSilver > 0 ? `${r.inSilver.toFixed(3)} gm` : '-'}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 dark:border-slate-700 font-mono font-bold text-slate-900 dark:text-white">
                      {r.balSilver.toFixed(3)} gm
                    </td>
                    <td className="py-2 px-2 text-center text-slate-400">
                      -
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            {/* Footer Summary Matching reference/day_book_1440.png */}
            <tfoot>
              <tr className="bg-slate-600 text-white font-bold text-center border-t-2 border-slate-400">
                <td colSpan={4} className="py-2 px-3 border border-slate-500 bg-slate-600 text-right pr-4">
                  TOTAL
                </td>
                <td className="py-2 px-3 border border-slate-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-black">
                  {totalOutAmt.toLocaleString('en-IN')} ₹
                </td>
                <td className="py-2 px-3 border border-slate-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-black">
                  {totalInAmt.toLocaleString('en-IN')} ₹
                </td>
                <td className="py-2 px-3 border border-slate-500 bg-slate-600"></td>
                <td className="py-2 px-3 border border-slate-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-black">
                  {totalOutGold.toFixed(3)} gm
                </td>
                <td className="py-2 px-3 border border-slate-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-black">
                  {totalInGold.toFixed(3)} gm
                </td>
                <td className="py-2 px-3 border border-slate-500 bg-slate-600"></td>
                <td className="py-2 px-3 border border-slate-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-black">
                  {totalOutSilver.toFixed(3)} gm
                </td>
                <td className="py-2 px-3 border border-slate-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-black">
                  {totalInSilver.toFixed(3)} gm
                </td>
                <td className="py-2 px-3 border border-slate-500 bg-slate-600"></td>
                <td className="py-2 px-2 border border-slate-500 bg-white dark:bg-slate-800 text-center">
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
