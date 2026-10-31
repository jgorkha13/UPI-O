import { ShieldCheck, WifiOff, RefreshCw } from 'lucide-react';
import Logo from '../ui/Logo';

const architectureHighlights = [
  {
    icon: WifiOff,
    label: 'Offline-First Queue',
    desc: 'Local IndexedDB persistence ensures payments succeed without cellular or Wi-Fi connectivity.',
  },
  {
    icon: RefreshCw,
    label: 'Automated Sync & Nonce Ledger',
    desc: 'Cryptographic UUID nonces guarantee zero duplicate deductions during background reconciliation.',
  },
  {
    icon: ShieldCheck,
    label: 'ACID Concurrency Protection',
    desc: 'Optimistic locking and transactional isolation safeguard ledger balances from double-spending.',
  },
];

export default function AuthHero() {
  return (
    <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-16 bg-slate-900 text-white border-r border-slate-800">
      <div className="relative z-10 max-w-md">
        <Logo size="xl" light />
        <h2 className="text-xl font-bold tracking-tight text-white mt-8">
          Reliable UPI Payments Everywhere
        </h2>
        <p className="text-slate-400 mt-2 text-sm leading-relaxed">
          Inspired by NPCI UPI Lite. Built with Spring Boot, PostgreSQL, and offline-first progressive web caching.
        </p>

        <div className="mt-8 pt-8 border-t border-slate-800 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            System Architecture
          </p>
          {architectureHighlights.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
              <div className="w-8 h-8 rounded-md bg-blue-900/60 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="w-4 h-4" strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200">{label}</p>
                <p className="text-xs text-slate-400 mt-0.5 leading-normal">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

