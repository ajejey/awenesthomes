'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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

export default function EarningsCalculator() {
  const [monthlyEarnings, setMonthlyEarnings] = useState<number | null>(null);
  const [yearlyEarnings, setYearlyEarnings] = useState<number | null>(null);
  const [occupancyRate, setOccupancyRate] = useState<number>(65);
  
  // Initialize form with react-hook-form and zod validation
  const { register, watch, formState: { errors } } = useForm<CalculatorFormData>({
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column - Form */}
        <div className="space-y-6">
          <div>
            <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">
              Property Type
            </label>
            <select
              id="propertyType"
              {...register('propertyType')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="villa">Villa</option>
              <option value="cottage">Cottage</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
              Number of Bedrooms
            </label>
            <select
              id="bedrooms"
              {...register('bedrooms', { valueAsNumber: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Bedroom' : 'Bedrooms'}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <select
              id="location"
              {...register('location')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="mumbai">Mumbai</option>
              <option value="delhi">Delhi</option>
              <option value="bangalore">Bangalore</option>
              <option value="hyderabad">Hyderabad</option>
              <option value="chennai">Chennai</option>
              <option value="kolkata">Kolkata</option>
              <option value="pune">Pune</option>
              <option value="goa">Goa</option>
              <option value="shimla">Shimla</option>
              <option value="manali">Manali</option>
              <option value="other">Other Cities</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="nightsPerMonth" className="block text-sm font-medium text-gray-700 mb-1">
              Nights booked per month
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                id="nightsPerMonth"
                min="1"
                max="31"
                {...register('nightsPerMonth', { valueAsNumber: true })}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="w-10 text-center text-sm font-medium text-gray-700">
                {watchAllFields.nightsPerMonth || 15}
              </span>
            </div>
          </div>
          
          <div>
            <label htmlFor="occupancyRate" className="block text-sm font-medium text-gray-700 mb-1">
              Occupancy Rate: {occupancyRate}%
            </label>
            <input
              type="range"
              id="occupancyRate"
              min="10"
              max="100"
              step="5"
              value={occupancyRate}
              onChange={handleOccupancyChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <p className="mt-1 text-xs text-gray-500">
              Adjust based on your expected booking rate
            </p>
          </div>
        </div>
        
        {/* Right column - Results */}
        <div className="bg-blue-50 p-6 rounded-lg h-full flex flex-col justify-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Estimated Earnings</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Earnings</p>
              <p className="text-3xl font-bold text-blue-600">
                ₹{monthlyEarnings?.toLocaleString('en-IN') || '0'}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-600">Yearly Earnings</p>
              <p className="text-2xl font-bold text-blue-700">
                ₹{yearlyEarnings?.toLocaleString('en-IN') || '0'}
              </p>
            </div>
            
            <div className="pt-4 mt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Based on {watchAllFields.nightsPerMonth || 15} nights per month at {occupancyRate}% occupancy rate.
                Actual earnings may vary based on seasonality, demand, and other factors.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-700">
          💡 Pro tip: Increase your occupancy rate by offering competitive pricing, great amenities, 
          and responding quickly to booking inquiries.
        </p>
      </div>
    </div>
  );
}
