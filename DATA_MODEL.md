# Data Model & State Architecture

This document specifies the complete domain model, entity relationships, fields, data types, mock schemas, and table interactions (sorting, filtering, pagination, CRUD behaviors) for Deligo Technologies Bullion & Jewellery ERP.

---

## 1. Entity Definitions & TypeScript Interfaces

### A. Customer Entity
```typescript
export interface Customer {
  id: string; // e.g. "CUST-387"
  customerNo: number; // auto-increment sequence, e.g. 387
  name: string; // "Sharma Jewellers"
  mobile: string; // "9876543210" (Primary / WhatsApp)
  mobileSecondary?: string;
  shopName?: string;
  category: 'Jewelry Owner' | 'Karigar' | 'Galaiwala' | 'Whole Seller' | 'Others';
  address: {
    line1?: string; // Shop/House no
    area?: string; // Street/Locality
    city?: string;
    state: string; // Indian State or UT, e.g. "Maharashtra (27)"
    stateCode?: string;
  };
  taxDetails: {
    gstNo?: string;
    panNo?: string;
    aadharNo?: string;
    licenceNo?: string;
    registrationNo?: string;
  };
  balance: {
    gold: number; // in grams (+ indicates shop credit, - indicates debt)
    cash: number; // in rupees (+ indicates shop credit, - indicates debt)
    silver: number; // in grams
  };
  profilePhoto?: string;
  logo?: string;
  partnerCount?: number;
  employeeCount?: number;
  createdAt: string;
  updatedAt: string;
}
```

### B. Exchange Transaction Entity
```typescript
export interface ExchangeTransaction {
  id: string; // e.g. "EX-2026-001"
  transactionNo: number;
  type: 'BUY' | 'SELL';
  customerId: string;
  customerName: string;
  customerNo: number;
  dateTime: string;
  weight: number; // Gross weight in grams (e.g. 10.500)
  touch: number; // Purity percentage (e.g. 91.60)
  sample: 'lagdi' | 'Rava' | '99.9' | 'Dhali' | 'Depa' | 'Zevar' | 'Others';
  fineGold: number; // (weight * touch) / 100
  extraGold: number; // Allowance (+G / -G)
  afterFine: number; // fineGold + extraGold
  settledGold: number; // Handed over pure gold (given/received)
  diffGold: number; // afterFine - settledGold
  rate: number; // Gold market rate (₹/10gm)
  diffAmount: number; // (diffGold * rate) / 10
  charges: number; // Handling / making fee (₹)
  finalCash: number; // diffAmount + charges
  settlement: {
    physicalCash: number;
    onlineRtgs: number;
    selfBank2: number;
  };
  udhariBefore: {
    gold: number;
    cash: number;
  };
  udhariAfter: {
    gold: number;
    cash: number;
  };
  narration?: string;
}
```

### C. Buy-Sell Bullion Transaction Entity
```typescript
export interface BuySellTransaction {
  id: string; // e.g. "BS-2026-001"
  transactionNo: number;
  type: 'BUY' | 'SELL';
  source: 'Direct' | 'Exchange Conversion' | 'Loan Conversion' | 'Bhavcut Booking';
  customerId: string;
  customerName: string;
  customerNo: number;
  dateTime: string;
  weight: number; // Trade weight in grams
  rate: number; // Execution rate (₹/10gm)
  grossAmount: number; // (weight * rate) / 10
  discount: number; // Rebate (₹)
  netAmount: number; // grossAmount - discount
  paidAmount: number; // Actual cash paid/received
  settlement: {
    cash: number;
    onlineRtgs: number;
    selfBank2: number;
  };
  udhariAdjusted: boolean;
  remarks?: string;
}
```

### D. Loan & Ledger Entry Entity
```typescript
export interface LoanEntry {
  id: string; // e.g. "LN-2026-001"
  transactionNo: number;
  customerId: string;
  customerName: string;
  dateTime: string;
  gold: {
    oldBalance: number;
    type: 'JAMA' | 'UDHAR'; // Jama = In (+), Udhar = Out (-)
    transactionWeight: number;
    newBalance: number;
  };
  cash: {
    oldBalance: number;
    type: 'JAMA' | 'UDHAR';
    transactionAmount: number;
    onlineAmount: number;
    bank2Amount: number;
    newBalance: number;
  };
  silver?: {
    oldBalance: number;
    transactionWeight: number;
    newBalance: number;
  };
  bhavcut?: {
    convertedGold: number;
    convertedAmount: number;
    conversionRate: number;
  };
  narration: string;
}
```

### E. Expense & Income Entity
```typescript
export interface ExpenseIncomeRecord {
  id: string;
  recordNo: number;
  type: 'EXPENSE' | 'INCOME';
  partyName: string;
  reason: string;
  cashAmount: number;
  onlineAmount: number;
  bank2Amount: number;
  goldWeight: number; // in grams
  dateTime: string;
  receiptNumber?: string;
}
```

### F. Hallmark & Testing Order Entity
```typescript
export interface HallmarkOrder {
  id: string;
  orderNo: number;
  customerId: string;
  customerName: string;
  workType: 'HUID' | 'Hallmark' | 'Marking' | 'Card' | 'Tounch' | 'galai' | 'laser soldering' | 'L cating' | 'STAMPING' | 'SILVER HUID' | 'gold melting' | 'silver melting';
  pieces: number;
  chargePerPiece: number;
  totalWeight: number;
  totalCharge: number; // pieces * chargePerPiece
  boxNo?: string;
  status: 'Received' | 'In Process' | 'Completed' | 'Delivered';
  dateTime: string;
}
```

### G. Jewellery Manufacturing & Order Entity
```typescript
export interface JewelleryOrder {
  id: string;
  orderNo: number;
  customerId: string;
  customerName: string;
  itemDescription: string;
  pieces: number;
  weights: {
    gross: number;
    less: number;
    net: number; // gross - less
  };
  purity: {
    touch: number;
    fineGold: number; // (net * touch) / 100
    wastagePercent: number;
    wastageWeight: number;
    totalPureRequired: number; // fineGold + wastageWeight
  };
  scrapTradeIn?: {
    kachaWeight: number;
    kachaTouch: number;
    kachaFine: number;
  };
  valuation: {
    rate: number;
    labourRatePerGram: number;
    labourAmount: number;
    totalOrderAmount: number;
  };
  settlement: {
    goldReceived: number;
    cashReceived: number;
    onlineReceived: number;
  };
  status: 'Order Received' | 'Karigar Assigned' | 'In Stock' | 'Sold';
  karigarName?: string;
  deliveryDate?: string;
  dateTime: string;
}
```

### H. Refinery Billing & Tax Invoice Entity
```typescript
export interface RefineryInvoice {
  id: string;
  invoiceNo: string; // e.g. "REF/2026/001"
  customerId: string;
  customerName: string;
  workType: 'Refining' | 'Melting';
  grossWeight: number;
  meltWeight: number;
  meltLoss: number; // gross - melt
  refinedWeight: number;
  refineLoss: number; // melt - refined
  purity: number;
  fineWeight: number;
  ratePerGram: number;
  taxableServiceCharge: number;
  hsnCode: string; // "9988" or "7108"
  gstRate: number; // 5 or 18%
  gstAmount: number;
  totalInvoiceAmount: number;
  dateTime: string;
}
```

### I. Day Book Triple-Currency Register Entity
```typescript
export interface DayBookEntry {
  id: string;
  dateTime: string;
  customerId?: string;
  partyName: string;
  sourceModule: 'Exchange' | 'BuySell' | 'Loan' | 'Expense' | 'Income' | 'Jewellery' | 'Refinery';
  referenceId: string;
  cashFlow: {
    debit: number;
    credit: number;
    runningBalance: number;
  };
  goldFlow: {
    debit: number;
    credit: number;
    runningBalance: number;
  };
  silverFlow: {
    debit: number;
    credit: number;
    runningBalance: number;
  };
  narration: string;
}
```

### J. Master Inventory & Business Capital (Poonjee) Entity
```typescript
export interface BusinessStockSummary {
  liquidCash: number; // Physical cash in safe
  primaryBank: number; // Bank Account 1 balance
  secondaryBank: number; // Bank Account 2 balance
  pureGoldStock: {
    weightGm: number; // Total pure 99.9 gold in vault
    avgBuyRate: number;
    avgSellRate: number;
    todayBuyWeight: number;
    todaySellWeight: number;
  };
  rawScrapStock: {
    kachaGrossWeight: number;
    kachaFineEquivalent: number;
  };
  silverStock: {
    weightGm: number;
    avgRate: number;
  };
  marketRates: {
    gold24K: number; // per 10gm
    gold22K: number;
    silver1Kg: number;
  };
  udhariOutstanding: {
    netCustomerGold: number; // positive = customers owe shop
    netCustomerCash: number;
  };
  totalBusinessWorth: number; // Evaluated Poonjee
  todayProfit: number;
}
```

---

## 2. Table CRUD, Search, Filter & Pagination Standards

All data tables follow a standardized interface powered by TanStack Table:

1. **Filtering & Search**:
   - **Global Search**: Search across Customer Name, Mobile Number, Transaction ID, and Narration.
   - **Date Range Picker**: Filter by Start Date and End Date (defaulting to current fiscal month or Today).
   - **Source / Category Dropdown**: Filter by module source (e.g. Buy vs Sell, Karigar vs Retailer).

2. **Sorting**:
   - Multi-column sortable headers (`Date/Time` default descending, `Weight`, `Amount`, `Purity`).
   - Visual sort arrows (`↑`, `↓`, `↕`).

3. **Pagination**:
   - Configurable page size options: 10, 25, 50, 100 records per page.
   - Showing `"Showing 1 to 10 of 42 entries"` with standard Previous/Next page button navigation.

4. **Summary Footers**:
   - Bottom row aggregates numeric columns in real time: Total Gross Weight, Total Fine Gold, Total Paid/Received Amount, Net Balances.

5. **Row Actions (CRUD)**:
   - **View / Open**: Opens read-only detail drawer or customer passbook.
   - **Print 3-inch**: Renders POS thermal slip in print dialog.
   - **Print A4**: Renders formal tax invoice with shop header and GST breakdown.
   - **WhatsApp**: Triggers WhatsApp Web URL (`https://api.whatsapp.com/send?phone=...&text=...`) with pre-composed transaction receipt.
   - **Edit**: Opens modal/form pre-populated with entity fields.
   - **Delete**: Prompts a safety confirmation dialog before soft-deleting.

6. **Storage & Service Layer**:
   - Data stored in `localStorage` under keys `hs_customers`, `hs_exchange_txns`, `hs_buysell_txns`, `hs_loan_entries`, `hs_expenses`, `hs_jewellery_orders`, `hs_refinery_invoices`, `hs_daybook_entries`.
   - Abstracted in `/src/services/` with async Promises mimicking real REST API endpoints for plug-and-play backend replacement.

