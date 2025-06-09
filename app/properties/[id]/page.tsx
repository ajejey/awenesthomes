import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { MapPinIcon, UserIcon, HomeIcon, StarIcon, CalendarIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { getProperty } from './actions';
import PropertyAmenities from './components/PropertyAmenities';
import PropertyGallery from './components/PropertyGallery';
import PropertyBookingForm from './components/PropertyBookingForm';
import PropertyReviews from './components/PropertyReviews';
import PropertyMap from './components/PropertyMap';
import PropertyHost from './components/PropertyHost';
import PropertyRules from './components/PropertyRules';
import { BathIcon, Bed } from 'lucide-react';

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  // Fetch property data
  const property = await getProperty(id);
  
  // Get primary image
  const primaryImage = property.images.find((image: any) => image.isPrimary) || property.images[0];
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Property title and basic info */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
        
        <div className="flex flex-wrap items-center text-sm text-gray-600 gap-3">
          {property.rating && (
            <div className="flex items-center">
              <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
              <span>{property.rating.toFixed(1)}</span>
              {property.reviewCount && (
                <span className="ml-1">({property.reviewCount} reviews)</span>
              )}
            </div>
          )}
          
          <div className="flex items-center">
            <MapPinIcon className="h-4 w-4 mr-1" />
            <span>{property.location.city}, {property.location.state}</span>
          </div>
        </div>
      </div>
      
      {/* Property gallery */}
      <PropertyGallery images={property.images} />
      
      {/* Property details and booking form */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Host and property type */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)} hosted by {property.host.name}
                </h2>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="flex items-center mr-3">
                    <UserIcon className="h-4 w-4 mr-1" />
                    {property.maxGuests} guests
                  </span>
                  <span className="flex items-center mr-3">
                    <HomeIcon className="h-4 w-4 mr-1" />
                    {property.bedrooms} bedrooms
                  </span>
                  <span className="flex items-center mr-3">
                    <Bed className="h-4 w-4 mr-1" />
                    {property.beds} beds
                  </span>
                  <span className="flex items-center">
                    <BathIcon className="h-4 w-4 mr-1" />
                    {property.bathrooms} bathrooms
                  </span>
                </div>
              </div>
              
              {property.host.image && (
                <div className="flex-shrink-0">
                  <Image
                    src={property.host.image}
                    alt={property.host.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Property description */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">About this place</h2>
            <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
          </div>
          
          {/* Property amenities */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">What this place offers</h2>
            <PropertyAmenities amenities={property.amenities} />
          </div>
          
          {/* Availability */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Availability</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start mb-3">
                <CalendarIcon className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-gray-700 font-medium">Minimum stay: {property.pricing.minimumStay} night{property.pricing.minimumStay > 1 ? 's' : ''}</p>
                  {property.pricing.maximumStay && (
                    <p className="text-gray-700">Maximum stay: {property.pricing.maximumStay} nights</p>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-gray-600">
                This property has {property.availability.length} available date range{property.availability.length !== 1 ? 's' : ''}.
                {property.instantBooking && (
                  <span className="flex items-center mt-2 text-green-600">
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    Instant booking available
                  </span>
                )}
              </p>
            </div>
          </div>
          
          {/* House rules */}
          <PropertyRules houseRules={property.houseRules} />
          
          {/* Location */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
            <p className="text-gray-700 mb-4">{property.location.address}, {property.location.city}, {property.location.state}, {property.location.zipCode}</p>
            
            <PropertyMap location={property.location} />
          </div>
          
          {/* Host information */}
          <PropertyHost host={property.host} />
          
          {/* Reviews */}
          <PropertyReviews propertyId={property._id} />
        </div>
        
        {/* Booking form */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <PropertyBookingForm
              propertyId={property._id}
              basePrice={property.pricing.basePrice}
              cleaningFee={property.pricing.cleaningFee}
              serviceFee={property.pricing.serviceFee}
              taxRate={property.pricing.taxRate}
              minimumStay={property.pricing.minimumStay}
              maximumStay={property.pricing.maximumStay}
              availability={property.availability}
              blockedDates={property.blockedDates}
              instantBooking={property.instantBooking}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
