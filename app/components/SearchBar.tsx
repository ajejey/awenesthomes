'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DateRangePicker from './DateRangePicker';
import { ISearchParams } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface SearchBarProps {
  defaultLocation?: string;
  defaultCheckIn?: Date | null;
  defaultCheckOut?: Date | null;
  defaultGuests?: number;
  compact?: boolean;
}

interface GuestCounts {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

interface LocationSuggestion {
  id: string;
  name: string;
  region: string;
  type: 'city' | 'landmark' | 'area' | 'recent';
  iconUrl?: string;
}

export default function SearchBar({ 
  defaultLocation = '',
  defaultCheckIn = null,
  defaultCheckOut = null,
  defaultGuests = 1,
  compact = false
}: SearchBarProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchParams, setSearchParams] = useState<ISearchParams>({
    location: defaultLocation,
    checkIn: defaultCheckIn ? new Date(defaultCheckIn).toISOString().split('T')[0] : undefined,
    checkOut: defaultCheckOut ? new Date(defaultCheckOut).toISOString().split('T')[0] : undefined,
    guests: defaultGuests
  });

  const [guestCounts, setGuestCounts] = useState<GuestCounts>({
    adults: Math.max(1, defaultGuests || 1),
    children: 0,
    infants: 0,
    pets: 0
  });
  
  const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  const guestDropdownRef = useRef<HTMLDivElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const locationDropdownRef = useRef<HTMLDivElement>(null);

  // Mock location suggestions based on user input
  const getMockSuggestions = (query: string): LocationSuggestion[] => {
    if (!query || query.length < 2) return [];
    
    const mockLocations: LocationSuggestion[] = [
      { id: '1', name: 'Mumbai', region: 'Maharashtra, India', type: 'city' },
      { id: '2', name: 'Delhi', region: 'Delhi, India', type: 'city' },
      { id: '3', name: 'Bangalore', region: 'Karnataka, India', type: 'city' },
      { id: '4', name: 'Hyderabad', region: 'Telangana, India', type: 'city' },
      { id: '5', name: 'Chennai', region: 'Tamil Nadu, India', type: 'city' },
      { id: '6', name: 'Kolkata', region: 'West Bengal, India', type: 'city' },
      { id: '7', name: 'Jaipur', region: 'Rajasthan, India', type: 'city' },
      { id: '8', name: 'Goa', region: 'India', type: 'area' },
      { id: '9', name: 'Taj Mahal', region: 'Agra, India', type: 'landmark' },
      { id: '10', name: 'Manali', region: 'Himachal Pradesh, India', type: 'area' },
      { id: '11', name: 'Munnar', region: 'Kerala, India', type: 'area' },
      { id: '12', name: 'Darjeeling', region: 'West Bengal, India', type: 'area' },
    ];
    
    const lowercaseQuery = query.toLowerCase();
    return mockLocations.filter(location => 
      location.name.toLowerCase().includes(lowercaseQuery) || 
      location.region.toLowerCase().includes(lowercaseQuery)
    ).slice(0, 5);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setSearchParams(prev => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(value) || 1 : value
    }));
    
    setIsExpanded(true);
    
    // Handle location input specifically
    if (name === 'location') {
      setIsTyping(true);
      setShowLocationSuggestions(true);
      
      // Debounce the suggestions update
      const timer = setTimeout(() => {
        setLocationSuggestions(getMockSuggestions(value));
        setIsTyping(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  };
  
  const handleLocationSelect = (suggestion: LocationSuggestion) => {
    setSearchParams(prev => ({
      ...prev,
      location: suggestion.name
    }));
    setShowLocationSuggestions(false);
  };
  
  // Handle clicks outside the dropdowns to close them
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (guestDropdownRef.current && !guestDropdownRef.current.contains(event.target as Node)) {
        setIsGuestDropdownOpen(false);
      }
      
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node) && 
          locationInputRef.current !== event.target) {
        setShowLocationSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Update total guests count when individual counts change
  useEffect(() => {
    const totalGuests = guestCounts.adults + guestCounts.children;
    setSearchParams(prev => ({
      ...prev,
      guests: totalGuests
    }));
  }, [guestCounts]);
  
  const handleGuestChange = (type: keyof GuestCounts, increment: boolean) => {
    setGuestCounts(prev => {
      const newCount = increment ? prev[type] + 1 : Math.max(0, prev[type] - 1);
      
      // Ensure at least 1 adult
      if (type === 'adults' && newCount < 1) {
        return prev;
      }
      
      return {
        ...prev,
        [type]: newCount
      };
    });
  };

  const handleDatesChange = (startDate: Date | null, endDate: Date | null) => {
    setSearchParams(prev => ({
      ...prev,
      checkIn: startDate ? startDate.toISOString().split('T')[0] : undefined,
      checkOut: endDate ? endDate.toISOString().split('T')[0] : undefined
    }));
    setIsExpanded(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Close any open dropdowns
    setIsGuestDropdownOpen(false);
    setShowLocationSuggestions(false);
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    
    if (searchParams.location) {
      queryParams.append('location', searchParams.location);
    }
    
    if (searchParams.checkIn) {
      queryParams.append('checkIn', searchParams.checkIn);
    }
    
    if (searchParams.checkOut) {
      queryParams.append('checkOut', searchParams.checkOut);
    }
    
    if (searchParams.guests && searchParams.guests > 0) {
      queryParams.append('guests', searchParams.guests.toString());
    }
    
    // Update URL with search parameters without leaving the home page
    const newUrl = `/?${queryParams.toString()}`;
    router.push(newUrl, { scroll: false });
  };

  return (
    <div className={`w-full ${compact ? 'max-w-3xl' : 'max-w-4xl'} mx-auto`}>
      <form 
        onSubmit={handleSubmit}
        className={`bg-white rounded-full shadow-md flex flex-col md:flex-row items-center p-2 ${isExpanded ? 'md:rounded-lg' : 'md:rounded-full'}`}
      >
        <div className="flex-1 min-w-0 px-4 py-2 border-b md:border-b-0 md:border-r border-gray-200 w-full md:w-auto relative" ref={locationDropdownRef}>
          <label htmlFor="location" className="block text-xs font-medium text-gray-700">Where</label>
          <input
            id="location"
            name="location"
            type="text"
            placeholder="Search destinations"
            className="w-full border-none p-0 text-gray-900 focus:outline-none"
            value={searchParams.location}
            onChange={handleInputChange}
            onClick={() => {
              setIsExpanded(true);
              setShowLocationSuggestions(true);
              if (searchParams.location) {
                setLocationSuggestions(getMockSuggestions(searchParams.location));
              }
            }}
            ref={locationInputRef}
          />
          
          {/* Location Suggestions Dropdown */}
          <AnimatePresence>
            {showLocationSuggestions && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg p-2 z-50 border border-gray-200 w-full md:w-96"
              >
                {isTyping ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-pulse flex space-x-2">
                      <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                      <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                      <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                    </div>
                  </div>
                ) : locationSuggestions.length > 0 ? (
                  <div className="max-h-72 overflow-y-auto">
                    {locationSuggestions.map(suggestion => (
                      <button
                        key={suggestion.id}
                        type="button"
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md flex items-start transition-colors duration-150 focus:outline-none focus:bg-gray-50"
                        onClick={() => handleLocationSelect(suggestion)}
                      >
                        <div className="flex-shrink-0 mr-3 mt-1">
                          {suggestion.type === 'city' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                          )}
                          {suggestion.type === 'landmark' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                            </svg>
                          )}
                          {suggestion.type === 'area' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                          )}
                          {suggestion.type === 'recent' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{suggestion.name}</p>
                          <p className="text-sm text-gray-500">{suggestion.region}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : searchParams.location ? (
                  <div className="py-3 px-3 text-center text-gray-500">
                    No locations found matching "{searchParams.location}"
                  </div>
                ) : (
                  <div className="py-3 px-3 text-center text-gray-500">
                    Try searching for a city, area, or landmark
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Date Range Picker Component */}
        <div className="flex-1 flex-grow min-w-0 border-b md:border-b-0 md:border-r border-gray-200 w-full md:w-auto">
          <DateRangePicker
            startDate={searchParams.checkIn ? new Date(searchParams.checkIn) : null}
            endDate={searchParams.checkOut ? new Date(searchParams.checkOut) : null}
            onDatesChange={handleDatesChange}
            startPlaceholder="Check in"
            endPlaceholder="Check out"
            minDays={1}
            maxDays={90}
          />
        </div>
        
        <div className="flex-1 min-w-0 px-4 py-2 w-full md:w-auto flex items-center" ref={guestDropdownRef}>
          <div className="flex-grow relative">
            <label htmlFor="guests" className="block text-xs font-medium text-gray-700">Who</label>
            <button
              type="button"
              className="w-full text-left border-none p-0 text-gray-900 bg-transparent focus:outline-none"
              onClick={() => {
                setIsGuestDropdownOpen(!isGuestDropdownOpen);
                setIsExpanded(true);
              }}
            >
              {searchParams.guests} {searchParams.guests === 1 ? 'guest' : 'guests'}
              {guestCounts.infants > 0 && `, ${guestCounts.infants} ${guestCounts.infants === 1 ? 'infant' : 'infants'}`}
              {guestCounts.pets > 0 && `, ${guestCounts.pets} ${guestCounts.pets === 1 ? 'pet' : 'pets'}`}
            </button>
            
            {/* Guest Dropdown */}
            <AnimatePresence>
              {isGuestDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg p-4 z-50 border border-gray-200 w-72"
                >
                  {/* Adults */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <p className="font-medium">Adults</p>
                      <p className="text-sm text-gray-500">Ages 13 or above</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button 
                        type="button"
                        onClick={() => handleGuestChange('adults', false)}
                        disabled={guestCounts.adults <= 1}
                        className={`w-8 h-8 rounded-full flex items-center justify-center border ${guestCounts.adults <= 1 ? 'border-gray-200 text-gray-300' : 'border-gray-400 text-gray-600 hover:border-gray-700'}`}
                      >
                        <span className="text-lg">-</span>
                      </button>
                      <span className="w-6 text-center">{guestCounts.adults}</span>
                      <button 
                        type="button"
                        onClick={() => handleGuestChange('adults', true)}
                        className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-400 text-gray-600 hover:border-gray-700"
                      >
                        <span className="text-lg">+</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Children */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <p className="font-medium">Children</p>
                      <p className="text-sm text-gray-500">Ages 2-12</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button 
                        type="button"
                        onClick={() => handleGuestChange('children', false)}
                        disabled={guestCounts.children <= 0}
                        className={`w-8 h-8 rounded-full flex items-center justify-center border ${guestCounts.children <= 0 ? 'border-gray-200 text-gray-300' : 'border-gray-400 text-gray-600 hover:border-gray-700'}`}
                      >
                        <span className="text-lg">-</span>
                      </button>
                      <span className="w-6 text-center">{guestCounts.children}</span>
                      <button 
                        type="button"
                        onClick={() => handleGuestChange('children', true)}
                        className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-400 text-gray-600 hover:border-gray-700"
                      >
                        <span className="text-lg">+</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Infants */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <p className="font-medium">Infants</p>
                      <p className="text-sm text-gray-500">Under 2</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button 
                        type="button"
                        onClick={() => handleGuestChange('infants', false)}
                        disabled={guestCounts.infants <= 0}
                        className={`w-8 h-8 rounded-full flex items-center justify-center border ${guestCounts.infants <= 0 ? 'border-gray-200 text-gray-300' : 'border-gray-400 text-gray-600 hover:border-gray-700'}`}
                      >
                        <span className="text-lg">-</span>
                      </button>
                      <span className="w-6 text-center">{guestCounts.infants}</span>
                      <button 
                        type="button"
                        onClick={() => handleGuestChange('infants', true)}
                        className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-400 text-gray-600 hover:border-gray-700"
                      >
                        <span className="text-lg">+</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Pets */}
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium">Pets</p>
                      <p className="text-sm text-gray-500 hover:underline cursor-pointer">Bringing a service animal?</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button 
                        type="button"
                        onClick={() => handleGuestChange('pets', false)}
                        disabled={guestCounts.pets <= 0}
                        className={`w-8 h-8 rounded-full flex items-center justify-center border ${guestCounts.pets <= 0 ? 'border-gray-200 text-gray-300' : 'border-gray-400 text-gray-600 hover:border-gray-700'}`}
                      >
                        <span className="text-lg">-</span>
                      </button>
                      <span className="w-6 text-center">{guestCounts.pets}</span>
                      <button 
                        type="button"
                        onClick={() => handleGuestChange('pets', true)}
                        className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-400 text-gray-600 hover:border-gray-700"
                      >
                        <span className="text-lg">+</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-right">
                    <button 
                      type="button" 
                      className="text-sm font-medium text-blue-600 hover:underline"
                      onClick={() => setIsGuestDropdownOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <button
            type="submit"
            className="ml-4 inline-flex items-center px-4 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            <span className="hidden md:inline-block ml-1">Search</span>
          </button>
        </div>
      </form>
    </div>
  );
}
