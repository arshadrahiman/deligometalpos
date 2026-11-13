import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  MoreVertical,
  Calculator,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import { useMetalStore } from '../../store/useMetalStore';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { openStockModal, openBhavcutModal } = useUIStore();
  const { metalMode, toggleMetalMode } = useMetalStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'EXCHANGE', sub: 'बदला/ पलटा', path: '/exchange' },
    { name: 'BUY-SELL', sub: 'खरीद बिक्री', path: '/buy-sell' },
    { name: 'LOAN', sub: 'उधार', path: '/udhari' },
    { name: 'LEDGER', sub: 'खाता बही', path: '/ledger' },
    { name: 'CUSTOMER', sub: 'ग्राहक', path: '/customers' },
    { name: 'EXPENSE | INCOME', sub: 'खर्च | आय', path: '/expenses' },
    { name: 'HALLMARK', sub: 'हॉलमार्क', path: '/hallmark' },
    { name: 'JEWELLERY', sub: 'जेवर', path: '/jewellery' },
  ];

  const moreServices = [
    { name: 'Udhari & Loan (उधार खाता)', path: '/udhari' },
    { name: 'Ledger Summary (खाता बही)', path: '/ledger' },
    { name: 'Stock View (स्टॉक सारांश)', path: '/stock' },
    { name: 'Refinery Billing', path: '/billing/refinery' },
    { name: 'Bullion Billing', path: '/billing/bullion' },
    { name: 'Hallmark Billing', path: '/billing/hallmark' },
    { name: 'Refinery Service', path: '/services/refinery' },
    { name: 'Day Book (दैनिक बही)', path: '/day-book' },
    { name: 'Certificates (प्रमाणपत्र)', path: '/certificates' },
    { name: 'Khar / Mel (खार / मेल)', path: '/khar-mel' },
    { name: 'Touch Form (टंच फॉर्म)', path: '/touch-form' },
    { name: 'Extra Settings (एक्स्ट्रा सेटिंग्स)', path: '/settings/extra' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-brand-nav text-white shadow-md select-none border-b border-black/20">
      <div className="mx-auto flex h-14 max-w-full items-center justify-between px-3 lg:px-4">
        {/* Left: Brand / Shop Name */}
        <Link to="/" className="flex items-center space-x-2 group shrink-0 mr-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-maroon text-brand-gold shadow-sm group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-black tracking-tight text-white line-clamp-1">
              {user?.shopName || 'Lakshmi Gold Testing'}
            </span>
            <span className="text-[9px] text-slate-300 font-medium">Deligo Technologies ERP</span>
          </div>
        </Link>

        {/* Center: Desktop Navigation Bar Matching Reference Screenshots */}
        <div className="hidden xl:flex items-center space-x-1 flex-1 justify-center">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center px-2 py-1.5 rounded transition-all text-center leading-tight ${
                  isActive
                    ? 'bg-brand-maroon text-brand-gold border-b-2 border-brand-gold font-bold shadow-xs'
                    : 'text-slate-200 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <span className="text-[11px] font-bold tracking-wide">{link.name}</span>
              <span className="text-[9px] text-slate-300">{link.sub}</span>
            </NavLink>
          ))}
        </div>

        {/* Right: Exactly Matching [ : ] [ ⚙ ] [ Gold / Silver Toggle ] [ Stock ] */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* Three Dots More Services Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="p-1.5 rounded text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
              title="More Modules & Services"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            {dropdownOpen && (
              <div
                className="absolute right-0 mt-1 w-56 rounded-md bg-white py-1 shadow-2xl ring-1 ring-black ring-opacity-10 z-50 text-slate-800"
                onClick={() => setDropdownOpen(false)}
              >
                {moreServices.map((svc) => (
                  <Link
                    key={svc.path}
                    to={svc.path}
                    className="block px-4 py-2 text-xs font-semibold hover:bg-slate-100 hover:text-brand-maroon transition-colors"
                  >
                    {svc.name}
                  </Link>
                ))}
                <div className="border-t my-1 border-slate-200" />
                <button
                  onClick={openBhavcutModal}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-50 flex items-center space-x-1.5"
                >
                  <Calculator className="h-3.5 w-3.5" />
                  <span>Bhavcut Calculator</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 flex items-center space-x-1.5"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Settings Yellow Gear Icon Matching Reference */}
          <Link
            to="/settings/extra"
            className="p-1 rounded text-amber-400 hover:text-amber-300 transition-colors"
            title="Extra Settings (सॉफ्टवेयर सेटिंग्स)"
          >
            <Settings className="h-5 w-5 fill-amber-400 text-amber-400" />
          </Link>

          {/* Master Gold / Silver Toggle Pill Matching Reference Exactly */}
          <button
            type="button"
            onClick={toggleMetalMode}
            className={`relative inline-flex items-center h-6 sm:h-7 px-1.5 rounded-full cursor-pointer transition-all shadow-xs select-none ${
              metalMode === 'GOLD' ? 'bg-[#ffd700]' : 'bg-slate-300'
            }`}
            title={`Active: ${metalMode}. Click to toggle Gold / Silver`}
          >
            {metalMode === 'GOLD' ? (
              <div className="flex items-center space-x-1.5">
                <span className="text-[11px] font-black text-slate-950 px-1">Gold</span>
                <span className="h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-white shadow-xs inline-block" />
              </div>
            ) : (
              <div className="flex items-center space-x-1.5">
                <span className="h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-white shadow-xs inline-block" />
                <span className="text-[11px] font-black text-slate-900 px-1">Silver</span>
              </div>
            )}
          </button>

          {/* Stock Yellow Button Matching Reference Exactly */}
          <button
            type="button"
            onClick={openStockModal}
            className="h-6 sm:h-7 px-3 rounded-sm bg-[#ffd700] hover:bg-amber-400 text-slate-950 font-black text-xs shadow-xs transition-colors flex items-center justify-center active:scale-95"
            title="Open Stock View"
          >
            Stock
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-1.5 rounded text-slate-300 hover:bg-white/10 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-700 bg-brand-nav px-4 py-3 space-y-2">
          {/* Mobile Metal Toggle & Stock Row */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-700">
            <span className="text-xs font-bold text-slate-300">Active Metal:</span>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={toggleMetalMode}
                className={`relative inline-flex items-center h-6 px-1.5 rounded-full cursor-pointer shadow-xs ${
                  metalMode === 'GOLD' ? 'bg-[#ffd700]' : 'bg-slate-300'
                }`}
              >
                {metalMode === 'GOLD' ? (
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] font-black text-slate-950 px-1">Gold</span>
                    <span className="h-4 w-4 rounded-full bg-white shadow-xs" />
                  </div>
                ) : (
                  <div className="flex items-center space-x-1.5">
                    <span className="h-4 w-4 rounded-full bg-white shadow-xs" />
                    <span className="text-[10px] font-black text-slate-900 px-1">Silver</span>
                  </div>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openStockModal();
                }}
                className="h-6 px-2.5 rounded-sm bg-[#ffd700] text-slate-950 font-black text-xs"
              >
                Stock
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-bold text-slate-200 hover:bg-white/10 rounded"
              >
                {link.name} ({link.sub})
              </Link>
            ))}
          </div>

          <div className="border-t border-slate-700 pt-2 grid grid-cols-2 gap-1.5">
            {moreServices.map((svc) => (
              <Link
                key={svc.path}
                to={svc.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-2 py-1 text-[11px] text-slate-300 hover:text-white"
              >
                {svc.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
