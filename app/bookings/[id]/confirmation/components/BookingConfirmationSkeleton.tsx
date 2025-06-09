export default function BookingConfirmationSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      {/* Header */}
      <div className="bg-blue-300 px-6 py-4">
        <div className="h-8 w-64 bg-blue-200 rounded mb-2"></div>
        <div className="h-5 w-48 bg-blue-200 rounded"></div>
      </div>

      {/* Status banner */}
      <div className="px-6 py-3 bg-gray-100">
        <div className="h-6 w-32 bg-gray-200 rounded"></div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Property details */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3 h-48 bg-gray-200 rounded-lg"></div>

          <div className="md:w-2/3 space-y-4">
            <div className="h-7 w-3/4 bg-gray-200 rounded"></div>

            <div className="flex items-center">
              <div className="h-5 w-5 bg-gray-200 rounded-full mr-2"></div>
              <div className="h-5 w-full bg-gray-200 rounded"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="h-5 w-5 bg-gray-200 rounded-full mr-2"></div>
                  <div>
                    <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
                    <div className="h-5 w-32 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Price details */}
        <div>
          <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>

          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="h-5 w-40 bg-gray-200 rounded"></div>
                <div className="h-5 w-20 bg-gray-200 rounded"></div>
              </div>
            ))}

            <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between">
              <div className="h-6 w-16 bg-gray-200 rounded"></div>
              <div className="h-6 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>

        {/* Payment status */}
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex items-center">
            <div className="h-5 w-5 bg-gray-200 rounded-full mr-2"></div>
            <div>
              <div className="h-4 w-28 bg-gray-200 rounded mb-1"></div>
              <div className="h-5 w-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>

        {/* Contact information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="h-6 w-40 bg-gray-200 rounded mb-2"></div>
            <div className="flex items-center">
              <div className="h-12 w-12 bg-gray-200 rounded-full mr-3"></div>
              <div>
                <div className="h-5 w-32 bg-gray-200 rounded mb-1"></div>
                <div className="h-4 w-40 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-4">
          <div className="h-10 w-36 bg-gray-200 rounded"></div>
          <div className="h-10 w-36 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}
