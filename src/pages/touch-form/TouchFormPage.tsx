import React, { useState, useEffect } from 'react';
import { FileCheck2, Printer, QrCode, Sparkles, Zap } from 'lucide-react';
import { calculateKarat } from '../../utils/calculations/bullionMath';
import { useMetalStore } from '../../store/useMetalStore';

export const TouchFormPage: React.FC = () => {
  const { metalMode } = useMetalStore();
  const isSilver = metalMode === 'SILVER';

  const [reportNo, setReportNo] = useState('XRF-2026-5541');
  const [customerName, setCustomerName] = useState('Rajesh Swarnakar');
  const [sampleDesc, setSampleDesc] = useState(isSilver ? 'Silver / Chandi Sample (चाँदी)' : 'Lagdi / Melting Sample (सोना)');
  const [sampleWeight, setSampleWeight] = useState<number>(14.85);
  const [goldTouch, setGoldTouch] = useState<number>(isSilver ? 0.0 : 91.75);
  const [silverTouch, setSilverTouch] = useState<number>(isSilver ? 92.5 : 4.2);
  const [copperTouch, setCopperTouch] = useState<number>(isSilver ? 7.3 : 3.85);
  const [zincTouch, setZincTouch] = useState<number>(0.2);

  useEffect(() => {
    if (isSilver) {
      setSampleDesc('Silver / Chandi Sample (चाँदी)');
      setGoldTouch(0.0);
      setSilverTouch(92.5);
      setCopperTouch(7.3);
    } else {
      setSampleDesc('Lagdi / Melting Sample (सोना)');
      setGoldTouch(91.75);
      setSilverTouch(4.2);
      setCopperTouch(3.85);
    }
  }, [isSilver]);

  const calculatedKarat = calculateKarat(goldTouch);

  // Auto-fill copper to balance to 100%
  const handleFitInCopper = () => {
    const currentOthers = (goldTouch || 0) + (silverTouch || 0) + (zincTouch || 0);
    const remainder = Math.max(0, Math.round((100.0 - currentOthers) * 100) / 100);
    setCopperTouch(remainder);
  };

  const totalAssay = Math.round(
    (Number(goldTouch) + Number(silverTouch) + Number(copperTouch) + Number(zincTouch)) * 100
  ) / 100;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-2 border-b pb-3">
        <div className="h-9 w-9 rounded-lg bg-brand-maroon text-brand-gold flex items-center justify-center">
          <FileCheck2 className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
            TOUCH TESTING REPORT (टंच / XRF टेस्टिंग फॉर्म)
          </h1>
          <p className="text-xs text-slate-500">
            Precision XRF Spectrometer gold and silver testing certificate with elemental concentration balance
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Inputs */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4 text-xs">
          <span className="text-xs font-bold text-slate-800 uppercase block border-b pb-2">
            Sample Details & Elemental Assay
          </span>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Report Serial #
              </label>
              <input
                type="text"
                value={reportNo}
                onChange={(e) => setReportNo(e.target.value)}
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
                Sample Description
              </label>
              <input
                type="text"
                value={sampleDesc}
                onChange={(e) => setSampleDesc(e.target.value)}
                className="w-full px-2.5 py-1 text-xs rounded border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Sample Weight (gm)
              </label>
              <input
                type="number"
                step="0.001"
                value={sampleWeight}
                onChange={(e) => setSampleWeight(Number(e.target.value))}
                className="w-full px-2.5 py-1 text-xs rounded border border-slate-300 font-bold"
              />
            </div>
          </div>

          {/* Elemental Analysis Grid */}
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-600 uppercase block">
                Element Concentration Analysis (%)
              </span>
              <button
                type="button"
                onClick={handleFitInCopper}
                className="flex items-center space-x-1 px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[10px] transition-colors"
                title="Automatically calculate remaining percentage into copper"
              >
                <Zap className="h-3 w-3" />
                <span>⚡ Fit in Copper</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label className="block text-[10px] font-semibold text-amber-900 mb-0.5">
                  Gold (Au) %
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={goldTouch}
                  onChange={(e) => setGoldTouch(Number(e.target.value))}
                  className="w-full px-2 py-1 text-xs rounded border border-amber-300 bg-white font-black text-amber-900"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                  Silver (Ag) %
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={silverTouch}
                  onChange={(e) => setSilverTouch(Number(e.target.value))}
                  className="w-full px-2 py-1 text-xs rounded border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                  Copper (Cu) %
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={copperTouch}
                  onChange={(e) => setCopperTouch(Number(e.target.value))}
                  className="w-full px-2 py-1 text-xs rounded border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                  Zinc (Zn) %
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={zincTouch}
                  onChange={(e) => setZincTouch(Number(e.target.value))}
                  className="w-full px-2 py-1 text-xs rounded border border-slate-300 bg-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <span>Total Assay Concentration:</span>
              <span
                className={`font-extrabold ${
                  totalAssay === 100 ? 'text-emerald-700' : 'text-amber-700'
                }`}
              >
                {totalAssay}% {totalAssay === 100 && '✓ Balanced'}
              </span>
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 px-4 py-2 bg-brand-maroon text-white font-bold text-xs rounded-lg hover:bg-brand-maroon-dark transition-all shadow-xs"
          >
            <Printer className="h-4 w-4" />
            <span>Print Official Testing Certificate</span>
          </button>
        </div>

        {/* Live Lab Certificate Preview */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4 font-poppins">
          <div className="border-b-2 border-brand-maroon pb-3 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-black text-brand-maroon tracking-tight">
                LAKSHMI GOLD TESTING & ASSAY LAB
              </h2>
              <p className="text-[10px] text-slate-500">
                Government Approved XRF Testing Center | Sarafa Bazaar, Indore
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 block">{reportNo}</span>
              <span className="text-[10px] font-semibold text-slate-600">
                Date: {new Date().toLocaleDateString('en-IN')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs py-2">
            <div>
              <span className="text-slate-400 block">Customer Name:</span>
              <span className="font-bold text-slate-800">{customerName}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Sample Description:</span>
              <span className="font-semibold text-slate-800">{sampleDesc}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Sample Weight:</span>
              <span className="font-bold text-brand-maroon">{sampleWeight.toFixed(3)} gm</span>
            </div>
            <div>
              <span className="text-slate-400 block">Assayed Karat:</span>
              <span className="font-black text-amber-600 text-sm">{calculatedKarat} K</span>
            </div>
          </div>

          {/* Elemental Table */}
          <div className="border rounded overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 font-semibold border-b">
                <tr>
                  <th className="p-2">Element</th>
                  <th className="p-2">Concentration %</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-700">
                <tr className="bg-amber-50/50 font-bold">
                  <td className="p-2 text-amber-900">Gold (Au)</td>
                  <td className="p-2 text-amber-900">{goldTouch}%</td>
                  <td className="p-2 text-emerald-700">Primary Pure Metal</td>
                </tr>
                <tr>
                  <td className="p-2">Silver (Ag)</td>
                  <td className="p-2">{silverTouch}%</td>
                  <td className="p-2 text-slate-500">Alloy Metal</td>
                </tr>
                <tr>
                  <td className="p-2">Copper (Cu)</td>
                  <td className="p-2">{copperTouch}%</td>
                  <td className="p-2 text-slate-500">Alloy Metal</td>
                </tr>
                <tr>
                  <td className="p-2">Zinc (Zn)</td>
                  <td className="p-2">{zincTouch}%</td>
                  <td className="p-2 text-slate-500">Trace Element</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between pt-4 border-t text-[10px] text-slate-400">
            <div className="flex items-center space-x-2">
              <QrCode className="h-8 w-8 text-slate-800" />
              <span>Scan QR to verify authentic assay report</span>
            </div>
            <div className="text-right">
              <div className="h-6" />
              <span className="font-bold text-slate-700 border-t border-slate-400 pt-1">
                Authorized Lab Signatory
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

