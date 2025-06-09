'use client';

import React from 'react';
import { format } from 'date-fns';
import { BookingFormData } from '@/lib/schemas/booking';
import BookingStatusBadge from '../../components/BookingStatusBadge';

interface BookingDetailsProps {
  booking: BookingFormData & {
    propertyTitle?: string;
    propertyImage?: string;
    guestName?: string;
    guestEmail?: string;
  };
}

export default function BookingDetails({ booking }: BookingDetailsProps) {
  // Format currency in INR
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'h:mm a');
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">Booking Information</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Details and status of the booking.
          </p>
        </div>
        <BookingStatusBadge status={booking.status} />
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          {/* Dates */}
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Check-in</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {formatDate(booking.checkIn)} (after 3:00 PM)
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Check-out</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {formatDate(booking.checkOut)} (before 11:00 AM)
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Duration</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {booking.totalNights} {booking.totalNights === 1 ? 'night' : 'nights'}
            </dd>
          </div>

          {/* Guests */}
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Guests</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}
            </dd>
          </div>

          {/* Payment */}
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Payment Status</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                booking.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' :
                booking.paymentStatus === 'refunded' ? 'bg-red-100 text-red-800' :
                booking.paymentStatus === 'partially_refunded' ? 'bg-yellow-100 text-yellow-800' :
                booking.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {booking.paymentStatus === 'completed' ? 'Paid' :
                 booking.paymentStatus === 'refunded' ? 'Refunded' :
                 booking.paymentStatus === 'partially_refunded' ? 'Partially Refunded' :
                 booking.paymentStatus === 'failed' ? 'Payment Failed' :
                 'Payment Pending'}
              </span>
              {booking.paymentId && (
                <span className="ml-2 text-xs text-gray-500">
                  Payment ID: {booking.paymentId}
                </span>
              )}
            </dd>
          </div>

          {/* Price breakdown */}
          <div className="py-4 sm:py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 mb-4">Price Breakdown</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>₹{booking.basePrice.toLocaleString()} × {booking.totalNights} {booking.totalNights === 1 ? 'night' : 'nights'}</span>
                  <span>{formatCurrency(booking.basePrice * booking.totalNights)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cleaning fee</span>
                  <span>{formatCurrency(booking.cleaningFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service fee</span>
                  <span>{formatCurrency(booking.serviceFee)}</span>
                </div>
                {booking.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>
                      {booking.discountType === 'weekly' ? 'Weekly discount' :
                       booking.discountType === 'monthly' ? 'Monthly discount' :
                       booking.discountType === 'special' ? 'Special discount' :
                       'Discount'}
                    </span>
                    <span>-{formatCurrency(booking.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Taxes ({booking.taxRate}%)</span>
                  <span>{formatCurrency(booking.taxAmount)}</span>
                </div>
                <div className="flex justify-between font-bold border-t border-gray-200 pt-2 mt-2">
                  <span>Total</span>
                  <span>{formatCurrency(booking.totalAmount)}</span>
                </div>
                {(booking.status === 'cancelled_by_guest' || booking.status === 'cancelled_by_host') && booking.refundAmount !== undefined && (
                  <div className="flex justify-between text-red-600 border-t border-gray-200 pt-2 mt-2">
                    <span>Refund amount</span>
                    <span>{formatCurrency(booking.refundAmount)}</span>
                  </div>
                )}
              </div>
            </dd>
          </div>

          {/* Special requests */}
          {booking.specialRequests && (
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Special Requests</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {booking.specialRequests}
              </dd>
            </div>
          )}

          {/* Cancellation details */}
          {(booking.status === 'cancelled_by_guest' || booking.status === 'cancelled_by_host') && (
            <>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Cancelled By</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {booking.status === 'cancelled_by_guest' ? 'Guest' : 'Host'}
                </dd>
              </div>
              {booking.cancellationDate && (
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Cancellation Date</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {formatDate(booking.cancellationDate)} at {formatTime(booking.cancellationDate)}
                  </dd>
                </div>
              )}
              {booking.cancellationReason && (
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Cancellation Reason</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {booking.cancellationReason}
                  </dd>
                </div>
              )}
            </>
          )}

          {/* Booking dates */}
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Booking Date</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {booking.createdAt ? formatDate(booking.createdAt) : 'N/A'}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
