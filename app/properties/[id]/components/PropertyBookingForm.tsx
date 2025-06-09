'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, differenceInDays, parseISO, isBefore, isAfter, isWithinInterval, addDays } from 'date-fns';
import { CalendarIcon, UserIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { motion, AnimatePresence } from 'framer-motion';
import { checkAvailability } from '../actions';
import { getCurrentUser } from '@/app/auth';



interface AvailabilityRange {
  startDate: string;
  endDate: string;
}

interface BlockedDateRange {
  startDate: string;
  endDate: string;
  reason?: string;
}

interface PropertyBookingFormProps {
  propertyId: string;
  basePrice: number;
  cleaningFee: number;
  serviceFee: number;
  taxRate: number;
  minimumStay: number;
  maximumStay?: number;
  availability: AvailabilityRange[];
  blockedDates?: BlockedDateRange[];
  instantBooking: boolean;
}

const getEarliestAvailableDateFn = (
  availabilityProp: AvailabilityRange[], 
  dateFnsFns: { parseISO_fn: typeof parseISO, format_fn: typeof format, isAfter_fn: typeof isAfter, isBefore_fn: typeof isBefore }
) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day

  let earliest = new Date(today);
  earliest.setDate(today.getDate() + 1); // Default to tomorrow

  if (availabilityProp.length > 0) {
    const sortedAvailability = [...availabilityProp].sort(
      (a, b) => dateFnsFns.parseISO_fn(a.startDate).getTime() - dateFnsFns.parseISO_fn(b.startDate).getTime()
    );
    
    for (const range of sortedAvailability) {
      const rangeStart = dateFnsFns.parseISO_fn(range.startDate);
      // Check if rangeStart is today or in the future
      if (dateFnsFns.format_fn(rangeStart, 'yyyy-MM-dd') === dateFnsFns.format_fn(today, 'yyyy-MM-dd') || dateFnsFns.isAfter_fn(rangeStart, today)) {
        earliest = rangeStart;
        break;
      }
    }
  }
  // Ensure earliest is not in the past (relative to tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0,0,0,0);

  return dateFnsFns.format_fn(dateFnsFns.isBefore_fn(earliest, tomorrow) ? tomorrow : earliest, 'yyyy-MM-dd');
};

export default function PropertyBookingForm({
  propertyId,
  basePrice,
  cleaningFee,
  serviceFee,
  taxRate,
  minimumStay,
  maximumStay,
  availability,
  blockedDates = [],
  instantBooking,
}: PropertyBookingFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pricing, setPricing] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);
  const guestDropdownRef = useRef<HTMLDivElement>(null);
  
  // Guest counts state
  const [guestCounts, setGuestCounts] = useState({
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0
  });

  // Memoize getEarliestAvailableDate as it depends on 'availability' prop
  const getEarliestAvailableDate = React.useCallback(() => {
    return getEarliestAvailableDateFn(availability, { parseISO_fn: parseISO, format_fn: format, isAfter_fn: isAfter, isBefore_fn: isBefore });
  }, [availability]);

  // Factory for Zod schema, memoized as it depends on component props/state
  const getBookingFormSchema = React.useCallback(() => {
    return z.object({
      checkIn: z.string()
        .min(1, { message: 'Check-in date is required.' })
        .refine(val => {
          try {
            return !isNaN(parseISO(val).getTime());
          } catch (error) {
            console.error('Error validating check-in date format:', error);
            return false;
          }
        }, { message: 'Invalid check-in date. Please use YYYY-MM-DD format.' })
        .refine(val => {
          try {
            const earliest = parseISO(getEarliestAvailableDate());
            const selected = parseISO(val);
            return selected.getTime() >= earliest.getTime();
          } catch (error) {
            console.error('Error validating check-in date range:', error);
            return false;
          }
        }, { message: `Check-in date cannot be earlier than ${getEarliestAvailableDate()}.` }),
      checkOut: z.string()
        .min(1, { message: 'Check-out date is required.' })
        .refine(val => {
          try {
            return !isNaN(parseISO(val).getTime());
          } catch (error) {
            console.error('Error validating check-out date format:', error);
            return false;
          }
        }, { message: 'Invalid check-out date. Please use YYYY-MM-DD format.' }),
      guests: z.number().min(1, 'At least 1 guest is required'),
    }).superRefine((data, ctx) => {
      try {
        const checkInDate = parseISO(data.checkIn);
        const checkOutDate = parseISO(data.checkOut);

        if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
          // This should be caught by individual field refines, but acts as a safeguard.
          // If one is invalid, no further cross-field validation makes sense.
          return;
        }

        if (checkOutDate.getTime() <= checkInDate.getTime()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Check-out date must be after check-in date.',
            path: ['checkOut'],
          });
        }

        const diffDays = differenceInDays(checkOutDate, checkInDate);
        if (diffDays < minimumStay) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Minimum stay is ${minimumStay} night${minimumStay > 1 ? 's' : ''}.`,
            path: ['checkOut'],
          });
        }

        if (maximumStay && diffDays > maximumStay) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Maximum stay is ${maximumStay} nights.`,
            path: ['checkOut'],
          });
        }

        // Check if selected dates are within availability ranges
        try {
          if (!isDateAvailable(checkInDate)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Selected check-in date is not available.',
              path: ['checkIn'],
            });
          }
        } catch (error) {
          console.error('Error checking check-in date availability:', error);
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Error validating check-in date availability.',
            path: ['checkIn'],
          });
        }

        try {
          if (!isDateAvailable(checkOutDate)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Selected check-out date is not available.',
              path: ['checkOut'],
            });
          }
        } catch (error) {
          console.error('Error checking check-out date availability:', error);
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Error validating check-out date availability.',
            path: ['checkOut'],
          });
        }

        // Check if any date in the range is blocked
        try {
          let currentDate = new Date(checkInDate);
          while (currentDate < checkOutDate) {
            if (isDateBlocked(currentDate)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Your stay includes blocked dates. Please select different dates.`,
                path: ['checkIn'],
              });
              break;
            }
            currentDate.setDate(currentDate.getDate() + 1);
          }
        } catch (error) {
          console.error('Error checking blocked dates:', error);
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Error validating date availability.',
            path: ['checkIn'],
          });
        }
      } catch (error) {
        console.error('Error in form validation:', error);
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'An error occurred during form validation.',
          path: [],
        });
      }
    });
  }, [getEarliestAvailableDate, minimumStay, maximumStay]);

  const bookingFormSchemaInstance = getBookingFormSchema();

  // Define the form data type by inferring it from the schema instance
  type BookingFormData = z.infer<typeof bookingFormSchemaInstance>;
  
  // Initialize form with react-hook-form and zod validation
  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchemaInstance),
    defaultValues: {
      checkIn: format(parseISO(getEarliestAvailableDate()), 'yyyy-MM-dd'),
      checkOut: '',
      guests: 1,
    },
  });
  
  // Watch form values for calculations
  const checkIn = watch('checkIn');
  const checkOut = watch('checkOut');
  const guests = watch('guests');
  
  // Handle guest count changes
  const handleGuestChange = (type: 'adults' | 'children' | 'infants' | 'pets', increment: boolean) => {
    setGuestCounts(prev => {
      const newCounts = { ...prev };
      
      if (increment) {
        // Increment with limits
        if (type === 'adults' && newCounts.adults < 10) newCounts.adults += 1;
        if (type === 'children' && newCounts.children < 10) newCounts.children += 1;
        if (type === 'infants' && newCounts.infants < 5) newCounts.infants += 1;
        if (type === 'pets' && newCounts.pets < 5) newCounts.pets += 1;
      } else {
        // Decrement with limits
        if (type === 'adults' && newCounts.adults > 1) newCounts.adults -= 1;
        if (type === 'children' && newCounts.children > 0) newCounts.children -= 1;
        if (type === 'infants' && newCounts.infants > 0) newCounts.infants -= 1;
        if (type === 'pets' && newCounts.pets > 0) newCounts.pets -= 1;
      }
      
      // Update the form value for guests (adults + children)
      const totalGuests = newCounts.adults + newCounts.children;
      setValue('guests', totalGuests);
      
      return newCounts;
    });
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (guestDropdownRef.current && !guestDropdownRef.current.contains(event.target as Node)) {
        setIsGuestDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        setIsLoggedIn(!!user);
      } catch (err) {
        setIsLoggedIn(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Calculate nights and pricing when dates change
  useEffect(() => {
    const calculatePricing = async () => {
      if (!checkIn || !checkOut) {
        setPricing(null);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Check availability and get pricing
        const result = await checkAvailability(propertyId, {
          checkIn,
          checkOut,
          guests,
        });
        
        setPricing(result.pricing);
      } catch (err: any) {
        console.error('Error checking availability:', err);
        setError(err.message || 'Failed to check availability');
        setPricing(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    calculatePricing();
  }, [checkIn, checkOut, guests, propertyId]);
  
  // Handle form submission
  const onSubmit = async (data: BookingFormData) => {
    // if (!isLoggedIn) {
    //   // Redirect to login with callback URL
    //   router.push(`/auth/login?callbackUrl=/properties/${propertyId}?checkIn=${data.checkIn}&checkOut=${data.checkOut}&guests=${data.guests}`);
    //   return;
    // }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Check availability one more time
      await checkAvailability(propertyId, {
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        guests: data.guests,
      });
      
      // Redirect to booking page
      router.push(`/bookings/new?propertyId=${propertyId}&checkIn=${data.checkIn}&checkOut=${data.checkOut}&guests=${data.guests}`);
    } catch (err: any) {
      console.error('Error processing booking:', err);
      setError(err.message || 'Failed to process booking');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Check if a date is within any availability range
  const isDateAvailable = (date: Date) => {
    try {
      if (!availability || availability.length === 0) return false;
      if (!date || isNaN(date.getTime())) return false;
      
      return availability.some(range => {
        try {
          const startDate = parseISO(range.startDate);
          const endDate = parseISO(range.endDate);
          
          if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            console.error('Invalid date range:', range);
            return false;
          }
          
          return isWithinInterval(date, { start: startDate, end: endDate });
        } catch (error) {
          console.error('Error checking availability range:', error, range);
          return false;
        }
      });
    } catch (error) {
      console.error('Error in isDateAvailable:', error);
      return false;
    }
  };
  
  // Check if a date is within any blocked range
  const isDateBlocked = (date: Date) => {
    try {
      if (!blockedDates || blockedDates.length === 0) return false;
      if (!date || isNaN(date.getTime())) return false;
      
      return blockedDates.some(range => {
        try {
          const startDate = parseISO(range.startDate);
          const endDate = parseISO(range.endDate);
          
          if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            console.error('Invalid blocked date range:', range);
            return false;
          }
          
          return isWithinInterval(date, { start: startDate, end: endDate });
        } catch (error) {
          console.error('Error checking blocked range:', error, range);
          return false;
        }
      });
    } catch (error) {
      console.error('Error in isDateBlocked:', error);
      return false;
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      {/* Price display */}
      <div className="flex items-baseline mb-4">
        <span className="text-xl font-bold text-gray-900">{formatCurrency(basePrice)}</span>
        <span className="text-gray-600 ml-1">night</span>
      </div>
      
      {/* Booking form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Date inputs */}
        <div className="grid grid-cols-2 gap-2 border border-gray-300 rounded-t-md">
          <div className="p-2 border-r border-gray-300">
            <label htmlFor="checkIn" className="block text-xs font-medium text-gray-700">
              CHECK-IN
            </label>
            <div className="mt-1 relative">
              <Controller
                control={control}
                name="checkIn"
                render={({ field }) => (
                  <div className="relative">
                    <DatePicker
                      id="checkIn"
                      selected={field.value ? parseISO(field.value) : null}
                      onChange={(date) => {
                        if (date) {
                          field.onChange(format(date, 'yyyy-MM-dd'));
                          
                          // If check-out date is not set or is before check-in date, set it to check-in + 1 day
                          const checkOutValue = watch('checkOut');
                          if (!checkOutValue || parseISO(checkOutValue) <= date) {
                            setValue('checkOut', format(addDays(date, 1), 'yyyy-MM-dd'));
                          }
                        }
                      }}
                      minDate={parseISO(getEarliestAvailableDate())}
                      filterDate={(date) => isDateAvailable(date) && !isDateBlocked(date)}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Select check-in date"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                      calendarClassName="booking-calendar"
                      showPopperArrow={false}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <CalendarIcon className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                )}
              />
              {errors.checkIn ? (
                <p className="mt-1 text-xs text-red-600">{errors.checkIn.message}</p>
              ) : (
                <p className="mt-1 text-xs text-gray-500">Select your arrival date</p>
              )}
            </div>
          </div>
          
          <div className="p-2">
            <label htmlFor="checkOut" className="block text-xs font-medium text-gray-700">
              CHECK-OUT
            </label>
            <div className="mt-1 relative">
              <Controller
                control={control}
                name="checkOut"
                render={({ field }) => (
                  <div className="relative">
                    <DatePicker
                      id="checkOut"
                      selected={field.value ? parseISO(field.value) : null}
                      onChange={(date) => {
                        if (date) {
                          field.onChange(format(date, 'yyyy-MM-dd'));
                        }
                      }}
                      minDate={checkIn ? addDays(parseISO(checkIn), 1) : parseISO(getEarliestAvailableDate())}
                      filterDate={(date) => isDateAvailable(date) && !isDateBlocked(date)}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Select check-out date"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                      calendarClassName="booking-calendar"
                      showPopperArrow={false}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <CalendarIcon className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                )}
              />
              {errors.checkOut ? (
                <p className="mt-1 text-xs text-red-600">{errors.checkOut.message}</p>
              ) : (
                <p className="mt-1 text-xs text-gray-500">Select your departure date</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Guests input */}
        <div className="border border-gray-300 rounded-b-md p-2" ref={guestDropdownRef}>
          <label htmlFor="guests" className="block text-xs font-medium text-gray-700">
            GUESTS
          </label>
          <div className="mt-1 relative">
            <button
              type="button"
              className="w-full text-left border-none p-0 text-gray-900 bg-transparent focus:outline-none flex justify-between items-center"
              onClick={() => setIsGuestDropdownOpen(!isGuestDropdownOpen)}
            >
              <span>
                {guests} {guests === 1 ? 'guest' : 'guests'}
                {guestCounts.infants > 0 && `, ${guestCounts.infants} ${guestCounts.infants === 1 ? 'infant' : 'infants'}`}
                {guestCounts.pets > 0 && `, ${guestCounts.pets} ${guestCounts.pets === 1 ? 'pet' : 'pets'}`}
              </span>
              <UserIcon className="h-4 w-4 text-gray-400" />
            </button>
            
            {/* Guest Dropdown */}
            <AnimatePresence>
              {isGuestDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg p-4 z-50 border border-gray-200 w-72"
                >
                  {/* Adults */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <p className="font-medium">Adults</p>
                      <p className="text-sm text-gray-500">Ages 13 or above</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button 
                        type="button"
                        onClick={() => handleGuestChange('adults', false)}
                        disabled={guestCounts.adults <= 1}
                        className={`w-8 h-8 rounded-full flex items-center justify-center border ${guestCounts.adults <= 1 ? 'border-gray-200 text-gray-300' : 'border-gray-400 text-gray-600 hover:border-gray-700'}`}
                      >
                        <span className="text-lg">-</span>
                      </button>
                      <span className="w-6 text-center">{guestCounts.adults}</span>
                      <button 
                        type="button"
                        onClick={() => handleGuestChange('adults', true)}
                        disabled={guestCounts.adults >= 10}
                        className={`w-8 h-8 rounded-full flex items-center justify-center border ${guestCounts.adults >= 10 ? 'border-gray-200 text-gray-300' : 'border-gray-400 text-gray-600 hover:border-gray-700'}`}
                      >
                        <span className="text-lg">+</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Children */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <p className="font-medium">Children</p>
                      <p className="text-sm text-gray-500">Ages 2-12</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button 
                        type="button"
                        onClick={() => handleGuestChange('children', false)}
                        disabled={guestCounts.children <= 0}
                        className={`w-8 h-8 rounded-full flex items-center justify-center border ${guestCounts.children <= 0 ? 'border-gray-200 text-gray-300' : 'border-gray-400 text-gray-600 hover:border-gray-700'}`}
                      >
                        <span className="text-lg">-</span>
                      </button>
                      <span className="w-6 text-center">{guestCounts.children}</span>
                      <button 
                        type="button"
                        onClick={() => handleGuestChange('children', true)}
                        disabled={guestCounts.children >= 10}
                        className={`w-8 h-8 rounded-full flex items-center justify-center border ${guestCounts.children >= 10 ? 'border-gray-200 text-gray-300' : 'border-gray-400 text-gray-600 hover:border-gray-700'}`}
                      >
                        <span className="text-lg">+</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Infants */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <p className="font-medium">Infants</p>
                      <p className="text-sm text-gray-500">Under 2</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button 
                        type="button"
                        onClick={() => handleGuestChange('infants', false)}
                        disabled={guestCounts.infants <= 0}
                        className={`w-8 h-8 rounded-full flex items-center justify-center border ${guestCounts.infants <= 0 ? 'border-gray-200 text-gray-300' : 'border-gray-400 text-gray-600 hover:border-gray-700'}`}
                      >
                        <span className="text-lg">-</span>
                      </button>
                      <span className="w-6 text-center">{guestCounts.infants}</span>
                      <button 
                        type="button"
                        onClick={() => handleGuestChange('infants', true)}
                        disabled={guestCounts.infants >= 5}
                        className={`w-8 h-8 rounded-full flex items-center justify-center border ${guestCounts.infants >= 5 ? 'border-gray-200 text-gray-300' : 'border-gray-400 text-gray-600 hover:border-gray-700'}`}
                      >
                        <span className="text-lg">+</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Pets */}
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium">Pets</p>
                      <p className="text-sm text-gray-500">Service animals allowed</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button 
                        type="button"
                        onClick={() => handleGuestChange('pets', false)}
                        disabled={guestCounts.pets <= 0}
                        className={`w-8 h-8 rounded-full flex items-center justify-center border ${guestCounts.pets <= 0 ? 'border-gray-200 text-gray-300' : 'border-gray-400 text-gray-600 hover:border-gray-700'}`}
                      >
                        <span className="text-lg">-</span>
                      </button>
                      <span className="w-6 text-center">{guestCounts.pets}</span>
                      <button 
                        type="button"
                        onClick={() => handleGuestChange('pets', true)}
                        disabled={guestCounts.pets >= 5}
                        className={`w-8 h-8 rounded-full flex items-center justify-center border ${guestCounts.pets >= 5 ? 'border-gray-200 text-gray-300' : 'border-gray-400 text-gray-600 hover:border-gray-700'}`}
                      >
                        <span className="text-lg">+</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-right">
                    <button 
                      type="button" 
                      className="text-sm font-medium text-blue-600 hover:underline"
                      onClick={() => setIsGuestDropdownOpen(false)}
                    >
                      Done
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Hidden input for form submission */}
            <input
              type="hidden"
              {...register('guests', { valueAsNumber: true })}
              value={guestCounts.adults + guestCounts.children}
            />
          </div>
        </div>
        
        {/* Form errors */}
        {(errors.checkIn || errors.checkOut || errors.guests || error) && (
          <div className="text-sm text-red-600">
            {errors.checkIn && <p>{errors.checkIn.message}</p>}
            {errors.checkOut && <p>{errors.checkOut.message}</p>}
            {errors.guests && <p>{errors.guests.message}</p>}
            {error && (
              <div className="flex items-start mt-1">
                <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-1 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
          </div>
        )}
        
        {/* Booking button */}
        <button
          type="submit"
          disabled={isLoading || !checkIn || !checkOut}
          className={`w-full py-3 px-4 rounded-md font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isLoading || !checkIn || !checkOut
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Checking availability...' : instantBooking ? 'Reserve' : 'Request to book'}
        </button>
        
        {/* No charge yet message */}
        <p className="text-center text-sm text-gray-500">
          You won't be charged yet
        </p>
        
        {/* Price breakdown */}
        {pricing && (
          <div className="mt-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 underline">
                {formatCurrency(pricing.basePrice)} x {pricing.nights} nights
              </span>
              <span className="text-gray-900">{formatCurrency(pricing.baseTotal)}</span>
            </div>
            
            {pricing.discount && (
              <div className="flex justify-between">
                <span className="text-green-600">
                  {pricing.discount.type === 'weekly' ? 'Weekly' : 'Monthly'} discount ({pricing.discount.percentage}%)
                </span>
                <span className="text-green-600">-{formatCurrency(pricing.discount.amount)}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-gray-600">Cleaning fee</span>
              <span className="text-gray-900">{formatCurrency(pricing.cleaningFee)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Service fee</span>
              <span className="text-gray-900">{formatCurrency(pricing.serviceFee)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Taxes ({pricing.taxRate}%)</span>
              <span className="text-gray-900">{formatCurrency(pricing.taxAmount)}</span>
            </div>
            
            <div className="border-t border-gray-200 pt-3 flex justify-between font-bold">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">{formatCurrency(pricing.total)}</span>
            </div>
          </div>
        )}
      </form>
      
      {/* Minimum stay notice */}
      <div className="mt-4 text-sm text-gray-600">
        <p>
          Minimum stay: {minimumStay} night{minimumStay > 1 ? 's' : ''}
          {maximumStay ? `, Maximum stay: ${maximumStay} nights` : ''}
        </p>
      </div>
    </div>
  );
}
