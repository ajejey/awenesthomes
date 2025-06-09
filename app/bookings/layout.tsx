import { ReactNode } from 'react';
import { Metadata } from 'next';
import Header from '../components/Header';

export const metadata: Metadata = {
  title: 'Bookings | AweNestHomes',
  description: 'Manage your bookings on AweNestHomes',
};

export default function BookingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {children}
    </div>
  );
}
