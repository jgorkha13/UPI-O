import { useState, useEffect, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Search, Loader2, User } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import AppHeader from '../components/layout/AppHeader';
import PageTransition from '../components/ui/PageTransition';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import SuccessOverlay from '../components/ui/SuccessOverlay';
import { OfflineContext } from '../context/OfflineContext';
import { saveOfflineTransaction } from '../services/offlineService';
import { getWallet } from '../api/wallet';
import { getTransactions } from '../api/transactions';
import { lookupUserByPhone } from '../api/users';
import { formatCurrency } from '../utils/format';
import { getCachedWallet, setCachedWallet, adjustCachedWallet } from '../utils/walletCache';
import { getCachedContacts, saveContact, getContactByPhone } from '../utils/contactCache';

const QUICK = [100, 500, 1000, 5000];
const STEPS = ['Recipient', 'Amount', 'Review'];

function StepBar({ step }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                i <= step
                  ? 'bg-brand text-white shadow-glow-btn'
                  : 'bg-white border border-gray-200 text-text-secondary'
              }`}
            >
              {i + 1}
            </div>
            <span className={`text-xs mt-2 hidden sm:block ${i <= step ? 'text-brand' : 'text-text-secondary'}`}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`w-12 sm:w-16 h-0.5 mx-2 transition-all duration-300 ${
                i < step ? 'bg-brand' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function SendMoney() {
  const navigate = useNavigate();
  const { isOnline, setPendingTransactions, refreshWallet } = useContext(OfflineContext);
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [balance, setBalance] = useState(() => getCachedWallet()?.balance ?? 0);
  const [offlineLimit, setOfflineLimit] = useState(() => getCachedWallet()?.offlineLimit ?? 2000);
  const [offlineSpent, setOfflineSpent] = useState(() => getCachedWallet()?.offlineSpent ?? 0);
  const [recent, setRecent] = useState(() => getCachedContacts().slice(0, 5));
  const [searchQuery, setSearchQuery] = useState('');
  const [recipient, setRecipient] = useState(null);
  const [lookupError, setLookupError] = useState('');
  const [lookupWarning, setLookupWarning] = useState('');
  const [lookingUp, setLookingUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const userPhone = localStorage.getItem('userPhone');
  const phoneValid = /^[6-9]\d{9}$/.test(phone) && phone !== userPhone;
  const amountNum = parseFloat(amount);
  const offlineRemaining = Math.max(0, Number(offlineLimit) - Number(offlineSpent));
  const maxOfflineSend = Math.min(balance, offlineRemaining);
  const amountValid = isOnline
    ? amountNum >= 1 && amountNum <= balance
    : amountNum >= 1 && amountNum <= offlineRemaining && amountNum <= balance;
  const step = !phoneValid ? 0 : !amountValid ? 1 : 2;
  const canSend = isOnline
    ? phoneValid && amountValid && recipient && !lookupError
    : phoneValid && amountValid && !lookupError;

  useEffect(() => {
    const cached = getCachedWallet();
    if (cached) {
      setBalance(Number(cached.balance));
      setOfflineLimit(Number(cached.offlineLimit ?? 2000));
      setOfflineSpent(Number(cached.offlineSpent ?? 0));
    }

    if (!isOnline) {
      setRecent(getCachedContacts().slice(0, 10));
      return;
    }

    getWallet()
      .then((w) => {
        setBalance(Number(w.balance));
        setOfflineLimit(Number(w.offlineLimit ?? 2000));
        setOfflineSpent(Number(w.offlineSpent ?? 0));
        setCachedWallet(w);
      })
      .catch(() => {
        if (!cached) toast.error('Could not load balance');
      });
    getTransactions()
      .then((txs) => {
        const seen = new Set();
        const list = [];
        for (const tx of txs) {
          const sent = tx.sender?.phone === userPhone;
          const other = sent ? tx.receiver : tx.sender;
          const key = other?.phone;
          if (key && !seen.has(key) && key !== userPhone) {
            seen.add(key);
            const contact = { name: other.name, phone: other.phone };
            saveContact(contact);
            list.push(contact);
          }
          if (list.length >= 10) break;
        }
        const merged = [...list];
        getCachedContacts().forEach((c) => {
          if (!merged.find((m) => m.phone === c.phone)) merged.push(c);
        });
        setRecent(merged.slice(0, 10));
      })
      .catch(() => setRecent(getCachedContacts().slice(0, 10)));
  }, [isOnline, userPhone]);

  useEffect(() => {
    if (phone.length !== 10 || phone === userPhone) {
      setRecipient(null);
      setLookupWarning('');
      setLookupError(phone === userPhone && phone.length === 10 ? 'Cannot send to yourself' : '');
      return;
    }

    if (!isOnline) {
      const cached = getContactByPhone(phone);
      const recentMatch = recent.find((r) => r.phone === phone);
      const match = cached || recentMatch;

      if (match) {
        setRecipient({ name: match.name, phone: match.phone });
        setLookupError('');
        setLookupWarning('');
      } else {
        setRecipient({ name: `+91 ${phone}`, phone });
        setLookupError('');
        setLookupWarning('Name not saved offline — will verify when you reconnect');
      }
      return;
    }

    setLookingUp(true);
    setLookupError('');
    setLookupWarning('');
    const timer = setTimeout(async () => {
      try {
        const user = await lookupUserByPhone(phone);
        setRecipient(user);
        saveContact({ name: user.name, phone: user.phone });
        setLookupError('');
      } catch (err) {
        setRecipient(null);
        setLookupError(err.response?.data?.error || 'No user found with this number');
      } finally {
        setLookingUp(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [phone, userPhone, isOnline, recent]);

  const filteredRecent = useMemo(() => {
    if (!searchQuery.trim()) return recent;
    const q = searchQuery.toLowerCase();
    return recent.filter(
      (r) => r.name?.toLowerCase().includes(q) || r.phone.includes(q)
    );
  }, [recent, searchQuery]);

  const selectContact = (contact) => {
    setPhone(contact.phone);
    setRecipient({ name: contact.name, phone: contact.phone });
    saveContact(contact);
    setSearchQuery('');
    setLookupError('');
    setLookupWarning('');
  };

  const handleSend = async () => {
    if (!canSend) return;
    setLoading(true);

    const token = localStorage.getItem('token');
    const nonce = uuidv4();
    const transaction = {
      nonce,
      receiverPhone: phone,
      receiverName: recipient?.name,
      amount: amountNum,
      timestamp: new Date().toISOString(),
      status: 'PENDING_SYNC',
      isOffline: !isOnline,
    };

    try {
      if (isOnline) {
        await axios.post(
          'http://localhost:8080/api/transactions',
          { receiverPhone: phone, amount: amountNum, nonce },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const wallet = await refreshWallet();
        if (wallet) setBalance(Number(wallet.balance));
        setShowSuccess(true);
      } else {
        await saveOfflineTransaction(transaction);
        setPendingTransactions((prev) => [...prev, transaction]);
        const updated = adjustCachedWallet(amountNum, { isOffline: true });
        if (updated) {
          setBalance(Number(updated.balance));
          setOfflineLimit(Number(updated.offlineLimit ?? 2000));
          setOfflineSpent(Number(updated.offlineSpent ?? 0));
        }
        toast.info('Transaction queued for sync');
        setShowSuccess(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || 'Failed to send money');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition className="min-h-screen bg-bg pb-10">
      <AppHeader title="Send Money" showBack />

      <div className="max-w-lg mx-auto px-6 mt-6">
        {!isOnline && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-warning/10 border border-warning/25 text-sm text-warning flex items-center gap-2">
            <span className="font-semibold">Offline mode</span>
            — enter any valid number. Name loads from cache or verifies on sync.
          </div>
        )}
        <StepBar step={step} />

        <div className="enterprise-card space-y-6">
          {/* Recipient */}
          <section>
            <h3 className="text-sm font-semibold text-text-primary mb-3">Search by phone number</h3>

            {/* Search contacts */}
            {recent.length > 0 && (
              <div className="relative mb-3">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Search name or number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-enterprise pl-10 text-sm"
                />
              </div>
            )}

            {searchQuery && filteredRecent.length > 0 && (
              <div className="mb-4 rounded-xl border border-gray-100 bg-white overflow-hidden">
                {filteredRecent.map((r) => (
                  <button
                    key={r.phone}
                    type="button"
                    onClick={() => selectContact(r)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-brand-soft/50 text-left border-b border-gray-50 last:border-0"
                  >
                    <Avatar name={r.name} size="sm" />
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{r.name}</p>
                      <p className="text-xs text-text-secondary">+91 {r.phone}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary text-sm font-medium">
                +91
              </span>
              <input
                type="tel"
                inputMode="numeric"
                placeholder="Enter 10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className={`input-enterprise pl-14 pr-12 ${
                  phone.length > 0 && (phoneValid && !lookupError ? 'border-success/50' : phone.length > 0 ? 'border-danger/40' : '')
                }`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2">
                {lookingUp ? (
                  <Loader2 className="w-5 h-5 text-brand animate-spin" />
                ) : phone.length === 10 && phoneValid && !lookupError ? (
                  <Check className="w-5 h-5 text-success" />
                ) : phone.length > 0 ? (
                  <X className="w-5 h-5 text-danger" />
                ) : null}
              </span>
            </div>

            {lookupWarning && phoneValid && (
              <p className="text-xs text-warning mt-2 flex items-center gap-1 bg-warning/10 px-3 py-2 rounded-lg">
                <User className="w-3.5 h-3.5 shrink-0" />
                {lookupWarning}
              </p>
            )}

            {/* Recipient found card */}
            {phoneValid && !lookupError && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 flex items-center gap-3 p-3 rounded-xl bg-brand-soft border border-brand/20"
              >
                <Avatar name={recipient?.name || phone} size="md" />
                <div>
                  <p className="text-sm font-bold text-text-primary">{recipient?.name || `+91 ${phone}`}</p>
                  <p className="text-xs text-text-secondary">+91 {phone}</p>
                </div>
                <Check className="w-5 h-5 text-success ml-auto" />
              </motion.div>
            )}

            {lookupError && phone.length === 10 && (
              <p className="text-xs text-danger mt-2 flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {lookupError}
              </p>
            )}

            {!searchQuery && recent.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-text-secondary mb-2">Recent contacts</p>
                <div className="flex gap-4 overflow-x-auto pb-1">
                  {recent.map((r) => (
                    <button
                      key={r.phone}
                      type="button"
                      onClick={() => selectContact(r)}
                      className={`flex flex-col items-center gap-1.5 shrink-0 group ${
                        phone === r.phone ? 'opacity-100' : 'opacity-80'
                      }`}
                    >
                      <Avatar name={r.name} size="sm" />
                      <span className="text-xs text-text-secondary group-hover:text-brand max-w-[64px] truncate text-center">
                        {r.name?.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Amount */}
          <section>
            <h3 className="text-sm font-semibold text-text-primary mb-3">How much?</h3>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary font-semibold text-lg">
                ₹
              </span>
              <input
                type="number"
                inputMode="decimal"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-enterprise pl-10 text-2xl font-bold font-mono"
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {QUICK.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setAmount(String(q))}
                  className={`w-20 py-2.5 rounded-md text-sm font-semibold border transition-all duration-200 ${
                    amount === String(q)
                      ? 'bg-brand/10 border-brand text-brand'
                      : 'bg-white border-gray-200 text-text-secondary hover:border-brand/30'
                  }`}
                >
                  ₹{q}
                </button>
              ))}
            </div>
            <div className="mt-3 p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-2 text-xs">
              {isOnline ? (
                <div className="flex justify-between">
                  <span className="text-text-secondary">Wallet balance</span>
                  <span className="font-bold text-text-primary">{formatCurrency(balance)}</span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Wallet balance (cached)</span>
                    <span className="font-bold text-text-primary">{formatCurrency(balance)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Offline spending left</span>
                    <span className="font-bold text-brand">{formatCurrency(offlineRemaining)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Max you can send now</span>
                    <span className="font-bold text-success">{formatCurrency(maxOfflineSend)}</span>
                  </div>
                  <p className="text-[10px] text-text-secondary pt-1 border-t border-gray-200">
                    Offline cap is ₹{offlineLimit} total without internet. Already used offline: {formatCurrency(offlineSpent)}.
                  </p>
                </>
              )}
            </div>
          </section>

          {/* Note */}
          <section>
            <textarea
              placeholder="Add a note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 100))}
              rows={3}
              className="input-enterprise resize-none"
            />
            <p className="text-xs text-text-secondary text-right mt-1">{note.length}/100</p>
          </section>

          {/* Review */}
          {canSend && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 rounded-xl bg-brand-soft/30 border border-brand/10"
            >
              <p className="text-xs text-text-secondary uppercase tracking-wider mb-3">Review</p>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-secondary">To</span>
                <span className="font-medium">{recipient?.name || 'Unknown'}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-secondary">Phone</span>
                <span className="font-medium">+91 {phone}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Amount</span>
                <span className="font-bold text-brand">{formatCurrency(amountNum)}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-text-secondary">Fee</span>
                <span className="text-success font-medium">Free</span>
              </div>
            </motion.div>
          )}

          <Button onClick={handleSend} loading={loading} disabled={!canSend}>
            Send Money
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <SuccessOverlay
            message={isOnline ? 'Money sent!' : 'Queued for sync!'}
            duration={5000}
            onComplete={() => navigate('/dashboard')}
          />
        )}
      </AnimatePresence>
    </PageTransition>
  );
}

export default SendMoney;
