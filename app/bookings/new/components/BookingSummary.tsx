'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format, parseISO, differenceInDays } from 'date-fns';
import { StarIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/solid';

interface BookingSummaryProps {
  property: any;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

export default function BookingSummary({ 
  property, 
  checkIn, 
  checkOut, 
  guests = 1 
}: BookingSummaryProps) {
  const [pricing, setPricing] = useState<any>(null);

  // Calculate pricing whenever dates or guests change
  useEffect(() => {
    if (checkIn && checkOut) {
      calculatePricing();
    }
  }, [checkIn, checkOut, guests]);

  // Calculate pricing details
  const calculatePricing = () => {
    if (!checkIn || !checkOut) return;

    try {
      const checkInDate = parseISO(checkIn);
      const checkOutDate = parseISO(checkOut);
      
      // Calculate number of nights
      const nights = differenceInDays(checkOutDate, checkInDate);
      
      if (nights <= 0) {
        setPricing(null);
        return;
      }
      
      // Calculate base price total
      const baseTotal = property.pricing.basePrice * nights;
      
      // Calculate discount if applicable
      let discount = null;
      if (nights >= 28 && property.pricing.discounts?.monthly) {
        discount = {
          type: 'monthly',
          percentage: property.pricing.discounts.monthly,
          amount: (baseTotal * property.pricing.discounts.monthly) / 100
        };
      } else if (nights >= 7 && property.pricing.discounts?.weekly) {
        discount = {
          type: 'weekly',
          percentage: property.pricing.discounts.weekly,
          amount: (baseTotal * property.pricing.discounts.weekly) / 100
        };
      }
      
      // Calculate fees and taxes
      const cleaningFee = property.pricing.cleaningFee;
      const serviceFee = property.pricing.serviceFee;
      const taxRate = property.pricing.taxRate;
      const subtotal = baseTotal - (discount?.amount || 0) + cleaningFee + serviceFee;
      const taxAmount = (subtotal * taxRate) / 100;
      
      // Calculate total
      const total = subtotal + taxAmount;
      
      setPricing({
        nights,
        basePrice: property.pricing.basePrice,
        baseTotal,
        discount,
        cleaningFee,
        serviceFee,
        taxRate,
        taxAmount,
        total
      });
    } catch (error) {
      console.error('Error calculating pricing:', error);
      setPricing(null);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Find the primary image
  const primaryImage = property.images.find((img: any) => img.isPrimary) || property.images[0];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Booking Summary</h2>
      
      {/* Property card */}
      <div className="flex space-x-4">
        <div className="flex-shrink-0 w-24 h-24 relative rounded-lg overflow-hidden">
          <Image
            src={primaryImage?.url || '/images/placeholder.jpg'}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100px, 96px"
            className="object-cover"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <Link href={`/properties/${property._id}`} className="hover:underline">
            <h3 className="text-base font-medium text-gray-900 truncate">{property.title}</h3>
          </Link>
          
          <p className="text-sm text-gray-500 truncate">
            {property.location.city}, {property.location.state}
          </p>
          
          {property.rating && (
            <div className="flex items-center mt-1">
              <StarIcon className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-gray-700 ml-1">
                {property.rating.toFixed(1)} ({property.reviewCount} reviews)
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Divider */}
      <div className="border-t border-gray-200 my-4"></div>
      
      {/* Trip details */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-gray-900">Your trip</h3>
        
        <div className="flex items-start space-x-3">
          <CalendarIcon className="h-5 w-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-900">Dates</p>
            {checkIn && checkOut ? (
              <p className="text-sm text-gray-500">
                {format(parseISO(checkIn), 'MMM d, yyyy')} - {format(parseISO(checkOut), 'MMM d, yyyy')}
              </p>
            ) : (
              <p className="text-sm text-gray-500">Dates not selected</p>
            )}
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <UserIcon className="h-5 w-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-900">Guests</p>
            <p className="text-sm text-gray-500">{guests} {guests === 1 ? 'guest' : 'guests'}</p>
          </div>
        </div>
      </div>
      
      {/* Divider */}
      <div className="border-t border-gray-200 my-4"></div>
      
      {/* Price breakdown */}
      {pricing ? (
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-900">Price details</h3>
          
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">
              {formatCurrency(pricing.basePrice)} x {pricing.nights} nights
            </span>
            <span className="text-sm text-gray-900">{formatCurrency(pricing.baseTotal)}</span>
          </div>
          
          {pricing.discount && (
            <div className="flex justify-between">
              <span className="text-sm text-green-600">
                {pricing.discount.type === 'weekly' ? 'Weekly' : 'Monthly'} discount ({pricing.discount.percentage}%)
              </span>
              <span className="text-sm text-green-600">-{formatCurrency(pricing.discount.amount)}</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Cleaning fee</span>
            <span className="text-sm text-gray-900">{formatCurrency(pricing.cleaningFee)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Service fee</span>
            <span className="text-sm text-gray-900">{formatCurrency(pricing.serviceFee)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Taxes ({pricing.taxRate}%)</span>
            <span className="text-sm text-gray-900">{formatCurrency(pricing.taxAmount)}</span>
          </div>
          
          <div className="border-t border-gray-200 pt-3 flex justify-between font-medium">
            <span className="text-base text-gray-900">Total</span>
            <span className="text-base text-gray-900">{formatCurrency(pricing.total)}</span>
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-500 italic">
          Select check-in and check-out dates to see price details
        </div>
      )}
      
      {/* Property policies */}
      <div className="border-t border-gray-200 pt-4 mt-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Property policies</h3>
        
        <ul className="text-sm text-gray-600 space-y-2">
          <li>
            <span className="font-medium">Minimum stay:</span> {property.pricing.minimumStay} night(s)
          </li>
          {property.pricing.maximumStay && (
            <li>
              <span className="font-medium">Maximum stay:</span> {property.pricing.maximumStay} nights
            </li>
          )}
          <li>
            <span className="font-medium">Booking type:</span> {property.instantBooking ? 'Instant booking' : 'Request to book'}
          </li>
        </ul>
      </div>
    </div>
  );
}
