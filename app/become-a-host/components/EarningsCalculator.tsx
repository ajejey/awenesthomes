'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { 
  HomeIcon, 
  BuildingOffice2Icon, 
  HomeModernIcon, 
  MapPinIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  BanknotesIcon,
  ChartBarIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

// Define the schema for the calculator form
const calculatorSchema = z.object({
  propertyType: z.enum(['apartment', 'house', 'villa', 'cottage', 'other']),
  bedrooms: z.number().int().min(1).max(10),
  location: z.string().min(2, 'Please select a location'),
  nightsPerMonth: z.number().int().min(1).max(31),
  managementType: z.enum(['self', 'managed']),
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

// Seasonal multipliers for advanced calculator
const seasonalMultipliers: Record<string, number> = {
  'peak': 1.3,   // Peak season (holidays, festivals)
  'high': 1.15,   // High season
  'regular': 1.0,  // Regular season
  'low': 0.85     // Low season
};

export default function EarningsCalculator() {
  const [monthlyEarnings, setMonthlyEarnings] = useState<number | null>(null);
  const [yearlyEarnings, setYearlyEarnings] = useState<number | null>(null);
  const [netEarnings, setNetEarnings] = useState<number | null>(null);
  const [occupancyRate, setOccupancyRate] = useState<number>(65);
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('basic');
  const [showComparison, setShowComparison] = useState<boolean>(false);
  const [season, setSeason] = useState<'regular' | 'peak' | 'high' | 'low'>('regular');
  
  // Initialize form with react-hook-form and zod validation
  const { register, watch, setValue, formState: { errors } } = useForm<CalculatorFormData>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      propertyType: 'apartment',
      bedrooms: 2,
      location: 'bangalore',
      nightsPerMonth: 15,
      managementType: 'self',
    },
  });
  
  // Watch form values for real-time calculation
  const watchAllFields = watch();
  
  // Calculate earnings whenever form values change
  useEffect(() => {
    const calculateEarnings = () => {
      try {
        const { propertyType, bedrooms, location, nightsPerMonth, managementType } = watchAllFields;
        
        if (!propertyType || !bedrooms || !location || !nightsPerMonth || !managementType) {
          return;
        }
        
        // Get base rate for the city
        const baseRate = cityRates[location] || cityRates.other;
        
        // Apply multipliers
        const propertyMultiplier = propertyMultipliers[propertyType] || 1.0;
        const bedroomMultiplier = bedroomMultipliers[bedrooms as number] || 1.0;
        const seasonalMultiplier = activeTab === 'advanced' ? seasonalMultipliers[season] : 1.0;
        
        // Calculate nightly rate
        const nightlyRate = baseRate * propertyMultiplier * bedroomMultiplier * seasonalMultiplier;
        
        // Calculate monthly earnings with occupancy rate
        const monthly = nightlyRate * nightsPerMonth * (occupancyRate / 100);
        
        // Calculate yearly earnings
        const yearly = monthly * 12;
        
        // Calculate net earnings after management fees
        const managementFeeRate = managementType === 'self' ? 0.05 : 0.18; // 5% for self-managed, 18% for AweNestHost-managed
        const net = yearly * (1 - managementFeeRate);
        
        // Update state
        setMonthlyEarnings(Math.round(monthly));
        setYearlyEarnings(Math.round(yearly));
        setNetEarnings(Math.round(net));
      } catch (error) {
        console.error('Error calculating earnings:', error);
      }
    };
    
    calculateEarnings();
  }, [watchAllFields, occupancyRate, activeTab, season]);
  
  // Handle occupancy rate change
  const handleOccupancyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOccupancyRate(parseInt(e.target.value, 10));
  };
  
  // Toggle between basic and advanced calculator
  const toggleCalculatorMode = (mode: 'basic' | 'advanced') => {
    setActiveTab(mode);
  };
  
  // Toggle comparison view
  const toggleComparison = () => {
    setShowComparison(!showComparison);
  };
  
  // Switch management type
  const switchManagementType = (type: 'self' | 'managed') => {
    setValue('managementType', type);
  };
  
  // Handle season change
  const handleSeasonChange = (newSeason: 'regular' | 'peak' | 'high' | 'low') => {
    setSeason(newSeason);
  };

  return (
    <div className="space-y-8">
      {/* Calculator Mode Tabs */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => toggleCalculatorMode('basic')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'basic' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Basic Calculator
          </button>
          <button
            onClick={() => toggleCalculatorMode('advanced')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'advanced' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Advanced Options
          </button>
        </div>
      </div>
      
      {/* Management Type Toggle */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex p-1 bg-blue-50 rounded-lg border border-blue-100">
          <button
            onClick={() => switchManagementType('self')}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all ${watchAllFields.managementType === 'self' ? 'bg-white text-amber-600 shadow-sm border border-amber-200' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <HomeIcon className="w-4 h-4 mr-2" />
            Self-Managed (3-5%)
          </button>
          <button
            onClick={() => switchManagementType('managed')}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all ${watchAllFields.managementType === 'managed' ? 'bg-white text-blue-600 shadow-sm border border-blue-200' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <CheckCircleIcon className="w-4 h-4 mr-2" />
            AweNestHost-Managed (15-20%)
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column - Form */}
        <div className="lg:col-span-7 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="space-y-6">
              <div>
                <label htmlFor="propertyType" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <HomeModernIcon className="w-5 h-5 mr-2 text-blue-500" />
                  Property Type
                </label>
                <select
                  id="propertyType"
                  {...register('propertyType')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="cottage">Cottage</option>
                  <option value="other">Other Property Type</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="bedrooms" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <BuildingOffice2Icon className="w-5 h-5 mr-2 text-blue-500" />
                  Number of Bedrooms
                </label>
                <select
                  id="bedrooms"
                  {...register('bedrooms', { valueAsNumber: true })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Bedroom' : 'Bedrooms'}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="location" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MapPinIcon className="w-5 h-5 mr-2 text-blue-500" />
                  Location
                </label>
                <select
                  id="location"
                  {...register('location')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
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
                  <option value="rishikesh">Rishikesh</option>
                  <option value="udaipur">Udaipur</option>
                  <option value="other">Other Cities</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="nightsPerMonth" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <CalendarIcon className="w-5 h-5 mr-2 text-blue-500" />
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
                <label htmlFor="occupancyRate" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <ChartBarIcon className="w-5 h-5 mr-2 text-blue-500" />
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
              
              {activeTab === 'advanced' && (
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
                    <ArrowTrendingUpIcon className="w-5 h-5 mr-2 text-blue-500" />
                    Advanced Options
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Season Type
                      </label>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {['regular', 'high', 'peak', 'low'].map((seasonType) => (
                          <button
                            key={seasonType}
                            type="button"
                            onClick={() => handleSeasonChange(seasonType as any)}
                            className={`px-3 py-2 text-xs font-medium rounded-md capitalize ${season === seasonType ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'}`}
                          >
                            {seasonType}
                          </button>
                        ))}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Season affects pricing: Peak (+30%), High (+15%), Regular (standard), Low (-15%)
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Comparison Toggle */}
          {activeTab === 'advanced' && (
            <div className="flex justify-center">
              <button
                onClick={toggleComparison}
                className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-all"
              >
                <InformationCircleIcon className="w-5 h-5 mr-1" />
                {showComparison ? 'Hide Management Comparison' : 'Compare Management Options'}
              </button>
            </div>
          )}
        </div>
        
        {/* Right column - Results */}
        <div className="lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm border border-blue-200 h-full"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Your Estimated Earnings</h3>
                <CurrencyRupeeIcon className="w-6 h-6 text-blue-500" />
              </div>
              
              <div className="space-y-5">
                <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
                  <p className="text-sm font-medium text-gray-600">Monthly Earnings</p>
                  <p className="text-3xl font-bold text-blue-600 mt-1">
                    ₹{monthlyEarnings?.toLocaleString('en-IN') || '0'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Based on {watchAllFields.nightsPerMonth || 15} nights at {occupancyRate}% occupancy
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
                  <p className="text-sm font-medium text-gray-600">Yearly Earnings</p>
                  <p className="text-2xl font-bold text-blue-700 mt-1">
                    ₹{yearlyEarnings?.toLocaleString('en-IN') || '0'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Before management fees</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-600">Net Earnings</p>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${watchAllFields.managementType === 'self' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                      {watchAllFields.managementType === 'self' ? 'Self-Managed' : 'AweNestHost-Managed'}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    ₹{netEarnings?.toLocaleString('en-IN') || '0'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    After {watchAllFields.managementType === 'self' ? '3-5%' : '15-20%'} management fees
                  </p>
                </div>
              </div>
              
              {showComparison && (
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <h4 className="text-sm font-medium text-gray-800 mb-3">Management Options Comparison</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                      <p className="text-xs font-medium text-amber-800">Self-Managed</p>
                      <p className="text-lg font-bold text-amber-700 mt-1">
                        ₹{(yearlyEarnings ? Math.round(yearlyEarnings * 0.95) : 0).toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs text-amber-700 mt-1">5% fee</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <p className="text-xs font-medium text-blue-800">AweNestHost-Managed</p>
                      <p className="text-lg font-bold text-blue-700 mt-1">
                        ₹{(yearlyEarnings ? Math.round(yearlyEarnings * 0.82) : 0).toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs text-blue-700 mt-1">18% fee</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    AweNestHost-Managed includes full property management, guest communication, cleaning, and maintenance.
                  </p>
                </div>
              )}
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-700 flex items-start">
                  <BanknotesIcon className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Pro tip:</strong> {activeTab === 'basic' ? 'Try the Advanced Options for more detailed calculations.' : 'Increase your occupancy rate by offering competitive pricing and great amenities.'}
                  </span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className="text-center text-xs text-gray-500 mt-4">
        <p>Estimates are based on average rates in your selected location and may vary based on seasonality, demand, and other factors.</p>
        <p className="mt-1">Consult with an AweNestHost advisor for a personalized earnings assessment.</p>
      </div>
    </div>
  );
}
