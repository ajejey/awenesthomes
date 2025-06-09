'use client';

import React from 'react';
import { UserIcon } from '@heroicons/react/24/outline';

interface GuestInfoProps {
  guest: {
    id: string;
    name: string;
    email: string;
  };
}

export default function GuestInfo({ guest }: GuestInfoProps) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Guest Information</h3>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
            <UserIcon className="h-8 w-8 text-gray-500" />
          </div>
          <div className="ml-4">
            <h4 className="text-lg font-medium text-gray-900">
              {guest.name || 'Guest'}
            </h4>
          </div>
        </div>
        
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {guest.email || 'Email not provided'}
            </dd>
          </div>
        </dl>
        
        <div className="mt-6">
          <a
            href={`mailto:${guest.email}`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Contact Guest
          </a>
        </div>
      </div>
    </div>
  );
}
