import React, { useState, useEffect, useRef } from 'react';
import { Customer } from '../../types';
import { customerService } from '../../services/customerService';
import { Search, User, Phone, ChevronDown, Check } from 'lucide-react';

interface CustomerSelectProps {
  value: string;
  onChange: (customer: Customer) => void;
  required?: boolean;
}

export const CustomerSelect: React.FC<CustomerSelectProps> = ({
  value,
  onChange,
  required,
}) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    customerService.getAll().then(setCustomers);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedCustomer = customers.find((c) => c.id === value);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.mobile.includes(search) ||
      (c.shopName && c.shopName.toLowerCase().includes(search.toLowerCase())) ||
      c.customerNo.toString().includes(search)
  );

  return (
    <div className="relative" ref={wrapperRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 text-xs rounded border border-slate-300 bg-white cursor-pointer hover:border-brand-maroon focus:outline-none transition-colors"
      >
        {selectedCustomer ? (
          <div className="flex items-center space-x-2 truncate">
            <span className="font-bold text-slate-800">
              #{selectedCustomer.customerNo} {selectedCustomer.name}
            </span>
            {selectedCustomer.shopName && (
              <span className="text-slate-500 font-medium truncate">
                ({selectedCustomer.shopName})
              </span>
            )}
            <span className="text-slate-400">| {selectedCustomer.mobile}</span>
          </div>
        ) : (
          <span className="text-slate-400">Search customer by name, mobile, or ID...</span>
        )}
        <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 ml-1" />
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 max-h-60 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 z-50 overflow-y-auto">
          <div className="p-2 border-b sticky top-0 bg-white">
            <div className="relative">
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type name, shop, or mobile..."
                className="w-full pl-8 pr-2 py-1 text-xs rounded border border-slate-300 focus:outline-none focus:border-brand-maroon"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {filtered.length > 0 ? (
              filtered.map((c) => {
                const isSelected = c.id === value;
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      onChange(c);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`p-2.5 hover:bg-slate-50 cursor-pointer flex items-center justify-between text-xs transition-colors ${
                      isSelected ? 'bg-amber-50/60' : ''
                    }`}
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-slate-800">
                          #{c.customerNo} {c.name}
                        </span>
                        {c.shopName && (
                          <span className="text-[11px] text-slate-500">({c.shopName})</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-0.5">
                        <span>📱 {c.mobile}</span>
                        <span>•</span>
                        <span>{c.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 text-right">
                      <div className="flex flex-col text-[10px]">
                        <span
                          className={`font-semibold ${
                            c.balance.gold >= 0 ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          Gold: {c.balance.gold >= 0 ? '+' : ''}
                          {c.balance.gold.toFixed(3)}g
                        </span>
                        <span
                          className={`font-semibold ${
                            c.balance.cash >= 0 ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          Cash: ₹{c.balance.cash.toLocaleString('en-IN')}
                        </span>
                      </div>
                      {isSelected && <Check className="h-4 w-4 text-brand-maroon" />}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-3 text-center text-xs text-slate-400">No customers found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

