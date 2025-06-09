'use client';

import React from 'react';
import { MapPinIcon } from '@heroicons/react/24/solid';

interface PropertyLocation {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
}

interface PropertyMapProps {
  location: PropertyLocation;
}

export default function PropertyMap({ location }: PropertyMapProps) {
  // Check if we have coordinates
  const hasCoordinates = location.latitude && location.longitude;
  
  // If we have coordinates, render a map
  if (hasCoordinates) {
    // In a real implementation, this would use a map library like Google Maps, Mapbox, or Leaflet
    // For now, we'll render a placeholder with the location information
    return (
      <div className="relative h-64 w-full bg-gray-200 rounded-lg overflow-hidden">
        {/* This would be replaced with an actual map component */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPinIcon className="h-10 w-10 text-red-500 mx-auto" />
            <p className="text-gray-700 font-medium mt-2">Map View</p>
            <p className="text-sm text-gray-600">
              {location.latitude?.toFixed(6)}, {location.longitude?.toFixed(6)}
            </p>
          </div>
        </div>
        
        {/* Map attribution placeholder */}
        <div className="absolute bottom-0 right-0 bg-white bg-opacity-75 px-2 py-1 text-xs text-gray-600">
          Map data © 2025
        </div>
      </div>
    );
  }
  
  // If we don't have coordinates, show a placeholder
  return (
    <div className="h-64 w-full bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center p-4">
        <MapPinIcon className="h-8 w-8 text-gray-400 mx-auto" />
        <p className="text-gray-500 mt-2">Location map not available</p>
        <p className="text-sm text-gray-500 mt-1">
          {location.address}, {location.city}, {location.state}, {location.zipCode}
        </p>
      </div>
    </div>
  );
}
