'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { updateBookingStatus } from '../../../actions';
import GovernmentIdUploadForm from './GovernmentIdUploadForm';
import GuestGovernmentIdUploadForm from './GuestGovernmentIdUploadForm';
import OtpVerification from './OtpVerification';
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  MapPinIcon,
  CalendarIcon,
  UserIcon,
  HomeIcon,
  CurrencyRupeeIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline';
import { checkGovernmentIdStatus } from '@/app/users/actions';

interface BookingConfirmationDetailsProps {
  booking: {
    _id: string;
    status: string;
    property: {
      _id: string;
      title: string;
      location: {
        address: string;
      };
      images: {
        url: string;
        caption: string;
        isPrimary: boolean;
        _id: string;
      }[];
    };
    propertyId?: string; // Property ID reference
    hostId?: {
      _id: string;
      name: string;
      email: string;
      profileImage?: string;
    };
    checkIn: string;
    checkOut: string;
    guests: number;
    totalPrice: number;
    totalAmount?: number;
    basePrice?: number;
    cleaningFee?: number;
    serviceFee?: number;
    taxAmount?: number;
    taxRate?: number;
    discountAmount?: number;
    discountType?: string;
    totalNights?: number;
    paymentStatus?: string;
    specialRequests?: string;
    cancellationReason?: string;
    cancellationDate?: string;
    guestId?: {
      _id: string;
      email: string;
      phone: string;
      name: string;
      profileImage?: string;
    };
    guestInfo?: {
      name: string;
      email: string;
      phone: string;
    };
    guestGovernmentId?: {
      type: string;
      number?: string | null;
      imageUrl: string;
      isVerified: boolean;
      uploadedAt: string;
      guestEmail: string;
      verifiedAt?: string;
      verifiedBy?: string;
    };
  };
  user: any | null; // User can be null for guest bookings
  accountCreationPending?: boolean; // Whether the user opted to create an account during booking
}

export default function BookingConfirmationDetails({ booking, user, accountCreationPending = false }: BookingConfirmationDetailsProps) {
  // Get guest email safely from the booking object - either from user account or guest info
  const guestEmail = booking.guestId?.email || booking.guestInfo?.email || '';
  const guestPhone = booking.guestId?.phone || booking.guestInfo?.phone || '';
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingStatus, setBookingStatus] = useState(booking.status);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [otpSuccess, setOtpSuccess] = useState(false);
  
  // State for government ID verification
  const [idUploadSuccess, setIdUploadSuccess] = useState(false);
  const [showIdUploadForm, setShowIdUploadForm] = useState(bookingStatus === 'pending_id_verification');
  const [idVerificationMessage, setIdVerificationMessage] = useState<string | null>(null);

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

  // Format price with 2 decimal places - Not needed, using formatCurrency consistently

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
      const cancelType = !user || (user && booking.guestId && user.id === booking.guestId?._id)
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

  // Handle successful government ID upload
  const handleIdUploadSuccess = async () => {
    setIdUploadSuccess(true);
    setShowIdUploadForm(false);
    setIdVerificationMessage('Your government ID has been uploaded successfully. The host will review it shortly.');
    
    // Refresh the page after a short delay to get the latest booking status
    setTimeout(() => {
      router.refresh();
    }, 2000);
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
      case 'pending_id_verification':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          icon: <IdentificationIcon className="h-5 w-5 text-yellow-500 mr-1.5" />,
          text: 'ID Verification Required'
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
  const isGuest = !user || (user && user.id === booking.guestId?._id);
  const isHost = user && user.id === booking.hostId?._id;
  const canCancel = ['pending', 'confirmed'].includes(bookingStatus);
  // Handle property data safely whether it's coming from propertyId or property field
  const propertyData = typeof booking.propertyId === 'object' ? booking.propertyId : booking.property;
  const primaryImage = propertyData?.images?.[0].url || '/images/placeholder.jpg';

  console.log("Booking data:", booking);

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
      {!user && accountCreationPending && guestEmail && (
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

      {/* Government ID Verification Section - Shown for pending_id_verification status for both logged-in users and guests */}
      {bookingStatus === 'pending_id_verification' && !idUploadSuccess && showIdUploadForm && (
        <div className="px-6 py-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
          <div className="flex items-center mb-4">
            <IdentificationIcon className="h-8 w-8 text-blue-500 mr-3" />
            <h3 className="text-lg font-medium text-blue-800">Government ID Verification Required</h3>
          </div>
          <p className="text-blue-700 mb-4">
            To complete your booking, please upload a government-issued ID. This helps ensure safety and trust for both guests and hosts.
          </p>
          
          {/* Show different form based on whether user is logged in or not */}
          {user ? (
            <GovernmentIdUploadForm 
              userId={user.id} 
              onSuccess={handleIdUploadSuccess} 
            />
          ) : (
            <GuestGovernmentIdUploadForm 
              bookingId={booking._id} 
              guestEmail={guestEmail} 
              guestPhone={guestPhone}
              onSuccess={handleIdUploadSuccess} 
            />
          )}
        </div>
      )}
      
      {/* ID Verification Success Message */}
      {idUploadSuccess && idVerificationMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <CheckCircleIcon className="h-8 w-8 text-green-500 mr-3" />
            <h3 className="text-lg font-medium text-green-800">ID Verification Submitted</h3>
          </div>
          <p className="text-green-700 mb-4">{idVerificationMessage}</p>
        </div>
      )}

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Property details */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3 relative h-48 md:h-auto rounded-lg overflow-hidden">
            <Image
              src={typeof primaryImage === 'string' ? primaryImage : '/images/placeholder.jpg'}
              alt={propertyData?.title || 'Property'}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          </div>

          <div className="md:w-2/3 space-y-4">
            <Link href={`/properties/${propertyData?._id || ''}`} className="hover:underline">
              <h2 className="text-xl font-semibold text-gray-900">{propertyData?.title || 'Property'}</h2>
            </Link>

            <div className="flex items-center text-gray-600">
              <MapPinIcon className="h-5 w-5 mr-2" />
              <span>
                {propertyData?.location?.address || ''}
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
                {formatCurrency(booking.basePrice || 0)} x {booking.totalNights || 1} nights
              </span>
              <span className="text-gray-900">{formatCurrency((booking.basePrice || 0) * (booking.totalNights || 1))}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Base Price</span>
              <span className="text-gray-900">{formatCurrency((booking.basePrice || 0) * (booking.totalNights || 1))}</span>
            </div>
            
            {booking.discountAmount && booking.discountAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-green-600">Discount</span>
                <span className="text-green-600">-{formatCurrency(booking.discountAmount)}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-gray-600">Cleaning Fee</span>
              <span className="text-gray-900">{formatCurrency(booking.cleaningFee || 0)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Service Fee</span>
              <span className="text-gray-900">{formatCurrency(booking.serviceFee || 0)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Taxes {booking.taxRate ? `(${booking.taxRate}%)` : ''}</span>
              <span className="text-gray-900">{formatCurrency(booking.taxAmount || 0)}</span>
            </div>

            <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-semibold">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">{formatCurrency(booking.totalAmount || booking.totalPrice)}</span>
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
            {booking.cancellationDate && (
              <div className="mt-4 text-sm text-gray-600">
                <p>Cancelled on: {booking.cancellationDate ? new Date(booking.cancellationDate).toLocaleDateString() : 'N/A'}</p>
              </div>
            )}
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
                    src={booking.hostId?.profileImage || '/images/default-avatar.png'}
                    alt={booking.hostId?.name || 'Host'}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{booking.hostId?.name || 'Host'}</p>
                  <p className="text-sm text-gray-600">{booking.hostId?.email || 'No email provided'}</p>
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
                    src={booking.guestId?.profileImage || '/images/default-avatar.png'}
                    alt={booking.guestId?.name || booking.guestInfo?.name || 'Guest'}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{booking.guestId?.name || booking.guestInfo?.name || 'Guest'}</p>
                  <p className="text-sm text-gray-600">{booking.guestId?.email || booking.guestInfo?.email || 'No email provided'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-4">
          
            <Link
              href="/bookings"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View all bookings
            </Link>
          
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to home
            </Link>
         

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
