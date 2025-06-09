'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Booking, isProperty, isUser } from '../types';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  XCircleIcon,
  CalendarIcon,
  UserIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { getBookingsByUser, getBookingsByHost } from '../actions';

interface BookingsListProps {
  activeTab: string;
}

export default function BookingsList({ activeTab }: BookingsListProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Fetch bookings based on the active tab
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        let fetchedBookings: Booking[] = [];
        
        if (activeTab === 'hosting') {
          // Fetch bookings where the user is the host
          const hostBookings = await getBookingsByHost();
          fetchedBookings = hostBookings;
        } else {
          // Fetch bookings where the user is the guest
          const userBookings = await getBookingsByUser();
          
          // Filter bookings based on the active tab
          switch (activeTab) {
            case 'upcoming':
              fetchedBookings = userBookings.filter((booking: Booking) => {
                return booking.status === 'confirmed' && new Date(booking.checkOut) >= new Date();
              });
              break;
            case 'pending':
              fetchedBookings = userBookings.filter(
                (booking: Booking) => booking.status === 'pending'
              );
              break;
            case 'completed':
              fetchedBookings = userBookings.filter((booking: Booking) => {
                return booking.status === 'completed' || (booking.status === 'confirmed' && new Date(booking.checkOut) < new Date());
              });
              break;
            case 'cancelled':
              fetchedBookings = userBookings.filter(
                (booking: Booking) => booking.status === 'cancelled_by_guest' || booking.status === 'cancelled_by_host' || booking.status === 'rejected'
              );
              break;
            default:
              fetchedBookings = userBookings;
          }
        }
        
        // Sort bookings by check-in date (most recent first)
        fetchedBookings.sort((a, b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime());
        
        setBookings(fetchedBookings);
      } catch (err: any) {
        console.error('Error fetching bookings:', err);
        setError(err.message || 'Failed to fetch bookings');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookings();
  }, [activeTab]);

  console.log("bookings ", bookings)

  // Format currency function is defined above

  // Get status badge based on booking status
  const getStatusBadge = (status: string): { color: string; icon: React.ReactNode; text: string } => {
    switch (status) {
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
          icon: <XCircleIcon className="h-5 w-5 text-red-500 mr-1.5" />,
          text: 'Cancelled by You'
        };
      case 'cancelled_by_host':
        return {
          color: 'bg-red-100 text-red-800',
          icon: <XCircleIcon className="h-5 w-5 text-red-500 mr-1.5" />,
          text: 'Cancelled by Host'
        };
      case 'rejected':
        return {
          color: 'bg-red-100 text-red-800',
          icon: <XCircleIcon className="h-5 w-5 text-red-500 mr-1.5" />,
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
          text: status
        };
    }
  };

  // If loading, show loading state
  if (isLoading) {
    return <BookingsListSkeleton />;
  }

  // If error, show error message
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading bookings</h3>
            <p className="mt-2 text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // If no bookings, show empty state
  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 text-gray-400">
          {activeTab === 'cancelled' ? (
            <XCircleIcon className="h-12 w-12" />
          ) : activeTab === 'completed' ? (
            <CheckCircleIcon className="h-12 w-12" />
          ) : activeTab === 'pending' ? (
            <ClockIcon className="h-12 w-12" />
          ) : (
            <CalendarIcon className="h-12 w-12" />
          )}
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
        <p className="mt-1 text-sm text-gray-500">
          {activeTab === 'hosting'
            ? "You don't have any bookings for your properties yet."
            : activeTab === 'upcoming'
            ? "You don't have any upcoming trips."
            : activeTab === 'pending'
            ? "You don't have any pending booking requests."
            : activeTab === 'completed'
            ? "You don't have any completed trips."
            : "You don't have any cancelled bookings."}
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Explore properties
          </Link>
        </div>
      </div>
    );
  }

  // Render bookings list
  return (
    <div className="space-y-6">
      {bookings.map((booking) => {
        const statusBadge = getStatusBadge(booking.status);
        const isHostView = activeTab === 'hosting';
        const primaryImage = isProperty(booking.propertyId) && booking.propertyId.images?.length > 0 ? 
          booking.propertyId.images.find((img: any) => img.isPrimary) || booking.propertyId.images[0] 
          : null;
        
        return (
          <div key={booking._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Property image */}
                <div className="md:w-1/4 h-48 md:h-auto relative rounded-lg overflow-hidden">
                  <Image
                    src={isProperty(booking.propertyId) && booking.propertyId.images?.length > 0 
                      ? booking.propertyId.images[0].url 
                      : '/images/placeholder.jpg'}
                    alt={isProperty(booking.propertyId) ? booking.propertyId.title : 'Property'}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover"
                  />
                </div>
                
                {/* Booking details */}
                <div className="md:w-3/4 flex flex-col">
                  {/* Status badge */}
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.color} self-start mb-2`}>
                    {statusBadge.icon}
                    {statusBadge.text}
                  </div>
                  
                  {/* Property title */}
                  <Link href={`/properties/${isProperty(booking.propertyId) ? booking.propertyId._id : booking.propertyId}`} className="hover:underline">
                    <h3 className="text-lg font-medium text-gray-900">{isProperty(booking.propertyId) ? booking.propertyId.title : 'Property'}</h3>
                  </Link>
                  
                  {/* Location */}
                  <p className="text-sm text-gray-500 mb-3">
                    {isProperty(booking.propertyId) && booking.propertyId.location ? 
                      `${booking.propertyId.location.city}, ${booking.propertyId.location.state}, ${booking.propertyId.location.country}` : 
                      'Location not available'}
                  </p>
                  
                  {/* Booking details grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {/* Check-in */}
                    <div className="flex items-center">
                      <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Check-in</p>
                        <p className="text-sm font-medium">
                          {format(new Date(booking.checkIn), 'EEE, MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    
                    {/* Check-out */}
                    <div className="flex items-center">
                      <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Check-out</p>
                        <p className="text-sm font-medium">
                          {format(new Date(booking.checkOut), 'EEE, MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    
                    {/* Guests */}
                    <div className="flex items-center">
                      <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Guests</p>
                        <p className="text-sm font-medium">
                          {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Total amount */}
                    <div className="flex items-center">
                      <span className="text-gray-400 mr-2">₹</span>
                      <div>
                        <p className="text-xs text-gray-500">Total amount</p>
                        <p className="text-sm font-medium">
                          {formatCurrency(booking.totalAmount)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Host/Guest info */}
                  {isHostView ? (
                    <div className="flex items-center mt-auto">
                      <div className="h-8 w-8 rounded-full overflow-hidden relative mr-2">
                        <Image
                          src={isUser(booking.guestId) ? booking.guestId.profileImage || '/images/default-avatar.png' : '/images/default-avatar.png'}
                          alt={isUser(booking.guestId) ? booking.guestId.name || 'Guest' : 'Guest'}
                          fill
                          sizes="32px"
                          className="object-cover"
                        />
                      </div>
                      <span className="text-sm text-gray-600">
                        Booked by {isUser(booking.guestId) ? booking.guestId.name || 'Guest' : 'Guest'}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center mt-auto">
                      <div className="h-8 w-8 rounded-full overflow-hidden relative mr-2">
                        <Image
                          src={isUser(booking.hostId) ? booking.hostId.profileImage || '/images/default-avatar.png' : '/images/default-avatar.png'}
                          alt={isUser(booking.hostId) ? booking.hostId.name || 'Host' : 'Host'}
                          fill
                          sizes="32px"
                          className="object-cover"
                        />
                      </div>
                      <span className="text-sm text-gray-600">
                        Hosted by {isUser(booking.hostId) ? booking.hostId.name || 'Host' : 'Host'}
                      </span>
                    </div>
                  )}
                  
                  {/* View details button */}
                  <div className="mt-4 flex justify-end">
                    <Link
                      href={`/bookings/${booking._id || booking.id}/confirmation`}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      View details
                      <ArrowRightIcon className="ml-1.5 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Skeleton component for loading state
function BookingsListSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Property image skeleton */}
              <div className="md:w-1/4 h-48 md:h-auto bg-gray-200 rounded-lg"></div>
              
              {/* Booking details skeleton */}
              <div className="md:w-3/4 flex flex-col">
                {/* Status badge skeleton */}
                <div className="h-6 w-24 bg-gray-200 rounded-full mb-2"></div>
                
                {/* Property title skeleton */}
                <div className="h-6 w-3/4 bg-gray-200 rounded mb-1"></div>
                
                {/* Location skeleton */}
                <div className="h-4 w-1/2 bg-gray-200 rounded mb-3"></div>
                
                {/* Booking details grid skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center">
                      <div className="h-5 w-5 bg-gray-200 rounded-full mr-2"></div>
                      <div>
                        <div className="h-3 w-16 bg-gray-200 rounded mb-1"></div>
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Host/Guest info skeleton */}
                <div className="flex items-center mt-auto">
                  <div className="h-8 w-8 bg-gray-200 rounded-full mr-2"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </div>
                
                {/* View details button skeleton */}
                <div className="mt-4 flex justify-end">
                  <div className="h-8 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
