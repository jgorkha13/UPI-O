import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import AppHeader from '../components/layout/AppHeader';
import PageTransition from '../components/ui/PageTransition';
import Button from '../components/ui/Button';
import SuccessOverlay from '../components/ui/SuccessOverlay';
import { addMoney } from '../api/wallet';
import { formatCurrency } from '../utils/format';
import { getCachedWallet, setCachedWallet, creditCachedWallet } from '../utils/walletCache';

const QUICK = [100, 500, 1000, 5000];

function AddMoney() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [newBalance, setNewBalance] = useState(null);

  const amountNum = parseFloat(amount);
  const valid = amountNum >= 1;

  const handleAdd = async () => {
    if (!valid) return;
    setLoading(true);
    try {
      const res = await addMoney(amountNum);
      setNewBalance(res.newBalance);
      const cached = getCachedWallet();
      if (cached) {
        setCachedWallet({ ...cached, balance: Number(res.newBalance) });
      } else {
        creditCachedWallet(amountNum);
      }
      setShowSuccess(true);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add money');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition className="min-h-screen bg-bg pb-10">
      <AppHeader title="Add Money" showBack />

      <div className="max-w-lg mx-auto px-6 mt-6">
        <div className="enterprise-card space-y-6">
          <div>
            <p className="text-sm font-semibold text-text-primary mb-4">Quick add</p>
            <div className="grid grid-cols-2 gap-3">
              {QUICK.map((q) => (
                <motion.button
                  key={q}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setAmount(String(q))}
                  className={`py-4 rounded-lg font-semibold border transition-all duration-300 ${
                    amount === String(q)
                      ? 'bg-accent/15 border-accent text-accent shadow-glow'
                      : 'bg-bg-secondary/40 border-white/10 text-text-primary hover:border-accent/30'
                  }`}
                >
                  ₹{q.toLocaleString('en-IN')}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-3">
              Custom amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary font-semibold">
                ₹
              </span>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-enterprise pl-10 text-xl font-bold font-mono"
              />
            </div>
          </div>

          <Button onClick={handleAdd} loading={loading} disabled={!valid}>
            Add Money
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <SuccessOverlay
            message={`Added ${formatCurrency(amountNum)}`}
            onComplete={() => navigate('/dashboard')}
          />
        )}
      </AnimatePresence>

      {showSuccess && newBalance != null && (
        <p className="text-center text-sm text-text-secondary mt-4">
          New balance: {formatCurrency(newBalance)}
        </p>
      )}
    </PageTransition>
  );
}

export default AddMoney;
