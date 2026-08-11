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
    <div className="mx-4 mb-3 enterprise-card !p-4 border-brand/20 bg-brand-soft/40 flex gap-3 items-start">
      <div className="p-2 rounded-xl bg-brand/10 shrink-0">
        <Download className="w-5 h-5 text-brand" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-text-primary">Install UPI-O</p>
        <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
          Add to your home screen to open and pay offline even without refreshing.
        </p>
        <div className="flex gap-2 mt-3">
          <button
            type="button"
            onClick={install}
            className="px-3 py-1.5 rounded-lg bg-brand text-white text-xs font-semibold"
          >
            Install app
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-text-secondary"
          >
            Not now
          </button>
        </div>
      </div>
      <button type="button" onClick={dismiss} className="text-text-secondary shrink-0">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
