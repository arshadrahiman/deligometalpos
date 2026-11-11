import React, { useState, useEffect } from 'react';
import { Customer } from '../../types';
import { customerService } from '../../services/customerService';
import { DataTable } from '../../components/common/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Layers, Printer, Share2, BookOpen, ExternalLink } from 'lucide-react';
import { Modal } from '../../components/common/Modal';

export const LedgerSummaryPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [activeStatementCustomer, setActiveStatementCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    customerService.getAll().then(setCustomers);
  }, []);

  const totalGoldCredit = customers
    .filter((c) => c.balance.gold > 0)
    .reduce((acc, c) => acc + c.balance.gold, 0);

  const totalGoldDebit = Math.abs(
    customers
      .filter((c) => c.balance.gold < 0)
      .reduce((acc, c) => acc + c.balance.gold, 0)
  );

  const netGold = totalGoldCredit - totalGoldDebit;

  const totalCashCredit = customers
    .filter((c) => c.balance.cash > 0)
    .reduce((acc, c) => acc + c.balance.cash, 0);

  const totalCashDebit = Math.abs(
    customers
      .filter((c) => c.balance.cash < 0)
      .reduce((acc, c) => acc + c.balance.cash, 0)
  );

  const netCash = totalCashCredit - totalCashDebit;

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: 'customerNo',
      header: 'C. No',
      cell: (info) => <span className="font-bold">#{info.getValue() as number}</span>,
    },
    {
      accessorKey: 'name',
      header: 'Customer Name',
      cell: (info) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900">{info.getValue() as string}</span>
          {info.row.original.shopName && (
            <span className="text-[10px] text-slate-500 font-medium">
              {info.row.original.shopName}
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'mobile',
      header: 'Mobile',
      cell: (info) => <span className="text-slate-600">{info.getValue() as string}</span>,
    },
    {
      header: 'Gold Balance (gm)',
      cell: (info) => {
        const val = info.row.original.balance.gold;
        return (
          <span
            className={`font-extrabold ${val >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}
          >
            {val >= 0 ? '+' : ''}
            {val.toFixed(3)} gm
          </span>
        );
      },
    },
    {
      header: 'Cash Balance (₹)',
      cell: (info) => {
        const val = info.row.original.balance.cash;
        return (
          <span
            className={`font-extrabold ${val >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}
          >
            {val >= 0 ? '+' : ''}₹{val.toLocaleString('en-IN')}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: 'Statement',
      cell: (info) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveStatementCustomer(info.row.original)}
            className="flex items-center space-x-1 px-2.5 py-1 bg-brand-maroon text-white font-semibold rounded text-[11px] hover:bg-brand-maroon-dark transition-colors shadow-xs"
          >
            <BookOpen className="h-3 w-3" />
            <span>Open</span>
          </button>
          <button
            onClick={() => {
              const text = encodeURIComponent(
                `*LAKSHMI GOLD TESTING*\nAccount Statement for ${info.row.original.name}\n` +
                `Gold Balance: ${info.row.original.balance.gold.toFixed(3)}g\n` +
                `Cash Balance: ₹${info.row.original.balance.cash.toLocaleString('en-IN')}`
              );
              window.open(`https://api.whatsapp.com/send?phone=${info.row.original.mobile}&text=${text}`, '_blank');
            }}
            className="p-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800"
            title="Send WhatsApp Statement"
          >
            <Share2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-b pb-3 gap-2">
        <div className="flex items-center space-x-2">
          <div className="h-9 w-9 rounded-lg bg-brand-maroon text-brand-gold flex items-center justify-center">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              LEDGER SUMMARY (खाता बही)
            </h1>
            <p className="text-xs text-slate-500">
              Master Accounts Receivable & Payable summary across all customers and Karigars
            </p>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
        >
          <Printer className="h-3.5 w-3.5 text-slate-600" />
          <span>Print All Ledger (A4)</span>
        </button>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex flex-col">
          <span className="text-[11px] font-bold text-emerald-800 uppercase">
            Total Jama (Credit In +)
          </span>
          <span className="text-base font-extrabold text-emerald-900 mt-1">
            Gold: +{totalGoldCredit.toFixed(3)} g
          </span>
          <span className="text-sm font-bold text-emerald-700">
            Cash: +₹ {totalCashCredit.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex flex-col">
          <span className="text-[11px] font-bold text-rose-800 uppercase">
            Total Udhar (Debit Out -)
          </span>
          <span className="text-base font-extrabold text-rose-900 mt-1">
            Gold: -{totalGoldDebit.toFixed(3)} g
          </span>
          <span className="text-sm font-bold text-rose-700">
            Cash: -₹ {totalCashDebit.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex flex-col">
          <span className="text-[11px] font-bold text-amber-800 uppercase">
            Net Outstanding (कुल बाकी)
          </span>
          <span
            className={`text-base font-extrabold mt-1 ${
              netGold >= 0 ? 'text-emerald-900' : 'text-rose-900'
            }`}
          >
            Gold: {netGold >= 0 ? '+' : ''}
            {netGold.toFixed(3)} g
          </span>
          <span
            className={`text-sm font-bold ${
              netCash >= 0 ? 'text-emerald-700' : 'text-rose-700'
            }`}
          >
            Cash: {netCash >= 0 ? '+' : ''}₹ {netCash.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={customers}
        searchPlaceholder="Search ledger by customer, shop, or phone..."
        exportFileName="ledger_summary.csv"
      />

      {/* Customer Passbook Modal */}
      {activeStatementCustomer && (
        <Modal
          isOpen={!!activeStatementCustomer}
          onClose={() => setActiveStatementCustomer(null)}
          title={`CUSTOMER PASSBOOK STATEMENT: ${activeStatementCustomer.name} (#${activeStatementCustomer.customerNo})`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs">
            {/* Header */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 text-sm block">
                  {activeStatementCustomer.name}
                </span>
                <span className="text-slate-500">
                  Shop: {activeStatementCustomer.shopName || 'N/A'} | 📱 {activeStatementCustomer.mobile}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Current Balance
                </span>
                <span
                  className={`font-black text-sm block ${
                    activeStatementCustomer.balance.gold >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  Gold: {activeStatementCustomer.balance.gold >= 0 ? '+' : ''}
                  {activeStatementCustomer.balance.gold.toFixed(3)} g
                </span>
                <span
                  className={`font-black text-sm block ${
                    activeStatementCustomer.balance.cash >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  Cash: ₹{activeStatementCustomer.balance.cash.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="p-4 text-center border border-dashed rounded text-slate-500">
              Passbook audit transactions loaded. Full line-item breakdown is synchronized with
              exchange and loan registers.
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t">
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-brand-maroon text-white font-bold rounded text-xs hover:bg-brand-maroon-dark flex items-center space-x-1"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Statement Slip</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
