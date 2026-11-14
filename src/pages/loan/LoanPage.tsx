import React, { useState, useEffect } from 'react';
import { Customer, LoanEntry } from '../../types';
import { loanService } from '../../services/loanService';
import { useUIStore } from '../../store/useUIStore';
import { useMetalStore } from '../../store/useMetalStore';
import {
  convertCashToGold,
  convertGoldToCash,
  convertCashToSilver,
  convertSilverToCash,
} from '../../utils/calculations/bullionMath';
import {
  BookOpen,
  Plus,
  List,
  Save,
  Printer,
  Share2,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Search,
} from 'lucide-react';

interface ReferenceLoanListItem {
  sn: number;
  dateTime: string;
  customerNo: number;
  customerName: string;
  source: string;
  oldGold: number;
  goldOut: number;
  goldIn: number;
  finalGold: number;
  oldAmt: number;
  amtOut: number;
  amtIn: number;
  finalAmt: number;
  bhavcut: string;
}

export const LoanPage: React.FC = () => {
  const { showToast, openBhavcutModal } = useUIStore();
  const { metalMode } = useMetalStore();
  const isSilver = metalMode === 'SILVER';

  const [activeTab, setActiveTab] = useState<'FORM' | 'LIST'>('FORM');
  const [entries, setEntries] = useState<LoanEntry[]>([]);

  // Form Fields
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('CUST-100');
  const [customerSearch, setCustomerSearch] = useState<string>('100 / XYZ');

  // Active Metal Inputs: Udhar (-) vs Jama (+)
  const [metalUdhar, setMetalUdhar] = useState<number>(0.0);
  const [metalJama, setMetalJama] = useState<number>(0.0);

  // Cash Inputs: Udhar (-) vs Jama (+)
  const [cashUdhar, setCashUdhar] = useState<number>(0);
  const [onlineUdhar, setOnlineUdhar] = useState<number>(0);
  const [bank2Udhar, setBank2Udhar] = useState<number>(0);

  const [cashJama, setCashJama] = useState<number>(0);
  const [onlineJama, setOnlineJama] = useState<number>(0);
  const [bank2Jama, setBank2Jama] = useState<number>(0);

  // Inline Bhavcut
  const [bhavcutAmt, setBhavcutAmt] = useState<number>(0);
  const [bhavcutMetal, setBhavcutMetal] = useState<number>(0);
  const [rate, setRate] = useState<number>(isSilver ? 95000 : 80000);

  const [narration, setNarration] = useState<string>('');

  useEffect(() => {
    setRate(isSilver ? 95000 : 80000);
  }, [isSilver]);

  // List View Filters
  const [fromDate, setFromDate] = useState<string>('2026-11-11');
  const [toDate, setToDate] = useState<string>('2026-11-11');
  const [listCustomerFilter, setListCustomerFilter] = useState<string>('all');

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    const list = await loanService.getAll();
    setEntries(list);
  };

  // Seed reference data matching reference/loan_list_1440.png
  const referenceListRows: ReferenceLoanListItem[] = [
    {
      sn: 1,
      dateTime: '11-11-2026\n03 : 54 : pm',
      customerNo: 386,
      customerName: 'RAHUL 1',
      source: 'Exchange',
      oldGold: 0.0,
      goldOut: 0,
      goldIn: 0,
      finalGold: 0.0,
      oldAmt: 0,
      amtOut: 0,
      amtIn: 10000,
      finalAmt: 10000,
      bhavcut: '-',
    },
    {
      sn: 2,
      dateTime: '11-11-2026\n01 : 01 : pm',
      customerNo: 99,
      customerName: 'Bank (Online)',
      source: 'Income Expense',
      oldGold: 0.0,
      goldOut: 0,
      goldIn: 0,
      finalGold: 0.0,
      oldAmt: -98283,
      amtOut: 10000,
      amtIn: 0,
      finalAmt: -108283,
      bhavcut: '-',
    },
    {
      sn: 3,
      dateTime: '11-11-2026\n01 : 00 : pm',
      customerNo: 99,
      customerName: 'Bank (Online)',
      source: 'Loan',
      oldGold: 0.0,
      goldOut: 0,
      goldIn: 0,
      finalGold: 0.0,
      oldAmt: -48283,
      amtOut: 50000,
      amtIn: 0,
      finalAmt: -98283,
      bhavcut: '-',
    },
    {
      sn: 4,
      dateTime: '11-11-2026\n12 : 59 : pm',
      customerNo: 99,
      customerName: 'Bank (Online)',
      source: 'Loan',
      oldGold: 0.0,
      goldOut: 0,
      goldIn: 0,
      finalGold: 0.0,
      oldAmt: 1717,
      amtOut: 50000,
      amtIn: 0,
      finalAmt: -48283,
      bhavcut: '-',
    },
    {
      sn: 5,
      dateTime: '11-11-2026\n12 : 11 : pm',
      customerNo: 384,
      customerName: 'cm',
      source: 'Loan',
      oldGold: -10.0,
      goldOut: 0,
      goldIn: 8.0,
      finalGold: -2.0,
      oldAmt: 0,
      amtOut: 0,
      amtIn: 0,
      finalAmt: 0,
      bhavcut: '-',
    },
  ];

  // Old balances for customer 100 / XYZ
  const oldGold = 0.0;
  const oldCash = 23530;
  const oldSilver = -413.043;
  const oldSilverAmt = 0;

  // Real-time calculations matching reference
  const currentOldMetal = isSilver ? oldSilver : oldGold;
  const netMetalDelta = Math.round((metalJama - metalUdhar) * 1000) / 1000;
  const finalMetal = Math.round((currentOldMetal + netMetalDelta) * 1000) / 1000;

  const totalCashUdhar = (cashUdhar || 0) + (onlineUdhar || 0) + (bank2Udhar || 0);
  const totalCashJama = (cashJama || 0) + (onlineJama || 0) + (bank2Jama || 0);
  const netCashDelta = totalCashJama - totalCashUdhar;
  const finalCash = Math.round((oldCash + netCashDelta) * 100) / 100;

  const handleInlineBhavcutAmtToMetal = () => {
    if (!bhavcutAmt || !rate) return;
    const g = isSilver ? convertCashToSilver(bhavcutAmt, rate) : convertCashToGold(bhavcutAmt, rate);
    setBhavcutMetal(g);
    showToast(`Converted ₹${bhavcutAmt.toLocaleString('en-IN')} to ${g.toFixed(3)} gm ${isSilver ? 'Silver' : 'Gold'}`);
  };

  const handleInlineBhavcutMetalToAmt = () => {
    if (!bhavcutMetal || !rate) return;
    const c = isSilver ? convertSilverToCash(bhavcutMetal, rate) : convertGoldToCash(bhavcutMetal, rate);
    setBhavcutAmt(c);
    showToast(`Converted ${bhavcutMetal.toFixed(3)} gm ${isSilver ? 'Silver' : 'Gold'} to ₹${c.toLocaleString('en-IN')}`);
  };

  const handleSave = async () => {
    const newEntry = await loanService.create({
      customerId: selectedCustomerId,
      customerNo: 100,
      customerName: customerSearch,
      gold: {
        oldBalance: isSilver ? oldGold : currentOldMetal,
        type: metalJama > 0 ? 'JAMA' : 'UDHAR',
        transactionWeight: metalJama > 0 ? metalJama : metalUdhar,
        newBalance: isSilver ? oldGold : finalMetal,
      },
      cash: {
        oldBalance: oldCash,
        type: totalCashJama > 0 ? 'JAMA' : 'UDHAR',
        transactionAmount: totalCashJama > 0 ? cashJama : cashUdhar,
        onlineAmount: totalCashJama > 0 ? onlineJama : onlineUdhar,
        bank2Amount: totalCashJama > 0 ? bank2Jama : bank2Udhar,
        newBalance: finalCash,
      },
      silver: isSilver ? {
        oldBalance: oldSilver,
        transactionWeight: metalJama > 0 ? metalJama : metalUdhar,
        newBalance: finalMetal,
      } : undefined,
      narration: narration || 'Udhari / Loan account entry',
    });

    showToast(`Udhari ledger entry #${newEntry.transactionNo} created!`);
    loadEntries();
    setMetalUdhar(0);
    setMetalJama(0);
    setCashUdhar(0);
    setOnlineUdhar(0);
    setBank2Udhar(0);
    setCashJama(0);
    setOnlineJama(0);
    setBank2Jama(0);
    setNarration('');
  };

  return (
    <div className="space-y-4">
      {activeTab === 'FORM' ? (
        <div className="space-y-4">
          {/* Top Form Header Matching reference/loan_form_1440.png */}
          <div className="bg-white p-3 rounded-xl border border-amber-300 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Customer Search with red + button */}
            <div className="flex items-center space-x-2 flex-1 max-w-lg">
              <div className="relative flex items-center w-full">
                <Search className="absolute left-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  placeholder="Customer No / Name"
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 bg-white font-bold text-slate-800 text-xs focus:outline-none focus:border-brand-maroon"
                />
              </div>
              <button
                type="button"
                className="h-8 w-8 rounded-full bg-rose-600 text-white flex items-center justify-center hover:bg-rose-700 shrink-0 shadow-xs"
                title="Add New Customer"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* List Button (Maroon Rounded Pill) */}
            <div>
              <button
                onClick={() => setActiveTab('LIST')}
                className="flex items-center space-x-1.5 px-4 py-1.5 bg-brand-maroon text-white font-bold rounded-full hover:bg-brand-maroon-dark transition-all text-xs shadow-xs"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>List</span>
              </button>
            </div>

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
                  Loan & Udhari Ledger
                </span>
              </div>
            </div>
          </div>

          {/* Dual Panel Layout: (सोना) GOLD on Left, (पैसे) CASH on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Box 1: (सोना) GOLD vs (चाँदी) SILVER */}
            <div className={`bg-white rounded-xl border-2 ${isSilver ? 'border-slate-300' : 'border-amber-300'} shadow-xs p-4 space-y-4`}>
              <div className="text-center">
                <h3 className="text-base font-black text-slate-900 tracking-wide">
                  {isSilver ? '(चाँदी) SILVER' : '(सोना) GOLD'}
                </h3>
              </div>

              {/* Old Balances */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 w-28 text-right pr-2">
                    (पुराना) OLD :
                  </span>
                  <div className="flex-1 px-3 py-1.5 rounded border border-emerald-400 bg-emerald-50/30 text-emerald-800 font-bold font-mono">
                    {isSilver ? oldSilver.toFixed(3) : oldGold.toFixed(3)}
                  </div>
                  <span className="font-bold text-slate-700 w-10 pl-2">gm</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 w-28 text-right pr-2">
                    {isSilver ? 'Gold Old' : 'Silver Old'}
                  </span>
                  <div className="flex-1 px-3 py-1.5 rounded border border-rose-400 bg-rose-50/30 text-rose-700 font-bold font-mono">
                    {isSilver ? oldGold.toFixed(3) : oldSilver.toFixed(3)}
                  </div>
                  <span className="font-bold text-slate-700 w-10 pl-2">gm</span>
                </div>
              </div>

              {/* Udhar/Out (-) vs Jama/In (+) Matrix */}
              <div className="pt-2">
                <div className="grid grid-cols-5 items-center gap-2 text-xs">
                  <div className="col-span-2">
                    <label className="block text-center font-bold text-slate-700 mb-1 text-[11px]">
                      Udhar/Out (-)
                    </label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        step="0.001"
                        value={metalUdhar || ''}
                        onChange={(e) => setMetalUdhar(Number(e.target.value))}
                        placeholder="0.000"
                        className="w-full px-2.5 py-1.5 text-xs rounded border border-rose-400 text-rose-700 font-bold font-mono focus:outline-none"
                      />
                      <span className="ml-1 text-[11px] font-bold text-slate-600">gm</span>
                    </div>
                  </div>

                  <div className="text-center font-bold text-slate-600 text-[11px]">
                    NEW
                  </div>

                  <div className="col-span-2">
                    <label className="block text-center font-bold text-slate-700 mb-1 text-[11px]">
                      Jama/In (+)
                    </label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        step="0.001"
                        value={metalJama || ''}
                        onChange={(e) => setMetalJama(Number(e.target.value))}
                        placeholder="0.000"
                        className="w-full px-2.5 py-1.5 text-xs rounded border border-emerald-400 text-emerald-700 font-bold font-mono focus:outline-none"
                      />
                      <span className="ml-1 text-[11px] font-bold text-slate-600">gm</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* FINAL Row */}
              <div className="pt-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 w-28 text-right pr-2">
                    FINAL :
                  </span>
                  <div className="flex-1 px-3 py-2 rounded-lg border-2 border-emerald-400 bg-emerald-50/50 text-emerald-900 font-extrabold font-mono text-sm">
                    {((isSilver ? oldSilver : oldGold) + (metalJama - metalUdhar)).toFixed(3)}
                  </div>
                  <span className="font-bold text-slate-700 w-10 pl-2">gm</span>
                </div>
              </div>
            </div>

            {/* Box 2: (पैसे) CASH */}
            <div className="bg-white rounded-xl border-2 border-amber-300 shadow-xs p-4 space-y-4">
              <div className="flex items-center justify-center space-x-1.5">
                <h3 className="text-base font-black text-slate-900 tracking-wide">
                  (पैसे) CASH
                </h3>
                <span className="h-4 w-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                  +
                </span>
              </div>

              {/* Old Balances */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 w-28 text-right pr-2">
                    (पुराना) OLD :
                  </span>
                  <div className="flex-1 px-3 py-1.5 rounded border border-emerald-400 bg-emerald-50/30 text-emerald-800 font-bold font-mono">
                    {oldCash.toLocaleString('en-IN')}
                  </div>
                  <span className="font-bold text-slate-700 w-10 pl-2">₹</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 w-28 text-right pr-2">
                    Old Silver Amt
                  </span>
                  <div className="flex-1 px-3 py-1.5 rounded border border-emerald-400 bg-emerald-50/30 text-emerald-800 font-bold font-mono">
                    {oldSilverAmt}
                  </div>
                  <span className="font-bold text-slate-700 w-10 pl-2">₹</span>
                </div>
              </div>

              {/* Split Payment Rows: CASH, ONLINE, SELF BANK 2 */}
              <div className="space-y-2 pt-1 text-xs">
                {/* Header labels */}
                <div className="grid grid-cols-5 text-center font-bold text-slate-700 text-[11px]">
                  <span className="col-span-2">Udhar/Out (-)</span>
                  <span></span>
                  <span className="col-span-2">Jama/In(+)</span>
                </div>

                {/* CASH Row */}
                <div className="grid grid-cols-5 items-center gap-1.5">
                  <div className="col-span-2 flex items-center">
                    <input
                      type="number"
                      value={cashUdhar || ''}
                      onChange={(e) => setCashUdhar(Number(e.target.value))}
                      placeholder="0"
                      className="w-full px-2 py-1 text-xs rounded border border-rose-400 text-rose-700 font-bold font-mono focus:outline-none"
                    />
                    <span className="ml-1 text-[11px] font-bold text-slate-600">₹</span>
                  </div>
                  <div className="text-center font-bold text-slate-700 text-[11px]">
                    CASH
                  </div>
                  <div className="col-span-2 flex items-center">
                    <input
                      type="number"
                      value={cashJama || ''}
                      onChange={(e) => setCashJama(Number(e.target.value))}
                      placeholder="0"
                      className="w-full px-2 py-1 text-xs rounded border border-emerald-400 text-emerald-700 font-bold font-mono focus:outline-none"
                    />
                    <span className="ml-1 text-[11px] font-bold text-slate-600">₹</span>
                  </div>
                </div>

                {/* ONLINE Row */}
                <div className="grid grid-cols-5 items-center gap-1.5">
                  <div className="col-span-2 flex items-center">
                    <input
                      type="number"
                      value={onlineUdhar || ''}
                      onChange={(e) => setOnlineUdhar(Number(e.target.value))}
                      placeholder="0"
                      className="w-full px-2 py-1 text-xs rounded border border-rose-400 text-rose-700 font-bold font-mono focus:outline-none"
                    />
                    <span className="ml-1 text-[11px] font-bold text-slate-600">₹</span>
                  </div>
                  <div className="text-center font-bold text-slate-700 text-[11px]">
                    ONLINE
                  </div>
                  <div className="col-span-2 flex items-center">
                    <input
                      type="number"
                      value={onlineJama || ''}
                      onChange={(e) => setOnlineJama(Number(e.target.value))}
                      placeholder="0"
                      className="w-full px-2 py-1 text-xs rounded border border-emerald-400 text-emerald-700 font-bold font-mono focus:outline-none"
                    />
                    <span className="ml-1 text-[11px] font-bold text-slate-600">₹</span>
                  </div>
                </div>

                {/* SELF BANK 2 Row */}
                <div className="grid grid-cols-5 items-center gap-1.5">
                  <div className="col-span-2 flex items-center">
                    <input
                      type="number"
                      value={bank2Udhar || ''}
                      onChange={(e) => setBank2Udhar(Number(e.target.value))}
                      placeholder="0"
                      className="w-full px-2 py-1 text-xs rounded border border-rose-400 text-rose-700 font-bold font-mono focus:outline-none"
                    />
                    <span className="ml-1 text-[11px] font-bold text-slate-600">₹</span>
                  </div>
                  <div className="text-center font-bold text-slate-700 text-[10px] whitespace-nowrap">
                    SELF BANK 2
                  </div>
                  <div className="col-span-2 flex items-center">
                    <input
                      type="number"
                      value={bank2Jama || ''}
                      onChange={(e) => setBank2Jama(Number(e.target.value))}
                      placeholder="0"
                      className="w-full px-2 py-1 text-xs rounded border border-emerald-400 text-emerald-700 font-bold font-mono focus:outline-none"
                    />
                    <span className="ml-1 text-[11px] font-bold text-slate-600">₹</span>
                  </div>
                </div>
              </div>

              {/* FINAL CASH Row */}
              <div className="pt-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 w-28 text-right pr-2">
                    FINAL :
                  </span>
                  <div className="flex-1 px-3 py-2 rounded-lg border-2 border-emerald-400 bg-emerald-50/50 text-emerald-900 font-extrabold font-mono text-sm">
                    {finalCash.toLocaleString('en-IN')}
                  </div>
                  <span className="font-bold text-slate-700 w-10 pl-2">₹</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rate Selector, Narration, WhatsApp, Printer & P. Bhavcut */}
          <div className="space-y-3 pt-2">
            {/* Center Rate Box */}
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full border border-slate-300 shadow-xs">
                <button
                  type="button"
                  onClick={handleInlineBhavcutAmtToMetal}
                  className="p-1 rounded-full bg-brand-maroon text-white hover:bg-brand-maroon-dark"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <input
                  type="number"
                  value={bhavcutAmt || ''}
                  onChange={(e) => setBhavcutAmt(Number(e.target.value))}
                  placeholder="0"
                  className="w-24 text-center font-bold text-xs border-b border-slate-300 focus:outline-none"
                />
                <span className="text-xs font-bold text-slate-600">
                  {isSilver ? '₹/1kg' : '₹/10gm'}
                </span>
                <button
                  type="button"
                  onClick={handleInlineBhavcutMetalToAmt}
                  className="p-1 rounded-full bg-brand-maroon text-white hover:bg-brand-maroon-dark"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Narration Box with icons */}
            <div className="relative">
              <textarea
                rows={2}
                value={narration}
                onChange={(e) => setNarration(e.target.value)}
                placeholder="Write Narration/Remark"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white shadow-xs focus:outline-none focus:border-brand-maroon leading-relaxed"
              />

              {/* Action Buttons beneath/around textarea */}
              <div className="flex items-center justify-between mt-2">
                <button
                  type="button"
                  onClick={() => {
                    const text = encodeURIComponent(
                      `*DELIGO TECHNOLOGIES - UDHARI STATEMENT*\n` +
                      `Customer: ${customerSearch}\n` +
                      `${isSilver ? 'Silver' : 'Gold'} Balance: ${finalMetal.toFixed(3)} gm\n` +
                      `Cash Balance: ₹ ${finalCash.toLocaleString('en-IN')}`
                    );
                    window.open(`https://api.whatsapp.com/send?phone=9645808999&text=${text}`, '_blank', 'noopener,noreferrer');
                  }}
                  className="p-2 rounded-full text-emerald-600 hover:bg-emerald-50 transition-colors"
                  title="WhatsApp"
                >
                  <Share2 className="h-5 w-5" />
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="flex items-center space-x-1 px-5 py-2 bg-emerald-700 text-white font-bold rounded-lg text-xs hover:bg-emerald-800 shadow-xs"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>Save Entry</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="p-2 rounded-full text-brand-maroon hover:bg-rose-50 transition-colors"
                    title="Print"
                  >
                    <Printer className="h-5 w-5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={openBhavcutModal}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-brand-maroon text-white font-bold rounded-md text-xs hover:bg-brand-maroon-dark transition-colors shadow-xs"
                >
                  <span>P. Bhavcut +</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* List View Exact Match with reference/loan_list_1440.png */
        <div className="space-y-4">
          {/* Breadcrumb Bar */}
          <div className="flex items-center space-x-2 text-xs font-bold text-white">
            <div className="bg-brand-maroon px-3 py-1 rounded-l-md">Loan</div>
            <div className="bg-rose-700 px-3 py-1 rounded-r-md">Loan List</div>
          </div>

          {/* Header Controls Bar */}
          <div className="bg-white p-3 rounded-xl border border-slate-300 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <h2 className="text-base font-extrabold text-slate-800">Loan List</h2>

            <div className="flex flex-wrap items-center gap-3">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="px-2.5 py-1 rounded border border-slate-300 font-medium text-slate-700 text-xs"
              />
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="px-2.5 py-1 rounded border border-slate-300 font-medium text-slate-700 text-xs"
              />
              <select
                value={listCustomerFilter}
                onChange={(e) => setListCustomerFilter(e.target.value)}
                className="px-3 py-1 rounded border border-slate-300 font-medium text-slate-700 text-xs"
              >
                <option value="all">Select</option>
                <option value="386">386 / RAHUL 1</option>
                <option value="99">99 / Bank (Online)</option>
                <option value="384">384 / cm</option>
                <option value="100">100 / XYZ</option>
              </select>

              {/* Back Circle Button */}
              <button
                type="button"
                onClick={() => setActiveTab('FORM')}
                className="h-7 w-7 rounded-full bg-brand-maroon text-white flex items-center justify-center hover:bg-brand-maroon-dark transition-colors"
                title="Back to Form"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Old Records Button */}
              <button
                type="button"
                onClick={() => showToast('Loading archived records...')}
                className="px-3 py-1 bg-brand-maroon text-white font-bold rounded-full hover:bg-brand-maroon-dark transition-colors text-xs"
              >
                Old Records
              </button>
            </div>
          </div>

          {/* Two-Tier Table Matching reference/loan_list_1440.png */}
          <div className="bg-white rounded-xl border border-slate-300 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  {/* Super Header Tier */}
                  <tr className="bg-slate-700 text-white font-bold text-center">
                    <th colSpan={3} className="py-2 px-3 border border-slate-600 bg-slate-700"></th>
                    <th colSpan={4} className="py-2 px-3 border border-slate-600 bg-slate-800 text-amber-300 uppercase tracking-wider">
                      Gold
                    </th>
                    <th colSpan={4} className="py-2 px-3 border border-slate-600 bg-slate-800 text-emerald-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="py-2 px-3 border border-slate-600 bg-slate-700"></th>
                    <th className="py-2 px-3 border border-slate-600 bg-slate-700"></th>
                  </tr>
                  {/* Secondary Header Tier */}
                  <tr className="bg-slate-600 text-white font-semibold text-center border-b border-slate-500">
                    <th className="py-2 px-3 border border-slate-500 w-10">SN</th>
                    <th className="py-2 px-3 border border-slate-500 w-28">Date/Time</th>
                    <th className="py-2 px-3 border border-slate-500 w-36">C. No/C. Name/Source</th>
                    <th className="py-2 px-3 border border-slate-500 w-20">Old Gold</th>
                    <th className="py-2 px-3 border border-slate-500 w-20">Gold Out</th>
                    <th className="py-2 px-3 border border-slate-500 w-20">Gold In</th>
                    <th className="py-2 px-3 border border-slate-500 w-24">Final Gold</th>
                    <th className="py-2 px-3 border border-slate-500 w-24">Old Amt</th>
                    <th className="py-2 px-3 border border-slate-500 w-24">Amt Out</th>
                    <th className="py-2 px-3 border border-slate-500 w-24">Amt In</th>
                    <th className="py-2 px-3 border border-slate-500 w-28">Final Amt</th>
                    <th className="py-2 px-3 border border-slate-500 w-28">Conersion (Bhav Cut)</th>
                    <th className="py-2 px-3 border border-slate-500 w-16">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 text-center">
                  {referenceListRows.map((row) => (
                    <tr key={row.sn} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 border-r border-slate-200 font-bold text-slate-700">
                        {row.sn}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-200 text-slate-600 whitespace-pre-line text-[11px]">
                        {row.dateTime}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-200">
                        <div className="flex flex-col items-center">
                          <span className="font-bold text-slate-900">{row.customerNo}</span>
                          <span className="font-semibold text-slate-700">{row.customerName}</span>
                          <span className="text-[10px] text-brand-maroon font-bold uppercase">{row.source}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-200 font-mono text-slate-700">
                        {row.oldGold.toFixed(3)}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-200 font-mono text-rose-600 font-bold">
                        {row.goldOut > 0 ? `-${row.goldOut.toFixed(3)}` : '-'}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-200 font-mono text-emerald-700 font-bold">
                        {row.goldIn > 0 ? `+ ${row.goldIn.toFixed(3)} gm` : '-'}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-200 font-mono font-black text-slate-900">
                        {row.finalGold.toFixed(3)} gm
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-200 font-mono text-slate-700">
                        {row.oldAmt.toLocaleString('en-IN')} ₹
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-200 font-mono text-rose-600 font-bold">
                        {row.amtOut > 0 ? `- ${row.amtOut.toLocaleString('en-IN')} ₹` : '-'}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-200 font-mono text-emerald-700 font-bold">
                        {row.amtIn > 0 ? `+ ${row.amtIn.toLocaleString('en-IN')} ₹` : '-'}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-200 font-mono font-black text-slate-900">
                        {row.finalAmt.toLocaleString('en-IN')} ₹
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-200 text-slate-400">
                        {row.bhavcut}
                      </td>
                      <td className="py-2.5 px-3">
                        <button
                          type="button"
                          className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

                {/* Footer Totals Row */}
                <tfoot>
                  <tr className="bg-slate-600 text-white font-bold text-center border-t-2 border-slate-400">
                    <td colSpan={3} className="py-2.5 px-3 border border-slate-500 text-center font-extrabold tracking-wide">
                      Total :-
                    </td>
                    <td className="py-2.5 px-3 border border-slate-500 bg-white text-slate-900 font-mono font-black">
                      100.000 gm
                    </td>
                    <td className="py-2.5 px-3 border border-slate-500 bg-slate-700 text-white font-mono font-black">
                      93.000 gm
                    </td>
                    <td className="py-2.5 px-3 border border-slate-500 bg-slate-600"></td>
                    <td className="py-2.5 px-3 border border-slate-500 bg-slate-600"></td>
                    <td className="py-2.5 px-3 border border-slate-500 bg-slate-700 text-white font-mono font-black">
                      1,10,000 ₹
                    </td>
                    <td className="py-2.5 px-3 border border-slate-500 bg-white text-slate-900 font-mono font-black">
                      2,99,000 ₹
                    </td>
                    <td className="py-2.5 px-3 border border-slate-500 bg-slate-600"></td>
                    <td className="py-2.5 px-3 border border-slate-500 bg-slate-600"></td>
                    <td className="py-2.5 px-3 border border-slate-500 bg-slate-600"></td>
                    <td className="py-2.5 px-3 border border-slate-500 bg-white text-center">
                      <button
                        onClick={() => window.print()}
                        className="p-1 rounded text-brand-maroon hover:bg-rose-50 inline-flex items-center justify-center"
                        title="Print Loan Table"
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
      )}
    </div>
  );
};
