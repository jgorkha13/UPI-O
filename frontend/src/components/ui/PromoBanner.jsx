import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const BANNERS = [
  {
    id: 1,
    title: 'Get ₹50 Cashback',
    subtitle: 'On your first bill payment',
    gradient: 'from-brand to-brand-light',
    emoji: '🎁',
  },
  {
    id: 2,
    title: 'Pay Offline Anytime',
    subtitle: 'Up to ₹2,000 without internet',
    gradient: 'from-accent-blue to-cyan-500',
    emoji: '📶',
  },
  {
    id: 3,
    title: 'Zero Fee Transfers',
    subtitle: 'Send money instantly for free',
    gradient: 'from-success to-emerald-400',
    emoji: '⚡',
  },
];

export default function PromoBanner() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % BANNERS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const banner = BANNERS[active];

  return (
    <div className="relative">
      <div
        className={`rounded-2xl p-4 bg-gradient-to-r ${banner.gradient} text-white shadow-card overflow-hidden relative`}
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="flex items-center justify-between relative z-10">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">Offer</span>
            </div>
            <p className="text-base font-bold">{banner.title}</p>
            <p className="text-xs opacity-90 mt-0.5">{banner.subtitle}</p>
          </div>
          <span className="text-4xl">{banner.emoji}</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 mt-3">
        <button
          type="button"
          onClick={() => setActive((i) => (i - 1 + BANNERS.length) % BANNERS.length)}
          className="p-1 rounded-full text-text-secondary hover:bg-gray-100"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex gap-1.5">
          {BANNERS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === active ? 'w-5 bg-brand' : 'w-1.5 bg-gray-300'
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setActive((i) => (i + 1) % BANNERS.length)}
          className="p-1 rounded-full text-text-secondary hover:bg-gray-100"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
