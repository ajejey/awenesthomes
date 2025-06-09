'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookingFormData, BookingStatusSchema } from '@/lib/schemas/booking';
import { updateBookingStatus } from '../../actions';
import { z } from 'zod';

interface BookingActionsProps {
  booking: BookingFormData;
}

export default function BookingActions({ booking }: BookingActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');

  // Handle booking status update
  const handleStatusUpdate = async (newStatus: z.infer<typeof BookingStatusSchema>) => {
    setIsLoading(true);
    setError(null);

    if (!booking._id) {
      setError('Invalid booking ID');
      setIsLoading(false);
      return;
    }

    try {
      await updateBookingStatus(booking._id, {
        status: newStatus,
        cancellationReason: newStatus.includes('cancelled') ? cancellationReason : undefined
      });
      
      // Refresh the page to show updated status
      router.refresh();
      
      // Close modal if open
      if (showCancelModal) {
        setShowCancelModal(false);
        setCancellationReason('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update booking status');
    } finally {
      setIsLoading(false);
    }
  };

  // Determine which actions are available based on current status
  const canConfirm = booking.status === 'pending';
  const canCancel = ['pending', 'confirmed'].includes(booking.status);
  const canComplete = booking.status === 'confirmed';
  const canReject = booking.status === 'pending';

  // No actions needed for completed, cancelled or rejected bookings
  if (['completed', 'cancelled_by_guest', 'cancelled_by_host', 'rejected'].includes(booking.status)) {
    return null;
  }

  return (
    <>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Booking Actions</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Manage this booking
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <div className="flex flex-wrap gap-4">
            {canConfirm && (
              <button
                type="button"
                onClick={() => handleStatusUpdate('confirmed' as z.infer<typeof BookingStatusSchema>)}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {isLoading ? 'Processing...' : 'Confirm Booking'}
              </button>
            )}
            
            {canCancel && (
              <button
                type="button"
                onClick={() => setShowCancelModal(true)}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                {isLoading ? 'Processing...' : 'Cancel Booking'}
              </button>
            )}
            
            {canComplete && (
              <button
                type="button"
                onClick={() => handleStatusUpdate('completed' as z.infer<typeof BookingStatusSchema>)}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isLoading ? 'Processing...' : 'Mark as Completed'}
              </button>
            )}
            
            {canReject && (
              <button
                type="button"
                onClick={() => handleStatusUpdate('rejected' as z.infer<typeof BookingStatusSchema>)}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                {isLoading ? 'Processing...' : 'Reject Booking'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowCancelModal(false)}></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Cancel Booking
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to cancel this booking? This action cannot be undone.
                      </p>
                      <div className="mt-4">
                        <label htmlFor="cancellationReason" className="block text-sm font-medium text-gray-700">
                          Cancellation Reason
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="cancellationReason"
                            name="cancellationReason"
                            rows={3}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            placeholder="Please provide a reason for cancellation"
                            value={cancellationReason}
                            onChange={(e) => setCancellationReason(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => handleStatusUpdate('cancelled_by_host' as z.infer<typeof BookingStatusSchema>)}
                  disabled={isLoading || !cancellationReason.trim()}
                >
                  {isLoading ? 'Processing...' : 'Confirm Cancellation'}
                </button>
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowCancelModal(false)}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
