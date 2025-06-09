'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { PropertyType } from '@/lib/models/property';
import { Info } from 'lucide-react';

const propertyTypes: { value: PropertyType; label: string }[] = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'guesthouse', label: 'Guest House' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'villa', label: 'Villa' },
  { value: 'cottage', label: 'Cottage' },
  { value: 'bungalow', label: 'Bungalow' },
  { value: 'farmhouse', label: 'Farmhouse' },
  { value: 'treehouse', label: 'Treehouse' },
  { value: 'boat', label: 'Boat' },
  { value: 'other', label: 'Other' },
];

const inputClassName = `block w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm 
  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
  focus:border-transparent transition duration-150 ease-in-out text-gray-900 
  disabled:bg-gray-50 disabled:text-gray-500`;

const labelClassName = 'block text-sm font-medium text-gray-700 mb-1';
const errorClassName = 'mt-1 text-sm text-red-500 flex items-center gap-1';
const helperTextClassName = 'mt-1 text-sm text-gray-500 flex items-start gap-1';

export default function BasicInfoForm() {
  const { register, formState: { errors } } = useFormContext();
  
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
        <p className="text-sm text-gray-600">
          Provide the essential details about your property to help guests find the perfect stay.
        </p>
      </div>

      <div className="space-y-6">
        {/* Property Title */}
        <div>
          <label htmlFor="title" className={labelClassName}>
            Property Title
          </label>
          <input
            type="text"
            id="title"
            {...register('title')}
            className={`${inputClassName} ${errors.title ? 'border-red-300' : ''}`}
            placeholder="e.g., Cozy Beachfront Villa in Goa"
          />
          {errors.title ? (
            <p className={errorClassName}>
              <Info className="h-4 w-4 flex-shrink-0" />
              {errors.title.message as string}
            </p>
          ) : (
            <p className={helperTextClassName}>
              <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
              A catchy title helps your property stand out. Include key features and location.
            </p>
          )}
        </div>
        
        {/* Property Description */}
        <div>
          <label htmlFor="description" className={labelClassName}>
            Property Description
          </label>
          <textarea
            id="description"
            {...register('description')}
            rows={5}
            className={`${inputClassName} ${errors.description ? 'border-red-300' : ''}`}
            placeholder="Describe your property, its unique features, and the experience guests can expect..."
          />
          {errors.description ? (
            <p className={errorClassName}>
              <Info className="h-4 w-4 flex-shrink-0" />
              {errors.description.message as string}
            </p>
          ) : (
            <p className={helperTextClassName}>
              <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
              Provide a detailed description of your property. Highlight unique features, nearby attractions, and what makes it special.
            </p>
          )}
        </div>
        
        {/* Property Type */}
        <div>
          <label htmlFor="propertyType" className={labelClassName}>
            Property Type
          </label>
          <select
            id="propertyType"
            {...register('propertyType')}
            className={`${inputClassName} ${errors.propertyType ? 'border-red-300' : ''}`}
          >
            <option value="">Select a property type</option>
            {propertyTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.propertyType && (
            <p className={errorClassName}>
              <Info className="h-4 w-4 flex-shrink-0" />
              {errors.propertyType.message as string}
            </p>
          )}
        </div>
        
        {/* Property Details */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Bedrooms */}
            <div>
              <label htmlFor="bedrooms" className={labelClassName}>
                Bedrooms
              </label>
              <input
                type="number"
                id="bedrooms"
                {...register('bedrooms', { valueAsNumber: true })}
                min="0"
                className={`${inputClassName} ${errors.bedrooms ? 'border-red-300' : ''}`}
              />
              {errors.bedrooms && (
                <p className={errorClassName}>
                  <Info className="h-4 w-4 flex-shrink-0" />
                  {errors.bedrooms.message as string}
                </p>
              )}
            </div>
            
            {/* Beds */}
            <div>
              <label htmlFor="beds" className={labelClassName}>
                Beds
              </label>
              <input
                type="number"
                id="beds"
                {...register('beds', { valueAsNumber: true })}
                min="1"
                className={`${inputClassName} ${errors.beds ? 'border-red-300' : ''}`}
              />
              {errors.beds && (
                <p className={errorClassName}>
                  <Info className="h-4 w-4 flex-shrink-0" />
                  {errors.beds.message as string}
                </p>
              )}
            </div>
            
            {/* Bathrooms */}
            <div>
              <label htmlFor="bathrooms" className={labelClassName}>
                Bathrooms
              </label>
              <input
                type="number"
                id="bathrooms"
                {...register('bathrooms', { valueAsNumber: true })}
                min="0"
                step="0.5"
                className={`${inputClassName} ${errors.bathrooms ? 'border-red-300' : ''}`}
              />
              {errors.bathrooms && (
                <p className={errorClassName}>
                  <Info className="h-4 w-4 flex-shrink-0" />
                  {errors.bathrooms.message as string}
                </p>
              )}
            </div>
            
            {/* Max Guests */}
            <div>
              <label htmlFor="maxGuests" className={labelClassName}>
                Maximum Guests
              </label>
              <input
                type="number"
                id="maxGuests"
                {...register('maxGuests', { valueAsNumber: true })}
                min="1"
                className={`${inputClassName} ${errors.maxGuests ? 'border-red-300' : ''}`}
              />
              {errors.maxGuests && (
                <p className={errorClassName}>
                  <Info className="h-4 w-4 flex-shrink-0" />
                  {errors.maxGuests.message as string}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
