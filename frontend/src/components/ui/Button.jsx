import { forwardRef } from 'react';
import { Loader2, Check } from 'lucide-react';

const variants = {
  primary: 'btn-primary-enterprise w-full h-12',
  secondary: 'btn-secondary-enterprise w-full h-12',
  danger: 'btn-danger-enterprise w-full h-12',
  ghost:
    'inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary hover:text-accent transition-all duration-200 ease-smooth',
};

const Button = forwardRef(
  ({ children, variant = 'primary', loading, success, disabled, className = '', icon: Icon, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading || success}
      className={`${variants[variant]} ${className} ${success ? '!bg-success !text-white !shadow-none' : ''}`}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin-slow" />
          <span>{children}</span>
        </>
      ) : success ? (
        <>
          <Check className="w-5 h-5" strokeWidth={2.5} />
          <span>Success!</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-5 h-5" />}
          {children}
        </>
      )}
    </button>
  )
);

Button.displayName = 'Button';
export default Button;
