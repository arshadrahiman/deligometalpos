import React, { useState } from 'react';
import { Customer, HallmarkOrder } from '../../types';
import { calculateHallmarkCharge } from '../../utils/calculations/taxMath';
import { CustomerSelect } from '../../components/shared/CustomerSelect';
import { DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/common/Badge';
import { useUIStore } from '../../store/useUIStore';
import { ColumnDef } from '@tanstack/react-table';
import { Award, PlusCircle, Save, CheckCircle2, QrCode } from 'lucide-react';

export const HallmarkPage: React.FC = () => {
  const { showToast } = useUIStore();

  const [orders, setOrders] = useState<HallmarkOrder[]>([
    {
      id: 'HM-101',
      orderNo: 101,
      customerId: 'CUST-101',
      customerName: 'Rajesh Swarnakar',
      workType: 'HUID',
      pieces: 18,
      chargePerPiece: 45.0,
      totalWeight: 142.5,
      totalCharge: 810.0,
      boxNo: 'BOX-A1',
      status: 'In Process',
      dateTime: '2026-11-11 10:30:00',
    },
    {
      id: 'HM-102',
      orderNo: 102,
      customerId: 'CUST-105',
      customerName: 'Pooja Jewellers',
      workType: 'Hallmark',
      pieces: 32,
      chargePerPiece: 35.0,
      totalWeight: 215.0,
      totalCharge: 1120.0,
      boxNo: 'BOX-B4',
      status: 'Completed',
      dateTime: '2026-11-10 16:15:00',
    },
  ]);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [workType, setWorkType] = useState<HallmarkOrder['workType']>('HUID');
  const [pieces, setPieces] = useState<number>(10);
  const [chargePerPiece, setChargePerPiece] = useState<number>(45.0);
  const [totalWeight, setTotalWeight] = useState<number>(50.0);
  const [boxNo, setBoxNo] = useState<string>('BOX-1');

  const totalCharge = calculateHallmarkCharge(pieces, chargePerPiece);

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) {
      showToast('Please select a customer first!', 'error');
      return;
    }

    const nextNo = orders.length > 0 ? Math.max(...orders.map((o) => o.orderNo)) + 1 : 101;
    const newOrder: HallmarkOrder = {
      id: `HM-${nextNo}`,
      orderNo: nextNo,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      workType,
      pieces,
      chargePerPiece,
      totalWeight,
      totalCharge,
      boxNo,
      status: 'Received',
      dateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    setOrders([newOrder, ...orders]);
    showToast(`Hallmark batch #${nextNo} registered!`);
  };

  const columns: ColumnDef<HallmarkOrder>[] = [
    {
      accessorKey: 'orderNo',
      header: 'Job #',
      cell: (info) => <span className="font-bold">#{info.getValue() as number}</span>,
    },
    {
      accessorKey: 'dateTime',
      header: 'Date',
      cell: (info) => <span className="text-slate-500">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'customerName',
      header: 'Jeweller / Customer',
      cell: (info) => <span className="font-semibold text-slate-800">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'workType',
      header: 'Work Type',
      cell: (info) => <Badge variant="info">{info.getValue() as string}</Badge>,
    },
    {
      accessorKey: 'pieces',
      header: 'Pieces',
      cell: (info) => <span className="font-bold">{info.getValue() as number} Pcs</span>,
    },
    {
      accessorKey: 'totalWeight',
      header: 'Weight (gm)',
      cell: (info) => <span>{(info.getValue() as number).toFixed(3)}g</span>,
    },
    {
      accessorKey: 'totalCharge',
      header: 'Total Fee (₹)',
      cell: (info) => (
        <span className="font-extrabold text-slate-900">
          ₹{(info.getValue() as number).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      accessorKey: 'boxNo',
      header: 'Box No',
      cell: (info) => <span className="font-mono text-slate-600">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (info) => {
        const s = info.getValue() as string;
        const v = s === 'Completed' ? 'success' : s === 'In Process' ? 'warning' : 'default';
        return <Badge variant={v}>{s}</Badge>;
      },
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-2 border-b pb-3">
        <div className="h-9 w-9 rounded-lg bg-brand-maroon text-brand-gold flex items-center justify-center">
          <Award className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
            HALLMARK & HUID BATCHES (हॉलमार्क / लेजर मार्किंग)
          </h1>
          <p className="text-xs text-slate-500">
            BIS Hallmarking, HUID laser printing, testing job-card queue, and piece-rate billing
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
            <span>NEW HALLMARK JOB ORDER</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Jeweller Customer *
            </label>
            <CustomerSelect
              value={selectedCustomer?.id || ''}
              onChange={(c) => setSelectedCustomer(c)}
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Work Type
              </label>
              <select
                value={workType}
                onChange={(e) => setWorkType(e.target.value as any)}
                className="w-full px-2.5 py-1 text-xs rounded border border-slate-300 bg-white"
              >
                <option value="HUID">HUID</option>
                <option value="Hallmark">Hallmark</option>
                <option value="Marking">Marking</option>
                <option value="Card">Card</option>
                <option value="Tounch">Tounch</option>
                <option value="galai">galai</option>
                <option value="laser soldering">laser soldering</option>
                <option value="L cating">L cating</option>
                <option value="STAMPING">STAMPING</option>
                <option value="SILVER HUID">SILVER HUID</option>
                <option value="gold melting">gold melting</option>
                <option value="silver melting">silver melting</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Box / Lot No
              </label>
              <input
                type="text"
                value={boxNo}
                onChange={(e) => setBoxNo(e.target.value)}
                className="w-full px-2.5 py-1 text-xs rounded border border-slate-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-1">Pieces</label>
              <input
                type="number"
                value={pieces}
                onChange={(e) => setPieces(Number(e.target.value))}
                className="w-full px-2 py-1 text-xs rounded border border-slate-300 bg-white font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-1">Rate / Pc</label>
              <input
                type="number"
                value={chargePerPiece}
                onChange={(e) => setChargePerPiece(Number(e.target.value))}
                className="w-full px-2 py-1 text-xs rounded border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-1">Total Wt</label>
              <input
                type="number"
                step="0.001"
                value={totalWeight}
                onChange={(e) => setTotalWeight(Number(e.target.value))}
                className="w-full px-2 py-1 text-xs rounded border border-slate-300 bg-white"
              />
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800">Total Charge (₹):</span>
            <span className="text-base font-black text-brand-maroon">
              ₹ {totalCharge.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-brand-maroon text-white font-bold text-xs rounded-lg hover:bg-brand-maroon-dark transition-colors shadow-xs"
          >
            Register Job Order (दर्ज करें)
          </button>
        </form>

        {/* Table */}
        <div className="lg:col-span-2">
          <DataTable
            columns={columns}
            data={orders}
            searchPlaceholder="Search hallmark orders..."
            exportFileName="hallmark_orders.csv"
          />
        </div>
      </div>
    </div>
  );
};

