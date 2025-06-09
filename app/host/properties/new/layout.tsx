import React from 'react';
import { Metadata } from 'next';
import { getCurrentUser } from '@/app/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'List Your Property - AweNestHomes',
  description: 'Create a new property listing on AweNestHomes',
};

export default async function CreatePropertyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if user is authenticated and is a host
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/auth/login?callbackUrl=/host/properties/new');
  }
  
  if (user.role !== 'host' && user.role !== 'admin') {
    redirect('/profile?error=only-hosts-can-create-properties');
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-4">
        {children}
      </div>
    </div>
  );
}
