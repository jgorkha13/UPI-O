/**
 * Parses UPI QR codes into payment details.
 * Supports:
 *  1. UPI URI: upi://pay?pa=phone@upio&pn=Name&am=100
 *  2. Direct 10-digit Indian phone number: 9876543210
 *  3. VPA / UPI ID: 9876543210@upio or merchant@okhdfcbank
 */
export const parseUpiQr = (rawText) => {
  if (!rawText || typeof rawText !== 'string') return null;
  const text = rawText.trim();

  // 1. UPI URI scheme: upi://pay?...
  if (text.toLowerCase().startsWith('upi://pay')) {
    try {
      const url = new URL(text);
      const pa = url.searchParams.get('pa') || '';
      const pn = url.searchParams.get('pn') || '';
      const am = url.searchParams.get('am') || '';

      // Match 10-digit Indian mobile number in VPA
      const phoneMatch = pa.match(/^([6-9]\d{9})@/);

      return {
        valid: true,
        type: 'UPI_URI',
        upiId: pa,
        name: decodeURIComponent(pn),
        phone: phoneMatch ? phoneMatch[1] : '',
        amount: am || '',
        raw: text,
      };
    } catch {
      // Fallback regex if URL parsing fails
      const paMatch = text.match(/[?&]pa=([^&]+)/i);
      const pnMatch = text.match(/[?&]pn=([^&]+)/i);
      const amMatch = text.match(/[?&]am=([^&]+)/i);
      const pa = paMatch ? decodeURIComponent(paMatch[1]) : '';
      const phoneMatch = pa.match(/^([6-9]\d{9})@/);

      return {
        valid: true,
        type: 'UPI_URI',
        upiId: pa,
        name: pnMatch ? decodeURIComponent(pnMatch[1]) : '',
        phone: phoneMatch ? phoneMatch[1] : '',
        amount: amMatch ? amMatch[1] : '',
        raw: text,
      };
    }
  }

  // 2. Direct 10-digit mobile number
  const phoneMatch = text.match(/^[6-9]\d{9}$/);
  if (phoneMatch) {
    return {
      valid: true,
      type: 'PHONE',
      phone: text,
      name: '',
      upiId: `${text}@upio`,
      amount: '',
      raw: text,
    };
  }

  // 3. Raw UPI VPA e.g. 9876543210@upio
  if (text.includes('@')) {
    const vpaPhone = text.match(/^([6-9]\d{9})@/);
    return {
      valid: true,
      type: 'VPA',
      upiId: text,
      phone: vpaPhone ? vpaPhone[1] : '',
      name: '',
      amount: '',
      raw: text,
    };
  }

  return {
    valid: false,
    raw: text,
  };
};

