'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { completeHostOnboarding, checkHostStatus } from './actions';
import { OnboardingFormData } from './actions';

// Define the steps in the onboarding process
const steps = [
  { id: 'intro', title: 'Welcome' },
  { id: 'about-you', title: 'About You' },
  { id: 'property-type', title: 'Property Type' },
  { id: 'hosting-frequency', title: 'Hosting Frequency' },
  { id: 'requirements', title: 'Requirements' },
  { id: 'complete', title: 'Complete' },
];

// Define the form schema using Zod
const onboardingSchema = z.object({
  // About You
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  
  // Property Type
  propertyType: z.enum(['apartment', 'house', 'guesthouse', 'hotel', 'villa', 'cottage', 'bungalow', 'farmhouse', 'treehouse', 'boat', 'other']),
  roomType: z.enum(['entire_place', 'private_room', 'shared_room']),
  
  // Hosting Frequency
  hostingFrequency: z.enum(['full_time', 'part_time', 'occasionally']),
  
  // Requirements
  agreeToRequirements: z.boolean().refine(val => val === true, {
    message: 'You must agree to the hosting requirements',
  }),
});

// We're using the type from actions.ts

export default function HostOnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<{ name?: string; email?: string } | null>(null);
  
  // Check if user is logged in and not already a host
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await checkHostStatus();
        
        if (!status.isLoggedIn) {
          if (status.redirectTo) {
            router.push(status.redirectTo);
          } else {
            setError('You must be logged in to become a host');
          }
          return;
        }
        
        if (status.isHost && status.redirectTo) {
          router.push(status.redirectTo);
          return;
        }
        
        if (status.user) {
          setUserInfo({
            name: status.user.name || '',
            email: status.user.email || ''
          });
        }
      } catch (error) {
        console.error('Error checking host status:', error);
        setError('An error occurred while checking your status');
      }
    };
    
    checkStatus();
  }, [router]);
  
  // Initialize form with react-hook-form and zod validation
  const methods = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    mode: 'onChange',
    defaultValues: {
      agreeToRequirements: false,
    }
  });
  
  const { handleSubmit, watch, formState: { errors, isValid } } = methods;
  
  // Handle form submission
  const onSubmit: React.FormEventHandler<HTMLFormElement> = handleSubmit(async (data) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Call the server action to complete the onboarding process
      const result = await completeHostOnboarding(data);
      
      if (result.success) {
        // Redirect to the host dashboard
        router.push('/host/properties');
      } else {
        setError(result.error || 'Something went wrong. Please try again.');
      }
    } catch (err: any) {
      console.error('Error during onboarding:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  });
  
  // Handle next step
  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };
  
  // Handle previous step
  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };
  // Render the current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Intro
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Awenest Homes Hosting</h2>
            <p className="text-gray-600 mb-8">
              We're excited to help you become a host. This quick onboarding process will help us understand your hosting needs and get you set up.
            </p>
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Let's Get Started <ArrowRightIcon className="ml-2 h-5 w-5" />
            </button>
          </div>
        );
      
      case 1: // About You
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tell us about yourself</h2>
            <p className="text-gray-600 mb-6">
              We'd like to know a bit more about you to personalize your hosting experience.
            </p>
            
            {userInfo && (
              <div className="bg-blue-50 p-4 rounded-md mb-6">
                <p className="text-sm text-blue-700">
                  You're signed in as <strong>{userInfo.name}</strong> ({userInfo.email}).
                </p>
              </div>
            )}
            
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="name"
                    {...methods.register('name')}
                    className="shadow-sm focus:ring-blue-500 p-2 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Your full name"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="mt-1">
                  <input
                    type="tel"
                    id="phone"
                    {...methods.register('phone')}
                    className="shadow-sm focus:ring-blue-500 p-2 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Your phone number"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>
            </div>
          </div>
        );
      
      case 2: // Property Type
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What type of place will you host?</h2>
            <p className="text-gray-600 mb-6">
              This helps us understand what kind of property you'll be listing.
            </p>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">
                  Property Type
                </label>
                <div className="mt-1">
                  <select
                    id="propertyType"
                    {...methods.register('propertyType')}
                    className="shadow-sm focus:ring-blue-500 p-2 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">Select a property type</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="guesthouse">Guesthouse</option>
                    <option value="hotel">Hotel</option>
                    <option value="villa">Villa</option>
                    <option value="cottage">Cottage</option>
                    <option value="bungalow">Bungalow</option>
                    <option value="farmhouse">Farmhouse</option>
                    <option value="treehouse">Treehouse</option>
                    <option value="boat">Boat</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                {errors.propertyType && (
                  <p className="mt-1 text-sm text-red-600">{errors.propertyType.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="roomType" className="block text-sm font-medium text-gray-700">
                  Room Type
                </label>
                <div className="mt-1">
                  <select
                    id="roomType"
                    {...methods.register('roomType')}
                    className="shadow-sm focus:ring-blue-500 p-2 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">Select a room type</option>
                    <option value="entire_place">Entire place</option>
                    <option value="private_room">Private room</option>
                    <option value="shared_room">Shared room</option>
                  </select>
                </div>
                {errors.roomType && (
                  <p className="mt-1 text-sm text-red-600">{errors.roomType.message}</p>
                )}
              </div>
            </div>
          </div>
        );
      
      case 3: // Hosting Frequency
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How often do you plan to host?</h2>
            <p className="text-gray-600 mb-6">
              This helps us provide you with the right resources and support.
            </p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Hosting Frequency
                </label>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="full_time"
                      type="radio"
                      value="full_time"
                      {...methods.register('hostingFrequency')}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <label htmlFor="full_time" className="ml-3 block text-sm font-medium text-gray-700">
                      Full-time (Most days of the month)
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="part_time"
                      type="radio"
                      value="part_time"
                      {...methods.register('hostingFrequency')}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <label htmlFor="part_time" className="ml-3 block text-sm font-medium text-gray-700">
                      Part-time (A few days each week)
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="occasionally"
                      type="radio"
                      value="occasionally"
                      {...methods.register('hostingFrequency')}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <label htmlFor="occasionally" className="ml-3 block text-sm font-medium text-gray-700">
                      Occasionally (A few days each month)
                    </label>
                  </div>
                </div>
                
                {errors.hostingFrequency && (
                  <p className="mt-1 text-sm text-red-600">{errors.hostingFrequency.message}</p>
                )}
              </div>
            </div>
          </div>
        );
      
      case 4: // Requirements
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Hosting Requirements</h2>
            <p className="text-gray-600 mb-6">
              Before you can start hosting, please review and agree to our hosting requirements.
            </p>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">As an Awenest Homes host, you agree to:</h3>
              
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Respond to booking requests and inquiries within 24 hours</li>
                <li>Accept booking requests when your calendar shows availability</li>
                <li>Avoid cancelling confirmed bookings</li>
                <li>Maintain a clean and safe space for guests</li>
                <li>Provide essential amenities (clean linens, toilet paper, soap, etc.)</li>
                <li>Ensure accurate listing details and photos</li>
                <li>Follow all local laws and regulations regarding short-term rentals</li>
                <li>Maintain a minimum 4.0 rating to remain active on the platform</li>
              </ul>
            </div>
            
            <div className="flex items-start mb-6">
              <div className="flex items-center h-5">
                <input
                  id="agreeToRequirements"
                  type="checkbox"
                  {...methods.register('agreeToRequirements')}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreeToRequirements" className="font-medium text-gray-700">
                  I agree to the hosting requirements
                </label>
                <p className="text-gray-500">
                  By checking this box, you confirm that you understand and agree to follow these requirements.
                </p>
              </div>
            </div>
            
            {errors.agreeToRequirements && (
              <p className="mt-1 text-sm text-red-600">{errors.agreeToRequirements.message}</p>
            )}
          </div>
        );
      
      case 5: // Complete
        return (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">You're ready to become a host!</h2>
            <p className="text-gray-600 mb-8">
              Congratulations! You've completed the initial onboarding process. Click the button below to set up your first property listing.
            </p>
            
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : 'Create Your First Listing'}
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress steps */}
        <div className="mb-8">
          <div className="hidden sm:block">
            <nav className="flex items-center justify-center" aria-label="Progress">
              <ol className="flex items-center">
                {steps.map((step, index) => (
                  <li key={step.id} className="relative pr-8 sm:pr-20">
                    {index < steps.length - 1 ? (
                      <>
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                          <div className={`h-0.5 w-full ${index < currentStep ? 'bg-blue-600' : 'bg-gray-200'}`} />
                        </div>
                      </>
                    ) : null}
                    
                    <div
                      className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                        index < currentStep
                          ? 'bg-blue-600'
                          : index === currentStep
                          ? 'border-2 border-blue-600 bg-white'
                          : 'border-2 border-gray-300 bg-white'
                      }`}
                    >
                      {index < currentStep ? (
                        <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path
                            fillRule="evenodd"
                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <span
                          className={`text-sm font-medium ${
                            index === currentStep ? 'text-blue-600' : 'text-gray-500'
                          }`}
                        >
                          {index + 1}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>
        
        {/* Form */}
        <FormProvider {...methods}>
          <form onSubmit={onSubmit} className="bg-white shadow-md rounded-lg overflow-hidden">
            {/* Step content */}
            <div className="p-6 sm:p-8">
              {renderStepContent()}
            </div>
            
            {/* Error message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mx-6 sm:mx-8 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Navigation buttons */}
            {currentStep > 0 && currentStep < steps.length - 1 && (
              <div className="px-6 sm:px-8 py-4 bg-gray-50 flex justify-between">
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <ArrowLeftIcon className="mr-2 h-4 w-4" />
                  Back
                </button>
                
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Next
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </button>
              </div>
            )}
          </form>
        </FormProvider>
        
        {/* Cancel link */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Cancel and return to home
          </Link>
        </div>
      </div>
    </div>
  );
}
