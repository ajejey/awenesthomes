'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, isWithinInterval, parseISO } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { getPropertyCalendar, updateAvailability, updateBlockedDates } from './actions';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Define schemas for form validation
const availabilitySchema = z.object({
  startDate: z.date(),
  endDate: z.date().refine(data => data > new Date(), {
    message: 'End date must be in the future',
  }),
});

const blockedDateSchema = z.object({
  startDate: z.date(),
  endDate: z.date().refine(data => data > new Date(), {
    message: 'End date must be in the future',
  }),
  reason: z.string().optional(),
});

type AvailabilityFormData = z.infer<typeof availabilitySchema>;
type BlockedDateFormData = z.infer<typeof blockedDateSchema>;

export default function PropertyCalendarPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [propertyData, setPropertyData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<'availability' | 'blocked'>('availability');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Setup forms
  const availabilityForm = useForm<AvailabilityFormData>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: {
      startDate: new Date(),
      endDate: addMonths(new Date(), 1),
    },
  });
  
  const blockedDateForm = useForm<BlockedDateFormData>({
    resolver: zodResolver(blockedDateSchema),
    defaultValues: {
      startDate: new Date(),
      endDate: addMonths(new Date(), 1),
      reason: '',
    },
  });
  
  // Fetch property data
  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const data = await getPropertyCalendar(params.id);
        setPropertyData(data);
      } catch (err: any) {
        console.error('Error fetching property calendar:', err);
        setError(err.message || 'Failed to load property calendar data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPropertyData();
  }, [params.id]);
  
  // Handle month navigation
  const goToPreviousMonth = () => {
    setCurrentDate(prevDate => addMonths(prevDate, -1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(prevDate => addMonths(prevDate, 1));
  };
  
  // Generate calendar days
  const generateCalendarDays = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    return calendarDays;
  };
  
  // Check if a day is available
  const isDayAvailable = (day: Date) => {
    if (!propertyData || !propertyData.availability) return false;
    
    return propertyData.availability.some((range: any) => {
      const start = parseISO(range.startDate);
      const end = parseISO(range.endDate);
      return isWithinInterval(day, { start, end });
    });
  };
  
  // Check if a day is blocked
  const isDayBlocked = (day: Date) => {
    if (!propertyData || !propertyData.blockedDates) return false;
    
    return propertyData.blockedDates.some((range: any) => {
      const start = parseISO(range.startDate);
      const end = parseISO(range.endDate);
      return isWithinInterval(day, { start, end });
    });
  };
  
  // Get reason for blocked date
  const getBlockedDateReason = (day: Date) => {
    if (!propertyData || !propertyData.blockedDates) return '';
    
    const blockedDate = propertyData.blockedDates.find((range: any) => {
      const start = parseISO(range.startDate);
      const end = parseISO(range.endDate);
      return isWithinInterval(day, { start, end });
    });
    
    return blockedDate?.reason || 'Blocked';
  };
  
  // Handle availability form submission
  const handleAvailabilitySubmit = async (data: AvailabilityFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      await updateAvailability(params.id, {
        startDate: data.startDate,
        endDate: data.endDate,
      });
      
      // Refresh property data
      const updatedData = await getPropertyCalendar(params.id);
      setPropertyData(updatedData);
      
      // Close modal
      setIsModalOpen(false);
      
      // Reset form
      availabilityForm.reset({
        startDate: new Date(),
        endDate: addMonths(new Date(), 1),
      });
    } catch (err: any) {
      console.error('Error updating availability:', err);
      setError(err.message || 'Failed to update availability');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle blocked date form submission
  const handleBlockedDateSubmit = async (data: BlockedDateFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      await updateBlockedDates(params.id, {
        startDate: data.startDate,
        endDate: data.endDate,
        reason: data.reason,
      });
      
      // Refresh property data
      const updatedData = await getPropertyCalendar(params.id);
      setPropertyData(updatedData);
      
      // Close modal
      setIsModalOpen(false);
      
      // Reset form
      blockedDateForm.reset({
        startDate: new Date(),
        endDate: addMonths(new Date(), 1),
        reason: '',
      });
    } catch (err: any) {
      console.error('Error updating blocked dates:', err);
      setError(err.message || 'Failed to update blocked dates');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-lg text-gray-600">Loading calendar...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar Management</h1>
          <p className="text-gray-600 mt-1">
            {propertyData?.title || 'Property'} - Manage availability and blocked dates
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => {
              setSelectedMode('availability');
              setIsModalOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Availability
          </button>
          
          <button
            onClick={() => {
              setSelectedMode('blocked');
              setIsModalOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Block Dates
          </button>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Calendar */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Calendar header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={goToPreviousMonth}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
            </button>
            
            <h2 className="text-lg font-semibold text-gray-900">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            
            <button
              onClick={goToNextMonth}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ChevronRightIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
        
        {/* Calendar grid */}
        <div className="p-6">
          {/* Day labels */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-2">
            {generateCalendarDays().map((day) => {
              const isAvailable = isDayAvailable(day);
              const isBlockedDay = isDayBlocked(day);
              const dayClasses = `
                h-16 sm:h-24 p-1 border rounded-md relative
                ${isToday(day) ? 'border-blue-500' : 'border-gray-200'}
                ${!isSameMonth(day, currentDate) ? 'bg-gray-50 text-gray-400' : ''}
                ${isAvailable && !isBlockedDay ? 'bg-green-50' : ''}
                ${isBlockedDay ? 'bg-red-50' : ''}
              `;
              
              return (
                <div key={day.toString()} className={dayClasses}>
                  <div className="text-xs font-medium">{format(day, 'd')}</div>
                  
                  {isAvailable && !isBlockedDay && (
                    <div className="absolute bottom-1 left-1 right-1">
                      <span className="text-xs text-green-600 bg-green-100 px-1 py-0.5 rounded">
                        Available
                      </span>
                    </div>
                  )}
                  
                  {isBlockedDay && (
                    <div className="absolute bottom-1 left-1 right-1">
                      <span className="text-xs text-red-600 bg-red-100 px-1 py-0.5 rounded truncate" title={getBlockedDateReason(day)}>
                        {getBlockedDateReason(day)}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Calendar legend */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-50 border border-green-200 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Available</span>
            </div>
            
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-50 border border-red-200 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Blocked</span>
            </div>
            
            <div className="flex items-center">
              <div className="w-4 h-4 bg-white border border-blue-500 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Today</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Current availability and blocked dates */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Availability ranges */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability Ranges</h3>
          
          {propertyData?.availability && propertyData.availability.length > 0 ? (
            <ul className="space-y-3">
              {propertyData.availability.map((range: any, index: number) => (
                <li key={index} className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-md">
                  <span className="text-sm text-gray-700">
                    {format(parseISO(range.startDate), 'MMM d, yyyy')} - {format(parseISO(range.endDate), 'MMM d, yyyy')}
                  </span>
                  
                  <button
                    onClick={async () => {
                      try {
                        setIsSubmitting(true);
                        await updateAvailability(params.id, {
                          startDate: parseISO(range.startDate),
                          endDate: parseISO(range.endDate),
                          delete: true,
                        });
                        
                        // Refresh property data
                        const updatedData = await getPropertyCalendar(params.id);
                        setPropertyData(updatedData);
                      } catch (err: any) {
                        console.error('Error removing availability:', err);
                        setError(err.message || 'Failed to remove availability');
                      } finally {
                        setIsSubmitting(false);
                      }
                    }}
                    className="text-red-600 hover:text-red-800"
                    disabled={isSubmitting}
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No availability ranges set.</p>
          )}
        </div>
        
        {/* Blocked dates */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Blocked Dates</h3>
          
          {propertyData?.blockedDates && propertyData.blockedDates.length > 0 ? (
            <ul className="space-y-3">
              {propertyData.blockedDates.map((range: any, index: number) => (
                <li key={index} className="flex justify-between items-center p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-700">
                      {format(parseISO(range.startDate), 'MMM d, yyyy')} - {format(parseISO(range.endDate), 'MMM d, yyyy')}
                    </span>
                    {range.reason && (
                      <span className="text-xs text-gray-500 mt-1">
                        Reason: {range.reason}
                      </span>
                    )}
                  </div>
                  
                  <button
                    onClick={async () => {
                      try {
                        setIsSubmitting(true);
                        await updateBlockedDates(params.id, {
                          startDate: parseISO(range.startDate),
                          endDate: parseISO(range.endDate),
                          delete: true,
                        });
                        
                        // Refresh property data
                        const updatedData = await getPropertyCalendar(params.id);
                        setPropertyData(updatedData);
                      } catch (err: any) {
                        console.error('Error removing blocked dates:', err);
                        setError(err.message || 'Failed to remove blocked dates');
                      } finally {
                        setIsSubmitting(false);
                      }
                    }}
                    className="text-red-600 hover:text-red-800"
                    disabled={isSubmitting}
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No blocked dates set.</p>
          )}
        </div>
      </div>
      
      {/* Modal for adding availability or blocked dates */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {selectedMode === 'availability' ? 'Add Availability Range' : 'Block Dates'}
                    </h3>
                    
                    <div className="mt-4">
                      {selectedMode === 'availability' ? (
                        <form onSubmit={availabilityForm.handleSubmit(handleAvailabilitySubmit)} className="space-y-4">
                          <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                              Start Date
                            </label>
                            <input
                              type="date"
                              id="startDate"
                              {...availabilityForm.register('startDate', {
                                valueAsDate: true,
                              })}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            {availabilityForm.formState.errors.startDate && (
                              <p className="mt-1 text-sm text-red-600">
                                {availabilityForm.formState.errors.startDate.message}
                              </p>
                            )}
                          </div>
                          
                          <div>
                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                              End Date
                            </label>
                            <input
                              type="date"
                              id="endDate"
                              {...availabilityForm.register('endDate', {
                                valueAsDate: true,
                              })}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            {availabilityForm.formState.errors.endDate && (
                              <p className="mt-1 text-sm text-red-600">
                                {availabilityForm.formState.errors.endDate.message}
                              </p>
                            )}
                          </div>
                          
                          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                              {isSubmitting ? 'Saving...' : 'Add Availability'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsModalOpen(false)}
                              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <form onSubmit={blockedDateForm.handleSubmit(handleBlockedDateSubmit)} className="space-y-4">
                          <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                              Start Date
                            </label>
                            <input
                              type="date"
                              id="startDate"
                              {...blockedDateForm.register('startDate', {
                                valueAsDate: true,
                              })}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            {blockedDateForm.formState.errors.startDate && (
                              <p className="mt-1 text-sm text-red-600">
                                {blockedDateForm.formState.errors.startDate.message}
                              </p>
                            )}
                          </div>
                          
                          <div>
                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                              End Date
                            </label>
                            <input
                              type="date"
                              id="endDate"
                              {...blockedDateForm.register('endDate', {
                                valueAsDate: true,
                              })}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            {blockedDateForm.formState.errors.endDate && (
                              <p className="mt-1 text-sm text-red-600">
                                {blockedDateForm.formState.errors.endDate.message}
                              </p>
                            )}
                          </div>
                          
                          <div>
                            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                              Reason (Optional)
                            </label>
                            <input
                              type="text"
                              id="reason"
                              {...blockedDateForm.register('reason')}
                              placeholder="e.g., Personal use, Maintenance, etc."
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          
                          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                              {isSubmitting ? 'Saving...' : 'Block Dates'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsModalOpen(false)}
                              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
