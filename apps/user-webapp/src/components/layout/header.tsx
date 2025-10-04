'use client';

import { useAuth } from '@/hooks/use-auth';
import { useNotificationStore } from '@/store/notification.store';
import { BellIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export function Header() {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotificationStore();

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Welcome, {user?.fullName || 'Member'}!
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/notifications" className="relative">
          <BellIcon className="h-6 w-6 text-gray-600 hover:text-gray-900" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>

        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gray-300">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-600">
                {user?.fullName?.[0] || 'U'}
              </div>
            )}
          </div>

          <button
            onClick={() => logout()}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
