"use client";

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { HomeIcon } from '@heroicons/react/24/outline';
import { ArrowLeftCircle } from 'lucide-react';

const HostHeader = () => {
  const pathname = usePathname();

  // Navigation items with their paths and labels
  const navItems = [
    { href: '/host/properties', label: 'Properties' },
    { href: '/host/bookings', label: 'Bookings' },
    // { href: '/host/reviews', label: 'Reviews' },
    // { href: '/host/earnings', label: 'Earnings' },
  ];

  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* add a link to home by adding a simple icon */}
          <div className="flex items-center space-x-4">
          <Link href="/" aria-label="Home" title="Home" className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-all duration-200 bg-blue-50 rounded-full p-2">
            <ArrowLeftCircle className="w-6 h-6" />
          </Link>
          <Link href="/host/properties" aria-label="Host Dashboard" title="Host Dashboard" className="text-xl font-semibold text-gray-900">Host Dashboard</Link>
          </div>
          <nav className="flex space-x-8">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium ${isActive
                    ? 'text-gray-900 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}

export default HostHeader