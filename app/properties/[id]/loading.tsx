import React from 'react';

export default function PropertyDetailLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      {/* Property title and basic info */}
      <div className="mb-6">
        <div className="h-8 w-3/4 bg-gray-200 rounded mb-2"></div>
        <div className="flex items-center">
          <div className="h-4 w-24 bg-gray-200 rounded mr-3"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
      
      {/* Property gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 rounded-lg overflow-hidden">
        {/* Main image */}
        <div className="aspect-square md:aspect-auto md:row-span-2 md:col-span-2 bg-gray-200"></div>
        
        {/* Secondary images */}
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="aspect-square bg-gray-200 hidden md:block"></div>
        ))}
      </div>
      
      {/* Property details and booking form */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Host and property type */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="h-6 w-64 bg-gray-200 rounded mb-2"></div>
                <div className="flex items-center">
                  <div className="h-4 w-20 bg-gray-200 rounded mr-3"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded mr-3"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded mr-3"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>
              
              <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
            </div>
          </div>
          
          {/* Property description */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
            </div>
          </div>
          
          {/* Property amenities */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="h-5 w-5 bg-gray-200 rounded-full mr-3"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Availability */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="h-4 w-48 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
          
          {/* House rules */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="h-5 w-5 bg-gray-200 rounded-full mr-3"></div>
                  <div>
                    <div className="h-4 w-20 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 w-16 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Location */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="h-6 w-24 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-full bg-gray-200 rounded mb-4"></div>
            <div className="h-64 w-full bg-gray-200 rounded-lg"></div>
          </div>
          
          {/* Host information */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
            <div className="flex">
              <div className="h-16 w-16 bg-gray-200 rounded-full mr-4"></div>
              <div className="flex-1">
                <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 w-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
          
          {/* Reviews */}
          <div>
            <div className="h-6 w-24 bg-gray-200 rounded mb-4"></div>
            <div className="flex items-center mb-6">
              <div className="h-5 w-16 bg-gray-200 rounded mr-3"></div>
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </div>
            
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex">
                  <div className="h-10 w-10 bg-gray-200 rounded-full mr-4"></div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <div className="h-4 w-32 bg-gray-200 rounded"></div>
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-full bg-gray-200 rounded mb-1"></div>
                    <div className="h-4 w-full bg-gray-200 rounded mb-1"></div>
                    <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Booking form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-baseline mb-4">
              <div className="h-6 w-24 bg-gray-200 rounded mr-1"></div>
              <div className="h-4 w-12 bg-gray-200 rounded"></div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 border border-gray-300 rounded-t-md">
                <div className="p-2 border-r border-gray-300">
                  <div className="h-4 w-16 bg-gray-200 rounded mb-1"></div>
                  <div className="h-6 w-full bg-gray-200 rounded"></div>
                </div>
                <div className="p-2">
                  <div className="h-4 w-16 bg-gray-200 rounded mb-1"></div>
                  <div className="h-6 w-full bg-gray-200 rounded"></div>
                </div>
              </div>
              
              <div className="border border-gray-300 rounded-b-md p-2">
                <div className="h-4 w-16 bg-gray-200 rounded mb-1"></div>
                <div className="h-6 w-full bg-gray-200 rounded"></div>
              </div>
              
              <div className="h-12 w-full bg-gray-200 rounded-md"></div>
              
              <div className="h-4 w-48 bg-gray-200 rounded mx-auto"></div>
              
              <div className="space-y-3 pt-4">
                <div className="flex justify-between">
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <div className="h-5 w-16 bg-gray-200 rounded"></div>
                  <div className="h-5 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
