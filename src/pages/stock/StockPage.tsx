import React, { useState } from 'react';
import { useMetalStore } from '../../store/useMetalStore';
import { useUIStore } from '../../store/useUIStore';
import {
  Scale,
  IndianRupee,
  Building,
  Edit3,
} from 'lucide-react';

export const StockPage: React.FC = () => {
  const { metalMode } = useMetalStore();
  const { showToast } = useUIStore();
  const isGold = metalMode === 'GOLD';

  const [fromDate, setFromDate] = useState('2026-11-01');
  const [toDate, setToDate] = useState('2026-11-11');

  // Metrics matching reference/stock_view_1440.png
  const cashInStock = 7230290;
  const cashInBank = 108283;
  const selfBank2 = 0;

  const fineInStockGold = 469.009;
  const fineInStockSilver = 151498.093;

  const avgBuyRateGold = 14114;
  const avgSellRateGold = 14445;
  const todayBuyFineGold = 137.004;
  const todaySellFineGold = 30.010;

  const avgBuyRateSilver = 950;
  const avgSellRateSilver = 980;
  const todayBuyFineSilver = 12500.0;
  const todaySellFineSilver = 4200.0;

  const totalKacha = 215.0;
  const totalFineInKacha = 181.55;

  const udharGold = -19.0;
  const jamaGold = 0.0;
  const netGold = -19.0;

  const udharSilver = -413.043;
  const jamaSilver = 0.0;
  const netSilver = -413.043;

  const udharCash = -114808;
  const jamaCash = 415534;
  const netCash = 300726;

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-xs gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            {isGold ? 'GOLD STOCK VIEW' : 'SILVER STOCK VIEW'}
          </h1>
          <p className="text-xs text-slate-500">
            Real-time overview of current metal inventory and financial balances
          </p>
        </div>
        <button
          onClick={() => showToast('Stock calibration saved')}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-md text-slate-700 font-bold hover:bg-slate-50 text-xs shadow-xs self-start sm:self-auto"
        >
          <Edit3 className="h-3.5 w-3.5 text-brand-maroon" />
          <span>Set Stock</span>
        </button>
      </div>

      {/* 4 Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center space-x-2">
            <div className="h-7 w-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
              ₹
            </div>
            <span className="text-[11px] font-bold text-slate-500 uppercase">Cash in Stock</span>
          </div>
          <div className="mt-2 text-lg font-black text-slate-900 font-mono">
            ₹ {cashInStock.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center space-x-2">
            <div className="h-7 w-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Building className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-bold text-slate-500 uppercase">Cash in Bank</span>
          </div>
          <div className="mt-2 text-lg font-black text-slate-900 font-mono">
            ₹ {cashInBank.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center space-x-2">
            <div className="h-7 w-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Building className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-bold text-slate-500 uppercase">Self Bank 2</span>
          </div>
          <div className="mt-2 text-lg font-black text-slate-900 font-mono">
            ₹ {selfBank2.toLocaleString('en-IN')}
          </div>
        </div>

        <div className={`p-3.5 rounded-xl border ${isGold ? 'border-amber-300 bg-amber-50/40' : 'border-slate-300 bg-slate-50'} shadow-xs`}>
          <div className="flex items-center space-x-2">
            <div className={`h-7 w-7 rounded-lg ${isGold ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'} flex items-center justify-center font-bold text-xs`}>
              <Scale className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-bold text-slate-600 uppercase">
              {isGold ? 'Fine Gold in Stock' : 'Fine Silver in Stock'}
            </span>
          </div>
          <div className={`mt-2 text-lg font-black ${isGold ? 'text-amber-900' : 'text-slate-900'} font-mono`}>
            {isGold ? `${fineInStockGold.toFixed(3)} gm` : `${fineInStockSilver.toFixed(3)} gm`}
          </div>
        </div>
      </div>

      {/* Section 2: Fine Stock & Kacha Stock Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="bg-brand-maroon text-white font-bold px-4 py-2 text-xs flex items-center justify-between">
            <span>FINE STOCK DETAILS ({metalMode})</span>
            <Edit3 className="h-3.5 w-3.5 text-amber-300" />
          </div>
          <div className="p-4 space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3 pb-3 border-b">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">AVG BUY RATE</span>
                <span className="font-bold text-slate-800 font-mono text-sm">
                  {isGold ? `${avgBuyRateGold.toLocaleString('en-IN')} ₹` : `${avgBuyRateSilver.toLocaleString('en-IN')} ₹`}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">AVG SELL RATE</span>
                <span className="font-bold text-slate-800 font-mono text-sm">
                  {isGold ? `${avgSellRateGold.toLocaleString('en-IN')} ₹` : `${avgSellRateSilver.toLocaleString('en-IN')} ₹`}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">TODAY BUY FINE</span>
                <span className="font-bold text-slate-800 font-mono text-sm">
                  {isGold ? `${todayBuyFineGold.toFixed(3)} gm` : `${todayBuyFineSilver.toFixed(3)} gm`}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">TODAY SELL FINE</span>
                <span className="font-bold text-slate-800 font-mono text-sm">
                  {isGold ? `${todaySellFineGold.toFixed(3)} gm` : `${todaySellFineSilver.toFixed(3)} gm`}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="bg-brand-maroon text-white font-bold px-4 py-2 text-xs flex items-center justify-between">
            <span>KACHA STOCK DETAILS</span>
            <Scale className="h-3.5 w-3.5 text-amber-300" />
          </div>
          <div className="p-4 space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3 pb-3 border-b">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">TOTAL KACHA</span>
                <span className="font-bold text-slate-800 font-mono text-sm">{totalKacha.toFixed(3)} gm</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">TOTAL FINE IN KACHA</span>
                <span className="font-bold text-slate-800 font-mono text-sm">{totalFineInKacha.toFixed(3)} gm</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">TODAY KACHA</span>
                <span className="font-bold text-slate-800 font-mono text-sm">{totalKacha.toFixed(3)} gm</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">TODAY FINE IN KACHA</span>
                <span className="font-bold text-slate-800 font-mono text-sm">{totalFineInKacha.toFixed(3)} gm</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Udhari (Debits & Credits) */}
      <div className="space-y-2">
        <h3 className="font-black text-slate-800 text-xs tracking-wider uppercase">
          UDHARI (DEBITS & CREDITS)
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-700 bg-white overflow-hidden shadow-xs">
            <div className="bg-slate-700 text-white font-bold px-4 py-2 text-xs flex items-center justify-between">
              <span>{isGold ? 'METAL DUES (GOLD)' : 'METAL DUES (SILVER)'}</span>
              <Scale className="h-3.5 w-3.5 text-amber-300" />
            </div>
            <div className="p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 pb-3 border-b">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">
                    {isGold ? 'UDHAR GOLD' : 'UDHAR SILVER'}
                  </span>
                  <span className="font-bold text-rose-600 font-mono text-sm">
                    {isGold ? `${udharGold.toFixed(3)} gm` : `${udharSilver.toFixed(3)} gm`}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">
                    {isGold ? 'JAMA GOLD' : 'JAMA SILVER'}
                  </span>
                  <span className="font-bold text-emerald-700 font-mono text-sm">
                    {isGold ? `${jamaGold.toFixed(3)} gm` : `${jamaSilver.toFixed(3)} gm`}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">NET JAMA/UDHARI</span>
                <span className="font-black text-rose-700 font-mono text-base">
                  {isGold ? `${netGold.toFixed(3)} gm` : `${netSilver.toFixed(3)} gm`}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-700 bg-white overflow-hidden shadow-xs">
            <div className="bg-slate-700 text-white font-bold px-4 py-2 text-xs flex items-center justify-between">
              <span>CASH DUES</span>
              <IndianRupee className="h-3.5 w-3.5 text-emerald-300" />
            </div>
            <div className="p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 pb-3 border-b">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">UDHAR CASH</span>
                  <span className="font-bold text-rose-600 font-mono text-sm">
                    ₹ {udharCash.toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">JAMA CASH</span>
                  <span className="font-bold text-emerald-700 font-mono text-sm">
                    ₹ +{jamaCash.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">NET JAMA/UDHARI CASH</span>
                <span className="font-black text-emerald-700 font-mono text-base">
                  ₹ +{netCash.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Capital / Poonjee */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-slate-800 text-xs tracking-wider uppercase">
            CAPITAL / POONJEE
          </h3>
          <div className="flex items-center space-x-2 text-xs">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="px-2.5 py-1 rounded border border-slate-300 text-xs"
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="px-2.5 py-1 rounded border border-slate-300 text-xs"
            />
            <button
              type="button"
              className="px-3 py-1 bg-brand-maroon text-white font-bold rounded text-xs hover:bg-brand-maroon-dark"
            >
              Historical Logs
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <div className="bg-emerald-700 text-white font-bold px-4 py-2 text-xs">
              CASH CAPITAL
            </div>
            <div className="p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">NET POONJEE CASH</span>
                <span className="font-bold text-slate-900 font-mono">66,83,969 ₹</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">TOTAL VALUATION</span>
                <span className="font-bold text-slate-900 font-mono">10,69,25,692 ₹</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="text-slate-600 font-semibold">TODAY CASH PROFIT</span>
                <span className="font-bold text-emerald-700 font-mono">+48,304 ₹</span>
              </div>
            </div>
          </div>

          <div className={`rounded-xl border ${isGold ? 'border-amber-400 ring-2 ring-amber-300' : 'border-slate-200'} bg-white overflow-hidden shadow-xs`}>
            <div className="bg-amber-600 text-white font-bold px-4 py-2 text-xs">
              GOLD CAPITAL
            </div>
            <div className="p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">NET POONJEE GOLD</span>
                <span className="font-bold text-slate-900 font-mono">3,468.108 gm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">TOTAL VALUATION (GOLD)</span>
                <span className="font-bold text-slate-900 font-mono">7,402.263 gm</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="text-slate-600 font-semibold">TODAY GOLD PROFIT</span>
                <span className="font-bold text-emerald-700 font-mono">+3.344 gm</span>
              </div>
            </div>
          </div>

          <div className={`rounded-xl border ${!isGold ? 'border-slate-400 ring-2 ring-slate-300' : 'border-slate-200'} bg-white overflow-hidden shadow-xs`}>
            <div className="bg-slate-700 text-white font-bold px-4 py-2 text-xs">
              SILVER CAPITAL
            </div>
            <div className="p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">NET POONJEE SILVER</span>
                <span className="font-bold text-slate-900 font-mono">1,67,149.675 gm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">TOTAL VALUATION (SILVER)</span>
                <span className="font-bold text-slate-900 font-mono">3,56,418.972 gm</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="text-slate-600 font-semibold">TODAY SILVER PROFIT</span>
                <span className="font-bold text-emerald-700 font-mono">+161.015 gm</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

