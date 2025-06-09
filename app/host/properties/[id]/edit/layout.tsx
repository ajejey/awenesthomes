import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/app/auth';

export default async function EditPropertyLayout({
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
      {/* Main content */}
      <main>{children}</main>
    </div>
  );
}
