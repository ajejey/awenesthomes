'use client';

import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { XMarkIcon, CalendarIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { format, addMonths, isAfter, isBefore, parseISO } from 'date-fns';

export default function AvailabilityForm() {
  const { register, formState: { errors }, setValue, watch } = useFormContext();
  
  // Watch availability and blocked dates
  const availabilityRanges = watch('availability') || [];
  const blockedDates = watch('blockedDates') || [];
  
  // State for new date ranges
  const [newAvailabilityStart, setNewAvailabilityStart] = useState('');
  const [newAvailabilityEnd, setNewAvailabilityEnd] = useState('');
  const [newBlockedStart, setNewBlockedStart] = useState('');
  const [newBlockedEnd, setNewBlockedEnd] = useState('');
  const [blockReason, setBlockReason] = useState('');
  
  // Calculate min and max dates for the date inputs
  const today = new Date();
  const maxDate = addMonths(today, 24); // Allow booking up to 2 years in advance
  const minDateStr = format(today, 'yyyy-MM-dd');
  const maxDateStr = format(maxDate, 'yyyy-MM-dd');
  
  // Add new availability range
  const addAvailabilityRange = () => {
    if (!newAvailabilityStart || !newAvailabilityEnd) return;
    
    const startDate = new Date(newAvailabilityStart);
    const endDate = new Date(newAvailabilityEnd);
    
    // Validate dates
    if (isAfter(startDate, endDate)) {
      alert('Start date must be before end date');
      return;
    }
    
    // Add new range
    setValue('availability', [
      ...availabilityRanges,
      { startDate, endDate }
    ]);
    
    // Reset inputs
    setNewAvailabilityStart('');
    setNewAvailabilityEnd('');
  };
  
  // Remove availability range
  const removeAvailabilityRange = (index: number) => {
    const newRanges = [...availabilityRanges];
    newRanges.splice(index, 1);
    setValue('availability', newRanges);
  };
  
  // Add new blocked date range
  const addBlockedDateRange = () => {
    if (!newBlockedStart || !newBlockedEnd) return;
    
    const startDate = new Date(newBlockedStart);
    const endDate = new Date(newBlockedEnd);
    
    // Validate dates
    if (isAfter(startDate, endDate)) {
      alert('Start date must be before end date');
      return;
    }
    
    // Add new range
    setValue('blockedDates', [
      ...blockedDates,
      { startDate, endDate, reason: blockReason }
    ]);
    
    // Reset inputs
    setNewBlockedStart('');
    setNewBlockedEnd('');
    setBlockReason('');
  };
  
  // Remove blocked date range
  const removeBlockedDateRange = (index: number) => {
    const newRanges = [...blockedDates];
    newRanges.splice(index, 1);
    setValue('blockedDates', newRanges);
  };
  
  // Format date for display
  const formatDate = (date: Date | string) => {
    return format(typeof date === 'string' ? new Date(date) : date, 'MMM d, yyyy');
  };
  
  // Define reusable styles
  const sectionTitle = "text-lg font-semibold text-gray-900 mb-1";
  const sectionSubtitle = "text-sm text-gray-600 mb-4";
  const labelClassName = "block text-sm font-medium text-gray-700 mb-1";
  const inputClassName = "block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition duration-150 ease-in-out";
  const buttonPrimary = "inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed";
  const buttonDanger = "inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed";
  const cardClassName = "bg-white rounded-xl border border-gray-200 p-4 mb-4";
  const listItemClassName = "flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2 last:mb-0";
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Availability Settings</h2>
        <p className="mt-1 text-gray-600">
          Set when your property is available for booking and block dates when it's not.
        </p>
      </div>
      
      {/* Availability Ranges */}
      <div className={cardClassName}>
        <div className="flex items-center gap-2 mb-4">
          <CalendarIcon className="h-5 w-5 text-blue-600" />
          <h3 className={sectionTitle}>Available Date Ranges</h3>
        </div>
        <p className={sectionSubtitle}>
          Add periods when your property is available for booking. You can add multiple ranges.
        </p>
        
        {/* Add new availability range */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-12 mb-6">
          <div className="sm:col-span-5">
            <label htmlFor="availabilityStart" className={labelClassName}>
              <span className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                Start Date
              </span>
            </label>
            <input
              type="date"
              id="availabilityStart"
              value={newAvailabilityStart}
              onChange={(e) => setNewAvailabilityStart(e.target.value)}
              min={minDateStr}
              max={maxDateStr}
              className={inputClassName}
            />
          </div>
          
          <div className="sm:col-span-5">
            <label htmlFor="availabilityEnd" className={labelClassName}>
              <span className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                End Date
              </span>
            </label>
            <input
              type="date"
              id="availabilityEnd"
              value={newAvailabilityEnd}
              onChange={(e) => setNewAvailabilityEnd(e.target.value)}
              min={newAvailabilityStart || minDateStr}
              max={maxDateStr}
              className={inputClassName}
            />
          </div>
          
          <div className="sm:col-span-2 flex items-end">
            <button
              type="button"
              onClick={addAvailabilityRange}
              disabled={!newAvailabilityStart || !newAvailabilityEnd}
              className={`${buttonPrimary} w-full h-[42px]`}
            >
              Add
            </button>
          </div>
        </div>
        
        {/* Display current availability ranges */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Current Availability</h4>
          {availabilityRanges.length > 0 ? (
            <div className="space-y-2">
              {availabilityRanges.map((range: { startDate: Date | string; endDate: Date | string }, index: number) => (
                <div key={index} className={listItemClassName}>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-800">
                      {formatDate(range.startDate)} to {formatDate(range.endDate)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAvailabilityRange(index)}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                    title="Remove range"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
              No availability ranges added yet.
            </div>
          )}
        </div>
        
        {/* Form validation error */}
        {errors.availability && (
          <div className="mt-3 text-sm text-red-600 bg-red-50 p-2 rounded-md flex items-start gap-2">
            <ExclamationTriangleIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{errors.availability.message as string}</span>
          </div>
        )}
      </div>
      
      {/* Blocked Dates */}
      <div className={cardClassName}>
        <div className="flex items-center gap-2 mb-4">
          <XMarkIcon className="h-5 w-5 text-red-600" />
          <h3 className={sectionTitle}>Blocked Dates</h3>
        </div>
        <p className={sectionSubtitle}>
          Block dates when your property is not available for booking (e.g., personal use, maintenance).
        </p>
        
        {/* Add new blocked date range */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-12 mb-6">
          <div className="sm:col-span-3">
            <label htmlFor="blockedStart" className={labelClassName}>
              <span className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                Start Date
              </span>
            </label>
            <input
              type="date"
              id="blockedStart"
              value={newBlockedStart}
              onChange={(e) => setNewBlockedStart(e.target.value)}
              min={minDateStr}
              max={maxDateStr}
              className={inputClassName}
            />
          </div>
          
          <div className="sm:col-span-3">
            <label htmlFor="blockedEnd" className={labelClassName}>
              <span className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                End Date
              </span>
            </label>
            <input
              type="date"
              id="blockedEnd"
              value={newBlockedEnd}
              onChange={(e) => setNewBlockedEnd(e.target.value)}
              min={newBlockedStart || minDateStr}
              max={maxDateStr}
              className={inputClassName}
            />
          </div>
          
          <div className="sm:col-span-4">
            <label htmlFor="blockReason" className={labelClassName}>
              <span className="flex items-center gap-1">
                <span className="h-4 w-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.5L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.5 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                  </svg>
                </span>
                Reason (Optional)
              </span>
            </label>
            <input
              type="text"
              id="blockReason"
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              placeholder="e.g., Personal use, Maintenance"
              className={inputClassName}
            />
          </div>
          
          <div className="sm:col-span-2 flex items-end">
            <button
              type="button"
              onClick={addBlockedDateRange}
              disabled={!newBlockedStart || !newBlockedEnd}
              className={`${buttonDanger} w-full h-[42px]`}
            >
              Block Dates
            </button>
          </div>
        </div>
        
        {/* Display current blocked date ranges */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Blocked Periods</h4>
          {blockedDates.length > 0 ? (
            <div className="space-y-2">
              {blockedDates.map((range: { startDate: Date | string; endDate: Date | string; reason?: string }, index: number) => (
                <div key={index} className={listItemClassName}>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <XMarkIcon className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium text-gray-800">
                        {formatDate(range.startDate)} to {formatDate(range.endDate)}
                      </span>
                    </div>
                    {range.reason && (
                      <div className="text-xs text-gray-500 ml-6">
                        <span className="font-medium">Note:</span> {range.reason}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeBlockedDateRange(index)}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                    title="Remove blocked period"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
              No blocked dates added yet.
            </div>
          )}
        </div>
      </div>
      
      {/* Availability Tips */}
      <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-blue-800 mb-2">Availability Tips</h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                <span>Set availability at least 6 months in advance to maximize bookings</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                <span>Block dates as soon as you know you'll need the property for personal use</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                <span>You can always update your availability calendar later</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                <span>Guests can only book within your available date ranges</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
