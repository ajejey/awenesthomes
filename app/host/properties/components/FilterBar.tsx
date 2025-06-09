'use client';

import React, { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MagnifyingGlassIcon, FunnelIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  // Get current filter values from URL
  const currentStatus = searchParams.get('status') || 'all';
  const currentSort = searchParams.get('sortBy') || 'newest';
  const currentSearch = searchParams.get('search') || '';
  
  // Local state for search input
  const [searchQuery, setSearchQuery] = useState(currentSearch);
  
  // Apply filters
  const applyFilters = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Update or delete params
    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== 'all' && !(key === 'sortBy' && value === 'newest')) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    // Update URL without full page refresh
    startTransition(() => {
      router.push(`/host/properties?${params.toString()}`);
    });
  };
  
  // Handle status change
  const handleStatusChange = (status: string) => {
    applyFilters({ status });
  };
  
  // Handle sort change
  const handleSortChange = (sortBy: string) => {
    applyFilters({ sortBy });
  };
  
  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters({ search: searchQuery });
  };
  
  // Handle search clear
  const handleSearchClear = () => {
    setSearchQuery('');
    applyFilters({ search: '' });
  };
  
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Search */}
        <div className="flex-1">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, city, or state"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleSearchClear}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Clear search</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </form>
        </div>
        
        {/* Status filter */}
        <div className="flex items-center">
          <div className="flex items-center text-gray-500 mr-2">
            <FunnelIcon className="h-5 w-5 mr-1" />
            <span className="text-sm">Status:</span>
          </div>
          <select
            value={currentStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="all">All</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        
        {/* Sort options */}
        <div className="flex items-center">
          <div className="flex items-center text-gray-500 mr-2">
            <ArrowsUpDownIcon className="h-5 w-5 mr-1" />
            <span className="text-sm">Sort:</span>
          </div>
          <select
            value={currentSort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-high">Price: High to Low</option>
            <option value="price-low">Price: Low to High</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>
      </div>
      
      {/* Active filters */}
      {(currentStatus !== 'all' || currentSort !== 'newest' || currentSearch) && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500">Active filters:</span>
          
          {currentStatus !== 'all' && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Status: {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
              <button
                type="button"
                onClick={() => handleStatusChange('all')}
                className="ml-1 text-blue-500 hover:text-blue-700"
              >
                &times;
              </button>
            </span>
          )}
          
          {currentSort !== 'newest' && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Sort: {currentSort.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              <button
                type="button"
                onClick={() => handleSortChange('newest')}
                className="ml-1 text-blue-500 hover:text-blue-700"
              >
                &times;
              </button>
            </span>
          )}
          
          {currentSearch && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Search: {currentSearch}
              <button
                type="button"
                onClick={handleSearchClear}
                className="ml-1 text-blue-500 hover:text-blue-700"
              >
                &times;
              </button>
            </span>
          )}
          
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              router.push('/host/properties');
            }}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Clear all filters
          </button>
        </div>
      )}
      
      {/* Loading indicator */}
      {isPending && (
        <div className="mt-2 flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-sm text-gray-500">Updating results...</span>
        </div>
      )}
    </div>
  );
}
