import React, { useState } from 'react';
import { Customer, RefineryInvoice } from '../../types';
import { calculateRefineryLossAndTax } from '../../utils/calculations/taxMath';
import { CustomerSelect } from '../../components/shared/CustomerSelect';
import { DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/common/Badge';
import { useUIStore } from '../../store/useUIStore';
import { ColumnDef } from '@tanstack/react-table';
import { Flame, PlusCircle, Save, Printer } from 'lucide-react';

export const RefineryBillingPage: React.FC = () => {
  const { showToast } = useUIStore();

  const [invoices, setInvoices] = useState<RefineryInvoice[]>([
    {
      id: 'REF-101',
      invoiceNo: 'REF/2026/101',
      customerId: 'CUST-104',
      customerName: 'Suresh Galaiwala',
      workType: 'Refining',
      grossWeight: 500.0,
      meltWeight: 485.0,
      meltLoss: 15.0,
      refinedWeight: 480.0,
      refineLoss: 5.0,
      purity: 99.5,
      fineWeight: 477.6,
      ratePerGram: 20.0,
      taxableServiceCharge: 10000.0,
      hsnCode: '9988',
      gstRate: 18.0,
      gstAmount: 1800.0,
      totalInvoiceAmount: 11800.0,
      dateTime: '2026-11-10 15:30:00',
    },
  ]);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [workType, setWorkType] = useState<RefineryInvoice['workType']>('Refining');
  const [grossWeight, setGrossWeight] = useState<number>(250.0);
  const [meltWeight, setMeltWeight] = useState<number>(245.0);
  const [refinedWeight, setRefinedWeight] = useState<number>(242.0);
  const [ratePerGram, setRatePerGram] = useState<number>(20.0);
  const [gstRate, setGstRate] = useState<number>(18.0);
  const [hsnCode, setHsnCode] = useState('9988');

  const { meltLoss, refineLoss, serviceCharge, gstAmount, totalInvoice } =
    calculateRefineryLossAndTax(grossWeight, meltWeight, refinedWeight, ratePerGram, gstRate);

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) {
      showToast('Please select a customer first!', 'error');
      return;
    }

    const nextNo = invoices.length > 0 ? invoices.length + 101 : 101;
    const newInv: RefineryInvoice = {
      id: `REF-${nextNo}`,
      invoiceNo: `REF/2026/${nextNo}`,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      workType,
      grossWeight,
      meltWeight,
      meltLoss,
      refinedWeight,
      refineLoss,
      purity: 99.5,
      fineWeight: Math.round(((refinedWeight * 99.5) / 100) * 1000) / 1000,
      ratePerGram,
      taxableServiceCharge: serviceCharge,
      hsnCode,
      gstRate,
      gstAmount,
      totalInvoiceAmount: totalInvoice,
      dateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    setInvoices([newInv, ...invoices]);
    showToast(`Refinery Tax Invoice ${newInv.invoiceNo} generated!`);
  };

  const columns: ColumnDef<RefineryInvoice>[] = [
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
      accessorKey: 'grossWeight',
      header: 'Gross (g)',
      cell: (info) => <span>{(info.getValue() as number).toFixed(3)}g</span>,
    },
    {
      accessorKey: 'meltLoss',
      header: 'Melt Loss',
      cell: (info) => <span className="text-rose-600 font-bold">-{(info.getValue() as number).toFixed(3)}g</span>,
    },
    {
      accessorKey: 'refineLoss',
      header: 'Refine Loss',
      cell: (info) => <span className="text-rose-600 font-bold">-{(info.getValue() as number).toFixed(3)}g</span>,
    },
    {
      accessorKey: 'refinedWeight',
      header: 'Refined (g)',
      cell: (info) => <span className="font-bold text-amber-800">{(info.getValue() as number).toFixed(3)}g</span>,
    },
    {
      accessorKey: 'totalInvoiceAmount',
      header: 'Total Bill (₹)',
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
          <Flame className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
            REFINERY BILLING (रिफाइनरी व गलाई बिलिंग)
          </h1>
          <p className="text-xs text-slate-500">
            Gold melting, refining loss audit, job-work service charges, and GST tax invoice generation
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
            <span>CREATE REFINERY TAX INVOICE</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Customer / Galaiwala *
            </label>
            <CustomerSelect
              value={selectedCustomer?.id || ''}
              onChange={(c) => setSelectedCustomer(c)}
            />
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
              <label className="block text-[10px] font-semibold text-slate-600 mb-1">Melt Wt</label>
              <input
                type="number"
                step="0.001"
                value={meltWeight}
                onChange={(e) => setMeltWeight(Number(e.target.value))}
                className="w-full px-2 py-1 text-xs rounded border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-1">Refined Wt</label>
              <input
                type="number"
                step="0.001"
                value={refinedWeight}
                onChange={(e) => setRefinedWeight(Number(e.target.value))}
                className="w-full px-2 py-1 text-xs rounded border border-slate-300 bg-white font-bold"
              />
            </div>
          </div>

          {/* Loss Summary */}
          <div className="grid grid-cols-2 gap-2 text-xs p-2.5 rounded bg-rose-50/50 border border-rose-200">
            <div>
              <span className="text-[10px] text-slate-500 block">Melting Loss:</span>
              <span className="font-extrabold text-rose-700">{meltLoss.toFixed(3)} gm</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Refining Loss:</span>
              <span className="font-extrabold text-rose-700">{refineLoss.toFixed(3)} gm</span>
            </div>
          </div>

          {/* Pricing & GST */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-1">Rate/g (₹)</label>
              <input
                type="number"
                value={ratePerGram}
                onChange={(e) => setRatePerGram(Number(e.target.value))}
                className="w-full px-2 py-1 text-xs rounded border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-1">GST Tier</label>
              <select
                value={gstRate}
                onChange={(e) => setGstRate(Number(e.target.value))}
                className="w-full px-2 py-1 text-xs rounded border border-slate-300 bg-white"
              >
                <option value={18}>18% (SAC 9988)</option>
                <option value={5}>5% (SAC 7108)</option>
                <option value={0}>0% (Exempt)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-1">HSN/SAC</label>
              <input
                type="text"
                value={hsnCode}
                onChange={(e) => setHsnCode(e.target.value)}
                className="w-full px-2 py-1 text-xs rounded border border-slate-300"
              />
            </div>
          </div>

          {/* Totals */}
          <div className="p-3 bg-slate-900 text-white rounded-lg space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Taxable Service Charge:</span>
              <span>₹ {serviceCharge.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>GST ({gstRate}%):</span>
              <span>₹ {gstAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between font-black text-sm border-t border-slate-700 pt-1 text-brand-gold">
              <span>TOTAL INVOICE AMOUNT:</span>
              <span>₹ {totalInvoice.toLocaleString('en-IN')}</span>
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
            searchPlaceholder="Search refinery invoices..."
            exportFileName="refinery_invoices.csv"
          />
        </div>
      </div>
    </div>
  );
};
