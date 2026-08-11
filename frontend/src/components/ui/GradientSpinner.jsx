import { Loader2 } from 'lucide-react';

export default function GradientSpinner({ size = 24, className = '' }) {
  return (
    <Loader2
      className={`text-brand animate-spin-slow ${className}`}
      size={size}
      strokeWidth={2}
      style={{
        filter: 'drop-shadow(0 0 8px rgba(95, 37, 159, 0.3))',
      }}
    />
  );
}
