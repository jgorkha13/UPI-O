import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, ChevronDown, LogOut, Search } from 'lucide-react';
import { useState, useContext } from 'react';
import { OfflineContext } from '../../context/OfflineContext';
import Logo from '../ui/Logo';
import Avatar from '../ui/Avatar';

export default function AppHeader({
  title,
  showBack = false,
  showStatus = false,
  showSearch = false,
  light = false,
  rightAction,
}) {
  const navigate = useNavigate();
  const { isOnline, pendingTransactions } = useContext(OfflineContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const userName = localStorage.getItem('userName') || 'User';

  const logout = () => {
    ['token', 'userName', 'userId', 'userPhone'].forEach((k) => localStorage.removeItem(k));
    navigate('/login');
  };

  const textClass = light ? 'text-white' : 'text-text-primary';
  const subClass = light ? 'text-white/80' : 'text-text-secondary';

  return (
    <header
      className={`sticky top-0 z-30 ${
        light
          ? 'bg-transparent'
          : 'bg-bg-secondary/90 backdrop-blur-xl border-b'
      }`}
      style={light ? undefined : { borderColor: 'var(--color-border)' }}
    >
      <div className="h-14 px-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          {showBack ? (
            <>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className={`p-2 -ml-2 rounded-xl ${light ? 'text-white hover:bg-white/10' : 'text-text-secondary hover:bg-bg-tertiary'}`}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              {title && (
                <h1 className={`text-lg font-bold truncate ${textClass}`}>{title}</h1>
              )}
            </>
          ) : (
            <Logo size="sm" light={light} />
          )}
        </div>

        {showStatus && (
          <div className={`hidden sm:flex items-center gap-1.5 text-xs font-semibold ${subClass}`}>
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-success' : 'bg-warning'}`} />
            {isOnline ? 'Online' : 'Offline'}
            {pendingTransactions.length > 0 && ` · ${pendingTransactions.length} pending`}
          </div>
        )}

        <div className="flex items-center gap-1">
          {showSearch && (
            <button
              type="button"
              className={`p-2 rounded-xl ${light ? 'text-white hover:bg-white/10' : 'text-text-secondary hover:bg-bg-tertiary'}`}
            >
              <Search className="w-5 h-5" />
            </button>
          )}
          <button
            type="button"
            className={`p-2 rounded-xl relative ${light ? 'text-white hover:bg-white/10' : 'text-text-secondary hover:bg-bg-tertiary'}`}
          >
            <Bell className="w-5 h-5" />
            {pendingTransactions.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
            )}
          </button>
          {rightAction}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className={`flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-xl ${
                light ? 'hover:bg-white/10' : 'hover:bg-bg-tertiary'
              }`}
            >
              <Avatar name={userName} size="sm" />
              {!showBack && (
                <ChevronDown className={`w-3.5 h-3.5 hidden sm:block ${subClass}`} />
              )}
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div
                  className="absolute right-0 top-full mt-2 w-44 bg-bg-secondary rounded-2xl shadow-card border p-1 z-20"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <button
                    type="button"
                    onClick={() => { setMenuOpen(false); navigate('/profile'); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-text-primary hover:bg-bg-tertiary rounded-xl"
                  >
                    Profile
                  </button>
                  <button
                    type="button"
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-danger hover:bg-danger/5 rounded-xl"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
