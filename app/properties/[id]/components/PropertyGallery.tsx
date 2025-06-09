'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { XMarkIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface PropertyImage {
  url: string;
  caption?: string;
  isPrimary?: boolean;
}

interface PropertyGalleryProps {
  images: PropertyImage[];
}

export default function PropertyGallery({ images }: PropertyGalleryProps) {
  const [showAllImages, setShowAllImages] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Handle gallery modal open/close
  const openGallery = (index: number) => {
    setCurrentImageIndex(index);
    setShowAllImages(true);
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };
  
  const closeGallery = () => {
    setShowAllImages(false);
    // Re-enable scrolling
    document.body.style.overflow = 'auto';
  };
  
  // Handle navigation
  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };
  
  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };
  
  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showAllImages) return;
      
      if (e.key === 'Escape') {
        closeGallery();
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showAllImages]);
  
  // If no images, show placeholder
  if (!images || images.length === 0) {
    return (
      <div className="aspect-[16/9] bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">No images available</span>
      </div>
    );
  }
  
  // If only one image, show it full width
  if (images.length === 1) {
    return (
      <div 
        className="relative aspect-[16/9] rounded-lg overflow-hidden cursor-pointer"
        onClick={() => openGallery(0)}
      >
        <Image
          src={images[0].url}
          alt={images[0].caption || 'Property image'}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority
        />
      </div>
    );
  }
  
  return (
    <>
      {/* Gallery grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 rounded-lg overflow-hidden">
        {/* Main image (larger) */}
        <div 
          className="relative aspect-square md:aspect-auto md:row-span-2 md:col-span-2 cursor-pointer"
          onClick={() => openGallery(0)}
        >
          <Image
            src={images[0].url}
            alt={images[0].caption || 'Main property image'}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority
          />
        </div>
        
        {/* Secondary images (smaller) */}
        {images.slice(1, 5).map((image, index) => (
          <div 
            key={index}
            className="relative aspect-square cursor-pointer hidden md:block"
            onClick={() => openGallery(index + 1)}
          >
            <Image
              src={image.url}
              alt={image.caption || `Property image ${index + 2}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 20vw"
              className="object-cover"
            />
            
            {/* Show "See all photos" button on the last visible image if there are more than 5 */}
            {index === 3 && images.length > 5 && (
              <div 
                className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  openGallery(0);
                }}
              >
                <span className="text-white font-medium">See all {images.length} photos</span>
              </div>
            )}
          </div>
        ))}
        
        {/* Mobile gallery (show only first image and a button to see all) */}
        <div className="md:hidden mt-2">
          <button
            onClick={() => openGallery(0)}
            className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            See all {images.length} photos
          </button>
        </div>
      </div>
      
      {/* Full screen gallery modal */}
      {showAllImages && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col">
          {/* Header with close button */}
          <div className="flex justify-between items-center p-4 text-white">
            <span className="text-sm">
              {currentImageIndex + 1} / {images.length}
            </span>
            <button
              onClick={closeGallery}
              className="p-2 rounded-full hover:bg-gray-800 focus:outline-none"
              aria-label="Close gallery"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          {/* Main image container */}
          <div className="flex-1 flex items-center justify-center relative">
            {/* Previous button */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 focus:outline-none"
              aria-label="Previous image"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            
            {/* Image */}
            <div className="relative h-full w-full max-w-4xl max-h-[80vh] mx-auto">
              <Image
                src={images[currentImageIndex].url}
                alt={images[currentImageIndex].caption || `Property image ${currentImageIndex + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
            
            {/* Next button */}
            <button
              onClick={goToNext}
              className="absolute right-4 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 focus:outline-none"
              aria-label="Next image"
            >
              <ArrowRightIcon className="h-6 w-6" />
            </button>
          </div>
          
          {/* Caption */}
          {images[currentImageIndex].caption && (
            <div className="p-4 text-center text-white">
              <p>{images[currentImageIndex].caption}</p>
            </div>
          )}
          
          {/* Thumbnails */}
          <div className="p-4 overflow-x-auto">
            <div className="flex space-x-2">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`relative w-16 h-16 flex-shrink-0 cursor-pointer ${
                    index === currentImageIndex ? 'ring-2 ring-white' : ''
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <Image
                    src={image.url}
                    alt={image.caption || `Thumbnail ${index + 1}`}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
