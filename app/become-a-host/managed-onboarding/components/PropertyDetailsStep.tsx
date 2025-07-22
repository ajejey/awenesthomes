'use client';

import React from 'react';
import { UseFormRegister, FormState, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface PropertyDetailsStepProps {
  register: UseFormRegister<any>;
  errors: FormState<any>['errors'];
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
}

export default function PropertyDetailsStep({ register, errors, watch, setValue }: PropertyDetailsStepProps) {
  const propertyType = watch('propertyType');
  
  const propertyTypes = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'guesthouse', label: 'Guesthouse' },
    { value: 'hotel', label: 'Hotel' },
    { value: 'villa', label: 'Villa' },
    { value: 'cottage', label: 'Cottage' },
    { value: 'bungalow', label: 'Bungalow' },
    { value: 'farmhouse', label: 'Farmhouse' },
    { value: 'treehouse', label: 'Treehouse' },
    { value: 'boat', label: 'Boat' },
    { value: 'other', label: 'Other' },
  ];
  
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-md">
        <p className="text-sm text-blue-700">
          Tell us about your property so we can help you maximize its potential on AweNestHomes.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">
            Property Type *
          </label>
          <div className="mt-1">
            <select
              id="propertyType"
              {...register('propertyType')}
              className={`block w-full p-3 sm:text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.propertyType ? 'border-red-300 text-red-900 focus:outline-none focus:ring-red-500 focus:border-red-500' : ''
              }`}
            >
              {propertyTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          {errors.propertyType && (
            <p className="mt-2 text-sm text-red-600" id="propertyType-error">
              {errors.propertyType.message as string}
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">
              Bedrooms *
            </label>
            <div className="mt-1 relative">
              <input
                type="number"
                id="bedrooms"
                min="1"
                step="1"
                {...register('bedrooms', { valueAsNumber: true })}
                className={`block w-full p-3 sm:text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.bedrooms ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' : ''
                }`}
              />
              {errors.bedrooms && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                </div>
              )}
            </div>
            {errors.bedrooms && (
              <p className="mt-2 text-sm text-red-600" id="bedrooms-error">
                {errors.bedrooms.message as string}
              </p>
            )}
          </div>
          
          <div>
            <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">
              Bathrooms *
            </label>
            <div className="mt-1 relative">
              <input
                type="number"
                id="bathrooms"
                min="0.5"
                step="0.5"
                {...register('bathrooms', { valueAsNumber: true })}
                className={`block w-full p-3 sm:text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.bathrooms ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' : ''
                }`}
              />
              {errors.bathrooms && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                </div>
              )}
            </div>
            {errors.bathrooms && (
              <p className="mt-2 text-sm text-red-600" id="bathrooms-error">
                {errors.bathrooms.message as string}
              </p>
            )}
          </div>
        </div>
        
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Street Address *
          </label>
          <div className="mt-1 relative">
            <input
              type="text"
              id="address"
              {...register('address')}
              className={`block w-full p-3 sm:text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.address ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' : ''
              }`}
              placeholder="123 Main Street"
            />
            {errors.address && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
              </div>
            )}
          </div>
          {errors.address && (
            <p className="mt-2 text-sm text-red-600" id="address-error">
              {errors.address.message as string}
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City *
            </label>
            <div className="mt-1 relative">
              <input
                type="text"
                id="city"
                {...register('city')}
                className={`block w-full p-3 sm:text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.city ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' : ''
                }`}
                placeholder="Mumbai"
              />
              {errors.city && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                </div>
              )}
            </div>
            {errors.city && (
              <p className="mt-2 text-sm text-red-600" id="city-error">
                {errors.city.message as string}
              </p>
            )}
          </div>
          
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">
              State *
            </label>
            <div className="mt-1 relative">
              <input
                type="text"
                id="state"
                {...register('state')}
                className={`block w-full p-3 sm:text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.state ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' : ''
                }`}
                placeholder="Maharashtra"
              />
              {errors.state && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                </div>
              )}
            </div>
            {errors.state && (
              <p className="mt-2 text-sm text-red-600" id="state-error">
                {errors.state.message as string}
              </p>
            )}
          </div>
          
          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
              ZIP Code *
            </label>
            <div className="mt-1 relative">
              <input
                type="text"
                id="zipCode"
                {...register('zipCode')}
                className={`block w-full p-3 sm:text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.zipCode ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' : ''
                }`}
                placeholder="400001"
              />
              {errors.zipCode && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                </div>
              )}
            </div>
            {errors.zipCode && (
              <p className="mt-2 text-sm text-red-600" id="zipCode-error">
                {errors.zipCode.message as string}
              </p>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-yellow-50 p-4 rounded-md">
        <h4 className="text-sm font-medium text-yellow-800">Property Information Privacy</h4>
        <p className="mt-1 text-sm text-yellow-700">
          Your property address is only used by our management team and will not be publicly visible until your listing is published. You'll have a chance to review all details before going live.
        </p>
      </div>
    </div>
  );
}
