'use client';

import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Info, Percent, Calendar, Clock, Tag, Sparkles, AlertCircle, TrendingUp } from 'lucide-react';

// Reusable form input classes
const inputClassName = `block w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm 
  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
  focus:border-transparent transition duration-150 ease-in-out text-gray-900 
  disabled:bg-gray-50 disabled:text-gray-500`;

const labelClassName = 'block text-sm font-medium text-gray-700 mb-1';
const errorClassName = 'mt-1 text-sm text-red-500 flex items-center gap-1';
const helperTextClassName = 'mt-1 text-sm text-gray-500 flex items-start gap-2';

const currencyInputClass = `block w-full pl-8 pr-12 py-2 rounded-lg border border-gray-300 shadow-sm 
  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
  focus:border-transparent transition duration-150 ease-in-out text-gray-900`;

export default function PricingForm() {
  const { register, formState: { errors }, setValue, watch } = useFormContext();
  const [estimatedMonthlyEarnings, setEstimatedMonthlyEarnings] = useState(0);
  
  // Watch pricing fields for calculations
  const basePrice = watch('pricing.basePrice') || 0;
  const cleaningFee = watch('pricing.cleaningFee') || 0;
  const serviceFee = watch('pricing.serviceFee') || 0;
  const taxRate = watch('pricing.taxRate') || 18;
  const weeklyDiscount = watch('pricing.discounts.weekly') || 0;
  const monthlyDiscount = watch('pricing.discounts.monthly') || 0;
  
  // Calculate estimated earnings
  useEffect(() => {
    // Assume 15 nights booked per month on average
    const averageNightsPerMonth = 15;
    
    // Calculate nightly revenue
    const nightlyRevenue = basePrice;
    
    // Calculate monthly revenue before discounts
    const monthlyRevenueBeforeDiscount = nightlyRevenue * averageNightsPerMonth;
    
    // Apply monthly discount if applicable
    const discountedRevenue = monthlyDiscount > 0 
      ? monthlyRevenueBeforeDiscount * (1 - monthlyDiscount / 100) 
      : monthlyRevenueBeforeDiscount;
    
    // Add one-time fees (assuming one booking per month)
    const totalRevenue = discountedRevenue + cleaningFee;
    
    // Set estimated monthly earnings
    setEstimatedMonthlyEarnings(Math.round(totalRevenue));
  }, [basePrice, cleaningFee, monthlyDiscount]);
  
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-gray-900">Pricing & Availability</h2>
        <p className="text-sm text-gray-600">
          Set your rates, fees, and availability to maximize your bookings and earnings.
        </p>
      </div>

      <div className="space-y-6">
        {/* Base Price */}
        <div>
          <label htmlFor="basePrice" className={labelClassName}>
            Base Price (per night)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">₹</span>
            </div>
            <input
              type="number"
              id="basePrice"
              {...register('pricing.basePrice', { valueAsNumber: true })}
              className={`${currencyInputClass} ${errors.pricing?.basePrice ? 'border-red-300' : ''}`}
              placeholder="0"
              min="100"
              step="50"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">INR</span>
            </div>
          </div>
          {errors.pricing?.basePrice ? (
            <p className={errorClassName}>
              <Info className="h-4 w-4 flex-shrink-0" />
              {errors.pricing?.basePrice?.message as string}
            </p>
          ) : (
            <p className={helperTextClassName}>
              <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
              This is the base nightly rate guests will pay. You can adjust prices for specific dates later.
            </p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Cleaning Fee */}
        <div>
          <label htmlFor="cleaningFee" className={`${labelClassName} flex items-center gap-1`}>
            <Sparkles className="h-4 w-4 text-gray-500" />
            Cleaning Fee
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">₹</span>
            </div>
            <input
              type="number"
              id="cleaningFee"
              {...register('pricing.cleaningFee', { valueAsNumber: true })}
              className={`${currencyInputClass} ${errors.pricing?.cleaningFee ? 'border-red-300' : ''}`}
              placeholder="0"
              min="0"
              step="50"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">INR</span>
            </div>
          </div>
          {errors.pricing?.cleaningFee ? (
            <p className={errorClassName}>
              <Info className="h-4 w-4 flex-shrink-0" />
              {errors.pricing.cleaningFee?.message as string}
            </p>
          ) : (
            <p className={helperTextClassName}>
              <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
              One-time fee charged to guests for cleaning the property after their stay.
            </p>
          )}
        </div>
        
        {/* Service Fee */}
        <div>
          <label htmlFor="serviceFee" className={`${labelClassName} flex items-center gap-1`}>
            <Tag className="h-4 w-4 text-gray-500" />
            Additional Service Fee
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">₹</span>
            </div>
            <input
              type="number"
              id="serviceFee"
              {...register('pricing.serviceFee', { valueAsNumber: true })}
              className={`${currencyInputClass} ${errors.pricing?.serviceFee ? 'border-red-300' : ''}`}
              placeholder="0"
              min="0"
              step="50"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">INR</span>
            </div>
          </div>
          {errors.pricing?.serviceFee ? (
            <p className={errorClassName}>
              <Info className="h-4 w-4 flex-shrink-0" />
              {errors.pricing?.serviceFee?.message as string}
            </p>
          ) : (
            <p className={helperTextClassName}>
              <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
              Optional fee for additional services (e.g., airport pickup, welcome package).
            </p>
          )}
        </div>
        
        {/* Tax Rate */}
        <div>
          <label htmlFor="taxRate" className={`${labelClassName} flex items-center gap-1`}>
            <Percent className="h-4 w-4 text-gray-500" />
            Tax Rate
          </label>
          <div className="relative">
            <input
              type="number"
              id="taxRate"
              {...register('pricing.taxRate', { valueAsNumber: true })}
              className={`${inputClassName} ${errors.pricing?.taxRate ? 'border-red-300' : ''}`}
              placeholder="18"
              min="0"
              max="100"
              step="0.5"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500">%</span>
            </div>
          </div>
          {errors.pricing?.taxRate ? (
            <p className={errorClassName}>
              <Info className="h-4 w-4 flex-shrink-0" />
              {errors.pricing?.taxRate?.message as string}
            </p>
          ) : (
            <p className={helperTextClassName}>
              <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
              Default is 18% GST. Adjust if different tax rates apply in your area.
            </p>
          )}
        </div>
        
        {/* Minimum Stay */}
        <div>
          <label htmlFor="minimumStay" className={`${labelClassName} flex items-center gap-1`}>
            <Clock className="h-4 w-4 text-gray-500" />
            Minimum Stay
          </label>
          <div className="relative">
            <input
              type="number"
              id="minimumStay"
              {...register('pricing.minimumStay', { valueAsNumber: true })}
              className={`${inputClassName} ${errors.pricing?.minimumStay ? 'border-red-300' : ''}`}
              placeholder="1"
              min="1"
              step="1"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500">nights</span>
            </div>
          </div>
          {errors.pricing?.minimumStay && (
            <p className={errorClassName}>
              <Info className="h-4 w-4 flex-shrink-0" />
              {errors.pricing?.minimumStay?.message as string}
            </p>
          )}
        </div>
        
        {/* Maximum Stay */}
        <div>
          <label htmlFor="maximumStay" className={`${labelClassName} flex items-center gap-1`}>
            <Calendar className="h-4 w-4 text-gray-500" />
            Maximum Stay (optional)
          </label>
          <div className="relative">
            <input
              type="number"
              id="maximumStay"
              {...register('pricing.maximumStay', { 
                valueAsNumber: true,
                setValueAs: (value) => value === '' || isNaN(Number(value)) ? undefined : Number(value)
              })}
              className={`${inputClassName} ${errors.pricing?.maximumStay ? 'border-red-300' : ''}`}
              placeholder="30"
              min="1"
              step="1"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500">nights</span>
            </div>
          </div>
          {errors.pricing?.maximumStay ? (
            <p className={errorClassName}>
              <Info className="h-4 w-4 flex-shrink-0" />
              {errors.pricing?.maximumStay?.message as string}
            </p>
          ) : (
            <p className={helperTextClassName}>
              <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
              Leave empty for no maximum stay limit
            </p>
          )}
        </div>
      </div>
      
      {/* Discounts Section */}
      <div className="pt-6 border-t border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">Discounts</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Weekly Discount */}
          <div>
            <label htmlFor="weeklyDiscount" className={labelClassName}>
              Weekly Discount
            </label>
            <div className="relative">
              <input
                type="number"
                id="weeklyDiscount"
                {...register('pricing.discounts.weekly', { valueAsNumber: true })}
                className={`${inputClassName} ${errors.pricing?.discounts?.weekly ? 'border-red-300' : ''}`}
                placeholder="0"
                min="0"
                max="100"
                step="1"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500">%</span>
              </div>
            </div>
            {errors.pricing?.discounts?.weekly ? (
              <p className={errorClassName}>
                <Info className="h-4 w-4 flex-shrink-0" />
                {errors.pricing?.discounts?.weekly?.message as string}
              </p>
            ) : (
              <p className={helperTextClassName}>
                <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                Applied automatically for stays of 7+ nights
              </p>
            )}
          </div>
          
          {/* Monthly Discount */}
          <div>
            <label htmlFor="monthlyDiscount" className={labelClassName}>
              Monthly Discount
            </label>
            <div className="relative">
              <input
                type="number"
                id="monthlyDiscount"
                {...register('pricing.discounts.monthly', { valueAsNumber: true })}
                className={`${inputClassName} ${errors.pricing?.discounts?.monthly ? 'border-red-300' : ''}`}
                placeholder="0"
                min="0"
                max="100"
                step="1"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500">%</span>
              </div>
            </div>
            {errors.pricing?.discounts?.monthly ? (
              <p className={errorClassName}>
                <Info className="h-4 w-4 flex-shrink-0" />
                {errors.pricing?.discounts?.monthly?.message as string}
              </p>
            ) : (
              <p className={helperTextClassName}>
                <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                Applied automatically for stays of 28+ nights
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Estimated Earnings */}
      <div className="bg-green-50 p-5 rounded-xl border border-green-100">
        <div className="flex items-center gap-3 mb-3">
          <TrendingUp className="h-6 w-6 text-green-600" />
          <h3 className="text-lg font-semibold text-green-800">Estimated Monthly Earnings</h3>
        </div>
        <div className="flex items-baseline mb-2">
          <span className="text-3xl font-bold text-green-700">₹{estimatedMonthlyEarnings.toLocaleString()}</span>
          <span className="ml-2 text-sm text-green-600">per month</span>
        </div>
        <p className="text-sm text-green-700">
          Based on an average occupancy of 15 nights per month. Actual earnings may vary based on 
          seasonality, location, and other factors.
        </p>
      </div>
      
      {/* Pricing Tips */}
      <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <AlertCircle className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-blue-800 mb-2">Pricing Tips</h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                <span>Research similar properties in your area to set competitive rates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                <span>Consider offering discounts for longer stays to increase occupancy</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                <span>You can adjust pricing for specific dates (weekends, holidays) after creating your listing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                <span>Balance your rates to attract bookings while maximizing revenue</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
