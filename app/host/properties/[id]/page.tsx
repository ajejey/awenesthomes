import { notFound } from 'next/navigation';
import { getPropertyById } from './actions';
import PropertyDetails from '@/app/host/properties/components/PropertyDetails';
import { requireAuth } from '@/app/auth';
import { Suspense } from 'react';
import PropertyDetailsSkeleton from '@/app/host/properties/components/PropertyDetailsSkeleton';

export default async function HostPropertyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // Require authentication and ensure user is a host
  const user = await requireAuth(['host' as const]);
  
  try {
    // Fetch property data
    const property = await getPropertyById(params.id);
    // Ensure the property exists and belongs to the current user
    if (!property || (property.hostId._id.toString() != user.id)) {
      return notFound();
    }
    
    return (
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<PropertyDetailsSkeleton />}>
          <PropertyDetails property={property} />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Error fetching property:', error);
    return notFound();
  }
}
