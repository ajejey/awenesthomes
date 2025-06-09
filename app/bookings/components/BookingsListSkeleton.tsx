export default function BookingsListSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Property image skeleton */}
              <div className="md:w-1/4 h-48 md:h-auto bg-gray-200 rounded-lg"></div>
              
              {/* Booking details skeleton */}
              <div className="md:w-3/4 flex flex-col">
                {/* Status badge skeleton */}
                <div className="h-6 w-24 bg-gray-200 rounded-full mb-2"></div>
                
                {/* Property title skeleton */}
                <div className="h-6 w-3/4 bg-gray-200 rounded mb-1"></div>
                
                {/* Location skeleton */}
                <div className="h-4 w-1/2 bg-gray-200 rounded mb-3"></div>
                
                {/* Booking details grid skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center">
                      <div className="h-5 w-5 bg-gray-200 rounded-full mr-2"></div>
                      <div>
                        <div className="h-3 w-16 bg-gray-200 rounded mb-1"></div>
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Host/Guest info skeleton */}
                <div className="flex items-center mt-auto">
                  <div className="h-8 w-8 bg-gray-200 rounded-full mr-2"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </div>
                
                {/* View details button skeleton */}
                <div className="mt-4 flex justify-end">
                  <div className="h-8 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
