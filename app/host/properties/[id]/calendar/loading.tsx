import React from 'react';

export default function CalendarLoading() {
  // Generate skeleton calendar days
  const generateSkeletonDays = () => {
    return Array.from({ length: 30 }).map((_, index) => (
      <div key={index} className="h-16 sm:h-24 p-1 border border-gray-200 rounded-md animate-pulse">
        <div className="h-4 w-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 w-16 bg-gray-200 rounded"></div>
      </div>
    ));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-64 bg-gray-200 rounded"></div>
        </div>
        
        <div className="mt-4 sm:mt-0 flex">
          <div className="h-10 w-32 bg-gray-200 rounded mr-3"></div>
          <div className="h-10 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
      
      {/* Calendar */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Calendar header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-full bg-gray-200 h-8 w-8"></div>
            <div className="h-6 w-36 bg-gray-200 rounded"></div>
            <div className="p-2 rounded-full bg-gray-200 h-8 w-8"></div>
          </div>
        </div>
        
        {/* Calendar grid */}
        <div className="p-6">
          {/* Day labels */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-2">
            {generateSkeletonDays()}
          </div>
        </div>
        
        {/* Calendar legend */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Current availability and blocked dates */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Availability ranges */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>
          
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-gray-100 border border-gray-200 rounded-md">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Blocked dates */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
          
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-gray-100 border border-gray-200 rounded-md">
                <div>
                  <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 w-24 bg-gray-200 rounded"></div>
                </div>
                <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
