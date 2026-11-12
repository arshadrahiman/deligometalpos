import React, { useState, useEffect } from 'react';
import { Customer } from '../../types';
import { customerService } from '../../services/customerService';
import { useUIStore } from '../../store/useUIStore';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { ColumnDef } from '@tanstack/react-table';
import {
  Users,
  Plus,
  Save,
  Search,
  Printer,
  ChevronDown,
  FileSpreadsheet,
  MoreVertical,
  Trash2,
} from 'lucide-react';

const INDIAN_STATES = [
  'Select State',
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

  // Search Filters
  const [selectedCustFilter, setSelectedCustFilter] = useState('all');
  const [mobileSearch, setMobileSearch] = useState('');

  // Form State matching customer_add_1440.png
  const [customerNo, setCustomerNo] = useState(387);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [category, setCategory] = useState<Customer['category']>('Jewelry Owner');
  const [shopName, setShopName] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [gstNo, setGstNo] = useState('');
  const [licenceNo, setLicenceNo] = useState('');
  const [panNo, setPanNo] = useState('');
  const [aadharNo, setAadharNo] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [logo, setLogo] = useState('');
  const [registrationNo, setRegistrationNo] = useState('');
  const [stateName, setStateName] = useState('Madhya Pradesh (23)');

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const list = await customerService.getAll();
    setCustomers(list);
    if (list.length > 0) {
      const maxNo = Math.max(...list.map((c) => c.customerNo));
      setCustomerNo(maxNo + 1);
    }
  };

  const handleCreateCustomer = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) {
      showToast('Customer / Shop Name is required!', 'error');
      return;
    }
    if (!mobile.trim() || mobile.length < 10) {
      showToast('Valid 10-digit mobile number is required!', 'error');
      return;
    }

    await customerService.create({
      name,
      mobile,
      shopName,
      category,
      address: {
        line1: shopAddress,
        city: shopAddress ? shopAddress.split('/')[0].trim() : '',
        state: stateName,
      },
      taxDetails: {
        gstNo,
        panNo,
        aadharNo,
        licenceNo,
        registrationNo,
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
    setShopName('');
    setShopAddress('');
    setGstNo('');
    setLicenceNo('');
    setPanNo('');
    setAadharNo('');
    setLogo('');
    setRegistrationNo('');
  };

  const handleDelete = async (id: string, customerName: string) => {
    if (window.confirm(`Are you sure you want to delete customer "${customerName}"?`)) {
      await customerService.delete(id);
      showToast('Customer deleted');
      loadCustomers();
    }
  };

  const filteredCustomers = customers.filter((c) => {
    if (selectedCustFilter !== 'all' && String(c.customerNo) !== selectedCustFilter) {
      return false;
    }
    if (mobileSearch && !c.mobile.includes(mobileSearch)) {
      return false;
    }
    return true;
  });

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: 'customerNo',
      header: 'C No.',
      cell: (info) => <span className="font-bold">{info.getValue() as number}</span>,
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: (info) => (
        <span className="font-bold text-slate-800">{info.getValue() as string}</span>
      ),
    },
    {
      accessorKey: 'mobile',
      header: 'Mobile No.',
      cell: (info) => (
        <span className="text-slate-600 font-mono text-[11px]">{info.getValue() as string}</span>
      ),
    },
    {
      accessorKey: 'shopName',
      header: 'Shop Name',
      cell: (info) => <span className="text-slate-600">{info.getValue() as string || '-'}</span>,
    },
    {
      accessorKey: 'category',
      header: 'C. Category',
      cell: (info) => <span className="text-slate-700">{info.getValue() as string}</span>,
    },
    {
      header: 'Aadhar No.',
      cell: (info) => (
        <span className="text-slate-600 font-mono text-[11px]">
          {info.row.original.taxDetails?.aadharNo || '-'}
        </span>
      ),
    },
    {
      header: 'GST No.',
      cell: (info) => (
        <span className="text-slate-600 font-mono text-[11px]">
          {info.row.original.taxDetails?.gstNo || '-'}
        </span>
      ),
    },
    {
      header: 'Licence No.',
      cell: (info) => (
        <span className="text-slate-600 font-mono text-[11px]">
          {info.row.original.taxDetails?.licenceNo || '-'}
        </span>
      ),
    },
    {
      header: 'Profile Photo',
      cell: (info) => (
        <span className="text-slate-400">
          {info.row.original.profilePhoto ? '📷' : '-'}
        </span>
      ),
    },
    {
      header: 'Address',
      cell: (info) => (
        <span className="text-slate-600">
          {info.row.original.address.city || info.row.original.address.state.split(' ')[0]}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Action',
      cell: ({ row }) => (
        <div className="flex items-center space-x-1 justify-center">
          <button
            onClick={() => handleDelete(row.original.id, row.original.name)}
            className="p-1 rounded text-slate-500 hover:text-rose-600 hover:bg-rose-50"
            title="Options"
          >
            <MoreVertical className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Top Search Bar Matching reference/customer_list_1440.png */}
      <div className="bg-white p-3 rounded-xl border border-amber-300 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-4 flex-1">
          {/* Customer No / Name Search */}
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800 whitespace-nowrap">Customer No / Name :</span>
            <div className="relative flex items-center">
              <select
                value={selectedCustFilter}
                onChange={(e) => setSelectedCustFilter(e.target.value)}
                className="w-48 sm:w-60 px-3 py-1.5 rounded-l-md border border-r-0 border-slate-300 bg-white font-medium text-slate-700 focus:outline-none focus:border-brand-maroon"
              >
                <option value="all">Select</option>
                {customers.map((c) => (
                  <option key={c.id} value={String(c.customerNo)}>
                    {c.customerNo} / {c.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="px-2.5 py-2 bg-brand-maroon text-white rounded-r-md hover:bg-brand-maroon-dark transition-colors"
              >
                <Search className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Mobile No Search */}
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800 whitespace-nowrap">Mobile No :</span>
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search Mobile"
                value={mobileSearch}
                onChange={(e) => setMobileSearch(e.target.value)}
                className="w-40 sm:w-56 px-3 py-1.5 rounded-l-md border border-r-0 border-slate-300 bg-white font-medium text-slate-700 focus:outline-none focus:border-brand-maroon"
              />
              <button
                type="button"
                className="px-2.5 py-2 bg-brand-maroon text-white rounded-r-md hover:bg-brand-maroon-dark transition-colors"
              >
                <Search className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Red + Circle Button to Add Customer */}
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="h-8 w-8 rounded-full bg-rose-600 text-white flex items-center justify-center hover:bg-rose-700 shadow-xs shrink-0"
            title="Add New Customer"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        {/* Brand Logo Box */}
        <div className="flex items-center space-x-2 pl-4 border-l border-slate-200">
          <div className="h-8 w-8 rounded-lg bg-brand-maroon text-brand-gold flex items-center justify-center font-black text-sm shadow-xs">
            DT
          </div>
          <div className="leading-tight">
            <span className="font-extrabold text-slate-800 tracking-tight text-xs block">
              DELIGO TECHNOLOGIES
            </span>
            <span className="text-[10px] text-brand-maroon font-semibold block">
              Customer Directory
            </span>
          </div>
        </div>
      </div>

      {/* Import from Excel Dropdown Bar */}
      <div className="flex items-center justify-center">
        <button
          type="button"
          onClick={() => showToast('Import template ready: Select CSV / XLSX file')}
          className="flex items-center space-x-2 px-4 py-1.5 rounded-full border border-slate-300 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 shadow-xs"
        >
          <FileSpreadsheet className="h-4 w-4 text-emerald-700" />
          <span>Import Customers From Excel</span>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </button>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-xl border border-slate-300 shadow-xs overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredCustomers}
          searchPlaceholder="Filter customer directory..."
          exportFileName="customers_directory.csv"
        />

        {/* Footer Bar Matching reference/customer_list_1440.png */}
        <div className="bg-slate-600 px-4 py-2 flex items-center justify-end border-t border-slate-500">
          <button
            onClick={() => window.print()}
            className="p-1.5 rounded bg-white text-brand-maroon hover:bg-slate-100 shadow-xs transition-colors"
            title="Print Customer List"
          >
            <Printer className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Add Customer Modal Matching reference/customer_add_1440.png */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="ADD NEW CUSTOMER"
        maxWidth="2xl"
      >
        <div className="space-y-4 text-xs">
          {/* Top Primary Section */}
          <div className="space-y-2.5 p-3 rounded-lg border border-slate-200 bg-white">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 w-44 text-right pr-3">
                CUSTOMER NO. :
              </span>
              <span className="flex-1 font-black text-rose-600 text-sm">
                {customerNo}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 w-44 text-right pr-3">
                <span className="text-red-500 mr-0.5">*</span> CUSTOMER / SHOP NAME :
              </span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="flex-1 px-3 py-1.5 rounded border border-emerald-400 text-xs font-semibold focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 w-44 text-right pr-3">
                <span className="text-red-500 mr-0.5">*</span> MOBILE NO :
              </span>
              <input
                type="text"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Whatsapp Mobile No."
                className="flex-1 px-3 py-1.5 rounded border border-emerald-400 text-xs font-semibold focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 w-44 text-right pr-3">
                CUSTOMER CATEGORY :
              </span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="flex-1 px-3 py-1.5 rounded border border-slate-300 text-xs font-semibold focus:outline-none"
              >
                <option value="Jewelry Owner">Jewelry Owner</option>
                <option value="Karigar">Karigar</option>
                <option value="Whole Seller">Whole Seller</option>
                <option value="Galaiwala">Galaiwala</option>
                <option value="Others">Others</option>
              </select>
            </div>

            {/* Floppy Disk Save Button */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => handleCreateCustomer()}
                className="p-2 rounded bg-brand-maroon text-white hover:bg-brand-maroon-dark transition-colors inline-flex items-center justify-center shadow-xs"
                title="Save Customer"
              >
                <Save className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Additional Optional Information Section */}
          <div className="space-y-2.5 p-3 rounded-lg border border-slate-200 bg-white">
            <h4 className="text-center font-bold text-slate-800 border-b pb-1 text-xs">
              Additional Optional Information
            </h4>

            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 w-44 text-right pr-3">
                SHOP / CUSTOMER NAME :
              </span>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="Shop Name"
                className="flex-1 px-3 py-1.5 rounded border border-slate-300 text-xs focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 w-44 text-right pr-3">
                SHOP ADDRESS :
              </span>
              <input
                type="text"
                value={shopAddress}
                onChange={(e) => setShopAddress(e.target.value)}
                placeholder="Eg : Block No / House No. /City"
                className="flex-1 px-3 py-1.5 rounded border border-slate-300 text-xs focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center">
                <span className="font-bold text-slate-700 w-24 text-right pr-2">GST NO. :</span>
                <input
                  type="text"
                  value={gstNo}
                  onChange={(e) => setGstNo(e.target.value)}
                  placeholder="Eg : DJHGH46545J"
                  className="flex-1 px-2.5 py-1.5 rounded border border-slate-300 text-xs focus:outline-none"
                />
              </div>

              <div className="flex items-center">
                <span className="font-bold text-slate-700 w-28 text-right pr-2">Lic. NO. - Eg :</span>
                <input
                  type="text"
                  value={licenceNo}
                  onChange={(e) => setLicenceNo(e.target.value)}
                  placeholder="US555255S"
                  className="flex-1 px-2.5 py-1.5 rounded border border-slate-300 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center">
                <span className="font-bold text-slate-700 w-24 text-right pr-2">PAN NO. :</span>
                <input
                  type="text"
                  value={panNo}
                  onChange={(e) => setPanNo(e.target.value)}
                  placeholder="Eg : DJHGH46545J"
                  className="flex-1 px-2.5 py-1.5 rounded border border-slate-300 text-xs focus:outline-none"
                />
              </div>

              <div className="flex items-center">
                <span className="font-bold text-slate-700 w-28 text-right pr-2">Aadhar No :</span>
                <input
                  type="text"
                  value={aadharNo}
                  onChange={(e) => setAadharNo(e.target.value)}
                  placeholder="Aadhar No"
                  className="flex-1 px-2.5 py-1.5 rounded border border-slate-300 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 w-44 text-right pr-3">
                PROFILE PHOTO :
              </span>
              <input
                type="file"
                className="flex-1 text-xs file:mr-2 file:py-1 file:px-2.5 file:rounded file:border file:border-slate-300 file:bg-slate-50 file:text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center">
                <span className="font-bold text-slate-700 w-24 text-right pr-2">Logo :</span>
                <input
                  type="text"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  placeholder="Eg : KSJD"
                  className="flex-1 px-2.5 py-1.5 rounded border border-slate-300 text-xs focus:outline-none"
                />
              </div>

              <div className="flex items-center">
                <span className="font-bold text-slate-700 w-32 text-right pr-2">Registration No :</span>
                <input
                  type="text"
                  value={registrationNo}
                  onChange={(e) => setRegistrationNo(e.target.value)}
                  placeholder="2392792749"
                  className="flex-1 px-2.5 py-1.5 rounded border border-slate-300 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 w-44 text-right pr-3">
                State Name :
              </span>
              <select
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded border border-slate-300 text-xs font-semibold focus:outline-none"
              >
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Floppy Disk Save Button */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => handleCreateCustomer()}
                className="p-2 rounded bg-brand-maroon text-white hover:bg-brand-maroon-dark transition-colors inline-flex items-center justify-center shadow-xs"
                title="Save Customer Details"
              >
                <Save className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
