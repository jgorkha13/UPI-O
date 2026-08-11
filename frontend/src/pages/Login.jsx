import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import AuthHero from '../components/layout/AuthHero';
import Button from '../components/ui/Button';
import Toggle from '../components/ui/Toggle';
import PageTransition from '../components/ui/PageTransition';
import Logo from '../components/ui/Logo';
import { login } from '../api/auth';

const COUNTRY = { code: '+91', flag: '🇮🇳' };

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [shake, setShake] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { phone: localStorage.getItem('rememberPhone') || '' },
  });

  useEffect(() => {
    if (location.state?.registered) {
      toast.success(`Welcome to UPI-O, ${location.state.name}! Please sign in.`);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await login(data.phone, data.password);
      localStorage.setItem('token', result.token);
      localStorage.setItem('userName', result.name);
      localStorage.setItem('userId', result.userId);
      localStorage.setItem('userPhone', data.phone);
      if (rememberMe) localStorage.setItem('rememberPhone', data.phone);
      else localStorage.removeItem('rememberPhone');

      setSuccess(true);
      setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => navigate('/dashboard'), 400);
      }, 700);
    } catch (err) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      toast.error(err.response?.data?.error || err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition className="min-h-screen flex bg-bg">
      <AuthHero />

      <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
        <motion.div
          animate={{ opacity: fadeOut ? 0 : 1, y: fadeOut ? -12 : 0 }}
          transition={{ duration: 0.4 }}
          className={`w-full max-w-[420px] ${shake ? 'animate-shake' : ''}`}
        >
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo size="lg" />
          </div>

          <div className="enterprise-card animate-fade-in">
            <div className="mb-8">
              <h1 className="text-[28px] font-bold text-text-primary tracking-heading">
                Welcome Back
              </h1>
              <p className="text-sm text-text-secondary mt-2">
                Enter your details to continue
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-text-primary tracking-heading">
                  Phone Number
                </label>
                <div className="flex">
                  <div className="flex items-center gap-2 px-4 bg-slate-50 border border-slate-200 border-r-0 rounded-l-xl text-text-secondary text-sm min-h-[52px]">
                    <span>{COUNTRY.flag}</span>
                    <span className="font-medium">{COUNTRY.code}</span>
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder="9876543210"
                    className={`input-enterprise rounded-l-none flex-1 min-h-[52px] ${
                      errors.phone ? 'border-danger/50 animate-shake' : ''
                    }`}
                    {...register('phone', {
                      required: 'Phone is required',
                      pattern: { value: /^[6-9]\d{9}$/, message: 'Invalid phone number' },
                      onChange: (e) => {
                        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      },
                    })}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-danger">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-text-primary tracking-heading">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className={`input-enterprise pr-12 min-h-[52px] ${
                      errors.password ? 'border-danger/50' : ''
                    }`}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Minimum 6 characters' },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-accent transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-danger">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between pt-1">
                <Toggle checked={rememberMe} onChange={setRememberMe} label="Remember me" />
                <button
                  type="button"
                  className="text-sm text-text-secondary hover:text-accent transition-colors duration-200"
                  onClick={() => toast.info('Password reset coming soon')}
                >
                  Forgot password?
                </button>
              </div>

              <Button type="submit" loading={loading} success={success} className="!opacity-100">
                Login
              </Button>
            </form>

            <p className="text-center text-sm text-text-secondary mt-8">
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                className="text-accent font-semibold hover:text-accent-hover transition-colors duration-200"
              >
                Create account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}

export default Login;
