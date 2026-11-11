import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useUIStore } from '../../store/useUIStore';
import { useStockStore } from '../../store/useStockStore';
import { convertCashToGold, convertGoldToCash } from '../../utils/calculations/bullionMath';
import { ArrowLeftRight, Copy, Check } from 'lucide-react';

export const BhavcutConverterModal: React.FC = () => {
  const { isBhavcutModalOpen, closeBhavcutModal, showToast } = useUIStore();
  const { summary } = useStockStore();

  const [mode, setMode] = useState<'CASH_TO_GOLD' | 'GOLD_TO_CASH'>('CASH_TO_GOLD');
  const [rate, setRate] = useState<number>(summary.marketRates.gold24K);
  const [inputValue, setInputValue] = useState<number>(100000);
  const [copied, setCopied] = useState(false);

  const calculatedGold = convertCashToGold(inputValue, rate);
  const calculatedCash = convertGoldToCash(inputValue, rate);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isBhavcutModalOpen}
      onClose={closeBhavcutModal}
      title="BHAV-CUT CONVERTER (भाव कट कैलकुलेटर)"
      maxWidth="md"
    >
      <div className="space-y-4 text-xs">
        {/* Mode Switcher */}
        <div className="flex rounded-md bg-slate-100 p-1">
          <button
            onClick={() => {
              setMode('CASH_TO_GOLD');
              setInputValue(100000);
            }}
            className={`flex-1 py-1.5 text-center text-xs font-semibold rounded transition-all ${
              mode === 'CASH_TO_GOLD'
                ? 'bg-brand-maroon text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Currency (₹) ➔ Gold (gm)
          </button>
          <button
            onClick={() => {
              setMode('GOLD_TO_CASH');
              setInputValue(10);
            }}
            className={`flex-1 py-1.5 text-center text-xs font-semibold rounded transition-all ${
              mode === 'GOLD_TO_CASH'
                ? 'bg-brand-maroon text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Gold (gm) ➔ Currency (₹)
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Gold Market Rate (₹ / 10 gm)
            </label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full px-3 py-1.5 text-xs font-semibold rounded border border-slate-300 focus:border-brand-maroon focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {mode === 'CASH_TO_GOLD' ? 'Amount (रुपये ₹)' : 'Pure Gold Weight (वजन gm)'}
            </label>
            <input
              type="number"
              step={mode === 'CASH_TO_GOLD' ? '100' : '0.001'}
              value={inputValue}
              onChange={(e) => setInputValue(Number(e.target.value))}
              className="w-full px-3 py-1.5 text-xs font-bold rounded border border-slate-300 focus:border-brand-maroon focus:outline-none"
            />
          </div>
        </div>

        {/* Output Box */}
        <div className="rounded-lg bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200 p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wide">
              {mode === 'CASH_TO_GOLD' ? 'Calculated Fine Gold' : 'Calculated Cash Value'}
            </span>
            <div className="text-2xl font-black text-brand-maroon mt-0.5">
              {mode === 'CASH_TO_GOLD'
                ? `${calculatedGold.toFixed(3)} gm`
                : `₹ ${calculatedCash.toLocaleString('en-IN')}`}
            </div>
          </div>

          <button
            onClick={() =>
              handleCopy(
                mode === 'CASH_TO_GOLD' ? calculatedGold.toFixed(3) : calculatedCash.toString()
              )
            }
            className="flex items-center space-x-1 px-3 py-1.5 rounded-md bg-white border border-amber-300 text-slate-700 hover:bg-amber-100 font-semibold shadow-xs"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-500 text-center">
          Formula: {mode === 'CASH_TO_GOLD' ? '(Amount × 10) ÷ Rate' : '(Gold Weight × Rate) ÷ 10'}
        </div>
      </div>
    </Modal>
  );
};

