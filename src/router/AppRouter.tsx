import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { DashboardLayout } from '../components/layout/DashboardLayout';

import { LoginPage } from '../pages/auth/LoginPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { ExchangePage } from '../pages/exchange/ExchangePage';
import { BuySellPage } from '../pages/buy-sell/BuySellPage';
import { LoanPage } from '../pages/loan/LoanPage';
import { LedgerSummaryPage } from '../pages/ledger/LedgerSummaryPage';
import { CustomerListPage } from '../pages/customer/CustomerListPage';
import { ExpenseIncomePage } from '../pages/expense/ExpenseIncomePage';
import { HallmarkPage } from '../pages/hallmark/HallmarkPage';
import { JewelleryPage } from '../pages/jewellery/JewelleryPage';
import { RefineryBillingPage } from '../pages/billing/RefineryBillingPage';
import { BullionBillingPage } from '../pages/billing/BullionBillingPage';
import { DayBookPage } from '../pages/day-book/DayBookPage';
import { CertificatePage } from '../pages/certificate/CertificatePage';
import { KharMelPage } from '../pages/khar-mel/KharMelPage';
import { TouchFormPage } from '../pages/touch-form/TouchFormPage';
import { ExtraSettingsPage } from '../pages/settings/ExtraSettingsPage';

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/exchange" element={<ExchangePage />} />
          <Route path="/buy-sell" element={<BuySellPage />} />
          <Route path="/loan" element={<LoanPage />} />
          <Route path="/ledger" element={<LedgerSummaryPage />} />
          <Route path="/customers" element={<CustomerListPage />} />
          <Route path="/expenses" element={<ExpenseIncomePage />} />
          <Route path="/hallmark" element={<HallmarkPage />} />
          <Route path="/jewellery" element={<JewelleryPage />} />
          <Route path="/billing/refinery" element={<RefineryBillingPage />} />
          <Route path="/billing/bullion" element={<BullionBillingPage />} />
          <Route path="/billing/hallmark" element={<HallmarkPage />} />
          <Route path="/services/refinery" element={<RefineryBillingPage />} />
          <Route path="/day-book" element={<DayBookPage />} />
          <Route path="/certificates" element={<CertificatePage />} />
          <Route path="/khar-mel" element={<KharMelPage />} />
          <Route path="/touch-form" element={<TouchFormPage />} />
          <Route path="/settings/extra" element={<ExtraSettingsPage />} />
          <Route path="/settings/shop" element={<ExtraSettingsPage />} />
          <Route path="/settings" element={<ExtraSettingsPage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

