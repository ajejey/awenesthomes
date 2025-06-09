import BookingsListSkeleton from './components/BookingsListSkeleton';

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title skeleton */}
      <div className="h-10 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>
      
      {/* Tabs skeleton */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-8 overflow-x-auto">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
      
      {/* Bookings list skeleton */}
      <div className="mt-6">
        <BookingsListSkeleton />
      </div>
    </div>
  );
}
