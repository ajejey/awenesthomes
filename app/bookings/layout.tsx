import { ReactNode } from 'react';
import { Metadata } from 'next';
import { requireAuth } from '@/app/auth';
import Header from '../components/Header';

export const metadata: Metadata = {
  title: 'Bookings | AweNestHomes',
  description: 'Manage your bookings on AweNestHomes',
  robots: { index: false, follow: false },
};

export default async function BookingsLayout({ children }: { children: ReactNode }) {
  await requireAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {children}
    </div>
  );
}
