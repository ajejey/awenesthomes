'use client';

import React, { useState, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { BookingFilterParams } from '@/lib/schemas/booking';

interface FilterBarProps {
  initialFilters: BookingFilterParams;
}

export default function FilterBar({ initialFilters }: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  
  const [filters, setFilters] = useState<BookingFilterParams>({
    status: initialFilters.status || 'all',
    sortBy: initialFilters.sortBy || 'check_in',
    search: initialFilters.search || '',
    timeframe: initialFilters.timeframe || 'upcoming',
  });

  const [searchQuery, setSearchQuery] = useState(initialFilters.search || '');

  // Handle filter changes
  const handleFilterChange = (key: keyof BookingFilterParams, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL with new filters
    applyFilters(newFilters);
  };

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newFilters = { ...filters, search: searchQuery };
    setFilters(newFilters);
    
    // Update URL with new filters
    applyFilters(newFilters);
  };

  // Apply filters by updating the URL
  const applyFilters = (newFilters: BookingFilterParams) => {
    startTransition(() => {
      // Build query string
      const params = new URLSearchParams();
      
      if (newFilters.status && newFilters.status !== 'all') {
        params.set('status', newFilters.status);
      }
      
      if (newFilters.sortBy && newFilters.sortBy !== 'check_in') {
        params.set('sortBy', newFilters.sortBy);
      }
      
      if (newFilters.search) {
        params.set('search', newFilters.search);
      }
      
      if (newFilters.timeframe && newFilters.timeframe !== 'upcoming') {
        params.set('timeframe', newFilters.timeframe);
      }
      
      // Update URL
      const queryString = params.toString();
      router.push(`${pathname}${queryString ? `?${queryString}` : ''}`);
    });
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        {/* Status filter */}
        <div>
          <label htmlFor="status" className="sr-only">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            disabled={isPending}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Timeframe filter */}
        <div>
          <label htmlFor="timeframe" className="sr-only">
            Timeframe
          </label>
          <select
            id="timeframe"
            name="timeframe"
            value={filters.timeframe}
            onChange={(e) => handleFilterChange('timeframe', e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            disabled={isPending}
          >
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
            <option value="all">All Time</option>
          </select>
        </div>

        {/* Sort filter */}
        <div>
          <label htmlFor="sortBy" className="sr-only">
            Sort by
          </label>
          <select
            id="sortBy"
            name="sortBy"
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            disabled={isPending}
          >
            <option value="check_in">Check-in Date</option>
            <option value="check_out">Check-out Date</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="amount">Amount (High to Low)</option>
          </select>
        </div>

        {/* Search box */}
        <div className="ml-auto">
          <form onSubmit={handleSearchSubmit} className="flex">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search bookings"
                value={searchQuery}
                onChange={handleSearchChange}
                disabled={isPending}
              />
            </div>
            <button
              type="submit"
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isPending}
            >
              {isPending ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
