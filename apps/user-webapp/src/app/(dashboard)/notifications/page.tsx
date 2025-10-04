'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useNotifications } from '@/hooks/use-notifications';
import { LoadingSpinner } from '@/components/ui/loading';
import { formatDateTime } from '@/lib/utils';
import { useState } from 'react';

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, isLoading } = useNotifications();
  const [filter, setFilter] = useState<'all' | 'booking' | 'reminder' | 'promotion' | 'system'>('all');

  const filteredNotifications = notifications?.filter((notif: any) =>
    filter === 'all' || notif.type === filter
  );

  const handleNotificationClick = async (notificationId: string, isRead: boolean) => {
    if (!isRead) {
      await markAsRead(notificationId);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return (
          <div className="rounded-full bg-blue-100 p-2">
            <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        );
      case 'reminder':
        return (
          <div className="rounded-full bg-yellow-100 p-2">
            <svg className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
        );
      case 'promotion':
        return (
          <div className="rounded-full bg-green-100 p-2">
            <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="rounded-full bg-gray-100 p-2">
            <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="mt-2 text-gray-600">Stay updated with your activities</p>
          </div>

          <button
            onClick={() => markAllAsRead()}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Mark all as read
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto">
          {['all', 'booking', 'reminder', 'promotion', 'system'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type as any)}
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors ${
                filter === type
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : filteredNotifications && filteredNotifications.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification: any) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id, notification.is_read)}
                  className={`cursor-pointer p-6 transition-colors hover:bg-gray-50 ${
                    !notification.is_read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {getNotificationIcon(notification.type)}

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                          <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                        </div>
                        {!notification.is_read && (
                          <div className="ml-4 h-2 w-2 rounded-full bg-primary"></div>
                        )}
                      </div>

                      <p className="mt-2 text-xs text-gray-500">{formatDateTime(notification.created_at)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-600">No notifications</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
