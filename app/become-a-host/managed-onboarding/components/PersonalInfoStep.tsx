'use client';

import React from 'react';
import { UseFormRegister, FormState } from 'react-hook-form';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface PersonalInfoStepProps {
  register: UseFormRegister<any>;
  errors: FormState<any>['errors'];
  userEmail?: string;
}

export default function PersonalInfoStep({ register, errors, userEmail }: PersonalInfoStepProps) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-md">
        <p className="text-sm text-blue-700">
          Welcome to AweNestHost-Managed Onboarding! We need some basic information to get started with your managed hosting journey.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name *
          </label>
          <div className="mt-1 relative">
            <input
              type="text"
              id="name"
              {...register('name')}
              className={`block w-full p-3 sm:text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.name ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' : ''
              }`}
              placeholder="John Doe"
            />
            {errors.name && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
              </div>
            )}
          </div>
          {errors.name && (
            <p className="mt-2 text-sm text-red-600" id="name-error">
              {errors.name.message as string}
            </p>
          )}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <div className="mt-1">
            <input
              type="email"
              id="email"
              value={userEmail}
              disabled
              className="bg-gray-100 block w-full p-3 sm:text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              This is the email associated with your account. To change it, please update your profile.
            </p>
          </div>
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Primary Phone Number *
          </label>
          <div className="mt-1 relative">
            <input
              type="tel"
              id="phone"
              {...register('phone')}
              className={`block w-full p-3 sm:text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.phone ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' : ''
              }`}
              placeholder="+91 9876543210"
            />
            {errors.phone && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
              </div>
            )}
          </div>
          {errors.phone && (
            <p className="mt-2 text-sm text-red-600" id="phone-error">
              {errors.phone.message as string}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            This is the number our team will use to contact you about your property.
          </p>
        </div>
        
        <div>
          <label htmlFor="alternatePhone" className="block text-sm font-medium text-gray-700">
            Alternate Phone Number (Optional)
          </label>
          <div className="mt-1">
            <input
              type="tel"
              id="alternatePhone"
              {...register('alternatePhone')}
              className="block w-full p-3 sm:text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="+91 9876543210"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            An additional contact number in case we can't reach you on your primary number.
          </p>
        </div>
      </div>
      
      <div className="bg-yellow-50 p-4 rounded-md">
        <h4 className="text-sm font-medium text-yellow-800">Why we need this information</h4>
        <p className="mt-1 text-sm text-yellow-700">
          Your contact information helps our property management team reach you regarding property setup, maintenance, and guest communications. We'll never share your information with third parties.
        </p>
      </div>
    </div>
  );
}
