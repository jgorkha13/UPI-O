import { motion } from 'framer-motion';
import { Check, ShieldCheck } from 'lucide-react';
import { useEffect } from 'react';

export default function SuccessOverlay({ message = 'Payment Successful', duration = 1800, onComplete }) {
  useEffect(() => {
    const t = setTimeout(() => onComplete?.(), duration);
    return () => clearTimeout(t);
  }, [onComplete, duration]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 text-center shadow-lg"
      >
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center">
          <Check className="w-7 h-7 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />
        </div>
        
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{message}</h2>
        <div className="flex items-center justify-center gap-1.5 mt-2 text-xs text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Processed & verified</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

