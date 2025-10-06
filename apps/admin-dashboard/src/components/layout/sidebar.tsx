'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  Calendar,
  CalendarCheck,
  UserCog,
  CreditCard,
  BarChart3,
  Package,
  Settings,
  ChevronLeft,
  ChevronRight,
  QrCode,
  Banknote,
} from 'lucide-react';
import { useState } from 'react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  role?: 'admin' | 'trainer';
}

const adminNavItems: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Members', href: '/members', icon: Users },
  { name: 'Classes', href: '/classes', icon: Dumbbell },
  { name: 'Schedule', href: '/schedule', icon: Calendar },
  { name: 'Bookings', href: '/bookings', icon: CalendarCheck },
  { name: 'Trainers', href: '/trainers', icon: UserCog },
  { name: 'Payments', href: '/payments', icon: CreditCard },
  { name: 'Manual Payments', href: '/payments/manual', icon: Banknote },
  { name: 'QR Check-in', href: '/checkin', icon: QrCode },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Equipment', href: '/equipment', icon: Package },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const trainerNavItems: NavItem[] = [
  { name: 'My Dashboard', href: '/trainer', icon: LayoutDashboard },
  { name: 'My Schedule', href: '/trainer/schedule', icon: Calendar },
  { name: 'Students', href: '/trainer/students', icon: Users },
];

interface SidebarProps {
  isAdmin: boolean;
}

export function Sidebar({ isAdmin }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const navItems = isAdmin ? adminNavItems : trainerNavItems;

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          'hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 bg-gray-900 transition-all duration-300',
          collapsed ? 'lg:w-20' : 'lg:w-64'
        )}
      >
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex items-center justify-between h-16 px-4 bg-gray-800">
            {!collapsed && (
              <h1 className="text-xl font-bold text-white truncate">
                Gym Admin
              </h1>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
            >
              {collapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </button>
          </div>

          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href ||
                  (item.href !== '/' && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                      isActive
                        ? 'bg-orange-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    )}
                    title={collapsed ? item.name : undefined}
                  >
                    <Icon
                      className={cn(
                        'flex-shrink-0 h-5 w-5',
                        collapsed ? 'mx-auto' : 'mr-3'
                      )}
                    />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar - Simplified */}
      <div className="lg:hidden">
        {/* Mobile sidebar will be implemented with a drawer/sheet component */}
      </div>
    </>
  );
}
