import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Import components
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import CategoryFilter from './components/CategoryFilter';
import PropertyCard from './components/PropertyCard';
import Footer from './components/Footer';

// Import server actions
import { getFeaturedProperties, searchProperties } from './actions';

// Import types
import { IPropertyCard } from '@/types';

// Import icons
import { 
  BuildingOfficeIcon,
  HomeIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
  BuildingStorefrontIcon,
  BuildingOffice2Icon,
  AcademicCapIcon,
 
} from '@heroicons/react/24/outline';
import { Building, Building2Icon, ShipWheelIcon } from 'lucide-react';

// Data for categories
const categories = [
  { id: 'apartments', name: 'Apartments', icon: <BuildingOfficeIcon className="h-6 w-6" /> },
  { id: 'houses', name: 'Independent Houses', icon: <HomeIcon className="h-6 w-6" /> },
  { id: 'villas', name: 'Villas', icon: <BanknotesIcon className="h-6 w-6" /> },
  { id: 'farmhouses', name: 'Farmhouses', icon: <BuildingLibraryIcon className="h-6 w-6" /> },
  { id: 'bungalows', name: 'Bungalows', icon: <BuildingStorefrontIcon className="h-6 w-6" /> },
  { id: 'cottages', name: 'Cottages', icon: <BuildingOffice2Icon className="h-6 w-6" /> },
  { id: 'guesthouses', name: 'Guest Houses', icon: <AcademicCapIcon className="h-6 w-6" /> },
  { id: 'boathouses', name: 'Boathouses', icon: <ShipWheelIcon className="h-6 w-6" /> },
  { id: 'studio', name: 'Studio Apartments', icon: <Building2Icon className="h-6 w-6" /> },
  { id: 'penthouses', name: 'Penthouses', icon: <Building className="h-6 w-6" /> },
];



export default async function HomePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const {location, checkIn, checkOut, guests, category} = await searchParams;
  
  // Check if we have any search parameters
  const hasSearchParams = location || checkIn || checkOut || guests || category;
  
  // Fetch properties based on search parameters or featured properties if no search
  const properties = hasSearchParams 
    ? await searchProperties(location, checkIn, checkOut, guests, category)
    : await getFeaturedProperties();
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      {/* Hero Section with Search */}
      <section id="search-section" className="pt-8 pb-6 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Find your perfect getaway</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">Discover unique stays across India to live, work, or just relax.</p>
          </div>
          
          <SearchBar />
        </div>
      </section>
      
      {/* Category Filter */}
      <section className="py-6 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <CategoryFilter categories={categories} />
        </div>
      </section>
      
      {/* Properties Section */}
      <section className="py-12 px-4 md:px-8 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">
              {hasSearchParams ? 'Search Results' : 'Featured Properties'}
            </h2>
          </div>

          {properties.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">
                {hasSearchParams 
                  ? 'No properties match your search criteria' 
                  : 'No properties found'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {properties.map((property) => (
                <PropertyCard 
                  key={property._id} 
                  _id={property._id}
                  title={property.title}
                  location={property.location}
                  price={property.price}
                  rating={property.rating}
                  imageUrl={property.imageUrl}
                  host={property.host}
                />
              ))}
            </div>
          )}
          
          {!hasSearchParams && properties.length > 0 && (
            <div className="mt-12 text-center">
              <Link href="/?showAll=true" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300 shadow-sm">
                Show more properties
              </Link>
            </div>
          )}
        </div>
      </section>
      
      {/* Experience Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Experience the extraordinary</h2>
              <p className="text-gray-600 mb-6">Unique activities hosted by locals across India, created for the curious.</p>
              <Link href="/experiences" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300 shadow-sm">
                Explore experiences
              </Link>
            </div>
            
            <div className="md:w-1/2 relative h-80 w-full rounded-2xl overflow-hidden">
              <Image 
                src="https://images.unsplash.com/photo-1506461883276-594a12b11cf3?q=80&w=1470&auto=format&fit=crop"
                alt="Experience India" 
                fill 
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Hosting Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Become a host</h2>
              <p className="text-gray-600 mb-6">Earn extra income and unlock new opportunities by sharing your space with travelers from around the world.</p>
              <Link href="/host" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300 shadow-sm">
                Learn more
              </Link>
            </div>
            
            <div className="md:w-1/2 relative h-80 w-full rounded-2xl overflow-hidden">
              <Image 
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1470&auto=format&fit=crop"
                alt="Become a host" 
                fill 
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}


