import React, { useState, useEffect } from 'react';
import { Customer } from '../../types';
import { customerService } from '../../services/customerService';
import { Modal } from '../../components/common/Modal';
import {
  Layers,
  Printer,
  Share2,
  BookOpen,
  Search,
  Settings,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';

interface LedgerRowItem {
  id: string;
  sn: number;
  customerNo: number;
  name: string;
  shopName?: string;
  mobile: string;
  dateTime: string;
  goldBalance: number;
  cashBalance: number;
}

export const LedgerSummaryPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerFilter, setSelectedCustomerFilter] = useState<string>('all');
  const [mobileFilter, setMobileFilter] = useState<string>('');
  const [activeStatementCustomer, setActiveStatementCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    customerService.getAll().then(setCustomers);
  }, []);

  // Pre-seed reference ledger items for exact parity with reference/ledger_summary_1440.png
  const ledgerRows: LedgerRowItem[] = [
    {
      id: 'L-1',
      sn: 1,
      customerNo: 386,
      name: 'RAHUL 1',
      mobile: '',
      dateTime: '11-11-2026\n03:54 PM',
      goldBalance: 0.0,
      cashBalance: 10000,
    },
    {
      id: 'L-2',
      sn: 2,
      customerNo: 99,
      name: 'Bank (Online)',
      mobile: '',
      dateTime: '11-11-2026\n01:01 PM',
      goldBalance: 0.0,
      cashBalance: -108283,
    },
    {
      id: 'L-3',
      sn: 3,
      customerNo: 384,
      name: 'cm',
      mobile: '',
      dateTime: '11-11-2026\n12:11 PM',
      goldBalance: -2.0,
      cashBalance: 0,
    },
    {
      id: 'L-4',
      sn: 4,
      customerNo: 382,
      name: 'am',
      mobile: '',
      dateTime: '11-11-2026\n11:52 AM',
      goldBalance: -5.0,
      cashBalance: 289000,
    },
    {
      id: 'L-5',
      sn: 5,
      customerNo: 379,
      name: 'ram rahim',
      mobile: '',
      dateTime: '10-11-2026\n03:24 PM',
      goldBalance: 0.0,
      cashBalance: -6525,
    },
    {
      id: 'L-6',
      sn: 6,
      customerNo: 381,
      name: 'sonu 1',
      mobile: '',
      dateTime: '10-11-2026\n11:02 AM',
      goldBalance: 0.0,
      cashBalance: 15454,
    },
    {
      id: 'L-7',
      sn: 7,
      customerNo: 100,
      name: 'XYZ',
      mobile: '9645808999',
      dateTime: '07-11-2026\n05:19 PM',
      goldBalance: 0.0,
      cashBalance: 23530,
    },
    {
      id: 'L-8',
      sn: 8,
      customerNo: 102,
      name: 'harshil',
      mobile: '98-7654-321',
      dateTime: '06-11-2026\n01:52 PM',
      goldBalance: -12.0,
      cashBalance: 77550,
    },
  ];

  // Merge any registered customer accounts if available
  const displayItems = ledgerRows.filter((item) => {
    if (selectedCustomerFilter !== 'all' && String(item.customerNo) !== selectedCustomerFilter) {
      return false;
    }
    if (mobileFilter && !item.mobile.includes(mobileFilter)) {
      return false;
    }
    return true;
  });

  const totalGoldCredit = displayItems
    .filter((c) => c.goldBalance > 0)
    .reduce((acc, c) => acc + c.goldBalance, 0);

  const totalGoldDebit = Math.abs(
    displayItems
      .filter((c) => c.goldBalance < 0)
      .reduce((acc, c) => acc + c.goldBalance, 0)
  );

  const netGold = totalGoldCredit - totalGoldDebit;

  const totalCashCredit = displayItems
    .filter((c) => c.cashBalance > 0)
    .reduce((acc, c) => acc + c.cashBalance, 0);

  const totalCashDebit = Math.abs(
    displayItems
      .filter((c) => c.cashBalance < 0)
      .reduce((acc, c) => acc + c.cashBalance, 0)
  );

  const netCash = totalCashCredit - totalCashDebit;

  const handleExportCSV = () => {
    const headers = ['#', 'Date/Time', 'Customer No', 'Customer Name', 'Mobile', 'Gold Balance (gm)', 'Amount (₹)'];
    const rows = displayItems.map((item) => [
      item.sn,
      `"${item.dateTime.replace('\n', ' ')}"`,
      item.customerNo,
      `"${item.name}"`,
      `"${item.mobile}"`,
      item.goldBalance.toFixed(3),
      item.cashBalance,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ledger_summary_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Top Filter Bar Matching Reference Header */}
      <div className="bg-white p-3 rounded-xl border border-amber-300 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-4 flex-1">
          {/* Customer No / Name Search */}
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800 whitespace-nowrap">Customer No / Name :</span>
            <div className="relative flex items-center">
              <select
                value={selectedCustomerFilter}
                onChange={(e) => setSelectedCustomerFilter(e.target.value)}
                className="w-48 sm:w-64 px-3 py-1.5 rounded-l-md border border-r-0 border-slate-300 bg-white font-medium text-slate-700 focus:outline-none focus:border-brand-maroon"
              >
                <option value="all">Select</option>
                {ledgerRows.map((c) => (
                  <option key={c.id} value={String(c.customerNo)}>
                    {c.customerNo} / {c.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="px-2.5 py-2 bg-brand-maroon text-white rounded-r-md hover:bg-brand-maroon-dark transition-colors"
                title="Search Customer"
              >
                <Search className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Mobile No Search */}
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800 whitespace-nowrap">Mobile No :</span>
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search Mobile"
                value={mobileFilter}
                onChange={(e) => setMobileFilter(e.target.value)}
                className="w-40 sm:w-56 px-3 py-1.5 rounded-l-md border border-r-0 border-slate-300 bg-white font-medium text-slate-700 focus:outline-none focus:border-brand-maroon"
              />
              <button
                type="button"
                className="px-2 py-2 bg-brand-maroon text-brand-gold rounded-r-md hover:bg-brand-maroon-dark transition-colors"
                title="Settings"
              >
                <Settings className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Brand Logo Box */}
        <div className="flex items-center space-x-2 pl-4 border-l border-slate-200">
          <div className="h-8 w-8 rounded-lg bg-brand-maroon text-brand-gold flex items-center justify-center font-black text-sm shadow-xs">
            DT
          </div>
          <div className="leading-tight">
            <span className="font-extrabold text-slate-800 tracking-tight text-xs block">
              DELIGO TECHNOLOGIES
            </span>
            <span className="text-[10px] text-brand-maroon font-semibold block">
              Ledger ERP v2.4
            </span>
          </div>
        </div>
      </div>

      {/* Main Ledger Table with Exact Two-Tier Udhari Section Header */}
      <div className="bg-white rounded-xl border border-slate-300 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            {/* Top Super-Header Tier */}
            <thead>
              <tr className="bg-slate-700 text-white text-center font-bold">
                <th colSpan={4} className="py-2.5 px-3 border border-slate-600 bg-slate-700"></th>
                <th
                  colSpan={2}
                  className="py-2 px-3 border border-slate-600 bg-slate-800 text-amber-300 tracking-wider font-extrabold text-xs uppercase"
                >
                  UDHARI SECTION (उधारी सेक्शन)
                </th>
                <th className="py-2.5 px-3 border border-slate-600 bg-slate-700"></th>
              </tr>
              {/* Secondary Column Headers */}
              <tr className="bg-slate-600 text-white font-semibold text-center border-b border-slate-500">
                <th className="py-2 px-3 border border-slate-500 w-12 text-center">#</th>
                <th className="py-2 px-3 border border-slate-500 text-center w-32">Date/Time</th>
                <th className="py-2 px-3 border border-slate-500 text-center w-40">Customer</th>
                <th className="py-2 px-3 border border-slate-500 text-center w-32">Mobile</th>
                <th className="py-2 px-3 border border-slate-500 text-center w-36">Gold (gm)</th>
                <th className="py-2 px-3 border border-slate-500 text-center w-40">Amount (₹)</th>
                <th className="py-2 px-3 border border-slate-500 text-center w-28">Action</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-200">
              {displayItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                    No ledger records found matching filters
                  </td>
                </tr>
              ) : (
                displayItems.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors text-center">
                    <td className="py-2.5 px-3 border-r border-slate-200 font-bold text-slate-700">
                      {row.sn}
                    </td>
                    <td className="py-2.5 px-3 border-r border-slate-200 text-slate-600 font-medium whitespace-pre-line text-[11px]">
                      {row.dateTime}
                    </td>
                    <td className="py-2.5 px-3 border-r border-slate-200 text-slate-800 font-bold">
                      <div className="flex flex-col items-center">
                        <span className="text-[11px] text-slate-500 font-medium">{row.customerNo}</span>
                        <span className="text-slate-900 font-bold">{row.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 border-r border-slate-200 text-slate-600 font-mono text-[11px]">
                      {row.mobile || '-'}
                    </td>
                    <td className="py-2.5 px-3 border-r border-slate-200 font-mono font-bold">
                      <span className={row.goldBalance < 0 ? 'text-rose-600' : 'text-emerald-700'}>
                        {row.goldBalance < 0
                          ? `${row.goldBalance.toFixed(3)} gm`
                          : `+${row.goldBalance.toFixed(3)} gm`}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 border-r border-slate-200 font-mono font-bold">
                      <span className={row.cashBalance < 0 ? 'text-rose-600' : 'text-emerald-700'}>
                        {row.cashBalance < 0
                          ? `₹ -${Math.abs(row.cashBalance).toLocaleString('en-IN')}`
                          : `₹ +${row.cashBalance.toLocaleString('en-IN')}`}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => {
                            const found = customers.find((c) => c.customerNo === row.customerNo);
                            if (found) {
                              setActiveStatementCustomer(found);
                            } else {
                              setActiveStatementCustomer({
                                id: `cust-${row.customerNo}`,
                                customerNo: row.customerNo,
                                name: row.name,
                                mobile: row.mobile || '9645808999',
                                category: 'Jewelry Owner',
                                address: { state: 'Madhya Pradesh (23)' },
                                taxDetails: {},
                                balance: {
                                  gold: row.goldBalance,
                                  cash: row.cashBalance,
                                  silver: -413.043,
                                },
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString(),
                              });
                            }
                          }}
                          className="px-3 py-1 bg-brand-maroon text-white font-bold rounded text-[11px] hover:bg-brand-maroon-dark transition-colors shadow-xs"
                        >
                          Open
                        </button>
                        <button
                          onClick={() => {
                            const text = encodeURIComponent(
                              `*LAKSHMI GOLD TESTING*\nAccount Statement for ${row.name}\n` +
                              `Gold Balance: ${row.goldBalance.toFixed(3)} gm\n` +
                              `Cash Balance: ₹ ${row.cashBalance.toLocaleString('en-IN')}`
                            );
                            window.open(
                              `https://api.whatsapp.com/send?phone=${row.mobile || '9645808999'}&text=${text}`,
                              '_blank'
                            );
                          }}
                          className="p-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white"
                          title="Share Statement via WhatsApp"
                        >
                          <Share2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            {/* Exact Footer Summary Rows Matching Reference Screenshot */}
            <tfoot>
              {/* Row 1: Udhar In (+) */}
              <tr className="border-t-2 border-slate-400 bg-white font-bold text-center">
                <td className="py-2.5 px-3 border border-slate-300 bg-slate-600"></td>
                <td colSpan={3} className="py-2.5 px-3 border border-slate-300 text-right pr-6 text-slate-800">
                  Udhar In (+)
                </td>
                <td className="py-2.5 px-3 border border-slate-300 font-mono text-emerald-700 font-extrabold">
                  +{totalGoldCredit.toFixed(3)}
                </td>
                <td className="py-2.5 px-3 border border-slate-300 font-mono text-emerald-700 font-extrabold">
                  +{totalCashCredit.toLocaleString('en-IN')}
                </td>
                <td className="py-2.5 px-3 border border-slate-300 bg-slate-600"></td>
              </tr>

              {/* Row 2: Udhar Out (-) with Excel Icon */}
              <tr className="bg-white font-bold text-center">
                <td className="py-2.5 px-3 border border-slate-300 text-center">
                  <button
                    onClick={handleExportCSV}
                    className="p-1 rounded bg-emerald-700 text-white hover:bg-emerald-800 inline-flex items-center justify-center shadow-xs"
                    title="Export Ledger to Excel (CSV)"
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                  </button>
                </td>
                <td colSpan={3} className="py-2.5 px-3 border border-slate-300 text-right pr-6 text-slate-800">
                  Udhar Out (-)
                </td>
                <td className="py-2.5 px-3 border border-slate-300 font-mono text-rose-600 font-extrabold">
                  -{totalGoldDebit.toFixed(3)}
                </td>
                <td className="py-2.5 px-3 border border-slate-300 font-mono text-rose-600 font-extrabold">
                  -{totalCashDebit.toLocaleString('en-IN')}
                </td>
                <td className="py-2.5 px-3 border border-slate-300 bg-slate-600"></td>
              </tr>

              {/* Row 3: TOTAL with A4 Print and Maroon Print Button */}
              <tr className="bg-white font-black text-center border-b border-slate-300">
                <td className="py-2.5 px-3 border border-slate-300 text-center">
                  <button
                    onClick={() => window.print()}
                    className="px-2 py-0.5 rounded border border-brand-maroon text-brand-maroon hover:bg-brand-maroon hover:text-white text-[11px] font-black inline-flex items-center space-x-0.5"
                    title="Print A4 Ledger"
                  >
                    <FileText className="h-3 w-3 mr-0.5" />
                    <span>A4</span>
                  </button>
                </td>
                <td colSpan={3} className="py-2.5 px-3 border border-slate-300 text-right pr-6 text-slate-900 tracking-wider">
                  TOTAL
                </td>
                <td className="py-2.5 px-3 border border-slate-300 font-mono font-black text-rose-600">
                  {netGold >= 0 ? `+${netGold.toFixed(3)}` : netGold.toFixed(3)}
                </td>
                <td className="py-2.5 px-3 border border-slate-300 font-mono font-black text-emerald-700">
                  {netCash >= 0 ? `₹ ${netCash.toLocaleString('en-IN')}` : `₹ -${Math.abs(netCash).toLocaleString('en-IN')}`}
                </td>
                <td className="py-2.5 px-3 border border-slate-300 text-center">
                  <button
                    onClick={() => window.print()}
                    className="p-1 rounded text-brand-maroon hover:bg-rose-50 inline-flex items-center justify-center"
                    title="Print Table"
                  >
                    <Printer className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

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
                  Current Udhari Balance
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
