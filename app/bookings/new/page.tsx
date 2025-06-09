import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { BookingForm, BookingSummary, BookingFormSkeleton, BookingSummarySkeleton } from './components';
import { getCurrentUser } from '@/app/auth';
import dbConnect from '@/lib/db';
import Property from '@/lib/models/property';

// Define the page props
interface NewBookingPageProps {
  searchParams: {
    propertyId?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: string;
  };
}

export default async function NewBookingPage({ searchParams }: NewBookingPageProps) {
  // Get the property ID from the search params
  const { propertyId, checkIn, checkOut, guests } = await searchParams;
  
  if (!propertyId) {
    notFound();
  }

  // Connect to the database
  await dbConnect();
  
  // Fetch the property details
  const property = await Property.findById(propertyId);
  
  // If the property doesn't exist, return 404
  if (!property) {
    notFound();
  }

  // Convert MongoDB document to plain object
  const propertyData = JSON.parse(JSON.stringify(property));
  
  // Get the current user
  const user = await getCurrentUser();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Complete your booking</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <Suspense fallback={<BookingFormSkeleton />}>
              <BookingForm 
                property={propertyData}
                initialCheckIn={checkIn}
                initialCheckOut={checkOut}
                initialGuests={guests ? parseInt(guests, 10) : 1}
                user={user as any} // Type assertion to match BookingForm props
              />
            </Suspense>
          </div>
        </div>
        
        {/* Booking summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <Suspense fallback={<BookingSummarySkeleton />}>
              <BookingSummary 
                property={propertyData}
                checkIn={checkIn}
                checkOut={checkOut}
                guests={guests ? parseInt(guests, 10) : 1}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
