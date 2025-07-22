'use client';

import React from 'react';
import { UseFormRegister, FormState, UseFormWatch } from 'react-hook-form';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface ManagementPreferencesStepProps {
  register: UseFormRegister<any>;
  errors: FormState<any>['errors'];
  watch: UseFormWatch<any>;
}

export default function ManagementPreferencesStep({ register, errors, watch }: ManagementPreferencesStepProps) {
  const existingBookings = watch('existingBookings');
  
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-md">
        <p className="text-sm text-blue-700">
          Tell us about your availability and management preferences so we can tailor our services to your needs.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="availableFromDate" className="block text-sm font-medium text-gray-700">
            When will your property be available for guests? *
          </label>
          <div className="mt-1 relative">
            <input
              type="date"
              id="availableFromDate"
              {...register('availableFromDate')}
              className={`block w-full p-3 sm:text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.availableFromDate ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' : ''
              }`}
            />
            {errors.availableFromDate && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
              </div>
            )}
          </div>
          {errors.availableFromDate && (
            <p className="mt-2 text-sm text-red-600" id="availableFromDate-error">
              {errors.availableFromDate.message as string}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Select the earliest date your property can be available for AweNestHost management.
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Management Preference *
          </label>
          <div className="mt-2 space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="full_management"
                  type="radio"
                  value="full_management"
                  {...register('managementPreference')}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="full_management" className="font-medium text-gray-700">
                  Full Management (20% commission)
                </label>
                <p className="text-gray-500">
                  We handle everything: guest communication, pricing, cleaning, maintenance, and 24/7 support.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="partial_management"
                  type="radio"
                  value="partial_management"
                  {...register('managementPreference')}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="partial_management" className="font-medium text-gray-700">
                  Partial Management (15% commission)
                </label>
                <p className="text-gray-500">
                  We handle guest communication, pricing, and booking management. You handle cleaning and maintenance.
                </p>
              </div>
            </div>
          </div>
          {errors.managementPreference && (
            <p className="mt-2 text-sm text-red-600" id="managementPreference-error">
              {errors.managementPreference.message as string}
            </p>
          )}
        </div>
        
        <div>
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="existingBookings"
                type="checkbox"
                {...register('existingBookings')}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="existingBookings" className="font-medium text-gray-700">
                I have existing bookings for this property
              </label>
              <p className="text-gray-500">
                Check this if you already have bookings that our team needs to be aware of.
              </p>
            </div>
          </div>
        </div>
        
        {existingBookings && (
          <div>
            <label htmlFor="existingBookingDetails" className="block text-sm font-medium text-gray-700">
              Existing Booking Details
            </label>
            <div className="mt-1">
              <textarea
                id="existingBookingDetails"
                rows={3}
                {...register('existingBookingDetails')}
                className="block w-full p-3 sm:text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Please provide details about your existing bookings (dates, platforms, etc.)"
              />
            </div>
          </div>
        )}
        
        <div>
          <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700">
            Special Requests or Notes (Optional)
          </label>
          <div className="mt-1">
            <textarea
              id="specialRequests"
              rows={3}
              {...register('specialRequests')}
              className="block w-full p-3 sm:text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Any special requests or additional information you'd like to share with our management team"
            />
          </div>
        </div>
      </div>
      
      <div className="bg-yellow-50 p-4 rounded-md">
        <h4 className="text-sm font-medium text-yellow-800">Management Service Details</h4>
        <p className="mt-1 text-sm text-yellow-700">
          Our management team will contact you within 24 hours of your application to discuss your property in detail and answer any questions you may have about our services and commission structure.
        </p>
      </div>
    </div>
  );
}
