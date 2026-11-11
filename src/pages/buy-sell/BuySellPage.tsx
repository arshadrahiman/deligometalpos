import React, { useState, useEffect } from 'react';
import { Customer, BuySellTransaction } from '../../types';
import { buySellService } from '../../services/buySellService';
import { useStockStore } from '../../store/useStockStore';
import { useUIStore } from '../../store/useUIStore';
import { calculateBuySellNet } from '../../utils/calculations/bullionMath';
import { CustomerSelect } from '../../components/shared/CustomerSelect';
import { DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/common/Badge';
import { ColumnDef } from '@tanstack/react-table';
import {
  TrendingUp,
  PlusCircle,
  List,
  Save,
  Printer,
  Share2,
  DollarSign,
} from 'lucide-react';

export const BuySellPage: React.FC = () => {
  const { summary } = useStockStore();
  const { showToast } = useUIStore();

  const [activeTab, setActiveTab] = useState<'FORM' | 'LIST'>('FORM');
  const [txnType, setTxnType] = useState<'BUY' | 'SELL'>('BUY');
  const [transactions, setTransactions] = useState<BuySellTransaction[]>([]);

  // Form Fields
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [weight, setWeight] = useState<number>(20.0);
  const [rate, setRate] = useState<number>(summary.marketRates.gold24K || 75500);
  const [discount, setDiscount] = useState<number>(0.0);
  const [cash, setCash] = useState<number>(0.0);
  const [onlineRtgs, setOnlineRtgs] = useState<number>(0.0);
  const [selfBank2, setSelfBank2] = useState<number>(0.0);
  const [remarks, setRemarks] = useState<string>('');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    const list = await buySellService.getAll();
    setTransactions(list);
  };

  const { grossCash, netCash } = calculateBuySellNet(weight, rate, discount);

  const handleSave = async () => {
    if (!selectedCustomer) {
      showToast('Please select a customer first!', 'error');
      return;
    }

    const paidAmount = (cash || 0) + (onlineRtgs || 0) + (selfBank2 || 0);

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
      paidAmount,
      settlement: { cash, onlineRtgs, selfBank2 },
      udhariAdjusted: false,
      remarks,
    });

    showToast(`Bullion ${txnType} transaction #${newTxn.transactionNo} created!`);
    loadTransactions();
  };

  const columns: ColumnDef<BuySellTransaction>[] = [
    {
      accessorKey: 'transactionNo',
      header: 'T. No',
      cell: (info) => <span className="font-bold">#{info.getValue() as number}</span>,
    },
    {
      accessorKey: 'dateTime',
      header: 'Date / Time',
      cell: (info) => <span className="text-slate-500">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'customerName',
      header: 'Customer',
      cell: (info) => (
        <span className="font-semibold text-slate-800">{info.getValue() as string}</span>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: (info) => (
        <Badge variant={info.getValue() === 'BUY' ? 'success' : 'danger'}>
          {info.getValue() as string}
        </Badge>
      ),
    },
    {
      accessorKey: 'weight',
      header: 'Weight (gm)',
      cell: (info) => (
        <span className="font-semibold">{(info.getValue() as number).toFixed(3)}</span>
      ),
    },
    {
      accessorKey: 'rate',
      header: 'Rate (₹/10g)',
      cell: (info) => (
        <span>₹{(info.getValue() as number).toLocaleString('en-IN')}</span>
      ),
    },
    {
      accessorKey: 'netAmount',
      header: 'Net Total (₹)',
      cell: (info) => (
        <span className="font-bold text-slate-900">
          ₹{(info.getValue() as number).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      accessorKey: 'paidAmount',
      header: 'Settled (₹)',
      cell: (info) => (
        <span className="font-semibold text-emerald-700">
          ₹{(info.getValue() as number).toLocaleString('en-IN')}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-b pb-3 gap-2">
        <div className="flex items-center space-x-2">
          <div className="h-9 w-9 rounded-lg bg-brand-maroon text-brand-gold flex items-center justify-center">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              BUY - SELL (खरीद बिक्री)
            </h1>
            <p className="text-xs text-slate-500">
              Direct wholesale bullion trading, rate bookings, and order settlements
            </p>
          </div>
        </div>

        <div className="flex rounded-lg bg-slate-200/80 p-0.5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('FORM')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'FORM' ? 'bg-brand-maroon text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Trading Terminal</span>
          </button>
          <button
            onClick={() => setActiveTab('LIST')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'LIST' ? 'bg-brand-maroon text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <List className="h-3.5 w-3.5" />
            <span>Current Log ({transactions.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'FORM' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Form */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
            <div className="flex border-b bg-slate-50">
              <button
                onClick={() => setTxnType('BUY')}
                className={`flex-1 py-2.5 text-center text-xs font-bold transition-all border-b-2 ${
                  txnType === 'BUY'
                    ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50'
                    : 'border-transparent text-slate-500 hover:bg-slate-100'
                }`}
              >
                (खरीदना) BUY BULLION
              </button>
              <button
                onClick={() => setTxnType('SELL')}
                className={`flex-1 py-2.5 text-center text-xs font-bold transition-all border-b-2 ${
                  txnType === 'SELL'
                    ? 'border-brand-maroon text-brand-maroon bg-rose-50/50'
                    : 'border-transparent text-slate-500 hover:bg-slate-100'
                }`}
              >
                (बेचना) SELL BULLION
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer / Trader Name <span className="text-red-500">*</span>
                </label>
                <CustomerSelect
                  value={selectedCustomer?.id || ''}
                  onChange={(c) => setSelectedCustomer(c)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Trade Weight (gm)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs font-bold rounded border border-slate-300 focus:outline-none focus:border-brand-maroon"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Rate (₹ / 10gm)
                  </label>
                  <input
                    type="number"
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs font-bold rounded border border-slate-300 focus:outline-none focus:border-brand-maroon"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Discount / Rebate (₹)
                  </label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-none focus:border-brand-maroon"
                  />
                </div>
              </div>

              {/* Payment Settlement Splits */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Cash Paid / Recv (₹)
                  </label>
                  <input
                    type="number"
                    value={cash}
                    onChange={(e) => setCash(Number(e.target.value))}
                    className="w-full px-2.5 py-1 text-xs rounded border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Online / RTGS (₹)
                  </label>
                  <input
                    type="number"
                    value={onlineRtgs}
                    onChange={(e) => setOnlineRtgs(Number(e.target.value))}
                    className="w-full px-2.5 py-1 text-xs rounded border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Self Bank 2 (₹)
                  </label>
                  <input
                    type="number"
                    value={selfBank2}
                    onChange={(e) => setSelfBank2(Number(e.target.value))}
                    className="w-full px-2.5 py-1 text-xs rounded border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Trading remarks (bar serial number, purity mark, etc.)..."
                  className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-none focus:border-brand-maroon"
                />
              </div>

              <div className="pt-2 border-t">
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex items-center space-x-1.5 px-5 py-2 bg-brand-maroon text-white font-bold text-xs rounded-lg hover:bg-brand-maroon-dark transition-all shadow-xs"
                >
                  <Save className="h-4 w-4" />
                  <span>Execute Transaction (सुरक्षित करें)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Card: Summary */}
          <div className="bg-linear-to-br from-brand-nav to-slate-900 rounded-xl p-5 text-white shadow-md space-y-4 h-fit">
            <span className="text-[11px] font-semibold text-brand-gold uppercase tracking-wider block">
              Net Order Valuation
            </span>
            <div className="text-3xl font-black">
              ₹ {netCash.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <div className="space-y-1.5 text-xs text-slate-300 border-t border-white/20 pt-3">
              <div className="flex justify-between">
                <span>Gross Total:</span>
                <span>₹ {grossCash.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount Applied:</span>
                <span className="text-emerald-400">-₹ {discount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-bold text-white border-t border-white/10 pt-1">
                <span>Total Settled:</span>
                <span>₹ {((cash || 0) + (onlineRtgs || 0) + (selfBank2 || 0)).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={transactions}
          searchPlaceholder="Search buy-sell transactions..."
          exportFileName="buysell_transactions.csv"
        />
      )}
    </div>
  );
};

