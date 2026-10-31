import { NavLink } from 'react-router-dom';
import { Home, Clock, QrCode, User } from 'lucide-react';

const TABS = [
  { to: '/dashboard', icon: Home, label: 'Home' },
  { to: '/history', icon: Clock, label: 'Passbook' },
  { to: '/scan', icon: QrCode, label: 'Scan QR', center: true },
  { to: '/profile', icon: User, label: 'Account' },
];

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800"
    >
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-1.5">
        {TABS.map(({ to, icon: Icon, label, center }) =>
          center ? (
            <NavLink key={to} to={to} className="flex flex-col items-center">
              {({ isActive }) => (
                <>
                  <div
                    className={`w-11 h-11 rounded-lg flex items-center justify-center transition-colors ${
                      isActive ? 'bg-brand text-white shadow-sm' : 'bg-slate-800 text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 mt-0.5">{label}</span>
                </>
              )}
            </NavLink>
          ) : (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                  isActive ? 'text-brand font-semibold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="w-5 h-5" strokeWidth={isActive ? 2.25 : 1.75} />
                  <span className="text-[11px] font-medium">{label}</span>
                </>
              )}
            </NavLink>
          )
        )}
      </div>
    </nav>
  );
}

