import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Copy,
  Wallet,
  WifiOff,
  Star,
} from 'lucide-react';
import { toast } from 'react-toastify';
import AppHeader from '../components/layout/AppHeader';
import Avatar from '../components/ui/Avatar';

const MENU = [
  { icon: Wallet, label: 'My Wallet', sub: 'Balance & limits', action: 'wallet' },
  { icon: Shield, label: 'Security', sub: 'PIN, biometrics', action: 'soon' },
  { icon: Bell, label: 'Notifications', sub: 'Alerts & offers', action: 'soon' },
  { icon: WifiOff, label: 'Offline Payments', sub: 'Up to ₹2,000 limit', action: 'offline' },
  { icon: Star, label: 'Rewards', sub: 'Cashback & offers', action: 'soon' },
  { icon: HelpCircle, label: 'Help & Support', sub: '24/7 assistance', action: 'soon' },
];

export default function Profile() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'User';
  const userPhone = localStorage.getItem('userPhone') || '';
  const upiId = `${userPhone}@upio`;

  const copyUpi = () => {
    navigator.clipboard.writeText(upiId);
    toast.success('UPI ID copied!');
  };

  const logout = () => {
    ['token', 'userName', 'userId', 'userPhone'].forEach((k) => localStorage.removeItem(k));
    navigate('/login');
  };

  const handleMenu = (action) => {
    if (action === 'wallet') navigate('/dashboard');
    else if (action === 'offline') toast.info('Send money offline from Quick Actions → Offline Pay');
    else toast.info('Coming soon!');
  };

  return (
    <div className="min-h-screen bg-bg pb-6">
      <AppHeader title="My Profile" />

      <div className="px-4 space-y-4">
        {/* Profile card */}
        <div className="enterprise-card !p-0 overflow-hidden mt-2">
          <div className="phonepe-hero px-5 py-6">
            <div className="flex items-center gap-4">
              <Avatar name={userName} size="lg" />
              <div>
                <p className="text-lg font-bold">{userName}</p>
                <p className="text-sm opacity-90">+91 {userPhone}</p>
              </div>
            </div>
          </div>
          <div className="px-5 py-4 flex items-center justify-between border-t border-gray-100">
            <div>
              <p className="text-xs text-text-secondary font-medium">UPI ID</p>
              <p className="text-sm font-bold text-brand mt-0.5">{upiId}</p>
            </div>
            <button
              type="button"
              onClick={copyUpi}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-soft text-brand text-xs font-semibold"
            >
              <Copy className="w-3.5 h-3.5" />
              Copy
            </button>
          </div>
        </div>

        {/* Verified badge */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-success/10 border border-success/20">
          <Shield className="w-5 h-5 text-success shrink-0" />
          <div>
            <p className="text-sm font-semibold text-success">Verified Account</p>
            <p className="text-xs text-text-secondary">Your account is secure & active</p>
          </div>
        </div>

        {/* Menu */}
        <div className="enterprise-card !p-0 divide-y divide-gray-100">
          {MENU.map(({ icon: Icon, label, sub, action }) => (
            <button
              key={label}
              type="button"
              onClick={() => handleMenu(action)}
              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-brand" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary">{label}</p>
                <p className="text-xs text-text-secondary">{sub}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-text-secondary shrink-0" />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border border-danger/20 text-danger font-semibold hover:bg-danger/5 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
