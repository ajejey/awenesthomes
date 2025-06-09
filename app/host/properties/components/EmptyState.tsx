import React from 'react';
import Link from 'next/link';
import { HomeIcon } from '@heroicons/react/24/outline';

export default function EmptyState() {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 text-center">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
        <HomeIcon className="h-8 w-8 text-blue-600" aria-hidden="true" />
      </div>
      
      <h3 className="mt-6 text-lg font-medium text-gray-900">No properties yet</h3>
      
      <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
        You haven't created any property listings yet. Start by adding your first property to begin hosting on AweNestHomes.
      </p>
      
      <div className="mt-6">
        <Link
          href="/host/properties/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Create Your First Property
        </Link>
      </div>
      
      <div className="mt-8 border-t border-gray-200 pt-6">
        <h4 className="text-sm font-medium text-gray-900">Why host on AweNestHomes?</h4>
        
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="bg-gray-50 p-4 rounded-md">
            <h5 className="text-sm font-medium text-gray-900">Earn Extra Income</h5>
            <p className="mt-1 text-xs text-gray-500">Turn your extra space into income with competitive pricing.</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <h5 className="text-sm font-medium text-gray-900">Simple & Secure</h5>
            <p className="mt-1 text-xs text-gray-500">Our platform makes it easy to list and manage your properties safely.</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <h5 className="text-sm font-medium text-gray-900">24/7 Support</h5>
            <p className="mt-1 text-xs text-gray-500">Get help whenever you need it with our dedicated host support.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
