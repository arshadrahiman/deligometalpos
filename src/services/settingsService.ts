import { ExtraSettings } from '../types/settings';
import { getItem, setItem } from './storage';

const STORAGE_KEY = 'hs_extra_settings';

export const DEFAULT_EXTRA_SETTINGS: ExtraSettings = {
  // 1. Shop Profile
  name: 'Lakshmi Gold Testing',
  mobile_no: '9645808999',
  email: 'info@deligotechnologies.com',
  landline_no: '1234567890',
  gst_no: '23ABCDE1234F1Z5',
  address: 'mp nagar zone - 1, bhopal, madhya pradesh',

  // 2. Thermal & Printing
  printer_size: '3_inch',
  print_copy: 'single',
  thermal_header: '|| Shri Ganeshay Namah ||',
  thermal_diya_show: 'show',
  thermal_footer_left: 'Thank You Visit Again',
  thermal_footer_right: 'Software by Deligo Technologies ®',
  thermal_footer_logo_show: 'show',
  is_print_btn: 'enabled',

  // 3. Calculation Rules
  buy_charge: 300,
  sell_charge: 300,
  is_bs_charge: 'yes',
  is_silver_charge: 'yes',
  is_bs_discount: 'yes',
  rate_916: 'yes',
  fn_point: '3_decimal',
  tola_weight: '11.664',
  diff_gold_charge: 'deduct_cash',
  per_tounch: 'percentage',
  touch_minus_hide: 'no',

  // 4. Visibility Toggles
  shop_show: 'yes',
  shop_address_show: 'yes',
  cust_show: 'yes',
  shop_landline_no_show: 'yes',
  is_pdf_udhar_jama: 'show',
  extra_gold_hide_pdf: 'hide',
  stock_show: 'yes',
  old_record_show: 'yes',
  ledger_tl_show: 'yes',
  pagination_show: 10,

  // 5. System & Security
  is_login_otp: 'no',
  is_whatsapp: 'yes',
  is_share: 'yes',
  is_set_stock_password: 'no',

  // 6. Dynamic Theme & Color Settings (Navy Blue & Yellow Default)
  theme_preset: 'navy_yellow',
  primary_color: '#0f2744',
  primary_dark: '#0a192f',
  primary_light: '#1e3a5f',
  accent_color: '#ffd700',
  accent_dark: '#eab308',
  nav_color: '#0a192f',
  surface_color: '#f0f4f9',
};

export const settingsService = {
  getSettings(): ExtraSettings {
    return getItem<ExtraSettings>(STORAGE_KEY, DEFAULT_EXTRA_SETTINGS);
  },

  saveSettings(settings: ExtraSettings): ExtraSettings {
    setItem(STORAGE_KEY, settings);
    return settings;
  },

  updatePartial(updates: Partial<ExtraSettings>): ExtraSettings {
    const current = this.getSettings();
    const merged = { ...current, ...updates };
    setItem(STORAGE_KEY, merged);
    return merged;
  },
};

