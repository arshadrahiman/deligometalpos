import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Sparkles, Phone, Lock, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [mobile, setMobile] = useState('7879404501');
  const [password, setPassword] = useState('12345');
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto advance
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!mobile.trim() || !password.trim()) {
      setErrorMessage('User Name and Password are required');
      return;
    }

    setIsLoading(true);
    const result = await login(mobile, password);
    setIsLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-brand-nav to-slate-950 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 border border-slate-100 animate-fade-in relative overflow-hidden">
        {/* Decorative Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-brand-maroon via-brand-gold to-brand-blue" />

        {/* Brand Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-maroon text-brand-gold shadow-lg mb-1">
            <Sparkles className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-normal font-lobster text-brand-maroon tracking-wide">
            Lakshmi Gold Testing
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Hambire Solutions Bullion & Jewellery ERP
          </p>
        </div>

        {/* Error Feedback */}
        {errorMessage && (
          <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 font-medium flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mobile Number */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">
              Mobile Number (यूजर नाम)
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Mobile Number"
                className="w-full pl-11 pr-4 h-11 text-sm rounded-2xl border border-slate-300 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all font-medium"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">
              Password (पासवर्ड)
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-11 pr-4 h-11 text-sm rounded-2xl border border-slate-300 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all font-medium"
              />
            </div>
          </div>

          {/* Optional OTP Flow */}
          {showOtp && (
            <div className="space-y-2 pt-2 animate-fade-in">
              <label className="text-xs font-semibold text-slate-700 text-center block">
                Enter 4-Digit OTP
              </label>
              <div className="flex justify-center space-x-3">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-12 h-12 text-center text-xl font-bold rounded-xl border border-slate-300 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Remember & Forgot Row */}
          <div className="flex items-center justify-between text-xs pt-1">
            <button
              type="button"
              onClick={() => setShowOtp(!showOtp)}
              className="text-slate-500 hover:text-brand-blue transition-colors flex items-center space-x-1"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{showOtp ? 'Hide OTP' : 'Login with OTP'}</span>
            </button>

            <button
              type="button"
              onClick={() => setForgotModalOpen(true)}
              className="text-brand-blue font-semibold hover:underline"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-brand-blue text-white font-bold text-sm rounded-full shadow-lg hover:bg-blue-600 active:scale-98 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{isLoading ? 'VERIFYING...' : 'LOG IN'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Security Footer Notice */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-center space-x-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>256-Bit SSL Encrypted Banking Grade Session</span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center space-x-1.5">
              <HelpCircle className="h-5 w-5 text-brand-blue" />
              <span>Reset Credentials</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              To reset your administrative password or recover test account access, contact
              Hambire Solutions technical support helpline at{' '}
              <span className="font-bold text-brand-maroon">+91 7879404501</span>.
            </p>
            <button
              onClick={() => setForgotModalOpen(false)}
              className="w-full py-2 bg-slate-100 text-slate-800 font-semibold rounded-lg text-xs hover:bg-slate-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

