import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ChevronDown, AlertCircle, Check, X } from 'lucide-react';
import AuthHero from '../components/layout/AuthHero';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import PageTransition from '../components/ui/PageTransition';
import Logo from '../components/ui/Logo';
import { register as registerUser } from '../api/auth';
import { getApiErrorMessage } from '../utils/errors';

const COUNTRY = { code: '+91', flag: '🇮🇳' };

const PASSWORD_RULES = [
  { id: 'length', label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { id: 'upper', label: 'One uppercase letter (A–Z)', test: (v) => /[A-Z]/.test(v) },
  { id: 'lower', label: 'One lowercase letter (a–z)', test: (v) => /[a-z]/.test(v) },
  { id: 'number', label: 'One number (0–9)', test: (v) => /\d/.test(v) },
  { id: 'special', label: 'One special character (!@#$%^&*)', test: (v) => /[^A-Za-z0-9]/.test(v) },
];

const isStrongPassword = (value) => PASSWORD_RULES.every((rule) => rule.test(value));

function PasswordRules({ password }) {
  return (
    <ul className="mt-2 space-y-1.5">
      {PASSWORD_RULES.map((rule) => {
        const met = rule.test(password);
        return (
          <li
            key={rule.id}
            className={`flex items-center gap-2 text-xs ${met ? 'text-success' : 'text-text-secondary'}`}
          >
            {met ? <Check className="w-3.5 h-3.5 shrink-0" /> : <X className="w-3.5 h-3.5 shrink-0 opacity-50" />}
            {rule.label}
          </li>
        );
      })}
    </ul>
  );
}

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bannerError, setBannerError] = useState('');
  const [shake, setShake] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors, touchedFields },
  } = useForm({ mode: 'onChange' });

  const phoneRegister = register('phone', {
    required: 'Phone is required',
    pattern: {
      value: /^[6-9]\d{9}$/,
      message: 'Enter valid 10-digit number',
    },
  });

  const { ref: nameRef, ...nameField } = register('name', {
    required: 'Full name is required',
    minLength: { value: 2, message: 'Enter your full name' },
  });

  const { ref: passwordRef, ...passwordField } = register('password', {
    required: 'Password is required',
    validate: (v) => isStrongPassword(v) || 'Password does not meet the requirements',
  });

  const { ref: confirmRef, ...confirmField } = register('confirmPassword', {
    required: 'Please confirm password',
    validate: (v) => v === getValues('password') || 'Passwords do not match',
  });

  const name = watch('name', '');
  const phone = watch('phone', '');
  const password = watch('password', '');
  const confirmPassword = watch('confirmPassword', '');

  const nameValid = name.trim().length >= 2;
  const phoneValid = /^[6-9]\d{9}$/.test(phone);
  const passwordValid = isStrongPassword(password);
  const confirmValid = confirmPassword.length > 0 && confirmPassword === password;

  const onSubmit = async (data) => {
    setBannerError('');
    setLoading(true);
    try {
      const result = await registerUser(data.name.trim(), data.phone, data.password);
      if (result.token) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('userName', result.name);
        localStorage.setItem('userId', result.userId);
        localStorage.setItem('userPhone', data.phone);
        navigate('/dashboard', { replace: true });
        return;
      }
      navigate('/login', { replace: true, state: { registered: true, name: data.name.trim() } });
    } catch (err) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      setBannerError(getApiErrorMessage(err, 'Registration failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition className="min-h-screen flex bg-bg">
      <AuthHero />

      <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
        <div className={`w-full max-w-[420px] ${shake ? 'animate-shake' : ''}`}>
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo size="lg" />
          </div>

          <div className="enterprise-card animate-fade-in">
            <div className="mb-8">
              <h1 className="text-[28px] font-bold text-text-primary tracking-heading">
                Create Account
              </h1>
              <p className="text-sm text-text-secondary mt-2">
                Join UPI-O — pay online or offline
              </p>
            </div>

            {bannerError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 flex items-start gap-3 p-4 rounded-lg bg-danger/10 border border-danger/30"
              >
                <AlertCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
                <p className="text-sm text-danger">{bannerError}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Full Name"
                placeholder="Your full name"
                valid={nameValid}
                touched={touchedFields.name || name.length > 0}
                error={errors.name?.message || (name.length > 0 && !nameValid ? 'Enter your full name' : '')}
                ref={nameRef}
                {...nameField}
              />

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-text-primary tracking-heading">
                  Phone Number
                </label>
                <div className="flex">
                  <div className="flex items-center gap-2 px-4 bg-bg-secondary/60 border border-white/10 border-r-0 rounded-l-md text-text-secondary text-sm">
                    <span>{COUNTRY.flag}</span>
                    <span className="font-medium">{COUNTRY.code}</span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder="9876543210"
                    className={`input-enterprise rounded-l-none flex-1 min-h-[52px] ${
                      (touchedFields.phone || phone.length > 0) && phoneValid
                        ? 'border-success/50'
                        : (touchedFields.phone || phone.length > 0) && !phoneValid && phone.length > 0
                        ? 'border-danger/50'
                        : ''
                    }`}
                    {...phoneRegister}
                    onChange={(e) => {
                      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      phoneRegister.onChange(e);
                    }}
                  />
                </div>
                {(touchedFields.phone || phone.length > 0) && (
                  <p className={`text-xs mt-1.5 ${phoneValid ? 'text-success' : 'text-danger'}`}>
                    {phoneValid ? 'Valid Indian mobile number' : 'Must be 10 digits starting with 6–9'}
                  </p>
                )}
              </div>

              <div>
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  valid={passwordValid}
                  touched={touchedFields.password || password.length > 0}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-text-secondary hover:text-accent transition-colors duration-200"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  }
                  ref={passwordRef}
                  {...passwordField}
                />
                <PasswordRules password={password} />
              </div>

              <Input
                label="Confirm Password"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Re-enter password"
                valid={confirmValid}
                touched={touchedFields.confirmPassword || confirmPassword.length > 0}
                error={
                  errors.confirmPassword?.message ||
                  (confirmPassword.length > 0 && !confirmValid ? 'Passwords do not match' : '')
                }
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="text-text-secondary hover:text-accent transition-colors duration-200"
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                }
                ref={confirmRef}
                {...confirmField}
              />

              <div className="pt-2">
                <Button type="submit" loading={loading}>
                  Create Account
                </Button>
              </div>
            </form>

            <p className="text-center text-sm text-text-secondary mt-8">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-accent font-semibold hover:text-accent-hover transition-colors duration-200"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default Register;
