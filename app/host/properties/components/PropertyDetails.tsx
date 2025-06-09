'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { updatePropertyStatus, deleteProperty } from '../[id]/actions';
import PropertyStatusBadge from './PropertyStatusBadge';
import PropertyGallery from './PropertyGallery';
import PropertyAmenities from './PropertyAmenities';
import PropertyRules from './PropertyRules';
import PropertyAvailability from './PropertyAvailability';
import PropertyPricing from './PropertyPricing';

type PropertyDetailsProps = {
  property: any; // Using any for now, should be replaced with proper type
};

export default function PropertyDetails({ property }: PropertyDetailsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Handle property status update
  const handleStatusUpdate = async () => {
    if (isUpdatingStatus) return;
    
    try {
      setIsUpdatingStatus(true);
      const newStatus = property.status === 'published' ? 'draft' : 'published';
      const result = await updatePropertyStatus(property._id, newStatus);
      
      if (result.success) {
        router.refresh();
      } else {
        console.error('Failed to update property status:', result.error);
        alert('Failed to update property status. Please try again.');
      }
    } catch (error) {
      console.error('Error updating property status:', error);
      alert('An error occurred while updating property status.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };
  
  // Handle property deletion
  const handleDelete = async () => {
    if (isDeleting) return;
    
    try {
      setIsDeleting(true);
      const result = await deleteProperty(property._id);
      
      if (result.success) {
        router.push('/host/properties');
      } else {
        console.error('Failed to delete property:', result.error);
        alert('Failed to delete property. Please try again.');
        setShowDeleteConfirm(false);
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('An error occurred while deleting the property.');
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
            <p className="text-gray-600 mt-1">
              {property.location.city}, {property.location.state}, {property.location.country}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <PropertyStatusBadge status={property.status} />
            <button
              onClick={handleStatusUpdate}
              disabled={isUpdatingStatus}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                property.status === 'published'
                  ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              {isUpdatingStatus ? 'Updating...' : property.status === 'published' ? 'Unpublish' : 'Publish'}
            </button>
            <Link
              href={`/host/properties/${property._id}/edit`}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Edit Property
            </Link>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-100 text-red-800 rounded-md text-sm font-medium hover:bg-red-200 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      
      {/* Property Gallery */}
      <PropertyGallery images={property.images} />
      
      {/* Property Details */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Description */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
          </section>
          
          {/* Property Type & Details */}
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Property Type</h3>
              <p className="mt-1 text-base font-medium text-gray-900">{property.propertyType}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Bedrooms</h3>
              <p className="mt-1 text-base font-medium text-gray-900">{property.bedrooms}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Beds</h3>
              <p className="mt-1 text-base font-medium text-gray-900">{property.beds}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Bathrooms</h3>
              <p className="mt-1 text-base font-medium text-gray-900">{property.bathrooms}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Max Guests</h3>
              <p className="mt-1 text-base font-medium text-gray-900">{property.maxGuests}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Instant Booking</h3>
              <p className="mt-1 text-base font-medium text-gray-900">{property.instantBooking ? 'Yes' : 'No'}</p>
            </div>
          </section>
          
          {/* Amenities */}
          <PropertyAmenities amenities={property.amenities} />
          
          {/* House Rules */}
          <PropertyRules houseRules={property.houseRules} />
          
          {/* Availability */}
          <PropertyAvailability availability={property.availability} />
        </div>
        
        {/* Right Column - Pricing & Location */}
        <div className="space-y-6">
          {/* Pricing */}
          <PropertyPricing pricing={property.pricing} />
          
          {/* Location */}
          <section className="border border-gray-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Location</h2>
            <div className="space-y-2">
              <p className="text-gray-700">
                {property.location.addressLine1}
                {property.location.addressLine2 && `, ${property.location.addressLine2}`}
              </p>
              <p className="text-gray-700">
                {property.location.city}, {property.location.state} {property.location.zipCode}
              </p>
              <p className="text-gray-700">{property.location.country}</p>
            </div>
            <div className="mt-4 bg-gray-100 h-48 rounded flex items-center justify-center">
              <p className="text-gray-500 text-sm">Map view will be available soon</p>
            </div>
          </section>
          
          {/* Public View Link */}
          <Link
            href={`/properties/${property._id}`}
            target="_blank"
            className="block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            View Public Listing
          </Link>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Delete Property</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this property? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
