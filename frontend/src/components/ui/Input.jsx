import { Check, X } from 'lucide-react';
import { forwardRef } from 'react';

const FieldFeedback = ({ valid, show, helpText, errorText }) => {
  if (!show) {
    return helpText ? <p className="text-xs text-text-secondary mt-1.5">{helpText}</p> : null;
  }
  if (valid) {
    return (
      <p className="text-xs text-success mt-1.5 flex items-center gap-1">
        <Check className="w-3 h-3" /> Valid
      </p>
    );
  }
  return (
    <p className="text-xs text-danger mt-1.5 flex items-center gap-1">
      <X className="w-3 h-3" /> {errorText}
    </p>
  );
};

const Input = forwardRef(function Input(
  {
    label,
    error,
    valid,
    touched,
    helpText,
    prefix,
    suffix,
    rightIcon,
    shake,
    className = '',
    ...props
  },
  ref
) {
  const showFeedback = touched && (valid !== undefined || error);

  return (
    <div className={`space-y-2 ${shake ? 'animate-shake' : ''}`}>
      {label && (
        <label className="block text-sm font-semibold text-text-primary tracking-heading">
          {label}
        </label>
      )}
      <div className="relative flex">
        {prefix && (
          <div className="flex items-center px-4 bg-bg-secondary/60 border border-white/10 border-r-0 rounded-l-md text-text-secondary text-sm shrink-0">
            {prefix}
          </div>
        )}
        <input
          ref={ref}
          className={`input-enterprise ${prefix ? 'rounded-l-none' : ''} ${suffix || rightIcon ? 'pr-12' : ''} ${
            showFeedback && valid ? 'border-success/50' : ''
          } ${showFeedback && !valid && error ? 'border-danger/50 shadow-[0_0_0_3px_rgba(255,71,87,0.1)]' : ''} ${className}`}
          {...props}
        />
        {suffix && (
          <div className="flex items-center px-3 border border-white/10 border-l-0 rounded-r-md bg-bg-secondary/60 shrink-0">
            {suffix}
          </div>
        )}
        {rightIcon && !suffix && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">{rightIcon}</div>
        )}
        {showFeedback && valid && !rightIcon && (
          <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-success animate-slide-up" />
        )}
        {showFeedback && !valid && error && !rightIcon && (
          <X className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-danger" />
        )}
      </div>
      <FieldFeedback valid={valid} show={showFeedback} helpText={helpText} errorText={error} />
    </div>
  );
});

export default Input;
