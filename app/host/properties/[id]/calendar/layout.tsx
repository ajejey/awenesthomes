import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/app/auth';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default async function CalendarLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  // Check if user is authenticated and is a host
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/auth/login?callbackUrl=/host/properties');
  }
  
  if (user.role !== 'host' && user.role !== 'admin') {
    redirect('/');
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link
          href={`/host/properties`}
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Properties
        </Link>
      </div>
      
      {/* Main content */}
      <main>{children}</main>
    </div>
  );
}
