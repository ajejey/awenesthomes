'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  IdentificationIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ExclamationCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { getUserById, verifyGuestGovernmentId } from '@/app/users/actions';
import { getBookingById } from '@/app/host/bookings/actions';
import { useRouter } from 'next/navigation';

interface GuestIdVerificationProps {
  guestId: string;
  bookingId: string;
  bookingStatus: string;
}

export default function GuestIdVerification({ 
  guestId, 
  bookingId,
  bookingStatus 
}: GuestIdVerificationProps) {
  const [governmentId, setGovernmentId] = useState<{
    type: string;
    imageUrl: string;
    isVerified: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchGuestDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // First, check if this is a registered user with a government ID
        if (guestId) {
          const guestData = await getUserById(guestId);
          
          if (guestData && guestData.governmentId) {
            setGovernmentId({
              type: guestData.governmentId.type || 'ID Document',
              imageUrl: guestData.governmentId.imageUrl || '',
              isVerified: guestData.governmentId.isVerified || false
            });
            return; // Exit if we found the ID in the user profile
          }
        }
        
        // If no user ID or no government ID found for the user, check the booking
        const booking = await getBookingById(bookingId);
        
        if (booking && booking.guestGovernmentId) {
          setGovernmentId({
            type: booking.guestGovernmentId.type || 'ID Document',
            imageUrl: booking.guestGovernmentId.imageUrl || '',
            isVerified: booking.guestGovernmentId.isVerified || false
          });
        } else {
          setError('Guest has not uploaded a government ID yet.');
        }
      } catch (err: any) {
        console.error('Error fetching guest ID details:', err);
        setError(err.message || 'Failed to fetch guest ID details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGuestDetails();
  }, [guestId, bookingId, verificationSuccess]);

  const handleVerify = async (isApproved: boolean) => {
    try {
      setIsVerifying(true);
      setVerificationError(null);
      
      const result = await verifyGuestGovernmentId({
        userId: guestId,
        bookingId,
        isApproved
      });
      
      if (result.success) {
        setVerificationSuccess(true);
        // Refresh the page after a short delay to update the booking status
        setTimeout(() => {
          router.refresh();
        }, 2000);
      } else {
        setVerificationError(result.message || 'Verification failed');
      }
    } catch (err: any) {
      console.error('Error verifying ID:', err);
      setVerificationError(err.message || 'An error occurred during verification');
    } finally {
      setIsVerifying(false);
    }
  };

  // Don't show the component if the booking status isn't pending ID verification
  // and the ID isn't already verified
  if (bookingStatus !== 'pending_id_verification' && 
      !(governmentId && governmentId.isVerified)) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Guest ID Verification</h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-md bg-gray-200 h-48 w-48"></div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Guest ID Verification</h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="flex items-center text-yellow-800">
            <ExclamationCircleIcon className="h-6 w-6 text-yellow-500 mr-2" />
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!governmentId) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Guest ID Verification</h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="flex items-center text-yellow-800">
            <ExclamationCircleIcon className="h-6 w-6 text-yellow-500 mr-2" />
            <p>No government ID has been uploaded by the guest yet.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Guest ID Verification</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Review the guest's government ID before confirming the booking.
        </p>
      </div>
      
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        {/* Verification status */}
        {governmentId.isVerified ? (
          <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  This ID has been verified. You can proceed with confirming the booking.
                </p>
              </div>
            </div>
          </div>
        ) : bookingStatus === 'pending_id_verification' ? (
          <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ClockIcon className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  This booking is pending ID verification. Please review the guest's ID below.
                </p>
              </div>
            </div>
          </div>
        ) : null}
        
        {/* Success message */}
        {verificationSuccess && (
          <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  ID verification completed successfully. The page will refresh shortly.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Error message */}
        {verificationError && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircleIcon className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{verificationError}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* ID details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">ID Type</h4>
            <p className="text-sm text-gray-900 mb-4">{governmentId.type}</p>
            
            <h4 className="text-sm font-medium text-gray-500 mb-2">ID Image</h4>
            <div className="relative h-64 w-full overflow-hidden rounded-lg border border-gray-200">
              {governmentId.imageUrl ? (
                <Image 
                  src={governmentId.imageUrl} 
                  alt="Government ID" 
                  fill 
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain" 
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-100">
                  <IdentificationIcon className="h-12 w-12 text-gray-400" />
                  <p className="text-sm text-gray-500 ml-2">No image available</p>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Verification Actions</h4>
            <p className="text-sm text-gray-600 mb-4">
              Please carefully review the ID before approving or rejecting. Approving will allow the booking to proceed.
            </p>
            
            {!governmentId.isVerified && bookingStatus === 'pending_id_verification' && (
              <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => handleVerify(true)}
                  disabled={isVerifying}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {isVerifying ? 'Processing...' : 'Approve ID'}
                </button>
                <button
                  onClick={() => handleVerify(false)}
                  disabled={isVerifying}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  {isVerifying ? 'Processing...' : 'Reject ID'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
