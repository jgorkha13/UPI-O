import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { Smartphone } from 'lucide-react';
import AppHeader from '../components/layout/AppHeader';
import PageTransition from '../components/ui/PageTransition';
import Button from '../components/ui/Button';
import SuccessOverlay from '../components/ui/SuccessOverlay';
import { OfflineContext } from '../context/OfflineContext';
import { getWallet } from '../api/wallet';
import { rechargeMobile } from '../api/recharge';
import { formatCurrency } from '../utils/format';
import { adjustCachedWallet, getCachedWallet, setCachedWallet } from '../utils/walletCache';

const OPERATORS = [
  { id: 'Jio', color: 'bg-[#0a2885]', short: 'Jio' },
  { id: 'Airtel', color: 'bg-[#ed1c24]', short: 'Airtel' },
  { id: 'Vi', color: 'bg-[#ee3124]', short: 'Vi' },
  { id: 'BSNL', color: 'bg-[#00a651]', short: 'BSNL' },
];

const PLANS = {
  Jio: [
    { amount: 199, validity: '28 days', data: '2GB/day', name: 'Popular' },
    { amount: 299, validity: '28 days', data: '2GB/day', name: 'Unlimited 5G' },
    { amount: 399, validity: '56 days', data: '1.5GB/day', name: 'Value' },
    { amount: 666, validity: '84 days', data: '1.5GB/day', name: 'Long validity' },
  ],
  Airtel: [
    { amount: 179, validity: '28 days', data: '2GB/day', name: 'Popular' },
    { amount: 299, validity: '28 days', data: '2.5GB/day', name: 'Unlimited' },
    { amount: 359, validity: '28 days', data: '2GB/day + Disney+', name: 'Entertainment' },
    { amount: 719, validity: '84 days', data: '1.5GB/day', name: 'Quarterly' },
  ],
  Vi: [
    { amount: 199, validity: '28 days', data: '1.5GB/day', name: 'Popular' },
    { amount: 299, validity: '28 days', data: '1.5GB/day', name: 'Unlimited' },
    { amount: 479, validity: '56 days', data: '1.5GB/day', name: 'Value' },
    { amount: 601, validity: '77 days', data: '1.5GB/day', name: 'Long validity' },
  ],
  BSNL: [
    { amount: 107, validity: '35 days', data: '2GB/day', name: 'Starter' },
    { amount: 197, validity: '54 days', data: '2GB/day', name: 'Popular' },
    { amount: 397, validity: '80 days', data: '2GB/day', name: 'Value' },
    { amount: 997, validity: '160 days', data: '2GB/day', name: 'Half yearly' },
  ],
};

const STEPS = ['Number', 'Plan', 'Pay'];

function StepBar({ step }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-6">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                i <= step
                  ? 'bg-brand text-white shadow-glow-btn'
                  : 'bg-bg-secondary border text-text-secondary'
              }`}
            >
              {i + 1}
            </div>
            <span className={`text-xs mt-2 ${i <= step ? 'text-brand' : 'text-text-secondary'}`}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-10 sm:w-14 h-0.5 mx-2 ${i < step ? 'bg-brand' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function Recharge() {
  const navigate = useNavigate();
  const { isOnline } = useContext(OfflineContext);
  const userPhone = localStorage.getItem('userPhone') || '';

  const [mobile, setMobile] = useState(userPhone);
  const [operator, setOperator] = useState('Jio');
  const [amount, setAmount] = useState('');
  const [planName, setPlanName] = useState('');
  const [balance, setBalance] = useState(() => getCachedWallet()?.balance ?? 0);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const mobileValid = /^[6-9]\d{9}$/.test(mobile);
  const amountNum = parseFloat(amount);
  const amountValid = amountNum >= 1 && amountNum <= 9999;
  const canPay = mobileValid && operator && amountValid && amountNum <= Number(balance);
  const step = !mobileValid || !operator ? 0 : !amountValid ? 1 : 2;
  const plans = PLANS[operator] || [];

  useEffect(() => {
    const cached = getCachedWallet();
    if (cached) setBalance(Number(cached.balance));
    if (!isOnline) return;
    getWallet()
      .then((w) => {
        setBalance(Number(w.balance));
        setCachedWallet(w);
      })
      .catch(() => {
        if (!cached) toast.error('Could not load balance');
      });
  }, [isOnline]);

  const selectedPlan = useMemo(
    () => plans.find((p) => String(p.amount) === String(amount)),
    [plans, amount]
  );

  const pickPlan = (plan) => {
    setAmount(String(plan.amount));
    setPlanName(`${plan.name} · ${plan.data} · ${plan.validity}`);
  };

  const handlePay = async () => {
    if (!canPay) return;
    if (!isOnline) {
      toast.error('Recharge needs an internet connection');
      return;
    }
    setLoading(true);
    try {
      await rechargeMobile({
        mobileNumber: mobile,
        operator,
        amount: amountNum,
        planName: planName || selectedPlan?.name || 'Custom',
        nonce: uuidv4(),
      });
      const updated = adjustCachedWallet(amountNum);
      if (updated) setBalance(Number(updated.balance));
      setShowSuccess(true);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Recharge failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition className="min-h-screen bg-bg pb-10">
      <AppHeader title="Mobile Recharge" showBack />

      <div className="max-w-lg mx-auto px-4 mt-4 space-y-5">
        <StepBar step={step} />

        <div className="enterprise-card space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-text-primary">Prepaid number</p>
            <p className="text-xs text-text-secondary">Balance {formatCurrency(balance)}</p>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary font-semibold text-sm">
              +91
            </span>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="10-digit mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
              className="input-enterprise pl-14 text-lg font-semibold tracking-wide"
            />
          </div>
          {mobile.length > 0 && !mobileValid && (
            <p className="text-xs text-danger">Enter a valid 10-digit Indian mobile number</p>
          )}
        </div>

        <div className="enterprise-card space-y-3">
          <p className="text-sm font-semibold text-text-primary">Operator</p>
          <div className="grid grid-cols-4 gap-2">
            {OPERATORS.map((op) => (
              <button
                key={op.id}
                type="button"
                onClick={() => {
                  setOperator(op.id);
                  setAmount('');
                  setPlanName('');
                }}
                className={`rounded-2xl p-3 text-center border transition-all ${
                  operator === op.id
                    ? 'border-brand bg-brand/10 shadow-glow'
                    : 'border-gray-100 bg-bg-secondary/40'
                }`}
              >
                <div className={`w-8 h-8 mx-auto rounded-xl ${op.color} text-white text-[10px] font-bold flex items-center justify-center mb-1`}>
                  {op.short.slice(0, 2)}
                </div>
                <span className="text-[11px] font-semibold text-text-primary">{op.id}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-bold text-text-primary px-1">Popular plans</p>
          {plans.map((plan) => (
            <motion.button
              key={`${operator}-${plan.amount}-${plan.name}`}
              type="button"
              whileTap={{ scale: 0.99 }}
              onClick={() => pickPlan(plan)}
              className={`w-full enterprise-card !p-4 text-left flex items-center justify-between ${
                amount === String(plan.amount) ? 'border-brand ring-1 ring-brand/30' : ''
              }`}
            >
              <div>
                <p className="text-sm font-bold text-text-primary">{plan.name}</p>
                <p className="text-xs text-text-secondary mt-0.5">
                  {plan.data} · {plan.validity}
                </p>
              </div>
              <p className="text-base font-bold text-brand">{formatCurrency(plan.amount)}</p>
            </motion.button>
          ))}
        </div>

        <div className="enterprise-card space-y-3">
          <label className="block text-sm font-semibold text-text-primary">Custom amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary font-semibold">₹</span>
            <input
              type="number"
              min="1"
              max="9999"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setPlanName('Custom');
              }}
              className="input-enterprise pl-10 text-xl font-bold font-mono"
            />
          </div>
        </div>

        {canPay && (
          <div className="enterprise-card !p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">Number</span>
              <span className="font-semibold">+91 {mobile}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Operator</span>
              <span className="font-semibold">{operator}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Plan</span>
              <span className="font-semibold text-right max-w-[60%]">{planName || 'Custom'}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-100">
              <span className="text-text-secondary">Payable</span>
              <span className="font-bold text-brand">{formatCurrency(amountNum)}</span>
            </div>
          </div>
        )}

        {amountValid && amountNum > Number(balance) && (
          <p className="text-xs text-danger text-center">
            Insufficient wallet balance. Add money first.
          </p>
        )}

        <Button onClick={handlePay} loading={loading} disabled={!canPay} icon={Smartphone}>
          Pay {amountValid ? formatCurrency(amountNum) : ''}
        </Button>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <SuccessOverlay
            message={`${operator} recharge of ${formatCurrency(amountNum)} done`}
            onComplete={() => navigate('/dashboard')}
          />
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
