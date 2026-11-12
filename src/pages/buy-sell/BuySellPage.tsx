import React, { useState, useEffect } from 'react';
import { Customer, BuySellTransaction } from '../../types';
import { buySellService } from '../../services/buySellService';
import { useStockStore } from '../../store/useStockStore';
import { useUIStore } from '../../store/useUIStore';
import {
  calculateBuySellNet,
  convertCashToGold,
  convertGoldToCash,
} from '../../utils/calculations/bullionMath';
import { CustomerSelect } from '../../components/shared/CustomerSelect';
import { DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/common/Badge';
import { ColumnDef } from '@tanstack/react-table';
import {
  TrendingUp,
  TrendingDown,
  PlusCircle,
  List,
  Save,
  Printer,
  Share2,
  DollarSign,
  Layers,
  Calculator,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Calendar,
} from 'lucide-react';

export const BuySellPage: React.FC = () => {
  const { summary } = useStockStore();
  const { showToast, openBhavcutModal } = useUIStore();

  const [activeTab, setActiveTab] = useState<'FORM' | 'LIST'>('FORM');
  const [txnType, setTxnType] = useState<'BUY' | 'SELL'>('BUY');
  const [transactions, setTransactions] = useState<BuySellTransaction[]>([]);

  // Form Fields
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [weight, setWeight] = useState<number>(0.0);
  const [rate, setRate] = useState<number>(144500);
  const [saleRate, setSaleRate] = useState<number>(144500);
  const [purchaseRate, setPurchaseRate] = useState<number>(140000);
  const [discount, setDiscount] = useState<number>(0.0);

  // Settlement splits
  const [cashRecv, setCashRecv] = useState<number>(0);
  const [onlineRecv, setOnlineRecv] = useState<number>(0);
  const [bank2Recv, setBank2Recv] = useState<number>(0);

  // Inline Bhavcut
  const [bhavcutAmt, setBhavcutAmt] = useState<number>(0);
  const [bhavcutGold, setBhavcutGold] = useState<number>(0);

  const [remarks, setRemarks] = useState<string>('');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    const list = await buySellService.getAll();
    setTransactions(list);
  };

  const { grossCash, netCash } = calculateBuySellNet(weight, rate, discount);

  // Udhari projections
  const oldGoldBal = selectedCustomer?.balance.gold || 0;
  const oldCashBal = selectedCustomer?.balance.cash || 0;
  const oldSilverBal = selectedCustomer?.balance.silver ?? -413.043;

  const totalPaid = (cashRecv || 0) + (onlineRecv || 0) + (bank2Recv || 0);

  // Gold delta: BUY means customer sold gold to shop (+ gold to customer's credit / or + to shop)
  const newGoldBal =
    txnType === 'BUY'
      ? Math.round((oldGoldBal + weight) * 1000) / 1000
      : Math.round((oldGoldBal - weight) * 1000) / 1000;

  // Cash delta
  const unpaidCash = netCash - totalPaid;
  const newCashBal =
    txnType === 'BUY'
      ? Math.round((oldCashBal + unpaidCash) * 100) / 100
      : Math.round((oldCashBal - unpaidCash) * 100) / 100;

  const handleInlineBhavcutAmtToGold = () => {
    if (!bhavcutAmt || !rate) return;
    const g = convertCashToGold(bhavcutAmt, rate);
    setBhavcutGold(g);
    showToast(`Converted ₹${bhavcutAmt.toLocaleString('en-IN')} to ${g.toFixed(3)} gm Gold`);
  };

  const handleInlineBhavcutGoldToAmt = () => {
    if (!bhavcutGold || !rate) return;
    const c = convertGoldToCash(bhavcutGold, rate);
    setBhavcutAmt(c);
    showToast(`Converted ${bhavcutGold.toFixed(3)} gm Gold to ₹${c.toLocaleString('en-IN')}`);
  };

  const handleSave = async () => {
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
      remarks,
    });

    showToast(`Bullion ${txnType} transaction #${newTxn.transactionNo} created!`);
    loadTransactions();
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
      cell: () => (
        <button
          onClick={() => window.print()}
          className="p-1 rounded text-slate-600 hover:text-brand-maroon hover:bg-slate-100 transition-colors"
          title="Print Voucher"
        >
          <Printer className="h-4 w-4" />
        </button>
      ),
    },
  ];

  // Mock booked weight orders for customer XYZ / Rajesh
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
              BUY-SELL BULLION (खरीद बिक्री)
            </h1>
            <p className="text-[11px] text-slate-500">
              Direct bullion purchase, delivery orders & real-time Udhari Section
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
            <List className="h-3.5 w-3.5" />
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
                    {txnType === 'BUY' ? '(खरीदना) Buy Rate (₹/10gm)' : '(बेचना) Sell Rate (₹/10gm)'}
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
                  <div>Rate: ₹{rate.toLocaleString('en-IN')}/10g</div>
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

              <div className="pt-2 border-t flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex items-center space-x-1.5 px-5 py-2 bg-brand-maroon text-white font-bold text-xs rounded-lg hover:bg-brand-maroon-dark transition-all shadow-xs"
                >
                  <Save className="h-4 w-4" />
                  <span>Execute Trade (सुरक्षित करें)</span>
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
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      value={bhavcutAmt || ''}
                      onChange={(e) => setBhavcutAmt(Number(e.target.value))}
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
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  {bhavcutGold > 0 && (
                    <div className="text-[11px] font-bold text-amber-900">
                      = {bhavcutGold.toFixed(3)} gm Pure Gold
                    </div>
                  )}
                </div>

                {/* Print and WhatsApp Actions */}
                <div className="flex items-center space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="flex-1 flex items-center justify-center space-x-1 py-2 bg-emerald-700 text-white font-bold text-xs rounded-lg hover:bg-emerald-800 transition-all shadow-xs"
                  >
                    <Printer className="h-4 w-4" />
                    <span>Print Slip</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Shared slip via WhatsApp!')}
                    className="flex-1 flex items-center justify-center space-x-1 py-2 bg-emerald-600 text-white font-bold text-xs rounded-lg hover:bg-emerald-700 transition-all shadow-xs"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4">
          <DataTable data={transactions} columns={columns} searchPlaceholder="Search by customer, trade ID..." />
        </div>
      )}
    </div>
  );
};
