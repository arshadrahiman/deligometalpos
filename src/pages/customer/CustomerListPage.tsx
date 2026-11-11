import React, { useState, useEffect } from 'react';
import { Customer } from '../../types';
import { customerService } from '../../services/customerService';
import { useUIStore } from '../../store/useUIStore';
import { DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ColumnDef } from '@tanstack/react-table';
import {
  Users,
  UserPlus,
  Trash2,
  Phone,
  Building,
  Save,
  CheckCircle2,
} from 'lucide-react';

const INDIAN_STATES = [
  'Andaman and Nicobar Islands (35)',
  'Andhra Pradesh (37)',
  'Arunachal Pradesh (12)',
  'Assam (18)',
  'Bihar (10)',
  'Chandigarh (04)',
  'Chhattisgarh (22)',
  'Dadra and Nagar Haveli and Daman and Diu (26)',
  'Delhi (07)',
  'Goa (30)',
  'Gujarat (24)',
  'Haryana (06)',
  'Himachal Pradesh (02)',
  'Jammu and Kashmir (01)',
  'Jharkhand (20)',
  'Karnataka (29)',
  'Kerala (32)',
  'Ladakh (38)',
  'Lakshadweep (31)',
  'Madhya Pradesh (23)',
  'Maharashtra (27)',
  'Manipur (14)',
  'Meghalaya (17)',
  'Mizoram (15)',
  'Nagaland (13)',
  'Odisha (21)',
  'Puducherry (34)',
  'Punjab (03)',
  'Rajasthan (08)',
  'Sikkim (11)',
  'Tamil Nadu (33)',
  'Telangana (36)',
  'Tripura (16)',
  'Uttar Pradesh (09)',
  'Uttarakhand (05)',
  'West Bengal (19)',
];

export const CustomerListPage: React.FC = () => {
  const { showToast } = useUIStore();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [mobileSecondary, setMobileSecondary] = useState('');
  const [shopName, setShopName] = useState('');
  const [category, setCategory] = useState<Customer['category']>('Jewelry Owner');
  const [line1, setLine1] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Madhya Pradesh (23)');
  const [gstNo, setGstNo] = useState('');
  const [panNo, setPanNo] = useState('');
  const [aadharNo, setAadharNo] = useState('');

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const list = await customerService.getAll();
    setCustomers(list);
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Customer Name is required!', 'error');
      return;
    }
    if (!mobile.trim() || mobile.length < 10) {
      showToast('Valid 10-digit mobile number is required!', 'error');
      return;
    }

    await customerService.create({
      name,
      mobile,
      mobileSecondary,
      shopName,
      category,
      address: {
        line1,
        area,
        city,
        state,
      },
      taxDetails: {
        gstNo,
        panNo,
        aadharNo,
      },
      balance: {
        gold: 0,
        cash: 0,
        silver: 0,
      },
    });

    showToast(`Customer "${name}" created successfully!`);
    setIsAddModalOpen(false);
    loadCustomers();

    // Reset Form
    setName('');
    setMobile('');
    setMobileSecondary('');
    setShopName('');
    setLine1('');
    setArea('');
    setCity('');
    setGstNo('');
    setPanNo('');
    setAadharNo('');
  };

  const handleDelete = async (id: string, customerName: string) => {
    if (window.confirm(`Are you sure you want to delete customer "${customerName}"?`)) {
      await customerService.delete(id);
      showToast('Customer deleted');
      loadCustomers();
    }
  };

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: 'customerNo',
      header: 'C No.',
      cell: (info) => <span className="font-bold">#{info.getValue() as number}</span>,
    },
    {
      accessorKey: 'name',
      header: 'Customer Name',
      cell: (info) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-800">{info.getValue() as string}</span>
          {info.row.original.shopName && (
            <span className="text-[10px] text-slate-500 font-medium">
              Shop: {info.row.original.shopName}
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'mobile',
      header: 'Mobile',
      cell: (info) => (
        <span className="text-slate-600 font-medium">{info.getValue() as string}</span>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: (info) => {
        const cat = info.getValue() as string;
        const variant =
          cat === 'Karigar'
            ? 'info'
            : cat === 'Jewelry Owner'
            ? 'gold'
            : cat === 'Whole Seller'
            ? 'success'
            : 'default';
        return <Badge variant={variant}>{cat}</Badge>;
      },
    },
    {
      header: 'City / State',
      cell: (info) => (
        <span className="text-slate-600">
          {info.row.original.address.city || 'N/A'}, {info.row.original.address.state.split(' ')[0]}
        </span>
      ),
    },
    {
      header: 'Gold Balance',
      cell: (info) => {
        const g = info.row.original.balance.gold;
        return (
          <span
            className={`font-extrabold ${g >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}
          >
            {g >= 0 ? '+' : ''}
            {g.toFixed(3)}g
          </span>
        );
      },
    },
    {
      header: 'Cash Balance',
      cell: (info) => {
        const c = info.row.original.balance.cash;
        return (
          <span
            className={`font-extrabold ${c >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}
          >
            ₹{c.toLocaleString('en-IN')}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <button
          onClick={() => handleDelete(info.row.original.id, info.row.original.name)}
          className="p-1 rounded text-red-600 hover:bg-red-50"
          title="Delete Customer"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-b pb-3 gap-2">
        <div className="flex items-center space-x-2">
          <div className="h-9 w-9 rounded-lg bg-brand-maroon text-brand-gold flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              CUSTOMER DIRECTORY (ग्राहक डायरेक्टरी)
            </h1>
            <p className="text-xs text-slate-500">
              Manage client accounts, Karigars, wholesalers, GST numbers, and contact profiles
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-brand-maroon text-white rounded-md text-xs font-semibold hover:bg-brand-maroon-dark transition-all shadow-xs"
        >
          <UserPlus className="h-3.5 w-3.5" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={customers}
        searchPlaceholder="Search customers by name, phone, shop, or city..."
        exportFileName="customers_list.csv"
      />

      {/* Add Customer Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="ADD NEW CUSTOMER (नया ग्राहक जोड़ें)"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateCustomer} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Customer Name (ग्राहक का नाम) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Chandra Verma"
                className="w-full px-3 py-1.5 rounded border border-slate-300 focus:outline-none focus:border-brand-maroon font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Shop / Business Name (दुकान का नाम)
              </label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="e.g. Verma Jewellers"
                className="w-full px-3 py-1.5 rounded border border-slate-300 focus:outline-none focus:border-brand-maroon"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Primary Mobile (WhatsApp) <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                maxLength={10}
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="10-digit number"
                className="w-full px-3 py-1.5 rounded border border-slate-300 focus:outline-none focus:border-brand-maroon font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Secondary Mobile
              </label>
              <input
                type="tel"
                maxLength={10}
                value={mobileSecondary}
                onChange={(e) => setMobileSecondary(e.target.value)}
                placeholder="Alternate phone"
                className="w-full px-3 py-1.5 rounded border border-slate-300 focus:outline-none focus:border-brand-maroon"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category (वर्ग)
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-1.5 rounded border border-slate-300 bg-white focus:outline-none"
              >
                <option value="Jewelry Owner">Jewelry Owner (ज्वेलरी मालिक)</option>
                <option value="Karigar">Karigar (कारीगर)</option>
                <option value="Galaiwala">Galaiwala (गलाईवाला)</option>
                <option value="Whole Seller">Whole Seller (थोक विक्रेता)</option>
                <option value="Others">Others</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold text-slate-700 block uppercase">
              Address & Location Details
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={line1}
                onChange={(e) => setLine1(e.target.value)}
                placeholder="Shop / House No."
                className="w-full px-2.5 py-1 text-xs rounded border border-slate-300 bg-white"
              />
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Street / Area / Market"
                className="w-full px-2.5 py-1 text-xs rounded border border-slate-300 bg-white"
              />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City (e.g. Indore)"
                className="w-full px-2.5 py-1 text-xs rounded border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                State (राज्य व GST कोड)
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-2.5 py-1 text-xs rounded border border-slate-300 bg-white"
              >
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tax Information */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">GSTIN No.</label>
              <input
                type="text"
                value={gstNo}
                onChange={(e) => setGstNo(e.target.value)}
                placeholder="15-digit GSTIN"
                className="w-full px-3 py-1.5 rounded border border-slate-300 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">PAN Card</label>
              <input
                type="text"
                value={panNo}
                onChange={(e) => setPanNo(e.target.value)}
                placeholder="10-digit PAN"
                className="w-full px-3 py-1.5 rounded border border-slate-300 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Aadhar Card</label>
              <input
                type="text"
                value={aadharNo}
                onChange={(e) => setAadharNo(e.target.value)}
                placeholder="12-digit UID"
                className="w-full px-3 py-1.5 rounded border border-slate-300 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 bg-slate-100 rounded text-slate-700 font-semibold text-xs hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-5 py-2 bg-brand-maroon text-white rounded font-bold text-xs hover:bg-brand-maroon-dark transition-all shadow-xs"
            >
              <Save className="h-4 w-4" />
              <span>Save Customer</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
