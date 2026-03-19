import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
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

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://awenesthomes.com';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const property = await getProperty(id);
    const primaryImage = property.images.find((img: any) => img.isPrimary) || property.images[0];
    const title = `${property.title} in ${property.location.city}, ${property.location.state}`;
    const desc = property.description?.slice(0, 155) ||
      `${property.propertyType} in ${property.location.city}. ${property.bedrooms} bed · ${property.bathrooms} bath · up to ${property.maxGuests} guests. From ₹${property.pricing.basePrice}/night.`;

    return {
      title,
      description: desc,
      openGraph: {
        title,
        description: desc,
        type: 'website',
        url: `${BASE_URL}/properties/${id}`,
        images: primaryImage
          ? [{ url: primaryImage.url, width: 1200, height: 630, alt: title }]
          : [{ url: '/og-image.jpg', width: 1200, height: 630, alt: title }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description: desc,
        images: primaryImage ? [primaryImage.url] : ['/og-image.jpg'],
      },
    };
  } catch {
    return { title: 'Property Not Found' };
  }
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Fetch property data
  const property = await getProperty(id);

  // Get primary image
  const primaryImage = property.images.find((image: any) => image.isPrimary) || property.images[0];

  const propertyUrl = `${BASE_URL}/properties/${id}`;

  const vacationRentalSchema = {
    '@context': 'https://schema.org',
    '@type': 'VacationRental',
    name: property.title,
    description: property.description,
    url: propertyUrl,
    image: property.images.map((img: any) => img.url).filter(Boolean),
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.location.address || '',
      addressLocality: property.location.city,
      addressRegion: property.location.state,
      postalCode: property.location.zipCode || '',
      addressCountry: 'IN',
    },
    ...(property.location?.coordinates?.lat && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: property.location.coordinates.lat,
        longitude: property.location.coordinates.lng,
      },
    }),
    ...(property.rating && property.reviewCount && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: property.rating.toFixed(1),
        reviewCount: property.reviewCount,
        bestRating: '5',
        worstRating: '1',
      },
    }),
    numberOfRooms: property.bedrooms,
    maximumAttendeeCapacity: property.maxGuests,
    checkinTime: '14:00',
    checkoutTime: '11:00',
    amenityFeature: (property.amenities || []).map((amenity: string) => ({
      '@type': 'LocationFeatureSpecification',
      name: amenity,
      value: true,
    })),
    offers: {
      '@type': 'Offer',
      price: property.pricing.basePrice,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
    ...(property.host?.name && {
      host: {
        '@type': 'Person',
        name: property.host.name,
        ...(property.host.image && { image: property.host.image }),
      },
    }),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: `${property.location.city} Rentals`, item: `${BASE_URL}/?location=${encodeURIComponent(property.location.city)}` },
      { '@type': 'ListItem', position: 3, name: property.title },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(vacationRentalSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
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
