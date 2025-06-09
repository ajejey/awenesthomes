'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

interface Review {
  _id: string;
  propertyId: string;
  userId: {
    _id: string;
    name: string;
    profileImage?: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

interface PropertyReviewsProps {
  propertyId: string;
}

export default function PropertyReviews({ propertyId }: PropertyReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  
  // Fetch reviews
  // useEffect(() => {
  //   const fetchReviews = async () => {
  //     try {
  //       setLoading(true);
        
  //       // In a real implementation, this would fetch reviews from the server
  //       // For now, we'll simulate a response with mock data
  //       await new Promise(resolve => setTimeout(resolve, 1000));
        
  //       // Mock reviews data
  //       const mockReviews = [
  //         {
  //           _id: '1',
  //           propertyId,
  //           userId: {
  //             _id: 'user1',
  //             name: 'Rahul Sharma',
  //             profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
  //           },
  //           rating: 5,
  //           comment: 'Amazing property! The location was perfect and the amenities were exactly as described. The host was very responsive and helpful throughout our stay. Would definitely recommend!',
  //           createdAt: '2025-05-15T10:30:00.000Z',
  //         },
  //         {
  //           _id: '2',
  //           propertyId,
  //           userId: {
  //             _id: 'user2',
  //             name: 'Priya Patel',
  //             profileImage: 'https://randomuser.me/api/portraits/women/44.jpg',
  //           },
  //           rating: 4,
  //           comment: 'Great place to stay. Clean, comfortable, and convenient. The only issue was that the WiFi was a bit slow at times, but overall we had a wonderful experience.',
  //           createdAt: '2025-05-01T14:20:00.000Z',
  //         },
  //         {
  //           _id: '3',
  //           propertyId,
  //           userId: {
  //             _id: 'user3',
  //             name: 'Vikram Singh',
  //           },
  //           rating: 5,
  //           comment: 'Excellent property and host! Everything was perfect from check-in to check-out. The place was spotless and had all the amenities we needed. The location was also great, with many restaurants and shops within walking distance.',
  //           createdAt: '2025-04-22T09:15:00.000Z',
  //         },
  //         {
  //           _id: '4',
  //           propertyId,
  //           userId: {
  //             _id: 'user4',
  //             name: 'Ananya Desai',
  //             profileImage: 'https://randomuser.me/api/portraits/women/22.jpg',
  //           },
  //           rating: 4,
  //           comment: 'We had a pleasant stay at this property. The host was very accommodating and the place was clean and comfortable. The only reason I\'m giving 4 stars instead of 5 is because the air conditioning wasn\'t working properly during our stay, but the host did provide fans which helped.',
  //           createdAt: '2025-04-10T16:45:00.000Z',
  //         },
  //         {
  //           _id: '5',
  //           propertyId,
  //           userId: {
  //             _id: 'user5',
  //             name: 'Arjun Reddy',
  //             profileImage: 'https://randomuser.me/api/portraits/men/67.jpg',
  //           },
  //           rating: 5,
  //           comment: 'One of the best stays I\'ve had! The property was exactly as described, and the host went above and beyond to make our stay comfortable. The kitchen was well-equipped, and the beds were very comfortable. Highly recommend!',
  //           createdAt: '2025-03-28T11:30:00.000Z',
  //         },
  //         {
  //           _id: '6',
  //           propertyId,
  //           userId: {
  //             _id: 'user6',
  //             name: 'Meera Joshi',
  //           },
  //           rating: 3,
  //           comment: 'The property was okay. It was clean and had the basic amenities, but it wasn\'t as spacious as it appeared in the photos. The location was good though, and the host was responsive to our queries.',
  //           createdAt: '2025-03-15T13:20:00.000Z',
  //         },
  //       ];
        
  //       setReviews(mockReviews);
  //     } catch (err) {
  //       console.error('Error fetching reviews:', err);
  //       setError('Failed to load reviews');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
    
  //   fetchReviews();
  // }, [propertyId]);
  
  // Calculate average rating
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;
  
  // Render star rating
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {star <= rating ? (
              <StarIcon className="h-4 w-4 text-yellow-500" />
            ) : (
              <StarOutlineIcon className="h-4 w-4 text-yellow-500" />
            )}
          </span>
        ))}
      </div>
    );
  };
  
  // Display only first 3 reviews initially
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);
  
  // If loading, show skeleton
  if (loading) {
    return (
      <div className="border-b border-gray-200 pb-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Reviews</h2>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex">
                <div className="h-10 w-10 bg-gray-200 rounded-full mr-4"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  // If error, show error message
  if (error) {
    return (
      <div className="border-b border-gray-200 pb-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Reviews</h2>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">
                {error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // If no reviews, show message
  if (reviews.length === 0) {
    return (
      <div className="border-b border-gray-200 pb-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Reviews</h2>
        <p className="text-gray-600">No reviews yet for this property.</p>
      </div>
    );
  }
  
  return (
    <div className="border-b border-gray-200 pb-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Reviews</h2>
      
      {/* Average rating */}
      <div className="flex items-center mb-6">
        <div className="flex items-center">
          <StarIcon className="h-5 w-5 text-yellow-500 mr-1" />
          <span className="font-medium text-gray-900">{averageRating.toFixed(1)}</span>
        </div>
        <span className="mx-2 text-gray-500">•</span>
        <span className="text-gray-600">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
      </div>
      
      {/* Reviews list */}
      <div className="space-y-6">
        {displayedReviews.map((review) => (
          <div key={review._id} className="flex">
            {/* User avatar */}
            <div className="flex-shrink-0 mr-4">
              {review.userId.profileImage ? (
                <Image
                  src={review.userId.profileImage}
                  alt={review.userId.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-sm font-medium">
                    {review.userId.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            
            {/* Review content */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                <h3 className="text-gray-900 font-medium">{review.userId.name}</h3>
                <span className="text-gray-500 text-sm">
                  {format(parseISO(review.createdAt), 'MMMM yyyy')}
                </span>
              </div>
              
              {/* Star rating */}
              <div className="mb-2">
                {renderStarRating(review.rating)}
              </div>
              
              {/* Review comment */}
              <p className="text-gray-700">{review.comment}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Show more/less button */}
      {/* {reviews.length > 3 && (
        <button
          onClick={() => setShowAllReviews(!showAllReviews)}
          className="mt-6 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {showAllReviews ? 'Show less reviews' : `Show all ${reviews.length} reviews`}
        </button>
      )} */}
    </div>
  );
}
