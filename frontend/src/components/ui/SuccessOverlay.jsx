import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function SuccessOverlay({ message = 'Success!', duration = 2000, onComplete }) {
  useEffect(() => {
    confetti({
      particleCount: 10,
      spread: 50,
      origin: { y: 0.65 },
      colors: ['#5f259f', '#7b3fbf', '#00a651'],
      ticks: 100,
      scalar: 0.7,
    });
    const t = setTimeout(() => onComplete?.(), duration);
    return () => clearTimeout(t);
  }, [onComplete, duration]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        className="enterprise-card p-10 text-center max-w-sm mx-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 400, damping: 15 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/15 border-2 border-success flex items-center justify-center"
        >
          <Check className="w-10 h-10 text-success" strokeWidth={2.5} />
        </motion.div>
        <h2 className="text-2xl font-bold tracking-heading">{message}</h2>
        <p className="text-sm text-text-secondary mt-2">Redirecting...</p>
      </motion.div>
    </motion.div>
  );
}
