# Implementation Plan: Deligo Technologies ERP React Rebuild

This implementation plan details the architecture, component hierarchy, state management, route map with authentication guards, service layer design, and sequential build order for building Deligo Technologies Bullion & Jewellery ERP as a pixel-perfect, fully functional React application.

---

## 1. Technology Stack & Dependencies

- **Core**: React 18, Vite, TypeScript
- **Routing**: React Router v6 (BrowserRouter, Protected Routes, Role-based route guards)
- **Styling**: Tailwind CSS + PostCSS + Autoprefixer + Lucide React / FontAwesome 6 icons + Google Fonts (Poppins, Lobster)
- **State Management**: Zustand with persistent storage (`zustand/middleware/persist`)
- **Forms & Validation**: React Hook Form + Zod resolvers
- **Data Tables**: `@tanstack/react-table` (sorting, filtering, pagination, custom summary footers)
- **Data & Mock Service Layer**: LocalStorage-backed service layer (`/src/services`) with async simulated latency
- **Print & Export**: Thermal 3-inch POS slip generator, A4 tax invoice generator, CSV/Excel export
- **Testing**: Vitest for 100% test parity on all mathematical calculations

---

## 2. Directory & Folder Structure

```
deligo-technologies/
├── public/
│   ├── assets/
│   │   ├── images/
│   │   │   ├── logo/
│   │   │   │   ├── logohead.webp
│   │   │   │   └── logo_name.webp
│   │   │   └── banners/
│   └── favicon.ico
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── DataTable.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── FormField.tsx
│   │   │   ├── StatCard.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Tabs.tsx
│   │   │   ├── ThermalReceipt.tsx
│   │   │   └── A4Invoice.tsx
│   │   ├── layout/
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── AuthLayout.tsx
│   │   ├── shared/
│   │   │   ├── BhavcutConverterModal.tsx
│   │   │   ├── StockOverviewModal.tsx
│   │   │   ├── CustomerSelect.tsx
│   │   │   ├── WhatsAppShareButton.tsx
│   │   │   └── PrintActions.tsx
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useLocalStorage.ts
│   │   └── useDebounce.ts
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   └── ForgotPasswordModal.tsx
│   │   ├── dashboard/
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── AccountSummaryCard.tsx
│   │   │   ├── QuickLaunchGrid.tsx
│   │   │   └── NotepadWidget.tsx
│   │   ├── exchange/
│   │   │   ├── ExchangePage.tsx
│   │   │   ├── ExchangePOSForm.tsx
│   │   │   └── ExchangeListPage.tsx
│   │   ├── buy-sell/
│   │   │   ├── BuySellPage.tsx
│   │   │   ├── BuySellForm.tsx
│   │   │   └── BuySellListPage.tsx
│   │   ├── loan/
│   │   │   ├── LoanPage.tsx
│   │   │   ├── LoanForm.tsx
│   │   │   └── LoanListPage.tsx
│   │   ├── ledger/
│   │   │   ├── LedgerSummaryPage.tsx
│   │   │   └── CustomerStatementPage.tsx
│   │   ├── customer/
│   │   │   ├── CustomerListPage.tsx
│   │   │   ├── AddCustomerPage.tsx
│   │   │   └── EditCustomerPage.tsx
│   │   ├── expense/
│   │   │   └── ExpenseIncomePage.tsx
│   │   ├── hallmark/
│   │   │   └── HallmarkPage.tsx
│   │   ├── jewellery/
│   │   │   └── JewelleryPage.tsx
│   │   ├── billing/
│   │   │   ├── RefineryBillingPage.tsx
│   │   │   ├── BullionBillingPage.tsx
│   │   │   ├── HallmarkBillingPage.tsx
│   │   │   └── RefineryServicePage.tsx
│   │   ├── day-book/
│   │   │   └── DayBookPage.tsx
│   │   ├── certificate/
│   │   │   └── CertificatePage.tsx
│   │   ├── khar-mel/
│   │   │   └── KharMelPage.tsx
│   │   ├── touch-form/
│   │   │   └── TouchFormPage.tsx
│   │   └── settings/
│   │       ├── ShopSettingsModal.tsx
│   │       ├── WhatsAppSettingsModal.tsx
│   │       └── SubscriptionPage.tsx
│   ├── router/
│   │   ├── AppRouter.tsx
│   │   └── ProtectedRoute.tsx
│   ├── services/
│   │   ├── storage.ts
│   │   ├── authService.ts
│   │   ├── customerService.ts
│   │   ├── exchangeService.ts
│   │   ├── buySellService.ts
│   │   ├── loanService.ts
│   │   ├── ledgerService.ts
│   │   ├── expenseService.ts
│   │   ├── jewelleryService.ts
│   │   ├── billingService.ts
│   │   ├── dayBookService.ts
│   │   ├── stockService.ts
│   │   └── mockSeedData.ts
│   ├── store/
│   │   ├── useAuthStore.ts
│   │   ├── useStockStore.ts
│   │   ├── useCustomerStore.ts
│   │   └── useUIStore.ts
│   ├── types/
│   │   ├── customer.ts
│   │   ├── exchange.ts
│   │   ├── buySell.ts
│   │   ├── loan.ts
│   │   ├── expense.ts
│   │   ├── jewellery.ts
│   │   ├── billing.ts
│   │   ├── dayBook.ts
│   │   └── stock.ts
│   ├── utils/
│   │   ├── calculations/
│   │   │   ├── bullionMath.ts
│   │   │   ├── bullionMath.test.ts
│   │   │   ├── loanMath.ts
│   │   │   ├── loanMath.test.ts
│   │   │   ├── jewelleryMath.ts
│   │   │   ├── jewelleryMath.test.ts
│   │   │   ├── taxMath.ts
│   │   │   └── taxMath.test.ts
│   │   ├── formatters.ts
│   │   └── printTemplates.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── CALCULATIONS.md
├── DATA_MODEL.md
├── DESIGN_TOKENS.md
├── SITEMAP.md
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

---

## 3. Component Hierarchy & Tree

```
App
 └── BrowserRouter
      └── AppRouter
           ├── Route path="/login" -> LoginPage (Public)
           │    ├── BrandHeader (Logo + Lobster title)
           │    ├── LoginForm (Mobile + Password)
           │    ├── OtpGroup (Conditional 4 digits)
           │    └── ForgotPasswordModal
           │
           └── ProtectedRoute (Role-guard: ADMINISTRATOR)
                └── DashboardLayout
                     ├── Navbar (Sticky Top)
                     │    ├── BrandLogo ("Lakshmi Gold Testing")
                     │    ├── NavigationLinks (Hindi + English)
                     │    ├── StockBadgeButton -> Triggers StockOverviewModal
                     │    ├── SettingsButton
                     │    └── UserProfileMenu (Logout)
                     │
                     ├── StockOverviewModal (Master Poonjee & Vault inventory)
                     ├── BhavcutConverterModal (Gold <-> Currency conversion)
                     │
                     └── Page Outlet:
                          ├── / -> DashboardPage
                          │    ├── AccountSummaryCard (Flip countdown timer)
                          │    ├── QuickLaunchGrid (8 feature pods)
                          │    ├── NotepadWidget (WYSIWYG note pad)
                          │    └── SettingsModulesGrid
                          ├── /exchange -> ExchangePage
                          │    ├── Tabs (Buy / Sell)
                          │    ├── ExchangePOSForm
                          │    │    ├── CustomerSelect
                          │    │    ├── WeightTouchInputs
                          │    │    ├── AllowanceField
                          │    │    ├── FinancialSettlementFields
                          │    │    ├── UdhariSummaryWidget
                          │    │    └── ActionButtons (Print, Thermal, WhatsApp, Save)
                          │    └── SubNavigation -> ExchangeListPage
                          ├── /buy-sell -> BuySellPage
                          ├── /loan -> LoanPage
                          ├── /ledger -> LedgerSummaryPage
                          │    └── /ledger/:customerId -> CustomerStatementPage
                          ├── /customers -> CustomerListPage
                          │    ├── /customers/new -> AddCustomerPage
                          │    └── /customers/:id/edit -> EditCustomerPage
                          ├── /expenses -> ExpenseIncomePage
                          ├── /hallmark -> HallmarkPage
                          ├── /jewellery -> JewelleryPage
                          ├── /billing/* -> Refinery / Bullion / Hallmark Billing Pages
                          ├── /day-book -> DayBookPage
                          ├── /certificates -> CertificatePage
                          ├── /khar-mel -> KharMelPage
                          └── /touch-form -> TouchFormPage
```

---

## 4. State Management & Service Layer Architecture

### A. State Stores (Zustand)
1. **`useAuthStore`**:
   - `user`: Authenticated user profile (`{ name: 'Deligo Admin', shopName: 'Lakshmi Gold Testing', role: 'ADMINISTRATOR', mobile: '9645808999' }`).
   - `isAuthenticated`: Boolean.
   - `login(credentials)`: Validates against mock credentials.
   - `logout()`: Clears session.

2. **`useStockStore`**:
   - `stocks`: Real-time balances of physical gold, liquid cash, bank balances, raw kacha gold, silver.
   - `rates`: Live market rates for 24K Gold, 22K Gold, Silver.
   - `updateRates()`: Updates rates and recalculates total portfolio valuation (`totalBusinessWorth`).

3. **`useUIStore`**:
   - Active modals (`stockModalOpen`, `bhavcutModalOpen`, `whatsappModalOpen`).
   - Notification toasts via state-driven Toast component.

### B. Service Layer (`/src/services/`)
- Pure asynchronous methods wrapped in Promises to simulate live API calls:
  - `customerService.getAll()`, `customerService.getById(id)`, `customerService.create(data)`, `customerService.update(id, data)`
  - `exchangeService.createTransaction(txn)`, `exchangeService.getAll()`
  - `loanService.createEntry(entry)`, `loanService.getByCustomerId(id)`
  - `ledgerService.getSummary()`, `ledgerService.getCustomerStatement(id)`
  - `stockService.getStockSummary()`
- Initialized with realistic mock seed data (`mockSeedData.ts`) containing realistic Indian jeweller records, transactions, and rates.

---

## 5. Calculations & Verification Strategy

All formulas identified in `CALCULATIONS.md` will be isolated in `/src/utils/calculations/`:
1. `calculateFineGold(weight, touch)`
2. `calculateAfterFine(fineGold, extraGold)`
3. `calculateDiffGold(afterFine, givenGold)`
4. `calculateDiffAmount(diffGold, ratePer10Gm)`
5. `calculateFinalCash(diffAmount, charges)`
6. `convertCashToGold(cashAmount, ratePer10Gm)`
7. `convertGoldToCash(goldWeight, ratePer10Gm)`
8. `calculateBuySellNet(weight, ratePer10Gm, discount)`
9. `calculateRunningBalance(oldBalance, transactionAmount, isJama)`
10. `calculateKarat(touch)`
11. `calculateJewelleryWastage(gross, less, purity, wastagePercent, labourRate)`
12. `calculateRefineryLoss(grossWeight, meltWeight, refineWeight, ratePerGram, gstPercent)`
13. `calculateBullionTax(weight, rateInclusiveGst)`
14. `calculateKharMelAlloy(currentWeight, currentPurity, targetPurity, alloyPurity)`

Each function will have corresponding Vitest unit tests verifying all 60+ test cases from `CALCULATIONS.md`.

---

## 6. Sequential Build Order

1. **Phase 3.1: Environment & Project Scaffolding**
   - Initialize Vite React + TypeScript project in current directory.
   - Configure Tailwind CSS with custom color palette (`#8d2c24`, `#302929`, `#ffd700`, `#1877f2`) and Poppins font.
   - Install required packages: `react-router-dom`, `zustand`, `react-hook-form`, `@hookform/resolvers`, `zod`, `@tanstack/react-table`, `lucide-react`, `vitest`.

2. **Phase 3.2: Pure Mathematical Functions & Unit Tests**
   - Implement `/src/utils/calculations/*.ts`.
   - Write and run Vitest test suites against test vectors in `CALCULATIONS.md`.

3. **Phase 3.3: Service Layer & Mock Data Engine**
   - Implement `storage.ts` with local storage management.
   - Build `mockSeedData.ts` with realistic Indian bullion test records.
   - Build CRUD services for Customers, Transactions, Stock, and Day Book.

4. **Phase 3.4: Shared Component Library & Application Shell**
   - Build `Navbar`, `Footer`, `Sidebar`, `DashboardLayout`, `AuthLayout`.
   - Build reusable `DataTable` with pagination, search, sorting, and summary footers.
   - Build `Modal`, `FormField`, `Badge`, `Tabs`, `ThermalReceipt`, `A4Invoice`.
   - Build global `StockOverviewModal` and `BhavcutConverterModal`.

5. **Phase 3.5: Authentication Flow**
   - Build `LoginPage` with identical layout, input styling, and OTP toggle.
   - Wire `AuthContext` and `ProtectedRoute`.

6. **Phase 3.6: Dashboard & Core Operations Pages**
   - Build `DashboardPage` with flip counter, quick launch pods, notepad.
   - Build `ExchangePage` (POS terminal + list view).
   - Build `BuySellPage` (Bullion trading + list view).
   - Build `LoanPage` (Double-entry bullion & cash credit + list view).
   - Build `LedgerSummaryPage` & `CustomerStatementPage`.
   - Build `CustomerListPage` & `AddCustomerPage`.

7. **Phase 3.7: Specialized Modules**
   - Build `ExpenseIncomePage`.
   - Build `HallmarkPage` & `JewelleryPage`.
   - Build `RefineryBillingPage`, `BullionBillingPage`, `HallmarkBillingPage`, `RefineryServicePage`.
   - Build `DayBookPage` with triple-currency tracking.
   - Build `CertificatePage`, `KharMelPage`, `TouchFormPage`.

8. **Phase 3.8: Print & Export Engines**
   - Implement thermal 80mm slip printing for POS.
   - Implement A4 invoice printing.
   - Implement CSV/Excel export for tables.

---

## 7. Verification & Parity Checklist (Phase 4 Preview)

- Visual comparison against the 47 reference screenshots at 1440px and 390px.
- Vitest test pass rate: 100%.
- Functional verification: test all calculations against the live site formulas.
- Console audit: zero unhandled exceptions or layout shifts.
- Complete documentation in `PARITY_REPORT.md`.

