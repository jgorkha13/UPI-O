import { Landmark } from 'lucide-react';

export default function Logo({ size = 'md', light = false }) {
  const sizes = {
    sm: { box: 'w-7 h-7', icon: 15, text: 'text-base' },
    md: { box: 'w-8 h-8', icon: 17, text: 'text-lg' },
    lg: { box: 'w-10 h-10', icon: 20, text: 'text-xl' },
    xl: { box: 'w-12 h-12', icon: 24, text: 'text-2xl' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${s.box} rounded-lg flex items-center justify-center ${
          light ? 'bg-white/15 text-white' : 'bg-brand text-white'
        }`}
      >
        <Landmark size={s.icon} strokeWidth={2.2} />
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`${s.text} font-bold tracking-tight ${light ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
          UPI-O
        </span>
        <span className={`text-[10px] font-semibold uppercase tracking-wider ${light ? 'text-blue-200' : 'text-brand'}`}>
          Offline
        </span>
      </div>
    </div>
  );
}

