'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { QRScanner } from '@/components/qr/qr-scanner';
import { Card } from '@/components/ui/card';
import { QrCode, Users, CheckCircle } from 'lucide-react';

export default function CheckinPage() {
  const [recentCheckins, setRecentCheckins] = useState<any[]>([]);

  const handleScanSuccess = (bookingData: any) => {
    // Add to recent check-ins
    setRecentCheckins((prev) => [bookingData, ...prev.slice(0, 9)]);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">QR Code Check-in</h1>
            <p className="text-sm text-gray-600 mt-1">
              Scan member QR codes to check them in for classes
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <QrCode className="h-5 w-5" />
            <span>Ready to scan</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scanner */}
          <div>
            <QRScanner onScanSuccess={handleScanSuccess} />
          </div>

          {/* Recent Check-ins */}
          <div>
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold">Recent Check-ins</h3>
              </div>

              {recentCheckins.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>No check-ins yet</p>
                  <p className="text-sm">Scanned check-ins will appear here</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {recentCheckins.map((checkin, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {checkin.userName}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {checkin.className}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>{checkin.scheduleDate}</span>
                            <span>{checkin.scheduleTime}</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Checked in
                          </div>
                          <p className="text-xs text-gray-500 mt-1 text-right">
                            {new Date(checkin.checkedInAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Instructions */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">How to use:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
            <li>Click "Start Scanning" to activate the camera</li>
            <li>Ask the member to show their booking QR code</li>
            <li>Position the QR code within the camera frame</li>
            <li>The system will automatically check them in when the QR code is scanned</li>
            <li>Check-in is only allowed 1 hour before class starts</li>
          </ol>
        </Card>
      </div>
    </DashboardLayout>
  );
}
