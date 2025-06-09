'use client';

import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import Image from 'next/image';
import { Info, MapPin } from 'lucide-react';

// Indian states for dropdown
const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

// Define the type for our location form data
type LocationFormValues = {
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
};

// Reusable form input classes
const inputClassName = `block w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm 
  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
  focus:border-transparent transition duration-150 ease-in-out text-gray-900 
  disabled:bg-gray-50 disabled:text-gray-500`;

const labelClassName = 'block text-sm font-medium text-gray-700 mb-1';
const errorClassName = 'mt-1 text-sm text-red-500 flex items-center gap-1';
const helperTextClassName = 'mt-1 text-sm text-gray-500 flex items-start gap-2';

export default function LocationForm() {
  const { register, formState: { errors }, setValue, watch } = useFormContext<LocationFormValues>();
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Watch location fields for validation
  const address = watch('location.address');
  const city = watch('location.city');
  const state = watch('location.state');
  const zipCode = watch('location.zipCode');
  
  // Function to handle map marker placement (placeholder for actual implementation)
  const handleMapClick = (e: React.MouseEvent) => {
    // In a real implementation, this would get coordinates from a map API
    // For now, we'll just set some dummy coordinates
    setValue('location.coordinates.latitude', 28.6139);
    setValue('location.coordinates.longitude', 77.2090);
  };
  
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-gray-900">Property Location</h2>
        <p className="text-sm text-gray-600">
          Help guests find your property by providing accurate location details.
        </p>
      </div>

      <div className="space-y-6">
        {/* Address */}
        <div>
          <label htmlFor="address" className={labelClassName}>
            Street Address
          </label>
          <input
            type="text"
            id="address"
            {...register('location.address')}
            className={`${inputClassName} ${errors.location?.address ? 'border-red-300' : ''}`}
            placeholder="e.g., 123 Beach Road, Colva"
          />
          {errors.location?.address ? (
            <p className={errorClassName}>
              <Info className="h-4 w-4 flex-shrink-0" />
              {errors.location.address.message?.toString() || 'Address is required'}
            </p>
          ) : (
            <p className={helperTextClassName}>
              <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
              Include the street name, building number, and any relevant landmarks
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* City */}
          <div>
            <label htmlFor="city" className={labelClassName}>
              City
            </label>
            <input
              type="text"
              id="city"
              {...register('location.city')}
              className={`${inputClassName} ${errors.location?.city ? 'border-red-300' : ''}`}
              placeholder="e.g., Mumbai"
            />
            {errors.location?.city && (
              <p className={errorClassName}>
                <Info className="h-4 w-4 flex-shrink-0" />
                {errors.location.city.message?.toString() || 'City is required'}
              </p>
            )}
          </div>
          
          {/* State */}
          <div>
            <label htmlFor="state" className={labelClassName}>
              State
            </label>
            <select
              id="state"
              {...register('location.state')}
              className={`${inputClassName} ${errors.location?.state ? 'border-red-300' : ''}`}
              defaultValue=""
            >
              <option value="" disabled>Select a state</option>
              {indianStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            {errors.location?.state && (
              <p className={errorClassName}>
                <Info className="h-4 w-4 flex-shrink-0" />
                {errors.location.state.message?.toString() || 'State is required'}
              </p>
            )}
          </div>
          
          {/* Zip Code */}
          <div>
            <label htmlFor="zipCode" className={labelClassName}>
              PIN Code
            </label>
            <input
              type="text"
              id="zipCode"
              {...register('location.zipCode')}
              className={`${inputClassName} ${errors.location?.zipCode ? 'border-red-300' : ''}`}
              placeholder="e.g., 400001"
            />
            {errors.location?.zipCode && (
              <p className={errorClassName}>
                <Info className="h-4 w-4 flex-shrink-0" />
                {errors.location.zipCode.message?.toString() || 'PIN code is required'}
              </p>
            )}
          </div>
          
          {/* Country (fixed to India) */}
          <div>
            <label htmlFor="country" className={labelClassName}>
              Country
            </label>
            <input
              type="text"
              id="country"
              {...register('location.country')}
              className={`${inputClassName} bg-gray-50`}
              value="India"
              disabled
            />
          </div>
        </div>
        
        {/* Map Section */}
        <div className="pt-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900">Pin Your Location</h3>
          </div>
          
          <div 
            className="relative h-64 w-full bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 overflow-hidden
                     hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
            onClick={handleMapClick}
          >
            {/* Placeholder for actual map implementation */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <div className="bg-blue-100 p-3 rounded-full mb-3">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-1">Click to set your location</h4>
              <p className="text-sm text-gray-500 max-w-md">
                Pin your exact location on the map. This helps guests find your property more easily.
              </p>
              <p className="text-xs text-gray-400 mt-3">
                Note: Exact address is only shared after booking
              </p>
            </div>
            
            {/* Sample map image (placeholder) */}
            <div className="absolute inset-0 opacity-10">
              <Image 
                src="/images/map-placeholder.jpg" 
                alt="Map placeholder"
                fill
                style={{ objectFit: 'cover' }}
                onLoad={() => setMapLoaded(true)}
                onError={() => setMapLoaded(true)}
                priority
              />
            </div>
          </div>
          
          {/* Location Accuracy Notice */}
          <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  For privacy and security reasons, the exact location will not be shared with guests until after booking. 
                  Guests will see an approximate location on the map before booking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
