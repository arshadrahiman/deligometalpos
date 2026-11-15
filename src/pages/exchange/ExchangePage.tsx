import React, { useState, useEffect } from 'react';
import { Customer, ExchangeTransaction } from '../../types';
import { exchangeService } from '../../services/exchangeService';
import { customerService } from '../../services/customerService';
import { useUIStore } from '../../store/useUIStore';
import { useMetalStore } from '../../store/useMetalStore';
import { useStockStore } from '../../store/useStockStore';
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
import { Modal } from '../../components/common/Modal';
import { ThermalReceiptModal } from '../../components/common/ThermalReceiptModal';
import { ExtraSettingsModal } from '../../components/settings/ExtraSettingsModal';
import { ColumnDef } from '@tanstack/react-table';
import {
  Printer,
  Share2,
  Save,
  Settings,
  List as ListIcon,
  Plus,
  Minus,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  UserPlus,
} from 'lucide-react';

export const ExchangePage: React.FC = () => {
  const { showToast } = useUIStore();
  const { metalMode } = useMetalStore();
  const isSilver = metalMode === 'SILVER';
  const { summary, fetchStock, updateMetalRates, recordTransactionImpact } = useStockStore();

  const [activeTab, setActiveTab] = useState<'POS' | 'LIST'>('POS');
  const [txnType, setTxnType] = useState<'BUY' | 'SELL'>('BUY');
  const [transactions, setTransactions] = useState<ExchangeTransaction[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<ExchangeTransaction | null>(null);

  // Modals
  const [isExtraSettingsOpen, setIsExtraSettingsOpen] = useState(false);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isAddSampleOpen, setIsAddSampleOpen] = useState(false);
  const [newSampleName, setNewSampleName] = useState('');

  // Sample received state
  const [sampleReceived, setSampleReceived] = useState(false);

  // Customer Selection (Defaults to XYZ / 100 from reference if available)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Left Column Fields (ALL FULLY EDITABLE)
  const [weight, setWeight] = useState<number>(0.0);
  const [lessWeight, setLessWeight] = useState<number>(0.0);
  const [touch, setTouch] = useState<number>(91.6);
  const [touchMinus, setTouchMinus] = useState<number>(0.0);
  const [totalTouchInput, setTotalTouchInput] = useState<number | null>(null);

  const [sample, setSample] = useState<string>('lagdi');
  const [samplesList, setSamplesList] = useState<string[]>([
    'lagdi',
    'Rava',
    '99.9',
    'Dhali',
    'Depa',
    'Zevar',
    'Chandi Sil',
    'Pata',
    'Chandi Katori',
    'Silver Bar 999',
    'Others',
  ]);

  const [fineGoldInput, setFineGoldInput] = useState<number | null>(null);
  const [extraGoldInput, setExtraGoldInput] = useState<number | null>(null);
  const [settledGold, setSettledGold] = useState<number>(0.0);
  const [allowancePct, setAllowancePct] = useState<number>(0.2);

  const [diffGoldInput, setDiffGoldInput] = useState<number | null>(null);
  const [extraDiffGm, setExtraDiffGm] = useState<string>('');

  const [rate, setRate] = useState<number>(isSilver ? 95000 : 140000);
  const [diffAmountInput, setDiffAmountInput] = useState<number | null>(null);
  const [discountPct, setDiscountPct] = useState<string>('');

  const [charges, setCharges] = useState<number>(50.0);
  const [chargesGm, setChargesGm] = useState<string>('');

  const [finalCashInput, setFinalCashInput] = useState<number | null>(null);

  // Payment Breakdown Fields (Given vs Received)
  const [givenCash, setGivenCash] = useState<number>(0);
  const [onlineGivenRtgs, setOnlineGivenRtgs] = useState<number>(0);
  const [selfBank2GivenRtgs, setSelfBank2GivenRtgs] = useState<number>(0);

  const [recievedCash, setRecievedCash] = useState<number>(0);
  const [onlineRecivRtgs, setOnlineRecivRtgs] = useState<number>(0);
  const [selfBank2RecivRtgs, setSelfBank2RecivRtgs] = useState<number>(0);

  // Right Column Top Rates (Editable)
  const [saleRate, setSaleRate] = useState<number>(isSilver ? 98000 : 144500);
  const [purchaseRate, setPurchaseRate] = useState<number>(isSilver ? 95000 : 140000);

  // Right Column Udhari Section Fields (EXACT MATCH TO REFERENCE - ALL FULLY EDITABLE)
  const [oldGold, setOldGold] = useState<number>(0.0);
  const [oldCash, setOldCash] = useState<number>(0);
  const [oldSilver, setOldSilver] = useState<number>(0.0);
  const [oldSilverCash, setOldSilverCash] = useState<number>(0);

  // Manual input overrides for Kch fields (null = auto-calculated)
  const [kchJamaGoldInput, setKchJamaGoldInput] = useState<number | null>(null);
  const [kchJamaCashInput, setKchJamaCashInput] = useState<number | null>(null);

  const [kchUdharGoldInput, setKchUdharGoldInput] = useState<number | null>(null);
  const [kchUdharCashInput, setKchUdharCashInput] = useState<number | null>(null);

  const [jamaGold, setJamaGold] = useState<number>(0.0);
  const [jamaCash, setJamaCash] = useState<number>(0);

  const [udharGold, setUdharGold] = useState<number>(0.0);
  const [udharCash, setUdharCash] = useState<number>(0);

  // Quick Bhavcut Rate & Narration
  const [bhavcutRate, setBhavcutRate] = useState<number>(isSilver ? 95000 : 140000);
  const [narration, setNarration] = useState<string>('');

  // Quick Add Customer Form State
  const [newCustName, setNewCustName] = useState('');
  const [newCustMobile, setNewCustMobile] = useState('');
  const [newCustCategory, setNewCustCategory] = useState<Customer['category']>('Jewelry Owner');
  const [newCustGoldBal, setNewCustGoldBal] = useState(0);
  const [newCustCashBal, setNewCustCashBal] = useState(0);

  // Load Seed / Storage on Mount
  useEffect(() => {
    fetchStock();
    loadTransactions();
    customerService.getAll().then((list) => {
      // Find customer #100 XYZ by default
      const defaultCust = list.find((c) => c.customerNo === 100) || list[0] || null;
      if (defaultCust) {
        setSelectedCustomer(defaultCust);
      } else {
        // Benchmark default customer #100 XYZ matching reference site
        customerService.create({
          name: 'XYZ',
          mobile: '9645808999',
          shopName: 'XYZ Jewellers',
          category: 'Jewelry Owner',
          address: { city: 'Bhopal', state: 'Madhya Pradesh (23)' },
          taxDetails: { panNo: 'XYZPA1234K' },
          balance: { gold: 0.0, cash: 23530, silver: -413.043 },
        }).then((created) => {
          setSelectedCustomer(created);
        });
      }
    });
  }, [fetchStock]);

  const loadTransactions = async () => {
    const list = await exchangeService.getAll();
    setTransactions(list);
  };

  // Sync Metal Mode & Live Stock Rates
  useEffect(() => {
    if (isSilver) {
      const sBuy = summary.silverStock?.avgRate || 95000;
      const sSell = summary.silverStock?.avgSellRate || 98000;
      setRate(sBuy);
      setSaleRate(sSell);
      setPurchaseRate(sBuy);
      setBhavcutRate(sBuy);
      setSample('Chandi Sil');
      setTouch(99.99);
    } else {
      const gBuy = summary.pureGoldStock?.avgBuyRate || 140000;
      const gSell = summary.pureGoldStock?.avgSellRate || 144500;
      setRate(gBuy);
      setSaleRate(gSell);
      setPurchaseRate(gBuy);
      setBhavcutRate(gBuy);
      setSample('lagdi');
      setTouch(91.6);
    }
  }, [isSilver, summary.pureGoldStock?.avgBuyRate, summary.pureGoldStock?.avgSellRate, summary.silverStock?.avgRate, summary.silverStock?.avgSellRate]);

  // Sync Customer Balances to Udhari Section on Customer Selection
  useEffect(() => {
    if (selectedCustomer) {
      setOldGold(selectedCustomer.balance?.gold ?? 0.0);
      setOldCash(selectedCustomer.balance?.cash ?? 0);
      setOldSilver(selectedCustomer.balance?.silver ?? 0.0);
      setOldSilverCash(0);
    }
  }, [selectedCustomer]);

  // Real-time Calculations for Left Column (with manual override support)
  const netWeight = Math.max(0, Math.round((weight - lessWeight) * 1000) / 1000);
  const autoTotalTouch = Math.max(0, Math.round((touch - touchMinus) * 100) / 100);
  const totalTouch = totalTouchInput !== null ? totalTouchInput : autoTotalTouch;

  const autoFineGold = calculateFineGold(netWeight, totalTouch);
  const fineGold = fineGoldInput !== null ? fineGoldInput : autoFineGold;

  const autoExtraGold =
    allowancePct > 0 && fineGold > 0
      ? Math.round(((fineGold * allowancePct) / 100) * 1000) / 1000
      : 0.0;
  const extraGold = extraGoldInput !== null ? extraGoldInput : autoExtraGold;
  const setExtraGold = (val: number) => setExtraGoldInput(val);

  const afterFine = calculateAfterFine(fineGold, extraGold);

  const autoDiffGold = calculateDiffGold(afterFine, settledGold);
  const extraDiffVal = Number(extraDiffGm) || 0;
  const diffGold = diffGoldInput !== null ? diffGoldInput : Math.round((autoDiffGold + extraDiffVal) * 1000) / 1000;

  // Diff Amount (supports ₹/10gm for Gold, ₹/kg for Silver, and discount %)
  const rawDiffAmount = isSilver
    ? Math.round(((diffGold * rate) / 1000) * 100) / 100
    : Math.round(((diffGold * rate) / 10) * 100) / 100;
  const discountVal = Number(discountPct) || 0;
  const autoDiffAmount = discountVal > 0
    ? Math.round(rawDiffAmount * (1 - discountVal / 100) * 100) / 100
    : rawDiffAmount;
  const diffAmount = diffAmountInput !== null ? diffAmountInput : autoDiffAmount;

  const autoFinalCash = Math.round((diffAmount - charges) * 100) / 100;
  const finalCash = finalCashInput !== null ? finalCashInput : autoFinalCash;

  // Auto-balance Payment Breakdown (Given Cash vs Received Cash) based on Final Cash
  useEffect(() => {
    if (txnType === 'BUY') {
      if (finalCash >= 0) {
        const netGiven = Math.max(0, Math.round((finalCash - onlineGivenRtgs - selfBank2GivenRtgs) * 100) / 100);
        setGivenCash(netGiven);
        setRecievedCash(0);
      } else {
        const netRecv = Math.max(0, Math.round((Math.abs(finalCash) - onlineRecivRtgs - selfBank2RecivRtgs) * 100) / 100);
        setRecievedCash(netRecv);
        setGivenCash(0);
      }
    } else {
      // SELL Mode
      if (finalCash >= 0) {
        const netRecv = Math.max(0, Math.round((finalCash - onlineRecivRtgs - selfBank2RecivRtgs) * 100) / 100);
        setRecievedCash(netRecv);
        setGivenCash(0);
      } else {
        const netGiven = Math.max(0, Math.round((Math.abs(finalCash) - onlineGivenRtgs - selfBank2GivenRtgs) * 100) / 100);
        setGivenCash(netGiven);
        setRecievedCash(0);
      }
    }
  }, [finalCash, txnType, onlineGivenRtgs, selfBank2GivenRtgs, onlineRecivRtgs, selfBank2RecivRtgs]);

  // Txn Type switch with rate alignment
  const handleTxnTypeChange = (newType: 'BUY' | 'SELL') => {
    setTxnType(newType);
    const newRate = newType === 'BUY' ? purchaseRate : saleRate;
    setRate(newRate);
    setDiffAmountInput(null);
    setFinalCashInput(null);
  };

  // Copy After Fine into Given Gold (↓ Button)
  const handleCopyAfterFineToGivenGold = () => {
    setSettledGold(afterFine);
    setDiffGoldInput(null);
    setDiffAmountInput(null);
    setFinalCashInput(null);
    showToast(`Given Gold auto-filled with After Fine (${afterFine.toFixed(3)} gm)`, 'success');
  };

  // Allowance % change -> updates extraGold
  const handleAllowancePctChange = (pct: number) => {
    setAllowancePct(pct);
    setExtraGoldInput(null);
    setDiffGoldInput(null);
    setDiffAmountInput(null);
    setFinalCashInput(null);
  };

  // Charges in gm change -> auto-calculates charges in ₹
  const handleChargesGmChange = (valStr: string) => {
    setChargesGm(valStr);
    const gVal = Number(valStr);
    if (gVal > 0 && rate > 0) {
      const calcCash = isSilver
        ? Math.round(((gVal * rate) / 1000) * 100) / 100
        : Math.round(((gVal * rate) / 10) * 100) / 100;
      setCharges(calcCash);
    }
    setFinalCashInput(null);
  };

  // Charges in ₹ change -> auto-updates chargesGm
  const handleChargesChange = (val: number) => {
    setCharges(val);
    if (val > 0 && rate > 0) {
      const gVal = isSilver
        ? Math.round(((val * 1000) / rate) * 1000) / 1000
        : Math.round(((val * 10) / rate) * 1000) / 1000;
      setChargesGm(gVal.toFixed(3));
    } else {
      setChargesGm('');
    }
    setFinalCashInput(null);
  };

  // Real-time Udhari Section Auto-Calculations
  // 1. Gold auto-fill:
  const autoKchJamaGold = diffGold > 0 ? diffGold : 0.0;
  const autoKchUdharGold = diffGold < 0 ? Math.abs(diffGold) : 0.0;

  // 2. Cash auto-fill:
  // In BUY mode: finalCash > 0 is credit to customer; finalCash < 0 is charges fee owed by customer
  // In SELL mode: finalCash > 0 is purchase balance owed by customer; finalCash < 0 is credit to customer
  const autoKchJamaCash =
    txnType === 'BUY'
      ? (finalCash > 0 ? finalCash : 0)
      : (finalCash < 0 ? Math.abs(finalCash) : 0);

  const autoKchUdharCash =
    txnType === 'BUY'
      ? (finalCash < 0 ? Math.abs(finalCash) : 0)
      : (finalCash > 0 ? finalCash : 0);

  const kchJamaGold = kchJamaGoldInput !== null ? kchJamaGoldInput : autoKchJamaGold;
  const kchJamaCash = kchJamaCashInput !== null ? kchJamaCashInput : autoKchJamaCash;
  const kchUdharGold = kchUdharGoldInput !== null ? kchUdharGoldInput : autoKchUdharGold;
  const kchUdharCash = kchUdharCashInput !== null ? kchUdharCashInput : autoKchUdharCash;

  const setKchJamaGold = (v: number) => setKchJamaGoldInput(v);
  const setKchJamaCash = (v: number) => setKchJamaCashInput(v);
  const setKchUdharGold = (v: number) => setKchUdharGoldInput(v);
  const setKchUdharCash = (v: number) => setKchUdharCashInput(v);

  // Real-time Udhari Section Final Calculation (EXACT MATHEMATICAL ENGINE)
  const finalGold = Math.round((oldGold + kchJamaGold - kchUdharGold + jamaGold - udharGold) * 1000) / 1000;
  const finalCashTotal = Math.round((oldCash + kchJamaCash - kchUdharCash + jamaCash - udharCash) * 100) / 100;

  // Actions for Udhari Buttons
  const handleFillKchJama = () => {
    const val = diffGold > 0 ? diffGold : fineGold > 0 ? fineGold : 0;
    setKchJamaGoldInput(val);
    const cashVal = finalCash > 0 ? finalCash : 0;
    setKchJamaCashInput(cashVal);
    showToast(`Kch se Jama(+) filled with ${val.toFixed(3)} gm & ₹${cashVal.toLocaleString('en-IN')}`, 'success');
  };

  const handleFillKchUdhar = () => {
    const val = diffGold < 0 ? Math.abs(diffGold) : settledGold > 0 ? settledGold : 0;
    setKchUdharGoldInput(val);
    const cashVal = finalCash < 0 ? Math.abs(finalCash) : txnType === 'SELL' && finalCash > 0 ? finalCash : 0;
    setKchUdharCashInput(cashVal);
    showToast(`Kch se Udhar(-) filled with ${val.toFixed(3)} gm & ₹${cashVal.toLocaleString('en-IN')}`, 'info');
  };

  const handleBhavcutCashToGold = () => {
    const rateToUse = bhavcutRate || rate || 80000;
    const cashVal = finalCashTotal !== 0 ? Math.abs(finalCashTotal) : oldCash;
    if (!cashVal || !rateToUse) {
      showToast('Please enter a valid rate and amount to convert', 'error');
      return;
    }
    const convertedG = convertCashToGold(cashVal, rateToUse);
    setJamaGold(convertedG);
    setUdharCash(cashVal);
    showToast(`Converted ₹${cashVal.toLocaleString('en-IN')} to ${convertedG.toFixed(3)} gm Gold @ ₹${rateToUse}/10gm!`, 'success');
  };

  const handleBhavcutGoldToCash = () => {
    const rateToUse = bhavcutRate || rate || 80000;
    const goldVal = finalGold !== 0 ? Math.abs(finalGold) : (oldGold || diffGold);
    if (!goldVal || !rateToUse) {
      showToast('Please enter a valid rate and gold weight to convert', 'error');
      return;
    }
    const convertedC = convertGoldToCash(goldVal, rateToUse);
    setJamaCash(convertedC);
    setUdharGold(goldVal);
    showToast(`Converted ${goldVal.toFixed(3)} gm Gold to ₹${convertedC.toLocaleString('en-IN')} @ ₹${rateToUse}/10gm!`, 'success');
  };

  const handleAddSample = () => {
    if (!newSampleName.trim()) return;
    setSamplesList((prev) => [...prev, newSampleName.trim()]);
    setSample(newSampleName.trim());
    setNewSampleName('');
    setIsAddSampleOpen(false);
    showToast(`Sample "${newSampleName}" added!`, 'success');
  };

  const handleQuickAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim()) {
      showToast('Please enter customer name', 'error');
      return;
    }
    const created = await customerService.create({
      name: newCustName.trim(),
      mobile: newCustMobile.trim() || '9876543210',
      category: newCustCategory,
      address: { city: 'Bhopal', state: 'Madhya Pradesh (23)' },
      taxDetails: {},
      balance: {
        gold: newCustGoldBal,
        cash: newCustCashBal,
        silver: -413.043,
      },
    });
    setSelectedCustomer(created);
    setIsAddCustomerOpen(false);
    setNewCustName('');
    setNewCustMobile('');
    showToast(`Customer #${created.customerNo} ${created.name} created and selected!`, 'success');
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
        gold: oldGold,
        cash: oldCash,
        silver: oldSilver,
        silverCash: oldSilverCash,
      },
      udhariAfter: {
        gold: finalGold,
        cash: finalCashTotal,
        silver: oldSilver,
        silverCash: oldSilverCash,
      },
      udhariDetails: {
        kchJamaGold,
        kchJamaCash,
        kchUdharGold,
        kchUdharCash,
        jamaGold,
        jamaCash,
        udharGold,
        udharCash,
      },
      narration,
    });

    // Synchronize current purchase & sell rates to stock section
    await updateMetalRates(metalMode, purchaseRate, saleRate);

    // Record stock inventory impact
    await recordTransactionImpact({
      metal: metalMode,
      type: txnType,
      fineWeight: settledGold || diffGold || fineGold || 0,
      rate: rate || (txnType === 'BUY' ? purchaseRate : saleRate),
      cashAmount: finalCash || 0,
    });

    showToast(`Exchange #${newTxn.transactionNo} saved & Stock updated! (स्टॉक अपडेट हो गया)`, 'success');
    loadTransactions();

    // Reset form inputs for next transaction and sync customer balance
    setWeight(0);
    setLessWeight(0);
    setSettledGold(0);
    setExtraGoldInput(null);
    setTotalTouchInput(null);
    setDiffGoldInput(null);
    setDiffAmountInput(null);
    setFinalCashInput(null);
    setKchJamaGoldInput(null);
    setKchJamaCashInput(null);
    setKchUdharGoldInput(null);
    setKchUdharCashInput(null);
    setJamaGold(0);
    setJamaCash(0);
    setUdharGold(0);
    setUdharCash(0);
    setNarration('');
    setOldGold(finalGold);
    setOldCash(finalCashTotal);

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
          {(info.getValue() as number).toFixed(3)} gm
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
          {(info.getValue() as number).toFixed(3)} gm
        </span>
      ),
    },
    {
      accessorKey: 'diffGold',
      header: 'Diff Gold',
      cell: (info) => {
        const val = info.getValue() as number;
        return (
          <span className={`font-mono font-bold ${val >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
            {val >= 0 ? '+' : ''}
            {val.toFixed(3)} gm
          </span>
        );
      },
    },
    {
      accessorKey: 'rate',
      header: 'Rate (₹)',
      cell: (info) => (
        <span className="font-mono font-semibold">
          ₹{(info.getValue() as number).toLocaleString('en-IN')}
        </span>
      ),
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
      {/* View Toggle Bar (POS vs Records List) */}
      <div className="flex items-center justify-between bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
            EXCHANGE POS (बदला / पलटा) - {isSilver ? 'SILVER (चाँदी)' : 'GOLD (सोना)'}
          </span>
        </div>
        <div className="flex rounded-lg bg-slate-200/80 p-0.5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('POS')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              activeTab === 'POS'
                ? 'bg-brand-primary text-brand-secondary shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>POS Terminal</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('LIST')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              activeTab === 'LIST'
                ? 'bg-brand-primary text-brand-secondary shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ListIcon className="h-3.5 w-3.5" />
            <span>Past Records ({transactions.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'POS' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          {/* ========================================================= */}
          {/* LEFT CARD: Exchange POS Transaction Form                */}
          {/* ========================================================= */}
          <div className="bg-white rounded-3xl border-2 border-amber-300 p-4 sm:p-5 shadow-sm space-y-3.5">
            {/* Top BUY / SELL Toggle Pills */}
            <div className="flex items-center justify-center space-x-3 pt-1">
              <button
                type="button"
                onClick={() => handleTxnTypeChange('BUY')}
                className={`px-8 py-1 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                  txnType === 'BUY'
                    ? 'border-2 border-red-800 text-red-800 bg-white shadow-xs'
                    : 'border border-slate-300 text-slate-600 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                BUY
              </button>
              <button
                type="button"
                onClick={() => handleTxnTypeChange('SELL')}
                className={`px-8 py-1 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                  txnType === 'SELL'
                    ? 'border-2 border-red-800 text-red-800 bg-white shadow-xs'
                    : 'border border-slate-300 text-slate-600 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                SELL
              </button>
            </div>

            {/* Customer Row */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="font-bold text-slate-700 whitespace-nowrap w-36 text-right sm:text-right">
                Customer No / Name :
              </span>
              <div className="flex-1">
                <CustomerSelect
                  value={selectedCustomer?.id || ''}
                  onChange={(c) => setSelectedCustomer(c)}
                />
              </div>
              <button
                type="button"
                onClick={() => setIsAddCustomerOpen(true)}
                className="h-6 w-6 rounded-full bg-red-800 text-white flex items-center justify-center font-bold text-sm shrink-0 hover:bg-red-900 transition-colors cursor-pointer"
                title="Add New Customer"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="border-t border-slate-200 my-2" />

            {/* (वज़न) WEIGHT (gm) */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="font-bold text-slate-700 whitespace-nowrap w-36 text-right">
                (वज़न) WEIGHT (gm) :
              </span>
              <div className="flex-1 flex items-center space-x-2">
                <div className="flex-1 relative">
                  <input
                    type="number"
                    step="0.001"
                    value={weight === 0 ? '' : weight}
                    placeholder="0.000"
                    onChange={(e) => {
                      setWeight(Number(e.target.value));
                      setFineGoldInput(null);
                      setExtraGoldInput(null);
                      setDiffGoldInput(null);
                      setDiffAmountInput(null);
                      setFinalCashInput(null);
                    }}
                    className="w-full pl-3 pr-8 py-1 rounded-full border border-slate-400 font-bold text-slate-900 focus:border-amber-500 focus:outline-none text-xs"
                  />
                  <span className="absolute right-2.5 top-1 font-bold text-slate-600 text-[11px] pointer-events-none">
                    gm
                  </span>
                </div>
                <div className="flex-1 relative">
                  <input
                    type="number"
                    step="0.001"
                    value={lessWeight === 0 ? '' : lessWeight}
                    placeholder="0.000"
                    onChange={(e) => {
                      setLessWeight(Number(e.target.value));
                      setFineGoldInput(null);
                      setExtraGoldInput(null);
                      setDiffGoldInput(null);
                      setDiffAmountInput(null);
                      setFinalCashInput(null);
                    }}
                    className="w-full pl-3 pr-8 py-1 rounded-full border border-slate-400 font-bold text-slate-900 focus:border-amber-500 focus:outline-none text-xs"
                  />
                  <span className="absolute right-2.5 top-1 font-bold text-slate-600 text-[11px] pointer-events-none">
                    gm
                  </span>
                </div>
              </div>
            </div>

            {/* (टंच) TOUNCH [%] */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="font-bold text-slate-700 whitespace-nowrap w-36 text-right">
                (टंच) TOUNCH [%] :
              </span>
              <div className="flex-1 flex items-center space-x-1.5">
                <div className="flex-1 relative">
                  <input
                    type="number"
                    step="0.01"
                    value={touch === 0 ? '' : touch}
                    placeholder="00.00"
                    onChange={(e) => {
                      setTouch(Number(e.target.value));
                      setTotalTouchInput(null);
                      setFineGoldInput(null);
                      setExtraGoldInput(null);
                      setDiffGoldInput(null);
                      setDiffAmountInput(null);
                      setFinalCashInput(null);
                    }}
                    className="w-full pl-3 pr-6 py-1 rounded-full border border-slate-400 font-bold text-slate-900 focus:border-amber-500 focus:outline-none text-xs"
                  />
                  <span className="absolute right-2 top-1 font-bold text-slate-600 text-[11px] pointer-events-none">
                    %
                  </span>
                </div>
                <div className="w-16 relative">
                  <input
                    type="number"
                    step="0.01"
                    value={touchMinus || ''}
                    onChange={(e) => {
                      setTouchMinus(Number(e.target.value));
                      setTotalTouchInput(null);
                      setFineGoldInput(null);
                      setExtraGoldInput(null);
                      setDiffGoldInput(null);
                      setDiffAmountInput(null);
                      setFinalCashInput(null);
                    }}
                    placeholder="-%"
                    className="w-full px-2 py-1 rounded-full border border-slate-400 text-center font-bold text-rose-700 focus:border-amber-500 focus:outline-none text-xs"
                  />
                </div>
                <div className="flex-1 relative">
                  <input
                    type="number"
                    step="0.01"
                    value={totalTouch === 0 ? '' : totalTouch}
                    onChange={(e) => {
                      setTotalTouchInput(Number(e.target.value));
                      setFineGoldInput(null);
                      setExtraGoldInput(null);
                      setDiffGoldInput(null);
                      setDiffAmountInput(null);
                      setFinalCashInput(null);
                    }}
                    placeholder="Total %"
                    className="w-full pl-3 pr-6 py-1 rounded-full border border-slate-400 font-bold text-slate-900 focus:border-amber-500 focus:outline-none text-xs"
                  />
                  <span className="absolute right-2 top-1 font-bold text-slate-600 text-[11px] pointer-events-none">
                    %
                  </span>
                </div>
              </div>
            </div>

            {/* SAMPLE */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="font-bold text-slate-700 whitespace-nowrap w-36 text-right">
                SAMPLE :
              </span>
              <div className="flex-1 flex items-center space-x-2">
                <select
                  value={sample}
                  onChange={(e) => {
                    const selected = e.target.value;
                    setSample(selected);
                    if (selected === '99.9' || selected === 'Silver Bar 999') {
                      setTouch(99.9);
                    } else if (selected === 'Chandi Sil' || selected === 'Chandi Katori') {
                      setTouch(99.99);
                    } else if (selected === 'lagdi' || selected === 'Rava' || selected === 'Zevar') {
                      setTouch(91.6);
                    }
                    setTouchMinus(0);
                    setTotalTouchInput(null);
                    setFineGoldInput(null);
                    setExtraGoldInput(null);
                    setDiffGoldInput(null);
                    setDiffAmountInput(null);
                    setFinalCashInput(null);
                  }}
                  className="flex-1 px-3 py-1 rounded-full border border-slate-400 font-bold text-slate-900 bg-white focus:outline-none text-xs cursor-pointer"
                >
                  {samplesList.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setIsAddSampleOpen(true)}
                  className="h-6 w-6 rounded-full bg-red-800 text-white flex items-center justify-center font-bold text-sm shrink-0 hover:bg-red-900 transition-colors cursor-pointer"
                  title="Add Sample"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="border-t border-slate-200 my-2" />

            {/* फाइन FINE */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="font-bold text-slate-700 whitespace-nowrap w-36 text-right">
                फाइन FINE :
              </span>
              <div className="flex-1 flex items-center space-x-2">
                <div className="flex-1 relative">
                  <input
                    type="number"
                    step="0.001"
                    value={fineGold === 0 ? '' : fineGold}
                    placeholder="0.000"
                    onChange={(e) => {
                      setFineGoldInput(Number(e.target.value));
                      setDiffGoldInput(null);
                      setDiffAmountInput(null);
                      setFinalCashInput(null);
                    }}
                    className="w-full pl-3 pr-8 py-1 rounded-full border border-slate-400 font-black text-slate-900 focus:border-amber-500 focus:outline-none text-xs"
                  />
                  <span className="absolute right-2.5 top-1 font-bold text-slate-600 text-[11px] pointer-events-none">
                    gm
                  </span>
                </div>
                <div className="flex-1 relative">
                  <input
                    type="number"
                    step="0.001"
                    value={extraGold === 0 ? '' : extraGold}
                    placeholder="0.000"
                    onChange={(e) => {
                      setExtraGold(Number(e.target.value));
                      setDiffGoldInput(null);
                      setDiffAmountInput(null);
                      setFinalCashInput(null);
                    }}
                    className="w-full pl-3 pr-8 py-1 rounded-full border border-slate-400 font-bold text-slate-900 focus:border-amber-500 focus:outline-none text-xs"
                  />
                  <span className="absolute right-2.5 top-1 font-bold text-slate-600 text-[11px] pointer-events-none">
                    gm
                  </span>
                </div>
              </div>
            </div>

            {/* (दिया) GIVEN GOLD */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="font-bold text-slate-700 whitespace-nowrap w-36 text-right">
                (दिया) GIVEN GOLD :
              </span>
              <div className="flex-1 flex items-center space-x-2">
                <div className="flex-1 relative">
                  <input
                    type="number"
                    step="0.001"
                    value={settledGold === 0 ? '' : settledGold}
                    placeholder="0.000"
                    onChange={(e) => {
                      setSettledGold(Number(e.target.value));
                      setDiffGoldInput(null);
                      setDiffAmountInput(null);
                      setFinalCashInput(null);
                    }}
                    className="w-full pl-3 pr-8 py-1 rounded-full border border-slate-400 font-bold text-slate-900 focus:border-amber-500 focus:outline-none text-xs"
                  />
                  <span className="absolute right-2.5 top-1 font-bold text-slate-600 text-[11px] pointer-events-none">
                    gm
                  </span>
                </div>
                <div className="flex-1 relative flex items-center">
                  <button
                    type="button"
                    onClick={handleCopyAfterFineToGivenGold}
                    className="absolute left-1 top-1 h-5 w-5 rounded-full bg-red-800 text-white flex items-center justify-center font-bold text-xs hover:bg-red-900 transition-colors shadow-xs cursor-pointer z-10"
                    title="Copy After Fine to Given Gold (Settles Diff Gold to 0.000 gm)"
                  >
                    ↓
                  </button>
                  <input
                    type="number"
                    step="0.01"
                    value={allowancePct === 0 ? '' : allowancePct}
                    placeholder="0.00"
                    onChange={(e) => handleAllowancePctChange(Number(e.target.value))}
                    className="w-full pl-7 pr-12 py-1 rounded-full border border-slate-400 font-bold text-slate-900 focus:border-amber-500 focus:outline-none text-xs"
                  />
                  <span className="absolute right-2 top-1 font-bold text-slate-600 text-[11px] pointer-events-none">
                    +(%)
                  </span>
                </div>
              </div>
            </div>

            {/* (बाकि) DIFF GOLD */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="font-bold text-slate-700 whitespace-nowrap w-36 text-right">
                (बाकि) DIFF GOLD :
              </span>
              <div className="flex-1 flex items-center space-x-2">
                <div className="flex-1 relative">
                  <input
                    type="number"
                    step="0.001"
                    value={diffGold}
                    onChange={(e) => {
                      setDiffGoldInput(Number(e.target.value));
                      setDiffAmountInput(null);
                      setFinalCashInput(null);
                    }}
                    className="w-full pl-3 pr-8 py-1 rounded-full border-2 border-emerald-500 font-black text-emerald-800 bg-emerald-50/40 focus:border-emerald-600 focus:outline-none text-xs"
                  />
                  <span className="absolute right-2.5 top-1 font-bold text-emerald-800 text-[11px] pointer-events-none">
                    gm
                  </span>
                </div>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={extraDiffGm}
                    onChange={(e) => {
                      setExtraDiffGm(e.target.value);
                      setDiffGoldInput(null);
                      setDiffAmountInput(null);
                      setFinalCashInput(null);
                    }}
                    placeholder=""
                    className="w-full pl-3 pr-12 py-1 rounded-full border border-slate-400 font-bold text-slate-900 focus:border-amber-500 focus:outline-none text-xs"
                  />
                  <span className="absolute right-2 top-1 font-bold text-slate-600 text-[11px] pointer-events-none">
                    (+)gm
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 my-2" />

            {/* RATE [P/S] */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="font-bold text-slate-700 whitespace-nowrap w-36 text-right">
                RATE [P/S] :
              </span>
              <div className="flex-1 relative">
                <input
                  type="number"
                  value={rate}
                  onChange={(e) => {
                    setRate(Number(e.target.value));
                    setDiffAmountInput(null);
                    setFinalCashInput(null);
                  }}
                  className="w-full pl-3 pr-14 py-1 rounded-full border border-slate-400 font-bold text-slate-900 focus:border-amber-500 focus:outline-none text-xs"
                />
                <span className="absolute right-2.5 top-1 font-bold text-slate-600 text-[10px] pointer-events-none">
                  {isSilver ? '₹/1kg' : '₹/10gm'}
                </span>
              </div>
            </div>

            {/* (कैश) CASH [G/R] */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="font-bold text-slate-700 whitespace-nowrap w-36 text-right">
                (कैश) CASH [G/R] :
              </span>
              <div className="flex-1 flex items-center space-x-2">
                <div className="flex-1 relative">
                  <input
                    type="number"
                    step="0.01"
                    value={diffAmount}
                    onChange={(e) => {
                      setDiffAmountInput(Number(e.target.value));
                      setFinalCashInput(null);
                    }}
                    className="w-full pl-3 pr-6 py-1 rounded-full border-2 border-emerald-500 font-black text-emerald-800 bg-emerald-50/40 focus:border-emerald-600 focus:outline-none text-xs"
                  />
                  <span className="absolute right-2 top-1 font-bold text-emerald-800 text-[11px] pointer-events-none">
                    ₹
                  </span>
                </div>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={discountPct}
                    onChange={(e) => {
                      setDiscountPct(e.target.value);
                      setDiffAmountInput(null);
                      setFinalCashInput(null);
                    }}
                    placeholder=""
                    className="w-full pl-3 pr-10 py-1 rounded-full border border-slate-400 font-bold text-slate-900 focus:border-amber-500 focus:outline-none text-xs"
                  />
                  <span className="absolute right-2 top-1 font-bold text-slate-600 text-[11px] pointer-events-none">
                    (-) %
                  </span>
                </div>
              </div>
            </div>

            {/* (चार्जेस) CHARGES */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="font-bold text-slate-700 whitespace-nowrap w-36 text-right">
                (चार्जेस) CHARGES :
              </span>
              <div className="flex-1 flex items-center space-x-2">
                <div className="flex-1 relative">
                  <input
                    type="number"
                    value={charges === 0 ? '' : charges}
                    placeholder="0"
                    onChange={(e) => handleChargesChange(Number(e.target.value))}
                    className="w-full pl-3 pr-6 py-1 rounded-full border border-slate-400 font-bold text-slate-900 focus:border-amber-500 focus:outline-none text-xs"
                  />
                  <span className="absolute right-2 top-1 font-bold text-slate-600 text-[11px] pointer-events-none">
                    ₹
                  </span>
                </div>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={chargesGm}
                    onChange={(e) => handleChargesGmChange(e.target.value)}
                    placeholder=""
                    className="w-full pl-3 pr-12 py-1 rounded-full border border-slate-400 font-bold text-slate-900 focus:border-amber-500 focus:outline-none text-xs"
                  />
                  <span className="absolute right-2 top-1 font-bold text-slate-600 text-[11px] pointer-events-none">
                    (-)gm
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 my-2" />

            {/* (फाइनल कैश) FINAL CASH */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="font-black text-slate-900 whitespace-nowrap w-36 text-right">
                (फाइनल कैश) FINAL CASH :
              </span>
              <div className="flex-1 relative">
                <input
                  type="number"
                  value={finalCash}
                  onChange={(e) => setFinalCashInput(Number(e.target.value))}
                  className={`w-full pl-3 pr-6 py-1.5 rounded-full border-2 font-black text-sm focus:outline-none ${
                    finalCash < 0
                      ? 'border-red-600 text-red-700 bg-red-50/50'
                      : 'border-emerald-600 text-emerald-800 bg-emerald-50/50'
                  }`}
                />
                <span className="absolute right-3 top-1.5 font-black text-slate-700 text-xs pointer-events-none">
                  ₹
                </span>
              </div>
            </div>

            {/* Payment Settlement Breakdown Matrix (2 Columns: Given vs Recieved) */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-bold text-slate-700">
              {/* Left Column: Given */}
              <div className="space-y-2">
                <div className="flex items-center space-x-1.5">
                  <span className="text-[11px] w-24 text-right whitespace-nowrap">GIVEN CASH :</span>
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      value={givenCash}
                      onChange={(e) => setGivenCash(Number(e.target.value))}
                      className="w-full pl-2.5 pr-5 py-1 rounded-full border border-slate-400 font-bold text-xs"
                    />
                    <span className="absolute right-2 top-1 text-slate-500 text-[11px]">₹</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] w-24 text-right leading-tight">ONLINE GIVEN RTGS :</span>
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      value={onlineGivenRtgs}
                      onChange={(e) => setOnlineGivenRtgs(Number(e.target.value))}
                      className="w-full pl-2.5 pr-5 py-1 rounded-full border border-slate-400 font-bold text-xs"
                    />
                    <span className="absolute right-2 top-1 text-slate-500 text-[11px]">₹</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] w-24 text-right leading-tight">SELF BANK 2 GIVEN RTGS :</span>
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      value={selfBank2GivenRtgs}
                      onChange={(e) => setSelfBank2GivenRtgs(Number(e.target.value))}
                      className="w-full pl-2.5 pr-5 py-1 rounded-full border border-slate-400 font-bold text-xs"
                    />
                    <span className="absolute right-2 top-1 text-slate-500 text-[11px]">₹</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Recieved */}
              <div className="space-y-2">
                <div className="flex items-center space-x-1.5">
                  <span className="text-[11px] w-24 text-right whitespace-nowrap">RECIEVED CASH :</span>
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      value={recievedCash}
                      onChange={(e) => setRecievedCash(Number(e.target.value))}
                      className="w-full pl-2.5 pr-5 py-1 rounded-full border border-slate-400 font-bold text-xs"
                    />
                    <span className="absolute right-2 top-1 text-slate-500 text-[11px]">₹</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] w-24 text-right leading-tight">ONLINE RECIV. RTGS :</span>
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      value={onlineRecivRtgs}
                      onChange={(e) => setOnlineRecivRtgs(Number(e.target.value))}
                      className="w-full pl-2.5 pr-5 py-1 rounded-full border border-slate-400 font-bold text-xs"
                    />
                    <span className="absolute right-2 top-1 text-slate-500 text-[11px]">₹</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] w-24 text-right leading-tight">SELF BANK 2 RECIV. RTGS :</span>
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      value={selfBank2RecivRtgs}
                      onChange={(e) => setSelfBank2RecivRtgs(Number(e.target.value))}
                      className="w-full pl-2.5 pr-5 py-1 rounded-full border border-slate-400 font-bold text-xs"
                    />
                    <span className="absolute right-2 top-1 text-slate-500 text-[11px]">₹</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions Left Card: WhatsApp & Print Icons */}
            <div className="flex items-center justify-around pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  const mobile = selectedCustomer?.mobile || '9645808999';
                  const text = encodeURIComponent(
                    `*Exchange Receipt - ${selectedCustomer?.name}*\nWeight: ${weight}g\nPurity: ${touch}%\nFine Gold: ${fineGold}g\nFinal Cash: ₹${finalCash}\nDeligo Technologies ERP`
                  );
                  window.open(`https://wa.me/91${mobile}?text=${text}`, '_blank');
                }}
                className="h-10 w-10 rounded-full border border-emerald-500 text-emerald-600 flex items-center justify-center hover:bg-emerald-50 transition-colors shadow-xs cursor-pointer"
                title="Share via WhatsApp"
              >
                <Share2 className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={() => handleSave(true)}
                className="h-10 w-10 rounded-full border-2 border-red-800 text-red-800 flex items-center justify-center hover:bg-red-50 transition-colors shadow-xs cursor-pointer"
                title="Save & Print Thermal Receipt Slip"
              >
                <Printer className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT CARD: Exact Reference Udhari Section               */}
          {/* ========================================================= */}
          <div className="bg-white rounded-3xl border-2 border-amber-300 p-4 sm:p-5 shadow-sm space-y-3.5">
            {/* Top Rates Row & Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center space-x-2 text-xs">
                  <span className="font-bold text-slate-700 whitespace-nowrap w-36 text-right">
                    (बेचना) SALE RATE :
                  </span>
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      value={saleRate}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setSaleRate(val);
                        if (txnType === 'SELL') {
                          setRate(val);
                          setDiffAmountInput(null);
                          setFinalCashInput(null);
                        }
                        updateMetalRates(metalMode, purchaseRate, val);
                      }}
                      onBlur={() => {
                        updateMetalRates(metalMode, purchaseRate, saleRate);
                        showToast(`Sale rate ₹${saleRate.toLocaleString('en-IN')} updated in Stock!`, 'info');
                      }}
                      className="w-full pl-3 pr-14 py-1 rounded-full border border-slate-400 font-bold text-slate-900 focus:outline-none text-xs"
                    />
                    <span className="absolute right-2.5 top-1 font-bold text-slate-600 text-[10px] pointer-events-none">
                      {isSilver ? '₹/1kg' : '₹/10gm'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <span className="font-bold text-slate-700 whitespace-nowrap w-36 text-right">
                    (खरीदना) PURCHASE RATE :
                  </span>
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      value={purchaseRate}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setPurchaseRate(val);
                        if (txnType === 'BUY') {
                          setRate(val);
                          setDiffAmountInput(null);
                          setFinalCashInput(null);
                        }
                        updateMetalRates(metalMode, val, saleRate);
                      }}
                      onBlur={() => {
                        updateMetalRates(metalMode, purchaseRate, saleRate);
                        showToast(`Purchase rate ₹${purchaseRate.toLocaleString('en-IN')} updated in Stock!`, 'info');
                      }}
                      className="w-full pl-3 pr-14 py-1 rounded-full border border-slate-400 font-bold text-slate-900 focus:outline-none text-xs"
                    />
                    <span className="absolute right-2.5 top-1 font-bold text-slate-600 text-[10px] pointer-events-none">
                      {isSilver ? '₹/1kg' : '₹/10gm'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Top Right: Save, Settings, List, Sample Received */}
              <div className="flex flex-col items-end space-y-1.5 shrink-0">
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={async () => {
                      await updateMetalRates(metalMode, purchaseRate, saleRate);
                      await handleSave(false);
                    }}
                    className="h-7 w-7 rounded-full bg-[#822c22] text-white flex items-center justify-center hover:bg-[#6c231a] transition-colors cursor-pointer shadow-xs"
                    title="Save Transaction & Update Stock Rates"
                  >
                    <Save className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsExtraSettingsOpen(true)}
                    className="h-7 w-7 rounded-full bg-[#822c22] text-white flex items-center justify-center hover:bg-[#6c231a] transition-colors cursor-pointer shadow-xs"
                    title="Extra Settings"
                  >
                    <Settings className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('LIST')}
                    className="px-3 py-1 rounded-full bg-[#822c22] text-white font-bold text-xs flex items-center space-x-1 hover:bg-[#6c231a] transition-colors cursor-pointer shadow-xs"
                  >
                    <ListIcon className="h-3.5 w-3.5" />
                    <span>List</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSampleReceived(!sampleReceived);
                    showToast(
                      sampleReceived ? 'Sample marked as Pending' : 'Sample Marked as Received!',
                      'info'
                    );
                  }}
                  className={`px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border transition-all cursor-pointer ${
                    sampleReceived
                      ? 'border-emerald-600 text-emerald-800 bg-emerald-50'
                      : 'border-amber-600 text-amber-900 bg-amber-50 hover:bg-amber-100'
                  }`}
                >
                  SAMPLE RECIEVED {sampleReceived ? '✓' : ''}
                </button>
              </div>
            </div>

            <div className="border-t border-slate-200 my-2" />

            {/* Centered Udhari Section Title */}
            <div className="text-center font-bold text-slate-800 text-xs tracking-wide">
              Udhari Section
            </div>

            {/* Column Headers: Gold & Cash */}
            <div className="grid grid-cols-12 gap-2 text-center text-xs font-bold text-slate-800">
              <div className="col-span-3 text-right"></div>
              <div className="col-span-4 text-center font-extrabold text-slate-900">Gold</div>
              <div className="col-span-1"></div>
              <div className="col-span-4 text-center font-extrabold text-slate-900">Cash</div>
            </div>

            {/* Row 1: (पुराना) Old : */}
            <div className="grid grid-cols-12 gap-2 items-center text-xs">
              <span className="col-span-3 font-bold text-slate-700 text-right whitespace-nowrap">
                (पुराना) Old :
              </span>
              <div className="col-span-4 relative">
                <input
                  type="number"
                  step="0.001"
                  value={oldGold}
                  onChange={(e) => setOldGold(Number(e.target.value))}
                  className="w-full pl-2 pr-7 py-1 rounded-full border-2 border-emerald-400 bg-emerald-50/70 font-black text-slate-900 text-center text-xs focus:outline-none"
                />
                <span className="absolute right-2 top-1 font-bold text-slate-600 text-[10px] pointer-events-none">
                  gm
                </span>
              </div>
              <div className="col-span-1"></div>
              <div className="col-span-4 relative">
                <input
                  type="number"
                  value={oldCash}
                  onChange={(e) => setOldCash(Number(e.target.value))}
                  className="w-full pl-2 pr-5 py-1 rounded-full border-2 border-emerald-400 bg-emerald-50/70 font-black text-slate-900 text-center text-xs focus:outline-none"
                />
                <span className="absolute right-2 top-1 font-bold text-slate-600 text-[10px] pointer-events-none">
                  ₹
                </span>
              </div>
            </div>

            {/* Row 2: Silver Old */}
            <div className="grid grid-cols-12 gap-2 items-center text-xs">
              <span className="col-span-3 font-bold text-slate-700 text-right whitespace-nowrap">
                Silver Old
              </span>
              <div className="col-span-4 relative">
                <input
                  type="number"
                  step="0.001"
                  value={oldSilver}
                  onChange={(e) => setOldSilver(Number(e.target.value))}
                  className={`w-full pl-2 pr-7 py-1 rounded-full border-2 border-emerald-400 bg-emerald-50/70 font-black text-center text-xs focus:outline-none ${
                    oldSilver < 0 ? 'text-rose-600' : 'text-slate-900'
                  }`}
                />
                <span className="absolute right-2 top-1 font-bold text-slate-600 text-[10px] pointer-events-none">
                  gm
                </span>
              </div>
              <div className="col-span-1"></div>
              <div className="col-span-4 relative">
                <input
                  type="number"
                  value={oldSilverCash}
                  onChange={(e) => setOldSilverCash(Number(e.target.value))}
                  className="w-full pl-2 pr-5 py-1 rounded-full border-2 border-emerald-400 bg-emerald-50/70 font-black text-slate-900 text-center text-xs focus:outline-none"
                />
                <span className="absolute right-2 top-1 font-bold text-slate-600 text-[10px] pointer-events-none">
                  ₹
                </span>
              </div>
            </div>

            {/* Row 3: Kch se Jama(+) : with [ + ] Button */}
            <div className="grid grid-cols-12 gap-2 items-center text-xs">
              <span className="col-span-3 font-bold text-slate-700 text-right whitespace-nowrap">
                Kch se Jama(+) :
              </span>
              <div className="col-span-4 relative">
                <input
                  type="number"
                  step="0.001"
                  value={kchJamaGold || ''}
                  onChange={(e) => setKchJamaGold(Number(e.target.value))}
                  placeholder="0.000"
                  className="w-full pl-2 pr-7 py-1 rounded-full border border-slate-400 font-bold text-slate-900 text-center text-xs focus:outline-none"
                />
                <span className="absolute right-2 top-1 font-bold text-slate-600 text-[10px] pointer-events-none">
                  gm
                </span>
              </div>
              <div className="col-span-1 flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleFillKchJama}
                  className="h-6 w-6 rounded-full bg-red-800 text-white flex items-center justify-center font-bold text-xs hover:bg-red-900 transition-colors shadow-xs cursor-pointer"
                  title="Populate from Fine/Diff Gold"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="col-span-4 relative">
                <input
                  type="number"
                  value={kchJamaCash || ''}
                  onChange={(e) => setKchJamaCash(Number(e.target.value))}
                  placeholder="0"
                  className="w-full pl-2 pr-5 py-1 rounded-full border border-slate-400 font-bold text-slate-900 text-center text-xs focus:outline-none"
                />
                <span className="absolute right-2 top-1 font-bold text-slate-600 text-[10px] pointer-events-none">
                  ₹
                </span>
              </div>
            </div>

            {/* Row 4: Kch se Udhar(-) : with [ - ] Button */}
            <div className="grid grid-cols-12 gap-2 items-center text-xs">
              <span className="col-span-3 font-bold text-slate-700 text-right whitespace-nowrap">
                Kch se Udhar(-) :
              </span>
              <div className="col-span-4 relative">
                <input
                  type="number"
                  step="0.001"
                  value={kchUdharGold || ''}
                  onChange={(e) => setKchUdharGold(Number(e.target.value))}
                  placeholder="0.000"
                  className="w-full pl-2 pr-7 py-1 rounded-full border border-slate-400 font-bold text-slate-900 text-center text-xs focus:outline-none"
                />
                <span className="absolute right-2 top-1 font-bold text-slate-600 text-[10px] pointer-events-none">
                  gm
                </span>
              </div>
              <div className="col-span-1 flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleFillKchUdhar}
                  className="h-6 w-6 rounded-full bg-red-800 text-white flex items-center justify-center font-bold text-xs hover:bg-red-900 transition-colors shadow-xs cursor-pointer"
                  title="Populate from Settled/Diff Gold"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="col-span-4 relative">
                <input
                  type="number"
                  value={kchUdharCash || ''}
                  onChange={(e) => setKchUdharCash(Number(e.target.value))}
                  placeholder="0"
                  className="w-full pl-2 pr-5 py-1 rounded-full border border-slate-400 font-bold text-slate-900 text-center text-xs focus:outline-none"
                />
                <span className="absolute right-2 top-1 font-bold text-slate-600 text-[10px] pointer-events-none">
                  ₹
                </span>
              </div>
            </div>

            {/* Row 5: Jama (+) : */}
            <div className="grid grid-cols-12 gap-2 items-center text-xs">
              <span className="col-span-3 font-bold text-slate-700 text-right whitespace-nowrap">
                Jama (+) :
              </span>
              <div className="col-span-4 relative">
                <input
                  type="number"
                  step="0.001"
                  value={jamaGold || ''}
                  onChange={(e) => setJamaGold(Number(e.target.value))}
                  placeholder="0.000"
                  className="w-full pl-2 pr-7 py-1 rounded-full border border-slate-400 font-bold text-slate-900 text-center text-xs focus:outline-none"
                />
                <span className="absolute right-2 top-1 font-bold text-slate-600 text-[10px] pointer-events-none">
                  gm
                </span>
              </div>
              <div className="col-span-1"></div>
              <div className="col-span-4 relative">
                <input
                  type="number"
                  value={jamaCash || ''}
                  onChange={(e) => setJamaCash(Number(e.target.value))}
                  placeholder="0"
                  className="w-full pl-2 pr-5 py-1 rounded-full border border-slate-400 font-bold text-slate-900 text-center text-xs focus:outline-none"
                />
                <span className="absolute right-2 top-1 font-bold text-slate-600 text-[10px] pointer-events-none">
                  ₹
                </span>
              </div>
            </div>

            {/* Row 6: Udhar (-) : */}
            <div className="grid grid-cols-12 gap-2 items-center text-xs">
              <span className="col-span-3 font-bold text-slate-700 text-right whitespace-nowrap">
                Udhar (-) :
              </span>
              <div className="col-span-4 relative">
                <input
                  type="number"
                  step="0.001"
                  value={udharGold || ''}
                  onChange={(e) => setUdharGold(Number(e.target.value))}
                  placeholder="0.000"
                  className="w-full pl-2 pr-7 py-1 rounded-full border border-slate-400 font-bold text-slate-900 text-center text-xs focus:outline-none"
                />
                <span className="absolute right-2 top-1 font-bold text-slate-600 text-[10px] pointer-events-none">
                  gm
                </span>
              </div>
              <div className="col-span-1"></div>
              <div className="col-span-4 relative">
                <input
                  type="number"
                  value={udharCash || ''}
                  onChange={(e) => setUdharCash(Number(e.target.value))}
                  placeholder="0"
                  className="w-full pl-2 pr-5 py-1 rounded-full border border-slate-400 font-bold text-slate-900 text-center text-xs focus:outline-none"
                />
                <span className="absolute right-2 top-1 font-bold text-slate-600 text-[10px] pointer-events-none">
                  ₹
                </span>
              </div>
            </div>

            {/* Row 7: Final : */}
            <div className="grid grid-cols-12 gap-2 items-center text-xs pt-1">
              <span className="col-span-3 font-extrabold text-slate-900 text-right whitespace-nowrap">
                Final :
              </span>
              <div className="col-span-4 relative">
                <div
                  className={`w-full pl-2 pr-7 py-1.5 rounded-full border-2 border-emerald-500 bg-emerald-100/90 font-black text-center text-xs ${
                    finalGold >= 0 ? 'text-emerald-950' : 'text-rose-700'
                  }`}
                >
                  {finalGold.toFixed(3)}
                </div>
                <span className="absolute right-2 top-1.5 font-black text-emerald-900 text-[10px]">
                  gm
                </span>
              </div>
              <div className="col-span-1"></div>
              <div className="col-span-4 relative">
                <div
                  className={`w-full pl-2 pr-5 py-1.5 rounded-full border-2 border-emerald-500 bg-emerald-100/90 font-black text-center text-xs ${
                    finalCashTotal >= 0 ? 'text-emerald-950' : 'text-rose-700'
                  }`}
                >
                  {finalCashTotal.toLocaleString('en-IN')}
                </div>
                <span className="absolute right-2 top-1.5 font-black text-emerald-900 text-[10px]">
                  ₹
                </span>
              </div>
            </div>

            {/* Row 8: Quick Bhavcut Conversion Controls (< 80000 ₹/10gm >) */}
            <div className="flex items-center justify-center space-x-1.5 pt-2">
              <button
                type="button"
                onClick={handleBhavcutCashToGold}
                className="h-7 w-7 rounded-md bg-[#822c22] text-white flex items-center justify-center font-bold text-sm hover:bg-[#6c231a] transition-colors cursor-pointer shadow-xs"
                title="Convert Cash to Gold (<)"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="w-48 relative">
                <input
                  type="number"
                  value={bhavcutRate}
                  onChange={(e) => setBhavcutRate(Number(e.target.value))}
                  placeholder="0"
                  className="w-full pl-3 pr-14 py-1 rounded-full border border-slate-400 font-bold text-slate-900 text-center focus:outline-none text-xs"
                />
                <span className="absolute right-2.5 top-1 font-bold text-slate-600 text-[10px] pointer-events-none">
                  ₹/10gm
                </span>
              </div>

              <button
                type="button"
                onClick={handleBhavcutGoldToCash}
                className="h-7 w-7 rounded-md bg-[#822c22] text-white flex items-center justify-center font-bold text-sm hover:bg-[#6c231a] transition-colors cursor-pointer shadow-xs"
                title="Convert Gold to Cash (>)"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Row 9: Write Narration / Remark Textarea */}
            <div className="pt-1">
              <textarea
                rows={2}
                value={narration}
                onChange={(e) => setNarration(e.target.value)}
                placeholder="Write Narration/Remark"
                className="w-full px-3 py-1.5 rounded-xl border border-slate-400 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            {/* Row 10: Centered Big Printer Icon Action Button */}
            <div className="flex items-center justify-center pt-2">
              <button
                type="button"
                onClick={() => handleSave(true)}
                className="p-3 rounded-2xl border-2 border-red-800 text-red-800 hover:bg-red-50 hover:scale-105 transition-all shadow-xs cursor-pointer flex items-center justify-center"
                title="Print Slip & Save with Udhari"
              >
                <Printer className="h-7 w-7" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Past Records Log Tab */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4">
          <DataTable
            data={transactions}
            columns={columns}
            searchPlaceholder="Search exchange records by name, ID, or weight..."
          />
        </div>
      )}

      {/* 3-Inch Thermal Receipt Modal */}
      <ThermalReceiptModal
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        transaction={selectedReceipt}
      />

      {/* Quick Add Customer Modal */}
      <Modal
        isOpen={isAddCustomerOpen}
        onClose={() => setIsAddCustomerOpen(false)}
        title="ADD NEW CUSTOMER (नया ग्राहक जोड़ें)"
        maxWidth="md"
      >
        <form onSubmit={handleQuickAddCustomer} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Customer / Shop Name *</label>
            <input
              type="text"
              required
              value={newCustName}
              onChange={(e) => setNewCustName(e.target.value)}
              placeholder="e.g. Ramesh Jewellers"
              className="w-full px-3 py-1.5 rounded border border-slate-300 font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Mobile Number (WhatsApp)</label>
            <input
              type="tel"
              value={newCustMobile}
              onChange={(e) => setNewCustMobile(e.target.value)}
              placeholder="e.g. 9876543210"
              className="w-full px-3 py-1.5 rounded border border-slate-300"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Customer Category</label>
            <select
              value={newCustCategory}
              onChange={(e) => setNewCustCategory(e.target.value as any)}
              className="w-full px-3 py-1.5 rounded border border-slate-300 bg-white"
            >
              <option value="Jewelry Owner">Jewelry Owner (ज्वेलरी मालिक)</option>
              <option value="Karigar">Karigar (कारीगर)</option>
              <option value="Galaiwala">Galaiwala (गलाई वाला)</option>
              <option value="Whole Seller">Whole Seller (थोक व्यापारी)</option>
              <option value="Others">Others (अन्य)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Opening Gold Balance (gm)</label>
              <input
                type="number"
                step="0.001"
                value={newCustGoldBal}
                onChange={(e) => setNewCustGoldBal(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded border border-slate-300 font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Opening Cash Balance (₹)</label>
              <input
                type="number"
                value={newCustCashBal}
                onChange={(e) => setNewCustCashBal(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded border border-slate-300 font-bold"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t">
            <button
              type="button"
              onClick={() => setIsAddCustomerOpen(false)}
              className="px-3 py-1.5 border border-slate-300 rounded text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-brand-primary text-brand-secondary font-bold rounded hover:bg-brand-primary-dark cursor-pointer shadow-xs"
            >
              Save Customer
            </button>
          </div>
        </form>
      </Modal>

      {/* Quick Add Sample Modal */}
      <Modal
        isOpen={isAddSampleOpen}
        onClose={() => setIsAddSampleOpen(false)}
        title="ADD NEW SAMPLE TYPE (नया नमूना जोड़ें)"
        maxWidth="sm"
      >
        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Sample Name</label>
            <input
              type="text"
              autoFocus
              value={newSampleName}
              onChange={(e) => setNewSampleName(e.target.value)}
              placeholder="e.g. 22K Kadli, Chhalli, etc."
              className="w-full px-3 py-1.5 rounded border border-slate-300 font-bold"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-2 border-t">
            <button
              type="button"
              onClick={() => setIsAddSampleOpen(false)}
              className="px-3 py-1.5 border border-slate-300 rounded text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddSample}
              className="px-4 py-1.5 bg-brand-primary text-brand-secondary font-bold rounded hover:bg-brand-primary-dark cursor-pointer shadow-xs"
            >
              Add Sample
            </button>
          </div>
        </div>
      </Modal>

      {/* Extra Settings Modal */}
      <ExtraSettingsModal
        isOpen={isExtraSettingsOpen}
        onClose={() => setIsExtraSettingsOpen(false)}
      />
    </div>
  );
};
