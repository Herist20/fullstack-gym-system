'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export function Breadcrumbs() {
  const pathname = usePathname();
  const paths = pathname.split('/').filter(Boolean);

  if (paths.length === 0) {
    return null;
  }

  const breadcrumbs = paths.map((path, index) => {
    const href = '/' + paths.slice(0, index + 1).join('/');
    const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
    return { href, label };
  });

  return (
    <nav className="flex px-4 py-3 sm:px-6 lg:px-8 border-b border-gray-200 bg-white">
      <ol className="flex items-center space-x-2">
        <li>
          <Link
            href="/"
            className="text-gray-400 hover:text-gray-500"
          >
            <Home className="h-4 w-4" />
          </Link>
        </li>
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.href} className="flex items-center">
            <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
            {index === breadcrumbs.length - 1 ? (
              <span className="text-sm font-medium text-gray-900">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
