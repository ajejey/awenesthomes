import React from 'react';

export default function ManagedOnboardingLoading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <div className="text-center p-8">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
        <h2 className="mt-4 text-xl font-semibold text-gray-900">Loading managed onboarding...</h2>
        <p className="mt-2 text-gray-600">Please wait while we prepare your managed hosting journey.</p>
      </div>
    </div>
  );
}
