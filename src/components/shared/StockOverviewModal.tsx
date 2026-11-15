import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useUIStore } from '../../store/useUIStore';
import { useMetalStore } from '../../store/useMetalStore';
import { useStockStore } from '../../store/useStockStore';
import { customerService } from '../../services/customerService';
import { Customer } from '../../types';
import { EditStockModal } from '../stock/EditStockModal';
import {
  Scale,
  IndianRupee,
  Building,
  Edit3,
  Check,
  SlidersHorizontal,
} from 'lucide-react';

export const StockOverviewModal: React.FC = () => {
  const { isStockModalOpen, closeStockModal, showToast } = useUIStore();
  const { metalMode } = useMetalStore();
  const { summary, fetchStock, updateMetalRates } = useStockStore();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditingRates, setIsEditingRates] = useState(false);
  const [editBuyRate, setEditBuyRate] = useState(0);
  const [editSellRate, setEditSellRate] = useState(0);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [fromDate, setFromDate] = useState(() => new Date().toISOString().substring(0, 10));
  const [toDate, setToDate] = useState(() => new Date().toISOString().substring(0, 10));

  useEffect(() => {
    if (isStockModalOpen) {
      fetchStock();
      customerService.getAll().then(setCustomers);
    }
  }, [isStockModalOpen, fetchStock]);

  const isGold = metalMode === 'GOLD';

  // Dynamic values from live stock summary
  const cashInStock = summary.liquidCash || 0;
  const cashInBank = summary.primaryBank || 0;
  const selfBank2 = summary.secondaryBank || 0;

  const fineInStockGold = summary.pureGoldStock?.weightGm || 0;
  const fineInStockSilver = summary.silverStock?.weightGm || 0;

  const avgBuyRateGold = summary.pureGoldStock?.avgBuyRate || 0;
  const avgSellRateGold = summary.pureGoldStock?.avgSellRate || 0;
  const todayBuyFineGold = summary.pureGoldStock?.todayBuyWeight || 0;
  const todaySellFineGold = summary.pureGoldStock?.todaySellWeight || 0;

  const avgBuyRateSilver = summary.silverStock?.avgRate || 0;
  const avgSellRateSilver = summary.silverStock?.avgSellRate || summary.silverStock?.avgRate || 0;
  const todayBuyFineSilver = summary.silverStock?.todayBuyWeight || 0;
  const todaySellFineSilver = summary.silverStock?.todaySellWeight || 0;

  const startEditRates = () => {
    setEditBuyRate(isGold ? avgBuyRateGold : avgBuyRateSilver);
    setEditSellRate(isGold ? avgSellRateGold : avgSellRateSilver);
    setIsEditingRates(true);
  };

  const handleSaveRates = async () => {
    await updateMetalRates(metalMode, editBuyRate, editSellRate);
    setIsEditingRates(false);
    showToast(`Stock rates updated: Purchase ₹${editBuyRate.toLocaleString('en-IN')}, Sale ₹${editSellRate.toLocaleString('en-IN')}`, 'success');
  };

  const totalKacha = summary.rawScrapStock?.kachaGrossWeight || 0;
  const totalFineInKacha = summary.rawScrapStock?.kachaFineEquivalent || 0;
  const todayKacha = summary.rawScrapStock?.todayGrossWeight ?? totalKacha;
  const todayFineInKacha = summary.rawScrapStock?.todayFineEquivalent ?? totalFineInKacha;

  // Integrate live customer accounts with calibrated opening balances
  const custUdharGold = customers.filter((c) => c.balance.gold < 0).reduce((acc, c) => acc + Math.abs(c.balance.gold), 0);
  const custJamaGold = customers.filter((c) => c.balance.gold > 0).reduce((acc, c) => acc + c.balance.gold, 0);

  const custUdharSilver = customers.filter((c) => (c.balance.silver || 0) < 0).reduce((acc, c) => acc + Math.abs(c.balance.silver || 0), 0);
  const custJamaSilver = customers.filter((c) => (c.balance.silver || 0) > 0).reduce((acc, c) => acc + (c.balance.silver || 0), 0);

  const custUdharCash = customers.filter((c) => c.balance.cash < 0).reduce((acc, c) => acc + Math.abs(c.balance.cash), 0);
  const custJamaCash = customers.filter((c) => c.balance.cash > 0).reduce((acc, c) => acc + c.balance.cash, 0);

  const udharGold = (summary.udhariOutstanding?.udharGold || 0) + custUdharGold;
  const jamaGold = (summary.udhariOutstanding?.jamaGold || 0) + custJamaGold;
  const netGold = jamaGold - udharGold;

  const udharSilver = (summary.udhariOutstanding?.udharSilver || 0) + custUdharSilver;
  const jamaSilver = (summary.udhariOutstanding?.jamaSilver || 0) + custJamaSilver;
  const netSilver = jamaSilver - udharSilver;

  const udharCash = (summary.udhariOutstanding?.udharCash || 0) + custUdharCash;
  const jamaCash = (summary.udhariOutstanding?.jamaCash || 0) + custJamaCash;
  const netCash = jamaCash - udharCash;

  // Capital calculations
  const netPoonjeeCash = cashInStock + cashInBank + selfBank2 + netCash;
  const totalValuation = summary.totalBusinessWorth || 0;
  const todayCashProfit = summary.todayProfit || 0;

  const netPoonjeeGold = fineInStockGold + totalFineInKacha + netGold;
  const totalValuationGold = fineInStockGold + totalFineInKacha + (totalValuation > 0 ? (totalValuation / (summary.marketRates?.gold24K || 75000)) * 10 : 0);
  const todayGoldProfit = summary.capital?.todayGoldProfit ?? 0;

  const netPoonjeeSilver = fineInStockSilver + netSilver;
  const totalValuationSilver = fineInStockSilver + (totalValuation > 0 ? (totalValuation / (summary.marketRates?.silver1Kg || 90000)) * 1000 : 0);
  const todaySilverProfit = summary.capital?.todaySilverProfit ?? 0;

  return (
    <>
      <Modal
        isOpen={isStockModalOpen}
        onClose={closeStockModal}
        title={`${metalMode} STOCK VIEW (स्टॉक सारांश)`}
        maxWidth="4xl"
      >
        <div className="space-y-4 text-xs">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-2 gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                {isGold ? 'GOLD STOCK VIEW' : 'SILVER STOCK VIEW'}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Real-time overview of current metal inventory and financial balances
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 text-xs shadow-xs"
            >
              <Edit3 className="h-3.5 w-3.5 text-brand-maroon" />
              <span>Set Stock</span>
            </button>
          </div>

          {/* 4 Top Metric Cards Matching Reference */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
            {/* Card 1: CASH IN STOCK */}
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xs">
              <div className="flex items-center space-x-2">
                <div className="h-6 w-6 rounded bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                  ₹
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Cash in Stock</span>
              </div>
              <div className="mt-2 text-base font-black text-slate-900 dark:text-white font-mono">
                ₹ {cashInStock.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Card 2: CASH IN BANK */}
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xs">
              <div className="flex items-center space-x-2">
                <div className="h-6 w-6 rounded bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Building className="h-3.5 w-3.5" />
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Cash in Bank</span>
              </div>
              <div className="mt-2 text-base font-black text-slate-900 dark:text-white font-mono">
                ₹ {cashInBank.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Card 3: SELF BANK 2 */}
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xs">
              <div className="flex items-center space-x-2">
                <div className="h-6 w-6 rounded bg-slate-100 text-slate-700 flex items-center justify-center">
                  <Building className="h-3.5 w-3.5" />
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Self Bank 2</span>
              </div>
              <div className="mt-2 text-base font-black text-slate-900 dark:text-white font-mono">
                ₹ {selfBank2.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Card 4: FINE IN STOCK */}
            <div className={`p-3 rounded-lg border ${isGold ? 'border-amber-300 bg-amber-50/40 dark:bg-amber-950/30' : 'border-slate-300 bg-slate-50 dark:bg-slate-800'} shadow-xs`}>
              <div className="flex items-center space-x-2">
                <div className={`h-6 w-6 rounded ${isGold ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'} flex items-center justify-center font-bold text-xs`}>
                  <Scale className="h-3.5 w-3.5" />
                </div>
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">
                  {isGold ? 'Fine Gold in Stock' : 'Fine Silver in Stock'}
                </span>
              </div>
              <div className={`mt-2 text-base font-black ${isGold ? 'text-amber-900 dark:text-amber-300' : 'text-slate-900 dark:text-white'} font-mono`}>
                {isGold ? `${fineInStockGold.toFixed(3)} gm` : `${fineInStockSilver.toFixed(3)} gm`}
              </div>
            </div>
          </div>

          {/* Section 2: Fine Stock Details & Kacha Stock Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* Fine Stock Details */}
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xs overflow-hidden">
              <div className="bg-brand-maroon text-white font-bold px-3 py-1.5 text-xs flex items-center justify-between">
                <span>FINE STOCK DETAILS ({metalMode})</span>
                <div className="flex items-center space-x-1.5">
                  {!isEditingRates ? (
                    <button
                      type="button"
                      onClick={startEditRates}
                      className="px-2 py-0.5 rounded bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 text-[10px] font-bold flex items-center space-x-1"
                      title="Quick Edit Purchase & Sell Rates"
                    >
                      <Edit3 className="h-3 w-3" />
                      <span>Edit Rates</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSaveRates}
                      className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold flex items-center space-x-1"
                    >
                      <Check className="h-3 w-3" />
                      <span>Save</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(true)}
                    className="hover:opacity-80 p-0.5 rounded"
                    title="Full Calibration"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5 text-amber-300" />
                  </button>
                </div>
              </div>
              <div className="p-3 space-y-2">
                <div className="grid grid-cols-2 gap-2 pb-2 border-b dark:border-slate-700">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">
                      AVG BUY RATE (PURCHASE RATE / खरीदना)
                    </span>
                    {isEditingRates ? (
                      <div className="mt-1">
                        <input
                          type="number"
                          value={editBuyRate}
                          onChange={(e) => setEditBuyRate(Number(e.target.value))}
                          className="w-full px-2 py-1 rounded border border-amber-400 dark:border-amber-500 bg-white dark:bg-slate-700 font-mono font-bold text-xs"
                          placeholder="Purchase Rate"
                        />
                      </div>
                    ) : (
                      <div
                        onClick={startEditRates}
                        className="font-bold text-slate-800 dark:text-slate-200 font-mono cursor-pointer hover:text-brand-maroon flex items-center space-x-1"
                        title="Click to edit Purchase Rate"
                      >
                        <span>{isGold ? `${avgBuyRateGold.toLocaleString('en-IN')} ₹` : `${avgBuyRateSilver.toLocaleString('en-IN')} ₹`}</span>
                        <Edit3 className="h-2.5 w-2.5 text-slate-400 opacity-60" />
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">
                      AVG SELL RATE (SALE RATE / बेचना)
                    </span>
                    {isEditingRates ? (
                      <div className="mt-1">
                        <input
                          type="number"
                          value={editSellRate}
                          onChange={(e) => setEditSellRate(Number(e.target.value))}
                          className="w-full px-2 py-1 rounded border border-amber-400 dark:border-amber-500 bg-white dark:bg-slate-700 font-mono font-bold text-xs"
                          placeholder="Sale Rate"
                        />
                      </div>
                    ) : (
                      <div
                        onClick={startEditRates}
                        className="font-bold text-slate-800 dark:text-slate-200 font-mono cursor-pointer hover:text-brand-maroon flex items-center space-x-1"
                        title="Click to edit Sell Rate"
                      >
                        <span>{isGold ? `${avgSellRateGold.toLocaleString('en-IN')} ₹` : `${avgSellRateSilver.toLocaleString('en-IN')} ₹`}</span>
                        <Edit3 className="h-2.5 w-2.5 text-slate-400 opacity-60" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">TODAY BUY FINE</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                      {isGold ? `${todayBuyFineGold.toFixed(3)} gm` : `${todayBuyFineSilver.toFixed(3)} gm`}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">TODAY SELL FINE</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                      {isGold ? `${todaySellFineGold.toFixed(3)} gm` : `${todaySellFineSilver.toFixed(3)} gm`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Kacha Stock Details */}
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xs overflow-hidden">
              <div className="bg-brand-maroon text-white font-bold px-3 py-1.5 text-xs flex items-center justify-between">
                <span>KACHA STOCK DETAILS</span>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="hover:opacity-80 p-0.5 rounded"
                  title="Edit Kacha Stock"
                >
                  <Edit3 className="h-3.5 w-3.5 text-amber-300" />
                </button>
              </div>
              <div className="p-3 space-y-2">
                <div className="grid grid-cols-2 gap-2 pb-2 border-b dark:border-slate-700">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">TOTAL KACHA</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{totalKacha.toFixed(3)} gm</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">TOTAL FINE IN KACHA</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{totalFineInKacha.toFixed(3)} gm</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">TODAY KACHA</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{todayKacha.toFixed(3)} gm</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">TODAY FINE IN KACHA</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{todayFineInKacha.toFixed(3)} gm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Udhari (Debits & Credits) */}
          <div className="space-y-2">
            <h3 className="font-black text-slate-800 dark:text-white text-xs tracking-wider uppercase">
              UDHARI (DEBITS & CREDITS)
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {/* Metal Dues (Gold vs Silver) */}
              <div className="rounded-lg border border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-xs">
                <div className="bg-slate-700 text-white font-bold px-3 py-1.5 text-xs flex items-center justify-between">
                  <span>{isGold ? 'METAL DUES (GOLD)' : 'METAL DUES (SILVER)'}</span>
                  <Scale className="h-3.5 w-3.5 text-amber-300" />
                </div>
                <div className="p-3 space-y-2">
                  <div className="grid grid-cols-2 gap-2 pb-2 border-b dark:border-slate-700">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">
                        {isGold ? 'UDHAR GOLD' : 'UDHAR SILVER'}
                      </span>
                      <span className="font-bold text-rose-600 font-mono">
                        {isGold ? `-${udharGold.toFixed(3)} gm` : `-${udharSilver.toFixed(3)} gm`}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">
                        {isGold ? 'JAMA GOLD' : 'JAMA SILVER'}
                      </span>
                      <span className="font-bold text-emerald-700 font-mono">
                        {isGold ? `+${jamaGold.toFixed(3)} gm` : `+${jamaSilver.toFixed(3)} gm`}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">NET JAMA/UDHARI</span>
                    <span className={`font-black font-mono text-sm ${netGold >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {isGold
                        ? `${netGold >= 0 ? '+' : ''}${netGold.toFixed(3)} gm`
                        : `${netSilver >= 0 ? '+' : ''}${netSilver.toFixed(3)} gm`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cash Dues */}
              <div className="rounded-lg border border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-xs">
                <div className="bg-slate-700 text-white font-bold px-3 py-1.5 text-xs flex items-center justify-between">
                  <span>CASH DUES</span>
                  <IndianRupee className="h-3.5 w-3.5 text-emerald-300" />
                </div>
                <div className="p-3 space-y-2">
                  <div className="grid grid-cols-2 gap-2 pb-2 border-b dark:border-slate-700">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">UDHAR CASH</span>
                      <span className="font-bold text-rose-600 font-mono">
                        ₹ -{udharCash.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">JAMA CASH</span>
                      <span className="font-bold text-emerald-700 font-mono">
                        ₹ +{jamaCash.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">NET JAMA/UDHARI CASH</span>
                    <span className={`font-black font-mono text-sm ${netCash >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                      ₹ {netCash >= 0 ? `+${netCash.toLocaleString('en-IN')}` : `-${Math.abs(netCash).toLocaleString('en-IN')}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Capital / Poonjee */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-800 dark:text-white text-xs tracking-wider uppercase">
                CAPITAL / POONJEE
              </h3>
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="px-2 py-0.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-[11px]"
                />
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="px-2 py-0.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-[11px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* CASH CAPITAL */}
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-xs">
                <div className="bg-emerald-700 text-white font-bold px-3 py-1.5 text-xs">
                  CASH CAPITAL
                </div>
                <div className="p-3 space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">NET POONJEE CASH</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">
                      ₹ {netPoonjeeCash.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">TOTAL VALUATION</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">
                      ₹ {totalValuation.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t dark:border-slate-700">
                    <span className="text-slate-600 dark:text-slate-400 font-semibold">TODAY CASH PROFIT</span>
                    <span className="font-bold text-emerald-700 font-mono">
                      {todayCashProfit >= 0 ? `+${todayCashProfit.toLocaleString('en-IN')}` : `-${Math.abs(todayCashProfit).toLocaleString('en-IN')}`} ₹
                    </span>
                  </div>
                </div>
              </div>

              {/* GOLD CAPITAL */}
              <div className={`rounded-lg border ${isGold ? 'border-amber-400 ring-2 ring-amber-300' : 'border-slate-200 dark:border-slate-700'} bg-white dark:bg-slate-800 overflow-hidden shadow-xs`}>
                <div className="bg-amber-600 text-white font-bold px-3 py-1.5 text-xs">
                  GOLD CAPITAL
                </div>
                <div className="p-3 space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">NET POONJEE GOLD</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">
                      {netPoonjeeGold.toFixed(3)} gm
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">TOTAL VALUATION (GOLD)</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">
                      {totalValuationGold.toFixed(3)} gm
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t dark:border-slate-700">
                    <span className="text-slate-600 dark:text-slate-400 font-semibold">TODAY GOLD PROFIT</span>
                    <span className="font-bold text-emerald-700 font-mono">
                      {todayGoldProfit >= 0 ? `+${todayGoldProfit.toFixed(3)}` : todayGoldProfit.toFixed(3)} gm
                    </span>
                  </div>
                </div>
              </div>

              {/* SILVER CAPITAL */}
              <div className={`rounded-lg border ${!isGold ? 'border-slate-400 ring-2 ring-slate-300' : 'border-slate-200 dark:border-slate-700'} bg-white dark:bg-slate-800 overflow-hidden shadow-xs`}>
                <div className="bg-slate-700 text-white font-bold px-3 py-1.5 text-xs">
                  SILVER CAPITAL
                </div>
                <div className="p-3 space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">NET POONJEE SILVER</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">
                      {netPoonjeeSilver.toFixed(3)} gm
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">TOTAL VALUATION (SILVER)</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">
                      {totalValuationSilver.toFixed(3)} gm
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t dark:border-slate-700">
                    <span className="text-slate-600 dark:text-slate-400 font-semibold">TODAY SILVER PROFIT</span>
                    <span className="font-bold text-emerald-700 font-mono">
                      {todaySilverProfit >= 0 ? `+${todaySilverProfit.toFixed(3)}` : todaySilverProfit.toFixed(3)} gm
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Calibration Edit Modal */}
      {isEditModalOpen && (
        <EditStockModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </>
  );
};
