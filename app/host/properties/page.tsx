import React from 'react';
import Link from 'next/link';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { getHostProperties } from './actions';
import PropertyCard from './components/PropertyCard';
import EmptyState from './components/EmptyState';
import FilterBar from './components/FilterBar';

export const metadata = {
  title: 'Manage Your Properties | AweNestHomes',
  description: 'View and manage your property listings on AweNestHomes',
};

export default async function HostPropertiesPage() {
  const { properties, totalCount } = await getHostProperties();
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Properties</h1>
          <p className="mt-1 text-sm text-gray-500">
            {totalCount > 0 
              ? `You have ${totalCount} ${totalCount === 1 ? 'property' : 'properties'} listed`
              : 'Start creating your first property listing'}
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link 
            href="/host/properties/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusCircleIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add New Property
          </Link>
        </div>
      </div>
      
      {/* Filter bar */}
      <FilterBar />
      
      {/* Property listings */}
      {properties.length > 0 ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property: any) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
