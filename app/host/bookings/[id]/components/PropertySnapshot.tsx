'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HomeIcon, UsersIcon } from '@heroicons/react/24/outline';
import { BedIcon } from 'lucide-react';

interface PropertySnapshotProps {
  property: {
    id: string;
    title: string;
    image: string;
    location: {
      address: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    bedrooms: number;
    beds: number;
    bathrooms: number;
    maxGuests: number;
  };
}

export default function PropertySnapshot({ property }: PropertySnapshotProps) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Property Details</h3>
      </div>
      <div className="border-t border-gray-200">
        <div className="relative h-48 w-full">
          {property.image ? (
            <Image
              src={property.image}
              alt={property.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              <HomeIcon className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>
        <div className="px-4 py-5 sm:px-6">
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            {property.title}
          </h4>
          <p className="text-sm text-gray-500 mb-4">
            {property.location.city}, {property.location.state}, {property.location.country}
          </p>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center">
              <BedIcon className="h-5 w-5 mr-1 text-gray-400" />
              <span>{property.bedrooms} {property.bedrooms === 1 ? 'bedroom' : 'bedrooms'}</span>
            </div>
            <div className="flex items-center">
              <BedIcon className="h-5 w-5 mr-1 text-gray-400" />
              <span>{property.beds} {property.beds === 1 ? 'bed' : 'beds'}</span>
            </div>
            <div className="flex items-center">
              <UsersIcon className="h-5 w-5 mr-1 text-gray-400" />
              <span>Up to {property.maxGuests} guests</span>
            </div>
          </div>
          
          <Link
            href={`/host/properties/${property.id}`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View Property
          </Link>
        </div>
      </div>
    </div>
  );
}
