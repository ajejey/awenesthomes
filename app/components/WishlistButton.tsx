'use client';

import React, { useState } from 'react';

interface WishlistButtonProps {
  propertyId: string;
}

export default function WishlistButton({ propertyId }: WishlistButtonProps) {
  const [isSaved, setIsSaved] = useState(false);
  
  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    setIsSaved(!isSaved);
    
    // In a real implementation, this would call a server action to save/unsave
    console.log(`Property ${propertyId} ${isSaved ? 'removed from' : 'added to'} wishlist`);
  };
  
  return (
    <button 
      onClick={toggleSave}
      className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white z-10"
      aria-label={isSaved ? "Remove from wishlist" : "Save to wishlist"}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill={isSaved ? "currentColor" : "none"}
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={`w-5 h-5 ${isSaved ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    </button>
  );
}
