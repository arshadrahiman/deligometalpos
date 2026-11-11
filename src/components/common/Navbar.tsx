import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Scale,
  Calculator,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useStockStore } from '../../store/useStockStore';
import { useUIStore } from '../../store/useUIStore';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { summary } = useStockStore();
  const { openStockModal, openBhavcutModal } = useUIStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'EXCHANGE', sub: 'बदला/ पलटा', path: '/exchange' },
    { name: 'BUY-SELL', sub: 'खरीद बिक्री', path: '/buy-sell' },
    { name: 'LOAN', sub: 'उधार', path: '/loan' },
    { name: 'LEDGER', sub: 'खाता बही', path: '/ledger' },
    { name: 'CUSTOMER', sub: 'ग्राहक', path: '/customers' },
    { name: 'EXPENSE | INCOME', sub: 'खर्च | आय', path: '/expenses' },
    { name: 'HALLMARK', sub: 'हॉलमार्क', path: '/hallmark' },
    { name: 'JEWELLERY', sub: 'जेवर', path: '/jewellery' },
  ];

  const moreServices = [
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
    <nav className="sticky top-0 z-50 bg-brand-nav text-white shadow-md select-none">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 lg:px-4">
        {/* Left: Brand / Shop Name */}
        <Link to="/" className="flex items-center space-x-2 group shrink-0 mr-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-maroon text-brand-gold shadow-sm group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-white line-clamp-1">
              {user?.shopName || 'Lakshmi Gold Testing'}
            </span>
            <span className="text-[10px] text-slate-300 font-medium">Deligo Technologies ERP</span>
          </div>
        </Link>

        {/* Center: Desktop Navigation Bar */}
        <div className="hidden xl:flex items-center space-x-1 flex-1 justify-center">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center px-2 py-1.5 rounded transition-all text-center leading-tight ${
                  isActive
                    ? 'bg-brand-maroon text-brand-gold border-b-2 border-brand-gold font-semibold'
                    : 'text-slate-200 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <span className="text-[11px] font-semibold tracking-wide">{link.name}</span>
              <span className="text-[9px] text-slate-300">{link.sub}</span>
            </NavLink>
          ))}

          {/* More Services Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-1 px-2 py-2 rounded text-slate-200 hover:bg-white/10 hover:text-white text-xs font-semibold"
            >
              <Layers className="h-3.5 w-3.5 text-brand-gold" />
              <span>More</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {dropdownOpen && (
              <div
                className="absolute left-0 mt-1 w-52 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 z-50 text-slate-800"
                onClick={() => setDropdownOpen(false)}
              >
                {moreServices.map((svc) => (
                  <Link
                    key={svc.path}
                    to={svc.path}
                    className="block px-4 py-2 text-xs font-medium hover:bg-slate-100 hover:text-brand-maroon transition-colors"
                  >
                    {svc.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* Gold Stock Modal Button */}
          <button
            onClick={openStockModal}
            className="flex items-center space-x-1.5 bg-brand-gold text-slate-900 font-bold px-2.5 py-1 rounded-full text-xs shadow hover:bg-amber-400 active:scale-95 transition-all"
            title="Open Vault Stock & Poonjee Summary"
          >
            <Scale className="h-3.5 w-3.5 text-slate-900" />
            <span className="hidden sm:inline">Stock:</span>
            <span>{summary?.pureGoldStock?.weightGm?.toFixed(3) || '0.000'} g</span>
          </button>

          {/* Bhavcut Quick Converter */}
          <button
            onClick={openBhavcutModal}
            className="flex items-center space-x-1 bg-white/10 text-white font-medium px-2 py-1 rounded text-xs hover:bg-white/20 active:scale-95 transition-all"
            title="Bhavcut Converter (Gold <-> Currency)"
          >
            <Calculator className="h-3.5 w-3.5 text-brand-gold" />
            <span className="hidden md:inline">Bhavcut</span>
          </button>

          {/* Settings Hub Link */}
          <Link
            to="/settings/extra"
            className="p-1.5 rounded text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
            title="Extra Settings (सॉफ्टवेयर सेटिंग्स)"
          >
            <Settings className="h-4 w-4" />
          </Link>

          {/* Secure Logout */}
          <button
            onClick={handleLogout}
            className="p-1.5 rounded text-red-300 hover:bg-red-900/30 hover:text-red-200 transition-colors"
            title="Secure Logout"
          >
            <LogOut className="h-4 w-4" />
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

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-700 bg-brand-nav px-4 pt-2 pb-4 space-y-1">
          <div className="grid grid-cols-2 gap-1.5 pb-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex flex-col p-2 rounded text-xs ${
                    isActive
                      ? 'bg-brand-maroon text-brand-gold font-semibold'
                      : 'text-slate-200 bg-white/5 hover:bg-white/10'
                  }`
                }
              >
                <span className="font-semibold">{link.name}</span>
                <span className="text-[10px] text-slate-400">{link.sub}</span>
              </NavLink>
            ))}
          </div>

          <div className="border-t border-slate-700 pt-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Specialized Modules
            </span>
            <div className="grid grid-cols-2 gap-1">
              {moreServices.map((svc) => (
                <Link
                  key={svc.path}
                  to={svc.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-2 py-1.5 text-xs text-slate-300 bg-white/5 rounded hover:bg-white/10 hover:text-white"
                >
                  {svc.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

