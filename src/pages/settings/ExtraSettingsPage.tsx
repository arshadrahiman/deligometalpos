import React, { useState } from 'react';
import { settingsService } from '../../services/settingsService';
import { ExtraSettings } from '../../types/settings';
import { useUIStore } from '../../store/useUIStore';
import { useAuthStore } from '../../store/useAuthStore';
import {
  SlidersHorizontal,
  Store,
  Printer,
  Calculator,
  Eye,
  ShieldCheck,
  Save,
  RotateCcw,
  CheckCircle2,
  Palette,
} from 'lucide-react';
import { ThemeConfigSection } from '../../components/settings/ThemeConfigSection';

export const ExtraSettingsPage: React.FC = () => {
  const { showToast } = useUIStore();
  const { user, login } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'SHOP' | 'PRINT' | 'CALC' | 'DISPLAY' | 'SECURITY' | 'THEME'>(
    'SHOP'
  );

  const [formData, setFormData] = useState<ExtraSettings>(() => settingsService.getSettings());

  const handleChange = <K extends keyof ExtraSettings>(key: K, value: ExtraSettings[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    settingsService.saveSettings(formData);

    if (user && formData.name !== user.shopName) {
      login(formData.mobile_no || user.mobile, '12345');
    }

    showToast('Extra Settings (एक्स्ट्रा सेटिंग्स) updated and saved successfully!');
  };

  const handleReset = () => {
    const saved = settingsService.getSettings();
    setFormData(saved);
    showToast('Settings restored to saved values', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-brand-maroon/10 text-brand-maroon flex items-center justify-center shrink-0">
            <SlidersHorizontal className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-800">
              EXTRA SETTINGS (एक्स्ट्रा सेटिंग्स)
            </h1>
            <p className="text-xs text-slate-500">
              Configure master shop profile, 3-inch thermal slip preferences, calculations & system toggles
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center space-x-1.5 px-3 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-lg transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center space-x-1.5 px-4 py-2 bg-brand-maroon text-white text-xs font-bold rounded-lg hover:bg-brand-maroon-dark transition-colors shadow-xs"
          >
            <Save className="h-4 w-4" />
            <span>Save All Settings</span>
          </button>
        </div>
      </div>

      {/* Main Settings Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Tabs Bar */}
        <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto gap-1 p-2 text-xs font-bold scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('SHOP')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all shrink-0 ${
              activeTab === 'SHOP'
                ? 'bg-brand-maroon text-white shadow-xs'
                : 'text-slate-600 hover:text-brand-maroon hover:bg-white'
            }`}
          >
            <Store className="h-4 w-4" />
            <span>Shop Profile (दुकान विवरण)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('PRINT')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all shrink-0 ${
              activeTab === 'PRINT'
                ? 'bg-brand-maroon text-white shadow-xs'
                : 'text-slate-600 hover:text-brand-maroon hover:bg-white'
            }`}
          >
            <Printer className="h-4 w-4" />
            <span>Thermal & Print (पर्ची व प्रिंटर)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('CALC')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all shrink-0 ${
              activeTab === 'CALC'
                ? 'bg-brand-maroon text-white shadow-xs'
                : 'text-slate-600 hover:text-brand-maroon hover:bg-white'
            }`}
          >
            <Calculator className="h-4 w-4" />
            <span>Calculation Rules (कैलकुलेशन नियम)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('DISPLAY')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all shrink-0 ${
              activeTab === 'DISPLAY'
                ? 'bg-brand-maroon text-white shadow-xs'
                : 'text-slate-600 hover:text-brand-maroon hover:bg-white'
            }`}
          >
            <Eye className="h-4 w-4" />
            <span>Display Toggles (दिखाना / छुपाना)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('SECURITY')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all shrink-0 ${
              activeTab === 'SECURITY'
                ? 'bg-brand-maroon text-white shadow-xs'
                : 'text-slate-600 hover:text-brand-maroon hover:bg-white'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Security & WhatsApp (सुरक्षा)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('THEME')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all shrink-0 ${
              activeTab === 'THEME'
                ? 'bg-brand-primary text-brand-secondary shadow-xs font-black'
                : 'text-slate-600 hover:text-brand-primary hover:bg-white'
            }`}
          >
            <Palette className="h-4 w-4" />
            <span>Theme & Colors (थीम एवं रंग)</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-5">
          {activeTab === 'SHOP' && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                <Store className="h-4 w-4 text-brand-maroon" />
                <span>Shop Identity & Official Credentials</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Shop / Firm Name (दुकान का नाम) *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold focus:border-brand-maroon focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Primary Mobile Number (मोबाइल नंबर) *
                  </label>
                  <input
                    type="text"
                    value={formData.mobile_no}
                    onChange={(e) => handleChange('mobile_no', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-brand-maroon focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Landline / Secondary Phone (दूसरा नंबर)
                  </label>
                  <input
                    type="text"
                    value={formData.landline_no}
                    onChange={(e) => handleChange('landline_no', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-brand-maroon focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Email Address (ईमेल)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-brand-maroon focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    GSTIN / Tax Registration No (जीएसटी)
                  </label>
                  <input
                    type="text"
                    value={formData.gst_no}
                    onChange={(e) => handleChange('gst_no', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-brand-maroon focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Full Address (दुकान का पूरा पता - रसीद व बिल पर प्रिंट हेतु)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-brand-maroon focus:outline-none leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'PRINT' && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                <Printer className="h-4 w-4 text-brand-maroon" />
                <span>Thermal Slip & Printing Configurations</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Thermal Printer Size (प्रिंटर साइज़)
                  </label>
                  <select
                    value={formData.printer_size}
                    onChange={(e) => handleChange('printer_size', e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="3_inch">3-Inch Thermal Roll (80mm) - High Precision</option>
                    <option value="2_inch">2-Inch Thermal Roll (58mm)</option>
                    <option value="a4">Standard A4 Sheet Format</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Print Copies per Order (प्रिंट कॉपी)
                  </label>
                  <select
                    value={formData.print_copy}
                    onChange={(e) => handleChange('print_copy', e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="single">Single Copy (एक पर्ची)</option>
                    <option value="double">Double Copy (Customer + Office Copy)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Top Inscription / Mantra (शीर्ष धार्मिक पंक्ति)
                  </label>
                  <input
                    type="text"
                    value={formData.thermal_header}
                    onChange={(e) => handleChange('thermal_header', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-serif"
                    placeholder="|| Shri Ganeshay Namah ||"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Show Gold Paid / Diya Row on Slip
                  </label>
                  <select
                    value={formData.thermal_diya_show}
                    onChange={(e) => handleChange('thermal_diya_show', e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="show">Show (दिखाएं)</option>
                    <option value="hide">Hide (छुपाएं)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Footer Greeting (निचली पंक्ति - अभिवादन)
                  </label>
                  <input
                    type="text"
                    value={formData.thermal_footer_left}
                    onChange={(e) => handleChange('thermal_footer_left', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-serif italic"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Software Footer Credit
                  </label>
                  <input
                    type="text"
                    value={formData.thermal_footer_right}
                    onChange={(e) => handleChange('thermal_footer_right', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'CALC' && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                <Calculator className="h-4 w-4 text-brand-maroon" />
                <span>Bullion Exchange & Rate Mathematical Rules</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Charges Settlement Rule in Exchange POS *
                  </label>
                  <select
                    value={formData.diff_gold_charge}
                    onChange={(e) => handleChange('diff_gold_charge', e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-amber-50 font-bold text-brand-maroon"
                  >
                    <option value="deduct_cash">
                      Subtract Charges from Cash (शुल्क रोकड़ से घटाएं - {-300})
                    </option>
                    <option value="add_cash">Add Charges to Cash (शुल्क जोड़ें)</option>
                  </select>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Verified bill formula: Final Cash = Diff Amount - Charges (₹12,800 - ₹300 = ₹12,500).
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Default Buy Fee (डिफ़ॉल्ट खरीद शुल्क ₹)
                  </label>
                  <input
                    type="number"
                    value={formData.buy_charge}
                    onChange={(e) => handleChange('buy_charge', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Default Sell Fee (डिफ़ॉल्ट बिक्री शुल्क ₹)
                  </label>
                  <input
                    type="number"
                    value={formData.sell_charge}
                    onChange={(e) => handleChange('sell_charge', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Fine Gold Decimal Precision (दशमलव शुद्धता)
                  </label>
                  <select
                    value={formData.fn_point}
                    onChange={(e) => handleChange('fn_point', e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="3_decimal">3 Decimal Digits (0.001 gm - Milligram Precision)</option>
                    <option value="2_decimal">2 Decimal Digits (0.01 gm)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    1 Tola Standard Weight (तोला वजन)
                  </label>
                  <select
                    value={formData.tola_weight}
                    onChange={(e) => handleChange('tola_weight', e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="11.664">Traditional Bullion Tola (11.664 gm)</option>
                    <option value="10.000">Modern 10-Gram Metric Standard</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Show 22K (91.6) Secondary Rate on Dashboard
                  </label>
                  <select
                    value={formData.rate_916}
                    onChange={(e) => handleChange('rate_916', e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="yes">Yes (हाँ - 22K भाव प्रदर्शित करें)</option>
                    <option value="no">No (नहीं)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'DISPLAY' && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                <Eye className="h-4 w-4 text-brand-maroon" />
                <span>Receipt Display & Ledger Toggles</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Show Advance Jama / Pending Udhari Section on Slips
                  </label>
                  <select
                    value={formData.is_pdf_udhar_jama}
                    onChange={(e) => handleChange('is_pdf_udhar_jama', e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="show">Show (दिखाएं - Gold & Silver Balances)</option>
                    <option value="hide">Hide (छुपाएं)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Hide Allowance / Extra Gold (+G/-G)
                  </label>
                  <select
                    value={formData.extra_gold_hide_pdf}
                    onChange={(e) => handleChange('extra_gold_hide_pdf', e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="hide">Hide when Zero (0 होने पर छुपाएं)</option>
                    <option value="show">Always Show (हमेशा दिखाएं)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Vault Stock Pill in Navbar (शीर्ष स्टॉक विजेट)
                  </label>
                  <select
                    value={formData.stock_show}
                    onChange={(e) => handleChange('stock_show', e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="yes">Enabled (सक्रिय)</option>
                    <option value="no">Disabled (छुपाएं)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Table Pagination Records per Page
                  </label>
                  <select
                    value={formData.pagination_show}
                    onChange={(e) => handleChange('pagination_show', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value={10}>10 Records</option>
                    <option value={25}>25 Records</option>
                    <option value={50}>50 Records</option>
                    <option value={100}>100 Records</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'SECURITY' && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                <ShieldCheck className="h-4 w-4 text-brand-maroon" />
                <span>Security Access & Messaging Settings</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Require 4-Digit Login OTP (लॉगिन ओटीपी)
                  </label>
                  <select
                    value={formData.is_login_otp}
                    onChange={(e) => handleChange('is_login_otp', e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="no">Disabled (सीधे पासवर्ड से लॉगिन)</option>
                    <option value="yes">Enabled (4-अंकीय ओटीपी आवश्यक)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    WhatsApp Automated Slip Dispatch
                  </label>
                  <select
                    value={formData.is_whatsapp}
                    onChange={(e) => handleChange('is_whatsapp', e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="yes">Enabled (सक्रिय)</option>
                    <option value="no">Disabled (निष्क्रिय)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Vault Stock Password Protection (पासवर्ड सुरक्षा)
                  </label>
                  <select
                    value={formData.is_set_stock_password}
                    onChange={(e) => handleChange('is_set_stock_password', e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="no">Disabled (ओपन एक्सेस)</option>
                    <option value="yes">Enabled (पासवर्ड अनिवार्य)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Master Administrator PIN
                  </label>
                  <input
                    type="password"
                    value={formData.en_pwd || ''}
                    onChange={(e) => handleChange('en_pwd', e.target.value)}
                    placeholder="Enter 4-6 digit PIN"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 6. Dynamic Theme & Colors Tab */}
          {activeTab === 'THEME' && (
            <div className="space-y-4">
              <ThemeConfigSection onSave={handleSave} />
            </div>
          )}

          {/* Bottom Save Bar */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center space-x-1.5 px-3 py-2 text-slate-600 hover:text-slate-800 text-xs font-semibold rounded-lg hover:bg-slate-100 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset to Default</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="flex items-center space-x-1.5 px-6 py-2.5 bg-brand-maroon text-white text-xs font-bold rounded-lg hover:bg-brand-maroon-dark transition-colors shadow-md"
            >
              <Save className="h-4 w-4" />
              <span>Save Extra Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

