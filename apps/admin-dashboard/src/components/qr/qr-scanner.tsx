'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, XCircle, Camera } from 'lucide-react';
import { toast } from 'sonner';

interface QRScannerProps {
  onScanSuccess?: (bookingData: any) => void;
  onScanError?: (error: string) => void;
}

export function QRScanner({ onScanSuccess, onScanError }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [cameras, setCameras] = useState<any[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');

  useEffect(() => {
    // Get available cameras
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          setCameras(devices);
          setSelectedCamera(devices[0].id);
        }
      })
      .catch((err) => {
        console.error('Failed to get cameras:', err);
      });

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop();
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      setError(null);
      setScanResult(null);

      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;

      await scanner.start(
        selectedCamera || { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          // Stop scanning
          await scanner.stop();
          setIsScanning(false);

          // Process check-in
          await processCheckin(decodedText);
        },
        (errorMessage) => {
          // Ignore scan errors (too noisy)
        }
      );

      setIsScanning(true);
    } catch (err: any) {
      console.error('Scanner start error:', err);
      setError(err.message || 'Failed to start scanner');
      toast.error('Failed to start camera');
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current?.isScanning) {
      await scannerRef.current.stop();
      setIsScanning(false);
    }
  };

  const processCheckin = async (qrData: string) => {
    try {
      const response = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrData }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Check-in failed');
        toast.error(result.error || 'Check-in failed');
        onScanError?.(result.error);
        return;
      }

      setScanResult(result.booking);
      toast.success('Check-in successful!');
      onScanSuccess?.(result.booking);
    } catch (error: any) {
      console.error('Check-in error:', error);
      setError(error.message || 'Check-in failed');
      toast.error('Check-in failed');
      onScanError?.(error.message);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">QR Code Scanner</h3>
            {cameras.length > 1 && !isScanning && (
              <select
                value={selectedCamera}
                onChange={(e) => setSelectedCamera(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                {cameras.map((camera) => (
                  <option key={camera.id} value={camera.id}>
                    {camera.label || `Camera ${camera.id}`}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div
            id="qr-reader"
            className={`w-full ${isScanning ? 'block' : 'hidden'}`}
            style={{ minHeight: '300px' }}
          />

          {!isScanning && !scanResult && (
            <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
              <div className="text-center">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Ready to scan QR code</p>
              </div>
            </div>
          )}

          {scanResult && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
                <div className="flex-1">
                  <h4 className="font-semibold text-green-900 mb-2">
                    Check-in Successful!
                  </h4>
                  <div className="space-y-1 text-sm text-green-800">
                    <p>
                      <strong>Name:</strong> {scanResult.userName}
                    </p>
                    <p>
                      <strong>Class:</strong> {scanResult.className}
                    </p>
                    <p>
                      <strong>Date:</strong> {scanResult.scheduleDate}
                    </p>
                    <p>
                      <strong>Time:</strong> {scanResult.scheduleTime}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <XCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
                <div>
                  <h4 className="font-semibold text-red-900 mb-1">Error</h4>
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            {!isScanning ? (
              <Button onClick={startScanning} className="flex-1">
                <Camera className="h-4 w-4 mr-2" />
                Start Scanning
              </Button>
            ) : (
              <Button onClick={stopScanning} variant="danger" className="flex-1">
                Stop Scanning
              </Button>
            )}

            {(scanResult || error) && (
              <Button
                onClick={() => {
                  setScanResult(null);
                  setError(null);
                }}
                variant="outline"
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
