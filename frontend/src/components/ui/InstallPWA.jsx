import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

const DISMISS_KEY = 'upio_pwa_install_dismissed';

export default function InstallPWA() {
  const [promptEvent, setPromptEvent] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY) === '1') {
      return;
    }

    const handler = (event) => {
      event.preventDefault();
      setPromptEvent(event);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, '1');
    setVisible(false);
    setPromptEvent(null);
  };

  const install = async () => {
    if (!promptEvent) {
      return;
    }
    promptEvent.prompt();
    await promptEvent.userChoice;
    dismiss();
  };

  if (!visible || !promptEvent) {
    return null;
  }

  return (
    <div className="mx-4 mb-3 border border-blue-200 dark:border-blue-900 bg-blue-50/80 dark:bg-blue-950/40 rounded-xl p-3.5 flex gap-3 items-start shadow-sm">
      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 shrink-0">
        <Download className="w-4 h-4 text-brand" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">Install Offline PWA</p>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
          Enable home screen access to initiate and queue payments without internet connectivity.
        </p>
        <div className="flex gap-2 mt-2.5">
          <button
            type="button"
            onClick={install}
            className="px-2.5 py-1 rounded-md bg-brand text-white text-xs font-semibold shadow-xs hover:bg-brand-dark transition-colors"
          >
            Install
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="px-2.5 py-1 rounded-md text-xs font-medium text-slate-500 hover:text-slate-700"
          >
            Dismiss
          </button>
        </div>
      </div>
      <button type="button" onClick={dismiss} className="text-slate-400 hover:text-slate-600 shrink-0">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
