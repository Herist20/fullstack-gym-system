'use client';

import { Sidebar } from './sidebar';
import { Header } from './header';
import { useAuth } from '@/hooks/use-auth';
import { useRealtimeBookings, useRealtimeNotifications, useRealtimeClassSchedules } from '@/hooks/use-realtime';
import { LoadingPage } from '@/components/ui/loading';
import { useEffect } from 'react';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  // Setup realtime subscriptions
  useRealtimeBookings();
  useRealtimeClassSchedules();
  useRealtimeNotifications(user?.id || '');

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
