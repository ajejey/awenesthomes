'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

// Define the schema for the calculator form
const calculatorSchema = z.object({
  propertyType: z.enum(['apartment', 'house', 'villa', 'cottage', 'other']),
  bedrooms: z.number().int().min(1).max(10),
  location: z.string().min(2, 'Please select a location'),
  nightsPerMonth: z.number().int().min(1).max(31),
});

type CalculatorFormData = z.infer<typeof calculatorSchema>;

// City rate data (average nightly rates in INR)
const cityRates: Record<string, number> = {
  'mumbai': 5500,
  'delhi': 4800,
  'bangalore': 4200,
  'hyderabad': 3800,
  'chennai': 3500,
  'kolkata': 3200,
  'pune': 3000,
  'jaipur': 3800,
  'goa': 6500,
  'kochi': 4000,
  'shimla': 5200,
  'manali': 5500,
  'rishikesh': 3800,
  'udaipur': 4500,
  'agra': 3200,
  'varanasi': 3000,
  'amritsar': 3200,
  'other': 3500,
};

// Property type multipliers
const propertyMultipliers: Record<string, number> = {
  'apartment': 1.0,
  'house': 1.2,
  'villa': 1.5,
  'cottage': 1.3,
  'other': 1.1,
};

// Bedroom multipliers
const bedroomMultipliers: Record<number, number> = {
  1: 1.0,
  2: 1.4,
  3: 1.8,
  4: 2.2,
  5: 2.6,
  6: 3.0,
  7: 3.4,
  8: 3.8,
  9: 4.2,
  10: 4.6,
};

export default function EarningsCalculatorPage() {
  const [monthlyEarnings, setMonthlyEarnings] = useState<number | null>(null);
  const [yearlyEarnings, setYearlyEarnings] = useState<number | null>(null);
  const [occupancyRate, setOccupancyRate] = useState<number>(65);
  
  // Initialize form with react-hook-form and zod validation
  const { register, handleSubmit, watch, formState: { errors } } = useForm<CalculatorFormData>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      propertyType: 'apartment',
      bedrooms: 2,
      location: 'bangalore',
      nightsPerMonth: 15,
    },
  });
  
  // Watch form values for real-time calculation
  const watchAllFields = watch();
  
  // Calculate earnings whenever form values change
  useEffect(() => {
    const calculateEarnings = () => {
      try {
        const { propertyType, bedrooms, location, nightsPerMonth } = watchAllFields;
        
        if (!propertyType || !bedrooms || !location || !nightsPerMonth) {
          return;
        }
        
        // Get base rate for the city
        const baseRate = cityRates[location] || cityRates.other;
        
        // Apply multipliers
        const propertyMultiplier = propertyMultipliers[propertyType] || 1.0;
        const bedroomMultiplier = bedroomMultipliers[bedrooms as number] || 1.0;
        
        // Calculate nightly rate
        const nightlyRate = baseRate * propertyMultiplier * bedroomMultiplier;
        
        // Calculate monthly earnings with occupancy rate
        const monthly = nightlyRate * nightsPerMonth * (occupancyRate / 100);
        
        // Calculate yearly earnings (monthly * 12)
        const yearly = monthly * 12;
        
        setMonthlyEarnings(Math.round(monthly));
        setYearlyEarnings(Math.round(yearly));
      } catch (error) {
        console.error('Error calculating earnings:', error);
      }
    };
    
    calculateEarnings();
  }, [watchAllFields, occupancyRate]);
  
  // Handle occupancy rate change
  const handleOccupancyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOccupancyRate(parseInt(e.target.value));
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <div className="mb-8">
          <Link 
            href="/become-a-host" 
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to hosting information
          </Link>
        </div>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-8 border-b border-gray-200 bg-blue-50">
            <h1 className="text-3xl font-bold text-gray-900">Earnings Calculator</h1>
            <p className="mt-2 text-lg text-gray-600">
              Estimate how much you could earn hosting on Awenest Homes
            </p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Calculator Form */}
              <div>
                <form className="space-y-6">
                  {/* Property Type */}
                  <div>
                    <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">
                      Property Type
                    </label>
                    <select
                      id="propertyType"
                      {...register('propertyType')}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="villa">Villa</option>
                      <option value="cottage">Cottage</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.propertyType && (
                      <p className="mt-1 text-sm text-red-600">{errors.propertyType.message}</p>
                    )}
                  </div>
                  
                  {/* Number of Bedrooms */}
                  <div>
                    <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">
                      Number of Bedrooms
                    </label>
                    <select
                      id="bedrooms"
                      {...register('bedrooms', { valueAsNumber: true })}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Bedroom' : 'Bedrooms'}
                        </option>
                      ))}
                    </select>
                    {errors.bedrooms && (
                      <p className="mt-1 text-sm text-red-600">{errors.bedrooms.message}</p>
                    )}
                  </div>
                  
                  {/* Location */}
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <select
                      id="location"
                      {...register('location')}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="mumbai">Mumbai</option>
                      <option value="delhi">Delhi</option>
                      <option value="bangalore">Bangalore</option>
                      <option value="hyderabad">Hyderabad</option>
                      <option value="chennai">Chennai</option>
                      <option value="kolkata">Kolkata</option>
                      <option value="pune">Pune</option>
                      <option value="jaipur">Jaipur</option>
                      <option value="goa">Goa</option>
                      <option value="kochi">Kochi</option>
                      <option value="shimla">Shimla</option>
                      <option value="manali">Manali</option>
                      <option value="rishikesh">Rishikesh</option>
                      <option value="udaipur">Udaipur</option>
                      <option value="agra">Agra</option>
                      <option value="varanasi">Varanasi</option>
                      <option value="amritsar">Amritsar</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.location && (
                      <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                    )}
                  </div>
                  
                  {/* Nights Per Month */}
                  <div>
                    <label htmlFor="nightsPerMonth" className="block text-sm font-medium text-gray-700">
                      Nights Booked Per Month
                    </label>
                    <select
                      id="nightsPerMonth"
                      {...register('nightsPerMonth', { valueAsNumber: true })}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      {[5, 10, 15, 20, 25, 30].map((num) => (
                        <option key={num} value={num}>
                          {num} nights
                        </option>
                      ))}
                    </select>
                    {errors.nightsPerMonth && (
                      <p className="mt-1 text-sm text-red-600">{errors.nightsPerMonth.message}</p>
                    )}
                  </div>
                  
                  {/* Occupancy Rate */}
                  <div>
                    <label htmlFor="occupancyRate" className="block text-sm font-medium text-gray-700">
                      Expected Occupancy Rate: {occupancyRate}%
                    </label>
                    <input
                      type="range"
                      id="occupancyRate"
                      min="30"
                      max="100"
                      step="5"
                      value={occupancyRate}
                      onChange={handleOccupancyChange}
                      className="mt-1 block w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>30%</span>
                      <span>65%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </form>
              </div>
              
              {/* Results */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Estimated Earnings</h2>
                
                {monthlyEarnings !== null && yearlyEarnings !== null ? (
                  <div className="space-y-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <div className="text-sm text-gray-500">Monthly</div>
                      <div className="text-3xl font-bold text-blue-600">₹{monthlyEarnings.toLocaleString()}</div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <div className="text-sm text-gray-500">Yearly</div>
                      <div className="text-3xl font-bold text-blue-600">₹{yearlyEarnings.toLocaleString()}</div>
                    </div>
                    
                    <div className="mt-6 text-sm text-gray-500">
                      <p>
                        These estimates are based on average earnings of hosts in your area with similar property types and occupancy rates.
                        Actual earnings may vary based on pricing, demand, seasonality, and other factors.
                      </p>
                    </div>
                    
                    <div className="mt-6">
                      <Link
                        href="/become-a-host/onboarding"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Start Hosting Now
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Please complete the form to see your estimated earnings</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
