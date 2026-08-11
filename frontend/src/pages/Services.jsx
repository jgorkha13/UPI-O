import { useNavigate } from 'react-router-dom';
import {
  Smartphone,
  Zap,
  Tv,
  Droplets,
  Flame,
  Wifi,
  CreditCard,
  Building2,
  GraduationCap,
  Shield,
} from 'lucide-react';
import { toast } from 'react-toastify';
import AppHeader from '../components/layout/AppHeader';

const CATEGORIES = [
  {
    title: 'Recharge & Bills',
    items: [
      { icon: Smartphone, label: 'Mobile Recharge', color: 'bg-orange-500' },
      { icon: Zap, label: 'Electricity', color: 'bg-yellow-500' },
      { icon: Tv, label: 'DTH', color: 'bg-red-500' },
      { icon: Wifi, label: 'Broadband', color: 'bg-blue-500' },
    ],
  },
  {
    title: 'Utilities',
    items: [
      { icon: Droplets, label: 'Water', color: 'bg-cyan-500' },
      { icon: Flame, label: 'Gas Cylinder', color: 'bg-orange-600' },
      { icon: Building2, label: 'Rent', color: 'bg-indigo-500' },
      { icon: GraduationCap, label: 'Education', color: 'bg-purple-500' },
    ],
  },
  {
    title: 'Finance',
    items: [
      { icon: CreditCard, label: 'Credit Card', color: 'bg-blue-600' },
      { icon: Shield, label: 'Insurance', color: 'bg-green-600' },
    ],
  },
];

export default function Services() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg pb-6">
      <AppHeader title="All Services" showBack />

      <div className="px-4 space-y-6 mt-2">
        <div className="rounded-2xl bg-gradient-to-r from-brand to-brand-light p-4 text-white">
          <p className="font-bold">Pay Bills & Recharge</p>
          <p className="text-sm opacity-90 mt-1">100+ billers · Instant confirmation</p>
        </div>

        {CATEGORIES.map(({ title, items }) => (
          <div key={title}>
            <p className="text-sm font-bold text-text-primary mb-3">{title}</p>
            <div className="grid grid-cols-4 gap-3">
              {items.map(({ icon: Icon, label, color }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => toast.info(`${label} — coming soon!`)}
                  className="flex flex-col items-center gap-2 p-2 rounded-2xl hover:bg-white transition-colors"
                >
                  <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center shadow-card`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[10px] font-semibold text-text-primary text-center leading-tight">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => navigate('/send')}
          className="w-full py-4 rounded-2xl bg-brand text-white font-semibold"
        >
          Send Money Instead
        </button>
      </div>
    </div>
  );
}
