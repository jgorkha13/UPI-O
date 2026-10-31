import { useState, useEffect, useCallback, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Eye,
  EyeOff,
  ChevronRight,
  WifiOff,
  RefreshCw,
  ArrowUpRight,
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
import { isRecharge, transactionLabel, transactionSubLabel } from '../utils/transaction';
import { getCachedWallet, setCachedWallet } from '../utils/walletCache';

const CACHED_TX_KEY = 'upio_cached_transactions';

function Dashboard() {
  const navigate = useNavigate();
  const { isOnline, pendingTransactions, walletVersion } = useContext(OfflineContext);
  const userName = localStorage.getItem('userName') || 'User';
  const userPhone = localStorage.getItem('userPhone');
  const [wallet, setWallet] = useState(() => getCachedWallet());
  const [allTransactions, setAllTransactions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CACHED_TX_KEY) || '[]');
    } catch {
      return [];
    }
  });
  const [transactions, setTransactions] = useState(() => allTransactions.slice(0, 5));
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
      setAllTransactions(tx);
      setTransactions(tx.slice(0, 5));
      try {
        localStorage.setItem(CACHED_TX_KEY, JSON.stringify(tx));
      } catch {
        // quota exceeded guard
      }
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
  }, [isOnline]);

  useEffect(() => {
    fetchData();
  }, [fetchData, walletVersion]);

  // Calculate today's spending (both synced transactions + offline queued)
  const { todaySpent, todayTxCount } = useMemo(() => {
    const todayStr = new Date().toDateString();

    let spent = 0;
    let count = 0;

    allTransactions.forEach((tx) => {
      const isSent = tx.sender?.phone === userPhone || isRecharge(tx);
      const isToday = tx.createdAt && new Date(tx.createdAt).toDateString() === todayStr;
      const isCompleted = tx.status === 'COMPLETED' || !tx.status;
      if (isSent && isToday && isCompleted) {
        spent += Number(tx.amount || 0);
        count += 1;
      }
    });

    // Add locally queued offline transactions created today
    pendingTransactions.forEach((tx) => {
      const isToday = tx.createdAt ? new Date(tx.createdAt).toDateString() === todayStr : true;
      if (isToday) {
        spent += Number(tx.amount || 0);
        count += 1;
      }
    });

    return { todaySpent: spent, todayTxCount: count };
  }, [allTransactions, pendingTransactions, userPhone]);

  const getTx = (tx) => {
    const sent = tx.sender?.phone === userPhone || isRecharge(tx);
    const other = sent ? tx.receiver : tx.sender;
    return {
      sent,
      name: transactionLabel(tx, { sent, fallbackName: other?.name || other?.phone || 'Unknown' }),
      sub: isRecharge(tx) ? transactionSubLabel(tx, { sent }) : null,
      amount: tx.amount,
      time: tx.createdAt,
    };
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
      {/* Professional banking header */}
      <div className="bg-slate-900 text-white pb-12 pt-2 border-b border-slate-800">
        <AppHeader showStatus showSearch light />
        <div className="px-5 mt-3 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{greeting()}</p>
            <p className="text-white text-lg font-bold">{userName.split(' ')[0]}</p>
          </div>
          <div className="text-right">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
              isOnline ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60' : 'bg-amber-950/60 text-amber-400 border border-amber-800/60'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              {isOnline ? 'Online mode' : 'Offline mode'}
            </span>
          </div>
        </div>
      </div>

      {/* Balance card — overlaps hero */}
      <div className="px-4 -mt-7 relative z-20 space-y-4 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="enterprise-card !p-5 shadow-sm border border-slate-200 dark:border-slate-800"
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
            {hideBalance ? '₹ ••••' : formatCurrency(wallet?.balance ?? 0)}
          </p>
          <p className="text-xs text-text-secondary mt-0.5">Available wallet balance</p>

          {/* Quick Metrics: Today's Outflow + Offline Quota */}
          <div className="grid grid-cols-2 gap-2.5 mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800">
            <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <ArrowUpRight className="w-3.5 h-3.5 text-rose-500" />
                <span className="font-medium">Spent Today</span>
              </div>
              <p className="text-base font-bold text-slate-900 dark:text-slate-100 font-mono mt-1">
                {hideBalance ? '••••' : formatCurrency(todaySpent)}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {todayTxCount} payment{todayTxCount === 1 ? '' : 's'} today
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <WifiOff className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-medium">Offline Quota</span>
              </div>
              <p className="text-base font-bold text-slate-900 dark:text-slate-100 font-mono mt-1">
                {hideBalance ? '••••' : formatCurrency(offlineRemaining)}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Max {formatCurrency(offlineLimit)}
              </p>
            </div>
          </div>

          <div className="mt-3.5 pt-3.5 border-t space-y-2.5" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Offline reserve usage</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {formatCurrency(offlineSpent)} of {formatCurrency(offlineLimit)}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-brand rounded-full transition-all"
                style={{ width: `${offlinePercent}%` }}
              />
            </div>
            <p className="text-[10px] text-text-secondary leading-relaxed">
              You can queue up to{' '}
              <strong>{hideBalance ? '••••' : formatCurrency(Math.min(balance, offlineRemaining))}</strong>{' '}
              without internet connection.
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
                const { sent, name, sub, amount, time } = getTx(tx);
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
                      <p className="text-xs text-text-secondary">
                        {sub || (sent ? 'Paid' : 'Received')} · {formatRelativeTime(time)}
                      </p>
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
