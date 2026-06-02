import { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { supabase } from '../lib/supabase';

export default function ScannerPage() {
  const [scanResult, setScanResult] = useState<{ email: string, isValid: boolean, message: string, name?: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastScanned, setLastScanned] = useState<string | null>(null);

  const handleRawValue = async (rawValue: string) => {
    if (isProcessing || rawValue === lastScanned) return;
    
    if (!rawValue.startsWith('promptwars:')) {
      setScanResult({ email: rawValue, isValid: false, message: 'Invalid QR Code Format' });
      setLastScanned(rawValue);
      return;
    }

    setIsProcessing(true);
    setLastScanned(rawValue);
    const email = rawValue.split(':')[1];

    try {
      const { data, error } = await supabase
        .from('rsvps')
        .select('name, email')
        .eq('event_slug', 'promptwars')
        .eq('email', email)
        .single();

      if (error || !data) {
        setScanResult({ email, isValid: false, message: 'Not Registered in Database' });
      } else {
        setScanResult({ email, isValid: true, message: 'Valid Ticket!', name: data.name });
      }
    } catch (err) {
      setScanResult({ email, isValid: false, message: 'Error checking database' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex-grow w-full flex flex-col bg-gray-900 min-h-screen pt-12">
      <header className="max-w-2xl mx-auto px-6 pb-6 text-center w-full">
        <h1 className="text-3xl font-black text-white mb-2">
          Door Scanner <i className="fas fa-qrcode text-purple-400"></i>
        </h1>
        <p className="text-gray-400 text-sm">
          Point the camera at the attendee's QR ticket.
        </p>
      </header>

      <main className="max-w-md mx-auto w-full px-4 flex flex-col gap-6">
        <div className="bg-black rounded-3xl overflow-hidden border-4 border-gray-800 shadow-2xl relative">
          {/* Camera Scanner */}
          <Scanner 
            onScan={(detectedCodes: any) => {
              if (detectedCodes && detectedCodes.length > 0) {
                handleRawValue(detectedCodes[0].rawValue);
              }
            }} 
            formats={['qr_code']}
            components={{ audio: false }}
          />
          {isProcessing && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
            </div>
          )}
        </div>

        {/* Results Banner */}
        {scanResult && (
          <div className={`p-6 rounded-2xl border-2 shadow-lg text-center animate-in slide-in-from-bottom-4 ${scanResult.isValid ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl ${scanResult.isValid ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              <i className={`fas ${scanResult.isValid ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
            </div>
            <h2 className={`text-2xl font-black mb-2 ${scanResult.isValid ? 'text-green-700' : 'text-red-700'}`}>
              {scanResult.message}
            </h2>
            {scanResult.name && (
              <p className="text-xl font-bold text-gray-900 mb-1">{scanResult.name}</p>
            )}
            <p className="text-sm text-gray-600 font-medium break-all">{scanResult.email}</p>
            
            <button 
              onClick={() => {
                setScanResult(null);
                setLastScanned(null);
              }}
              className="mt-6 px-6 py-2 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 transition-colors"
            >
              Scan Next Ticket
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
