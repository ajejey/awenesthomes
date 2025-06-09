import React from 'react';
import Link from 'next/link';

export default function BookingsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with navigation */}
      <div className="bg-white shadow-sm mb-6">
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
      </div>

      {/* Page title and description - skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="mt-1 h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Stats cards - skeleton */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-8 w-16 bg-gray-300 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter bar - skeleton */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="h-10 w-40 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-40 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-40 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-64 bg-gray-200 rounded animate-pulse ml-auto"></div>
        </div>
      </div>
      
      {/* Bookings list - skeleton */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {[...Array(5)].map((_, i) => (
            <li key={i} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-gray-200 rounded-md animate-pulse"></div>
                  <div className="ml-4">
                    <div className="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
                    <div className="mt-1 h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="mt-1 h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="mt-4 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mr-4"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="mt-2 sm:mt-0">
                  <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
