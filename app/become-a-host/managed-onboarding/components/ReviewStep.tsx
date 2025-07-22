'use client';

import React from 'react';
import { UseFormWatch } from 'react-hook-form';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

interface ReviewStepProps {
  watch: UseFormWatch<any>;
}

export default function ReviewStep({ watch }: ReviewStepProps) {
  const formData = watch();
  
  const propertyTypeLabels: Record<string, string> = {
    apartment: 'Apartment',
    house: 'House',
    guesthouse: 'Guesthouse',
    hotel: 'Hotel',
    villa: 'Villa',
    cottage: 'Cottage',
    bungalow: 'Bungalow',
    farmhouse: 'Farmhouse',
    treehouse: 'Treehouse',
    boat: 'Boat',
    other: 'Other',
  };
  
  const managementPreferenceLabels: Record<string, string> = {
    full_management: 'Full Management (20% commission)',
    partial_management: 'Partial Management (15% commission)',
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-md">
        <p className="text-sm text-blue-700">
          Please review your information before submitting your managed hosting application.
        </p>
      </div>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
            Personal Information
          </h3>
          <div className="mt-3 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formData.name}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formData.phone}</dd>
                </div>
                {formData.alternatePhone && (
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Alternate Phone</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formData.alternatePhone}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
            Property Details
          </h3>
          <div className="mt-3 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Property Type</dt>
                  <dd className="mt-1 text-sm text-gray-900">{propertyTypeLabels[formData.propertyType]}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Bedrooms</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formData.bedrooms}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Bathrooms</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formData.bathrooms}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Address</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formData.address}, {formData.city}, {formData.state}, {formData.zipCode}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
            Management Preferences
          </h3>
          <div className="mt-3 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Available From</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(formData.availableFromDate).toLocaleDateString()}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Management Preference</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {managementPreferenceLabels[formData.managementPreference]}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Existing Bookings</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formData.existingBookings ? 'Yes' : 'No'}
                  </dd>
                </div>
                {formData.existingBookings && formData.existingBookingDetails && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Existing Booking Details</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formData.existingBookingDetails}</dd>
                  </div>
                )}
                {formData.specialRequests && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Special Requests</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formData.specialRequests}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
            Terms & Agreements
          </h3>
          <div className="mt-3 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Terms & Conditions</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formData.agreeToTerms ? 'Agreed' : 'Not agreed'}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Commission Structure</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formData.agreeToCommission ? 'Agreed' : 'Not agreed'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-yellow-50 p-4 rounded-md">
        <h4 className="text-sm font-medium text-yellow-800">Ready to Submit?</h4>
        <p className="mt-1 text-sm text-yellow-700">
          By submitting this application, you're taking the first step towards hassle-free property management with AweNestHost. Our team will contact you within 24 hours to discuss next steps.
        </p>
      </div>
    </div>
  );
}
