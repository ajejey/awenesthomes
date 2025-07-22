'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { 
  ArrowLeftIcon, 
  ArrowRightIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

// Import step components
import PersonalInfoStep from './PersonalInfoStep';
import PropertyDetailsStep from './PropertyDetailsStep';
import ManagementPreferencesStep from './ManagementPreferencesStep';
import TermsStep from './TermsStep';
import ReviewStep from './ReviewStep';

// Define the schema for the form
const formSchema = z.object({
  // Personal Information
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  alternatePhone: z.string().optional(),
  
  // Property Information
  propertyType: z.enum(['apartment', 'house', 'guesthouse', 'hotel', 'villa', 'cottage', 'bungalow', 'farmhouse', 'treehouse', 'boat', 'other']),
  bedrooms: z.number().int().min(1, 'Property must have at least 1 bedroom'),
  bathrooms: z.number().min(0.5, 'Property must have at least 0.5 bathroom'),
  address: z.string().min(5, 'Please enter a valid address'),
  city: z.string().min(2, 'Please enter a valid city'),
  state: z.string().min(2, 'Please enter a valid state'),
  zipCode: z.string().min(5, 'Please enter a valid zip code'),
  
  // Availability & Management
  availableFromDate: z.string().refine(date => !isNaN(new Date(date).getTime()), 'Please enter a valid date'),
  managementPreference: z.enum(['full_management', 'partial_management']),
  existingBookings: z.boolean(),
  existingBookingDetails: z.string().optional(),
  
  // Additional Information
  specialRequests: z.string().optional(),
  
  // Terms & Conditions
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
  agreeToCommission: z.boolean().refine(val => val === true, {
    message: 'You must agree to the commission structure',
  }),
});

type FormData = z.infer<typeof formSchema>;

// Define the steps in the onboarding process
const steps = [
  { id: 'personal', title: 'Personal Information' },
  { id: 'property', title: 'Property Details' },
  { id: 'management', title: 'Management Preferences' },
  { id: 'terms', title: 'Terms & Conditions' },
  { id: 'review', title: 'Review & Submit' },
];

interface OnboardingFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  initialData?: Partial<FormData>;
  userEmail?: string;
}

export default function OnboardingForm({ onSubmit, initialData, userEmail }: OnboardingFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Initialize form with react-hook-form and zod validation
  const { register, handleSubmit, watch, setValue, formState: { errors, isValid } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      name: initialData?.name || '',
      phone: initialData?.phone || '',
      propertyType: initialData?.propertyType || 'apartment',
      bedrooms: initialData?.bedrooms || 2,
      bathrooms: initialData?.bathrooms || 1,
      existingBookings: initialData?.existingBookings || false,
      agreeToTerms: initialData?.agreeToTerms || false,
      agreeToCommission: initialData?.agreeToCommission || false,
      managementPreference: initialData?.managementPreference || 'full_management',
    }
  });
  
  const watchAllFields = watch();
  
  // Handle form submission
  const handleFormSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await onSubmit(data);
    } catch (error: any) {
      console.error('Error submitting form:', error);
      setSubmitError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle next step
  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };
  
  // Handle previous step
  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Progress steps */}
      <div className="px-4 py-5 sm:px-6 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            {steps[currentStep].title}
          </h3>
          <p className="text-sm text-gray-500">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>
        <div className="mt-4">
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index < currentStep ? 'bg-blue-600 text-white' : 
                  index === currentStep ? 'border-2 border-blue-600 text-blue-600' : 
                  'border-2 border-gray-300 text-gray-400'
                }`}>
                  {index + 1}
                </div>
                <span className="mt-1 text-xs hidden sm:block">{step.title}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-300 ease-in-out" 
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Form content */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep === 0 && (
            <PersonalInfoStep 
              register={register} 
              errors={errors} 
              userEmail={userEmail} 
            />
          )}
          
          {currentStep === 1 && (
            <PropertyDetailsStep 
              register={register} 
              errors={errors} 
              watch={watch}
              setValue={setValue}
            />
          )}
          
          {currentStep === 2 && (
            <ManagementPreferencesStep 
              register={register} 
              errors={errors} 
              watch={watch}
            />
          )}
          
          {currentStep === 3 && (
            <TermsStep 
              register={register} 
              errors={errors} 
            />
          )}
          
          {currentStep === 4 && (
            <ReviewStep 
              watch={watch} 
            />
          )}
        </motion.div>
        
        {/* Navigation buttons */}
        <div className="mt-8 flex justify-between">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={handlePrevious}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Previous
            </button>
          )}
          
          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Next
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
              {!isSubmitting && <CheckCircleIcon className="ml-2 h-4 w-4" />}
            </button>
          )}
        </div>
        
        {/* Error message */}
        {submitError && (
          <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
            <div className="flex">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="ml-3 text-sm text-red-700">{submitError}</p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
