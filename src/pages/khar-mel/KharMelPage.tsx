import React, { useState } from 'react';
import { FlaskConical, Scale, ArrowRight, RefreshCw } from 'lucide-react';
import { calculateKharMelAlloy } from '../../utils/calculations/bullionMath';

export const KharMelPage: React.FC = () => {
  const [metal, setMetal] = useState<'GOLD' | 'SILVER'>('GOLD');
  const [currentWeight, setCurrentWeight] = useState<number>(100.0);
  const [currentPurity, setCurrentPurity] = useState<number>(99.9);
  const [targetPurity, setTargetPurity] = useState<number>(91.6);
  const [alloyPurity, setAlloyPurity] = useState<number>(0.0); // 0% = pure copper / khar

  const requiredAlloy = calculateKharMelAlloy(
    currentWeight,
    currentPurity,
    targetPurity,
    alloyPurity
  );

  const isDiluting = currentPurity > targetPurity;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-2 border-b pb-3">
        <div className="h-9 w-9 rounded-lg bg-brand-maroon text-brand-gold flex items-center justify-center">
          <FlaskConical className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
            KHAR / MEL CALCULATOR (खार / मेल मिश्र धातु कैलकुलेटर)
          </h1>
          <p className="text-xs text-slate-500">
            Metallurgical alloy formulation engine to raise or lower gold/silver purity to exact Karat targets
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form Inputs */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4 text-xs">
          <div className="flex rounded-lg bg-slate-100 p-1">
            <button
              onClick={() => setMetal('GOLD')}
              className={`flex-1 py-1.5 text-center font-bold rounded text-xs transition-all ${
                metal === 'GOLD' ? 'bg-brand-maroon text-brand-gold shadow-xs' : 'text-slate-600'
              }`}
            >
              Gold Alloy (सोना खार / मेल)
            </button>
            <button
              onClick={() => setMetal('SILVER')}
              className={`flex-1 py-1.5 text-center font-bold rounded text-xs transition-all ${
                metal === 'SILVER' ? 'bg-brand-maroon text-brand-gold shadow-xs' : 'text-slate-600'
              }`}
            >
              Silver Alloy (चांदी खार / मेल)
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Current Sample Weight (प्रारंभिक वजन gm)
              </label>
              <input
                type="number"
                step="0.001"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs font-bold rounded border border-slate-300 focus:outline-none focus:border-brand-maroon"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Touch / Purity (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={currentPurity}
                  onChange={(e) => setCurrentPurity(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs font-bold rounded border border-slate-300 focus:outline-none focus:border-brand-maroon"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Touch / Purity (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={targetPurity}
                  onChange={(e) => setTargetPurity(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs font-bold rounded border border-slate-300 focus:outline-none focus:border-brand-maroon text-brand-maroon"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alloy Purity to Add (%)
              </label>
              <select
                value={alloyPurity}
                onChange={(e) => setAlloyPurity(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white focus:outline-none"
              >
                <option value={0}>0.00% (Pure Copper / Alloy / Khar)</option>
                <option value={100}>100.00% (24K Pure Gold to increase touch)</option>
                <option value={91.6}>91.60% (22K Gold alloy)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Calculation Output Card */}
        <div className="bg-linear-to-br from-slate-900 via-brand-nav to-slate-950 text-white rounded-xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[11px] font-bold text-brand-gold uppercase tracking-wider block">
              Required Formulation (मिश्रण परिणाम)
            </span>
            <div className="text-3xl font-black text-white mt-1">
              {requiredAlloy.toFixed(3)} gm
            </div>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {isDiluting
                ? `Add ${requiredAlloy.toFixed(3)} gm of Copper / Alloy (0% Khar) to lower the ${currentWeight} gm batch from ${currentPurity}% to exact ${targetPurity}%.`
                : `Add ${requiredAlloy.toFixed(3)} gm of Pure Gold (100% Au) to raise the ${currentWeight} gm batch from ${currentPurity}% to exact ${targetPurity}%.`}
            </p>
          </div>

          <div className="p-3 bg-white/10 rounded-lg border border-white/10 text-xs space-y-1">
            <div className="flex justify-between">
              <span>Final Total Batch Weight:</span>
              <span className="font-bold text-brand-gold">
                {(currentWeight + requiredAlloy).toFixed(3)} gm
              </span>
            </div>
            <div className="flex justify-between">
              <span>Final Alloy Touch:</span>
              <span className="font-bold text-white">{targetPurity}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
