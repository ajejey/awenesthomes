'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon, 
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { updatePropertyStatus, deleteProperty } from '../actions';

// Status badge colors
const statusColors = {
  published: 'bg-green-100 text-green-800',
  draft: 'bg-yellow-100 text-yellow-800',
  archived: 'bg-gray-100 text-gray-800',
};

export default function PropertyCard({ property }: { property: any }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showActions, setShowActions] = useState(false);
  
  // Get primary image or first image
  const primaryImage = property.images.find((img: any) => img.isPrimary) || property.images[0];
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Handle status update
  const handleStatusUpdate = async (newStatus: 'published' | 'draft' | 'archived') => {
    try {
      setIsUpdatingStatus(true);
      await updatePropertyStatus(property._id, newStatus);
      router.refresh();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update property status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };
  
  // Handle property deletion
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return;
    }
    
    try {
      setIsDeleting(true);
      await deleteProperty(property._id);
      router.refresh();
    } catch (error) {
      console.error('Failed to delete property:', error);
      alert('Failed to delete property');
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Property image */}
      <div className="relative h-48 w-full">
        <Image
          src={primaryImage?.url || '/images/property-placeholder.jpg'}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
        
        {/* Status badge */}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[property.status as keyof typeof statusColors]}`}>
            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
          </span>
        </div>
      </div>
      
      {/* Property details */}
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 truncate">{property.title}</h3>
        
        <div className="mt-1 text-sm text-gray-500">
          {property.location.city}, {property.location.state}
        </div>
        
        <div className="mt-2 flex items-center justify-between">
          <div className="text-lg font-semibold text-gray-900">
            {formatCurrency(property.pricing.basePrice)}
            <span className="text-sm font-normal text-gray-500"> / night</span>
          </div>
          
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <span>{property.bedrooms} BD</span>
            <span>•</span>
            <span>{property.bathrooms} BA</span>
            <span>•</span>
            <span>{property.maxGuests} Guests</span>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className={`mt-4 flex items-center justify-between transition-opacity duration-300 ${showActions ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex space-x-2">
            <Link
              href={`/host/properties/${property._id}/edit`}
              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Edit property"
            >
              <PencilIcon className="h-5 w-5" />
            </Link>
            
            <Link
              href={`/properties/${property._id}`}
              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="View property"
              target="_blank"
            >
              <EyeIcon className="h-5 w-5" />
            </Link>
            
            <Link
              href={`/host/properties/${property._id}/calendar`}
              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Manage calendar"
            >
              <CalendarIcon className="h-5 w-5" />
            </Link>
          </div>
          
          <div className="flex space-x-2">
            {property.status !== 'published' && (
              <button
                onClick={() => handleStatusUpdate('published')}
                disabled={isUpdatingStatus}
                className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                title="Publish property"
              >
                {isUpdatingStatus ? (
                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                ) : (
                  <CheckCircleIcon className="h-5 w-5" />
                )}
              </button>
            )}
            
            {property.status !== 'draft' && (
              <button
                onClick={() => handleStatusUpdate('draft')}
                disabled={isUpdatingStatus}
                className="p-1.5 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors"
                title="Save as draft"
              >
                {isUpdatingStatus ? (
                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                ) : (
                  <XCircleIcon className="h-5 w-5" />
                )}
              </button>
            )}
            
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Delete property"
            >
              {isDeleting ? (
                <ArrowPathIcon className="h-5 w-5 animate-spin" />
              ) : (
                <TrashIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
