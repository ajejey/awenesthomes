import React from 'react';
import Header from '@/app/components/Header';

export default function PropertyDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        <Header />
        {children}
      </main>
    </div>
  );
}
