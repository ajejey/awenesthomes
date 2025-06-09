'use client';

import React, { useState } from 'react';
import { 
  WifiIcon, FireIcon, TvIcon, HomeIcon, 
  ShieldCheckIcon, SparklesIcon, BoltIcon,
  BeakerIcon, SunIcon, MusicalNoteIcon
} from '@heroicons/react/24/outline';
import { Amenity } from '@/lib/models/property';

interface PropertyAmenitiesProps {
  amenities: Amenity[];
}

// Map amenity types to icons and labels
const amenityConfig: Record<Amenity, { icon: React.ReactNode; label: string }> = {
  wifi: { 
    icon: <WifiIcon className="h-5 w-5" />, 
    label: 'WiFi' 
  },
  kitchen: { 
    icon: <HomeIcon className="h-5 w-5" />, 
    label: 'Kitchen' 
  },
  ac: { 
    icon: <SparklesIcon className="h-5 w-5" />, 
    label: 'Air conditioning' 
  },
  heating: { 
    icon: <FireIcon className="h-5 w-5" />, 
    label: 'Heating' 
  },
  tv: { 
    icon: <TvIcon className="h-5 w-5" />, 
    label: 'TV' 
  },
  washer: { 
    icon: <BeakerIcon className="h-5 w-5" />, 
    label: 'Washer' 
  },
  dryer: { 
    icon: <SunIcon className="h-5 w-5" />, 
    label: 'Dryer' 
  },
  parking: { 
    icon: <HomeIcon className="h-5 w-5" />, 
    label: 'Free parking' 
  },
  elevator: { 
    icon: <HomeIcon className="h-5 w-5" />, 
    label: 'Elevator' 
  },
  pool: { 
    icon: <HomeIcon className="h-5 w-5" />, 
    label: 'Pool' 
  },
  hot_tub: { 
    icon: <HomeIcon className="h-5 w-5" />, 
    label: 'Hot tub' 
  },
  gym: { 
    icon: <HomeIcon className="h-5 w-5" />, 
    label: 'Gym' 
  },
  breakfast: { 
    icon: <HomeIcon className="h-5 w-5" />, 
    label: 'Breakfast included' 
  },
  workspace: { 
    icon: <HomeIcon className="h-5 w-5" />, 
    label: 'Dedicated workspace' 
  },
  fireplace: { 
    icon: <FireIcon className="h-5 w-5" />, 
    label: 'Fireplace' 
  },
  bbq: { 
    icon: <FireIcon className="h-5 w-5" />, 
    label: 'BBQ grill' 
  },
  indoor_fireplace: { 
    icon: <FireIcon className="h-5 w-5" />, 
    label: 'Indoor fireplace' 
  },
  smoking_allowed: { 
    icon: <HomeIcon className="h-5 w-5" />, 
    label: 'Smoking allowed' 
  },
  pets_allowed: { 
    icon: <HomeIcon className="h-5 w-5" />, 
    label: 'Pets allowed' 
  },
  events_allowed: { 
    icon: <MusicalNoteIcon className="h-5 w-5" />, 
    label: 'Events allowed' 
  },
};

export default function PropertyAmenities({ amenities }: PropertyAmenitiesProps) {
  const [showAll, setShowAll] = useState(false);
  
  // If no amenities, show message
  if (!amenities || amenities.length === 0) {
    return <p className="text-gray-500">No amenities listed for this property.</p>;
  }
  
  // Sort amenities alphabetically by label
  const sortedAmenities = [...amenities].sort((a, b) => 
    amenityConfig[a].label.localeCompare(amenityConfig[b].label)
  );
  
  // Display only first 8 amenities initially
  const displayedAmenities = showAll ? sortedAmenities : sortedAmenities.slice(0, 8);
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedAmenities.map((amenity) => (
          <div key={amenity} className="flex items-center">
            <div className="flex-shrink-0 text-gray-500 mr-3">
              {amenityConfig[amenity].icon}
            </div>
            <span className="text-gray-700">{amenityConfig[amenity].label}</span>
          </div>
        ))}
      </div>
      
      {sortedAmenities.length > 8 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-6 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {showAll ? 'Show less' : `Show all ${sortedAmenities.length} amenities`}
        </button>
      )}
    </div>
  );
}
