import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useStockStore } from '../../store/useStockStore';
import { useUIStore } from '../../store/useUIStore';
import {
  IndianRupee,
  Scale,
  Building,
  Save,
  RotateCcw,
  Sparkles,
  Layers,
  TrendingUp,
  Percent,
} from 'lucide-react';

interface EditStockModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditStockModal: React.FC<EditStockModalProps> = ({ isOpen, onClose }) => {
  const { summary, saveCalibration, isLoading } = useStockStore();
  const { showToast } = useUIStore();

  const [activeTab, setActiveTab] = useState<'CASH' | 'GOLD' | 'SILVER' | 'KACHA' | 'UDHARI' | 'RATES'>('CASH');

  // Form states initialized with current stock summary
  const [formData, setFormData] = useState({
    // Cash
    liquidCash: 0,
    primaryBank: 0,
    secondaryBank: 0,

    // Gold
    fineGoldWeight: 0,
    goldAvgBuyRate: 0,
    goldAvgSellRate: 0,
    goldTodayBuyWeight: 0,
    goldTodaySellWeight: 0,

    // Silver
    fineSilverWeight: 0,
    silverAvgBuyRate: 0,
    silverAvgSellRate: 0,
    silverTodayBuyWeight: 0,
    silverTodaySellWeight: 0,

    // Kacha / Scrap
    totalKachaWeight: 0,
    totalFineInKacha: 0,
    todayKachaWeight: 0,
    todayFineInKacha: 0,

    // Udhari / Dues
    udharGold: 0,
    jamaGold: 0,
    udharSilver: 0,
    jamaSilver: 0,
    udharCash: 0,
    jamaCash: 0,

    // Market Benchmark Rates
    gold24K: 75000,
    gold22K: 68750,
    silver1Kg: 90000,
  });

  // Sync form when modal opens or summary changes
  useEffect(() => {
    if (isOpen && summary) {
      setFormData({
        liquidCash: summary.liquidCash || 0,
        primaryBank: summary.primaryBank || 0,
        secondaryBank: summary.secondaryBank || 0,

        fineGoldWeight: summary.pureGoldStock?.weightGm || 0,
        goldAvgBuyRate: summary.pureGoldStock?.avgBuyRate || 0,
        goldAvgSellRate: summary.pureGoldStock?.avgSellRate || 0,
        goldTodayBuyWeight: summary.pureGoldStock?.todayBuyWeight || 0,
        goldTodaySellWeight: summary.pureGoldStock?.todaySellWeight || 0,

        fineSilverWeight: summary.silverStock?.weightGm || 0,
        silverAvgBuyRate: summary.silverStock?.avgRate || 0,
        silverAvgSellRate: summary.silverStock?.avgSellRate || summary.silverStock?.avgRate || 0,
        silverTodayBuyWeight: summary.silverStock?.todayBuyWeight || 0,
        silverTodaySellWeight: summary.silverStock?.todaySellWeight || 0,

        totalKachaWeight: summary.rawScrapStock?.kachaGrossWeight || 0,
        totalFineInKacha: summary.rawScrapStock?.kachaFineEquivalent || 0,
        todayKachaWeight: summary.rawScrapStock?.todayGrossWeight ?? summary.rawScrapStock?.kachaGrossWeight ?? 0,
        todayFineInKacha: summary.rawScrapStock?.todayFineEquivalent ?? summary.rawScrapStock?.kachaFineEquivalent ?? 0,

        udharGold: Math.abs(summary.udhariOutstanding?.udharGold || 0),
        jamaGold: Math.abs(summary.udhariOutstanding?.jamaGold || 0),
        udharSilver: Math.abs(summary.udhariOutstanding?.udharSilver || 0),
        jamaSilver: Math.abs(summary.udhariOutstanding?.jamaSilver || 0),
        udharCash: Math.abs(summary.udhariOutstanding?.udharCash || 0),
        jamaCash: Math.abs(summary.udhariOutstanding?.jamaCash || 0),

        gold24K: summary.marketRates?.gold24K || 75000,
        gold22K: summary.marketRates?.gold22K || 68750,
        silver1Kg: summary.marketRates?.silver1Kg || 90000,
      });
    }
  }, [isOpen, summary]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    const num = parseFloat(value);
    setFormData((prev) => ({
      ...prev,
      [field]: isNaN(num) ? 0 : num,
    }));
  };

  const handlePreFillReference = () => {
    setFormData({
      liquidCash: 7230290,
      primaryBank: 108283,
      secondaryBank: 0,

      fineGoldWeight: 469.009,
      goldAvgBuyRate: 14114,
      goldAvgSellRate: 14445,
      goldTodayBuyWeight: 137.004,
      goldTodaySellWeight: 30.010,

      fineSilverWeight: 151498.093,
      silverAvgBuyRate: 950,
      silverAvgSellRate: 980,
      silverTodayBuyWeight: 12500.0,
      silverTodaySellWeight: 4200.0,

      totalKachaWeight: 215.0,
      totalFineInKacha: 181.55,
      todayKachaWeight: 215.0,
      todayFineInKacha: 181.55,

      udharGold: 19.0,
      jamaGold: 0.0,
      udharSilver: 413.043,
      jamaSilver: 0.0,
      udharCash: 114808,
      jamaCash: 415534,

      gold24K: 140000,
      gold22K: 128300,
      silver1Kg: 95000,
    });
    showToast('Reference sample values pre-filled in calibration form!', 'info');
  };

  const handleResetToZero = () => {
    setFormData({
      liquidCash: 0,
      primaryBank: 0,
      secondaryBank: 0,

      fineGoldWeight: 0,
      goldAvgBuyRate: 0,
      goldAvgSellRate: 0,
      goldTodayBuyWeight: 0,
      goldTodaySellWeight: 0,

      fineSilverWeight: 0,
      silverAvgBuyRate: 0,
      silverAvgSellRate: 0,
      silverTodayBuyWeight: 0,
      silverTodaySellWeight: 0,

      totalKachaWeight: 0,
      totalFineInKacha: 0,
      todayKachaWeight: 0,
      todayFineInKacha: 0,

      udharGold: 0,
      jamaGold: 0,
      udharSilver: 0,
      jamaSilver: 0,
      udharCash: 0,
      jamaCash: 0,

      gold24K: 75000,
      gold22K: 68750,
      silver1Kg: 90000,
    });
    showToast('Values cleared to clean 0 state', 'info');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveCalibration({
        liquidCash: formData.liquidCash,
        primaryBank: formData.primaryBank,
        secondaryBank: formData.secondaryBank,

        pureGoldStock: {
          weightGm: formData.fineGoldWeight,
          avgBuyRate: formData.goldAvgBuyRate,
          avgSellRate: formData.goldAvgSellRate,
          todayBuyWeight: formData.goldTodayBuyWeight,
          todaySellWeight: formData.goldTodaySellWeight,
        },

        silverStock: {
          weightGm: formData.fineSilverWeight,
          avgRate: formData.silverAvgBuyRate,
          avgSellRate: formData.silverAvgSellRate,
          todayBuyWeight: formData.silverTodayBuyWeight,
          todaySellWeight: formData.silverTodaySellWeight,
        },

        rawScrapStock: {
          kachaGrossWeight: formData.totalKachaWeight,
          kachaFineEquivalent: formData.totalFineInKacha,
          todayGrossWeight: formData.todayKachaWeight,
          todayFineEquivalent: formData.todayFineInKacha,
        },

        udhariOutstanding: {
          udharGold: formData.udharGold,
          jamaGold: formData.jamaGold,
          netCustomerGold: formData.jamaGold - formData.udharGold,

          udharSilver: formData.udharSilver,
          jamaSilver: formData.jamaSilver,
          netCustomerSilver: formData.jamaSilver - formData.udharSilver,

          udharCash: formData.udharCash,
          jamaCash: formData.jamaCash,
          netCustomerCash: formData.jamaCash - formData.udharCash,
        },

        marketRates: {
          gold24K: formData.gold24K,
          gold22K: formData.gold22K,
          silver1Kg: formData.silver1Kg,
        },
      });

      showToast('Stock calibration saved successfully! (स्टॉक अपडेट हो गया)', 'success');
      onClose();
    } catch {
      showToast('Failed to save stock calibration', 'error');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="SET STOCK / CALIBRATION (स्टॉक संशोधन व ओपनिंग बैलेंस)"
      maxWidth="2xl"
    >
      <form onSubmit={handleSave} className="space-y-4 text-xs">
        {/* Helper Explanation Banner */}
        <div className="bg-amber-50 dark:bg-amber-950/40 p-3 rounded-lg border border-amber-200 dark:border-amber-900/60 flex items-center justify-between gap-2">
          <div>
            <p className="font-bold text-amber-900 dark:text-amber-200">
              Live Stock Inventory & Cash Register Calibration
            </p>
            <p className="text-[11px] text-amber-700 dark:text-amber-400">
              Edit cash in hand, bank balances, physical fine gold/silver stock, and scrap totals stored locally.
            </p>
          </div>
          <button
            type="button"
            onClick={handlePreFillReference}
            className="shrink-0 px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded text-[11px] flex items-center space-x-1 shadow-xs"
            title="Pre-fill with reference test values"
          >
            <Sparkles className="h-3 w-3" />
            <span>Sample Values</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 overflow-x-auto gap-1 text-xs font-bold scrollbar-none pb-1">
          <button
            type="button"
            onClick={() => setActiveTab('CASH')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1 ${
              activeTab === 'CASH'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <IndianRupee className="h-3.5 w-3.5" />
            <span>Cash & Banks</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('GOLD')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1 ${
              activeTab === 'GOLD'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Scale className="h-3.5 w-3.5" />
            <span>Gold Stock</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('SILVER')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1 ${
              activeTab === 'SILVER'
                ? 'bg-slate-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Scale className="h-3.5 w-3.5" />
            <span>Silver Stock</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('KACHA')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1 ${
              activeTab === 'KACHA'
                ? 'bg-brand-maroon text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Kacha / Scrap</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('UDHARI')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1 ${
              activeTab === 'UDHARI'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Opening Udhari</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('RATES')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1 ${
              activeTab === 'RATES'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Percent className="h-3.5 w-3.5" />
            <span>Market Rates</span>
          </button>
        </div>

        {/* Tab 1: CASH */}
        {activeTab === 'CASH' && (
          <div className="space-y-3 p-1">
            <h4 className="font-bold text-slate-800 dark:text-slate-200">
              Liquid Cash & Bank Balances (नकद व बैंक खाते)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Cash in Stock / Cash in Hand (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    step="any"
                    value={formData.liquidCash}
                    onChange={(e) => handleChange('liquidCash', e.target.value)}
                    className="w-full pl-7 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold focus:border-brand-maroon focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Primary Bank (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    step="any"
                    value={formData.primaryBank}
                    onChange={(e) => handleChange('primaryBank', e.target.value)}
                    className="w-full pl-7 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold focus:border-brand-maroon focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Self Bank 2 (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    step="any"
                    value={formData.secondaryBank}
                    onChange={(e) => handleChange('secondaryBank', e.target.value)}
                    className="w-full pl-7 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold focus:border-brand-maroon focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: GOLD */}
        {activeTab === 'GOLD' && (
          <div className="space-y-3 p-1">
            <h4 className="font-bold text-slate-800 dark:text-slate-200">
              Gold Stock Inventory & Activity (स्वर्ण स्टॉक विवरण)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Fine Gold in Stock (gm)
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.fineGoldWeight}
                  onChange={(e) => handleChange('fineGoldWeight', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold focus:border-brand-maroon focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Purchase Rate / Avg Buy (खरीदना भाव ₹/10g)
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.goldAvgBuyRate}
                  onChange={(e) => handleChange('goldAvgBuyRate', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold focus:border-brand-maroon focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Sale Rate / Avg Sell (बेचना भाव ₹/10g)
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.goldAvgSellRate}
                  onChange={(e) => handleChange('goldAvgSellRate', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold focus:border-brand-maroon focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Today Buy Fine (gm)
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.goldTodayBuyWeight}
                  onChange={(e) => handleChange('goldTodayBuyWeight', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold focus:border-brand-maroon focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Today Sell Fine (gm)
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.goldTodaySellWeight}
                  onChange={(e) => handleChange('goldTodaySellWeight', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold focus:border-brand-maroon focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: SILVER */}
        {activeTab === 'SILVER' && (
          <div className="space-y-3 p-1">
            <h4 className="font-bold text-slate-800 dark:text-slate-200">
              Silver Stock Inventory & Activity (चांदी स्टॉक विवरण)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Fine Silver in Stock (gm)
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.fineSilverWeight}
                  onChange={(e) => handleChange('fineSilverWeight', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold focus:border-brand-maroon focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Purchase Rate / Avg Buy (खरीदना भाव ₹/1kg)
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.silverAvgBuyRate}
                  onChange={(e) => handleChange('silverAvgBuyRate', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold focus:border-brand-maroon focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Sale Rate / Avg Sell (बेचना भाव ₹/1kg)
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.silverAvgSellRate}
                  onChange={(e) => handleChange('silverAvgSellRate', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold focus:border-brand-maroon focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Today Buy Fine Silver (gm)
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.silverTodayBuyWeight}
                  onChange={(e) => handleChange('silverTodayBuyWeight', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold focus:border-brand-maroon focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Today Sell Fine Silver (gm)
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.silverTodaySellWeight}
                  onChange={(e) => handleChange('silverTodaySellWeight', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold focus:border-brand-maroon focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: KACHA */}
        {activeTab === 'KACHA' && (
          <div className="space-y-3 p-1">
            <h4 className="font-bold text-slate-800 dark:text-slate-200">
              Raw Scrap & Kacha Stock (कच्चा सोना / चांदी)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Total Kacha Gross Weight (gm)
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.totalKachaWeight}
                  onChange={(e) => handleChange('totalKachaWeight', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold focus:border-brand-maroon focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Total Fine in Kacha (gm)
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.totalFineInKacha}
                  onChange={(e) => handleChange('totalFineInKacha', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold focus:border-brand-maroon focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Today Kacha Weight (gm)
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.todayKachaWeight}
                  onChange={(e) => handleChange('todayKachaWeight', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold focus:border-brand-maroon focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Today Fine in Kacha (gm)
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.todayFineInKacha}
                  onChange={(e) => handleChange('todayFineInKacha', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold focus:border-brand-maroon focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: UDHARI */}
        {activeTab === 'UDHARI' && (
          <div className="space-y-3 p-1">
            <h4 className="font-bold text-slate-800 dark:text-slate-200">
              Opening Customer Dues & Dues Calibration (ओपनिंग उधार व जमा)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                <span className="font-bold text-slate-700 dark:text-slate-300 block text-xs">
                  Gold Dues (सोना उधारी)
                </span>
                <div>
                  <label className="block text-[10px] text-rose-600 font-semibold mb-0.5">
                    UDHAR GOLD (gm)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.udharGold}
                    onChange={(e) => handleChange('udharGold', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-mono text-rose-600 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-emerald-600 font-semibold mb-0.5">
                    JAMA GOLD (gm)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.jamaGold}
                    onChange={(e) => handleChange('jamaGold', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-mono text-emerald-600 font-bold"
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                <span className="font-bold text-slate-700 dark:text-slate-300 block text-xs">
                  Silver Dues (चांदी उधारी)
                </span>
                <div>
                  <label className="block text-[10px] text-rose-600 font-semibold mb-0.5">
                    UDHAR SILVER (gm)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.udharSilver}
                    onChange={(e) => handleChange('udharSilver', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-mono text-rose-600 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-emerald-600 font-semibold mb-0.5">
                    JAMA SILVER (gm)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.jamaSilver}
                    onChange={(e) => handleChange('jamaSilver', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-mono text-emerald-600 font-bold"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block text-xs">
                    Cash Dues (नकद उधारी)
                  </span>
                </div>
                <div>
                  <label className="block text-[10px] text-rose-600 font-semibold mb-0.5">
                    UDHAR CASH (₹)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.udharCash}
                    onChange={(e) => handleChange('udharCash', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-mono text-rose-600 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-emerald-600 font-semibold mb-0.5">
                    JAMA CASH (₹)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.jamaCash}
                    onChange={(e) => handleChange('jamaCash', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-mono text-emerald-600 font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: RATES */}
        {activeTab === 'RATES' && (
          <div className="space-y-3 p-1">
            <h4 className="font-bold text-slate-800 dark:text-slate-200">
              Benchmark Market Rates for Valuation (बाजार भाव)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Gold 24K Rate (₹/10g)
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.gold24K}
                  onChange={(e) => handleChange('gold24K', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold focus:border-brand-maroon focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Gold 22K Rate (₹/10g)
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.gold22K}
                  onChange={(e) => handleChange('gold22K', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold focus:border-brand-maroon focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Silver Rate (₹/1kg)
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.silver1Kg}
                  onChange={(e) => handleChange('silver1Kg', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold focus:border-brand-maroon focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Modal Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={handleResetToZero}
            className="flex items-center justify-center space-x-1.5 px-3 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-xs font-semibold transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset to 0</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs font-bold transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center space-x-1.5 px-5 py-2 bg-brand-maroon hover:bg-brand-maroon-dark text-white rounded-lg text-xs font-bold transition-colors shadow-xs disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{isLoading ? 'Saving...' : 'Save Stock Calibration'}</span>
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
