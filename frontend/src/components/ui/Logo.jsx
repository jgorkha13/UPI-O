import { Wallet } from 'lucide-react';

export default function Logo({ size = 'md', light = false }) {
  const sizes = {
    sm: { box: 'w-8 h-8', icon: 16, text: 'text-lg' },
    md: { box: 'w-10 h-10', icon: 20, text: 'text-xl' },
    lg: { box: 'w-12 h-12', icon: 24, text: 'text-2xl' },
    xl: { box: 'w-14 h-14', icon: 28, text: 'text-[48px] leading-none' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`${s.box} rounded-xl flex items-center justify-center ${
          light ? 'bg-white/20' : 'bg-brand shadow-glow-btn'
        }`}
      >
        <Wallet size={s.icon} className="text-white" strokeWidth={2.5} />
      </div>
      <span className={`${s.text} font-bold tracking-tight ${light ? 'text-white' : 'text-brand'}`}>
        UPI-O
      </span>
    </div>
  );
}
