import { 
  WifiIcon, FireIcon, TvIcon, HomeIcon, 
  BeakerIcon, SparklesIcon, 
  KeyIcon, ArrowsUpDownIcon,
  HeartIcon, MusicalNoteIcon, SunIcon, 
  ComputerDesktopIcon, BoltIcon, FireIcon as FireplaceIcon,
  CakeIcon, NoSymbolIcon, UserGroupIcon
} from '@heroicons/react/24/outline';

// Custom icons for components not in Heroicons
function SwimmingPoolIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={1.5}
      strokeLinecap="round" 
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 12h20M2 16h20M2 20h20M6 8V4M10 8V4M14 8V4M18 8V4M4 12c0-1.5 1.5-3 4-3s4 1.5 4 3M12 12c0-1.5 1.5-3 4-3s4 1.5 4 3" />
    </svg>
  );
}

function PawPrintIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={1.5}
      strokeLinecap="round" 
      strokeLinejoin="round"
      {...props}
    >
      <path d="M8 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM4 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM16 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM20 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM12 20a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" />
    </svg>
  );
}

function ShowerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={1.5}
      strokeLinecap="round" 
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 4h16M4 8h16M4 12h16M8 16v4M12 16v4M16 16v4" />
    </svg>
  );
}

type Amenity = 
  | 'wifi' 
  | 'kitchen' 
  | 'ac' 
  | 'heating' 
  | 'tv' 
  | 'washer' 
  | 'dryer' 
  | 'parking' 
  | 'elevator' 
  | 'pool' 
  | 'hot_tub' 
  | 'gym' 
  | 'breakfast' 
  | 'workspace' 
  | 'fireplace' 
  | 'bbq' 
  | 'indoor_fireplace' 
  | 'smoking_allowed' 
  | 'pets_allowed' 
  | 'events_allowed';

type PropertyAmenitiesProps = {
  amenities: Amenity[];
};

export default function PropertyAmenities({ amenities }: PropertyAmenitiesProps) {
  // Map amenities to icons and labels
  const amenityDetails: Record<Amenity, { icon: React.ReactNode; label: string }> = {
    wifi: { 
      icon: <WifiIcon className="h-5 w-5 text-gray-500" />, 
      label: 'WiFi' 
    },
    kitchen: { 
      icon: <HomeIcon className="h-5 w-5 text-gray-500" />, 
      label: 'Kitchen' 
    },
    ac: { 
      icon: <SparklesIcon className="h-5 w-5 text-gray-500" />, 
      label: 'Air conditioning' 
    },
    heating: { 
      icon: <FireIcon className="h-5 w-5 text-gray-500" />, 
      label: 'Heating' 
    },
    tv: { 
      icon: <TvIcon className="h-5 w-5 text-gray-500" />, 
      label: 'TV' 
    },
    washer: { 
      icon: <BeakerIcon className="h-5 w-5 text-gray-500" />, 
      label: 'Washer' 
    },
    dryer: { 
      icon: <BeakerIcon className="h-5 w-5 text-gray-500" />, 
      label: 'Dryer' 
    },
    parking: { 
      icon: <KeyIcon className="h-5 w-5 text-gray-500" />, 
      label: 'Free parking' 
    },
    elevator: { 
      icon: <ArrowsUpDownIcon className="h-5 w-5 text-gray-500" />, 
      label: 'Elevator' 
    },
    pool: { 
      icon: <SwimmingPoolIcon className="h-5 w-5 text-gray-500" />, 
      label: 'Swimming pool' 
    },
    hot_tub: { 
      icon: <HeartIcon className="h-5 w-5 text-gray-500" />, 
      label: 'Hot tub' 
    },
    gym: { 
      icon: <MusicalNoteIcon className="h-5 w-5 text-gray-500" />, 
      label: 'Gym' 
    },
    breakfast: { 
      icon: <CakeIcon className="h-5 w-5 text-gray-500" />, 
      label: 'Breakfast' 
    },
    workspace: { 
      icon: <ComputerDesktopIcon className="h-5 w-5 text-gray-500" />, 
      label: 'Dedicated workspace' 
    },
    fireplace: { 
      icon: <FireplaceIcon className="h-5 w-5 text-gray-500" />, 
      label: 'Fireplace' 
    },
    bbq: { 
      icon: <FireIcon className="h-5 w-5 text-gray-500" />, 
      label: 'BBQ grill' 
    },
    indoor_fireplace: { 
      icon: <FireplaceIcon className="h-5 w-5 text-gray-500" />, 
      label: 'Indoor fireplace' 
    },
    smoking_allowed: { 
      icon: <NoSymbolIcon className="h-5 w-5 text-gray-500" />, 
      label: 'Smoking allowed' 
    },
    pets_allowed: { 
      icon: <PawPrintIcon className="h-5 w-5 text-gray-500" />, 
      label: 'Pets allowed' 
    },
    events_allowed: { 
      icon: <UserGroupIcon className="h-5 w-5 text-gray-500" />, 
      label: 'Events allowed' 
    },
  };

  if (!amenities || amenities.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
        {amenities.map((amenity) => (
          <div key={amenity} className="flex items-center gap-2">
            {amenityDetails[amenity].icon}
            <span className="text-gray-700">{amenityDetails[amenity].label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
