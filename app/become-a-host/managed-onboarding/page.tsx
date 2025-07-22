'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { checkManagedHostStatus, completeManagedOnboarding } from './actions';
import OnboardingForm from './components/OnboardingForm';
import type { ManagedOnboardingFormData } from './actions';

export default function ManagedOnboardingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<{ name?: string; email?: string } | null>(null);
  
  // Check if user is logged in
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await checkManagedHostStatus();
        
        if (!status.isLoggedIn) {
          if (status.redirectTo) {
            router.push(status.redirectTo);
          } else {
            setError('You must be logged in to apply for managed hosting');
          }
          return;
        }
        
        if (status.isManagedHost && status.redirectTo) {
          router.push(status.redirectTo);
          return;
        }
        
        if (status.user) {
          setUserInfo({
            name: status.user.name || '',
            email: status.user.email || ''
          });
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking host status:', error);
        setError('An error occurred while checking your status');
        setIsLoading(false);
      }
    };
    
    checkStatus();
  }, [router]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em]"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <Link 
            href="/become-a-host"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Return to Become a Host
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">AweNestHost-Managed Onboarding</h1>
        <p className="mt-2 text-gray-600">
          Complete this form to apply for our managed hosting service. Our team will review your application and contact you within 24 hours.
        </p>
      </div>
      
      <OnboardingForm 
        onSubmit={async (data) => {
          try {
            const result = await completeManagedOnboarding(data);
            
            if (result.success) {
              // Show success message and redirect
              setSuccessMessage(result.message || 'Your application has been submitted successfully!');
              setTimeout(() => {
                router.push('/host/properties');
              }, 3000);
            } else {
              // Show error message
              setError(result.error || 'Something went wrong. Please try again.');
            }
          } catch (error) {
            console.error('Error submitting form:', error);
            setError('An unexpected error occurred. Please try again.');
          }
        }}
        initialData={{ name: userInfo?.name }}
        userEmail={userInfo?.email}
      />
      
      {/* Success message */}
      {successMessage && (
        <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-md">
          <div className="flex">
            <svg
              className="h-5 w-5 text-green-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="ml-3 text-sm text-green-700">{successMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
