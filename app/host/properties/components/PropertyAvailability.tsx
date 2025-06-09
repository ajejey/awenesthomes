'use client';

import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

type AvailabilityPeriod = {
  startDate: string | Date;
  endDate: string | Date;
};

type PropertyAvailabilityProps = {
  availability: AvailabilityPeriod[];
};

export default function PropertyAvailability({ availability }: PropertyAvailabilityProps) {
  if (!availability || availability.length === 0) {
    return null;
  }

  // Format dates for display
  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'MMM d, yyyy');
  };

  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <CalendarDaysIcon className="h-5 w-5 text-gray-500" />
        Availability
      </h2>
      <div className="space-y-4">
        {availability.map((period, index) => (
          <div 
            key={index}
            className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-2 mb-2 sm:mb-0">
              <span className="text-gray-700 font-medium">Period {index + 1}:</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">From:</span>
                <span className="text-gray-700">{formatDate(period.startDate)}</span>
              </div>
              <div className="hidden sm:block text-gray-400">→</div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">To:</span>
                <span className="text-gray-700">{formatDate(period.endDate)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
