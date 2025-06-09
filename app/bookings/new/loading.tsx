import BookingFormSkeleton from './components/BookingFormSkeleton';
import BookingSummarySkeleton from './components/BookingSummarySkeleton';

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-6"></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking form skeleton */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <BookingFormSkeleton />
          </div>
        </div>
        
        {/* Booking summary skeleton */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <BookingSummarySkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}
