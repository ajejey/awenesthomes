import React from 'react';

export default function HostPropertiesLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="animate-pulse">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="h-10 bg-gray-200 rounded w-36"></div>
          </div>
        </div>
        
        {/* Filter bar */}
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
            <div className="w-full sm:w-48">
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
            <div className="w-full sm:w-48">
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
        
        {/* Property cards */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 w-full"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="mt-4 flex justify-between">
                  <div className="flex space-x-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-8 w-8 bg-gray-200 rounded-full"></div>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="h-8 w-8 bg-gray-200 rounded-full"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
