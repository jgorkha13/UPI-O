import { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Eye,
  EyeOff,
  ChevronRight,
  WifiOff,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'react-toastify';
import AppHeader from '../components/layout/AppHeader';
import PageTransition, { staggerContainer, staggerItem } from '../components/ui/PageTransition';
import Avatar from '../components/ui/Avatar';
import GradientSpinner from '../components/ui/GradientSpinner';
import QuickActionGrid from '../components/ui/QuickActionGrid';
import PromoBanner from '../components/ui/PromoBanner';
import { OfflineContext } from '../context/OfflineContext';
import { getWallet } from '../api/wallet';
import { getTransactions } from '../api/transactions';
import { formatCurrency, formatRelativeTime } from '../utils/format';
import { getCachedWallet, setCachedWallet } from '../utils/walletCache';

function Counter({ value, duration = 500 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const target = Number(value) || 0;
    const start = performance.now();
    const from = display;
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(from + (target - from) * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return display.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function Dashboard() {
  const navigate = useNavigate();
  const { isOnline, pendingTransactions, walletVersion } = useContext(OfflineContext);
  const userName = localStorage.getItem('userName') || 'User';
  const userPhone = localStorage.getItem('userPhone');
  const [wallet, setWallet] = useState(() => getCachedWallet());
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);
  const [usingCache, setUsingCache] = useState(false);

  const fetchData = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);
    setUsingCache(false);

    if (!isOnline) {
      const cached = getCachedWallet();
      if (cached) {
        setWallet(cached);
        setUsingCache(true);
      }
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      const [w, tx] = await Promise.all([getWallet(), getTransactions()]);
      setWallet(w);
      setCachedWallet(w);
      setTransactions(tx.slice(0, 5));
    } catch {
      const cached = getCachedWallet();
      if (cached) {
        setWallet(cached);
        setUsingCache(true);
      } else {
        toast.error('Failed to load dashboard');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isOnline, walletVersion]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getTx = (tx) => {
    const sent = tx.sender?.phone === userPhone;
    const other = sent ? tx.receiver : tx.sender;
    return { sent, name: other?.name || other?.phone || 'Unknown', amount: tx.amount, time: tx.createdAt };
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <GradientSpinner size={48} />
      </div>
    );
  }

  const balance = Number(wallet?.balance ?? 0);
  const offlineLimit = Number(wallet?.offlineLimit ?? 2000);
  const offlineSpent = Number(wallet?.offlineSpent ?? 0);
  const offlineRemaining = Math.max(0, offlineLimit - offlineSpent);
  const offlinePercent = offlineLimit > 0 ? Math.min(100, (offlineSpent / offlineLimit) * 100) : 0;

  return (
    <PageTransition className="min-h-screen bg-bg">
      {/* Purple hero header */}
      <div className="phonepe-hero rounded-b-3xl pb-16 pt-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
        <AppHeader showStatus showSearch light />
        <div className="px-5 mt-2 relative z-10">
          <p className="text-white/80 text-sm">{greeting()},</p>
          <p className="text-white text-xl font-bold">{userName.split(' ')[0]} 👋</p>
        </div>
      </div>

      {/* Balance card — overlaps hero */}
      <div className="px-4 -mt-10 relative z-20 space-y-4 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="enterprise-card shadow-card-hover !p-5"
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              UPI-O Wallet
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fetchData(true)}
                className="p-1.5 rounded-lg text-text-secondary hover:bg-bg-tertiary"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <button
                type="button"
                onClick={() => setHideBalance(!hideBalance)}
                className="p-1.5 rounded-lg text-text-secondary hover:bg-bg-tertiary"
              >
                {hideBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <p className="text-3xl font-bold text-text-primary font-mono tracking-tight">
            {hideBalance ? '₹ ••••' : <>₹ <Counter value={wallet?.balance ?? 0} /></>}
          </p>
          <p className="text-xs text-text-secondary mt-1">Total money in your wallet</p>
          <div className="mt-4 pt-4 border-t space-y-3" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
                  <WifiOff className="w-3.5 h-3.5 text-warning" />
                  Offline spending left
                </p>
                <p className="text-lg font-bold text-brand mt-0.5">
                  {hideBalance ? '₹ ••••' : formatCurrency(offlineRemaining)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-text-secondary">Offline cap</p>
                <p className="text-sm font-semibold text-text-primary">{formatCurrency(offlineLimit)}</p>
              </div>
            </div>
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full bg-brand rounded-full transition-all"
                style={{ width: `${offlinePercent}%` }}
              />
            </div>
            <p className="text-[10px] text-text-secondary leading-relaxed">
              Used offline: {formatCurrency(offlineSpent)} · You can queue up to{' '}
              <strong>{hideBalance ? '••••' : formatCurrency(Math.min(balance, offlineRemaining))}</strong>{' '}
              per payment without internet (limited by balance & offline cap).
            </p>
          </div>
          <p className="text-[10px] text-text-secondary mt-3 pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
            Last updated: {formatRelativeTime(wallet?.lastSyncAt)}
          </p>
        </motion.div>

        {(usingCache || !isOnline) && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-warning/10 border border-warning/20 text-sm text-warning">
            <WifiOff className="w-4 h-4 shrink-0" />
            {usingCache ? 'Showing cached balance' : 'You are offline'}
          </div>
        )}

        {pendingTransactions.length > 0 && (
          <div className="enterprise-card !p-4 border-brand/20 bg-brand-soft/30">
            <p className="text-sm font-bold text-brand mb-2">
              Pending Sync ({pendingTransactions.length})
            </p>
            {pendingTransactions.map((tx) => (
              <div key={tx.nonce} className="flex justify-between text-sm py-1.5">
                <span className="text-text-secondary">→ +91 {tx.receiverPhone}</span>
                <span className="font-bold text-brand">{formatCurrency(tx.amount)}</span>
              </div>
            ))}
          </div>
        )}

        <QuickActionGrid />
        <PromoBanner />

        {/* Recent transactions */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <p className="text-sm font-bold text-text-primary">Recent Transactions</p>
            <button
              type="button"
              onClick={() => navigate('/history')}
              className="text-xs font-semibold text-brand flex items-center gap-0.5"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {transactions.length === 0 ? (
            <div className="enterprise-card py-10 text-center">
              <p className="text-3xl mb-2">💳</p>
              <p className="font-semibold text-text-primary">No transactions yet</p>
              <p className="text-xs text-text-secondary mt-1">Send money to get started</p>
            </div>
          ) : (
            <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-2">
              {transactions.map((tx) => {
                const { sent, name, amount, time } = getTx(tx);
                return (
                  <motion.div
                    key={tx.id}
                    variants={staggerItem}
                    className="enterprise-card !p-3.5 flex items-center gap-3 cursor-pointer active:scale-[0.99] transition-transform"
                    onClick={() => navigate('/history')}
                  >
                    <Avatar name={name} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-primary truncate">{name}</p>
                      <p className="text-xs text-text-secondary">{sent ? 'Paid' : 'Received'} · {formatRelativeTime(time)}</p>
                    </div>
                    <p className={`text-sm font-bold ${sent ? 'text-danger' : 'text-success'}`}>
                      {sent ? '-' : '+'}{formatCurrency(amount)}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

export default Dashboard;
