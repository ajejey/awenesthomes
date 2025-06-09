export default function PropertyDetailsSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      {/* Header Skeleton */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="h-10 w-24 bg-gray-200 rounded-md"></div>
            <div className="h-10 w-24 bg-gray-200 rounded-md"></div>
            <div className="h-10 w-24 bg-gray-200 rounded-md"></div>
          </div>
        </div>
      </div>
      
      {/* Gallery Skeleton */}
      <div className="relative h-64 md:h-96 bg-gray-200">
        <div className="grid grid-cols-4 gap-1 h-full">
          <div className="col-span-2 row-span-2 bg-gray-300"></div>
          <div className="bg-gray-300"></div>
          <div className="bg-gray-300"></div>
          <div className="bg-gray-300"></div>
          <div className="bg-gray-300"></div>
        </div>
      </div>
      
      {/* Content Skeleton */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-6">
          {/* Description */}
          <section>
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </section>
          
          {/* Property Details */}
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i}>
                <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                <div className="h-5 bg-gray-200 rounded w-12"></div>
              </div>
            ))}
          </section>
          
          {/* Amenities */}
          <section>
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              ))}
            </div>
          </section>
          
          {/* Rules */}
          <section>
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </section>
          
          {/* Availability */}
          <section>
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
            <div className="space-y-2">
              <div className="h-10 bg-gray-200 rounded w-full"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          </section>
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          {/* Pricing */}
          <section className="border border-gray-200 rounded-lg p-4">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          </section>
          
          {/* Location */}
          <section className="border border-gray-200 rounded-lg p-4">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="mt-4 bg-gray-300 h-48 rounded"></div>
          </section>
          
          {/* Button */}
          <div className="h-10 bg-gray-200 rounded-md w-full"></div>
        </div>
      </div>
    </div>
  );
}
