import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/app/auth';
import HostHeader from '../components/HostHeader';

export default async function HostBookingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if user is authenticated and is a host
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/auth/login?callbackUrl=/host/bookings');
  }
  
  if (user.role !== 'host' && user.role !== 'admin') {
    redirect('/');
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <HostHeader />
      {children}
    </div>
  );
}
