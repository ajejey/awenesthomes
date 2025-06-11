'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  CheckCircleIcon,
  ClockIcon,
  CalendarIcon,
  UserIcon,
  HomeIcon,
  CurrencyRupeeIcon,
  MapPinIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { updateBookingStatus } from '../../../actions';
import OtpVerification from './OtpVerification';
import { useRouter } from 'next/navigation';

interface BookingConfirmationDetailsProps {
  booking: any;
  user: any | null; // User can be null for guest bookings
  showOtpSection: boolean; // Renamed prop
}

export default function BookingConfirmationDetails({ booking, user, showOtpSection }: BookingConfirmationDetailsProps) {
  // Get guest email safely from the booking object
  const guestEmail = booking.guestId?.email || '';
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingStatus, setBookingStatus] = useState(booking.status);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [otpSuccess, setOtpSuccess] = useState(false);

  // These variables will be defined below

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (date: string) => {
    return format(new Date(date), 'EEEE, MMMM d, yyyy');
  };

  // Handle booking cancellation
  const handleCancelBooking = async () => {
    if (!cancellationReason.trim()) {
      setError('Please provide a reason for cancellation');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Determine cancellation type based on user role
      // If user is null (guest booking) or matches the guest ID, it's a guest cancellation
      const cancelType = !user || (user && user.id === booking.guestId._id)
        ? 'cancelled_by_guest'
        : 'cancelled_by_host';

      const updatedBooking = await updateBookingStatus(
        booking._id,
        cancelType,
        cancellationReason
      );

      setBookingStatus(updatedBooking.status);
      setShowCancelModal(false);
    } catch (err: any) {
      console.error('Error cancelling booking:', err);
      setError(err.message || 'Failed to cancel booking');
    } finally {
      setIsLoading(false);
    }
  };

  // Get status badge color and text
  const getStatusBadge = () => {
    switch (bookingStatus) {
      case 'confirmed':
        return {
          color: 'bg-green-100 text-green-800',
          icon: <CheckCircleIcon className="h-5 w-5 text-green-500 mr-1.5" />,
          text: 'Confirmed'
        };
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          icon: <ClockIcon className="h-5 w-5 text-yellow-500 mr-1.5" />,
          text: 'Pending Confirmation'
        };
      case 'cancelled_by_guest':
        return {
          color: 'bg-red-100 text-red-800',
          icon: <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-1.5" />,
          text: 'Cancelled by Guest'
        };
      case 'cancelled_by_host':
        return {
          color: 'bg-red-100 text-red-800',
          icon: <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-1.5" />,
          text: 'Cancelled by Host'
        };
      case 'rejected':
        return {
          color: 'bg-red-100 text-red-800',
          icon: <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-1.5" />,
          text: 'Rejected by Host'
        };
      case 'completed':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: <CheckCircleIcon className="h-5 w-5 text-blue-500 mr-1.5" />,
          text: 'Completed'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: <ClockIcon className="h-5 w-5 text-gray-500 mr-1.5" />,
          text: bookingStatus
        };
    }
  };

  const statusBadge = getStatusBadge();
  // Handle case where user might be null (guest booking)
  const isGuest = !user || (user && user.id === booking.guestId._id);
  const isHost = user && user.id === booking.hostId._id;
  const canCancel = ['pending', 'confirmed'].includes(bookingStatus);
  const primaryImage = booking.propertyId.images.find((img: any) => img.isPrimary) || booking.propertyId.images[0];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 px-6 py-4">
        <h1 className="text-2xl font-bold text-white">Booking Confirmation</h1>
        <p className="text-blue-100">
          Booking ID: {booking._id}
        </p>
      </div>

      {/* Status banner */}
      <div className={`px-6 py-3 flex items-center ${statusBadge.color}`}>
        {statusBadge.icon}
        <span className="font-medium">{statusBadge.text}</span>
      </div>

      {/* OTP Verification Section for guest users who opted to create an account */}
      {!user && showOtpSection && guestEmail && ( // Updated condition
        <div className="px-6 py-4">
          <OtpVerification email={guestEmail} bookingId={booking._id} otpSuccess={otpSuccess} setOtpSuccess={setOtpSuccess} />
        </div>
      )}
      {otpSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <CheckCircleIcon className="h-8 w-8 text-green-500 mr-3" />
            <h3 className="text-lg font-medium text-green-800">Account Created Successfully!</h3>
          </div>
          <p className="text-green-700 mb-4">
            Your account has been created and you are now logged in. You can access all your bookings and manage your profile.
          </p>
          <button
            type="button"
            onClick={() => router.push('/bookings')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View All Bookings
          </button>
        </div>
      )}

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Property details */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3 relative h-48 md:h-auto rounded-lg overflow-hidden">
            <Image
              src={primaryImage?.url || '/images/placeholder.jpg'}
              alt={booking.propertyId.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          </div>

          <div className="md:w-2/3 space-y-4">
            <Link href={`/properties/${booking.propertyId._id}`} className="hover:underline">
              <h2 className="text-xl font-semibold text-gray-900">{booking.propertyId.title}</h2>
            </Link>

            <div className="flex items-center text-gray-600">
              <MapPinIcon className="h-5 w-5 mr-2 flex-shrink-0" />
              <span>
                {booking.propertyId.location.address}, {booking.propertyId.location.city}, {booking.propertyId.location.state}, {booking.propertyId.location.country}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-gray-500 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Check-in</p>
                  <p className="text-gray-900">{formatDate(booking.checkIn)}</p>
                </div>
              </div>

              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-gray-500 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Check-out</p>
                  <p className="text-gray-900">{formatDate(booking.checkOut)}</p>
                </div>
              </div>

              <div className="flex items-center">
                <UserIcon className="h-5 w-5 text-gray-500 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Guests</p>
                  <p className="text-gray-900">{booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}</p>
                </div>
              </div>

              <div className="flex items-center">
                <HomeIcon className="h-5 w-5 text-gray-500 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Total nights</p>
                  <p className="text-gray-900">{booking.totalNights} {booking.totalNights === 1 ? 'night' : 'nights'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Price details */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Price details</h3>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">
                {formatCurrency(booking.basePrice)} x {booking.totalNights} nights
              </span>
              <span className="text-gray-900">{formatCurrency(booking.basePrice * booking.totalNights)}</span>
            </div>

            {booking.discountAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-green-600">
                  {booking.discountType === 'weekly' ? 'Weekly' : booking.discountType === 'monthly' ? 'Monthly' : 'Special'} discount
                </span>
                <span className="text-green-600">-{formatCurrency(booking.discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-gray-600">Cleaning fee</span>
              <span className="text-gray-900">{formatCurrency(booking.cleaningFee)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Service fee</span>
              <span className="text-gray-900">{formatCurrency(booking.serviceFee)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Taxes ({booking.taxRate}%)</span>
              <span className="text-gray-900">{formatCurrency(booking.taxAmount)}</span>
            </div>

            <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-semibold">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">{formatCurrency(booking.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Payment status */}
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex items-center">
            <CurrencyRupeeIcon className="h-5 w-5 text-gray-500 mr-2" />
            <div>
              <p className="text-sm font-medium text-gray-700">Payment status</p>
              <p className="text-gray-900 capitalize">{booking.paymentStatus}</p>
            </div>
          </div>
        </div>

        {/* Special requests */}
        {booking.specialRequests && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Special requests</h3>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-md">{booking.specialRequests}</p>
          </div>
        )}

        {/* Cancellation reason */}
        {booking.cancellationReason && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Cancellation reason</h3>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-md">{booking.cancellationReason}</p>
            <p className="text-sm text-gray-500 mt-1">
              Cancelled on {format(new Date(booking.cancellationDate), 'MMMM d, yyyy')}
            </p>
          </div>
        )}

        {/* Contact information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isGuest && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Host information</h3>
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full overflow-hidden relative mr-3">
                  <Image
                    src={booking.hostId.profileImage || '/images/default-avatar.png'}
                    alt={booking.hostId.name || 'Host'}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{booking.hostId.name || 'Host'}</p>
                  <p className="text-sm text-gray-600">{booking.hostId.email}</p>
                </div>
              </div>
            </div>
          )}

          {isHost && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Guest information</h3>
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full overflow-hidden relative mr-3">
                  <Image
                    src={booking.guestId.profileImage || '/images/default-avatar.png'}
                    alt={booking.guestId.name || 'Guest'}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{booking.guestId.name || 'Guest'}</p>
                  <p className="text-sm text-gray-600">{booking.guestId.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap gap-4">
          {user ? (
            <Link
              href="/bookings"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View all bookings
            </Link>
          ) : (
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to home
            </Link>
          )}

          {canCancel && (
            <button
              type="button"
              onClick={() => setShowCancelModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Cancel booking
            </button>
          )}

          {isHost && bookingStatus === 'pending' && (
            <>
              <button
                type="button"
                onClick={async () => {
                  try {
                    setIsLoading(true);
                    const updatedBooking = await updateBookingStatus(booking._id, 'confirmed');
                    setBookingStatus(updatedBooking.status);
                  } catch (err: any) {
                    setError(err.message || 'Failed to confirm booking');
                  } finally {
                    setIsLoading(false);
                  }
                }}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {isLoading ? 'Processing...' : 'Confirm booking'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowCancelModal(true);
                }}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                {isLoading ? 'Processing...' : 'Reject booking'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Cancellation modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {isHost && bookingStatus === 'pending'
                ? 'Reject Booking'
                : 'Cancel Booking'}
            </h3>

            <div className="mb-4">
              <label htmlFor="cancellationReason" className="block text-sm font-medium text-gray-700 mb-1">
                Please provide a reason
              </label>
              <textarea
                id="cancellationReason"
                rows={4}
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Why are you cancelling this booking?"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleCancelBooking}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                {isLoading ? 'Processing...' : isHost && bookingStatus === 'pending' ? 'Reject' : 'Cancel Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
