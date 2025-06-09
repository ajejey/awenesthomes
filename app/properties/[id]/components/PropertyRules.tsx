'use client';

import React, { useState } from 'react';
import { 
  CheckCircleIcon, 
  XCircleIcon,
  ClockIcon,
  NoSymbolIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface HouseRules {
  checkInTime?: string;
  checkOutTime?: string;
  smokingAllowed?: boolean;
  petsAllowed?: boolean;
  eventsAllowed?: boolean;
  additionalRules?: string[];
}

interface PropertyRulesProps {
  houseRules: HouseRules;
}

export default function PropertyRules({ houseRules }: PropertyRulesProps) {
  const [showAllRules, setShowAllRules] = useState(false);
  
  // Format check-in/check-out times
  const checkInTime = houseRules.checkInTime || '3:00 PM';
  const checkOutTime = houseRules.checkOutTime || '11:00 AM';
  
  // Create standard rules list
  const standardRules = [
    {
      name: 'Check-in',
      value: checkInTime,
      icon: <ClockIcon className="h-5 w-5 text-gray-500" />,
    },
    {
      name: 'Check-out',
      value: checkOutTime,
      icon: <ClockIcon className="h-5 w-5 text-gray-500" />,
    },
    {
      name: 'Smoking',
      value: houseRules.smokingAllowed ? 'Allowed' : 'Not allowed',
      icon: houseRules.smokingAllowed ? 
        <CheckCircleIcon className="h-5 w-5 text-green-500" /> : 
        <NoSymbolIcon className="h-5 w-5 text-red-500" />,
    },
    {
      name: 'Pets',
      value: houseRules.petsAllowed ? 'Allowed' : 'Not allowed',
      icon: houseRules.petsAllowed ? 
        <CheckCircleIcon className="h-5 w-5 text-green-500" /> : 
        <NoSymbolIcon className="h-5 w-5 text-red-500" />,
    },
    {
      name: 'Events',
      value: houseRules.eventsAllowed ? 'Allowed' : 'Not allowed',
      icon: houseRules.eventsAllowed ? 
        <CheckCircleIcon className="h-5 w-5 text-green-500" /> : 
        <NoSymbolIcon className="h-5 w-5 text-red-500" />,
    },
  ];
  
  // Get additional rules
  const additionalRules = houseRules.additionalRules || [];
  
  // Determine if we need a "Show more" button
  const hasMoreRules = additionalRules.length > 0;
  
  return (
    <div className="border-b border-gray-200 pb-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">House rules</h2>
      
      <div className="space-y-4">
        {/* Standard rules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {standardRules.map((rule) => (
            <div key={rule.name} className="flex items-center">
              <div className="flex-shrink-0 mr-3">
                {rule.icon}
              </div>
              <div>
                <p className="text-gray-900 font-medium">{rule.name}</p>
                <p className="text-gray-600 text-sm">{rule.value}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Additional rules */}
        {hasMoreRules && (
          <div className={`mt-4 ${!showAllRules && 'hidden'}`}>
            <h3 className="text-md font-medium text-gray-900 mb-2">Additional rules</h3>
            <ul className="list-disc pl-5 space-y-1">
              {additionalRules.map((rule, index) => (
                <li key={index} className="text-gray-600">{rule}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Show more/less button */}
        {hasMoreRules && (
          <button
            onClick={() => setShowAllRules(!showAllRules)}
            className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium focus:outline-none"
          >
            {showAllRules ? 'Show less' : 'Show more house rules'}
          </button>
        )}
        
        {/* Important notice */}
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                By booking this property, you agree to follow all house rules and understand that violations may result in penalties or cancellation without refund.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
