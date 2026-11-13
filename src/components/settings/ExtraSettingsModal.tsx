import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { ExtraSettings } from '../../types/settings';
import { settingsService } from '../../services/settingsService';
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
  Palette,
} from 'lucide-react';
import { ThemeConfigSection } from './ThemeConfigSection';

interface ExtraSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export const ExtraSettingsModal: React.FC<ExtraSettingsModalProps> = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  const { showToast } = useUIStore();
  const { user, login } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'SHOP' | 'PRINT' | 'CALC' | 'DISPLAY' | 'SECURITY' | 'THEME'>(
    'SHOP'
  );

  const [formData, setFormData] = useState<ExtraSettings>(() => settingsService.getSettings());

  useEffect(() => {
    if (isOpen) {
      setFormData(settingsService.getSettings());
    }
  }, [isOpen]);

  const handleChange = <K extends keyof ExtraSettings>(key: K, value: ExtraSettings[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    settingsService.saveSettings(formData);

    // Sync auth store shop name if changed
    if (user && formData.name !== user.shopName) {
      login(formData.mobile_no || user.mobile, '12345');
    }

    showToast('Extra Settings (एक्स्ट्रा सेटिंग्स) saved successfully!');
    if (onSaved) onSaved();
    onClose();
  };

  const handleReset = () => {
    const fresh = settingsService.getSettings();
    setFormData(fresh);
    showToast('Settings reset to saved values', 'info');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="EXTRA SETTINGS (एक्स्ट्रा सेटिंग्स) - SOFTWARE CONFIGURATION"
      maxWidth="2xl"
    >
      <div className="space-y-4">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 overflow-x-auto gap-1 text-xs font-bold scrollbar-none pb-1">
          <button
            type="button"
            onClick={() => setActiveTab('SHOP')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-t-lg transition-all shrink-0 ${
              activeTab === 'SHOP'
                ? 'bg-brand-maroon text-white shadow-xs'
                : 'text-slate-600 hover:text-brand-maroon hover:bg-slate-100'
            }`}
          >
            <Store className="h-4 w-4" />
            <span>Shop Profile (दुकान)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('PRINT')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-t-lg transition-all shrink-0 ${
              activeTab === 'PRINT'
                ? 'bg-brand-maroon text-white shadow-xs'
                : 'text-slate-600 hover:text-brand-maroon hover:bg-slate-100'
            }`}
          >
            <Printer className="h-4 w-4" />
            <span>Thermal & Print (पर्ची)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('CALC')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-t-lg transition-all shrink-0 ${
              activeTab === 'CALC'
                ? 'bg-brand-maroon text-white shadow-xs'
                : 'text-slate-600 hover:text-brand-maroon hover:bg-slate-100'
            }`}
          >
            <Calculator className="h-4 w-4" />
            <span>Calculations (नियम)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('DISPLAY')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-t-lg transition-all shrink-0 ${
              activeTab === 'DISPLAY'
                ? 'bg-brand-maroon text-white shadow-xs'
                : 'text-slate-600 hover:text-brand-maroon hover:bg-slate-100'
            }`}
          >
            <Eye className="h-4 w-4" />
            <span>Display Toggles (दिखाना)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('SECURITY')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-t-lg transition-all shrink-0 ${
              activeTab === 'SECURITY'
                ? 'bg-brand-maroon text-white shadow-xs'
                : 'text-slate-600 hover:text-brand-maroon hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Security & WhatsApp (सुरक्षा)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('THEME')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-t-lg transition-all shrink-0 ${
              activeTab === 'THEME'
                ? 'bg-brand-primary text-brand-secondary shadow-xs font-black'
                : 'text-slate-600 hover:text-brand-primary hover:bg-slate-100'
            }`}
          >
            <Palette className="h-4 w-4" />
            <span>Theme & Colors (थीम)</span>
          </button>
        </div>

        {/* Tab 1: Shop Profile */}
        {activeTab === 'SHOP' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Shop / Firm Name (दुकान का नाम) *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3 py-1.5 rounded border border-slate-300 font-semibold focus:border-brand-maroon focus:outline-none"
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
                className="w-full px-3 py-1.5 rounded border border-slate-300 focus:border-brand-maroon focus:outline-none"
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
                className="w-full px-3 py-1.5 rounded border border-slate-300 focus:border-brand-maroon focus:outline-none"
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
                className="w-full px-3 py-1.5 rounded border border-slate-300 focus:border-brand-maroon focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                GSTIN / Tax ID (जीएसटी नंबर)
              </label>
              <input
                type="text"
                value={formData.gst_no}
                onChange={(e) => handleChange('gst_no', e.target.value)}
                className="w-full px-3 py-1.5 rounded border border-slate-300 focus:border-brand-maroon focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Full Shop Address (पता - रसीद पर प्रिंट हेतु)
              </label>
              <textarea
                rows={2}
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full px-3 py-1.5 rounded border border-slate-300 focus:border-brand-maroon focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Thermal & Print Preferences */}
        {activeTab === 'PRINT' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Printer Paper Size (प्रिंटर रोल साइज़)
              </label>
              <select
                value={formData.printer_size}
                onChange={(e) => handleChange('printer_size', e.target.value as any)}
                className="w-full px-3 py-1.5 rounded border border-slate-300 bg-white"
              >
                <option value="3_inch">3-Inch Thermal Roll (80mm) - Recommended</option>
                <option value="2_inch">2-Inch Thermal Roll (58mm)</option>
                <option value="a4">Standard A4 Sheet</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Print Copy Mode (प्रिंट कॉपी)
              </label>
              <select
                value={formData.print_copy}
                onChange={(e) => handleChange('print_copy', e.target.value as any)}
                className="w-full px-3 py-1.5 rounded border border-slate-300 bg-white"
              >
                <option value="single">Single Copy (एक पर्ची)</option>
                <option value="double">Double Copy (ग्राहक + दुकान)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Top Religious Inscription (शीर्ष पंक्ति)
              </label>
              <input
                type="text"
                value={formData.thermal_header}
                onChange={(e) => handleChange('thermal_header', e.target.value)}
                className="w-full px-3 py-1.5 rounded border border-slate-300 font-serif"
                placeholder="|| Shri Ganeshay Namah ||"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Show Diya / Settled Gold Row (दिया सोना दिखाएं)
              </label>
              <select
                value={formData.thermal_diya_show}
                onChange={(e) => handleChange('thermal_diya_show', e.target.value as any)}
                className="w-full px-3 py-1.5 rounded border border-slate-300 bg-white"
              >
                <option value="show">Show (दिखाएं)</option>
                <option value="hide">Hide (छुपाएं)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Footer Left Greeting (निचली पंक्ति - बाएं)
              </label>
              <input
                type="text"
                value={formData.thermal_footer_left}
                onChange={(e) => handleChange('thermal_footer_left', e.target.value)}
                className="w-full px-3 py-1.5 rounded border border-slate-300 font-serif italic"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Footer Right Software Credit (सॉफ्टवेयर क्रेडिट)
              </label>
              <input
                type="text"
                value={formData.thermal_footer_right}
                onChange={(e) => handleChange('thermal_footer_right', e.target.value)}
                className="w-full px-3 py-1.5 rounded border border-slate-300 font-semibold"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Calculations & Rates */}
        {activeTab === 'CALC' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Charges Logic in Exchange (शुल्क घटाना / जोड़ना) *
              </label>
              <select
                value={formData.diff_gold_charge}
                onChange={(e) => handleChange('diff_gold_charge', e.target.value as any)}
                className="w-full px-3 py-1.5 rounded border border-slate-300 bg-amber-50 font-bold text-brand-maroon"
              >
                <option value="deduct_cash">Subtract Charges from Cash (शुल्क रोकड़ से घटाएं - {-300})</option>
                <option value="add_cash">Add Charges to Cash (शुल्क जोड़ें)</option>
              </select>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Verified: Diff Amount ₹12,800 - Charge ₹300 = Final Cash ₹12,500.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Default Buy Charge (डिफ़ॉल्ट खरीद शुल्क ₹)
              </label>
              <input
                type="number"
                value={formData.buy_charge}
                onChange={(e) => handleChange('buy_charge', Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Default Sell Charge (डिफ़ॉल्ट बिक्री शुल्क ₹)
              </label>
              <input
                type="number"
                value={formData.sell_charge}
                onChange={(e) => handleChange('sell_charge', Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Fine Gold Decimal Precision (दशमलव अंक)
              </label>
              <select
                value={formData.fn_point}
                onChange={(e) => handleChange('fn_point', e.target.value as any)}
                className="w-full px-3 py-1.5 rounded border border-slate-300 bg-white"
              >
                <option value="3_decimal">3 Decimal Places (0.001 gm - Milligram)</option>
                <option value="2_decimal">2 Decimal Places (0.01 gm)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tola Conversion Weight (1 तोले का वजन)
              </label>
              <select
                value={formData.tola_weight}
                onChange={(e) => handleChange('tola_weight', e.target.value as any)}
                className="w-full px-3 py-1.5 rounded border border-slate-300 bg-white"
              >
                <option value="11.664">Standard Bullion Tola (11.664 gm)</option>
                <option value="10.000">Metric 10 Gram Tola (10.000 gm)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Show 91.6 (22K) Rate on Exchange (22K भाव दिखाएं)
              </label>
              <select
                value={formData.rate_916}
                onChange={(e) => handleChange('rate_916', e.target.value as any)}
                className="w-full px-3 py-1.5 rounded border border-slate-300 bg-white"
              >
                <option value="yes">Yes (हाँ)</option>
                <option value="no">No (नहीं)</option>
              </select>
            </div>
          </div>
        )}

        {/* Tab 4: Display & Visibility Toggles */}
        {activeTab === 'DISPLAY' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Show Advance Jama / Pending Udhari Section
              </label>
              <select
                value={formData.is_pdf_udhar_jama}
                onChange={(e) => handleChange('is_pdf_udhar_jama', e.target.value as any)}
                className="w-full px-3 py-1.5 rounded border border-slate-300 bg-white"
              >
                <option value="show">Show (दिखाएं - Gold & Silver Old Balances)</option>
                <option value="hide">Hide (छुपाएं)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Hide Allowance / Extra Gold (+G/-G) Row
              </label>
              <select
                value={formData.extra_gold_hide_pdf}
                onChange={(e) => handleChange('extra_gold_hide_pdf', e.target.value as any)}
                className="w-full px-3 py-1.5 rounded border border-slate-300 bg-white"
              >
                <option value="hide">Hide when Zero (0 होने पर छुपाएं)</option>
                <option value="show">Always Show (हमेशा दिखाएं)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Vault Stock Pill in Navbar (ऊपर स्टॉक विजेट)
              </label>
              <select
                value={formData.stock_show}
                onChange={(e) => handleChange('stock_show', e.target.value as any)}
                className="w-full px-3 py-1.5 rounded border border-slate-300 bg-white"
              >
                <option value="yes">Enabled (सक्रिय)</option>
                <option value="no">Disabled (निष्क्रिय)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Table Pagination Default (प्रति पृष्ठ रिकॉर्ड)
              </label>
              <select
                value={formData.pagination_show}
                onChange={(e) => handleChange('pagination_show', Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded border border-slate-300 bg-white"
              >
                <option value={10}>10 Records</option>
                <option value={25}>25 Records</option>
                <option value={50}>50 Records</option>
                <option value={100}>100 Records</option>
              </select>
            </div>
          </div>
        )}

        {/* Tab 5: Security & System */}
        {activeTab === 'SECURITY' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Require 4-Digit Login OTP (लॉगिन ओटीपी)
              </label>
              <select
                value={formData.is_login_otp}
                onChange={(e) => handleChange('is_login_otp', e.target.value as any)}
                className="w-full px-3 py-1.5 rounded border border-slate-300 bg-white"
              >
                <option value="no">Disabled (सीधे पासवर्ड से लॉगिन)</option>
                <option value="yes">Enabled (4-अंकीय ओटीपी आवश्यक)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                WhatsApp Automated Share (व्हाट्सएप शेयर)
              </label>
              <select
                value={formData.is_whatsapp}
                onChange={(e) => handleChange('is_whatsapp', e.target.value as any)}
                className="w-full px-3 py-1.5 rounded border border-slate-300 bg-white"
              >
                <option value="yes">Enabled (सक्रिय)</option>
                <option value="no">Disabled (निष्क्रिय)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Vault Stock Password Lock (स्टॉक पासवर्ड सुरक्षा)
              </label>
              <select
                value={formData.is_set_stock_password}
                onChange={(e) => handleChange('is_set_stock_password', e.target.value as any)}
                className="w-full px-3 py-1.5 rounded border border-slate-300 bg-white"
              >
                <option value="no">Disabled (ओपन व्यू)</option>
                <option value="yes">Enabled (पासवर्ड अनिवार्य)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Master Security PIN / Password
              </label>
              <input
                type="password"
                value={formData.en_pwd || ''}
                onChange={(e) => handleChange('en_pwd', e.target.value)}
                placeholder="Enter 4-6 digit PIN"
                className="w-full px-3 py-1.5 rounded border border-slate-300"
              />
            </div>
          </div>
        )}

        {/* Tab 6: Dynamic Theme & Colors */}
        {activeTab === 'THEME' && (
          <div className="py-1">
            <ThemeConfigSection onSave={handleSave} />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-slate-600 hover:text-slate-800 text-xs font-semibold rounded hover:bg-slate-100 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset (रीसेट करें)</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel (रद्द करें)
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center space-x-1.5 px-4 py-1.5 bg-brand-maroon text-white text-xs font-bold rounded hover:bg-brand-maroon-dark transition-colors shadow-xs"
            >
              <Save className="h-4 w-4" />
              <span>Save Settings (सुरक्षित करें)</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
