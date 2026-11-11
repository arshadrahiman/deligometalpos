# Site Map & Route Hierarchy

This document maps all routes, components, and views of the Deligo Technologies Bullion & Jewellery ERP application.

## Route Access Matrix

| Route Path (React Router v6) | Original PHP Path / Hash | Description & Purpose | Access Level | Primary Components |
| :--- | :--- | :--- | :--- | :--- |
| `/login` | `/index.php`, `/login.php` | Authentication entry point with mobile, password, conditional 4-digit OTP, and reset modal | Public | `LoginForm`, `OtpInputGroup`, `ForgotPasswordModal`, `BrandHeader` |
| `/` | `/home.php#settings` | Main ERP Dashboard, account summary, active subscription counter, quick-launch pods, and settings hub | Protected (Admin) | `DashboardLayout`, `AccountSummaryCard`, `CountdownTimer`, `QuickLaunchGrid`, `NotepadEditor`, `SettingsGrid` |
| `/exchange` | `/home.php#index` | High-speed gold exchange & bullion POS terminal (Buy / Sell tabs) | Protected (Admin) | `ExchangePOS`, `CustomerSearchSelect`, `PurityCalculator`, `UdhariSummaryCard`, `BhavcutModal` |
| `/exchange/list` | `/home.php#exchange/view_exchange` | Master historical log of gold exchange transactions | Protected (Admin) | `DataTable`, `ExchangeFilters`, `DateRangePicker`, `ThermalPrintModal`, `A4InvoiceModal`, `ExcelExport` |
| `/buy-sell` | `/home.php#buy_sell/index` | Direct bullion purchase and sales register with rate booking | Protected (Admin) | `BuySellForm`, `BhavBookingCard`, `PaymentSplitter`, `UdhariBalanceWidget` |
| `/buy-sell/list` | `/home.php#buy_sell/current` | Searchable log of bullion purchases, sales, and conversions | Protected (Admin) | `DataTable`, `SourceTypeFilter`, `ReceiptPrinter`, `ExcelExport` |
| `/loan` | `/home.php#loan/index` | Bullion and cash credit/debit ledger with live Bhavcut conversion | Protected (Admin) | `LoanForm`, `DualCurrencyToggle`, `LiveBhavcutConverter`, `AccountBalanceWidget` |
| `/loan/list` | `/home.php#loan/loan_list` | Master list of all credit entries and settlements | Protected (Admin) | `DataTable`, `LoanFilters`, `WhatsAppShareAction`, `PrintSlipModal` |
| `/ledger` | `/home.php#ledger/index` | Master Udhari (Accounts Receivable & Payable) summary table | Protected (Admin) | `LedgerSummaryTable`, `CreditDebitBadge`, `ExcelExport`, `PrintLedgerModal` |
| `/ledger/:customerId` | `/home.php#ledger/cust_ledger` | Detailed customer passbook statement and transaction audit log | Protected (Admin) | `CustomerStatementTable`, `StatementHeader`, `ClearAccountModal`, `WhatsAppStatementShare` |
| `/customers` | `/home.php#customer/customer` | Customer directory, directory search, and contact book | Protected (Admin) | `CustomerTable`, `CategoryFilter`, `ExcelImportModal`, `CustomerQuickViewModal` |
| `/customers/new` | `/home.php#customer/add_customer` | New customer onboarding form with multi-tier category and tax details | Protected (Admin) | `CustomerForm`, `StateSelectDropdown`, `FileUploadPreview`, `ValidationFeedback` |
| `/customers/:customerId/edit` | `/home.php#customer/edit_customer` | Update existing customer details and contact info | Protected (Admin) | `CustomerForm`, `StateSelectDropdown`, `FileUploadPreview` |
| `/expenses` | `/home.php#expense` | Dual debit/credit cash & gold income/expense journal | Protected (Admin) | `ExpenseIncomeDualForm`, `CashGoldBalanceBar`, `TransactionTable`, `ExportModal` |
| `/hallmark` | `/home.php#hallmark/view` | Job-order queue for BIS Hallmarking, HUID laser marking, and testing | Protected (Admin) | `HallmarkOrderForm`, `JobCardBatchTable`, `BarcodeGenerator`, `StatusFilter` |
| `/jewellery` | `/home.php#jewellery/view` | Jewellery manufacturing, Karigar order tracking, wastage calculation, and stock entry | Protected (Admin) | `JewelleryOrderForm`, `WastageCalculator`, `KarigarAssignment`, `MakingChargeWidget` |
| `/billing/refinery` | `/home.php#refinery/view` | Refining tax invoice generator with melting and refining loss audit | Protected (Admin) | `RefineryInvoiceForm`, `LossCalculatorTable`, `TaxSummaryCard`, `GSTInvoiceModal` |
| `/billing/bullion` | `/home.php#bullion/view` | Wholesale bullion 99.50% & 99.90% invoice builder with 3% GST | Protected (Admin) | `BullionInvoiceForm`, `TaxCalculator`, `InvoiceThermalPrint`, `InvoiceA4Print` |
| `/billing/hallmark` | `/home.php#hallmark_billing/view` | Assaying and Hallmarking center tax invoicing module with 18% GST | Protected (Admin) | `HallmarkInvoiceForm`, `ItemBatchTable`, `GSTSplitter`, `PrintInvoiceModal` |
| `/services/refinery` | `/home.php#refinery_service/index` | Service job-card and voucher issuance terminal for job-work refining | Protected (Admin) | `ServiceVoucherForm`, `MetalTypeSelect`, `TouchCalculator`, `JobVoucherPrint` |
| `/day-book` | `/home.php#settings/day_book/open_day_book` | Triple-currency daily transaction register (Cash, Pure Gold, Silver) | Protected (Admin) | `DayBookTable`, `OpeningStockModal`, `ClosingStockModal`, `PrintDayBookModal` |
| `/stock` | `#stock_view` (Modal/Page) | Master inventory and business capital (Poonjee) dashboard | Protected (Admin) | `StockOverviewGrid`, `LiquidAssetCard`, `BullionStockCard`, `PoonjeeSummary` |
| `/certificates` | `/home.php#certificate/index` | PVC Card gold purity certificate designer & issuer | Protected (Admin) | `CertificateForm`, `ElementCompositionPie`, `KaratBadge`, `PvcCardPreview` |
| `/khar-mel` | `/home.php#additional/khar/view` | Metallurgical alloy calculation engine for gold/silver purity adjustment | Protected (Admin) | `KharMelForm`, `TargetPuritySlider`, `AlloyRequirementSummary` |
| `/touch-form` | `/home.php#tounch_form/index` | XRF gold & silver testing report builder with dynamic QR verification | Protected (Admin) | `TouchReportForm`, `ElementConcentrationGrid`, `BalanceFitTools`, `QrCertificatePrint` |
| `/settings/shop` | `#name_edit` (Modal) | Shop/Company profile, invoice header configuration, and logo management | Protected (Admin) | `ShopProfileModal`, `PrintHeaderPreview`, `LogoUpload` |
| `/settings/whatsapp` | `#whatsapp_settings` (Modal) | WhatsApp Cloud API / gateway credentials and template bindings | Protected (Admin) | `WhatsAppConfigModal`, `ApiKeyInputs`, `TemplateSelector` |
| `/settings/subscription` | `/home.php#settings/subsciption` | SaaS subscription plans, license key activation, and payment gateway | Protected (Admin) | `SubscriptionCard`, `PlanSelector`, `PaymentGatewayDialog` |
| `/settings/security` | `/home.php#settings/ip_login` | Device session management, IP login logs, and credential change | Protected (Admin) | `DeviceSessionTable`, `ChangePasswordModal`, `RevokeSessionAction` |

---

## Navigation Architecture

```
[Public]
 └── /login (Mobile Number + Password + Optional 4-Digit OTP)

[Protected Root: DashboardLayout]
 ├── Navigation Bar (Sticky Top)
 │    ├── Logo & Shop Name ("Lakshmi Gold Testing")
 │    ├── Navigation Links (Hindi + English):
 │    │    ├── EXCHANGE (बदला/ पलटा) -> /exchange
 │    │    ├── BUY-SELL (खरीद बिक्री) -> /buy-sell
 │    │    ├── LOAN (उधार) -> /loan
 │    │    ├── LEDGER (खाता बही) -> /ledger
 │    │    ├── CUSTOMER (ग्राहक) -> /customers
 │    │    ├── EXPENSE | INCOME (खर्च | आय) -> /expenses
 │    │    ├── HALLMARK (हॉलमार्क) -> /hallmark
 │    │    ├── JEWELLERY (जेवर) -> /jewellery
 │    │    └── More Services Dropdown:
 │    │         ├── Refinery Billing -> /billing/refinery
 │    │         ├── Bullion Billing -> /bullion
 │    │         ├── Hallmark Billing -> /billing/hallmark
 │    │         └── Refinery Service -> /services/refinery
 │    ├── Gold Stock Quick-Button -> Triggers /stock Modal
 │    ├── Settings Cog -> /
 │    └── Logout Trigger
 └── Module Content Area (Dynamic Page Render)
```

