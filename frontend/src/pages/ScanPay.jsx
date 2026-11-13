import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { QRCodeSVG } from 'qrcode.react';
import {
  Camera,
  Upload,
  Flashlight,
  Copy,
  Check,
  Phone,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'react-toastify';
import AppHeader from '../components/layout/AppHeader';
import Button from '../components/ui/Button';
import { parseUpiQr } from '../utils/qrParser';

export default function ScanPay() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const userPhone = localStorage.getItem('userPhone') || '';
  const userName = localStorage.getItem('userName') || 'User';
  const upiId = `${userPhone}@upio`;
  const upiQrUri = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(userName)}&cu=INR`;

  const [activeTab, setActiveTab] = useState('scan'); // 'scan' | 'myqr'
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [torchOn, setTorchOn] = useState(false);
  const [copied, setCopied] = useState(false);

  const html5QrCodeRef = useRef(null);

  // Initialize and start scanner
  const startCamera = async () => {
    setCameraError('');
    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode('qr-reader');
      }

      const qrCode = html5QrCodeRef.current;

      await qrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 220, height: 220 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          handleScanSuccess(decodedText);
        },
        () => {
          // ignore scan frame misses
        }
      );

      setCameraActive(true);
    } catch (err) {
      console.warn('Camera startup error:', err);
      setCameraActive(false);
      const msg =
        err?.name === 'NotAllowedError' || err?.message?.includes('Permission')
          ? 'Camera permission was denied. Please allow camera access in your browser settings.'
          : 'Could not access device camera. You can upload a QR image from your gallery instead.';
      setCameraError(msg);
    }
  };

  const stopCamera = async () => {
    if (html5QrCodeRef.current && cameraActive) {
      try {
        await html5QrCodeRef.current.stop();
      } catch (err) {
        console.warn('Error stopping camera:', err);
      } finally {
        setCameraActive(false);
        setTorchOn(false);
      }
    }
  };

  useEffect(() => {
    if (activeTab === 'scan') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleScanSuccess = async (decodedText) => {
    // Subtle haptic feedback if supported
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50);
    }

    await stopCamera();

    const parsed = parseUpiQr(decodedText);

    if (parsed && parsed.valid) {
      toast.success(
        parsed.phone
          ? `Scanned: ${parsed.phone} ${parsed.name ? `(${parsed.name})` : ''}`
          : `Scanned: ${parsed.upiId}`
      );

      navigate('/send', {
        state: {
          phone: parsed.phone,
          amount: parsed.amount,
          name: parsed.name,
        },
      });
    } else {
      toast.info(`Scanned content: ${decodedText}`);
      navigate('/send', { state: { phone: decodedText } });
    }
  };

  // Upload and scan from gallery
  const handleFileScan = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      let scanner = html5QrCodeRef.current;
      if (!scanner) {
        scanner = new Html5Qrcode('qr-reader');
        html5QrCodeRef.current = scanner;
      }

      if (cameraActive) {
        await scanner.stop();
        setCameraActive(false);
      }

      const decodedResult = await scanner.scanFileV2(file);
      if (decodedResult && decodedResult.decodedText) {
        handleScanSuccess(decodedResult.decodedText);
      } else {
        toast.error('No QR code found in this image.');
      }
    } catch {
      toast.error('Could not detect a valid QR code in this image.');
    } finally {
      e.target.value = '';
    }
  };

  // Toggle Torch/Flashlight
  const toggleTorch = async () => {
    if (!cameraActive || !html5QrCodeRef.current) {
      toast.info('Start camera first to use flashlight');
      return;
    }

    try {
      await html5QrCodeRef.current.applyVideoConstraints({
        advanced: [{ torch: !torchOn }],
      });
      setTorchOn(!torchOn);
    } catch {
      toast.info('Flashlight is not supported by this device camera');
    }
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    toast.success('UPI ID copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-bg pb-10">
      <AppHeader title="Scan & Pay" showBack />

      <div className="max-w-md mx-auto px-4 mt-3 space-y-4">
        {/* Toggle Mode: Scan vs My QR */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setActiveTab('scan')}
            className={`flex-1 py-2 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'scan'
                ? 'bg-white dark:bg-slate-900 text-brand shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            Scan any QR
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('myqr')}
            className={`flex-1 py-2 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'myqr'
                ? 'bg-white dark:bg-slate-900 text-brand shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            My QR Code
          </button>
        </div>

        {activeTab === 'scan' ? (
          <div className="space-y-4">
            {/* Live Camera Scanner Box */}
            <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-md relative">
              <div
                id="qr-reader"
                className="w-full aspect-square max-h-80 mx-auto overflow-hidden flex items-center justify-center"
              />

              {!cameraActive && (
                <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center p-6 text-center">
                  {cameraError ? (
                    <div className="space-y-3">
                      <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
                      <p className="text-xs text-slate-300 max-w-xs">{cameraError}</p>
                      <button
                        type="button"
                        onClick={startCamera}
                        className="px-3.5 py-1.5 rounded-lg bg-brand text-white text-xs font-semibold hover:bg-brand-dark transition-colors inline-flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Retry Camera
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Camera className="w-10 h-10 text-slate-400 mx-auto animate-pulse" />
                      <p className="text-xs text-slate-300">Starting camera preview...</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Scanner Action Controls */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={cameraActive ? stopCamera : startCamera}
                className="py-2.5 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors"
              >
                <Camera className="w-4 h-4 text-brand" />
                <span>{cameraActive ? 'Pause' : 'Start'}</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="py-2.5 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors"
              >
                <Upload className="w-4 h-4 text-brand" />
                <span>Gallery</span>
              </button>

              <button
                type="button"
                onClick={toggleTorch}
                className={`py-2.5 px-3 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  torchOn
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 border-amber-300'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50'
                }`}
              >
                <Flashlight className="w-4 h-4 text-amber-500" />
                <span>Flash</span>
              </button>

              {/* Hidden file input for photo library scan */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileScan}
              />
            </div>

            <p className="text-[11px] text-center text-slate-400">
              Point at any standard UPI QR, merchant QR, or contact QR code.
            </p>

            <Button
              onClick={() => navigate('/send')}
              icon={Phone}
              className="w-full mt-2"
            >
              Pay using Phone Number
            </Button>
          </div>
        ) : (
          /* My QR Code Card */
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 text-center shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Receive Money via UPI
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Scan this QR with any UPI app to pay directly to your wallet
              </p>
            </div>

            {/* Real SVG QR code */}
            <div className="w-48 h-48 mx-auto p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-center">
              <QRCodeSVG
                value={upiQrUri}
                size={168}
                level="M"
                includeMargin={false}
              />
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-lg p-2.5 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
              <div className="text-left min-w-0 pr-2">
                <p className="text-[10px] text-slate-400 uppercase font-medium">Your UPI ID</p>
                <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 truncate">
                  {upiId}
                </p>
              </div>
              <button
                type="button"
                onClick={copyUpiId}
                className="px-2.5 py-1 text-xs font-semibold rounded-md bg-white dark:bg-slate-900 text-brand border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors inline-flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Linked to your phone: <span className="font-semibold text-slate-700 dark:text-slate-300">+91 {userPhone}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
