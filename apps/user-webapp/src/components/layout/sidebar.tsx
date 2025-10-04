'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  HomeIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  CreditCardIcon,
  UserCircleIcon,
  BellIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Classes', href: '/classes', icon: Squares2X2Icon },
  { name: 'My Bookings', href: '/bookings', icon: ClipboardDocumentListIcon },
  { name: 'Schedule', href: '/schedule', icon: CalendarIcon },
  { name: 'Membership', href: '/membership', icon: CreditCardIcon },
  { name: 'Profile', href: '/profile', icon: UserCircleIcon },
  { name: 'Notifications', href: '/notifications', icon: BellIcon },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900">
      <div className="flex h-16 items-center px-6">
        <h1 className="text-xl font-bold text-white">Gym Portal</h1>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
