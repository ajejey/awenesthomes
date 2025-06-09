import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Become a Host - Awenest Homes',
  description: 'Share your space and earn extra income by becoming a host on Awenest Homes.',
};

export default function BecomeAHostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
