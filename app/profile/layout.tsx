import React from 'react';
import { requireAuth } from '@/app/auth';
import Header from '@/app/components/Header';

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verify authentication on the server side
  await requireAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Profile
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Manage your personal information and preferences
              </p>
            </div>
            
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
