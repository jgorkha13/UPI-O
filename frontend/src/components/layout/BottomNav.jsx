import { NavLink } from 'react-router-dom';
import { Home, Clock, QrCode, User } from 'lucide-react';

const TABS = [
  { to: '/dashboard', icon: Home, label: 'Home' },
  { to: '/history', icon: Clock, label: 'History' },
  { to: '/scan', icon: QrCode, label: 'Scan', center: true },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-bg-secondary border-t shadow-nav"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="max-w-lg mx-auto flex items-end justify-around px-2 pt-2 pb-3">
        {TABS.map(({ to, icon: Icon, label, center }) =>
          center ? (
            <NavLink key={to} to={to} className="flex flex-col items-center -mt-5">
              {({ isActive }) => (
                <>
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-glow-btn transition-all ${
                      isActive ? 'bg-brand-dark scale-105' : 'bg-brand'
                    }`}
                  >
                    <Icon className="w-7 h-7 text-white" strokeWidth={2} />
                  </div>
                  <span className="text-[10px] font-semibold text-brand mt-1">{label}</span>
                </>
              )}
            </NavLink>
          ) : (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors ${
                  isActive ? 'text-brand' : 'text-text-secondary'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] font-semibold">{label}</span>
                </>
              )}
            </NavLink>
          )
        )}
      </div>
    </nav>
  );
}
