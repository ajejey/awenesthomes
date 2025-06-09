'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createBooking } from '../../actions';
import { format, parseISO, differenceInDays, isAfter, isBefore } from 'date-fns';
import { BookingFormData } from '@/lib/schemas/booking';
import { GuestBookingFormSchema, GuestBookingFormInput } from '@/lib/schemas/guestBooking';
import { CalendarIcon, UserIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

// Define the form schema based on user authentication status
const loggedInFormSchema = z.object({
  propertyId: z.string(),
  checkIn: z.string(),
  checkOut: z.string(),
  guests: z.coerce.number().int().min(1, "At least 1 guest is required"),
  specialRequests: z.string().max(500).optional(),
});

// Guest form schema is imported from guestBooking.ts

// Define property interface
interface PropertyPricing {
  basePrice: number;
  cleaningFee: number;
  serviceFee: number;
  taxRate: number;
  currency: string;
  includedGuests: number;
  extraGuestFee: number;
}

interface Property {
  _id: string;
  hostId: string;
  maxGuests: number;
  pricing: PropertyPricing;
  instantBooking: boolean;
  availability?: Array<{ startDate: string; endDate: string }>;
  blockedDates?: Array<{ startDate: string; endDate: string; reason?: string }>;
}

interface BookingFormProps {
  property: Property;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
  user: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  } | null;
}

export default function BookingForm({
  property,
  initialCheckIn,
  initialCheckOut,
  initialGuests = 1,
  user
}: BookingFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determine which schema to use based on authentication status
  const formSchema = user ? loggedInFormSchema : GuestBookingFormSchema;

  // Create a type for the form data based on authentication status
  type FormValues = typeof user extends null ? GuestBookingFormInput : BookingFormData;

  // Set up form with react-hook-form and zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any, // Type assertion needed due to conditional schema
    defaultValues: user ? {
      propertyId: property._id,
      checkIn: initialCheckIn || format(new Date(), 'yyyy-MM-dd'),
      checkOut: initialCheckOut || format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'), // Default to next day
      guests: initialGuests || 1,
      specialRequests: '',
    } as any : {
      propertyId: property._id,
      name: '',
      email: '',
      phone: '',
      checkIn: initialCheckIn || format(new Date(), 'yyyy-MM-dd'),
      checkOut: initialCheckOut || format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'), // Default to next day
      guests: initialGuests || 1,
      specialRequests: '',
      createAccount: true,
    } as any,
  });

  // Watch the createAccount field for guest users
  const createAccount = user ? false : watch('createAccount' as any);

  // Watch form values for real-time updates
  const checkIn = watch('checkIn');
  const checkOut = watch('checkOut');
  const guests = watch('guests');

  // Calculate booking details
  const [totalNights, setTotalNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cleaningFee, setCleaningFee] = useState(property.pricing.cleaningFee || 0);
  const [serviceFee, setServiceFee] = useState(0);

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Update checkOut min date when checkIn changes
  useEffect(() => {
    if (checkIn) {
      // If checkOut is before checkIn, reset it
      if (checkOut && new Date(checkOut) <= new Date(checkIn)) {
        // Calculate minimum checkout date (checkIn + 1 day)
        const nextDay = new Date(checkIn);
        nextDay.setDate(nextDay.getDate() + 1);
        setValue('checkOut', format(nextDay, 'yyyy-MM-dd'));
      }
    }
  }, [checkIn, checkOut, setValue]);

  // Calculate total price whenever dates or guests change
  useEffect(() => {
    if (checkIn && checkOut) {
      try {
        const checkInDate = parseISO(checkIn);
        const checkOutDate = parseISO(checkOut);

        // Calculate number of nights
        const nights = differenceInDays(checkOutDate, checkInDate);
        if (nights > 0) {
          setTotalNights(nights);

          // Calculate base price
          const basePrice = nights * property.pricing.basePrice;

          // Calculate extra guest fee if applicable
          let extraGuestFee = 0;
          if (guests > property.pricing.includedGuests && property.pricing.extraGuestFee) {
            const extraGuests = guests - property.pricing.includedGuests;
            extraGuestFee = extraGuests * property.pricing.extraGuestFee * nights;
          }

          // Calculate service fee (10% of base price)
          const calculatedServiceFee = Math.round((basePrice + extraGuestFee) * 0.10);
          setServiceFee(calculatedServiceFee);

          // Calculate total price
          const total = basePrice + extraGuestFee + cleaningFee + calculatedServiceFee;
          setTotalPrice(total);
        }
      } catch (error) {
        console.error('Error calculating price:', error);
      }
    } else {
      setTotalNights(0);
      setTotalPrice(0);
      setServiceFee(0);
    }
  }, [checkIn, checkOut, guests, property.pricing, cleaningFee]);

  // Check if a date is within any availability range
  function isDateAvailable(date: Date) {
    if (!property.availability || property.availability.length === 0) return false;

    return property.availability.some((range: any) => {
      const rangeStart = parseISO(range.startDate);
      const rangeEnd = parseISO(range.endDate);

      return (
        (date >= rangeStart && date <= rangeEnd) &&
        !isDateBlocked(date)
      );
    });
  }

  // Check if a date is within any blocked range
  function isDateBlocked(date: Date) {
    if (!property.blockedDates || property.blockedDates.length === 0) return false;

    return property.blockedDates.some((block: any) => {
      const blockStart = parseISO(block.startDate);
      const blockEnd = parseISO(block.endDate);

      return (date >= blockStart && date <= blockEnd);
    });
  }

  // Handle form submission
  const onSubmit = async (formData: FormValues) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Create FormData object for server action
      const submitData = new FormData();
      submitData.append('propertyId', formData.propertyId);
      submitData.append('checkIn', formData.checkIn);
      submitData.append('checkOut', formData.checkOut);
      submitData.append('guests', formData.guests.toString());

      if ('specialRequests' in formData && formData.specialRequests) {
        submitData.append('specialRequests', formData.specialRequests);
      }

      // Add guest information if user is not logged in
      if (!user) {
        // This is a guest booking - use type assertion with unknown as intermediate step
        // to avoid direct invalid type conversion
        const guestData = formData as unknown as GuestBookingFormInput;
        submitData.append('name', guestData.name);
        submitData.append('email', guestData.email);
        if (guestData.phone) {
          submitData.append('phone', guestData.phone);
        }
        submitData.append('createAccount', guestData.createAccount.toString());
      }

      // Submit the booking
      const response = await createBooking(submitData);

      // Handle response and navigate to confirmation page
      if (response && response.success && response.bookingId) {
        // If this is a guest booking with account creation, add accountCreationPending flag
        if (!user && formData.hasOwnProperty('createAccount')) {
          const guestData = formData as unknown as GuestBookingFormInput;
          if (guestData.createAccount) {
            router.push(`/bookings/${response.bookingId}/confirmation?accountCreationPending=true`);
            return;
          }
        }
        // Standard redirect for regular bookings
        router.push(`/bookings/${response.bookingId}/confirmation`);
      } else {
        throw new Error(response?.message || 'Invalid response from server');
      }
    } catch (err: any) {
      console.error('Error creating booking:', err);
      setError(err.message || 'Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Guest Information Section - Only shown if user is not logged in */}
      {!user && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Guest Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                {...register('name' as any)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your full name"
              />
              {!user && (errors as any).name && (
                <p className="mt-1 text-sm text-red-600">{(errors as any).name.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                {...register('email' as any)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email address"
              />
              {!user && (errors as any).email && (
                <p className="mt-1 text-sm text-red-600">{(errors as any).email.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                {...register('phone' as any)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your phone number"
              />
              {!user && (errors as any).phone && (
                <p className="mt-1 text-sm text-red-600">{(errors as any).phone.message}</p>
              )}
            </div>
          </div>
          <div>
            <div className="flex items-center mt-4">
              <input
                id="createAccount"
                type="checkbox"
                {...register('createAccount' as any)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="createAccount" className="ml-2 block text-sm text-gray-900">
                Create an account for faster bookings in the future
              </label>
            </div>
          </div>
        </div>
      )}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your trip details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Check-in date */}
          <div className="mb-4">
            <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-1">
              Check-in date
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                type="date"
                id="checkIn"
                {...register('checkIn')}
                min={format(new Date(), 'yyyy-MM-dd')}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 appearance-none"
                style={{ colorScheme: 'light' }}
                onClick={(e) => {
                  // Force the calendar to open on click
                  const target = e.target as HTMLInputElement;
                  target.showPicker();
                }}
              />
              {/* <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <CalendarIcon className="h-5 w-5 text-gray-400" />
            </div> */}
            </div>
            {errors.checkIn ? (
              <p className="mt-1 text-sm text-red-600">{errors.checkIn.message}</p>
            ) : (
              <p className="mt-1 text-xs text-gray-500">Select your arrival date</p>
            )}
          </div>

          {/* Check-out date */}
          <div className="mb-4">
            <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-1">
              Check-out date
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                type="date"
                id="checkOut"
                {...register('checkOut')}
                min={checkIn || format(new Date(), 'yyyy-MM-dd')}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 appearance-none"
                style={{ colorScheme: 'light' }}
                onClick={(e) => {
                  // Force the calendar to open on click
                  const target = e.target as HTMLInputElement;
                  target.showPicker();
                }}
              />
              {/* <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <CalendarIcon className="h-5 w-5 text-gray-400" />
            </div> */}
            </div>
            {errors.checkOut ? (
              <p className="mt-1 text-sm text-red-600">{errors.checkOut.message}</p>
            ) : (
              <p className="mt-1 text-xs text-gray-500">Select your departure date</p>
            )}
          </div>
        </div>

        {/* Number of guests */}
        <div className="mb-4">
          <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
            Guests
          </label>
          <div className="relative rounded-md shadow-sm">
            <select
              id="guests"
              {...register('guests', { valueAsNumber: true })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3"
            >
              {[...Array(property.maxGuests)].map((_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1} {i === 0 ? 'guest' : 'guests'}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <UserIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          {errors.guests && (
            <p className="mt-1 text-sm text-red-600">{errors.guests.message}</p>
          )}
        </div>
      </div>

      {/* Special requests */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Special requests</h2>
        <div className="mb-4">
          <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-1">
            Let the host know if you have any special requirements
          </label>
          <textarea
            id="specialRequests"
            {...register('specialRequests')}
            rows={4}
            className="block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="E.g., early check-in, dietary restrictions, etc."
          />
        </div>
      </div>

      {/* Price breakdown */}
      {totalNights > 0 && (
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Price details</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">
                {formatCurrency(property.pricing.basePrice)} x {totalNights} nights
              </p>
              <p className="text-sm text-gray-900">
                {formatCurrency(property.pricing.basePrice * totalNights)}
              </p>
            </div>

            {guests > property.pricing.includedGuests && property.pricing.extraGuestFee > 0 && (
              <div className="flex justify-between">
                <p className="text-sm text-gray-600">
                  Extra guest fee ({guests - property.pricing.includedGuests} {(guests - property.pricing.includedGuests) === 1 ? 'guest' : 'guests'})
                </p>
                <p className="text-sm text-gray-900">
                  {formatCurrency((guests - property.pricing.includedGuests) * property.pricing.extraGuestFee * totalNights)}
                </p>
              </div>
            )}

            {cleaningFee > 0 && (
              <div className="flex justify-between">
                <p className="text-sm text-gray-600">Cleaning fee</p>
                <p className="text-sm text-gray-900">{formatCurrency(cleaningFee)}</p>
              </div>
            )}

            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Service fee</p>
              <p className="text-sm text-gray-900">{formatCurrency(serviceFee)}</p>
            </div>

            <div className="flex justify-between pt-3 border-t border-gray-200">
              <p className="text-base font-medium text-gray-900">Total</p>
              <p className="text-base font-medium text-gray-900">{formatCurrency(totalPrice)}</p>
            </div>
          </div>
        </div>
      )}

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

      {/* Submit button */}
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isSubmitting
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
        >
          {isSubmitting ? 'Processing...' : property.instantBooking ? 'Reserve now' : 'Request to book'}
        </button>

        {/* No charge yet message */}
        <p className="mt-2 text-center text-sm text-gray-500">
          You won't be charged yet
        </p>
      </div>
    </form>
  );
}
