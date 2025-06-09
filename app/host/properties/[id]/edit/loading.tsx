import React from 'react';

export default function EditPropertyLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
      {/* Page header */}
      <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
      
      {/* Progress steps */}
      <div className="mb-8">
        <div className="hidden sm:flex items-center justify-between mb-4">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full border-2 border-gray-200 mb-1"></div>
              <div className="h-2 w-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="h-1 w-full bg-gray-200 rounded"></div>
          </div>
          <div className="relative flex justify-between">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="w-6 h-6 bg-gray-200 rounded-full"></div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Step title */}
      <div className="h-6 w-36 bg-gray-200 rounded mb-4"></div>
      
      {/* Form container */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {/* Basic info form skeleton */}
        <div className="space-y-6">
          <div>
            <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
          
          <div>
            <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
            <div className="h-24 bg-gray-200 rounded w-full"></div>
          </div>
          
          <div>
            <div className="h-4 w-28 bg-gray-200 rounded mb-2"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Navigation buttons */}
      <div className="flex justify-between">
        <div className="h-10 w-24 bg-gray-200 rounded"></div>
        <div className="h-10 w-24 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}
