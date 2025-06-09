'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  CalendarIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

interface BookingsTabsProps {
  activeTab: string;
}

export default function BookingsTabs({ activeTab }: BookingsTabsProps) {
  const pathname = usePathname();
  
  const tabs = [
    {
      name: 'upcoming',
      label: 'Upcoming',
      icon: <CalendarIcon className="h-5 w-5" />,
      href: '/bookings?tab=upcoming',
    },
    {
      name: 'pending',
      label: 'Pending',
      icon: <ClockIcon className="h-5 w-5" />,
      href: '/bookings?tab=pending',
    },
    {
      name: 'completed',
      label: 'Completed',
      icon: <CheckCircleIcon className="h-5 w-5" />,
      href: '/bookings?tab=completed',
    },
    {
      name: 'cancelled',
      label: 'Cancelled',
      icon: <XCircleIcon className="h-5 w-5" />,
      href: '/bookings?tab=cancelled',
    },
    {
      name: 'hosting',
      label: 'Hosting',
      icon: <HomeIcon className="h-5 w-5" />,
      href: '/bookings?tab=hosting',
    },
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.name;
          
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`
                flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${isActive
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
