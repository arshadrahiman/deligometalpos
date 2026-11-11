import React, { useState } from 'react';
import { Customer, JewelleryOrder } from '../../types';
import { calculateJewelleryOrder } from '../../utils/calculations/jewelleryMath';
import { CustomerSelect } from '../../components/shared/CustomerSelect';
import { DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/common/Badge';
import { useUIStore } from '../../store/useUIStore';
import { useStockStore } from '../../store/useStockStore';
import { ColumnDef } from '@tanstack/react-table';
import { Gem, PlusCircle, Save, Scale } from 'lucide-react';

export const JewelleryPage: React.FC = () => {
  const { summary } = useStockStore();
  const { showToast } = useUIStore();

  const [orders, setOrders] = useState<JewelleryOrder[]>([
    {
      id: 'JW-101',
      orderNo: 101,
      customerId: 'CUST-101',
      customerName: 'Rajesh Swarnakar',
      itemDescription: '22K Bridal Haar with Pearls',
      pieces: 1,
      weights: { gross: 45.5, less: 3.5, net: 42.0 },
      purity: {
        touch: 91.6,
        fineGold: 38.472,
        wastagePercent: 3.5,
        wastageWeight: 1.47,
        totalPureRequired: 39.942,
      },
      valuation: {
        rate: 75500,
        labourRatePerGram: 550,
        labourAmount: 23100,
        totalOrderAmount: 324662,
      },
      settlement: { goldReceived: 40.0, cashReceived: 23100, onlineReceived: 0 },
      status: 'Order Received',
      karigarName: 'Anil Karigar',
      dateTime: '2026-11-11 12:00:00',
    },
  ]);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [itemDescription, setItemDescription] = useState('22K Gold Bangle Set');
  const [pieces, setPieces] = useState<number>(2);
  const [grossWeight, setGrossWeight] = useState<number>(25.5);
  const [lessWeight, setLessWeight] = useState<number>(1.5);
  const [purityPercent, setPurityPercent] = useState<number>(91.6);
  const [wastagePercent, setWastagePercent] = useState<number>(3.0);
  const [labourRate, setLabourRate] = useState<number>(450.0);
  const [karigarName, setKarigarName] = useState('Anil Karigar');

  const { netWeight, fineGold, wastageWeight, totalPureDue, labourAmount } =
    calculateJewelleryOrder(grossWeight, lessWeight, purityPercent, wastagePercent, labourRate);

  const goldValue = Math.round((totalPureDue * summary.marketRates.gold24K) / 10);
  const totalOrderAmount = labourAmount + goldValue;

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) {
      showToast('Please select a customer first!', 'error');
      return;
    }

    const nextNo = orders.length > 0 ? Math.max(...orders.map((o) => o.orderNo)) + 1 : 101;
    const newOrder: JewelleryOrder = {
      id: `JW-${nextNo}`,
      orderNo: nextNo,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      itemDescription,
      pieces,
      weights: { gross: grossWeight, less: lessWeight, net: netWeight },
      purity: {
        touch: purityPercent,
        fineGold,
        wastagePercent,
        wastageWeight,
        totalPureRequired: totalPureDue,
      },
      valuation: {
        rate: summary.marketRates.gold24K,
        labourRatePerGram: labourRate,
        labourAmount,
        totalOrderAmount,
      },
      settlement: { goldReceived: 0, cashReceived: 0, onlineReceived: 0 },
      status: 'Order Received',
      karigarName,
      dateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    setOrders([newOrder, ...orders]);
    showToast(`Jewellery Order #${nextNo} created!`);
  };

  const columns: ColumnDef<JewelleryOrder>[] = [
    {
      accessorKey: 'orderNo',
      header: 'Order #',
      cell: (info) => <span className="font-bold">#{info.getValue() as number}</span>,
    },
    {
      accessorKey: 'customerName',
      header: 'Customer',
      cell: (info) => <span className="font-semibold text-slate-800">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'itemDescription',
      header: 'Item',
      cell: (info) => <span className="text-slate-700 font-medium">{info.getValue() as string}</span>,
    },
    {
      header: 'Net Wt (gm)',
      cell: (info) => <span className="font-bold">{info.row.original.weights.net.toFixed(3)}g</span>,
    },
    {
      header: 'Pure Req (gm)',
      cell: (info) => (
        <span className="font-bold text-amber-800">
          {info.row.original.purity.totalPureRequired.toFixed(3)}g
        </span>
      ),
    },
    {
      header: 'Labour (₹)',
      cell: (info) => (
        <span className="font-semibold text-slate-800">
          ₹{info.row.original.valuation.labourAmount.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      header: 'Total Value (₹)',
      cell: (info) => (
        <span className="font-extrabold text-slate-900">
          ₹{info.row.original.valuation.totalOrderAmount.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (info) => <Badge variant="gold">{info.getValue() as string}</Badge>,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-2 border-b pb-3">
        <div className="h-9 w-9 rounded-lg bg-brand-maroon text-brand-gold flex items-center justify-center">
          <Gem className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
            JEWELLERY MANUFACTURING (जेवर निर्माण व ऑर्डर)
          </h1>
          <p className="text-xs text-slate-500">
            Custom ornament orders, stone weight deduction, purity wastage, and Karigar wage management
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Form */}
        <form
          onSubmit={handleCreateOrder}
          className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3"
        >
          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800 border-b pb-2">
            <PlusCircle className="h-4 w-4 text-brand-maroon" />
            <span>NEW JEWELLERY ORDER</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Customer Name *
            </label>
            <CustomerSelect
              value={selectedCustomer?.id || ''}
              onChange={(c) => setSelectedCustomer(c)}
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Item Description
              </label>
              <input
                type="text"
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                className="w-full px-2.5 py-1 text-xs rounded border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Assigned Karigar
              </label>
              <input
                type="text"
                value={karigarName}
                onChange={(e) => setKarigarName(e.target.value)}
                className="w-full px-2.5 py-1 text-xs rounded border border-slate-300"
              />
            </div>
          </div>

          {/* Weights */}
          <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-1">Gross Wt</label>
              <input
                type="number"
                step="0.001"
                value={grossWeight}
                onChange={(e) => setGrossWeight(Number(e.target.value))}
                className="w-full px-2 py-1 text-xs rounded border border-slate-300 bg-white font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-1">Less Wt</label>
              <input
                type="number"
                step="0.001"
                value={lessWeight}
                onChange={(e) => setLessWeight(Number(e.target.value))}
                className="w-full px-2 py-1 text-xs rounded border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-1">Net Wt</label>
              <div className="px-2 py-1 text-xs font-black text-brand-maroon bg-white rounded border border-slate-300">
                {netWeight.toFixed(3)}g
              </div>
            </div>
          </div>

          {/* Purity & Wastage */}
          <div className="grid grid-cols-3 gap-2 bg-amber-50/50 p-2.5 rounded-lg border border-amber-200">
            <div>
              <label className="block text-[10px] font-semibold text-amber-900 mb-1">Touch %</label>
              <input
                type="number"
                step="0.01"
                value={purityPercent}
                onChange={(e) => setPurityPercent(Number(e.target.value))}
                className="w-full px-2 py-1 text-xs rounded border border-amber-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-amber-900 mb-1">Wastage %</label>
              <input
                type="number"
                step="0.01"
                value={wastagePercent}
                onChange={(e) => setWastagePercent(Number(e.target.value))}
                className="w-full px-2 py-1 text-xs rounded border border-amber-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-amber-900 mb-1">Labour/g</label>
              <input
                type="number"
                value={labourRate}
                onChange={(e) => setLabourRate(Number(e.target.value))}
                className="w-full px-2 py-1 text-xs rounded border border-amber-300 bg-white font-bold"
              />
            </div>
          </div>

          {/* Calculated Output */}
          <div className="p-3 bg-slate-900 text-white rounded-lg space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Pure Gold Due (Fine + Wastage):</span>
              <span className="font-bold text-brand-gold">{totalPureDue.toFixed(3)} gm</span>
            </div>
            <div className="flex justify-between">
              <span>Labour Charges:</span>
              <span>₹ {labourAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between font-extrabold text-sm border-t border-slate-700 pt-1 text-brand-gold">
              <span>Total Estimated Order Value:</span>
              <span>₹ {totalOrderAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-brand-maroon text-white font-bold text-xs rounded-lg hover:bg-brand-maroon-dark transition-colors shadow-xs"
          >
            Create Order (ऑर्डर दर्ज करें)
          </button>
        </form>

        {/* Table */}
        <div className="lg:col-span-2">
          <DataTable
            columns={columns}
            data={orders}
            searchPlaceholder="Search jewellery orders..."
            exportFileName="jewellery_orders.csv"
          />
        </div>
      </div>
    </div>
  );
};
