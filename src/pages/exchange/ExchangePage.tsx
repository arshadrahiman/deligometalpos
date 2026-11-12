import React, { useState, useEffect } from 'react';
import { Customer, ExchangeTransaction } from '../../types';
import { exchangeService } from '../../services/exchangeService';
import { useStockStore } from '../../store/useStockStore';
import { useUIStore } from '../../store/useUIStore';
import {
  calculateFineGold,
  calculateAfterFine,
  calculateDiffGold,
  calculateDiffAmount,
  calculateFinalCash,
  convertCashToGold,
  convertGoldToCash,
} from '../../utils/calculations/bullionMath';
import { CustomerSelect } from '../../components/shared/CustomerSelect';
import { DataTable } from '../../components/common/DataTable';
import { Tabs } from '../../components/common/Tabs';
import { Badge } from '../../components/common/Badge';
import { ThermalReceiptModal } from '../../components/common/ThermalReceiptModal';
import { ColumnDef } from '@tanstack/react-table';
import {
  Printer,
  Share2,
  Save,
  Scale,
  List,
  PlusCircle,
  IndianRupee,
  Layers,
  ArrowRightLeft,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Calculator,
} from 'lucide-react';

export const ExchangePage: React.FC = () => {
  const { summary } = useStockStore();
  const { showToast } = useUIStore();

  const [activeTab, setActiveTab] = useState<'POS' | 'LIST'>('POS');
  const [txnType, setTxnType] = useState<'BUY' | 'SELL'>('BUY');
  const [transactions, setTransactions] = useState<ExchangeTransaction[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<ExchangeTransaction | null>(null);

  // Form Fields
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Weight & Less weight
  const [weight, setWeight] = useState<number>(100.0);
  const [lessWeight, setLessWeight] = useState<number>(0.0);

  // Touch & Touch Wastage
  const [touch, setTouch] = useState<number>(91.6);
  const [touchMinus, setTouchMinus] = useState<number>(0.0);

  const [sample, setSample] = useState<ExchangeTransaction['sample']>('lagdi');
  const [extraGold, setExtraGold] = useState<number>(0.0);
  const [settledGold, setSettledGold] = useState<number>(90.0);
  const [rate, setRate] = useState<number>(80000);
  const [saleRate, setSaleRate] = useState<number>(144500);
  const [purchaseRate, setPurchaseRate] = useState<number>(140000);
  const [charges, setCharges] = useState<number>(300.0);

  // Payment splits (Given vs Received)
  const [givenCash, setGivenCash] = useState<number>(12500);
  const [recievedCash, setRecievedCash] = useState<number>(0);
  const [onlineGivenRtgs, setOnlineGivenRtgs] = useState<number>(0);
  const [onlineRecivRtgs, setOnlineRecivRtgs] = useState<number>(0);
  const [selfBank2GivenRtgs, setSelfBank2GivenRtgs] = useState<number>(0);
  const [selfBank2RecivRtgs, setSelfBank2RecivRtgs] = useState<number>(0);

  // Inline Bhavcut
  const [bhavcutInputAmt, setBhavcutInputAmt] = useState<number>(0);
  const [bhavcutConvertedGold, setBhavcutConvertedGold] = useState<number>(0);

  const [narration, setNarration] = useState<string>('');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    const list = await exchangeService.getAll();
    setTransactions(list);
  };

  // Real-time calculations with Less Weight & Touch Minus
  const netWeight = Math.max(0, Math.round((weight - lessWeight) * 1000) / 1000);
  const totalTouch = Math.max(0, Math.round((touch - touchMinus) * 100) / 100);
  const fineGold = calculateFineGold(netWeight, totalTouch);
  const afterFine = calculateAfterFine(fineGold, extraGold);
  const diffGold = calculateDiffGold(afterFine, settledGold);
  const diffAmount = calculateDiffAmount(diffGold, rate);
  const finalCash = calculateFinalCash(diffAmount, charges);

  // Udhari projections
  const oldGoldBal = selectedCustomer?.balance.gold || 0;
  const oldCashBal = selectedCustomer?.balance.cash || 0;
  const oldSilverBal = selectedCustomer?.balance.silver ?? -413.043;

  const jamaGold = txnType === 'BUY' && diffGold > 0 ? diffGold : 0;
  const udharGold =
    txnType === 'BUY' && diffGold < 0
      ? Math.abs(diffGold)
      : txnType === 'SELL'
      ? diffGold
      : 0;
  const goldDelta = txnType === 'BUY' ? diffGold : -diffGold;
  const newGoldBal = Math.round((oldGoldBal + goldDelta) * 1000) / 1000;

  const jamaCash = txnType === 'SELL' ? finalCash : 0;
  const udharCash = txnType === 'BUY' ? finalCash : 0;
  const cashDelta = txnType === 'BUY' ? finalCash : -finalCash;
  const newCashBal = Math.round((oldCashBal + cashDelta) * 100) / 100;

  const handleInlineBhavcutAmtToGold = () => {
    if (!bhavcutInputAmt || !rate) return;
    const g = convertCashToGold(bhavcutInputAmt, rate);
    setBhavcutConvertedGold(g);
    showToast(`Converted ₹${bhavcutInputAmt.toLocaleString('en-IN')} to ${g.toFixed(3)} gm Gold`);
  };

  const handleInlineBhavcutGoldToAmt = () => {
    if (!bhavcutConvertedGold || !rate) return;
    const c = convertGoldToCash(bhavcutConvertedGold, rate);
    setBhavcutInputAmt(c);
    showToast(`Converted ${bhavcutConvertedGold.toFixed(3)} gm Gold to ₹${c.toLocaleString('en-IN')}`);
  };

  const handleSave = async (openSlip: boolean = false) => {
    if (!selectedCustomer) {
      showToast('Please select a customer first!', 'error');
      return;
    }

    const physicalCash = txnType === 'BUY' ? givenCash : recievedCash;
    const onlineRtgs = txnType === 'BUY' ? onlineGivenRtgs : onlineRecivRtgs;
    const selfBank2 = txnType === 'BUY' ? selfBank2GivenRtgs : selfBank2RecivRtgs;

    const newTxn = await exchangeService.createTransaction({
      type: txnType,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerNo: selectedCustomer.customerNo,
      weight: netWeight,
      touch: totalTouch,
      sample,
      fineGold,
      extraGold,
      afterFine,
      settledGold,
      diffGold,
      rate,
      diffAmount,
      charges,
      finalCash,
      settlement: { physicalCash, onlineRtgs, selfBank2 },
      udhariBefore: {
        gold: oldGoldBal,
        cash: oldCashBal,
        silver: oldSilverBal,
      },
      udhariAfter: {
        gold: newGoldBal,
        cash: newCashBal,
        silver: oldSilverBal,
      },
      narration,
    });

    showToast(`Exchange transaction #${newTxn.transactionNo} created successfully!`);
    loadTransactions();

    if (openSlip) {
      setSelectedReceipt(newTxn);
    }
  };

  const columns: ColumnDef<ExchangeTransaction>[] = [
    {
      accessorKey: 'transactionNo',
      header: 'SN',
      cell: (info) => <span className="font-bold">#{info.getValue() as number}</span>,
    },
    {
      accessorKey: 'dateTime',
      header: 'Date/Time',
      cell: (info) => (
        <span className="text-slate-600 font-mono text-[11px] whitespace-pre-line">
          {(info.getValue() as string).replace(' ', '\n')}
        </span>
      ),
    },
    {
      accessorKey: 'customerName',
      header: 'C. No/C. Name',
      cell: (info) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-800 text-xs">
            {info.row.original.customerNo} /
          </span>
          <span className="font-semibold text-slate-700 text-xs">
            {info.getValue() as string}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'weight',
      header: 'Weight',
      cell: (info) => (
        <span className="font-mono font-medium text-slate-800">
          ☑ {(info.getValue() as number).toFixed(3)} gm
        </span>
      ),
    },
    {
      accessorKey: 'sample',
      header: 'Sample',
      cell: (info) => (
        <span className="font-semibold text-emerald-800">{info.getValue() as string}</span>
      ),
    },
    {
      accessorKey: 'touch',
      header: 'Purity %',
      cell: (info) => <span>{(info.getValue() as number).toFixed(2)} %</span>,
    },
    {
      accessorKey: 'fineGold',
      header: 'Fine Gold',
      cell: (info) => (
        <span className="font-mono font-bold text-slate-900">
          +{(info.getValue() as number).toFixed(3)} gm
        </span>
      ),
    },
    {
      accessorKey: 'extraGold',
      header: '+G / -G',
      cell: (info) => {
        const val = info.getValue() as number;
        return (
          <span className="font-mono text-slate-600">
            {val > 0 ? `+${val.toFixed(3)} gm` : '-'}
          </span>
        );
      },
    },
    {
      accessorKey: 'afterFine',
      header: 'After Fine',
      cell: (info) => (
        <span className="font-mono font-bold text-slate-900">
          {(info.getValue() as number).toFixed(3)} gm
        </span>
      ),
    },
    {
      accessorKey: 'settledGold',
      header: 'Recv./Given',
      cell: (info) => {
        const val = info.getValue() as number;
        return (
          <span className="font-mono text-slate-700">
            {val > 0 ? `-${val.toFixed(3)} gm` : '-'}
          </span>
        );
      },
    },
    {
      accessorKey: 'finalCash',
      header: 'Final Amt.',
      cell: (info) => (
        <span className="font-bold text-slate-900 font-mono">
          {(info.getValue() as number).toLocaleString('en-IN')} ₹
        </span>
      ),
    },
    {
      id: 'udhariSec',
      header: 'Udhari Sec.',
      cell: ({ row }) => {
        const hasUdhari =
          row.original.udhariAfter.gold !== 0 ||
          row.original.udhariAfter.cash !== 0 ||
          (row.original.udhariAfter.silver ?? 0) !== 0;
        return (
          <span
            className={`font-black text-sm ${
              hasUdhari ? 'text-blue-600' : 'text-rose-600'
            }`}
          >
            {hasUdhari ? '✓' : '✕'}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: 'Action',
      cell: ({ row }) => (
        <div className="flex items-center space-x-1 justify-center">
          <button
            onClick={() => setSelectedReceipt(row.original)}
            className="p-1 rounded text-slate-600 hover:text-brand-maroon hover:bg-slate-100 transition-colors"
            title="Print 3-Inch Thermal Slip"
          >
            <Printer className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Top Rates Bar (Matching Reference Site Header) */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs gap-3">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-brand-maroon text-brand-gold flex items-center justify-center shrink-0">
            <ArrowRightLeft className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black text-slate-800 leading-tight">
              EXCHANGE POS (बदला / पलटा)
            </h1>
            <p className="text-[11px] text-slate-500">
              Gold exchange & purity conversion terminal with live Udhari Section
            </p>
          </div>
        </div>

        {/* Live Rates Badges */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5 bg-rose-50 border border-rose-200 px-3 py-1 rounded-lg">
            <TrendingDown className="h-3.5 w-3.5 text-rose-600" />
            <span className="text-slate-600 font-semibold">(बेचना) SALE RATE:</span>
            <span className="font-black text-rose-700">₹{saleRate.toLocaleString('en-IN')}</span>
            <span className="text-[10px] text-slate-400">₹/10gm</span>
          </div>

          <div className="flex items-center space-x-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
            <span className="text-slate-600 font-semibold">(खरीदना) PURCHASE RATE:</span>
            <span className="font-black text-emerald-700">₹{purchaseRate.toLocaleString('en-IN')}</span>
            <span className="text-[10px] text-slate-400">₹/10gm</span>
          </div>
        </div>

        <div className="flex rounded-lg bg-slate-200/80 p-0.5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('POS')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'POS'
                ? 'bg-brand-maroon text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>POS Terminal</span>
          </button>
          <button
            onClick={() => setActiveTab('LIST')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'LIST'
                ? 'bg-brand-maroon text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <List className="h-3.5 w-3.5" />
            <span>Past Records ({transactions.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'POS' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column: Exchange Form Terminal (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Buy / Sell Tabs */}
            <div className="grid grid-cols-2 text-center text-xs font-black border-b border-slate-200">
              <button
                type="button"
                onClick={() => setTxnType('BUY')}
                className={`py-3 transition-colors ${
                  txnType === 'BUY'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                (खरीदना) BUY - KACCHA GOLD
              </button>
              <button
                type="button"
                onClick={() => setTxnType('SELL')}
                className={`py-3 transition-colors ${
                  txnType === 'SELL'
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                (बेचना) SELL - FINE GOLD
              </button>
            </div>

            <div className="p-4 space-y-3.5">
              {/* Customer Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer No / Name (ग्राहक चयन) <span className="text-red-500">*</span>
                </label>
                <CustomerSelect
                  value={selectedCustomer?.id || ''}
                  onChange={(c) => setSelectedCustomer(c)}
                />
              </div>

              {/* Physical Weight Matrix (Gross Wt, Less Wt, Net Wt) */}
              <div className="grid grid-cols-3 gap-2.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    (वज़न) Weight (gm)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 font-bold rounded border border-slate-300 focus:border-brand-maroon focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Less Wt (कम वजन gm)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={lessWeight}
                    onChange={(e) => setLessWeight(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 font-bold text-rose-700 rounded border border-slate-300 focus:border-brand-maroon focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Net Weight (gm)
                  </label>
                  <div className="px-2.5 py-1.5 font-extrabold bg-slate-200/70 rounded border border-slate-300 text-slate-900">
                    {netWeight.toFixed(3)} gm
                  </div>
                </div>
              </div>

              {/* Touch & Purity Matrix (Touch, Touch -%, Total Touch, Sample) */}
              <div className="grid grid-cols-4 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    (टंच) Touch (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={touch}
                    onChange={(e) => setTouch(Number(e.target.value))}
                    className="w-full px-2 py-1.5 font-bold rounded border border-slate-300 focus:border-brand-maroon focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Touch (-%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={touchMinus}
                    onChange={(e) => setTouchMinus(Number(e.target.value))}
                    className="w-full px-2 py-1.5 font-bold text-rose-700 rounded border border-slate-300 focus:border-brand-maroon focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Total Touch (%)
                  </label>
                  <div className="px-2 py-1.5 font-extrabold bg-amber-100 rounded border border-amber-300 text-amber-900">
                    {totalTouch.toFixed(2)}%
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Sample (नमूना)
                  </label>
                  <select
                    value={sample}
                    onChange={(e) => setSample(e.target.value as any)}
                    className="w-full px-2 py-1.5 rounded border border-slate-300 bg-white focus:outline-none font-medium"
                  >
                    <option value="lagdi">lagdi</option>
                    <option value="Rava">Rava</option>
                    <option value="99.9">99.9</option>
                    <option value="Dhali">Dhali</option>
                    <option value="Depa">Depa</option>
                    <option value="Zevar">Zevar</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              </div>

              {/* Fine Gold & Difference Row */}
              <div className="grid grid-cols-4 gap-2.5 p-2.5 rounded-lg bg-amber-50/70 border border-amber-200 text-xs">
                <div>
                  <span className="text-[10px] text-amber-800 font-semibold block uppercase">
                    फाइन FINE
                  </span>
                  <span className="text-sm font-black text-amber-950">
                    {fineGold.toFixed(3)} gm
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-amber-800 font-semibold block uppercase">
                    Allowance (+G/-G)
                  </span>
                  <input
                    type="number"
                    step="0.001"
                    value={extraGold}
                    onChange={(e) => setExtraGold(Number(e.target.value))}
                    className="w-full px-2 py-1 text-xs font-bold rounded border border-amber-300 bg-white"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-amber-800 font-semibold block uppercase">
                    (दिया) GIVEN GOLD
                  </span>
                  <input
                    type="number"
                    step="0.001"
                    value={settledGold}
                    onChange={(e) => setSettledGold(Number(e.target.value))}
                    className="w-full px-2 py-1 text-xs font-bold rounded border border-amber-300 bg-white"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-amber-800 font-semibold block uppercase">
                    (बाकि) DIFF GOLD
                  </span>
                  <div
                    className={`font-black text-sm ${
                      diffGold >= 0 ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {diffGold >= 0 ? '+' : ''}
                    {diffGold.toFixed(3)} gm
                  </div>
                </div>
              </div>

              {/* Rate & Cash Calculations */}
              <div className="grid grid-cols-3 gap-2.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    RATE [P/S] (₹/10gm)
                  </label>
                  <input
                    type="number"
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 font-bold rounded border border-slate-300 focus:border-brand-maroon focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    (कैश) CASH [G/R] (₹)
                  </label>
                  <div className="px-2.5 py-1.5 font-black bg-slate-200/80 rounded border border-slate-300 text-slate-900">
                    ₹ {diffAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    (चार्जेस) CHARGES (₹)
                  </label>
                  <input
                    type="number"
                    value={charges}
                    onChange={(e) => setCharges(Number(e.target.value))}
                    placeholder="0.00"
                    className="w-full px-2.5 py-1.5 font-bold rounded border border-slate-300 focus:border-brand-maroon focus:outline-none"
                  />
                </div>
              </div>

              {/* Final Cash Card Banner */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-brand-maroon text-white font-bold text-xs shadow-xs">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-amber-300 block">
                    (फाइनल कैश) FINAL CASH
                  </span>
                  <span className="text-xl font-black">
                    ₹ {finalCash.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="text-right text-[11px] text-slate-200">
                  <div>Diff Amt: ₹{diffAmount.toFixed(2)}</div>
                  <div className="text-amber-300">Charge: {-charges} Rs</div>
                </div>
              </div>

              {/* Split Payment Matrix: GIVEN vs RECIEVED */}
              <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Settlement Breakdown (भुगतान विवरण)
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      GIVEN CASH (रोकड़ दिया ₹)
                    </label>
                    <input
                      type="number"
                      value={givenCash}
                      onChange={(e) => setGivenCash(Number(e.target.value))}
                      className="w-full px-2.5 py-1 rounded border border-slate-300 font-bold text-emerald-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      RECIEVED CASH (रोकड़ लिया ₹)
                    </label>
                    <input
                      type="number"
                      value={recievedCash}
                      onChange={(e) => setRecievedCash(Number(e.target.value))}
                      className="w-full px-2.5 py-1 rounded border border-slate-300 font-bold text-rose-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      ONLINE GIVEN RTGS (₹)
                    </label>
                    <input
                      type="number"
                      value={onlineGivenRtgs}
                      onChange={(e) => setOnlineGivenRtgs(Number(e.target.value))}
                      className="w-full px-2.5 py-1 rounded border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      ONLINE RECIV. RTGS (₹)
                    </label>
                    <input
                      type="number"
                      value={onlineRecivRtgs}
                      onChange={(e) => setOnlineRecivRtgs(Number(e.target.value))}
                      className="w-full px-2.5 py-1 rounded border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      SELF BANK 2 GIVEN RTGS (₹)
                    </label>
                    <input
                      type="number"
                      value={selfBank2GivenRtgs}
                      onChange={(e) => setSelfBank2GivenRtgs(Number(e.target.value))}
                      className="w-full px-2.5 py-1 rounded border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      SELF BANK 2 RECIV. RTGS (₹)
                    </label>
                    <input
                      type="number"
                      value={selfBank2RecivRtgs}
                      onChange={(e) => setSelfBank2RecivRtgs(Number(e.target.value))}
                      className="w-full px-2.5 py-1 rounded border border-slate-300"
                    />
                  </div>
                </div>
              </div>

              {/* Narration */}
              <div>
                <input
                  type="text"
                  value={narration}
                  onChange={(e) => setNarration(e.target.value)}
                  placeholder="Write Narration/Remark (विवरण / टिप्पणी)..."
                  className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-none focus:border-brand-maroon"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => handleSave(false)}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-brand-maroon text-white font-bold text-xs rounded-lg hover:bg-brand-maroon-dark transition-all shadow-xs"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Only (सुरक्षित करें)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSave(true)}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-brand-blue text-white font-bold text-xs rounded-lg hover:bg-blue-600 transition-all shadow-xs"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print 3-Inch Slip</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Full Udhari Section (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-xl border-2 border-emerald-600/30 shadow-xs overflow-hidden">
              <div className="bg-emerald-700 px-4 py-2 text-white flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <Layers className="h-4 w-4" />
                  <h3 className="text-xs font-black uppercase tracking-wider">
                    Udhari Section (उधारी सेक्शन)
                  </h3>
                </div>
                <span className="text-[10px] bg-emerald-800 px-2 py-0.5 rounded font-mono">
                  {selectedCustomer ? `ID: #${selectedCustomer.customerNo}` : 'Select Customer'}
                </span>
              </div>

              <div className="p-4 space-y-3 text-xs">
                {/* Gold Udhari Grid */}
                <div className="space-y-1.5 pb-3 border-b border-slate-200">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>(सोना) Gold Ledger</span>
                    <span className="font-mono text-[11px] text-slate-500">gm</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">(पुराना) Old:</span>
                      <span className="font-bold text-slate-900">{oldGoldBal.toFixed(3)} gm</span>
                    </div>
                    <div className="p-2 rounded bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">Silver Old:</span>
                      <span className="font-bold text-rose-700">
                        {oldSilverBal < 0
                          ? `{-${Math.abs(oldSilverBal).toFixed(3)} gm}`
                          : `${oldSilverBal.toFixed(3)} gm`}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-1.5 rounded bg-emerald-50 border border-emerald-200">
                      <span className="text-emerald-700 block text-[10px]">Jama (+):</span>
                      <span className="font-bold text-emerald-800">{jamaGold.toFixed(3)} gm</span>
                    </div>
                    <div className="p-1.5 rounded bg-rose-50 border border-rose-200">
                      <span className="text-rose-700 block text-[10px]">Udhar (-):</span>
                      <span className="font-bold text-rose-800">{udharGold.toFixed(3)} gm</span>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-emerald-100/70 border border-emerald-300 flex items-center justify-between">
                    <span className="font-bold text-emerald-950 text-xs">FINAL GOLD:</span>
                    <span
                      className={`font-black text-sm font-mono ${
                        newGoldBal >= 0 ? 'text-emerald-900' : 'text-rose-700'
                      }`}
                    >
                      {newGoldBal >= 0 ? '+' : ''}
                      {newGoldBal.toFixed(3)} gm
                    </span>
                  </div>
                </div>

                {/* Cash Udhari Grid */}
                <div className="space-y-1.5 pb-3 border-b border-slate-200">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>(पैसे) Cash Ledger</span>
                    <span className="font-mono text-[11px] text-slate-500">₹ (INR)</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">(पुराना) Old:</span>
                      <span className="font-bold text-slate-900">
                        ₹ {oldCashBal.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="p-2 rounded bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">Old Silver Amt:</span>
                      <span className="font-bold text-slate-900">₹ 0</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-1.5 rounded bg-emerald-50 border border-emerald-200">
                      <span className="text-emerald-700 block text-[10px]">Jama (+):</span>
                      <span className="font-bold text-emerald-800">
                        ₹ {jamaCash.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="p-1.5 rounded bg-rose-50 border border-rose-200">
                      <span className="text-rose-700 block text-[10px]">Udhar (-):</span>
                      <span className="font-bold text-rose-800">
                        ₹ {udharCash.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-emerald-100/70 border border-emerald-300 flex items-center justify-between">
                    <span className="font-bold text-emerald-950 text-xs">FINAL CASH:</span>
                    <span
                      className={`font-black text-sm font-mono ${
                        newCashBal >= 0 ? 'text-emerald-900' : 'text-rose-700'
                      }`}
                    >
                      ₹ {newCashBal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Inline Bhavcut Conversion Bar */}
                <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-300 space-y-2">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-900">
                    <Calculator className="h-3.5 w-3.5 text-amber-700" />
                    <span>Inline Bhavcut Conversion</span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={handleInlineBhavcutAmtToGold}
                      className="px-2 py-1 bg-amber-600 text-white font-black text-xs rounded hover:bg-amber-700"
                      title="Convert Cash to Gold"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      value={bhavcutInputAmt || ''}
                      onChange={(e) => setBhavcutInputAmt(Number(e.target.value))}
                      placeholder="Amount ₹"
                      className="w-full px-2 py-1 text-xs rounded border border-amber-300 bg-white"
                    />
                    <div className="text-[10px] font-bold text-slate-600 shrink-0">
                      @{rate}/10g
                    </div>
                    <button
                      type="button"
                      onClick={handleInlineBhavcutGoldToAmt}
                      className="px-2 py-1 bg-amber-600 text-white font-black text-xs rounded hover:bg-amber-700"
                      title="Convert Gold to Cash"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  {bhavcutConvertedGold > 0 && (
                    <div className="text-[11px] font-bold text-amber-900">
                      = {bhavcutConvertedGold.toFixed(3)} gm Pure Gold
                    </div>
                  )}
                </div>

                {/* Save with Udhari Action */}
                <button
                  type="button"
                  onClick={() => handleSave(true)}
                  className="w-full flex items-center justify-center space-x-2 py-2 bg-emerald-700 text-white font-black text-xs rounded-lg hover:bg-emerald-800 transition-all shadow-xs"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print & Save with Udhari Section</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* History Log Tab */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4">
          <DataTable data={transactions} columns={columns} searchPlaceholder="Search by name, ID, or weight..." />
        </div>
      )}

      {/* 3-Inch Thermal Receipt Modal */}
      <ThermalReceiptModal
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        transaction={selectedReceipt}
      />
    </div>
  );
};
