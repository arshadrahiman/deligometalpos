import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../common/Navbar';
import { Footer } from '../common/Footer';
import { Toast } from '../common/Toast';
import { StockOverviewModal } from '../shared/StockOverviewModal';
import { BhavcutConverterModal } from '../shared/BhavcutConverterModal';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-brand-surface text-slate-800">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 lg:p-6 animate-fade-in">
        <Outlet />
      </main>

      <Footer />

      {/* Global Modals & Notifications */}
      <StockOverviewModal />
      <BhavcutConverterModal />
      <Toast />
    </div>
  );
};

