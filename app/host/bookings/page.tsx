import React from 'react';
import Link from 'next/link';
import { getBookingStats, getHostBookings } from './actions';
import BookingsList from './components/BookingsList';
import FilterBar from './components/FilterBar';
import StatsCards from './components/StatsCards';

export const metadata = {
  title: 'Manage Your Bookings | AweNestHomes',
  description: 'View and manage your property bookings on AweNestHomes',
};

export default async function HostBookingsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Extract filter parameters from URL
  const filters = {
    status: searchParams.status as string || 'all',
    sortBy: searchParams.sortBy as string || 'check_in',
    search: searchParams.search as string || '',
    timeframe: searchParams.timeframe as string || 'upcoming',
  };

  // Fetch bookings data
  const { bookings, totalCount } = await getHostBookings(filters);
  
  // Fetch booking statistics
  const stats = await getBookingStats();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with navigation */}
      {/* <div className="bg-white shadow-sm mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-semibold text-gray-900">Host Dashboard</h1>
            <nav className="flex space-x-8">
              <Link
                href="/host/properties"
                className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Properties
              </Link>
              <Link
                href="/host/bookings"
                className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium border-b-2 border-blue-600"
              >
                Bookings
              </Link>
              <Link
                href="/host/reviews"
                className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Reviews
              </Link>
              <Link
                href="/host/earnings"
                className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Earnings
              </Link>
            </nav>
          </div>
        </div>
      </div> */}

      {/* Page title and description */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Bookings</h1>
          <p className="mt-1 text-sm text-gray-500">
            {totalCount > 0 
              ? `You have ${totalCount} ${totalCount === 1 ? 'booking' : 'bookings'}`
              : 'No bookings found'}
          </p>
        </div>
      </div>

      {/* Statistics cards */}
      <StatsCards stats={stats} />

      {/* Filter bar */}
      <FilterBar initialFilters={filters} />
      
      {/* Bookings list */}
      {bookings.length > 0 ? (
        <BookingsList bookings={bookings} />
      ) : (
        <div className="mt-6 bg-white shadow overflow-hidden rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900">No bookings found</h3>
          <p className="mt-2 text-gray-500">
            {filters.search 
              ? 'Try adjusting your search or filters to find what you\'re looking for.'
              : filters.status !== 'all' || filters.timeframe !== 'all' 
                ? 'Try changing your filters to see more bookings.'
                : 'When guests book your properties, they will appear here.'}
          </p>
        </div>
      )}
    </div>
  );
}
