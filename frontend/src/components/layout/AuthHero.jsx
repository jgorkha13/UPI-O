import { motion } from 'framer-motion';
import { Shield, Wifi, Zap } from 'lucide-react';
import Logo from '../ui/Logo';

const features = [
  { icon: Wifi, label: 'Works offline', desc: 'Pay without connectivity' },
  { icon: Shield, label: 'Bank-grade security', desc: '256-bit encryption' },
  { icon: Zap, label: 'Instant transfers', desc: 'Money in seconds' },
];

export default function AuthHero() {
  return (
    <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-16 overflow-hidden phonepe-hero">
      <div
        className="absolute top-16 left-12 w-64 h-64 rounded-full opacity-20 animate-float blur-2xl"
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.3), transparent 70%)' }}
      />
      <div
        className="absolute bottom-24 right-8 w-80 h-80 rounded-full opacity-15 animate-float-delayed blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.2), transparent 70%)' }}
      />

      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="relative z-10 max-w-md"
      >
        <Logo size="xl" light />
        <p className="text-base text-white/80 mt-6">Banking reimagined</p>
        <p className="text-white/70 mt-2 text-sm leading-body max-w-sm">
          Enterprise payments with the polish of a luxury product. Secure, fast, and built for India.
        </p>

        <ul className="mt-10 space-y-3">
          {features.map(({ icon: Icon, label, desc }, i) => (
            <motion.li
              key={label}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.08, duration: 0.35 }}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors duration-200"
            >
              <div className="w-10 h-10 rounded-md bg-white/15 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-white" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{label}</p>
                <p className="text-xs text-white/70 mt-0.5">{desc}</p>
              </div>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
