import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useStockStore } from '../../store/useStockStore';
import { useUIStore } from '../../store/useUIStore';
import { Scale, IndianRupee, TrendingUp, RefreshCw, Layers } from 'lucide-react';

export const StockOverviewModal: React.FC = () => {
  const { isStockModalOpen, closeStockModal, showToast } = useUIStore();
  const { summary, updateRates } = useStockStore();

  const [gold24K, setGold24K] = useState(summary.marketRates.gold24K);
  const [gold22K, setGold22K] = useState(summary.marketRates.gold22K);
  const [silver1Kg, setSilver1Kg] = useState(summary.marketRates.silver1Kg);

  const handleUpdateRates = () => {
    updateRates(Number(gold24K), Number(gold22K), Number(silver1Kg));
    showToast('Market rates and portfolio valuation updated successfully!');
  };

  return (
    <Modal
      isOpen={isStockModalOpen}
      onClose={closeStockModal}
      title="MASTER VAULT STOCK & BUSINESS POONJEE SUMMARY"
      maxWidth="4xl"
    >
      <div className="space-y-4 text-xs">
        {/* Top Summary Banner */}
        <div className="rounded-lg bg-linear-to-r from-amber-500 via-amber-600 to-amber-700 p-4 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-medium uppercase tracking-wider text-amber-100">
              Total Business Capital (कुल पूँजी)
            </span>
            <div className="text-2xl font-extrabold mt-0.5">
              ₹ {summary.totalBusinessWorth.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-amber-100">
              Today Estimated Trading Profit: +₹ {summary.todayProfit.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-2.5 backdrop-blur-xs">
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-amber-200 uppercase font-semibold">
                Pure Gold in Vault
              </span>
              <span className="text-lg font-bold text-white">
                {summary.pureGoldStock.weightGm.toFixed(3)} gm
              </span>
            </div>
            <Scale className="h-7 w-7 text-amber-200" />
          </div>
        </div>

        {/* 3 Column Grid: Liquid Cash, Bullion, & Udhari */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Card 1: Liquid Cash & Bank */}
          <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-xs space-y-2">
            <div className="flex items-center space-x-2 text-slate-700 font-bold border-b pb-1.5">
              <IndianRupee className="h-4 w-4 text-emerald-600" />
              <span>Liquid Cash & Bank (रोकड़)</span>
            </div>
            <div className="space-y-1.5 text-slate-600">
              <div className="flex justify-between">
                <span>Safe Cash (गल्ला रोकड़):</span>
                <span className="font-semibold text-slate-900">
                  ₹ {summary.liquidCash.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Primary Bank Account:</span>
                <span className="font-semibold text-slate-900">
                  ₹ {summary.primaryBank.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Secondary Bank Account:</span>
                <span className="font-semibold text-slate-900">
                  ₹ {summary.secondaryBank.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Physical Bullion & Scrap */}
          <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-xs space-y-2">
            <div className="flex items-center space-x-2 text-slate-700 font-bold border-b pb-1.5">
              <Scale className="h-4 w-4 text-brand-gold" />
              <span>Bullion & Raw Scrap (सोना-चांदी)</span>
            </div>
            <div className="space-y-1.5 text-slate-600">
              <div className="flex justify-between">
                <span>Pure 99.9 Gold Stock:</span>
                <span className="font-semibold text-amber-600">
                  {summary.pureGoldStock.weightGm.toFixed(3)} gm
                </span>
              </div>
              <div className="flex justify-between">
                <span>Raw Scrap (Kacha Gold):</span>
                <span className="font-semibold text-slate-800">
                  {summary.rawScrapStock.kachaGrossWeight.toFixed(3)} gm
                </span>
              </div>
              <div className="flex justify-between">
                <span>Physical Silver Stock:</span>
                <span className="font-semibold text-slate-800">
                  {(summary.silverStock.weightGm / 1000).toFixed(2)} kg
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Udhari Balances */}
          <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-xs space-y-2">
            <div className="flex items-center space-x-2 text-slate-700 font-bold border-b pb-1.5">
              <Layers className="h-4 w-4 text-brand-maroon" />
              <span>Udhari Ledger Net (उधारी)</span>
            </div>
            <div className="space-y-1.5 text-slate-600">
              <div className="flex justify-between">
                <span>Net Customer Gold Due:</span>
                <span
                  className={`font-semibold ${
                    summary.udhariOutstanding.netCustomerGold >= 0
                      ? 'text-emerald-600'
                      : 'text-rose-600'
                  }`}
                >
                  {summary.udhariOutstanding.netCustomerGold >= 0 ? '+' : ''}
                  {summary.udhariOutstanding.netCustomerGold.toFixed(3)} gm
                </span>
              </div>
              <div className="flex justify-between">
                <span>Net Customer Cash Due:</span>
                <span
                  className={`font-semibold ${
                    summary.udhariOutstanding.netCustomerCash >= 0
                      ? 'text-emerald-600'
                      : 'text-rose-600'
                  }`}
                >
                  ₹ {summary.udhariOutstanding.netCustomerCash.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 pt-1">
                Positive indicates customers owe shop; negative indicates shop owes customers.
              </div>
            </div>
          </div>
        </div>

        {/* Live Market Rate Settings Form */}
        <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 font-bold text-slate-800">
              <TrendingUp className="h-4 w-4 text-brand-maroon" />
              <span>Current Market Gold & Silver Rates (लाइव भाव सेटिंग)</span>
            </div>
            <button
              onClick={handleUpdateRates}
              className="flex items-center space-x-1 bg-brand-maroon text-white font-semibold px-3 py-1 rounded text-xs hover:bg-brand-maroon-dark transition-all"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Save & Re-evaluate</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                24K Gold Rate (₹ / 10gm)
              </label>
              <input
                type="number"
                value={gold24K}
                onChange={(e) => setGold24K(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 text-xs font-semibold rounded border border-slate-300 focus:border-brand-maroon focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                22K Gold Rate (₹ / 10gm)
              </label>
              <input
                type="number"
                value={gold22K}
                onChange={(e) => setGold22K(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 text-xs font-semibold rounded border border-slate-300 focus:border-brand-maroon focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Silver 99.9 Rate (₹ / 1 Kg)
              </label>
              <input
                type="number"
                value={silver1Kg}
                onChange={(e) => setSilver1Kg(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 text-xs font-semibold rounded border border-slate-300 focus:border-brand-maroon focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

