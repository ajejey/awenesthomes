'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMediaQuery } from '@/app/hooks/useMediaQuery';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface CategoryFilterProps {
  categories: Category[];
  onSelectCategory?: (categoryId: string) => void;
}

export default function CategoryFilter({ categories, onSelectCategory }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Initialize selected category from URL params on component mount
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  const handleCategoryClick = (categoryId: string) => {
    const newSelected = selectedCategory === categoryId ? null : categoryId;
    setSelectedCategory(newSelected);
    
    // Update URL with the selected category
    const params = new URLSearchParams(searchParams.toString());
    
    if (newSelected) {
      params.set('category', newSelected);
    } else {
      params.delete('category');
    }
    
    // Update URL without full page refresh
    router.push(`/?${params.toString()}`, { scroll: false });
    
    // Call the callback if provided
    if (onSelectCategory) {
      onSelectCategory(newSelected || '');
    }
  };

  return (
    <div className="w-full overflow-x-auto pb-4 hide-scrollbar">
      <div className="max-w-6xl mx-auto">
        <div 
          className="flex justify-center px-4 min-w-max"
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`group flex flex-col items-center transition-all duration-200 ease-in-out ${isMobile ? 'py-3 w-20 mx-2' : 'py-4 w-24 mx-3'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Icon Container */}
              <div 
                className={`
                  relative mb-2 rounded-full flex items-center justify-center
                  ${isMobile ? 'w-14 h-14' : 'w-16 h-16'}
                  ${selectedCategory === category.id 
                    ? 'bg-gray-900 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'}
                  transition-all duration-200
                `}
              >
                <div className={`${isMobile ? 'w-6 h-6' : 'w-7 h-7'}`}>
                  {category.icon}
                </div>
              </div>
              
              {/* Category Name */}
              <span 
                className={`
                  text-center font-medium transition-colors duration-200 w-full truncate
                  ${isMobile ? 'text-xs' : 'text-sm'}
                  ${selectedCategory === category.id 
                    ? 'text-gray-900' 
                    : 'text-gray-500 group-hover:text-gray-700'}
                `}
                title={category.name} // Show full name on hover
              >
                {category.name}
              </span>
              
              {/* Active Indicator Dot */}
              {selectedCategory === category.id && (
                <motion.div 
                  className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
