'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';

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
      <div className="flex justify-center space-x-8 px-4 min-w-max">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`flex flex-col items-center space-y-2 pb-2 border-b-2 transition-colors ${
              selectedCategory === category.id 
                ? 'border-gray-900 text-gray-900' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            <div className="relative w-6 h-6">
              {category.icon}
            </div>
            <span className="text-xs font-medium">{category.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
