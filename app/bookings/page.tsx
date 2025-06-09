import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/app/auth';
import { BookingsList, BookingsListSkeleton, BookingsTabs } from './components';

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  // Get the current user
  const user = await getCurrentUser();
  
  // If no user is logged in, redirect to login
  if (!user) {
    redirect('/auth/login?callbackUrl=/bookings');
  }

  // Determine which tab is active
  const activeTab = searchParams.tab || 'upcoming';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Bookings</h1>
      
      {/* Tabs for different booking views */}
      <BookingsTabs activeTab={activeTab} />
      
      {/* Bookings list with suspense for loading state */}
      <div className="mt-6">
        <Suspense fallback={<BookingsListSkeleton />}>
          <BookingsList activeTab={activeTab} />
        </Suspense>
      </div>
    </div>
  );
}
