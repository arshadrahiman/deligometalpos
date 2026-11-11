export interface UserProfile {
  name: string;
  shopName: string;
  role: 'ADMINISTRATOR' | 'STAFF';
  mobile: string;
  subscriptionDaysRemaining: number;
}

export interface Customer {
  id: string;
  customerNo: number;
  name: string;
  mobile: string;
  mobileSecondary?: string;
  shopName?: string;
  category: 'Jewelry Owner' | 'Karigar' | 'Galaiwala' | 'Whole Seller' | 'Others';
  address: {
    line1?: string;
    area?: string;
    city?: string;
    state: string;
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
    gold: number; // gm (+ = shop credit, - = debt)
    cash: number; // ₹ (+ = shop credit, - = debt)
    silver: number; // gm
  };
  profilePhoto?: string;
  logo?: string;
  partnerCount?: number;
  employeeCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExchangeTransaction {
  id: string;
  transactionNo: number;
  type: 'BUY' | 'SELL';
  customerId: string;
  customerName: string;
  customerNo: number;
  dateTime: string;
  weight: number;
  touch: number;
  sample: 'lagdi' | 'Rava' | '99.9' | 'Dhali' | 'Depa' | 'Zevar' | 'Others';
  fineGold: number;
  extraGold: number;
  afterFine: number;
  settledGold: number;
  diffGold: number;
  rate: number;
  diffAmount: number;
  charges: number;
  finalCash: number;
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

export interface BuySellTransaction {
  id: string;
  transactionNo: number;
  type: 'BUY' | 'SELL';
  source: 'Direct' | 'Exchange Conversion' | 'Loan Conversion' | 'Bhavcut Booking';
  customerId: string;
  customerName: string;
  customerNo: number;
  dateTime: string;
  weight: number;
  rate: number;
  grossAmount: number;
  discount: number;
  netAmount: number;
  paidAmount: number;
  settlement: {
    cash: number;
    onlineRtgs: number;
    selfBank2: number;
  };
  udhariAdjusted: boolean;
  remarks?: string;
}

export interface LoanEntry {
  id: string;
  transactionNo: number;
  customerId: string;
  customerName: string;
  customerNo: number;
  dateTime: string;
  gold: {
    oldBalance: number;
    type: 'JAMA' | 'UDHAR';
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

export interface ExpenseIncomeRecord {
  id: string;
  recordNo: number;
  type: 'EXPENSE' | 'INCOME';
  partyName: string;
  reason: string;
  cashAmount: number;
  onlineAmount: number;
  bank2Amount: number;
  goldWeight: number;
  dateTime: string;
  receiptNumber?: string;
}

export interface HallmarkOrder {
  id: string;
  orderNo: number;
  customerId: string;
  customerName: string;
  workType: 'HUID' | 'Hallmark' | 'Marking' | 'Card' | 'Tounch' | 'galai' | 'laser soldering' | 'L cating' | 'STAMPING' | 'SILVER HUID' | 'gold melting' | 'silver melting';
  pieces: number;
  chargePerPiece: number;
  totalWeight: number;
  totalCharge: number;
  boxNo?: string;
  status: 'Received' | 'In Process' | 'Completed' | 'Delivered';
  dateTime: string;
}

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
    net: number;
  };
  purity: {
    touch: number;
    fineGold: number;
    wastagePercent: number;
    wastageWeight: number;
    totalPureRequired: number;
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

export interface RefineryInvoice {
  id: string;
  invoiceNo: string;
  customerId: string;
  customerName: string;
  workType: 'Refining' | 'Melting';
  grossWeight: number;
  meltWeight: number;
  meltLoss: number;
  refinedWeight: number;
  refineLoss: number;
  purity: number;
  fineWeight: number;
  ratePerGram: number;
  taxableServiceCharge: number;
  hsnCode: string;
  gstRate: number;
  gstAmount: number;
  totalInvoiceAmount: number;
  dateTime: string;
}

export interface BullionInvoice {
  id: string;
  invoiceNo: string;
  customerId: string;
  customerName: string;
  productCategory: string;
  hsnCode: string;
  weight: number;
  rateInclusiveGst: number;
  totalCash: number;
  receivedCash: number;
  receivedOnline: number;
  dateTime: string;
}

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

export interface BusinessStockSummary {
  liquidCash: number;
  primaryBank: number;
  secondaryBank: number;
  pureGoldStock: {
    weightGm: number;
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
    gold24K: number;
    gold22K: number;
    silver1Kg: number;
  };
  udhariOutstanding: {
    netCustomerGold: number;
    netCustomerCash: number;
  };
  totalBusinessWorth: number;
  todayProfit: number;
}
