'use client';

import { Bell, Menu, Moon, Sun, User, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/hooks/useAuth';
import { getInitials } from '@/lib/utils';
import { useState } from 'react';

export function Topbar() {
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile menu button */}
      <button
        type="button"
        className="lg:hidden -m-2.5 p-2.5 text-gray-700"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-gray-200 lg:hidden" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="relative flex flex-1">
          {/* Search will go here if needed */}
        </div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Dark mode toggle */}
          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
          >
            {theme === 'dark' ? (
              <Sun className="h-6 w-6" />
            ) : (
              <Moon className="h-6 w-6" />
            )}
          </button>

          {/* Notifications */}
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
          >
            <Bell className="h-6 w-6" />
          </button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />

          {/* Profile dropdown */}
          <div className="relative">
            <button
              type="button"
              className="-m-1.5 flex items-center p-1.5"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <span className="sr-only">Open user menu</span>
              <div className="h-8 w-8 rounded-full bg-orange-600 flex items-center justify-center text-white text-sm font-medium">
                {user ? getInitials(user.full_name) : 'U'}
              </div>
              <span className="hidden lg:flex lg:items-center">
                <span className="ml-4 text-sm font-semibold leading-6 text-gray-900">
                  {user?.full_name || 'User'}
                </span>
              </span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 z-10 mt-2.5 w-48 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5">
                <button
                  onClick={() => {
                    signOut();
                    setShowUserMenu(false);
                  }}
                  className="flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
