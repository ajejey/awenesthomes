'use client';

import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Amenity } from '@/lib/models/property';
import { 
  WifiIcon, FireIcon, TvIcon, HomeIcon, SparklesIcon, 
  BeakerIcon, SunIcon, ComputerDesktopIcon, CakeIcon,
  BuildingOfficeIcon, CheckBadgeIcon, MusicalNoteIcon,
  BoltIcon, ShieldCheckIcon, HeartIcon
} from '@heroicons/react/24/outline';

// Define amenity categories with their options
const amenityCategories = [
  {
    title: 'Essentials',
    amenities: [
      { value: 'wifi', label: 'WiFi', icon: <WifiIcon className="h-5 w-5" /> },
      { value: 'kitchen', label: 'Kitchen', icon: <HomeIcon className="h-5 w-5" /> },
      { value: 'workspace', label: 'Dedicated workspace', icon: <ComputerDesktopIcon className="h-5 w-5" /> },
      { value: 'ac', label: 'Air conditioning', icon: <SparklesIcon className="h-5 w-5" /> },
      { value: 'heating', label: 'Heating', icon: <FireIcon className="h-5 w-5" /> },
      { value: 'tv', label: 'TV', icon: <TvIcon className="h-5 w-5" /> },
      { value: 'washer', label: 'Washer', icon: <BeakerIcon className="h-5 w-5" /> },
      { value: 'dryer', label: 'Dryer', icon: <SunIcon className="h-5 w-5" /> },
    ],
  },
  {
    title: 'Features',
    amenities: [
      { value: 'pool', label: 'Pool', icon: <HomeIcon className="h-5 w-5" /> },
      { value: 'hot_tub', label: 'Hot tub', icon: <HomeIcon className="h-5 w-5" /> },
      { value: 'parking', label: 'Free parking', icon: <HomeIcon className="h-5 w-5" /> },
      { value: 'gym', label: 'Gym', icon: <HomeIcon className="h-5 w-5" /> },
      { value: 'elevator', label: 'Elevator', icon: <BuildingOfficeIcon className="h-5 w-5" /> },
      { value: 'breakfast', label: 'Breakfast', icon: <CakeIcon className="h-5 w-5" /> },
      { value: 'fireplace', label: 'Outdoor fireplace', icon: <FireIcon className="h-5 w-5" /> },
      { value: 'bbq', label: 'BBQ grill', icon: <HomeIcon className="h-5 w-5" /> },
      { value: 'indoor_fireplace', label: 'Indoor fireplace', icon: <FireIcon className="h-5 w-5" /> },
    ],
  },
  {
    title: 'Rules & Policies',
    amenities: [
      { value: 'smoking_allowed', label: 'Smoking allowed', icon: <HomeIcon className="h-5 w-5" /> },
      { value: 'pets_allowed', label: 'Pets allowed', icon: <HeartIcon className="h-5 w-5" /> },
      { value: 'events_allowed', label: 'Events allowed', icon: <MusicalNoteIcon className="h-5 w-5" /> },
    ],
  },
];

export default function AmenitiesForm() {
  const { register, formState: { errors }, setValue, watch, getValues } = useFormContext();
  
  // Log errors related to houseRules specifically from this component's perspective
  if (errors.houseRules) {
    console.log("AMENITIES_FORM_LOG: Errors for 'houseRules' from formState:", JSON.stringify(errors.houseRules, null, 2));
  }

  // Watch the amenities array to check which ones are selected
  const selectedAmenities = watch('amenities') || [];
  
  // State for house rules
  const [newRule, setNewRule] = useState<string>('');
  const [rules, setRules] = useState<string[]>([]);
  
  // Initialize rules from form data if available
  useEffect(() => {
    const formRules = getValues('houseRules');
    if (formRules && Array.isArray(formRules) && formRules.length > 0) {
      setRules(formRules);
    }
  }, [getValues]);
  
  // Update form value when rules change
  useEffect(() => {
    setValue('houseRules', rules, { shouldValidate: true });
    console.log("AMENITIES_FORM_LOG: houseRules updated in form state via setValue. Current local 'rules':", rules);
    // It might be slightly delayed for getValues to reflect immediately after setValue depending on react-hook-form's update cycle,
    // but let's log it to see.
    console.log("AMENITIES_FORM_LOG: getValues('houseRules') after update:", getValues('houseRules'));
  }, [rules, setValue, getValues]); // Added getValues to dependency array
  
  // Add a new rule
  const addRule = () => {
    if (newRule.trim()) {
      setRules([...rules, newRule.trim()]);
      setNewRule('');
    }
  };
  
  // Remove a rule
  const removeRule = (index: number) => {
    const updatedRules = [...rules];
    updatedRules.splice(index, 1);
    setRules(updatedRules);
  };

  // Handle checkbox change
  const handleAmenityChange = (amenity: Amenity, isChecked: boolean) => {
    const currentAmenities = [...selectedAmenities];
    
    if (isChecked) {
      // Add the amenity if it's not already selected
      if (!currentAmenities.includes(amenity)) {
        currentAmenities.push(amenity);
      }
    } else {
      // Remove the amenity
      const index = currentAmenities.indexOf(amenity);
      if (index !== -1) {
        currentAmenities.splice(index, 1);
      }
    }
    
    setValue('amenities', currentAmenities, { shouldValidate: true });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Amenities</h3>
        <p className="mt-1 text-sm text-gray-500">
          Select all the amenities available at your property. Accurate amenities help set guest expectations.
        </p>
      </div>
      
      {/* Form Validation Error */}
      {errors.amenities && (
        <p className="mt-2 text-sm text-red-600">{errors.amenities.message as string}</p>
      )}
      
      {/* Amenities Selection */}
      <div className="space-y-8">
        {amenityCategories.map((category) => (
          <div key={category.title} className="space-y-3">
            <h4 className="text-md font-medium text-gray-900">{category.title}</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {category.amenities.map((amenity) => (
                <div 
                  key={amenity.value} 
                  className={`relative flex items-center p-3 rounded-lg border transition-all ${
                    selectedAmenities.includes(amenity.value) 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    id={`amenity-${amenity.value}`}
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity.value)}
                    onChange={(e) => handleAmenityChange(amenity.value as Amenity, e.target.checked)}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label 
                    htmlFor={`amenity-${amenity.value}`} 
                    className="flex items-center ml-3 cursor-pointer w-full"
                  >
                    <span className="text-gray-500 mr-2">
                      {amenity.icon}
                    </span>
                    <span className="font-medium text-gray-700">{amenity.label}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* House Rules */}
      <div className="mt-6 border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">House Rules</h3>
        <p className="mt-1 text-sm text-gray-500">
          Let guests know about any specific rules for your property. Add each rule separately.
        </p>
        <div className="mt-2">
          <div className="flex space-x-2">
            <input
              type="text"
              id="newRule"
              className="block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Example: No smoking indoors"
              value={newRule}
              onChange={(e) => setNewRule(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addRule();
                }
              }}
            />
            <button
              type="button"
              onClick={addRule}
              disabled={!newRule.trim()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
          
          {rules.length > 0 && (
            <div className="mt-3">
              <h4 className="text-sm font-medium text-gray-700">Current Rules:</h4>
              <ul className="mt-2 space-y-2">
                {rules.map((rule, index) => (
                  <li key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                    <span className="text-sm text-gray-700">{rule}</span>
                    <button
                      type="button"
                      onClick={() => removeRule(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* We don't need a hidden input since we're updating the form value directly via setValue */}
        </div>
      </div>
      
      {/* Instant Booking Option */}
      <div className="mt-6 border-t border-gray-200 pt-6">
        <div className="relative flex items-start">
          <div className="flex items-center h-5">
            <input
              id="instantBooking"
              type="checkbox"
              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              {...register('instantBooking')}
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="instantBooking" className="font-medium text-gray-700">
              Enable Instant Booking
            </label>
            <p className="text-gray-500">
              Allow guests to book instantly without requiring your approval for each booking.
              This can increase your bookings but gives you less control over who stays.
            </p>
          </div>
        </div>
      </div>
      
      {/* Tips Section */}
      <div className="mt-6 bg-blue-50 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <CheckBadgeIcon className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Amenities Tip</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Properties with more amenities typically receive more bookings. Be sure to highlight special features
                that make your property unique, but only select amenities that are actually available to guests.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
