import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, RefreshCw, Search, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import AppHeader from '../components/layout/AppHeader';
import PageTransition, { staggerContainer, staggerItem } from '../components/ui/PageTransition';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import GradientSpinner from '../components/ui/GradientSpinner';
import { getTransactions } from '../api/transactions';
import { formatCurrency, formatDateTime, getDateGroup } from '../utils/format';

const FILTERS = ['All', 'Sent', 'Received'];

function TxModal({ tx, userPhone, onClose }) {
  const sent = tx.sender?.phone === userPhone;
  const other = sent ? tx.receiver : tx.sender;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="enterprise-card w-full max-w-[420px] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-text-secondary hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4 mb-6 pr-8">
          <Avatar name={other?.name || other?.phone} size="lg" />
          <div>
            <p className="font-semibold text-text-primary">{other?.name || 'Unknown'}</p>
            <p className="text-sm text-text-secondary">+91 {other?.phone}</p>
            <p className="text-xs text-brand font-medium mt-0.5">{sent ? 'Money Sent' : 'Money Received'}</p>
          </div>
        </div>

        <p className={`text-3xl font-bold font-mono mb-6 ${sent ? 'text-danger' : 'text-success'}`}>
          {sent ? '-' : '+'}
          {formatCurrency(tx.amount)}
        </p>

        <div className="space-y-3 text-sm border-t border-gray-100 pt-4">
          {[
            ['Status', <Badge key="s" status={tx.status} />],
            ['Date', formatDateTime(tx.createdAt)],
            ['Type', tx.isOffline ? 'Offline' : 'Online'],
            ['Transaction ID', `#${tx.id}`],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-text-secondary">{label}</span>
              <span className="text-text-primary font-medium">{value}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function TransactionHistory() {
  const userPhone = localStorage.getItem('userPhone');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const fetchData = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);
    try {
      setTransactions(await getTransactions());
    } catch {
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const summary = useMemo(() => {
    let spent = 0;
    let received = 0;
    transactions.forEach((tx) => {
      const amount = Number(tx.amount) || 0;
      if (tx.sender?.phone === userPhone) spent += amount;
      else received += amount;
    });
    return { spent, received, net: received - spent };
  }, [transactions, userPhone]);

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      const sent = tx.sender?.phone === userPhone;
      if (filter === 'Sent' && !sent) return false;
      if (filter === 'Received' && sent) return false;

      if (!search.trim()) return true;
      const other = sent ? tx.receiver : tx.sender;
      const q = search.toLowerCase();
      return (
        other?.name?.toLowerCase().includes(q) ||
        other?.phone?.includes(q) ||
        String(tx.amount).includes(q)
      );
    });
  }, [transactions, filter, userPhone, search]);

  const grouped = useMemo(() => {
    const g = {};
    filtered.forEach((tx) => {
      const key = getDateGroup(tx.createdAt);
      if (!g[key]) g[key] = [];
      g[key].push(tx);
    });
    return g;
  }, [filtered]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <GradientSpinner size={48} />
      </div>
    );
  }

  return (
    <PageTransition className="min-h-screen bg-bg pb-6">
      <AppHeader
        title="Passbook"
        showBack
        rightAction={
          <button
            type="button"
            onClick={() => fetchData(true)}
            className="p-2 rounded-xl text-text-secondary hover:bg-gray-100"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        }
      />

      <div className="px-4 mt-2 space-y-4">
        {/* Spent / Received summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="enterprise-card !p-4 border-danger/10 bg-danger/5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-danger/10 flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4 text-danger" />
              </div>
              <span className="text-xs font-semibold text-text-secondary">Money Spent</span>
            </div>
            <p className="text-xl font-bold text-danger">{formatCurrency(summary.spent)}</p>
          </div>
          <div className="enterprise-card !p-4 border-success/10 bg-success/5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-success/10 flex items-center justify-center">
                <ArrowDownLeft className="w-4 h-4 text-success" />
              </div>
              <span className="text-xs font-semibold text-text-secondary">Money Received</span>
            </div>
            <p className="text-xl font-bold text-success">{formatCurrency(summary.received)}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Search by name or phone number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-enterprise pl-10 text-sm"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                filter === f
                  ? 'bg-brand text-white shadow-glow-btn'
                  : 'bg-white text-text-secondary border border-gray-100'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {refreshing && (
          <div className="flex justify-center py-3">
            <GradientSpinner size={24} />
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="enterprise-card py-16 text-center">
            <div className="text-4xl mb-4">📭</div>
            <p className="font-semibold">No transactions found</p>
            <p className="text-sm text-text-secondary mt-1">
              {search ? 'Try a different search' : filter === 'All' ? 'Your history will appear here' : `No ${filter.toLowerCase()} yet`}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {Object.entries(grouped).map(([group, txs]) => (
              <div key={group}>
                <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 px-1">
                  {group}
                </h3>
                <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-2">
                  {txs.map((tx) => {
                    const sent = tx.sender?.phone === userPhone;
                    const other = sent ? tx.receiver : tx.sender;
                    const name = other?.name || 'Unknown';
                    return (
                      <motion.button
                        key={tx.id}
                        type="button"
                        variants={staggerItem}
                        onClick={() => setSelected(tx)}
                        className="w-full enterprise-card !p-3.5 flex items-center gap-3 text-left active:scale-[0.99] transition-transform"
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          sent ? 'bg-danger/10' : 'bg-success/10'
                        }`}>
                          {sent ? (
                            <ArrowUpRight className="w-5 h-5 text-danger" />
                          ) : (
                            <ArrowDownLeft className="w-5 h-5 text-success" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{name}</p>
                          <p className="text-xs text-text-secondary">
                            {sent ? 'Paid' : 'Received'} · +91 {other?.phone}
                          </p>
                          <p className="text-[10px] text-text-secondary mt-0.5">{formatDateTime(tx.createdAt)}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <p className={`text-sm font-bold ${sent ? 'text-danger' : 'text-success'}`}>
                            {sent ? '-' : '+'}
                            {formatCurrency(tx.amount)}
                          </p>
                          <ArrowRight className="w-3.5 h-3.5 text-text-secondary" />
                        </div>
                      </motion.button>
                    );
                  })}
                </motion.div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <TxModal tx={selected} userPhone={userPhone} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </PageTransition>
  );
}

export default TransactionHistory;
