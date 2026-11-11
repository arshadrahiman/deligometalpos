export interface ExtraSettings {
  // 1. Shop Profile & Identity
  name: string;
  mobile_no: string;
  email: string;
  landline_no: string;
  gst_no: string;
  address: string;

  // 2. Thermal & Printing Preferences
  printer_size: '3_inch' | '2_inch' | 'a4';
  print_copy: 'single' | 'double';
  thermal_header: string;
  thermal_diya_show: 'show' | 'hide';
  thermal_footer_left: string;
  thermal_footer_right: string;
  thermal_footer_logo_show: 'show' | 'hide';
  is_print_btn: 'enabled' | 'disabled';

  // 3. Exchange & Rates Calculation Rules
  buy_charge: number;
  sell_charge: number;
  is_bs_charge: 'yes' | 'no';
  is_silver_charge: 'yes' | 'no';
  is_bs_discount: 'yes' | 'no';
  rate_916: 'yes' | 'no';
  fn_point: '3_decimal' | '2_decimal';
  tola_weight: '11.664' | '10.000';
  diff_gold_charge: 'deduct_cash' | 'add_cash';
  per_tounch: 'percentage' | 'fraction';
  touch_minus_hide: 'yes' | 'no';

  // 4. Visibility & Display Toggles
  shop_show: 'yes' | 'no';
  shop_address_show: 'yes' | 'no';
  cust_show: 'yes' | 'no';
  shop_landline_no_show: 'yes' | 'no';
  is_pdf_udhar_jama: 'show' | 'hide';
  extra_gold_hide_pdf: 'show' | 'hide';
  stock_show: 'yes' | 'no';
  old_record_show: 'yes' | 'no';
  ledger_tl_show: 'yes' | 'no';
  pagination_show: number;

  // 5. System & Security
  is_login_otp: 'yes' | 'no';
  is_whatsapp: 'yes' | 'no';
  is_share: 'yes' | 'no';
  is_set_stock_password: 'yes' | 'no';
  en_pwd?: string;
}

