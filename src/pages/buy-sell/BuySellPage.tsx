import React, { useState, useEffect } from 'react';
import { Customer, BuySellTransaction } from '../../types';
import { buySellService } from '../../services/buySellService';
import { customerService } from '../../services/customerService';
import { useStockStore } from '../../store/useStockStore';
import { useUIStore } from '../../store/useUIStore';
import { useMetalStore } from '../../store/useMetalStore';
import {
  calculateBuySellNet,
  convertCashToGold,
  convertGoldToCash,
} from '../../utils/calculations/bullionMath';
import { CustomerSelect } from '../../components/shared/CustomerSelect';
import { DataTable } from '../../components/common/DataTable';
import { ThermalReceiptModal } from '../../components/common/ThermalReceiptModal';
import { ExtraSettingsModal } from '../../components/settings/ExtraSettingsModal';
import { ColumnDef } from '@tanstack/react-table';
import {
  TrendingUp,
  TrendingDown,
  PlusCircle,
  List as ListIcon,
  Save,
  Settings,
  Printer,
  Share2,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
} from 'lucide-react';

export const BuySellPage: React.FC = () => {
  const { summary, fetchStock, updateMetalRates, recordTransactionImpact } = useStockStore();
  const { showToast, openBhavcutModal } = useUIStore();
  const { metalMode } = useMetalStore();
  const isSilver = metalMode === 'SILVER';

  const [activeTab, setActiveTab] = useState<'FORM' | 'LIST'>('FORM');
  const [txnType, setTxnType] = useState<'BUY' | 'SELL'>('BUY');
  const [transactions, setTransactions] = useState<BuySellTransaction[]>([]);

  // Form Fields
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [weight, setWeight] = useState<number>(0.0);
  const [rate, setRate] = useState<number>(isSilver ? 98000 : 144500);
  const [saleRate, setSaleRate] = useState<number>(isSilver ? 98000 : 144500);
  const [purchaseRate, setPurchaseRate] = useState<number>(isSilver ? 95000 : 140000);
  const [discount, setDiscount] = useState<number>(0.0);

  // Settlement splits
  const [cashRecv, setCashRecv] = useState<number>(0);
  const [onlineRecv, setOnlineRecv] = useState<number>(0);
  const [bank2Recv, setBank2Recv] = useState<number>(0);

  // Remarks
  const [remarks, setRemarks] = useState<string>('');

  // Right Column Udhari Section Fields (EXACT MATCH TO REFERENCE / EXCHANGE MODULE)
  const [oldGold, setOldGold] = useState<number>(0.0);
  const [oldCash, setOldCash] = useState<number>(0);
  const [oldSilver, setOldSilver] = useState<number>(0.0);
  const [oldSilverCash, setOldSilverCash] = useState<number>(0);

  const [kchJamaGold, setKchJamaGold] = useState<number>(0.0);
  const [kchJamaCash, setKchJamaCash] = useState<number>(0);

  const [kchUdharGold, setKchUdharGold] = useState<number>(0.0);
  const [kchUdharCash, setKchUdharCash] = useState<number>(0);

  const [jamaGold, setJamaGold] = useState<number>(0.0);
  const [jamaCash, setJamaCash] = useState<number>(0);

  const [udharGold, setUdharGold] = useState<number>(0.0);
  const [udharCash, setUdharCash] = useState<number>(0);

  // Quick Bhavcut Rate & Narration
  const [bhavcutRate, setBhavcutRate] = useState<number>(isSilver ? 95000 : 140000);
  const [narration, setNarration] = useState<string>('');
  const [sampleReceived, setSampleReceived] = useState<boolean>(false);

  // Modals
  const [isExtraSettingsOpen, setIsExtraSettingsOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<BuySellTransaction | null>(null);

  useEffect(() => {
    fetchStock();
    loadTransactions();
    customerService.getAll().then((list) => {
      const defaultCust = list.find((c) => c.customerNo === 100) || list[0] || null;
      if (defaultCust) {
        setSelectedCustomer(defaultCust);
      }
    });
  }, [fetchStock]);

  const loadTransactions = async () => {
    const list = await buySellService.getAll();
    setTransactions(list);
  };

  // Sync Metal Mode & Live Stock Rates
  useEffect(() => {
    if (isSilver) {
      const sBuy = summary.silverStock?.avgRate || 95000;
      const sSell = summary.silverStock?.avgSellRate || 98000;
      setSaleRate(sSell);
      setPurchaseRate(sBuy);
      setBhavcutRate(sBuy);
      setRate(txnType === 'BUY' ? sBuy : sSell);
    } else {
      const gBuy = summary.pureGoldStock?.avgBuyRate || 140000;
      const gSell = summary.pureGoldStock?.avgSellRate || 144500;
      setSaleRate(gSell);
      setPurchaseRate(gBuy);
      setBhavcutRate(gBuy);
      setRate(txnType === 'BUY' ? gBuy : gSell);
    }
  }, [
    isSilver,
    txnType,
    summary.pureGoldStock?.avgBuyRate,
    summary.pureGoldStock?.avgSellRate,
    summary.silverStock?.avgRate,
    summary.silverStock?.avgSellRate,
  ]);

  // Sync Customer Balances to Udhari Section on Customer Selection
  useEffect(() => {
    if (selectedCustomer) {
      setOldGold(selectedCustomer.balance?.gold ?? 0.0);
      setOldCash(selectedCustomer.balance?.cash ?? 0);
      setOldSilver(selectedCustomer.balance?.silver ?? 0.0);
      setOldSilverCash(0);
    }
  }, [selectedCustomer]);

  const { grossCash, netCash } = calculateBuySellNet(weight, rate, discount);
  const totalPaid = (cashRecv || 0) + (onlineRecv || 0) + (bank2Recv || 0);

  // Real-time Udhari Section Final Calculation (EXACT MATHEMATICAL ENGINE AS EXCHANGE MODULE)
  const finalGold = Math.round((oldGold + kchJamaGold - kchUdharGold + jamaGold - udharGold) * 1000) / 1000;
  const finalCashTotal = Math.round((oldCash + kchJamaCash - kchUdharCash + jamaCash - udharCash) * 100) / 100;

  // Actions for Udhari Buttons
  const handleFillKchJama = () => {
    const val = weight > 0 ? weight : 0;
    setKchJamaGold(val);
    showToast(`Kch se Jama(+) filled with ${val.toFixed(3)} gm`, 'success');
  };

  const handleFillKchUdhar = () => {
    const val = weight > 0 ? weight : 0;
    setKchUdharGold(val);
    showToast(`Kch se Udhar(-) filled with ${val.toFixed(3)} gm`, 'info');
  };

  const handleBhavcutCashToGold = () => {
    const rateToUse = bhavcutRate || rate || (isSilver ? 95000 : 140000);
    const cashVal = finalCashTotal !== 0 ? Math.abs(finalCashTotal) : oldCash;
    if (!cashVal || !rateToUse) {
      showToast('Please enter a valid rate and amount to convert', 'error');
      return;
    }
    const convertedG = convertCashToGold(cashVal, rateToUse);
    setJamaGold(convertedG);
    setUdharCash(cashVal);
    showToast(
      `Converted ₹${cashVal.toLocaleString('en-IN')} to ${convertedG.toFixed(3)} gm Gold @ ₹${rateToUse}/10gm!`,
      'success'
    );
  };

  const handleBhavcutGoldToCash = () => {
    const rateToUse = bhavcutRate || rate || (isSilver ? 95000 : 140000);
    const goldVal = finalGold !== 0 ? Math.abs(finalGold) : oldGold;
    if (!goldVal || !rateToUse) {
      showToast('Please enter a valid rate and gold weight to convert', 'error');
      return;
    }
    const convertedC = convertGoldToCash(goldVal, rateToUse);
    setJamaCash(convertedC);
    setUdharGold(goldVal);
    showToast(
      `Converted ${goldVal.toFixed(3)} gm Gold to ₹${convertedC.toLocaleString('en-IN')} @ ₹${rateToUse}/10gm!`,
      'success'
    );
  };

  const handleSave = async (openSlip: boolean = false) => {
    if (!selectedCustomer) {
      showToast('Please select a customer first!', 'error');
      return;
    }

    if (weight <= 0) {
      showToast('Please enter trade weight!', 'error');
      return;
    }

    const newTxn = await buySellService.createTransaction({
      type: txnType,
      source: 'Direct',
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerNo: selectedCustomer.customerNo,
      weight,
      rate,
      grossAmount: grossCash,
      discount,
      netAmount: netCash,
      paidAmount: totalPaid,
      settlement: { cash: cashRecv, onlineRtgs: onlineRecv, selfBank2: bank2Recv },
      udhariAdjusted: true,
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
      narration: narration || remarks,
      remarks,
    });

    // Synchronize rates and inventory impact to stock section
    await updateMetalRates(metalMode, purchaseRate, saleRate);
    await recordTransactionImpact({
      metal: metalMode,
      type: txnType,
      fineWeight: weight,
      rate,
      cashAmount: netCash,
    });

    showToast(
      `Bullion ${txnType} #${newTxn.transactionNo} saved & Stock updated! (स्टॉक अपडेट हो गया)`,
      'success'
    );
    loadTransactions();

    if (openSlip) {
      setSelectedReceipt(newTxn);
    }
  };

  const columns: ColumnDef<BuySellTransaction>[] = [
    {
      accessorKey: 'transactionNo',
      header: 'S.N.',
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
      header: 'C. No / C. Name',
      cell: (info) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-800 text-xs">
            {info.row.original.customerNo}
          </span>
          <span className="font-semibold text-slate-700 text-xs">
            {info.getValue() as string}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'source',
      header: 'Source',
      cell: (info) => (
        <span className="font-semibold text-slate-700 text-xs">
          {info.getValue() as string}
        </span>
      ),
    },
    {
      header: 'Buy Weight',
      cell: ({ row }) => (
        <span className="font-mono text-xs">
          {row.original.type === 'BUY' ? `${row.original.weight.toFixed(3)} gm` : '-'}
        </span>
      ),
    },
    {
      header: 'Purchase Rate',
      cell: ({ row }) => (
        <span className="font-mono text-xs">
          {row.original.type === 'BUY' ? `${row.original.rate.toLocaleString('en-IN')} ₹` : '-'}
        </span>
      ),
    },
    {
      header: 'Paid Amount',
      cell: ({ row }) => (
        <span className="font-mono text-xs">
          {row.original.type === 'BUY' ? `${row.original.netAmount.toLocaleString('en-IN')} ₹` : '-'}
        </span>
      ),
    },
    {
      header: 'Act. Paid',
      cell: ({ row }) => (
        <span className="font-mono text-xs font-bold text-slate-900">
          {row.original.type === 'BUY' ? `${row.original.paidAmount.toLocaleString('en-IN')} ₹` : '-'}
        </span>
      ),
    },
    {
      header: 'Sell Weight',
      cell: ({ row }) => (
        <span className="font-mono text-xs">
          {row.original.type === 'SELL' ? `${row.original.weight.toFixed(3)} gm` : '-'}
        </span>
      ),
    },
    {
      header: 'Selling Rate',
      cell: ({ row }) => (
        <span className="font-mono text-xs">
          {row.original.type === 'SELL' ? `${row.original.rate.toLocaleString('en-IN')} ₹` : '-'}
        </span>
      ),
    },
    {
      header: 'Received Amount',
      cell: ({ row }) => (
        <span className="font-mono text-xs">
          {row.original.type === 'SELL' ? `${row.original.netAmount.toLocaleString('en-IN')} ₹` : '-'}
        </span>
      ),
    },
    {
      header: 'Act. Received',
      cell: ({ row }) => (
        <span className="font-mono text-xs font-bold text-slate-900">
          {row.original.type === 'SELL' ? `${row.original.paidAmount.toLocaleString('en-IN')} ₹` : '-'}
        </span>
      ),
    },
    {
      accessorKey: 'discount',
      header: 'Discount',
      cell: (info) => {
        const d = info.getValue() as number;
        return <span className="text-xs">{d ? `${d.toLocaleString('en-IN')} ₹` : '-'}</span>;
      },
    },
    {
      id: 'udhariSec',
      header: 'Udhari Sec.',
      cell: ({ row }) => (
        <span
          className={`font-black text-sm ${
            row.original.udhariAdjusted ? 'text-blue-600' : 'text-rose-600'
          }`}
        >
          {row.original.udhariAdjusted ? '✓' : '✕'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Action',
      cell: ({ row }) => (
        <button
          onClick={() => setSelectedReceipt(row.original)}
          className="p-1 rounded text-slate-600 hover:text-brand-maroon hover:bg-slate-100 transition-colors cursor-pointer"
          title="Print Voucher"
        >
          <Printer className="h-4 w-4" />
        </button>
      ),
    },
  ];

  // Mock booked weight orders for customer
  const bookedOrders = [
    { sn: 1, bookedWt: 5.0, pendingWt: 5.0, rate: 26132, type: 'Sell', date: '08-10-2026' },
    { sn: 2, bookedWt: 12.0, pendingWt: 12.0, rate: 147000, type: 'Sell', date: '03-11-2026' },
  ];

  return (
    <div className="space-y-4">
      {/* Top Header Rates Bar (Exact Match with Reference Site) */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs gap-3">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-brand-maroon text-brand-gold flex items-center justify-center shrink-0">
            <DollarSign className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black text-slate-800 leading-tight">
              BUY-SELL BULLION (खरीद बिक्री) - {isSilver ? 'SILVER (चाँदी)' : 'GOLD (सोना)'}
            </h1>
            <p className="text-[11px] text-slate-500">
              Direct {isSilver ? 'silver' : 'bullion'} purchase, delivery orders & real-time Udhari Section
            </p>
          </div>
        </div>

        {/* Live Rates Badges */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5 bg-rose-50 border border-rose-200 px-3 py-1 rounded-lg">
            <TrendingDown className="h-3.5 w-3.5 text-rose-600" />
            <span className="text-slate-600 font-semibold">(बेचना) SALE RATE:</span>
            <span className="font-black text-rose-700">₹{saleRate.toLocaleString('en-IN')}</span>
            <span className="text-[10px] text-slate-400">{isSilver ? '₹/kg' : '₹/10gm'}</span>
          </div>

          <div className="flex items-center space-x-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
            <span className="text-slate-600 font-semibold">(खरीदना) PURCHASE RATE:</span>
            <span className="font-black text-emerald-700">₹{purchaseRate.toLocaleString('en-IN')}</span>
            <span className="text-[10px] text-slate-400">{isSilver ? '₹/kg' : '₹/10gm'}</span>
          </div>

          <button
            onClick={openBhavcutModal}
            className="px-2.5 py-1 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 text-xs shadow-xs"
          >
            Bhav Booking
          </button>
        </div>

        <div className="flex rounded-lg bg-slate-200/80 p-0.5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('FORM')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'FORM'
                ? 'bg-brand-maroon text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>New Trade</span>
          </button>
          <button
            onClick={() => setActiveTab('LIST')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'LIST'
                ? 'bg-brand-maroon text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ListIcon className="h-3.5 w-3.5" />
            <span>Past Records ({transactions.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'FORM' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Main Trade Terminal (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
            <div className="grid grid-cols-2 text-center text-xs font-black border-b border-slate-200">
              <button
                onClick={() => setTxnType('BUY')}
                className={`py-3 transition-colors ${
                  txnType === 'BUY'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                (खरीदना) BUY BULLION
              </button>
              <button
                onClick={() => setTxnType('SELL')}
                className={`py-3 transition-colors ${
                  txnType === 'SELL'
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                (बेचना) SELL BULLION
              </button>
            </div>

            <div className="p-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer No / Name (ग्राहक चयन) <span className="text-red-500">*</span>
                </label>
                <CustomerSelect
                  value={selectedCustomer?.id || ''}
                  onChange={(c) => setSelectedCustomer(c)}
                />
              </div>

              {/* Booked Weight Table (From Reference Image) */}
              {selectedCustomer && (
                <div className="border border-slate-200 rounded-lg overflow-hidden text-[11px]">
                  <table className="w-full text-left">
                    <thead className="bg-slate-800 text-white text-[10px] uppercase font-bold">
                      <tr>
                        <th className="p-1.5">SN</th>
                        <th className="p-1.5">Booked Wt</th>
                        <th className="p-1.5">Pending Wt</th>
                        <th className="p-1.5">Rate</th>
                        <th className="p-1.5">Type</th>
                        <th className="p-1.5">Action</th>
                        <th className="p-1.5">Remark</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {bookedOrders.map((b) => (
                        <tr key={b.sn} className="hover:bg-slate-50">
                          <td className="p-1.5 font-bold">{b.sn}</td>
                          <td className="p-1.5 font-mono">{b.bookedWt.toFixed(3)} gm</td>
                          <td className="p-1.5 font-mono font-bold text-rose-700">{b.pendingWt.toFixed(3)} gm</td>
                          <td className="p-1.5 font-bold">₹{b.rate.toLocaleString('en-IN')}</td>
                          <td className="p-1.5 font-semibold text-rose-600">{b.type}</td>
                          <td className="p-1.5">
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800">
                              Delivered
                            </span>
                          </td>
                          <td className="p-1.5 text-slate-500 text-[10px]">/{b.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Weights and Rates Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {txnType === 'BUY' ? '(खरीदना) Buy Weight (gm)' : '(बेचना) Sell Weight (gm)'}
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={weight || ''}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    placeholder="0.000"
                    className="w-full px-3 py-1.5 font-bold rounded border border-slate-300 focus:outline-none focus:border-brand-maroon"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {txnType === 'BUY'
                      ? isSilver
                        ? '(खरीदना) Buy Rate (₹/kg)'
                        : '(खरीदना) Buy Rate (₹/10gm)'
                      : isSilver
                      ? '(बेचना) Sell Rate (₹/kg)'
                      : '(बेचना) Sell Rate (₹/10gm)'}
                  </label>
                  <input
                    type="number"
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="w-full px-3 py-1.5 font-bold rounded border border-slate-300 focus:outline-none focus:border-brand-maroon"
                  />
                </div>
              </div>

              {/* Cash Value Banner */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-brand-maroon text-white font-bold text-xs shadow-xs">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-amber-300 block">
                    (कैश) Total Value
                  </span>
                  <span className="text-xl font-black">
                    ₹ {netCash.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="text-right text-[11px] text-slate-200">
                  <div>Weight: {weight.toFixed(3)} gm</div>
                  <div>Rate: ₹{rate.toLocaleString('en-IN')}/{isSilver ? 'kg' : '10g'}</div>
                </div>
              </div>

              {/* Payment Settlement Splits */}
              <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Payment Settlement (भुगतान विवरण)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      {txnType === 'BUY' ? 'Cash Given (₹)' : 'Recieved Cash (रोकड़ लिया ₹)'}
                    </label>
                    <input
                      type="number"
                      value={cashRecv || ''}
                      onChange={(e) => setCashRecv(Number(e.target.value))}
                      placeholder="0.00"
                      className="w-full px-2.5 py-1 text-xs font-bold rounded border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Online Recieved RTGS (₹)
                    </label>
                    <input
                      type="number"
                      value={onlineRecv || ''}
                      onChange={(e) => setOnlineRecv(Number(e.target.value))}
                      placeholder="0.00"
                      className="w-full px-2.5 py-1 text-xs font-bold rounded border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Self Bank 2 Recieved RTGS (₹)
                    </label>
                    <input
                      type="number"
                      value={bank2Recv || ''}
                      onChange={(e) => setBank2Recv(Number(e.target.value))}
                      placeholder="0.00"
                      className="w-full px-2.5 py-1 text-xs font-bold rounded border border-slate-300"
                    />
                  </div>
                </div>
              </div>

              {/* Remarks */}
              <div>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Write Narration / Trade Remark (विवरण / टिप्पणी)..."
                  className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-none focus:border-brand-maroon"
                />
              </div>

              {/* Action Buttons Left Card: Execute Trade + WhatsApp & Thermal Slip */}
              <div className="pt-2 border-t flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleSave(false)}
                  className="flex items-center space-x-1.5 px-5 py-2 bg-brand-maroon text-white font-bold text-xs rounded-lg hover:bg-brand-maroon-dark transition-all shadow-xs cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  <span>Execute Trade (सुरक्षित करें)</span>
                </button>

                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      const mobile = selectedCustomer?.mobile || '9645808999';
                      const text = encodeURIComponent(
                        `*Bullion ${txnType} Receipt - ${selectedCustomer?.name}*\nWeight: ${weight}g\nRate: ₹${rate}\nNet Cash: ₹${netCash}\nPaid: ₹${totalPaid}\nDeligo Technologies ERP`
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
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT CARD: Exact Reference Udhari Section (5 Cols)       */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 bg-white rounded-3xl border-2 border-amber-300 p-4 sm:p-5 shadow-sm space-y-3.5">
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
                  title="Populate from Trade Weight"
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
                  title="Populate from Trade Weight"
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

            {/* Row 8: Quick Bhavcut Conversion Controls (< rate >) */}
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
                  {isSilver ? '₹/1kg' : '₹/10gm'}
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
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4">
          <DataTable data={transactions} columns={columns} searchPlaceholder="Search by customer, trade ID..." />
        </div>
      )}

      {/* 3-Inch Thermal Receipt Modal */}
      <ThermalReceiptModal
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        transaction={selectedReceipt}
      />

      {/* Extra Settings Modal */}
      <ExtraSettingsModal
        isOpen={isExtraSettingsOpen}
        onClose={() => setIsExtraSettingsOpen(false)}
      />
    </div>
  );
};
