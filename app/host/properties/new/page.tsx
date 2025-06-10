'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PropertyType, Amenity } from '@/lib/models/property';
import BasicInfoForm from '../components/BasicInfoForm';
import LocationForm from '../components/LocationForm';
import ImagesForm from '../components/ImagesForm';
import AmenitiesForm from '../components/AmenitiesForm';
import PricingForm from '../components/PricingForm';
import AvailabilityForm from '../components/AvailabilityForm';
import ReviewForm from '../components/ReviewForm';
import { createProperty } from './actions';

// Define the steps in the property creation process
const steps = [
  { id: 'basic-info', title: 'Basic Information' },
  { id: 'location', title: 'Location' },
  { id: 'images', title: 'Photos' },
  { id: 'amenities', title: 'Amenities' },
  { id: 'pricing', title: 'Pricing' },
  { id: 'availability', title: 'Availability' },
  { id: 'review', title: 'Review & Submit' },
];

// Define the form schema using Zod
const propertyFormSchema = z.object({
  // Basic Information
  title: z.string().min(10, 'Title must be at least 10 characters').max(100, 'Title cannot exceed 100 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters').max(2000, 'Description cannot exceed 2000 characters'),
  propertyType: z.enum(['apartment', 'house', 'guesthouse', 'hotel', 'villa', 'cottage', 'bungalow', 'farmhouse', 'treehouse', 'boat', 'other'] as [PropertyType, ...PropertyType[]]),
  bedrooms: z.number().min(0, 'Bedrooms cannot be negative'),
  beds: z.number().min(1, 'Property must have at least 1 bed'),
  bathrooms: z.number().min(0, 'Bathrooms cannot be negative'),
  maxGuests: z.number().min(1, 'Property must accommodate at least 1 guest'),
  
  // Location
  location: z.object({
    address: z.string().min(5, 'Address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    zipCode: z.string().min(5, 'Zip code is required'),
    country: z.string().default('India'),
    coordinates: z.object({
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    }).optional(),
  }),
  
  // Images
  images: z.array(
    z.object({
      url: z.string().url('Please provide a valid URL'),
      caption: z.string().optional(),
      isPrimary: z.boolean().default(false),
    })
  ).min(1, 'At least one image is required'),
  
  // Amenities
  amenities: z.array(
    z.enum(['wifi', 'kitchen', 'ac', 'heating', 'tv', 'washer', 'dryer', 'parking', 'elevator', 'pool', 'hot_tub', 'gym', 'breakfast', 'workspace', 'fireplace', 'bbq', 'indoor_fireplace', 'smoking_allowed', 'pets_allowed', 'events_allowed'] as [Amenity, ...Amenity[]])
  ),
  
  // Pricing
  pricing: z.object({
    basePrice: z.number().min(100, 'Base price must be at least ₹100'),
    cleaningFee: z.number().min(0, 'Cleaning fee cannot be negative').default(0),
    serviceFee: z.number().min(0, 'Service fee cannot be negative').default(0),
    taxRate: z.number().min(0, 'Tax rate cannot be negative').max(100, 'Tax rate cannot exceed 100%').default(18),
    minimumStay: z.number().min(1, 'Minimum stay must be at least 1 night').default(1),
    maximumStay: z.number().min(1, 'Maximum stay must be at least 1 night').default(1).optional(),
    discounts: z.object({
      weekly: z.number().min(0, 'Weekly discount cannot be negative').max(100, 'Weekly discount cannot exceed 100%').default(1).optional(),
      monthly: z.number().min(0, 'Monthly discount cannot be negative').max(100, 'Monthly discount cannot exceed 100%').default(1).optional(),
    }).optional(),
  }),
  
  // Availability
  availability: z.array(
    z.object({
      startDate: z.date(),
      endDate: z.date(),
    })
  ).min(1, 'At least one availability range is required'),
  
  // House Rules
  houseRules: z.array(z.string()).optional(),
  
  // Instant Booking
  instantBooking: z.boolean().default(false),
  
  // Status
  status: z.enum(['draft', 'published']).default('draft'),
});

// Define the form data type based on the schema
type PropertyFormData = z.infer<typeof propertyFormSchema>;

export default function CreatePropertyPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  // Initialize the form with react-hook-form and zod validation
  const methods = useForm<PropertyFormData>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      title: '',
      description: '',
      propertyType: 'apartment',
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
      maxGuests: 2,
      location: {
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
      },
      images: [],
      amenities: [],
      pricing: {
        basePrice: 1000,
        cleaningFee: 0,
        serviceFee: 0,
        taxRate: 18,
        minimumStay: 1,
        discounts: {
          weekly: 0,
          monthly: 0
        },
        maximumStay: 30,
      },
      availability: [{
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
      }],
      houseRules: [],
      instantBooking: false,
      status: 'draft',
    },
    mode: 'onChange',
  });
  
  // Get form state from react-hook-form
  const { handleSubmit, formState: { errors, isValid } } = methods;
  
  // Handle next step
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  console.log("errors", errors);
  console.log("isValid", isValid);
  
  
  // Handle form submission
  const onSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const result = await createProperty(data);
      console.log("created property ", result)
      if (result.success) {
        // router.push(`/host/properties/${result.propertyId}`);
      } else {
        setError(result.error || 'Failed to create property. Please try again.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error creating property:', error);
      setError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };
  
  // Render the current step form
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfoForm />;
      case 1:
        return <LocationForm />;
      case 2:
        return <ImagesForm />;
      case 3:
        return <AmenitiesForm />;
      case 4:
        return <PricingForm />;
      case 5:
        return <AvailabilityForm />;
      case 6:
        return <ReviewForm />;
      default:
        return <BasicInfoForm />;
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">List Your Property</h1>
      
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {steps.map((step, index) => (
            <div 
              key={step.id}
              className={`flex flex-col items-center ${index <= currentStep ? 'text-blue-600' : 'text-gray-400'}`}
            >
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                  index < currentStep 
                    ? 'bg-blue-600 text-white' 
                    : index === currentStep 
                      ? 'border-2 border-blue-600 text-blue-600' 
                      : 'border-2 border-gray-300 text-gray-400'
                }`}
              >
                {index < currentStep ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span className="text-xs hidden sm:block">{step.title}</span>
            </div>
          ))}
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="h-1 w-full bg-gray-200 rounded"></div>
          </div>
          <div className="relative flex justify-between">
            {steps.map((_, index) => (
              <div 
                key={index}
                className={`w-6 h-6 ${index <= currentStep ? 'bg-blue-600' : 'bg-gray-200'} rounded-full`}
              ></div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Form */}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} onKeyDown={(e) => {
            // Prevent form submission on Enter key press
            if (e.key === 'Enter') {
              e.preventDefault();
            }
          }}
        >
          {/* Step title */}
          <h2 className="text-xl font-semibold mb-4">{steps[currentStep].title}</h2>
          
          {/* Step content */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            {renderStepContent()}
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
          
          {/* Navigation buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`px-4 py-2 rounded-md ${
                currentStep === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            
            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || !isValid}
                className={`px-4 py-2 rounded-md ${
                  isSubmitting || !isValid
                    ? 'bg-blue-300 text-white cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </div>
                ) : (
                  'Submit Property'
                )}
              </button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
