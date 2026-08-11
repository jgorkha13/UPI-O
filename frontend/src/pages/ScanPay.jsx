import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Camera, Upload, Flashlight, X } from 'lucide-react';
import { toast } from 'react-toastify';
import AppHeader from '../components/layout/AppHeader';
import Button from '../components/ui/Button';

export default function ScanPay() {
  const navigate = useNavigate();
  const [showScanner, setShowScanner] = useState(false);
  const userPhone = localStorage.getItem('userPhone') || '';
  const upiId = `${userPhone}@upio`;

  const handleScan = () => {
    setShowScanner(true);
    toast.info('Camera access would open here in production');
  };

  return (
    <div className="min-h-screen bg-bg pb-6">
      <AppHeader title="Scan & Pay" />

      <div className="px-4 space-y-5 mt-2">
        {/* Scanner area */}
        <div className="enterprise-card !p-0 overflow-hidden">
          <div className="relative bg-gray-900 aspect-square max-h-72 flex flex-col items-center justify-center">
            <div className="absolute inset-8 border-2 border-white/30 rounded-2xl">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-brand rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-brand rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-brand rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-brand rounded-br-lg" />
            </div>
            <QrCode className="w-16 h-16 text-white/20" />
            <p className="text-white/60 text-sm mt-4">Point camera at QR code</p>
          </div>
          <div className="p-4 flex gap-3">
            <button
              type="button"
              onClick={handleScan}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-brand text-white font-semibold text-sm"
            >
              <Camera className="w-5 h-5" />
              Scan QR
            </button>
            <button
              type="button"
              onClick={() => toast.info('Gallery upload coming soon')}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-100 text-text-primary font-semibold text-sm"
            >
              <Upload className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => toast.info('Flashlight toggled')}
              className="flex items-center justify-center px-4 py-3 rounded-xl bg-gray-100 text-text-primary"
            >
              <Flashlight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* My QR */}
        <div className="enterprise-card text-center">
          <p className="text-sm font-bold text-text-primary mb-1">My QR Code</p>
          <p className="text-xs text-text-secondary mb-4">Receive payments via UPI</p>
          <div className="w-40 h-40 mx-auto bg-white border-2 border-brand/20 rounded-2xl flex items-center justify-center">
            <QrCode className="w-28 h-28 text-brand" strokeWidth={1} />
          </div>
          <p className="text-sm font-bold text-brand mt-4">{upiId}</p>
          <p className="text-xs text-text-secondary mt-1">Share this to receive money</p>
        </div>

        <Button onClick={() => navigate('/send')} className="w-full">
          Pay by Phone Number
        </Button>
      </div>

      {showScanner && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-end justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center">
            <button
              type="button"
              onClick={() => setShowScanner(false)}
              className="absolute top-4 right-4 p-2"
            >
              <X className="w-5 h-5" />
            </button>
            <Camera className="w-12 h-12 text-brand mx-auto mb-3" />
            <p className="font-bold text-text-primary">Scanner Preview</p>
            <p className="text-sm text-text-secondary mt-2">
              In a production app, this opens your camera to scan UPI QR codes.
            </p>
            <Button onClick={() => setShowScanner(false)} className="w-full mt-4">
              Got it
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
