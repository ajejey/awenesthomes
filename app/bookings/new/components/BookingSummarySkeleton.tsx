export default function BookingSummarySkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {/* Title skeleton */}
      <div className="h-7 w-40 bg-gray-200 rounded"></div>
      
      {/* Property card skeleton */}
      <div className="flex space-x-4">
        <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-lg"></div>
        <div className="flex-1 space-y-2">
          <div className="h-5 w-full bg-gray-200 rounded"></div>
          <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
          <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
        </div>
      </div>
      
      {/* Divider */}
      <div className="border-t border-gray-200 my-4"></div>
      
      {/* Trip details skeleton */}
      <div className="space-y-3">
        <div className="h-6 w-24 bg-gray-200 rounded"></div>
        
        <div className="flex items-start space-x-3">
          <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
          <div className="space-y-1">
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
            <div className="h-4 w-40 bg-gray-200 rounded"></div>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
          <div className="space-y-1">
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
      
      {/* Divider */}
      <div className="border-t border-gray-200 my-4"></div>
      
      {/* Price breakdown skeleton */}
      <div className="space-y-3">
        <div className="h-6 w-32 bg-gray-200 rounded"></div>
        
        {/* Price rows */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex justify-between">
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
          </div>
        ))}
        
        {/* Total */}
        <div className="border-t border-gray-200 pt-3 flex justify-between">
          <div className="h-5 w-16 bg-gray-200 rounded"></div>
          <div className="h-5 w-20 bg-gray-200 rounded"></div>
        </div>
      </div>
      
      {/* Property policies skeleton */}
      <div className="border-t border-gray-200 pt-4 mt-4">
        <div className="h-6 w-40 bg-gray-200 rounded mb-2"></div>
        
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-4 w-full bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
