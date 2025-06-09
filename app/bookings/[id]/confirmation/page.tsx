import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';
import { BookingConfirmationDetails, BookingConfirmationSkeleton } from './components';
import { getBookingById } from '../../actions';
import { getCurrentUser } from '@/app/auth';

interface BookingConfirmationPageProps {
  params: {
    id: string;
  };
  searchParams: {
    accountCreationPending?: string;
  };
}

export default async function BookingConfirmationPage({ params, searchParams }: BookingConfirmationPageProps) {
  // Get the current user (may be null for guest bookings)
  const user = await getCurrentUser();

  try {
    // Fetch the booking details
    const booking = await getBookingById(params.id);
    
    // For authenticated users, check if they are authorized to view this booking
    // For guests, we allow access to the confirmation page directly via the booking ID
    if (user && booking.guestId._id !== user.id && booking.hostId._id !== user.id && user.role !== 'admin') {
      notFound();
    }

    // Check if account creation is pending from query params
    const accountCreationPending = searchParams.accountCreationPending === 'true';
    
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<BookingConfirmationSkeleton />}>
          <BookingConfirmationDetails 
            booking={booking} 
            user={user} 
            accountCreationPending={accountCreationPending} 
          />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Error fetching booking:', error);
    notFound();
  }
}
