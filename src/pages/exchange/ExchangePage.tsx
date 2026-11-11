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
  const [weight, setWeight] = useState<number>(10.0);
  const [touch, setTouch] = useState<number>(91.6);
  const [sample, setSample] = useState<ExchangeTransaction['sample']>('lagdi');
  const [extraGold, setExtraGold] = useState<number>(0.0);
  const [settledGold, setSettledGold] = useState<number>(0.0);
  const [rate, setRate] = useState<number>(summary.marketRates.gold24K || 75500);
  const [charges, setCharges] = useState<number>(0.0);
  const [physicalCash, setPhysicalCash] = useState<number>(0.0);
  const [onlineRtgs, setOnlineRtgs] = useState<number>(0.0);
  const [selfBank2, setSelfBank2] = useState<number>(0.0);
  const [narration, setNarration] = useState<string>('');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    const list = await exchangeService.getAll();
    setTransactions(list);
  };

  // Real-time calculations
  const fineGold = calculateFineGold(weight, touch);
  const afterFine = calculateAfterFine(fineGold, extraGold);
  const diffGold = calculateDiffGold(afterFine, settledGold);
  const diffAmount = calculateDiffAmount(diffGold, rate);
  const finalCash = calculateFinalCash(diffAmount, charges);

  // Udhari projections
  const oldGoldBal = selectedCustomer?.balance.gold || 0;
  const oldCashBal = selectedCustomer?.balance.cash || 0;
  const goldDelta = txnType === 'BUY' ? diffGold : -diffGold;
  const cashDelta = txnType === 'BUY' ? finalCash : -finalCash;
  const newGoldBal = Math.round((oldGoldBal + goldDelta) * 1000) / 1000;
  const newCashBal = Math.round((oldCashBal + cashDelta) * 100) / 100;

  const handleSave = async (openSlip: boolean = false) => {
    if (!selectedCustomer) {
      showToast('Please select a customer first!', 'error');
      return;
    }

    const newTxn = await exchangeService.createTransaction({
      type: txnType,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerNo: selectedCustomer.customerNo,
      weight,
      touch,
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
      udhariBefore: { gold: oldGoldBal, cash: oldCashBal },
      udhariAfter: { gold: newGoldBal, cash: newCashBal },
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
        <div className="flex flex-col">
          <span className="font-semibold text-slate-800">{info.getValue() as string}</span>
          <span className="text-[10px] text-slate-400">
            #{info.row.original.customerNo}
          </span>
        </div>
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
      header: 'Weight (g)',
      cell: (info) => (
        <span className="font-semibold">{(info.getValue() as number).toFixed(3)}</span>
      ),
    },
    {
      accessorKey: 'touch',
      header: 'Touch %',
      cell: (info) => <span>{(info.getValue() as number).toFixed(2)}%</span>,
    },
    {
      accessorKey: 'fineGold',
      header: 'Fine Gold (g)',
      cell: (info) => (
        <span className="font-bold text-amber-700">
          {(info.getValue() as number).toFixed(3)}
        </span>
      ),
    },
    {
      accessorKey: 'diffGold',
      header: 'Diff Gold (g)',
      cell: (info) => {
        const val = info.getValue() as number;
        return (
          <span className={`font-bold ${val >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {val >= 0 ? '+' : ''}
            {val.toFixed(3)}
          </span>
        );
      },
    },
    {
      accessorKey: 'finalCash',
      header: 'Final Amt (₹)',
      cell: (info) => (
        <span className="font-bold text-slate-900">
          ₹{(info.getValue() as number).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setSelectedReceipt(info.row.original)}
            className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
            title="Print Thermal Slip"
          >
            <Printer className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Top Page Header & View Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-b pb-3 gap-2">
        <div className="flex items-center space-x-2">
          <div className="h-9 w-9 rounded-lg bg-brand-maroon text-brand-gold flex items-center justify-center">
            <ArrowRightLeft className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              EXCHANGE POS (बदला / पलटा)
            </h1>
            <p className="text-xs text-slate-500">
              High-speed gold purity exchange, allowance deduction & live settlement
            </p>
          </div>
        </div>

        <div className="flex rounded-lg bg-slate-200/80 p-0.5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('POS')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'POS' ? 'bg-brand-maroon text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>POS Terminal</span>
          </button>
          <button
            onClick={() => setActiveTab('LIST')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'LIST' ? 'bg-brand-maroon text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <List className="h-3.5 w-3.5" />
            <span>Past Records ({transactions.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'POS' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Transaction Form (2 Columns) */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
            {/* Buy / Sell Tabs */}
            <div className="flex border-b bg-slate-50">
              <button
                onClick={() => setTxnType('BUY')}
                className={`flex-1 py-2.5 text-center text-xs font-bold transition-all border-b-2 ${
                  txnType === 'BUY'
                    ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50'
                    : 'border-transparent text-slate-500 hover:bg-slate-100'
                }`}
              >
                (खरीदना) BUY GOLD
              </button>
              <button
                onClick={() => setTxnType('SELL')}
                className={`flex-1 py-2.5 text-center text-xs font-bold transition-all border-b-2 ${
                  txnType === 'SELL'
                    ? 'border-brand-maroon text-brand-maroon bg-rose-50/50'
                    : 'border-transparent text-slate-500 hover:bg-slate-100'
                }`}
              >
                (बेचना) SELL GOLD
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Customer Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer / Shop Name (ग्राहक चयन) <span className="text-red-500">*</span>
                </label>
                <CustomerSelect
                  value={selectedCustomer?.id || ''}
                  onChange={(c) => setSelectedCustomer(c)}
                />
              </div>

              {/* Physical Weight & Touch Purity Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gross Weight (gm)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs font-bold rounded border border-slate-300 focus:border-brand-maroon focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Touch Purity (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={touch}
                    onChange={(e) => setTouch(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs font-bold rounded border border-slate-300 focus:border-brand-maroon focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sample Type (नमूना)
                  </label>
                  <select
                    value={sample}
                    onChange={(e) => setSample(e.target.value as any)}
                    className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white focus:outline-none"
                  >
                    <option value="lagdi">Lagdi (लगड़ी)</option>
                    <option value="Rava">Rava (रवा)</option>
                    <option value="99.9">99.9 Pure</option>
                    <option value="Dhali">Dhali (ढाली)</option>
                    <option value="Depa">Depa</option>
                    <option value="Zevar">Old Zevar (जेवर)</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              </div>

              {/* Calculated Pure Values Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-lg bg-amber-50/60 border border-amber-200 text-xs">
                <div>
                  <span className="text-[10px] text-amber-800 font-semibold block uppercase">
                    Fine Gold
                  </span>
                  <span className="text-base font-extrabold text-amber-900">
                    {fineGold.toFixed(3)} g
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
                    className="w-20 px-2 py-0.5 text-xs font-bold rounded border border-amber-300 bg-white"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-amber-800 font-semibold block uppercase">
                    After Fine
                  </span>
                  <span className="text-base font-extrabold text-brand-maroon">
                    {afterFine.toFixed(3)} g
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-amber-800 font-semibold block uppercase">
                    Settled Gold (gm)
                  </span>
                  <input
                    type="number"
                    step="0.001"
                    value={settledGold}
                    onChange={(e) => setSettledGold(Number(e.target.value))}
                    placeholder="Physical g"
                    className="w-20 px-2 py-0.5 text-xs font-bold rounded border border-amber-300 bg-white"
                  />
                </div>
              </div>

              {/* Rate & Financial Calculations */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gold Rate (₹ / 10gm)
                  </label>
                  <input
                    type="number"
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs font-semibold rounded border border-slate-300 focus:border-brand-maroon focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Diff Gold (Remaining)
                  </label>
                  <div
                    className={`px-3 py-1.5 text-xs font-bold rounded border ${
                      diffGold >= 0 ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                    }`}
                  >
                    {diffGold >= 0 ? '+' : ''}
                    {diffGold.toFixed(3)} gm
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Labor / Charges (₹)
                  </label>
                  <input
                    type="number"
                    value={charges}
                    onChange={(e) => setCharges(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs font-semibold rounded border border-slate-300 focus:border-brand-maroon focus:outline-none"
                  />
                </div>
              </div>

              {/* Payment Splits */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Physical Cash (रोकड़ ₹)
                  </label>
                  <input
                    type="number"
                    value={physicalCash}
                    onChange={(e) => setPhysicalCash(Number(e.target.value))}
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

              {/* Narration */}
              <div>
                <input
                  type="text"
                  value={narration}
                  onChange={(e) => setNarration(e.target.value)}
                  placeholder="Narration / Transaction remark (optional)..."
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
                  <span>Save & Print 3-Inch Slip</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Side: Live Transaction Summary & Udhari Balances */}
          <div className="space-y-4">
            {/* Final Cash Card */}
            <div className="bg-linear-to-br from-brand-maroon to-slate-900 rounded-xl p-4 text-white shadow-md space-y-3">
              <span className="text-[11px] font-semibold text-brand-gold uppercase tracking-wider block">
                Net Final Settlement Amount
              </span>
              <div className="text-3xl font-black">
                ₹ {finalCash.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-slate-300 space-y-1 border-t border-white/20 pt-2">
                <div className="flex justify-between">
                  <span>Diff Gold:</span>
                  <span className="font-bold text-white">{diffGold.toFixed(3)} gm</span>
                </div>
                <div className="flex justify-between">
                  <span>Diff Amount:</span>
                  <span>₹ {diffAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Charges:</span>
                  <span>₹ {charges.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Udhari Running Balance Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800 border-b pb-2">
                <Layers className="h-4 w-4 text-brand-maroon" />
                <span>Customer Udhari Ledger (खाता बही)</span>
              </div>

              {selectedCustomer ? (
                <div className="space-y-2 text-xs">
                  <div className="font-semibold text-slate-700">
                    {selectedCustomer.name} (#{selectedCustomer.customerNo})
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 rounded border border-slate-200 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Previous Gold:</span>
                      <span className="font-bold text-slate-900">{oldGoldBal.toFixed(3)} g</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">NEW GOLD BAL:</span>
                      <span
                        className={`font-bold ${
                          newGoldBal >= 0 ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {newGoldBal >= 0 ? '+' : ''}
                        {newGoldBal.toFixed(3)} g
                      </span>
                    </div>
                    <div className="pt-1 border-t">
                      <span className="text-slate-500 block">Previous Cash:</span>
                      <span className="font-bold text-slate-900">
                        ₹ {oldCashBal.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="pt-1 border-t">
                      <span className="text-slate-500 block">NEW CASH BAL:</span>
                      <span
                        className={`font-bold ${
                          newCashBal >= 0 ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        ₹ {newCashBal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">
                  Select a customer to view previous and projected running balance.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Past Records View */
        <DataTable
          columns={columns}
          data={transactions}
          searchPlaceholder="Search exchange records by name, ID, or weight..."
          exportFileName="exchange_transactions.csv"
          renderFooter={(data) => {
            const totalWeight = data.reduce((acc, curr) => acc + curr.weight, 0);
            const totalFine = data.reduce((acc, curr) => acc + curr.fineGold, 0);
            const totalCash = data.reduce((acc, curr) => acc + curr.finalCash, 0);
            return (
              <tr>
                <td colSpan={4} className="px-3 py-2 text-slate-900 font-bold">
                  TOTALS ({data.length} Transactions)
                </td>
                <td className="px-3 py-2 font-bold">{totalWeight.toFixed(3)} g</td>
                <td></td>
                <td className="px-3 py-2 font-bold text-amber-800">{totalFine.toFixed(3)} g</td>
                <td></td>
                <td className="px-3 py-2 font-bold text-slate-900">
                  ₹ {totalCash.toLocaleString('en-IN')}
                </td>
                <td></td>
              </tr>
            );
          }}
        />
      )}

      {/* Thermal Receipt Modal */}
      <ThermalReceiptModal
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        transaction={selectedReceipt}
      />
    </div>
  );
};

