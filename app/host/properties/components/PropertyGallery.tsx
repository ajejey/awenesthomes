'use client';

import { useState } from 'react';
import Image from 'next/image';

type PropertyImage = {
  url: string;
  caption?: string;
  isPrimary?: boolean;
};

type PropertyGalleryProps = {
  images: PropertyImage[];
};

export default function PropertyGallery({ images }: PropertyGalleryProps) {
  const [showAllImages, setShowAllImages] = useState(false);
  const [selectedImage, setSelectedImage] = useState<PropertyImage | null>(null);
  
  // Find primary image or use first image
  const primaryImage = images.find(img => img.isPrimary) || images[0];
  const otherImages = images.filter(img => img !== primaryImage).slice(0, 4);
  
  return (
    <>
      <div className="relative">
        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
          {/* Main/Primary Image */}
          <div 
            className="md:col-span-2 md:row-span-2 relative h-64 cursor-pointer overflow-hidden"
            onClick={() => setSelectedImage(primaryImage)}
          >
            <Image
              src={primaryImage?.url || '/placeholder-property.jpg'}
              alt={primaryImage?.caption || 'Property image'}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover hover:scale-105 transition-transform duration-300"
              priority
            />
          </div>
          
          {/* Other Images */}
          {otherImages.map((image, index) => (
            <div 
              key={index}
              className="relative h-40 cursor-pointer overflow-hidden hidden md:block"
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image.url}
                alt={image.caption || `Property image ${index + 2}`}
                fill
                sizes="25vw"
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
          
          {/* Show all images button */}
          {images.length > 5 && (
            <div 
              className="absolute bottom-4 right-4 z-10"
              onClick={() => setShowAllImages(true)}
            >
              <button className="bg-white text-gray-800 px-4 py-2 rounded-lg shadow-md text-sm font-medium hover:bg-gray-100 transition-colors">
                Show all photos ({images.length})
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Full Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="relative h-[80vh]">
              <Image
                src={selectedImage.url}
                alt={selectedImage.caption || 'Property image'}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </div>
            
            {selectedImage.caption && (
              <div className="absolute bottom-4 left-0 right-0 text-center text-white bg-black bg-opacity-50 py-2">
                {selectedImage.caption}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* All Images Modal */}
      {showAllImages && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-xl font-semibold">All Photos ({images.length})</h3>
            <button
              onClick={() => setShowAllImages(false)}
              className="text-gray-600 hover:text-gray-900"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative h-64 md:h-80">
                <Image
                  src={image.url}
                  alt={image.caption || `Property image ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover rounded-lg"
                />
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg">
                    {image.caption}
                  </div>
                )}
                {image.isPrimary && (
                  <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    Primary
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
