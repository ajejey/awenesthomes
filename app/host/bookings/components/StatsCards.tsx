'use client';

import React from 'react';
import { 
  CalendarIcon, 
  UsersIcon, 
  CheckCircleIcon, 
  CurrencyRupeeIcon 
} from '@heroicons/react/24/outline';

interface BookingStats {
  upcomingBookings: number;
  currentGuests: number;
  recentCompletedBookings: number;
  totalRevenue: number;
}

export default function StatsCards({ stats }: { stats: BookingStats }) {
  // Format currency in INR
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const statCards = [
    {
      name: 'Upcoming Bookings',
      value: stats.upcomingBookings,
      icon: CalendarIcon,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Current Guests',
      value: stats.currentGuests,
      icon: UsersIcon,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      name: 'Recent Stays',
      value: stats.recentCompletedBookings,
      icon: CheckCircleIcon,
      iconColor: 'text-purple-500',
      bgColor: 'bg-purple-50',
      description: 'Completed in last 30 days'
    },
    {
      name: '30-Day Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: CurrencyRupeeIcon,
      iconColor: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      isMonetary: true
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      {statCards.map((card) => (
        <div key={card.name} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className={`flex-shrink-0 rounded-md p-3 ${card.bgColor}`}>
                <card.icon className={`h-6 w-6 ${card.iconColor}`} aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  {card.name}
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {card.value}
                  </div>
                </dd>
                {card.description && (
                  <p className="text-xs text-gray-500 mt-1">
                    {card.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
