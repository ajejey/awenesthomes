'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import Image from 'next/image';
import { format } from 'date-fns';
import { PropertyType, Amenity } from '@/lib/models/property';

// Property type labels
const propertyTypeLabels: Record<PropertyType, string> = {
  apartment: 'Apartment',
  house: 'House',
  guesthouse: 'Guest House',
  hotel: 'Hotel',
  villa: 'Villa',
  cottage: 'Cottage',
  bungalow: 'Bungalow',
  farmhouse: 'Farmhouse',
  treehouse: 'Treehouse',
  boat: 'Boat',
  other: 'Other',
};

// Amenity labels
const amenityLabels: Record<Amenity, { label: string; icon: string }> = {
  wifi: { label: 'WiFi', icon: '📶' },
  kitchen: { label: 'Kitchen', icon: '🍳' },
  ac: { label: 'Air conditioning', icon: '❄️' },
  heating: { label: 'Heating', icon: '🔥' },
  tv: { label: 'TV', icon: '📺' },
  washer: { label: 'Washer', icon: '🧺' },
  dryer: { label: 'Dryer', icon: '👕' },
  parking: { label: 'Free parking', icon: '🅿️' },
  elevator: { label: 'Elevator', icon: '🔼' },
  pool: { label: 'Pool', icon: '🏊' },
  hot_tub: { label: 'Hot tub', icon: '♨️' },
  gym: { label: 'Gym', icon: '💪' },
  breakfast: { label: 'Breakfast', icon: '🍳' },
  workspace: { label: 'Dedicated workspace', icon: '💻' },
  fireplace: { label: 'Outdoor fireplace', icon: '🔥' },
  bbq: { label: 'BBQ grill', icon: '🍖' },
  indoor_fireplace: { label: 'Indoor fireplace', icon: '🧱' },
  smoking_allowed: { label: 'Smoking allowed', icon: '🚬' },
  pets_allowed: { label: 'Pets allowed', icon: '🐾' },
  events_allowed: { label: 'Events allowed', icon: '🎉' },
};

// Reusable section component
const Section = ({ title, children, icon }: { title: string; children: React.ReactNode; icon?: string }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md">
    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center space-x-2">
      {icon && <span className="text-blue-500">{icon}</span>}
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

// Status badge component
const StatusBadge = ({ status }: { status: string }) => (
  <span className={`px-3 py-1 inline-flex text-xs font-medium rounded-full ${
    status === 'published' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-amber-100 text-amber-800'
  }`}>
    {status === 'published' ? 'Published' : 'Draft'}
  </span>
);

export default function ReviewForm() {
  const { watch, setValue } = useFormContext();
  const formData = watch();
  
  const formatDate = (date: Date) => format(new Date(date), 'MMM d, yyyy');
  
  const toggleStatus = () => {
    setValue('status', formData.status === 'draft' ? 'published' : 'draft');
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Review Your Property</h2>
        <p className="mt-2 text-gray-600">
          Please verify all details before submitting your property listing
        </p>
      </div>
      
      {/* Basic Information */}
      <Section title="Basic Information" icon="🏠">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-gray-500">Title</h4>
            <p className="text-gray-900 font-medium">{formData.title}</p>
          </div>
          
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-gray-500">Property Type</h4>
            <p className="text-gray-900">{propertyTypeLabels[formData.propertyType as keyof typeof propertyTypeLabels]}</p>
          </div>
          
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-gray-500">Status</h4>
            <div className="flex items-center space-x-3">
              <StatusBadge status={formData.status} />
              <button
                type="button"
                onClick={toggleStatus}
                className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                {formData.status === 'published' ? 'Switch to Draft' : 'Publish Now'}
              </button>
            </div>
          </div>
          
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-gray-500">Rooms & Beds</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Bedrooms</p>
                <p className="text-gray-900 font-medium">{formData.bedrooms}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Beds</p>
                <p className="text-gray-900 font-medium">{formData.beds}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Bathrooms</p>
                <p className="text-gray-900 font-medium">{formData.bathrooms}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-1 sm:col-span-2">
            <h4 className="text-sm font-medium text-gray-500">Maximum Guests</h4>
            <p className="text-gray-900">{formData.maxGuests} {formData.maxGuests === 1 ? 'guest' : 'guests'}</p>
          </div>
          
          <div className="space-y-2 sm:col-span-2">
            <h4 className="text-sm font-medium text-gray-500">Description</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <p className="text-gray-700 whitespace-pre-line">{formData.description}</p>
            </div>
          </div>
        </div>
      </Section>
      
      {/* Location */}
      <Section title="Location" icon="📍">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-1 sm:col-span-2">
            <h4 className="text-sm font-medium text-gray-500">Address</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <p className="text-gray-900">{formData.location.address}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:col-span-2">
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-gray-500">City</h4>
              <p className="text-gray-900">{formData.location.city}</p>
            </div>
            
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-gray-500">State</h4>
              <p className="text-gray-900">{formData.location.state}</p>
            </div>
            
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-gray-500">PIN Code</h4>
              <p className="text-gray-900">{formData.location.zipCode}</p>
            </div>
            
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-gray-500">Country</h4>
              <p className="text-gray-900">{formData.location.country}</p>
            </div>
          </div>
          
          {/* Map Preview - Placeholder */}
          <div className="sm:col-span-2 rounded-lg overflow-hidden border border-gray-200 h-48 bg-gray-100 flex items-center justify-center">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-500 text-xl">🌍</span>
              </div>
              <p className="text-sm text-gray-500">Map preview would be displayed here</p>
            </div>
          </div>
        </div>
      </Section>
      
      {/* Images */}
      <Section title="Property Images" icon="🖼️">
        {formData.images && formData.images.length > 0 ? (
          <div className="space-y-4">
            {/* Primary Image (if exists) */}
            {formData.images.some((img: any) => img.isPrimary) && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Primary Image</h4>
                <div className="relative rounded-xl overflow-hidden border-2 border-blue-400">
                  <Image
                    src={formData.images.find((img: any) => img.isPrimary)?.url}
                    alt={formData.images.find((img: any) => img.isPrimary)?.caption || 'Primary property image'}
                    width={800}
                    height={450}
                    className="w-full h-auto object-cover aspect-video"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-sm font-medium text-white">
                      {formData.images.find((img: any) => img.isPrimary)?.caption || 'Main property view'}
                    </p>
                  </div>
                  <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-md">
                    Primary
                  </span>
                </div>
              </div>
            )}
            
            {/* Other Images */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Additional Images ({formData.images.filter((img: any) => !img.isPrimary).length})
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {formData.images
                  .filter((img: any) => !img.isPrimary)
                  .map((image: any, index: number) => (
                    <div key={index} className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                      <Image
                        src={image.url}
                        alt={image.caption || `Property image ${index + 2}`}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      {image.caption && (
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                          <p className="text-xs text-white truncate">{image.caption}</p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-gray-400 text-xl">📷</span>
            </div>
            <p className="text-gray-500">No images added yet</p>
            <p className="text-sm text-gray-400 mt-1">Add images to showcase your property</p>
          </div>
        )}
      </Section>
      
      {/* Amenities & Rules */}
      <Section title="Amenities & Rules" icon="✨">
        <div className="space-y-8">
          {/* Amenities */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Included Amenities</h4>
            {formData.amenities && formData.amenities.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {formData.amenities.map((amenity: Amenity, index: number) => (
                  <div 
                    key={index} 
                    className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-blue-50 hover:border-blue-100 transition-colors"
                  >
                    <span className="text-lg">{amenityLabels[amenity]?.icon}</span>
                    <span className="text-sm font-medium text-gray-800">
                      {amenityLabels[amenity]?.label}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-xl">
                <p className="text-gray-500">No amenities added yet</p>
                <p className="text-sm text-gray-400 mt-1">Add amenities to highlight what your property offers</p>
              </div>
            )}
          </div>
          
          {/* House Rules */}
          {formData.houseRules && Array.isArray(formData.houseRules) && formData.houseRules.length > 0 && (
            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-700 mb-3">House Rules</h4>
              <ul className="space-y-2">
                {formData.houseRules.map((rule: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2 mt-0.5">•</span>
                    <span className="text-gray-700">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Instant Booking */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-700">Booking Type</h4>
                <p className="text-sm text-gray-500 mt-0.5">
                  {formData.instantBooking 
                    ? 'Guests can book instantly' 
                    : 'You approve or decline each request'}
                </p>
              </div>
              <span className={`px-3 py-1.5 text-sm font-medium rounded-full ${
                formData.instantBooking 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {formData.instantBooking ? 'Instant Booking' : 'Request to Book'}
              </span>
            </div>
          </div>
        </div>
      </Section>
      
      {/* Pricing */}
      <Section title="Pricing" icon="💰">
        <div className="space-y-6">
          {/* Main Pricing */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-gray-500">Base Price</h4>
              <p className="text-2xl font-semibold text-gray-900">
                ₹{formData.pricing.basePrice}
                <span className="text-sm font-normal text-gray-500 ml-1">/ night</span>
              </p>
            </div>
            
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-gray-500">Minimum Stay</h4>
              <p className="text-lg font-medium text-gray-900">
                {formData.pricing.minimumStay} {formData.pricing.minimumStay === 1 ? 'night' : 'nights'} minimum
              </p>
            </div>
          </div>
          
          {/* Additional Fees */}
          <div className="border-t border-gray-100 pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Additional Fees</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Cleaning fee</span>
                <span className="text-sm font-medium text-gray-900">₹{formData.pricing.cleaningFee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Service fee</span>
                <span className="text-sm font-medium text-gray-900">₹{formData.pricing.serviceFee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Taxes ({formData.pricing.taxRate}%)</span>
                <span className="text-sm font-medium text-gray-900">
                  ₹{Math.round((formData.pricing.basePrice * formData.pricing.taxRate) / 100)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Discounts */}
          {(formData.pricing.discounts?.weekly || formData.pricing.discounts?.monthly) && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Discounts Applied</h4>
              <div className="space-y-2">
                {formData.pricing.discounts?.weekly && (
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-700">Weekly discount</span>
                    <span className="text-sm font-medium text-blue-700">
                      {formData.pricing.discounts.weekly}% off
                    </span>
                  </div>
                )}
                {formData.pricing.discounts?.monthly && (
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-700">Monthly discount</span>
                    <span className="text-sm font-medium text-blue-700">
                      {formData.pricing.discounts.monthly}% off
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Maximum Stay */}
          {formData.pricing.maximumStay && (
            <div className="text-sm text-gray-500 mt-2">
              <p>Maximum stay: {formData.pricing.maximumStay} nights</p>
            </div>
          )}
        </div>
      </Section>
      
      {/* Availability */}
      <Section title="Availability" icon="📅">
        <div className="space-y-8">
          {/* Available Date Ranges */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Available Dates</h4>
            {formData.availability && formData.availability.length > 0 ? (
              <div className="space-y-2">
                {formData.availability.map((range: any, index: number) => (
                  <div 
                    key={index} 
                    className="flex items-center bg-green-50 border border-green-100 rounded-lg p-3"
                  >
                    <div className="bg-green-100 p-2 rounded-lg mr-3">
                      <span className="text-green-600">📅</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(range.startDate)} - {formatDate(range.endDate)}
                      </p>
                      <p className="text-xs text-green-600 mt-0.5">Available for booking</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-xl">
                <p className="text-gray-500">No availability set</p>
                <p className="text-sm text-gray-400 mt-1">Add dates when your property is available</p>
              </div>
            )}
          </div>
          
          {/* Blocked Date Ranges */}
          {formData.blockedDates && formData.blockedDates.length > 0 && (
            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Blocked Dates</h4>
              <div className="space-y-2">
                {formData.blockedDates.map((range: any, index: number) => (
                  <div 
                    key={index} 
                    className="flex items-start bg-red-50 border border-red-100 rounded-lg p-3"
                  >
                    <div className="bg-red-100 p-2 rounded-lg mr-3 mt-0.5">
                      <span className="text-red-600">🚫</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(range.startDate)} - {formatDate(range.endDate)}
                      </p>
                      {range.reason && (
                        <p className="text-xs text-gray-500 mt-1">
                          <span className="font-medium">Reason:</span> {range.reason}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Calendar Preview */}
          <div className="pt-4 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Calendar Preview</h4>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="grid grid-cols-7 gap-1 text-center">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                  <div key={i} className="text-xs font-medium text-gray-500 py-1">
                    {day}
                  </div>
                ))}
                {/* Placeholder calendar days */}
                {Array.from({ length: 35 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-8 flex items-center justify-center text-sm rounded-md ${
                      i % 7 === 0 || i % 7 === 6 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {i < 3 || i > 28 ? '' : i - 2}
                  </div>
                ))}
              </div>
              <p className="text-xs text-center text-gray-400 mt-3">
                Calendar shows sample availability. Actual dates are managed in your calendar.
              </p>
            </div>
          </div>
        </div>
      </Section>
      
      {/* Submission Notice */}
      <Section title="Ready to Publish?" icon="🚀">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-100 rounded-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 bg-white p-2 rounded-full shadow-sm">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Almost there!</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Review all the information you've provided. Once submitted, your property will be reviewed by our team before going live.
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="h-4 w-4 text-green-500 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    No credit card required
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="h-4 w-4 text-green-500 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Free to list
                  </div>
                </div>
              </div>
            </div>
            
            {/* <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center justify-center px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l7-3 7 3z" />
                </svg>
                Review Details
              </button>
              
              <button
                type="submit"
                className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                {formData.status === 'draft' ? 'Publish Listing' : 'Update Listing'}
                <svg className="ml-2 -mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div> */}
          </div>
          
          <div className="mt-6 pt-6 border-t border-blue-200">
            <p className="text-xs text-blue-700 text-center">
              By submitting, you agree to our{' '}
              <a href="#" className="font-medium underline hover:text-blue-900">Terms of Service</a> and{' '}
              <a href="#" className="font-medium underline hover:text-blue-900">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}
