export default function BookingFormSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div>
        <div className="h-7 w-48 bg-gray-200 rounded mb-4"></div>
        
        {/* Check-in date skeleton */}
        <div className="mb-4">
          <div className="h-5 w-24 bg-gray-200 rounded mb-1"></div>
          <div className="h-10 w-full bg-gray-200 rounded"></div>
        </div>
        
        {/* Check-out date skeleton */}
        <div className="mb-4">
          <div className="h-5 w-24 bg-gray-200 rounded mb-1"></div>
          <div className="h-10 w-full bg-gray-200 rounded"></div>
        </div>
        
        {/* Number of guests skeleton */}
        <div className="mb-4">
          <div className="h-5 w-16 bg-gray-200 rounded mb-1"></div>
          <div className="h-10 w-full bg-gray-200 rounded"></div>
        </div>
      </div>
      
      {/* Special requests skeleton */}
      <div>
        <div className="h-7 w-40 bg-gray-200 rounded mb-4"></div>
        <div className="h-5 w-full bg-gray-200 rounded mb-1"></div>
        <div className="h-24 w-full bg-gray-200 rounded"></div>
      </div>
      
      {/* Submit button skeleton */}
      <div className="h-12 w-full bg-gray-200 rounded"></div>
      <div className="h-4 w-40 bg-gray-200 rounded mx-auto"></div>
    </div>
  );
}
