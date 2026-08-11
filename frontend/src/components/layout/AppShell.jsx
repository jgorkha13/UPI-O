import { useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';

const HIDE_NAV = ['/send', '/add-money', '/services'];

export default function AppShell({ children }) {
  const { pathname } = useLocation();
  const showNav = !HIDE_NAV.some((p) => pathname.startsWith(p));

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-lg mx-auto min-h-screen relative">
        {children}
        {showNav && <BottomNav />}
        {showNav && <div className="h-20" />}
      </div>
    </div>
  );
}
