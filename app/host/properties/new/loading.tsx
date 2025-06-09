import React from 'react';

export default function CreatePropertyLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="animate-pulse">
        {/* Header */}
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 mb-1"></div>
                <div className="h-2 bg-gray-200 rounded w-12 hidden sm:block"></div>
              </div>
            ))}
          </div>
          <div className="relative h-1 w-full bg-gray-200 rounded mt-4"></div>
        </div>
        
        {/* Form section */}
        <div>
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Buttons */}
        <div className="flex justify-between">
          <div className="h-10 bg-gray-200 rounded w-24"></div>
          <div className="h-10 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
}
