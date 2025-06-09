import React from 'react';

export default function BecomeAHostLoading() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-7xl mx-auto">
        {/* Hero Section Skeleton */}
        <div className="relative h-[40vh] bg-gray-200 rounded-lg mb-8 animate-pulse">
          <div className="absolute inset-0 flex flex-col justify-center px-8">
            <div className="h-12 bg-gray-300 rounded w-3/4 max-w-2xl mb-6"></div>
            <div className="h-6 bg-gray-300 rounded w-2/4 max-w-xl mb-8"></div>
            <div className="h-10 bg-gray-300 rounded w-40"></div>
          </div>
        </div>
        
        {/* Benefits Section Skeleton */}
        <div className="py-12">
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-12"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 p-6 rounded-lg animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* How It Works Section Skeleton */}
        <div className="py-12">
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-12"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-2 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
