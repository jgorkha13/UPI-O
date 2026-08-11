import { useNavigate } from 'react-router-dom';
import {
  Send,
  Plus,
  QrCode,
  Smartphone,
  Zap,
  Tv,
  CreditCard,
  Gift,
  WifiOff,
} from 'lucide-react';
import { toast } from 'react-toastify';

const PRIMARY = [
  { label: 'Send', icon: Send, color: 'bg-brand', path: '/send' },
  { label: 'Add Money', icon: Plus, color: 'bg-success', path: '/add-money' },
  { label: 'Scan', icon: QrCode, color: 'bg-accent-blue', path: '/scan' },
  { label: 'Offline Pay', icon: WifiOff, color: 'bg-warning', path: '/send', badge: 'New' },
];

const SERVICES = [
  { label: 'Recharge', icon: Smartphone, color: 'bg-orange-500' },
  { label: 'Electricity', icon: Zap, color: 'bg-yellow-500' },
  { label: 'DTH', icon: Tv, color: 'bg-red-500' },
  { label: 'Credit Card', icon: CreditCard, color: 'bg-blue-600' },
  { label: 'Rewards', icon: Gift, color: 'bg-pink-500' },
];

export default function QuickActionGrid() {
  const navigate = useNavigate();

  const handleClick = (item) => {
    if (item.path) {
      navigate(item.path);
      return;
    }
    toast.info(`${item.label} coming soon!`);
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-bold text-text-primary mb-3 px-1">Quick Actions</p>
        <div className="flex gap-4 overflow-x-auto pb-1 px-1 scrollbar-hide">
          {PRIMARY.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleClick(item)}
              className="quick-action-btn shrink-0 relative"
            >
              <div className={`quick-action-icon ${item.color}`}>
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-semibold text-text-primary">{item.label}</span>
              {item.badge && (
                <span className="absolute -top-1 right-0 text-[9px] font-bold bg-danger text-white px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <p className="text-sm font-bold text-text-primary">Pay Bills & More</p>
          <button
            type="button"
            onClick={() => navigate('/services')}
            className="text-xs font-semibold text-brand"
          >
            View All
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-1 px-1">
          {SERVICES.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleClick(item)}
              className="quick-action-btn shrink-0"
            >
              <div className={`quick-action-icon ${item.color}`}>
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-text-secondary">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
