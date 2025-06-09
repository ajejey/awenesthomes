import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IPropertyCard } from '@/types';
import WishlistButton from './WishlistButton';

type PropertyCardProps = IPropertyCard & {
  distance?: string;
  dates?: string;
  showHost?: boolean;
};

export default function PropertyCard({
  _id,
  title,
  location,
  price,
  rating,
  imageUrl,
  host,
  distance,
  dates,
  showHost = true
}: PropertyCardProps) {
  return (
    <Link href={`/properties/${_id}`} className="group block">
      <div className="group cursor-pointer">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl">
        <Image
          src={imageUrl.url}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <WishlistButton propertyId={_id} />
      </div>
      
      <div className="mt-3">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-gray-900 truncate">{title}</h3>
          <div className="flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="w-4 h-4 text-gray-900"
            >
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
            </svg>
            <span className="ml-1 text-sm text-gray-900">{rating}</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm truncate">{location}</p>
        {showHost && host?.name && <p className="text-gray-600 text-sm">Hosted by {host.name}</p>}
        {distance && <p className="text-gray-600 text-sm">{distance} away</p>}
        {dates && <p className="text-gray-600 text-sm">{dates}</p>}
        <p className="mt-1"><span className="font-semibold text-gray-900">₹{price}</span> <span className="text-gray-900">night</span></p>
      </div>
      </div>
    </Link>
  );
}
