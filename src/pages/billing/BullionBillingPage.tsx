import React, { useState } from 'react';
import { Customer, BullionInvoice } from '../../types';
import { CustomerSelect } from '../../components/shared/CustomerSelect';
import { DataTable } from '../../components/common/DataTable';
import { useUIStore } from '../../store/useUIStore';
import { useStockStore } from '../../store/useStockStore';
import { ColumnDef } from '@tanstack/react-table';
import { Coins, PlusCircle, Save, Printer } from 'lucide-react';

export const BullionBillingPage: React.FC = () => {
  const { summary } = useStockStore();
  const { showToast } = useUIStore();

  const [invoices, setInvoices] = useState<BullionInvoice[]>([
    {
      id: 'BULL-101',
      invoiceNo: 'BL/2026/101',
      customerId: 'CUST-103',
      customerName: 'Mahavir Bullion Traders',
      productCategory: '99.50 Gold',
      hsnCode: '7108',
      weight: 100.0,
      rateInclusiveGst: 75500.0,
      totalCash: 755000.0,
      receivedCash: 155000.0,
      receivedOnline: 600000.0,
      dateTime: '2026-11-10 11:00:00',
    },
  ]);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [productCategory, setProductCategory] = useState('99.50 Gold');
  const [hsnCode, setHsnCode] = useState('7108');
  const [weight, setWeight] = useState<number>(50.0);
  const [rate, setRate] = useState<number>(summary.marketRates.gold24K || 75500);
  const [receivedCash, setReceivedCash] = useState<number>(50000);
  const [receivedOnline, setReceivedOnline] = useState<number>(327500);

  const totalCash = Math.round(((weight * rate) / 10) * 100) / 100;
  const taxableValue = Math.round((totalCash / 1.03) * 100) / 100;
  const gstAmount = Math.round((totalCash - taxableValue) * 100) / 100;

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) {
      showToast('Please select a customer first!', 'error');
      return;
    }

    const nextNo = invoices.length > 0 ? invoices.length + 101 : 101;
    const newInv: BullionInvoice = {
      id: `BULL-${nextNo}`,
      invoiceNo: `BL/2026/${nextNo}`,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      productCategory,
      hsnCode,
      weight,
      rateInclusiveGst: rate,
      totalCash,
      receivedCash,
      receivedOnline,
      dateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    setInvoices([newInv, ...invoices]);
    showToast(`Bullion Invoice ${newInv.invoiceNo} generated!`);
  };

  const columns: ColumnDef<BullionInvoice>[] = [
    {
      accessorKey: 'invoiceNo',
      header: 'Invoice #',
      cell: (info) => <span className="font-bold">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'dateTime',
      header: 'Date',
      cell: (info) => <span className="text-slate-500">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'customerName',
      header: 'Customer',
      cell: (info) => <span className="font-semibold text-slate-800">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'productCategory',
      header: 'Product',
      cell: (info) => <span className="font-medium text-amber-800">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'weight',
      header: 'Weight (gm)',
      cell: (info) => <span className="font-bold">{(info.getValue() as number).toFixed(3)}g</span>,
    },
    {
      accessorKey: 'rateInclusiveGst',
      header: 'Rate (3% GST)',
      cell: (info) => <span>₹{(info.getValue() as number).toLocaleString('en-IN')}</span>,
    },
    {
      accessorKey: 'totalCash',
      header: 'Invoice Total (₹)',
      cell: (info) => (
        <span className="font-extrabold text-slate-900">
          ₹{(info.getValue() as number).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Print',
      cell: () => (
        <button
          onClick={() => window.print()}
          className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
          title="Print Tax Invoice"
        >
          <Printer className="h-3.5 w-3.5" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-2 border-b pb-3">
        <div className="h-9 w-9 rounded-lg bg-brand-maroon text-brand-gold flex items-center justify-center">
          <Coins className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
            BULLION BILLING (बुलियन थोक बिलिंग)
          </h1>
          <p className="text-xs text-slate-500">
            Wholesale 99.50% & 99.90% bullion bar invoicing with statutory 3% GST calculation
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Form */}
        <form
          onSubmit={handleCreateInvoice}
          className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3"
        >
          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800 border-b pb-2">
            <PlusCircle className="h-4 w-4 text-brand-maroon" />
            <span>NEW BULLION 3% GST INVOICE</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Customer / Bullion Trader *
            </label>
            <CustomerSelect
              value={selectedCustomer?.id || ''}
              onChange={(c) => setSelectedCustomer(c)}
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                className="w-full px-2.5 py-1 text-xs rounded border border-slate-300 bg-white"
              >
                <option value="99.50 Gold">99.50 Gold Bar</option>
                <option value="99.90 Gold">99.90 Pure Gold</option>
                <option value="Fine Silver">99.90 Fine Silver</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                HSN Code
              </label>
              <input
                type="text"
                value={hsnCode}
                onChange={(e) => setHsnCode(e.target.value)}
                className="w-full px-2.5 py-1 text-xs rounded border border-slate-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                Weight (gm)
              </label>
              <input
                type="number"
                step="0.001"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full px-2 py-1 text-xs rounded border border-slate-300 bg-white font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                Rate (incl. 3% GST)
              </label>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full px-2 py-1 text-xs rounded border border-slate-300 bg-white font-bold"
              />
            </div>
          </div>

          {/* Tax Breakdown Preview */}
          <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-200 space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Taxable Value:</span>
              <span>₹ {taxableValue.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>GST 3% (1.5% CGST + 1.5% SGST):</span>
              <span className="font-semibold text-amber-800">₹ {gstAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between font-black text-sm border-t border-amber-200 pt-1 text-brand-maroon">
              <span>TOTAL INVOICE (₹):</span>
              <span>₹ {totalCash.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-brand-maroon text-white font-bold text-xs rounded-lg hover:bg-brand-maroon-dark transition-colors shadow-xs"
          >
            Generate Tax Invoice (चालान बनाएं)
          </button>
        </form>

        {/* Table */}
        <div className="lg:col-span-2">
          <DataTable
            columns={columns}
            data={invoices}
            searchPlaceholder="Search bullion invoices..."
            exportFileName="bullion_invoices.csv"
          />
        </div>
      </div>
    </div>
  );
};

