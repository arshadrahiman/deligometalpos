import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import {
  Video,
  MessageSquare,
  BookOpen,
  Award,
  FlaskConical,
  FileCheck2,
  Settings,
  LogOut,
  Sparkles,
  Clock,
  Shield,
  Smartphone,
  CreditCard,
  KeyRound,
  RefreshCw,
  Edit3,
  Save,
} from 'lucide-react';
import { getItem, setItem } from '../../services/storage';

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { openStockModal, openBhavcutModal, showToast } = useUIStore();
  const navigate = useNavigate();

  // Flip countdown timer simulation
  const [timeLeft, setTimeLeft] = useState({
    days: user?.subscriptionDaysRemaining || 7845,
    hours: 14,
    minutes: 32,
    seconds: 45,
  });

  // Notepad persistence
  const [notepadText, setNotepadText] = useState(() =>
    getItem('hs_notepad_notes', 'Lakshmi Gold Testing Daily Notes & Reminders:\n- Follow up with Anil Karigar for pending 12.5g bangle order.\n- Bullion rate booking at ₹75,500.')
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSaveNotes = () => {
    setItem('hs_notepad_notes', notepadText);
    showToast('Your notepad notes have been saved locally!');
  };

  const quickPods = [
    { label: 'TRAINING', sub: 'ट्रेनिंग वीडियो', icon: Video, color: 'bg-purple-600', link: '/training' },
    { label: 'WHATSAPP', sub: 'व्हाट्सएप सेटिंग', icon: MessageSquare, color: 'bg-emerald-600', link: '/settings/whatsapp' },
    { label: 'DAY BOOK', sub: 'दैनिक बहीखाता', icon: BookOpen, color: 'bg-blue-600', link: '/day-book' },
    { label: 'CERTIFICATE', sub: 'प्योरिटी सर्टिफिकेट', icon: Award, color: 'bg-amber-600', link: '/certificates' },
    { label: 'KHAR / MEL', sub: 'खार / मेल कैलकुलेटर', icon: FlaskConical, color: 'bg-teal-600', link: '/khar-mel' },
    { label: 'TOUCH FORM', sub: 'टंच टेस्टिंग रिपोर्ट', icon: FileCheck2, color: 'bg-indigo-600', link: '/touch-form' },
    { label: 'SETTINGS', sub: 'सॉफ्टवेयर सेटिंग्स', icon: Settings, color: 'bg-slate-700', link: '/settings/shop' },
    {
      label: 'LOGOUT',
      sub: 'लॉगआउट',
      icon: LogOut,
      color: 'bg-rose-700',
      action: () => {
        logout();
        navigate('/login');
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Account Profile & Subscription Flip Countdown Card */}
      <div className="rounded-2xl bg-linear-to-r from-brand-nav via-slate-900 to-brand-maroon p-5 sm:p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center space-x-4 z-10">
          <div className="h-16 w-16 rounded-2xl bg-brand-maroon border-2 border-brand-gold flex items-center justify-center text-brand-gold shadow-lg shrink-0">
            <Sparkles className="h-8 w-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl sm:text-2xl font-bold tracking-tight">
                {user?.shopName || 'Lakshmi Gold Testing'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-brand-gold text-slate-900 uppercase">
                {user?.role || 'ADMINISTRATOR'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Authorized User: <span className="text-white font-semibold">{user?.name}</span> (
              {user?.mobile})
            </p>
          </div>
        </div>

        {/* Live Countdown Flip Digits */}
        <div className="flex flex-col items-center md:items-end z-10">
          <div className="flex items-center space-x-1 text-xs text-amber-200 font-semibold mb-1">
            <Clock className="h-3.5 w-3.5 text-brand-gold" />
            <span>Active License Validity (वैधता)</span>
          </div>
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {[
              { label: 'DAYS', val: timeLeft.days },
              { label: 'HRS', val: String(timeLeft.hours).padStart(2, '0') },
              { label: 'MIN', val: String(timeLeft.minutes).padStart(2, '0') },
              { label: 'SEC', val: String(timeLeft.seconds).padStart(2, '0') },
            ].map((box, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="h-11 w-12 sm:w-14 bg-black/80 rounded-lg border border-slate-700 flex items-center justify-center font-mono text-base sm:text-lg font-black text-brand-gold shadow-inner">
                  {box.val}
                </div>
                <span className="text-[9px] font-bold text-slate-400 mt-0.5">{box.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. 8 Quick Action Pods */}
      <div>
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
          Quick Launch Features (त्वरित सेवाएं)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {quickPods.map((pod, i) => {
            const Icon = pod.icon;
            const content = (
              <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-brand-maroon transition-all group text-center h-24">
                <div
                  className={`h-9 w-9 rounded-lg ${pod.color} text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform mb-1.5`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-bold text-slate-800 line-clamp-1">{pod.label}</span>
                <span className="text-[9px] text-slate-400">{pod.sub}</span>
              </div>
            );

            return pod.action ? (
              <button key={i} onClick={pod.action} className="w-full">
                {content}
              </button>
            ) : (
              <Link key={i} to={pod.link!} className="w-full">
                {content}
              </Link>
            );
          })}
        </div>
      </div>

      {/* 3. Your Note Pad (WYSIWYG Style) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center space-x-2">
            <Edit3 className="h-4 w-4 text-brand-maroon" />
            <h3 className="text-sm font-bold text-slate-800">Your Note Pad (दैनिक नोट्स)</h3>
          </div>
          <button
            onClick={handleSaveNotes}
            className="flex items-center space-x-1 px-3 py-1 bg-brand-maroon text-white rounded text-xs font-semibold hover:bg-brand-maroon-dark transition-colors shadow-xs"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save Notes</span>
          </button>
        </div>
        <textarea
          rows={4}
          value={notepadText}
          onChange={(e) => setNotepadText(e.target.value)}
          placeholder="Write your quick reminders, Karigar follow-ups, or notes here..."
          className="w-full p-3 text-xs text-slate-800 bg-amber-50/30 rounded-lg border border-amber-200 focus:outline-none focus:ring-1 focus:ring-brand-maroon leading-relaxed"
        />
      </div>

      {/* 4. General Settings Grid */}
      <div>
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
          General Settings & Software Hub
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <button
            onClick={openStockModal}
            className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-brand-gold hover:shadow-md transition-all text-left flex items-start space-x-3 group"
          >
            <div className="p-2.5 rounded-lg bg-amber-100 text-amber-800 group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Gold & Silver Stock</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Manage vault stock, rates & Poonjee</p>
            </div>
          </button>

          <Link
            to="/customers"
            className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-brand-maroon hover:shadow-md transition-all text-left flex items-start space-x-3 group"
          >
            <div className="p-2.5 rounded-lg bg-rose-100 text-brand-maroon group-hover:scale-105 transition-transform">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Customer Directory</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Manage customer profiles and tax data</p>
            </div>
          </Link>

          <button
            onClick={openBhavcutModal}
            className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-brand-blue hover:shadow-md transition-all text-left flex items-start space-x-3 group"
          >
            <div className="p-2.5 rounded-lg bg-blue-100 text-brand-blue group-hover:scale-105 transition-transform">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Bhavcut Calculator</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Instant gold to rupee conversion</p>
            </div>
          </button>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-left flex items-start space-x-3">
            <div className="p-2.5 rounded-lg bg-slate-100 text-slate-700">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Devices Logged In</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">1 active desktop session</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

