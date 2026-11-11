import React, { useState } from 'react';
import { Award, Printer, Save, Sparkles, QrCode } from 'lucide-react';
import { calculateKarat } from '../../utils/calculations/bullionMath';

export const CertificatePage: React.FC = () => {
  const [certNo, setCertNo] = useState('LGT-2026-9842');
  const [customerName, setCustomerName] = useState('Rajesh Swarnakar');
  const [productName, setProductName] = useState('22K Gold Antique Ring');
  const [weight, setWeight] = useState<number>(8.45);
  const [goldPercent, setGoldPercent] = useState<number>(91.6);
  const [copperPercent, setCopperPercent] = useState<number>(4.8);
  const [silverPercent, setSilverPercent] = useState<number>(3.6);

  const calculatedKarat = calculateKarat(goldPercent);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-2 border-b pb-3">
        <div className="h-9 w-9 rounded-lg bg-brand-maroon text-brand-gold flex items-center justify-center">
          <Award className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
            PVC PURITY CERTIFICATES (प्योरिटी सर्टिफिकेट)
          </h1>
          <p className="text-xs text-slate-500">
            Design, preview, and print bank-grade PVC Gold Purity Cards with elemental assay analysis
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3 text-xs">
          <span className="text-xs font-bold text-slate-800 uppercase block border-b pb-2">
            Certificate Details & Elements
          </span>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Certificate S.No
              </label>
              <input
                type="text"
                value={certNo}
                onChange={(e) => setCertNo(e.target.value)}
                className="w-full px-2.5 py-1 text-xs rounded border border-slate-300 font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Customer Name
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-2.5 py-1 text-xs rounded border border-slate-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Product Description
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-2.5 py-1 text-xs rounded border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Gross Weight (gm)
              </label>
              <input
                type="number"
                step="0.001"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full px-2.5 py-1 text-xs rounded border border-slate-300 font-bold"
              />
            </div>
          </div>

          {/* Elemental Analysis Grid */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
            <span className="text-[10px] font-bold text-slate-600 uppercase block">
              XRF Spectrometer Elemental Assay (%)
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] font-semibold text-amber-900 mb-0.5">
                  Gold (Au) %
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={goldPercent}
                  onChange={(e) => setGoldPercent(Number(e.target.value))}
                  className="w-full px-2 py-1 text-xs rounded border border-amber-300 bg-white font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                  Copper (Cu) %
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={copperPercent}
                  onChange={(e) => setCopperPercent(Number(e.target.value))}
                  className="w-full px-2 py-1 text-xs rounded border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                  Silver (Ag) %
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={silverPercent}
                  onChange={(e) => setSilverPercent(Number(e.target.value))}
                  className="w-full px-2 py-1 text-xs rounded border border-slate-300 bg-white"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => window.print()}
              className="flex items-center space-x-1.5 px-4 py-2 bg-brand-maroon text-white font-bold text-xs rounded-lg hover:bg-brand-maroon-dark transition-all shadow-xs"
            >
              <Printer className="h-4 w-4" />
              <span>Print PVC Card</span>
            </button>
          </div>
        </div>

        {/* Live PVC Card Visual Preview */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-100 rounded-xl border border-slate-300">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
            Live Plastic PVC Card Preview (85.6mm × 54mm)
          </span>

          <div className="w-[340px] h-[214px] bg-linear-to-br from-slate-900 via-amber-950 to-slate-950 text-white rounded-2xl p-4 shadow-2xl border-2 border-brand-gold relative overflow-hidden flex flex-col justify-between">
            {/* Hologram Accent */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-gold/10 rounded-full blur-xl pointer-events-none" />

            {/* Top Row: Lab Header & Certificate ID */}
            <div className="flex items-start justify-between border-b border-amber-500/30 pb-2">
              <div className="flex items-center space-x-2">
                <div className="h-7 w-7 rounded bg-brand-maroon border border-brand-gold flex items-center justify-center text-brand-gold">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-black tracking-wide text-brand-gold">
                    LAKSHMI GOLD TESTING
                  </div>
                  <div className="text-[8px] text-slate-300 tracking-wider">
                    CERTIFICATE OF AUTHENTICITY
                  </div>
                </div>
              </div>
              <span className="text-[9px] font-mono text-amber-200">{certNo}</span>
            </div>

            {/* Middle Row: Item & Purity Badge */}
            <div className="grid grid-cols-3 gap-2 my-auto items-center">
              <div className="col-span-2 space-y-1 text-[10px]">
                <div>
                  <span className="text-slate-400">Customer:</span>{' '}
                  <span className="font-bold text-white">{customerName}</span>
                </div>
                <div>
                  <span className="text-slate-400">Item:</span>{' '}
                  <span className="font-semibold text-slate-200">{productName}</span>
                </div>
                <div>
                  <span className="text-slate-400">Gross Wt:</span>{' '}
                  <span className="font-bold text-brand-gold">{weight.toFixed(3)} gm</span>
                </div>
              </div>

              {/* Karat Seal Badge */}
              <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-brand-maroon/80 border border-brand-gold shadow-md">
                <span className="text-[9px] text-amber-200 font-bold uppercase">PURITY</span>
                <span className="text-lg font-black text-brand-gold leading-none my-0.5">
                  {calculatedKarat}K
                </span>
                <span className="text-[9px] font-bold text-white">{goldPercent}% Au</span>
              </div>
            </div>

            {/* Bottom Row: Elemental Breakdown & QR Code */}
            <div className="flex items-end justify-between border-t border-amber-500/30 pt-1.5 text-[8px] text-slate-300">
              <div className="space-x-2 font-mono">
                <span>Au: {goldPercent}%</span>
                <span>Cu: {copperPercent}%</span>
                <span>Ag: {silverPercent}%</span>
              </div>
              <div className="flex items-center space-x-1">
                <QrCode className="h-6 w-6 text-brand-gold" />
                <span className="text-[7px] text-slate-400">SCAN TO VERIFY</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

