import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBookingById } from '../actions';
import BookingDetails from './components/BookingDetails';
import BookingActions from './components/BookingActions';
import PropertySnapshot from './components/PropertySnapshot';
import GuestInfo from './components/GuestInfo';

export const metadata = {
  title: 'Booking Details | AweNestHomes',
  description: 'View and manage booking details on AweNestHomes',
};

export default async function BookingDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    // Fetch booking details
    const booking = await getBookingById(params.id);

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with navigation */}
        {/* <div className="bg-white shadow-sm mb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <h1 className="text-xl font-semibold text-gray-900">Host Dashboard</h1>
              <nav className="flex space-x-8">
                <Link
                  href="/host/properties"
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  Properties
                </Link>
                <Link
                  href="/host/bookings"
                  className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium border-b-2 border-blue-600"
                >
                  Bookings
                </Link>
                <Link
                  href="/host/reviews"
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  Reviews
                </Link>
                <Link
                  href="/host/earnings"
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  Earnings
                </Link>
              </nav>
            </div>
          </div>
        </div> */}

        {/* Back button */}
        <div className="mb-6">
          <Link
            href="/host/bookings"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            <svg
              className="mr-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Bookings
          </Link>
        </div>

        {/* Page title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Booking Details</h1>
          <p className="mt-1 text-sm text-gray-500">
            Booking #{booking._id.substring(booking._id.length - 6).toUpperCase()}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main booking details */}
          <div className="lg:col-span-2 space-y-6">
            <BookingDetails booking={booking} />
            <BookingActions booking={booking} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <PropertySnapshot property={{
              id: booking.propertyId,
              title: booking.propertyTitle || '',
              image: booking.propertyImage || '',
              location: booking.propertyLocation || { address: '', city: '', state: '', zipCode: '', country: '' },
              bedrooms: booking.propertyBedrooms || 0,
              beds: booking.propertyBeds || 0,
              bathrooms: booking.propertyBathrooms || 0,
              maxGuests: booking.propertyMaxGuests || 0,
            }} />
            <GuestInfo guest={{
              id: booking.guestId,
              name: booking.guestName || '',
              email: booking.guestEmail || '',
            }} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching booking details:', error);
    notFound();
  }
}
